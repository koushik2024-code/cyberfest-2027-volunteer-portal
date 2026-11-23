# CYBERFEST 2027 — Official Volunteer Recruitment Portal
### Organized by Digital Defence Club (DDC), Chaitanya Bharathi Institute of Technology (CBIT), Hyderabad
**Academic Leadership: Departments of CET, AI&DS, and IT**  
**Tagline:** *"Think Beyond. Defend Beyond."*

---

## 🛡️ Overview

**CyberFest 2027** is the flagship national-scale technical conclave bringing together ethical hackers, security researchers, CTF champions, and industry leaders at the CBIT Campus, Gandipet, Hyderabad.

This repository contains the complete, production-ready **Volunteer Recruitment Portal** engineered to collect, validate, persist, screen, and manage student volunteer applications across 8 specialized wings:
1. **Technical** (CTFs, Sandboxes, Networks & Bug Bounties)
2. **Events** (Ground Logistics, Stage Protocol & Operations)
3. **Public Relations (PR)** (Outreach, Campus Ambassadors & Social Media)
4. **Design** (Cyber Visual Identity, UI/UX & Merchandise)
5. **Video Editing** (Trailers, Aftermovies & Motion Graphics)
6. **Sponsorship** (Corporate Pitching, Title Sponsorships & Grants)
7. **External Affairs** (Dignitary Protocol, Government Liaison & VIPs)
8. **Documentation** (Institutional Approvals, IQAC & NAAC Reporting)

---

## ⚡ Tech Stack & Architecture

- **Framework:** Next.js 14 (App Router) + React 18 + TypeScript
- **Styling & Cyber Aesthetic:** Tailwind CSS with custom cyber matrix grids, glowing borders, radial cyan gradients, and scanline effects
- **Icons & Visuals:** Lucide React + Canvas Confetti
- **Database Engine:** Dual-Engine Resilient Architecture:
  - **Primary:** Supabase PostgreSQL with Row Level Security (RLS) policies, UNIQUE roll number constraints, and GIN indexing.
  - **Local Persistent Engine:** Atomic on-disk file storage (`.data/applications.json` and `.data/settings.json`) enabling zero-configuration local development and immediate testing.
- **Authentication:** Supabase Auth + Cryptographic HMAC Session Token Cookies with HTTP-only security for administrators.
- **Security Protocols:** Rate limiting (in-memory IP tracking), strict XSS sanitization, anti-duplicate submission gates, and zero public data leakage.

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- Node.js `v18.17+` or `v20+` or `v24+`
- npm `v9+` or `v10+`

### 2. Installation
```bash
npm install
```

### 3. Environment Setup
Copy the sample environment file:
```bash
cp .env.example .env.local
```

Configure your credentials in `.env.local`:
```env
# Supabase Cloud Configuration (Optional for local testing; when provided, connects directly to cloud PostgreSQL)
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# Administrator Credentials (Set privately by club leadership)
ADMIN_PASSWORD=your_private_admin_password

# Metadata
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_EVENT_NAME=CyberFest 2027
NEXT_PUBLIC_CLUB_NAME=Digital Defence Club (DDC)
NEXT_PUBLIC_COLLEGE_NAME=Chaitanya Bharathi Institute of Technology (CBIT)
```

### 4. Running Locally
```bash
# Development server:
npm run dev

# Or Production build:
npm run build
npm start
```

