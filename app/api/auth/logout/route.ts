import { NextRequest, NextResponse } from 'next/server';
import { logoutUser, clearAuthCookie } from '@/lib/auth';
import { ApiResponse } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    // Get token from cookie or Authorization header
    const authHeader = request.headers.get('Authorization');
    const token = authHeader?.replace('Bearer ', '');

    // Logout user (invalidate session)
    await logoutUser(token);

    // Create response and clear cookie
    const response = NextResponse.json<ApiResponse>({
      success: true,
      message: 'Logout successful'
    });

    // Clear the cookie
    response.cookies.delete('auth-token');

    return response;

  } catch (error: any) {
    console.error('Logout error:', error);
    
    return NextResponse.json<ApiResponse>({
      success: false,
      error: 'Logout failed'
    }, { status: 500 });
  }
}

// Handle OPTIONS request for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
