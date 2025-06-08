# Harassment Reporting PWA - Authentication System

This document provides setup instructions for the complete authentication system implemented for the harassment reporting PWA.

## 🚀 Features Implemented

### ✅ Database Setup & Hosting
- **Vercel Postgres** integration for production-ready database
- Complete database schema for user data and registration information
- Automatic table creation and initialization
- Support for all 5-screen registration form data

### ✅ Authentication Implementation
- **JWT-based authentication** with secure session management
- **Password hashing** using bcryptjs with salt rounds
- **Email validation** and strong password requirements
- **User registration** connecting all 5 registration screens
- **Secure login/logout** functionality
- **Session persistence** with HTTP-only cookies

### ✅ Database Integration
- **Complete API routes** for authentication operations
- **Data validation** matching registration form requirements
- **Error handling** with user-friendly messages
- **Type-safe** database operations with TypeScript

### ✅ Vercel Deployment Ready
- **Environment variables** configuration
- **Production-optimized** database connections
- **Middleware** for route protection
- **Client-side** authentication state management

## 📋 Database Schema

The system creates the following tables:

- `users` - Core user authentication data
- `user_profiles` - Personal information from registration
- `emergency_contacts` - Emergency contact information
- `physical_health` - Physical health data
- `medications` - Current medications
- `mental_health` - Mental health information
- `harassment_experiences` - Previous harassment incidents
- `evidence_files` - Evidence file references
- `user_sessions` - JWT session management

## 🛠️ Setup Instructions

### 1. Environment Variables

Create a `.env.local` file in the root directory:

```bash
# Copy from .env.example
cp .env.example .env.local
```

Configure the following variables:

```env
# Database (Vercel Postgres)
POSTGRES_URL="your-vercel-postgres-url"
POSTGRES_PRISMA_URL="your-vercel-postgres-prisma-url"
POSTGRES_URL_NO_SSL="your-vercel-postgres-no-ssl-url"
POSTGRES_URL_NON_POOLING="your-vercel-postgres-non-pooling-url"
POSTGRES_USER="your-postgres-user"
POSTGRES_HOST="your-postgres-host"
POSTGRES_PASSWORD="your-postgres-password"
POSTGRES_DATABASE="your-postgres-database"

# JWT Configuration
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
JWT_EXPIRES_IN="7d"

# Next.js
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-nextauth-secret"
NODE_ENV="development"
```

### 2. Database Setup

#### Option A: Vercel Postgres (Recommended for Production)

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Create a new project or select existing one
3. Go to Storage tab and create a Postgres database
4. Copy the connection strings to your `.env.local`

#### Option B: Local Development

For local development, you can use a local PostgreSQL instance:

```bash
# Install PostgreSQL locally
# Then create a database and update .env.local with local connection strings
```

### 3. Initialize Database

Run the database initialization script:

```bash
npm run init-db
```

This will create all necessary tables automatically.

### 4. Install Dependencies

```bash
npm install
```

### 5. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` to see the application.

## 🔐 Authentication Flow

### Registration Process

1. **Step 1**: User profile and authentication data
2. **Step 2**: Personal information and emergency contacts
3. **Step 3**: Physical health and medications
4. **Step 4**: Mental health information
5. **Step 5**: Previous harassment experiences (optional)
6. **Complete**: Automatic account creation and login

### Login Process

1. User enters email and password
2. Server validates credentials
3. JWT token generated and stored in HTTP-only cookie
4. User redirected to dashboard or intended page

### Route Protection

- **Protected routes**: `/profile`, `/report`, `/settings`, `/chat`, `/feedback`
- **Auth routes**: `/login`, `/register` (redirect if already authenticated)
- **Middleware**: Automatic redirection based on authentication status

## 🔧 API Endpoints

### Authentication

- `POST /api/auth/register` - Complete user registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user data

### Request/Response Examples

#### Registration
```javascript
POST /api/auth/register
{
  "step1": {
    "fullName": "John Doe",
    "email": "john@example.com",
    "password": "SecurePass123",
    "confirmPassword": "SecurePass123"
  },
  "step2": { /* personal info */ },
  "step3": { /* health info */ },
  "step4": { /* mental health */ },
  "step5": { /* experiences */ }
}
```

#### Login
```javascript
POST /api/auth/login
{
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

## 🚀 Deployment to Vercel

### 1. Connect Repository

1. Push your code to GitHub
2. Connect repository to Vercel
3. Configure environment variables in Vercel dashboard

### 2. Environment Variables in Vercel

Add all environment variables from `.env.local` to Vercel:

1. Go to Project Settings → Environment Variables
2. Add each variable from your `.env.local`
3. Make sure to use production database URLs

### 3. Deploy

```bash
# Automatic deployment on push to main branch
git push origin main
```

## 🔒 Security Features

- **Password hashing** with bcryptjs (12 salt rounds)
- **JWT tokens** with configurable expiration
- **HTTP-only cookies** for token storage
- **CSRF protection** through SameSite cookie settings
- **Input validation** on both client and server
- **SQL injection protection** through parameterized queries
- **Session management** with database tracking

## 🧪 Testing the Authentication

### Test User Registration

1. Go to `/register`
2. Complete all 5 steps of registration
3. Verify account creation and automatic login
4. Check database for stored user data

### Test User Login

1. Go to `/login`
2. Enter registered user credentials
3. Verify successful login and redirection
4. Test protected route access

### Test Route Protection

1. Try accessing `/profile` without login (should redirect to login)
2. Login and try accessing `/login` (should redirect to home)
3. Test logout functionality

## 🐛 Troubleshooting

### Database Connection Issues

- Verify environment variables are correct
- Check Vercel Postgres dashboard for connection strings
- Ensure database is accessible from your deployment region

### Authentication Issues

- Check JWT_SECRET is set and consistent
- Verify cookie settings for your domain
- Check browser developer tools for authentication errors

### Build Issues

- Ensure all dependencies are installed
- Check TypeScript errors with `npm run lint`
- Verify environment variables are set in Vercel

## 📚 Additional Resources

- [Vercel Postgres Documentation](https://vercel.com/docs/storage/vercel-postgres)
- [Next.js Authentication](https://nextjs.org/docs/authentication)
- [JWT Best Practices](https://auth0.com/blog/a-look-at-the-latest-draft-for-jwt-bcp/)

## 🤝 Support

If you encounter any issues with the authentication system, please check:

1. Environment variables are correctly set
2. Database is properly initialized
3. All dependencies are installed
4. Network connectivity to database

The authentication system is now fully functional and ready for production use!