Visit:
- **Public Portal:** [http://localhost:3000](http://localhost:3000)
- **Volunteer Application Form:** [http://localhost:3000/apply](http://localhost:3000/apply)
- **Admin Command Portal:** [http://localhost:3000/admin/dashboard](http://localhost:3000/admin/dashboard)
  - Private access gateway protected by administrator password

---

## 🗄️ Database & Supabase Setup Guide

### Step 1: Create a Supabase Project
1. Go to [https://supabase.com](https://supabase.com) and create a free project.
2. Note your **Project URL** and **API Keys** under `Project Settings` → `API`.

### Step 2: Execute Database Schema Migration
1. In the Supabase Dashboard, open the **SQL Editor**.
2. Open [`supabase/schema.sql`](supabase/schema.sql) and paste its entire contents into the SQL Editor.
3. Click **Run**. This will create:
   - `applications` table with `UUID` primary key, `roll_number` UNIQUE constraint, `areas_of_interest` array, and `application_status` enum.
   - `system_settings` table for live recruitment open/closed toggles and announcements.
   - Secure Row Level Security (RLS) policies allowing public submission and restricting screening/editing to authenticated admins.
   - GIN & B-tree indexes for lightning-fast search and department filtering.
4. (Optional) Run [`supabase/seed.sql`](supabase/seed.sql) to populate sample test applicants.

### Step 3: Link Environment Variables
In your `.env.local` (or Vercel project environment variables), set:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

---

## 🔒 Security Architecture

1. **Row Level Security (RLS):**
   - Public visitors can only execute `INSERT` into `applications`.
   - Public visitors cannot read all applications or access the dashboard.
   - Only authenticated administrators can `SELECT`, `UPDATE`, or `DELETE` applications.
2. **Duplicate Submission Protection:**
   - Client-side validation prevents instant re-submits.
   - Server-side pre-flight checks verify roll number existence.
   - PostgreSQL `UNIQUE` database constraint prevents race condition duplicates.
3. **Rate Limiting:**
   - Limits submission frequency per IP address to eliminate bot spam.
4. **Input Sanitization:**
   - Strips malicious HTML tag injections and prevents XSS attacks.
5. **Session Management:**
   - Protected admin routes use HTTP-only secure cookies (`ddc_cyberfest_admin_token`) expiring in 7 days.

---

## 📊 Admin Dashboard Features

- **Real-Time Overview (`/admin/dashboard`):**
  - Instant counts for Total, Pending, Shortlisted, Selected, and Rejected candidates.
  - Department preference progress bars.
  - **Live Recruitment Toggles:** Toggle applications Open/Closed without touching source code.
  - Configurable recruitment deadline and announcement banner.
  - Toggle live applicant counter on the homepage.
- **Applications Registry (`/admin/applications`):**
  - Full-text search by Student Name, Roll Number, or Application ID.
  - Department and Status filters.
  - Instant status transition dropdowns (Pending → Shortlisted → Selected → Rejected).
  - Detailed applicant inspection modal.
  - Permanent applicant deletion with security confirmation modal.
  - One-click CSV/Excel export.
- **Department Analytics (`/admin/analytics`):**
  - Ranked wings by popularity.
  - Pipeline conversion percentage.
  - Department-specific one-click CSV download.

---

## 🚢 Deployment to Vercel

1. Push this repository to GitHub or GitLab:
   ```bash
   git init
   git add .
   git commit -m "feat: CyberFest 2027 Volunteer Recruitment Portal"
   git branch -M main
   git remote add origin https://github.com/<your-username>/cyberfest-2027-recruitment.git
   git push -u origin main
   ```
2. Go to [Vercel](https://vercel.com) → **Add New Project** → Import repository.
3. In the **Environment Variables** section, paste the values from `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `ADMIN_EMAIL`
   - `ADMIN_DEFAULT_PASSWORD`
4. Click **Deploy**. Vercel will build and assign a production URL (e.g., `https://cyberfest-2027.vercel.app`).

---

## 📜 Verification & Test Results

The portal was verified end-to-end with an automated production test suite (`scripts/verify-e2e.mjs`):
- **31/31 tests passed** (100% success rate):
  - ✅ Homepage, branding, and navigation verification
  - ✅ Application form submission and receipt generation
  - ✅ Duplicate roll number rejection (409 Conflict)
  - ✅ Admin authentication and unauthorized access denial (401)
  - ✅ Live recruitment open/closed toggle enforcement
  - ✅ Application status updates and persistence
  - ✅ CSV / Excel export generation and department filtering
  - ✅ Indian Standard Time (IST) timestamp formatting

---

© 2026–2027 **Digital Defence Club (DDC)**, Chaitanya Bharathi Institute of Technology (CBIT), Hyderabad.  
*All rights reserved.*
