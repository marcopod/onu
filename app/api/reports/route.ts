import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { createHarassmentReport, getHarassmentReports } from '@/lib/db';
import { CreateReportData, ApiResponse } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    // Get current user
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Authentication required'
      }, { status: 401 });
    }

    const reportData: CreateReportData = await request.json();

    // Validate required fields
    if (!reportData.category || !reportData.description) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Category and description are required'
      }, { status: 400 });
    }

    if (reportData.description.length < 50) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Description must be at least 50 characters long'
      }, { status: 400 });
    }

    // Create the report
    const report = await createHarassmentReport({
      reporterId: user.id,
      reportedUserId: reportData.reportedUserId,
      reportedUserName: reportData.reportedUserName,
      category: reportData.category,
      subcategory: reportData.subcategory,
      description: reportData.description,
      location: reportData.location,
      incidentDate: reportData.incidentDate,
      isPublic: reportData.isPublic || false,
      evidenceFiles: reportData.evidenceFiles
    });

    return NextResponse.json<ApiResponse>({
      success: true,
      data: { report },
      message: 'Report created successfully'
    });

  } catch (error: any) {
    console.error('Create report error:', error);
    return NextResponse.json<ApiResponse>({
      success: false,
      error: error.message || 'Failed to create report'
    }, { status: 500 });
  }
}

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

    // Check if user is admin (for now, we'll use a simple check - you can enhance this)
    const isAdmin = user.email?.includes('admin') || false; // Simple admin check

    // Get reports
    const reports = await getHarassmentReports(user.id, isAdmin);

    return NextResponse.json<ApiResponse>({
      success: true,
      data: { reports, isAdmin },
      message: 'Reports retrieved successfully'
    });

  } catch (error: any) {
    console.error('Get reports error:', error);
    return NextResponse.json<ApiResponse>({
      success: false,
      error: error.message || 'Failed to retrieve reports'
    }, { status: 500 });
  }
}

// Handle OPTIONS for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
