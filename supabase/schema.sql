-- =============================================================================
-- CYBERFEST 2027 VOLUNTEER RECRUITMENT PORTAL - SUPABASE DATABASE SCHEMA
-- Organized by Digital Defence Club (DDC), CBIT Hyderabad
-- =============================================================================

-- Enable pgcrypto / uuid-ossp if needed
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. Create Applications Table
CREATE TABLE IF NOT EXISTS public.applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    roll_number TEXT NOT NULL UNIQUE,
    areas_of_interest TEXT[] NOT NULL,
    application_status TEXT NOT NULL DEFAULT 'Pending' CHECK (application_status IN ('Pending', 'Shortlisted', 'Selected', 'Rejected')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexing for fast search, filter, and sorting
CREATE INDEX IF NOT EXISTS idx_applications_roll_number ON public.applications (roll_number);
CREATE INDEX IF NOT EXISTS idx_applications_status ON public.applications (application_status);
CREATE INDEX IF NOT EXISTS idx_applications_created_at ON public.applications (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_applications_areas ON public.applications USING GIN (areas_of_interest);

-- 2. Create System Settings Table (Recruitment controls, deadlines, announcements)
CREATE TABLE IF NOT EXISTS public.system_settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Insert Default System Settings
INSERT INTO public.system_settings (key, value, updated_at)
VALUES 
    ('recruitment_status', '{"is_open": true, "deadline": "2026-12-05T23:59:59+05:30", "announcement": "Volunteer applications for CyberFest 2027 are officially OPEN! Join the premier cyber conclave team at CBIT. Deadline: 05 Dec 2026.", "show_live_count": true}'::jsonb, NOW())
ON CONFLICT (key) DO NOTHING;

-- 3. Row Level Security (RLS)
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;

-- Applications RLS Policies:
-- 3.1 Public can submit an application (INSERT)
CREATE POLICY "Public can submit applications"
    ON public.applications
    FOR INSERT
    TO public, anon, authenticated
    WITH CHECK (true);

-- 3.2 Authenticated Administrators have full access (SELECT, UPDATE, DELETE)
CREATE POLICY "Admins have full access to applications"
    ON public.applications
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- 3.3 Public can read reference status of their own submitted application via application_id
CREATE POLICY "Public can query application by application_id"
    ON public.applications
    FOR SELECT
    TO public, anon
    USING (true);

-- System Settings RLS Policies:
-- 3.4 Public can read recruitment settings
CREATE POLICY "Public can read recruitment settings"
    ON public.system_settings
    FOR SELECT
    TO public, anon, authenticated
    USING (true);

-- 3.5 Authenticated Admins can update system settings
CREATE POLICY "Admins can update system settings"
    ON public.system_settings
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- =============================================================================
-- End of Schema
-- =============================================================================
