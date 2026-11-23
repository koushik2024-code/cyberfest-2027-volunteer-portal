'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Users,
  Clock,
  CheckCircle,
  XCircle,
  BookmarkCheck,
  BarChart3,
  Sliders,
  Database,
  ArrowRight,
  RefreshCw,
  Loader2,
  Calendar,
  AlertCircle,
  ToggleLeft,
  ToggleRight,
  ShieldCheck,
  Save,
} from 'lucide-react';
import AdminNav from '@/components/AdminNav';
import { Application, SystemSettings } from '@/types';
import { formatToIST } from '@/lib/dateUtils';
import { DEPARTMENTS } from '@/lib/constants';

export default function AdminDashboardPage() {
  const router = useRouter();

  const [stats, setStats] = useState<any>(null);
  const [settings, setSettings] = useState<SystemSettings | null>(null);
  const [storageMode, setStorageMode] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [saveSuccessMessage, setSaveSuccessMessage] = useState<string | null>(null);

  // Settings form controls
  const [isOpenToggle, setIsOpenToggle] = useState(true);
  const [deadlineInput, setDeadlineInput] = useState('');
  const [announcementInput, setAnnouncementInput] = useState('');
  const [showLiveCountToggle, setShowLiveCountToggle] = useState(true);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      // Check session
      const authRes = await fetch('/api/admin/auth');
      const authData = await authRes.json();
      if (!authData.isAuthenticated) {
        router.push('/admin/login');
        return;
      }

      // Fetch Stats
      const statsRes = await fetch('/api/admin/stats');
      const statsData = await statsRes.json();
      if (statsData.success) {
        setStats(statsData.stats);
        setStorageMode(statsData.storageMode);
      }

      // Fetch Settings
      const settingsRes = await fetch('/api/admin/settings');
      const settingsData = await settingsRes.json();
      if (settingsData.success && settingsData.settings) {
        setSettings(settingsData.settings);
        setIsOpenToggle(settingsData.settings.is_open);
        setDeadlineInput(settingsData.settings.deadline || '');
        setAnnouncementInput(settingsData.settings.announcement || '');
        setShowLiveCountToggle(settingsData.settings.show_live_count ?? true);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingSettings(true);
    setSaveSuccessMessage(null);

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          is_open: isOpenToggle,
          deadline: deadlineInput,
          announcement: announcementInput,
          show_live_count: showLiveCountToggle,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSettings(data.settings);
        setSaveSuccessMessage('Recruitment configuration updated successfully!');
        setTimeout(() => setSaveSuccessMessage(null), 3000);
      }
    } catch {
      alert('Failed to save settings.');
    } finally {
      setIsSavingSettings(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen py-16 text-center font-mono text-cyan-400">
        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-3" />
        <p>Loading DDC Command Center...</p>
      </div>
    );
  }

  return (
    <div className="pb-16">
      <AdminNav />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 font-mono">
        {/* Top Header & Refresh */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Recruitment Overview Dashboard
            </h1>
            <p className="text-xs text-slate-400">
              Real-time monitoring of volunteer metrics, status tallies, and recruitment toggles.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            {/* Database Engine Badge */}
            <div className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300">
              <Database className="w-3.5 h-3.5 text-cyan-400" />
              <span>
                Engine:{' '}
                <strong className={storageMode?.isConfigured ? 'text-emerald-400' : 'text-cyan-300'}>
                  {storageMode?.isConfigured ? 'Supabase PostgreSQL' : 'Local Persistent Storage'}
                </strong>
              </span>
            </div>

            <button
              onClick={fetchDashboardData}
              className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-colors"
              title="Refresh Dashboard"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 1. Core Metrics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 relative overflow-hidden group hover:border-cyan-500/40 transition-colors">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs">TOTAL APPS</span>
              <Users className="w-4 h-4 text-cyan-400" />
            </div>
            <span className="text-3xl font-black text-white">{stats?.total || 0}</span>
            <div className="mt-2 text-[10px] text-slate-500">Cumulative received</div>
          </div>

          <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 relative overflow-hidden group hover:border-amber-500/40 transition-colors">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs">PENDING</span>
              <Clock className="w-4 h-4 text-amber-400" />
            </div>
            <span className="text-3xl font-black text-amber-400">{stats?.pending || 0}</span>
            <div className="mt-2 text-[10px] text-slate-500">Awaiting screening</div>
          </div>

          <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 relative overflow-hidden group hover:border-blue-500/40 transition-colors">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs">SHORTLISTED</span>
              <BookmarkCheck className="w-4 h-4 text-blue-400" />
            </div>
            <span className="text-3xl font-black text-blue-400">{stats?.shortlisted || 0}</span>
            <div className="mt-2 text-[10px] text-slate-500">For interview / review</div>
          </div>

          <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 relative overflow-hidden group hover:border-emerald-500/40 transition-colors">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs">SELECTED</span>
              <CheckCircle className="w-4 h-4 text-emerald-400" />
            </div>
            <span className="text-3xl font-black text-emerald-400">{stats?.selected || 0}</span>
            <div className="mt-2 text-[10px] text-slate-500">Onboarded crew</div>
          </div>

          <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 relative overflow-hidden group hover:border-rose-500/40 transition-colors">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs">REJECTED</span>
              <XCircle className="w-4 h-4 text-rose-400" />
            </div>
            <span className="text-3xl font-black text-rose-400">{stats?.rejected || 0}</span>
            <div className="mt-2 text-[10px] text-slate-500">Not eligible</div>
          </div>
        </div>

        {/* 2. Recruitment Status Controls & Department Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Live Recruitment Controls (Admin can open/close applications without touching code) */}
          <div className="lg:col-span-1 p-6 rounded-2xl bg-slate-900/70 border border-cyan-500/30 space-y-6">
            <div className="flex items-center space-x-2 text-cyan-400">
              <Sliders className="w-5 h-5" />
              <h2 className="text-lg font-bold text-white">Recruitment Controls</h2>
            </div>

            {saveSuccessMessage && (
              <div className="p-3 rounded-lg bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs">
                {saveSuccessMessage}
              </div>
            )}

            <form onSubmit={handleSaveSettings} className="space-y-5 text-xs">
              {/* Toggle Applications Open / Closed */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="font-bold text-white block">Recruitment Status</span>
                  <span className="text-slate-400 text-[11px]">
                    {isOpenToggle ? 'Applications are live & accepting' : 'Applications are closed'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsOpenToggle(!isOpenToggle)}
                  className={`p-1 rounded-full transition-colors ${
                    isOpenToggle ? 'text-emerald-400' : 'text-slate-600'
                  }`}
                >
                  {isOpenToggle ? (
                    <ToggleRight className="w-9 h-9" />
                  ) : (
                    <ToggleLeft className="w-9 h-9" />
                  )}
                </button>
              </div>

              {/* Deadline Setting */}
              <div>
                <label className="block text-slate-300 font-bold mb-1">
                  Recruitment Deadline (ISO / Text)
                </label>
                <input
                  type="text"
                  value={deadlineInput}
                  onChange={(e) => setDeadlineInput(e.target.value)}
                  placeholder="2027-02-28T23:59:59+05:30"
                  className="w-full px-3 py-2.5 rounded-lg bg-slate-950 border border-slate-800 text-white font-mono focus:border-cyan-400 focus:outline-none"
                />
                <span className="text-[10px] text-slate-500 block mt-1">
                  Displayed on top banner in Indian Standard Time (IST).
                </span>
              </div>

              {/* Announcement Message */}
              <div>
                <label className="block text-slate-300 font-bold mb-1">
                  Announcement Header Banner
                </label>
                <textarea
                  rows={2}
                  value={announcementInput}
                  onChange={(e) => setAnnouncementInput(e.target.value)}
                  placeholder="Official announcement text..."
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white font-mono focus:border-cyan-400 focus:outline-none"
                />
              </div>

              {/* Show Live Count Toggle */}
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-300 block">Show Live Application Count</span>
                  <span className="text-[10px] text-slate-500">
                    Display count pill on public homepage
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowLiveCountToggle(!showLiveCountToggle)}
                  className={`p-1 transition-colors ${
                    showLiveCountToggle ? 'text-cyan-400' : 'text-slate-600'
                  }`}
                >
                  {showLiveCountToggle ? (
                    <ToggleRight className="w-8 h-8" />
                  ) : (
                    <ToggleLeft className="w-8 h-8" />
                  )}
                </button>
              </div>

              <button
                type="submit"
                disabled={isSavingSettings}
                className="w-full py-2.5 px-4 rounded-lg bg-cyan-400 hover:bg-cyan-300 text-black font-bold flex items-center justify-center space-x-2 transition-all shadow-[0_0_15px_rgba(0,240,255,0.3)] disabled:opacity-50"
              >
                {isSavingSettings ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                <span>UPDATE RECRUITMENT CONTROLS</span>
              </button>
            </form>
          </div>

          {/* Right 2 Columns: Department-wise Application Statistics */}
          <div className="lg:col-span-2 p-6 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-cyan-400">
                <BarChart3 className="w-5 h-5" />
                <h2 className="text-lg font-bold text-white">Department Applications</h2>
              </div>
              <Link
                href="/admin/analytics"
                className="text-xs text-cyan-400 hover:text-cyan-300 underline"
              >
                Deep Analytics →
              </Link>
            </div>

            <div className="space-y-3.5">
              {DEPARTMENTS.map((dept) => {
                const count = stats?.departmentCounts?.[dept.name] || 0;
                const total = stats?.total || 1;
                const pct = Math.round((count / total) * 100);

                return (
                  <div key={dept.name} className="space-y-1.5 text-xs">
                    <div className="flex items-center justify-between text-slate-300">
                      <span className="font-semibold text-white">{dept.name}</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-cyan-400 font-bold">{count} applicants</span>
                        <span className="text-slate-500">({pct}%)</span>
                      </div>
                    </div>
                    {/* Visual Progress Bar */}
                    <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden border border-slate-800">
                      <div
                        className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(pct, 100)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* 3. Recent Applications Preview */}
        <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white">Recent Submissions</h2>
            <Link
              href="/admin/applications"
              className="inline-flex items-center space-x-1.5 text-xs text-cyan-400 hover:text-cyan-300 font-bold"
            >
              <span>MANAGE ALL APPLICATIONS</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400">
                  <th className="py-2.5 px-3">APPLICATION ID</th>
                  <th className="py-2.5 px-3">NAME</th>
                  <th className="py-2.5 px-3">ROLL NO</th>
                  <th className="py-2.5 px-3">AREAS OF INTEREST</th>
                  <th className="py-2.5 px-3">DATE (IST)</th>
                  <th className="py-2.5 px-3">STATUS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {stats?.recentApplications && stats.recentApplications.length > 0 ? (
                  stats.recentApplications.map((app: Application) => (
                    <tr key={app.id} className="hover:bg-slate-850/50">
                      <td className="py-3 px-3 text-cyan-400 font-bold">{app.application_id}</td>
                      <td className="py-3 px-3 text-white">{app.full_name}</td>
                      <td className="py-3 px-3 text-slate-300">{app.roll_number}</td>
                      <td className="py-3 px-3">
                        <div className="flex flex-wrap gap-1">
                          {app.areas_of_interest.map((dept, i) => (
                            <span
                              key={i}
                              className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] text-slate-300"
                            >
                              {dept}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="py-3 px-3 text-slate-400">{formatToIST(app.created_at)}</td>
                      <td className="py-3 px-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            app.application_status === 'Selected'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                              : app.application_status === 'Shortlisted'
                              ? 'bg-blue-500/10 text-blue-400 border border-blue-500/30'
                              : app.application_status === 'Rejected'
                              ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                              : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                          }`}
                        >
                          {app.application_status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="py-6 text-center text-slate-500">
                      No applications recorded yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
