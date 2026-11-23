import { NextRequest, NextResponse } from 'next/server';
import { getApplications } from '@/lib/storage';
import { getAdminSession } from '@/lib/auth';
import { formatToIST } from '@/lib/dateUtils';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const session = await getAdminSession();
    if (!session?.isAuthenticated) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized. Admin credentials required.' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const department = searchParams.get('department') || undefined;
    const status = searchParams.get('status') || undefined;
    const format = searchParams.get('format') || 'csv';

    const applications = await getApplications({
      department,
      status,
      sortOrder: 'desc',
    });

    // Generate CSV
    const headers = [
      'Application ID',
      'Full Name',
      'Roll Number',
      'Areas of Interest',
      'Status',
      'Submission Date (IST)',
    ];

    const rows = applications.map((app) => [
      `"${app.application_id}"`,
      `"${app.full_name.replace(/"/g, '""')}"`,
      `"${app.roll_number}"`,
      `"${app.areas_of_interest.join('; ')}"`,
      `"${app.application_status}"`,
      `"${formatToIST(app.created_at)}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    const filename = `CyberFest2027_Applications_${department || 'All'}_${status || 'All'}_${timestamp}.csv`;

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
  } catch (err: any) {
    console.error('Export error:', err);
    return NextResponse.json(
      { success: false, error: 'Failed to generate export file.' },
      { status: 500 }
    );
  }
}
