import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    // Get cookies
    const cookies = request.headers.get('cookie') || '';
    const authToken = request.cookies.get('auth-token')?.value;
    
    // Try to get current user
    let user = null;
    let error = null;
    
    try {
      user = await getCurrentUser();
    } catch (e: any) {
      error = e.message;
    }
    
    return NextResponse.json({
      success: true,
      data: {
        hasAuthToken: !!authToken,
        authTokenLength: authToken?.length || 0,
        cookiesReceived: cookies.length > 0,
        user: user,
        error: error,
        environment: {
          NODE_ENV: process.env.NODE_ENV,
          hasJwtSecret: !!process.env.JWT_SECRET,
          jwtSecretLength: process.env.JWT_SECRET?.length || 0
        }
      }
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack
    }, { status: 500 });
  }
}
