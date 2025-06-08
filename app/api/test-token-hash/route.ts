import { NextRequest, NextResponse } from 'next/server';
import { hashToken, generateToken } from '@/lib/auth';

export async function GET() {
  try {
    // Generate a test token
    const testToken = generateToken({ userId: 123, email: 'test@example.com' });
    
    // Hash it multiple times to verify consistency
    const hash1 = await hashToken(testToken);
    const hash2 = await hashToken(testToken);
    const hash3 = await hashToken(testToken);
    
    return NextResponse.json({
      success: true,
      data: {
        token: testToken,
        hash1,
        hash2,
        hash3,
        consistent: hash1 === hash2 && hash2 === hash3,
        tokenLength: testToken.length,
        hashLength: hash1.length
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
