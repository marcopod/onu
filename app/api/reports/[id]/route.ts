import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { getHarassmentReportById, updateHarassmentReportStatus } from '@/lib/db';
import { ApiResponse } from '@/lib/types';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Get current user
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Authentication required'
      }, { status: 401 });
    }

    const reportId = parseInt(params.id);
    if (isNaN(reportId)) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Invalid report ID'
      }, { status: 400 });
    }

    // Check if user is admin
    const isAdmin = user.email?.includes('admin') || false;

    // Get the report
    const report = await getHarassmentReportById(reportId, user.id, isAdmin);

    if (!report) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Report not found or access denied'
      }, { status: 404 });
    }

    return NextResponse.json<ApiResponse>({
      success: true,
      data: { report, isAdmin },
      message: 'Report retrieved successfully'
    });

  } catch (error: any) {
    console.error('Get report error:', error);
    return NextResponse.json<ApiResponse>({
      success: false,
      error: error.message || 'Failed to retrieve report'
    }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Get current user
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Authentication required'
      }, { status: 401 });
    }

    const reportId = parseInt(params.id);
    if (isNaN(reportId)) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Invalid report ID'
      }, { status: 400 });
    }

    // Check if user is admin
    const isAdmin = user.email?.includes('admin') || false;

    if (!isAdmin) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Admin access required'
      }, { status: 403 });
    }

    const { status } = await request.json();

    if (!status || !['pending', 'reviewed', 'resolved', 'dismissed'].includes(status)) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Invalid status. Must be one of: pending, reviewed, resolved, dismissed'
      }, { status: 400 });
    }

    // Update the report status
    const updatedReport = await updateHarassmentReportStatus(reportId, status, user.id, isAdmin);

    if (!updatedReport) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Report not found'
      }, { status: 404 });
    }

    return NextResponse.json<ApiResponse>({
      success: true,
      data: { report: updatedReport },
      message: 'Report status updated successfully'
    });

  } catch (error: any) {
    console.error('Update report error:', error);
    return NextResponse.json<ApiResponse>({
      success: false,
      error: error.message || 'Failed to update report'
    }, { status: 500 });
  }
}

// Handle OPTIONS for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
