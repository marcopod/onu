import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { ApiResponse } from '@/lib/types';

export async function GET(request: NextRequest) {
  try {
    // Get token from cookie or Authorization header
    const authHeader = request.headers.get('Authorization');
    const token = authHeader?.replace('Bearer ', '');

    // Get current user
    const user = await getCurrentUser(token);

    if (!user) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Not authenticated'
      }, { status: 401 });
    }

    return NextResponse.json<ApiResponse>({
      success: true,
      data: { user },
      message: 'User data retrieved successfully'
    });

  } catch (error: any) {
    console.error('Get user error:', error);
    
    return NextResponse.json<ApiResponse>({
      success: false,
      error: 'Failed to get user data'
    }, { status: 500 });
  }
}

// Handle OPTIONS request for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
