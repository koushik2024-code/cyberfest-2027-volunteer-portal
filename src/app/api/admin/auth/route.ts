import { NextRequest, NextResponse } from 'next/server';
import { authenticateAdmin, getAdminSession, ADMIN_COOKIE_NAME } from '@/lib/auth';

// POST: Admin Login
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    if (!body?.email || !body?.password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required.' },
        { status: 400 }
      );
    }

    const { email, password } = body;
    const result = await authenticateAdmin(email, password);

    if (!result.success || !result.token) {
      return NextResponse.json(
        { success: false, error: result.error || 'Authentication failed.' },
        { status: 401 }
      );
    }

    const response = NextResponse.json({
      success: true,
      message: 'Admin authentication successful.',
      user: { email: email.toLowerCase(), role: 'super_admin' },
    });

    // Set secure HTTP-only cookie
    response.cookies.set({
      name: ADMIN_COOKIE_NAME,
      value: result.token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return response;
  } catch (err: any) {
    console.error('API /api/admin/auth POST error:', err);
    return NextResponse.json(
      { success: false, error: 'Authentication service error.' },
      { status: 500 }
    );
  }
}

// GET: Check current Admin Session
export async function GET() {
  try {
    const session = await getAdminSession();
    if (!session?.isAuthenticated) {
      return NextResponse.json({
        success: false,
        isAuthenticated: false,
      });
    }

    return NextResponse.json({
      success: true,
      isAuthenticated: true,
      user: {
        email: session.email,
        role: session.role,
        loginTime: session.loginTime,
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: 'Failed to verify session.' },
      { status: 500 }
    );
  }
}

// DELETE: Admin Logout
export async function DELETE() {
  const response = NextResponse.json({
    success: true,
    message: 'Logged out successfully.',
  });

  response.cookies.delete(ADMIN_COOKIE_NAME);
  return response;
}
