import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

// Load environment variables if not in Next.js runtime
if (typeof window === 'undefined' && !process.env.NEXT_RUNTIME) {
  require('dotenv').config({ path: '.env.local' });
}
// Force use of real database for registration data
let dbModule;
try {
  // Check if we have database environment variables
  const hasPostgresUrl = process.env.POSTGRES_URL || process.env.DATABASE_URL;

  if (hasPostgresUrl) {
    // Always use real database when URL is available
    console.log('Using real PostgreSQL database for auth operations');
    dbModule = require('./db');
  } else {
    // No database configured, use mock
    console.log('No database URL configured, using mock database');
    dbModule = require('./mock-db');
  }
} catch (error) {
  console.log('Database connection failed, using mock database for development:', error.message);
  dbModule = require('./mock-db');
}

const {
  createUser,
  getUserByEmail,
  getUserById,
  updateUserLastLogin,
  createSession,
  getActiveSession,
  invalidateSession,
  invalidateAllUserSessions
} = dbModule;

// Environment variables
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';
const COOKIE_NAME = 'auth-token';

// Password validation
export function validatePassword(password: string) {
  const minLength = password.length >= 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  return {
    isValid: minLength && hasUpperCase && hasLowerCase && hasNumbers,
    hasMinLength: minLength,
    hasUpperCase,
    hasLowerCase,
    hasNumbers,
    hasSpecialChar,
    score: [minLength, hasUpperCase, hasLowerCase, hasNumbers, hasSpecialChar].filter(Boolean).length
  };
}

// Email validation
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Hash password
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12;
  return bcrypt.hash(password, saltRounds);
}

// Verify password
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

// Generate JWT token
export function generateToken(payload: any): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

// Verify JWT token
export function verifyToken(token: string): any {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

// Hash token for database storage (using consistent hashing)
export async function hashToken(token: string): Promise<string> {
  // Use crypto for consistent hashing instead of bcrypt (which uses random salts)
  const crypto = require('crypto');
  return crypto.createHash('sha256').update(token).digest('hex');
}

// Register user
export async function registerUser(userData: {
  email: string;
  password: string;
  fullName: string;
}) {
  const { email, password, fullName } = userData;

  // Validate input
  if (!validateEmail(email)) {
    throw new Error('Invalid email format');
  }

  const passwordValidation = validatePassword(password);
  if (!passwordValidation.isValid) {
    throw new Error('Password does not meet requirements');
  }

  if (fullName.length < 2) {
    throw new Error('Full name must be at least 2 characters');
  }

  // Check if user already exists
  const existingUser = await getUserByEmail(email);
  if (existingUser) {
    throw new Error('User already exists with this email');
  }

  // Hash password and create user
  const passwordHash = await hashPassword(password);
  const user = await createUser({
    email,
    passwordHash,
    fullName
  });

  return user;
}

// Login user
export async function loginUser(email: string, password: string) {
  // Validate input
  if (!validateEmail(email)) {
    throw new Error('Invalid email format');
  }

  if (!password) {
    throw new Error('Password is required');
  }

  // Get user from database
  const user = await getUserByEmail(email);
  if (!user) {
    throw new Error('Invalid email or password');
  }

  // Verify password
  const isValidPassword = await verifyPassword(password, user.password_hash);
  if (!isValidPassword) {
    throw new Error('Invalid email or password');
  }

  // Update last login
  await updateUserLastLogin(user.id);

  // Generate JWT token
  const token = generateToken({
    userId: user.id,
    email: user.email,
    fullName: user.full_name
  });

  // Hash token for database storage
  const tokenHash = await hashToken(token);
  console.log('Creating session with token hash:', tokenHash);

  // Create session in database
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7); // 7 days from now

  await createSession(user.id, tokenHash, expiresAt);
  console.log('Session created successfully');

  return {
    user: {
      id: user.id,
      email: user.email,
      fullName: user.full_name,
      isVerified: user.is_verified
    },
    token
  };
}

// Get current user from token
export async function getCurrentUser(token?: string) {
  console.log('=== getCurrentUser DEBUG ===');

  if (!token) {
    const cookieStore = await cookies();
    token = cookieStore.get(COOKIE_NAME)?.value;
    console.log('Token from cookie:', token ? 'PRESENT' : 'MISSING');
  } else {
    console.log('Token provided:', 'PRESENT');
  }

  if (!token) {
    console.log('No token available');
    return null;
  }

  // Verify JWT token
  const decoded = verifyToken(token);
  console.log('Token decoded:', decoded ? 'SUCCESS' : 'FAILED');
  if (!decoded) {
    return null;
  }

  // Check if session exists and is active
  const tokenHash = await hashToken(token);
  console.log('Token hash for lookup:', tokenHash);
  const session = await getActiveSession(tokenHash);
  console.log('Session found:', session ? 'YES' : 'NO');

  if (!session) {
    return null;
  }

  // Get fresh user data
  const user = await getUserById(decoded.userId);
  console.log('User found:', user ? 'YES' : 'NO');
  if (!user) {
    return null;
  }

  const result = {
    id: user.id,
    email: user.email,
    fullName: user.full_name,
    isVerified: user.is_verified,
    lastLogin: user.last_login
  };

  console.log('getCurrentUser result:', result);
  console.log('========================');
  return result;
}

// Logout user
export async function logoutUser(token?: string) {
  if (!token) {
    const cookieStore = await cookies();
    token = cookieStore.get(COOKIE_NAME)?.value;
  }

  if (token) {
    const tokenHash = await hashToken(token);
    await invalidateSession(tokenHash);
  }
}

// Logout all sessions for a user
export async function logoutAllSessions(userId: number) {
  await invalidateAllUserSessions(userId);
}

// Set auth cookie
export async function setAuthCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60, // 7 days
    path: '/'
  });
}

// Clear auth cookie
export async function clearAuthCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

// Middleware helper to check authentication
export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error('Authentication required');
  }
  return user;
}

// Check if user is authenticated (for client-side)
export async function isAuthenticated(): Promise<boolean> {
  try {
    const user = await getCurrentUser();
    return !!user;
  } catch {
    return false;
  }
}
