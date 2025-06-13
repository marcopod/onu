import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { searchUsers } from '@/lib/db';
import { ApiResponse } from '@/lib/types';

export async function GET(request: NextRequest) {
  try {
    // Get current user
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Authentication required'
      }, { status: 401 });
    }

    // Get search query from URL parameters
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    if (!query || query.trim().length < 2) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Search query must be at least 2 characters long'
      }, { status: 400 });
    }

    // Search for users
    const users = await searchUsers(query.trim(), user.id);

    return NextResponse.json<ApiResponse>({
      success: true,
      data: { users },
      message: 'Users found successfully'
    });

  } catch (error: any) {
    console.error('User search error:', error);
    return NextResponse.json<ApiResponse>({
      success: false,
      error: error.message || 'Failed to search users'
    }, { status: 500 });
  }
}

// Handle OPTIONS for CORS
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
