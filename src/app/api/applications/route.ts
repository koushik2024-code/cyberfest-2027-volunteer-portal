import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
import {
  createApplication,
  getApplications,
  checkRollNumberExists,
  getSystemSettings,
} from '@/lib/storage';
import {
  validateFullName,
  validateRollNumber,
  validateAreasOfInterest,
} from '@/lib/validation';
import { checkRateLimit } from '@/lib/rateLimit';
import { getAdminSession } from '@/lib/auth';

// POST: Submit volunteer application
export async function POST(req: NextRequest) {
  try {
    // 1. Rate Limiting Protection (Max 6 requests per minute per IP)
    const ip = req.headers.get('x-forwarded-for') || req.ip || 'anonymous';
    const rateCheck = checkRateLimit(`submit_${ip}`, 6, 60 * 1000);
    if (!rateCheck.isAllowed) {
      return NextResponse.json(
        {
          success: false,
          error: `Rate limit exceeded. Please wait ${rateCheck.resetInSec} seconds before submitting again.`,
        },
        { status: 429 }
      );
    }

    // 2. Check if recruitment is open
    const settings = await getSystemSettings();
    if (!settings.is_open) {
      return NextResponse.json(
        {
          success: false,
          error: 'Volunteer recruitment for CyberFest 2027 is currently closed. Applications are no longer accepted.',
        },
        { status: 403 }
      );
    }

    // Check recruitment deadline if set
    if (settings.deadline) {
      const deadlineDate = new Date(settings.deadline);
      if (!isNaN(deadlineDate.getTime()) && Date.now() > deadlineDate.getTime()) {
        return NextResponse.json(
          {
            success: false,
            error: 'The recruitment deadline for CyberFest 2027 has passed.',
          },
          { status: 403 }
        );
      }
    }

    // 3. Parse JSON Body
    const body = await req.json().catch(() => null);
    if (!body) {
      return NextResponse.json(
        { success: false, error: 'Invalid or missing JSON payload.' },
        { status: 400 }
      );
    }

    const { fullName, rollNumber, areasOfInterest } = body;

    // 4. Strict Server-Side Validation
    const nameCheck = validateFullName(fullName);
    if (!nameCheck.isValid) {
      return NextResponse.json({ success: false, error: nameCheck.error }, { status: 400 });
    }

    const rollCheck = validateRollNumber(rollNumber);
    if (!rollCheck.isValid) {
      return NextResponse.json({ success: false, error: rollCheck.error }, { status: 400 });
    }

    const areasCheck = validateAreasOfInterest(areasOfInterest);
    if (!areasCheck.isValid || !areasCheck.cleanAreas) {
      return NextResponse.json({ success: false, error: areasCheck.error }, { status: 400 });
    }

    // 5. Duplicate Check
    const exists = await checkRollNumberExists(rollNumber);
    if (exists) {
      return NextResponse.json(
        {
          success: false,
          error: `An application with Roll Number '${rollNumber.trim().toUpperCase()}' has already been submitted. Multiple submissions for the same roll number are prohibited.`,
        },
        { status: 409 }
      );
    }

    // 6. Persist to Database
    const result = await createApplication({
      fullName: fullName.trim(),
      rollNumber: rollNumber.trim().toUpperCase(),
      areasOfInterest: areasCheck.cleanAreas,
    });

    if (!result.success || !result.application) {
      return NextResponse.json(
        { success: false, error: result.error || 'Failed to submit application. Please try again.' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Application submitted successfully!',
        application: {
          id: result.application.id,
          application_id: result.application.application_id,
          full_name: result.application.full_name,
          roll_number: result.application.roll_number,
          areas_of_interest: result.application.areas_of_interest,
          application_status: result.application.application_status,
          created_at: result.application.created_at,
        },
      },
      { status: 201 }
    );
  } catch (err: any) {
    console.error('API /api/applications POST Error:', err);
    return NextResponse.json(
      { success: false, error: 'Internal server error while processing application.' },
      { status: 500 }
    );
  }
}

// GET: Query applications (Requires Admin session for full list, or ref query for public verification)
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const ref = searchParams.get('ref');

    // Public reference inquiry
    if (ref) {
      const apps = await getApplications();
      const matched = apps.find(
        (a) =>
          a.application_id.toUpperCase() === ref.trim().toUpperCase() ||
          a.roll_number.toUpperCase() === ref.trim().toUpperCase()
      );

      if (!matched) {
        return NextResponse.json(
          { success: false, error: 'No application found matching this reference ID or roll number.' },
          { status: 404 }
        );
      }

      // Return public-safe application confirmation
      return NextResponse.json({
        success: true,
        application: {
          application_id: matched.application_id,
          full_name: matched.full_name,
          roll_number: matched.roll_number,
          areas_of_interest: matched.areas_of_interest,
          application_status: matched.application_status,
          created_at: matched.created_at,
        },
      });
    }

    // Otherwise, must be authenticated administrator to fetch full list
    const session = await getAdminSession();
    if (!session?.isAuthenticated) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized. Administrator credentials required.' },
        { status: 401 }
      );
    }

    const search = searchParams.get('search') || undefined;
    const department = searchParams.get('department') || undefined;
    const status = searchParams.get('status') || undefined;
    const sortOrder = (searchParams.get('sortOrder') as 'asc' | 'desc') || 'desc';

    const applications = await getApplications({
      search,
      department,
      status,
      sortOrder,
    });

    return NextResponse.json({
      success: true,
      count: applications.length,
      applications,
    });
  } catch (err: any) {
    console.error('API /api/applications GET Error:', err);
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve applications.' },
      { status: 500 }
    );
  }
}
