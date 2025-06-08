import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Get the mock database
    const { mockDb } = await import('@/lib/mock-db');
    
    // Get debug info
    const debugInfo = mockDb.getDebugInfo();
    
    // Get current cookie
    const authToken = request.cookies.get('auth-token')?.value;
    
    // Try to hash the current token if it exists
    let currentTokenHash = null;
    if (authToken) {
      const { hashToken } = await import('@/lib/auth');
      currentTokenHash = await hashToken(authToken);
    }
    
    return NextResponse.json({
      success: true,
      data: {
        debugInfo,
        hasAuthToken: !!authToken,
        authTokenLength: authToken?.length || 0,
        currentTokenHash,
        timestamp: new Date().toISOString()
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
