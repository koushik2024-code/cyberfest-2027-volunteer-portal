import fs from 'fs';
import path from 'path';
import os from 'os';
import { Application, ApplicationStatus, DepartmentName, SystemSettings } from '@/types';
import { getSupabaseServerClient, isSupabaseConfigured } from './supabase';
import { generateApplicationId } from './validation';

// Support Vercel / serverless runtime by falling back to OS tempdir when running on lambda
const DATA_DIR =
  process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME
    ? path.join(os.tmpdir(), '.cyberfest_data')
    : path.join(process.cwd(), '.data');
const APPLICATIONS_FILE = path.join(DATA_DIR, 'applications.json');
const SETTINGS_FILE = path.join(DATA_DIR, 'settings.json');

const DEFAULT_SETTINGS: SystemSettings = {
  is_open: true,
  deadline: '2026-12-05T23:59:59+05:30',
  announcement: 'CyberFest 2027 Volunteer Applications are OPEN for CBIT students! Deadline: 05 Dec 2026.',
  show_live_count: true,
};

const SEED_APPLICATIONS: Application[] = [];

// Helper to ensure local disk data directory exists
function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

// Read local applications file
function readLocalApplications(): Application[] {
  ensureDataDir();
  if (!fs.existsSync(APPLICATIONS_FILE)) {
    fs.writeFileSync(APPLICATIONS_FILE, JSON.stringify(SEED_APPLICATIONS, null, 2), 'utf-8');
    return SEED_APPLICATIONS;
  }
  try {
    const raw = fs.readFileSync(APPLICATIONS_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return SEED_APPLICATIONS;
  }
}

// Write local applications file
function writeLocalApplications(apps: Application[]) {
  ensureDataDir();
  fs.writeFileSync(APPLICATIONS_FILE, JSON.stringify(apps, null, 2), 'utf-8');
}

// Read local settings file
function readLocalSettings(): SystemSettings {
  ensureDataDir();
  if (!fs.existsSync(SETTINGS_FILE)) {
    fs.writeFileSync(SETTINGS_FILE, JSON.stringify(DEFAULT_SETTINGS, null, 2), 'utf-8');
    return DEFAULT_SETTINGS;
  }
  try {
    const raw = fs.readFileSync(SETTINGS_FILE, 'utf-8');
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

// Write local settings file
function writeLocalSettings(settings: SystemSettings) {
  ensureDataDir();
  fs.writeFileSync(SETTINGS_FILE, JSON.stringify(settings, null, 2), 'utf-8');
}

// =============================================================================
// PUBLIC STORAGE API
// =============================================================================

export function getStorageMode(): { mode: 'supabase' | 'local'; isConfigured: boolean } {
  const configured = isSupabaseConfigured();
  return {
    mode: configured ? 'supabase' : 'local',
    isConfigured: configured,
  };
}

/**
 * Retrieve system recruitment settings
 */
export async function getSystemSettings(): Promise<SystemSettings> {
  const supabase = getSupabaseServerClient();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('system_settings')
        .select('value')
        .eq('key', 'recruitment_status')
        .single();

      if (!error && data?.value) {
        return data.value as SystemSettings;
      }
    } catch (err) {
      console.warn('Supabase getSystemSettings error, falling back to local file storage:', err);
    }
  }

  return readLocalSettings();
}

/**
 * Update system recruitment settings (Admin only)
 */
export async function updateSystemSettings(partial: Partial<SystemSettings>): Promise<SystemSettings> {
  const current = await getSystemSettings();
  const updated: SystemSettings = { ...current, ...partial };

  const supabase = getSupabaseServerClient();
  if (supabase) {
    try {
      const { error } = await supabase
        .from('system_settings')
        .upsert({
          key: 'recruitment_status',
          value: updated,
          updated_at: new Date().toISOString(),
        });

      if (!error) {
        return updated;
      }
      console.warn('Supabase updateSystemSettings error, saving to local file:', error);
    } catch (err) {
      console.warn('Supabase updateSystemSettings exception:', err);
    }
  }

  writeLocalSettings(updated);
  return updated;
}

/**
 * Check if a roll number is already registered
 */
export async function checkRollNumberExists(rollNumber: string): Promise<boolean> {
  const normalized = rollNumber.trim().toUpperCase();
  const supabase = getSupabaseServerClient();

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('applications')
        .select('id')
        .ilike('roll_number', normalized)
        .limit(1);

      if (!error && data && data.length > 0) {
        return true;
      }
      return false;
    } catch (err) {
      console.warn('Supabase checkRollNumberExists error, checking local store:', err);
    }
  }

  const localApps = readLocalApplications();
  return localApps.some((a) => a.roll_number.toUpperCase() === normalized);
}

