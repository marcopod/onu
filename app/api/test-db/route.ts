import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    // Test the mock database
    const { mockDb } = await import('@/lib/mock-db');
    
    // Initialize
    await mockDb.initializeDatabase();
    
    // Get debug info
    const debugInfo = mockDb.getDebugInfo();
    
    return NextResponse.json({
      success: true,
      message: 'Mock database is working',
      data: {
        ...debugInfo,
        environment: {
          NODE_ENV: process.env.NODE_ENV,
          hasPostgresUrl: !!process.env.POSTGRES_URL,
          hasJwtSecret: !!process.env.JWT_SECRET
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
