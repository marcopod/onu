import { NextRequest, NextResponse } from 'next/server';

export async function POST() {
  try {
    // Clear the mock database
    const { mockDb } = await import('@/lib/mock-db');
    mockDb.clearAllData();
    
    return NextResponse.json({
      success: true,
      message: 'Mock database cleared successfully'
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
