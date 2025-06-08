import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Get all cookies from the request
    const cookies = request.headers.get('cookie') || '';
    const authToken = request.cookies.get('auth-token')?.value;
    
    return NextResponse.json({
      success: true,
      data: {
        hasCookieHeader: !!cookies,
        cookieHeader: cookies,
        hasAuthToken: !!authToken,
        authTokenLength: authToken?.length || 0,
        allCookies: Object.fromEntries(request.cookies.getAll().map(c => [c.name, c.value]))
      }
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    // Test setting a cookie
    const response = NextResponse.json({
      success: true,
      message: 'Test cookie set'
    });

    response.cookies.set('test-cookie', 'test-value', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60, // 1 hour
      path: '/'
    });

    return response;
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
