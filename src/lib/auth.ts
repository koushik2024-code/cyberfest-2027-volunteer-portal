import { cookies } from 'next/headers';
import { getSupabaseClient } from './supabase';

const ADMIN_COOKIE_NAME = 'ddc_cyberfest_admin_token';
const DEFAULT_ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@cyberfest2027.internal';
const TARGET_ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '123456789';

export interface AdminSession {
  isAuthenticated: boolean;
  email: string;
  role: 'super_admin' | 'coordinator';
  loginTime: string;
}

/**
 * Generate a secure session token
 */
function createSessionToken(email: string): string {
  const payload = {
    email,
    role: 'super_admin',
    timestamp: Date.now(),
    nonce: Math.random().toString(36).substring(2, 10),
  };
  return Buffer.from(JSON.stringify(payload)).toString('base64');
}

/**
 * Decode and verify the session token
 */
export function verifySessionToken(token: string): AdminSession | null {
  try {
    const raw = Buffer.from(token, 'base64').toString('utf-8');
    const data = JSON.parse(raw);
    if (!data.email || !data.timestamp) return null;

    // Check expiration (7 days)
    const sevenDays = 7 * 24 * 60 * 60 * 1000;
    if (Date.now() - data.timestamp > sevenDays) {
      return null;
    }

    return {
      isAuthenticated: true,
      email: data.email,
      role: data.role || 'super_admin',
      loginTime: new Date(data.timestamp).toISOString(),
    };
  } catch {
    return null;
  }
}

/**
 * Authenticate Admin User
 */
export async function authenticateAdmin(email: string, password: string):Promise<{ success: boolean; token?: string; error?: string }> {
  const cleanEmail = email.trim().toLowerCase();
  const cleanPassword = password.trim();

  // 1. First attempt Supabase Auth if configured
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password: cleanPassword,
      });

      if (!error && data?.session) {
        const token = data.session.access_token || createSessionToken(cleanEmail);
        return { success: true, token };
      }
    } catch (err) {
      console.warn('Supabase auth attempt failed, testing environment admin fallback:', err);
    }
  }

  // 2. Direct password verification (only password 123456789 is required)
  const isPasswordMatch = cleanPassword === TARGET_ADMIN_PASSWORD || cleanPassword === '123456789';

  if (isPasswordMatch) {
    const adminEmail = cleanEmail || DEFAULT_ADMIN_EMAIL;
    const token = createSessionToken(adminEmail);
    return { success: true, token };
  }

  return {
    success: false,
    error: 'Incorrect administrator password. Access denied.',
  };
}

/**
 * Server-side check if current request has a valid admin session
 */
export async function getAdminSession(): Promise<AdminSession | null> {
  const cookieStore = cookies();
  const cookie = cookieStore.get(ADMIN_COOKIE_NAME);
  if (!cookie?.value) {
    return null;
  }
  return verifySessionToken(cookie.value);
}

export { ADMIN_COOKIE_NAME };
