import { NextResponse } from 'next/server';
import { getDashboardStats, getStorageMode } from '@/lib/storage';
import { getAdminSession } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getAdminSession();
    if (!session?.isAuthenticated) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized. Admin credentials required.' },
        { status: 401 }
      );
    }

    const stats = await getDashboardStats();
    const storageMode = getStorageMode();

    return NextResponse.json({
      success: true,
      stats,
      storageMode,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: 'Failed to compute dashboard analytics.' },
      { status: 500 }
    );
  }
}