/**
 * Retrieve application by Application ID (reference)
 */
export async function getApplicationByRefId(refId: string): Promise<Application | null> {
  const normalized = refId.trim().toUpperCase();
  const supabase = getSupabaseServerClient();

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('applications')
        .select('*')
        .eq('application_id', normalized)
        .single();

      if (!error && data) {
        return data as Application;
      }
    } catch (err) {
      console.warn('Supabase getApplicationByRefId error:', err);
    }
  }

  const localApps = readLocalApplications();
  return localApps.find((a) => a.application_id.toUpperCase() === normalized) || null;
}

/**
 * Create a new application
 */
export async function createApplication(data: {
  fullName: string;
  rollNumber: string;
  areasOfInterest: DepartmentName[];
}): Promise<{ success: boolean; application?: Application; error?: string }> {
  // Check recruitment is open
  const settings = await getSystemSettings();
  if (!settings.is_open) {
    return {
      success: false,
      error: 'Recruitment is currently closed. Applications are no longer being accepted.',
    };
  }

  const normalizedRoll = data.rollNumber.trim().toUpperCase();

  // Check duplicate roll number
  const exists = await checkRollNumberExists(normalizedRoll);
  if (exists) {
    return {
      success: false,
      error: `An application with Roll Number ${normalizedRoll} has already been submitted. Duplicate submissions are not allowed.`,
    };
  }

  const applicationId = generateApplicationId();
  const newApp: Application = {
    id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `app-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    application_id: applicationId,
    full_name: data.fullName.trim(),
    roll_number: normalizedRoll,
    areas_of_interest: data.areasOfInterest,
    application_status: 'Pending',
    created_at: new Date().toISOString(),
  };

  const supabase = getSupabaseServerClient();
  if (supabase) {
    try {
      const { data: inserted, error } = await supabase
        .from('applications')
        .insert({
          id: newApp.id,
          application_id: newApp.application_id,
          full_name: newApp.full_name,
          roll_number: newApp.roll_number,
          areas_of_interest: newApp.areas_of_interest,
          application_status: newApp.application_status,
          created_at: newApp.created_at,
        })
        .select()
        .single();

      if (!error && inserted) {
        return { success: true, application: inserted as Application };
      }
      if (error?.code === '23505') {
        return {
          success: false,
          error: `Roll Number ${normalizedRoll} has already been registered in our database.`,
        };
      }
      console.warn('Supabase insert failed, storing locally:', error);
    } catch (err: any) {
      console.warn('Supabase insert exception, storing locally:', err);
      if (err?.code === '23505') {
        return {
          success: false,
          error: `Roll Number ${normalizedRoll} has already been registered in our database.`,
        };
      }
    }
  }

  // Local storage persistence
  const localApps = readLocalApplications();
  if (localApps.some((a) => a.roll_number.toUpperCase() === normalizedRoll)) {
    return {
      success: false,
      error: `Roll Number ${normalizedRoll} has already been submitted.`,
    };
  }
  localApps.unshift(newApp);
  writeLocalApplications(localApps);

  return { success: true, application: newApp };
}

/**
 * Get all applications with search, department, status filters, and sorting
 */
export async function getApplications(options: {
  search?: string;
  department?: string;
  status?: string;
  sortOrder?: 'desc' | 'asc';
} = {}): Promise<Application[]> {
  const { search, department, status, sortOrder = 'desc' } = options;
  const supabase = getSupabaseServerClient();

  if (supabase) {
    try {
      let query = supabase.from('applications').select('*');

      if (status && status !== 'All') {
        query = query.eq('application_status', status);
      }
      if (department && department !== 'All') {
        query = query.contains('areas_of_interest', [department]);
      }
      if (search && search.trim()) {
        const s = search.trim();
        query = query.or(`full_name.ilike.%${s}%,roll_number.ilike.%${s}%,application_id.ilike.%${s}%`);
      }

      query = query.order('created_at', { ascending: sortOrder === 'asc' });

      const { data, error } = await query;
      if (!error && data) {
        return data as Application[];
      }
      console.warn('Supabase query error, reading from local file:', error);
    } catch (err) {
      console.warn('Supabase exception reading applications:', err);
    }
  }

  // Local file filtering
  let apps = readLocalApplications();

  if (status && status !== 'All') {
    apps = apps.filter((a) => a.application_status === status);
  }

  if (department && department !== 'All') {
    apps = apps.filter((a) => a.areas_of_interest.includes(department as DepartmentName));
  }

  if (search && search.trim()) {
    const s = search.trim().toLowerCase();
    apps = apps.filter(
      (a) =>
        a.full_name.toLowerCase().includes(s) ||
        a.roll_number.toLowerCase().includes(s) ||
        a.application_id.toLowerCase().includes(s)
    );
  }

  apps.sort((a, b) => {
    const timeA = new Date(a.created_at).getTime();
    const timeB = new Date(b.created_at).getTime();
    return sortOrder === 'asc' ? timeA - timeB : timeB - timeA;
  });

  return apps;
}

/**
 * Update application status (Pending, Shortlisted, Selected, Rejected)
 */
export async function updateApplicationStatus(
  idOrAppId: string,
  newStatus: ApplicationStatus
): Promise<{ success: boolean; application?: Application; error?: string }> {
  const supabase = getSupabaseServerClient();

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('applications')
        .update({ application_status: newStatus })
        .or(`id.eq.${idOrAppId},application_id.eq.${idOrAppId}`)
        .select()
        .single();

      if (!error && data) {
        return { success: true, application: data as Application };
      }
      console.warn('Supabase status update error:', error);
    } catch (err: any) {
      console.warn('Supabase update status exception:', err);
    }
  }

  const localApps = readLocalApplications();
  const index = localApps.findIndex((a) => a.id === idOrAppId || a.application_id === idOrAppId);
  if (index === -1) {
    return { success: false, error: 'Application not found.' };
  }

  localApps[index].application_status = newStatus;
  writeLocalApplications(localApps);

  return { success: true, application: localApps[index] };
}

/**
 * Delete an application (Admin only)
 */
export async function deleteApplication(idOrAppId: string): Promise<{ success: boolean; error?: string }> {
  const supabase = getSupabaseServerClient();

  if (supabase) {
    try {
      const { error } = await supabase
        .from('applications')
        .delete()
        .or(`id.eq.${idOrAppId},application_id.eq.${idOrAppId}`);

      if (!error) {
        return { success: true };
      }
      console.warn('Supabase delete error:', error);
    } catch (err: any) {
      console.warn('Supabase delete exception:', err);
    }
  }

  const localApps = readLocalApplications();
  const filtered = localApps.filter((a) => a.id !== idOrAppId && a.application_id !== idOrAppId);
  if (filtered.length === localApps.length) {
    return { success: false, error: 'Application not found to delete.' };
  }

  writeLocalApplications(filtered);
  return { success: true };
}

/**
 * Compute real-time dashboard analytics
 */
export async function getDashboardStats() {
  const allApps = await getApplications({ sortOrder: 'desc' });

  const total = allApps.length;
  const pending = allApps.filter((a) => a.application_status === 'Pending').length;
  const shortlisted = allApps.filter((a) => a.application_status === 'Shortlisted').length;
  const selected = allApps.filter((a) => a.application_status === 'Selected').length;
  const rejected = allApps.filter((a) => a.application_status === 'Rejected').length;

  // Department counts
  const departmentCounts: Record<string, number> = {};
  allApps.forEach((app) => {
    app.areas_of_interest.forEach((dept) => {
      departmentCounts[dept] = (departmentCounts[dept] || 0) + 1;
    });
  });

  // Recent 5 applications
  const recentApplications = allApps.slice(0, 5);

  return {
    total,
    pending,
    shortlisted,
    selected,
    rejected,
    departmentCounts,
    recentApplications,
  };
}
