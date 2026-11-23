import { NextRequest, NextResponse } from 'next/server';
import { updateApplicationStatus, deleteApplication } from '@/lib/storage';
import { getAdminSession } from '@/lib/auth';
import { ApplicationStatus } from '@/types';

const VALID_STATUSES: ApplicationStatus[] = ['Pending', 'Shortlisted', 'Selected', 'Rejected'];

// PATCH: Update application status
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getAdminSession();
    if (!session?.isAuthenticated) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized. Admin authentication required.' },
        { status: 401 }
      );
    }

    const { id } = params;
    const body = await req.json().catch(() => null);
    const status = body?.status as ApplicationStatus;

    if (!status || !VALID_STATUSES.includes(status)) {
      return NextResponse.json(
        {
          success: false,
          error: `Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}`,
        },
        { status: 400 }
      );
    }

    const result = await updateApplicationStatus(id, status);
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error || 'Failed to update application.' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Status updated to ${status}`,
      application: result.application,
    });
  } catch (err: any) {
    console.error('API /api/applications/[id] PATCH error:', err);
    return NextResponse.json(
      { success: false, error: 'Internal server error.' },
      { status: 500 }
    );
  }
}

// DELETE: Remove application
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getAdminSession();
    if (!session?.isAuthenticated) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized. Admin authentication required.' },
        { status: 401 }
      );
    }

    const { id } = params;
    const result = await deleteApplication(id);
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error || 'Failed to delete application.' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Application deleted successfully.',
    });
  } catch (err: any) {
    console.error('API /api/applications/[id] DELETE error:', err);
    return NextResponse.json(
      { success: false, error: 'Internal server error.' },
      { status: 500 }
    );
  }
}
