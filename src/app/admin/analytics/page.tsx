'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  BarChart3,
  PieChart,
  TrendingUp,
  Download,
  Users,
  CheckCircle,
  Clock,
  XCircle,
  BookmarkCheck,
  Loader2,
  FileSpreadsheet,
} from 'lucide-react';
import AdminNav from '@/components/AdminNav';
import { DEPARTMENTS } from '@/lib/constants';
import { Application } from '@/types';

export default function DepartmentAnalyticsPage() {
  const router = useRouter();
  const [stats, setStats] = useState<any>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const authRes = await fetch('/api/admin/auth');
        const auth = await authRes.json();
        if (!auth.isAuthenticated) {
          router.push('/admin/login');
          return;
        }

        const [statsRes, appsRes] = await Promise.all([
          fetch('/api/admin/stats'),
          fetch('/api/applications'),
        ]);

        const statsData = await statsRes.json();
        const appsData = await appsRes.json();

        if (statsData.success) setStats(statsData.stats);
        if (appsData.success) setApplications(appsData.applications);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const total = stats?.total || 1;

  // Ranked departments by popularity
  const sortedDepartments = [...DEPARTMENTS].sort((a, b) => {
    const countA = stats?.departmentCounts?.[a.name] || 0;
    const countB = stats?.departmentCounts?.[b.name] || 0;
    return countB - countA;
  });

  const exportDepartment = (deptName: string) => {
    window.open(`/api/admin/export?department=${encodeURIComponent(deptName)}`, '_blank');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen py-16 text-center font-mono text-cyan-400">
        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-3" />
        <p>Crunching department analytics...</p>
      </div>
    );
  }

  return (
    <div className="pb-16 font-mono">
      <AdminNav />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Department Analytics & Distribution
          </h1>
          <p className="text-xs text-slate-400">
            Insights on recruitment wing demand, applicant preferences, and pipeline conversion.
          </p>
        </div>

        {/* 1. Status Distribution Pipeline */}
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
          <div className="flex items-center space-x-2 text-cyan-400">
            <PieChart className="w-5 h-5" />
            <h2 className="text-lg font-bold text-white">Application Pipeline Status</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 pt-2">
            <div className="p-4 rounded-xl bg-slate-950 border border-amber-500/30 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-slate-400 block">PENDING SCREENING</span>
                <span className="text-2xl font-black text-amber-400">{stats?.pending || 0}</span>
                <span className="text-[10px] text-slate-500 block">
                  {Math.round(((stats?.pending || 0) / total) * 100)}% of candidate pool
                </span>
              </div>
              <Clock className="w-8 h-8 text-amber-400/40" />
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-blue-500/30 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-slate-400 block">SHORTLISTED</span>
                <span className="text-2xl font-black text-blue-400">{stats?.shortlisted || 0}</span>
                <span className="text-[10px] text-slate-500 block">
                  {Math.round(((stats?.shortlisted || 0) / total) * 100)}% of candidate pool
                </span>
              </div>
              <BookmarkCheck className="w-8 h-8 text-blue-400/40" />
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-emerald-500/30 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-slate-400 block">OFFICIALLY SELECTED</span>
                <span className="text-2xl font-black text-emerald-400">{stats?.selected || 0}</span>
                <span className="text-[10px] text-slate-500 block">
                  {Math.round(((stats?.selected || 0) / total) * 100)}% selection rate
                </span>
              </div>
              <CheckCircle className="w-8 h-8 text-emerald-400/40" />
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-rose-500/30 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-slate-400 block">REJECTED</span>
                <span className="text-2xl font-black text-rose-400">{stats?.rejected || 0}</span>
                <span className="text-[10px] text-slate-500 block">
                  {Math.round(((stats?.rejected || 0) / total) * 100)}% rejection rate
                </span>
              </div>
              <XCircle className="w-8 h-8 text-rose-400/40" />
            </div>
          </div>
        </div>

        {/* 2. Department Demand Rankings & Export */}
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <div className="flex items-center space-x-2 text-cyan-400">
              <TrendingUp className="w-5 h-5" />
              <h2 className="text-lg font-bold text-white">Department Demand Ranking</h2>
            </div>
            <span className="text-xs text-slate-400">
              Ranked from most preferred to least preferred
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {sortedDepartments.map((dept, index) => {
              const count = stats?.departmentCounts?.[dept.name] || 0;
              const pct = Math.round((count / total) * 100);

              return (
                <div
                  key={dept.name}
                  className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col justify-between space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-slate-900 text-cyan-400 border border-cyan-500/30 text-xs font-bold">
                        #{index + 1}
                      </span>
                      <div>
                        <span className="font-bold text-white block text-sm">{dept.name}</span>
                        <span className="text-[11px] text-slate-400">{dept.tagline}</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-base font-black text-cyan-400">{count}</span>
                      <span className="text-[10px] text-slate-500 block">({pct}% preference)</span>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden border border-slate-800">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full"
                      style={{ width: `${Math.min(pct, 100)}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between pt-1 text-xs">
                    <span className="text-[10px] text-slate-500">
                      Skills: {dept.skills.slice(0, 2).join(', ')}
                    </span>
                    <button
                      onClick={() => exportDepartment(dept.name)}
                      className="inline-flex items-center space-x-1 text-cyan-400 hover:text-cyan-300 text-[11px] underline"
                    >
                      <Download className="w-3 h-3" />
                      <span>Export {dept.name} List</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
