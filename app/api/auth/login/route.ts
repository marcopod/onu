import { NextRequest, NextResponse } from 'next/server';
import { loginUser, setAuthCookie } from '@/lib/auth';
import { initializeDatabase } from '@/lib/db';
import { LoginCredentials, ApiResponse } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    // Initialize database tables if they don't exist
    await initializeDatabase();

    const credentials: LoginCredentials = await request.json();
    
    // Validate input
    if (!credentials.email || !credentials.password) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Email and password are required'
      }, { status: 400 });
    }

    // Attempt to login user
    const { user, token } = await loginUser(credentials.email, credentials.password);

    // Create response with cookie
    const response = NextResponse.json<ApiResponse>({
      success: true,
      data: {
        user,
        token
      },
      message: 'Login successful'
    });

    // Set the cookie in the response
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/'
    });

    return response;

  } catch (error: any) {
    console.error('Login error:', error);
    
    // Return generic error message for security
    return NextResponse.json<ApiResponse>({
      success: false,
      error: error.message || 'Invalid email or password'
    }, { status: 401 });
  }
}

// Handle OPTIONS request for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
