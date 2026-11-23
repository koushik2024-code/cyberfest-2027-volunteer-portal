import { NextRequest, NextResponse } from 'next/server';
import { getSystemSettings, updateSystemSettings } from '@/lib/storage';
import { getAdminSession } from '@/lib/auth';

// GET: Retrieve system settings
export async function GET() {
  try {
    const settings = await getSystemSettings();
    return NextResponse.json({
      success: true,
      settings,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve system settings.' },
      { status: 500 }
    );
  }
}

// PATCH: Update system settings (Admin only)
export async function PATCH(req: NextRequest) {
  try {
    const session = await getAdminSession();
    if (!session?.isAuthenticated) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized. Admin credentials required.' },
        { status: 401 }
      );
    }

    const body = await req.json().catch(() => null);
    if (!body) {
      return NextResponse.json({ success: false, error: 'Invalid payload.' }, { status: 400 });
    }

    const updated = await updateSystemSettings(body);
    return NextResponse.json({
      success: true,
      message: 'System settings updated successfully.',
      settings: updated,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: 'Failed to update system settings.' },
      { status: 500 }
    );
  }
}
