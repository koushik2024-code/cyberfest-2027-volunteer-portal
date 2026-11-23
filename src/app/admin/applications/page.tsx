'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  Users,
  Search,
  Filter,
  Download,
  Trash2,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  BookmarkCheck,
  RefreshCw,
  Loader2,
  X,
  FileSpreadsheet,
  AlertTriangle,
  ArrowUpDown,
  ShieldAlert,
} from 'lucide-react';
import AdminNav from '@/components/AdminNav';
import { Application, ApplicationStatus, DepartmentName } from '@/types';
import { DEPARTMENTS } from '@/lib/constants';
import { formatToIST } from '@/lib/dateUtils';

const STATUS_OPTIONS: Array<ApplicationStatus | 'All'> = [
  'All',
  'Pending',
  'Shortlisted',
  'Selected',
  'Rejected',
];

const DEPARTMENT_OPTIONS = ['All', ...DEPARTMENTS.map((d) => d.name)];

export default function ApplicationsManagementPage() {
  const router = useRouter();

  // State
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');

  // Modal State
  const [activeModalApp, setActiveModalApp] = useState<Application | null>(null);
  const [deleteConfirmApp, setDeleteConfirmApp] = useState<Application | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Show Toast
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Fetch applications
  const fetchApplications = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchTerm) params.set('search', searchTerm);
      if (selectedDepartment !== 'All') params.set('department', selectedDepartment);
      if (selectedStatus !== 'All') params.set('status', selectedStatus);
      params.set('sortOrder', sortOrder);

      const res = await fetch(`/api/applications?${params.toString()}`);
      if (res.status === 401) {
        router.push('/admin/login');
        return;
      }
      const data = await res.json();
      if (data.success && data.applications) {
        setApplications(data.applications);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [searchTerm, selectedDepartment, selectedStatus, sortOrder]);

  // Update Status handler
  const handleStatusChange = async (appId: string, newStatus: ApplicationStatus) => {
    setActionLoading(appId);
    try {
      const res = await fetch(`/api/applications/${appId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setApplications((prev) =>
          prev.map((a) => (a.id === appId ? { ...a, application_status: newStatus } : a))
        );
        if (activeModalApp?.id === appId) {
          setActiveModalApp((prev) => (prev ? { ...prev, application_status: newStatus } : null));
        }
        showToast(`Status updated to ${newStatus}`);
      } else {
        alert(data.error || 'Failed to update status');
      }
    } catch {
      alert('Failed to update status');
    } finally {
      setActionLoading(null);
    }
  };

  // Delete handler
  const handleDelete = async (appId: string) => {
    setActionLoading(appId);
    try {
      const res = await fetch(`/api/applications/${appId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        setApplications((prev) => prev.filter((a) => a.id !== appId));
        setDeleteConfirmApp(null);
        if (activeModalApp?.id === appId) {
          setActiveModalApp(null);
        }
        showToast('Application deleted successfully');
      } else {
        alert(data.error || 'Failed to delete application');
      }
    } catch {
      alert('Failed to delete application');
    } finally {
      setActionLoading(null);
    }
  };

  // Export CSV handler
  const handleExportCSV = () => {
    const params = new URLSearchParams();
    if (selectedDepartment !== 'All') params.set('department', selectedDepartment);
    if (selectedStatus !== 'All') params.set('status', selectedStatus);
    window.open(`/api/admin/export?${params.toString()}`, '_blank');
  };

  return (
    <div className="pb-16 font-mono">
      <AdminNav />

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl bg-cyan-950 border border-cyan-400 text-cyan-300 text-xs shadow-[0_0_20px_rgba(0,240,255,0.4)] flex items-center space-x-2 animate-bounce">
          <CheckCircle className="w-4 h-4 text-cyan-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Header & Controls */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Applications Registry
            </h1>
            <p className="text-xs text-slate-400">
              Manage, filter, review, and export volunteer submissions across all CBIT branches.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={handleExportCSV}
              className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-lg bg-emerald-950/60 hover:bg-emerald-900 border border-emerald-500/40 text-emerald-300 text-xs font-bold transition-all"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>EXPORT CSV / EXCEL</span>
            </button>

            <button
              onClick={fetchApplications}
              className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800"
              title="Refresh Registry"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Filters and Search Bar */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          {/* Search Input */}
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, roll no, or ID..."
              className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
            />
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
          </div>

          {/* Department Filter */}
          <div>
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-400"
            >
              <option value="All">All Departments</option>
              {DEPARTMENTS.map((d) => (
                <option key={d.name} value={d.name}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-400"
            >
              {STATUS_OPTIONS.map((st) => (
                <option key={st} value={st}>
                  Status: {st}
                </option>
              ))}
            </select>
          </div>

          {/* Sort Order Toggle */}
          <div>
            <button
              onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
              className="w-full px-3 py-2.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 hover:text-white flex items-center justify-between"
            >
              <span>Date: {sortOrder === 'desc' ? 'Newest First' : 'Oldest First'}</span>
              <ArrowUpDown className="w-3.5 h-3.5 text-cyan-400" />
            </button>
          </div>
        </div>

        {/* Count Bar */}
        <div className="flex items-center justify-between text-xs text-slate-400 px-1">
          <span>
            Showing <strong className="text-white">{applications.length}</strong> applicant(s)
          </span>
          {(searchTerm || selectedDepartment !== 'All' || selectedStatus !== 'All') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedDepartment('All');
                setSelectedStatus('All');
              }}
              className="text-cyan-400 hover:text-cyan-300 underline"
            >
              Reset Filters
            </button>
          )}
        </div>

        {/* Applications Table */}
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-3">Application ID</th>
                  <th className="py-3 px-3">Name</th>
                  <th className="py-3 px-3">Roll No</th>
                  <th className="py-3 px-3">Areas of Interest</th>
                  <th className="py-3 px-3">Date (IST)</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {isLoading ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-cyan-400">
                      <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
                      <span>Querying persistent database...</span>
                    </td>
                  </tr>
                ) : applications.length > 0 ? (
                  applications.map((app) => (
                    <tr key={app.id} className="hover:bg-slate-850/60 transition-colors">
                      <td className="py-3.5 px-3 font-bold text-cyan-400">{app.application_id}</td>
                      <td className="py-3.5 px-3 text-white font-medium">{app.full_name}</td>
                      <td className="py-3.5 px-3 text-slate-300 font-bold">{app.roll_number}</td>
                      <td className="py-3.5 px-3">
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {app.areas_of_interest.map((dept, i) => (
                            <span
                              key={i}
                              className="px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-500/20 text-cyan-300 text-[10px]"
                            >
                              {dept}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="py-3.5 px-3 text-slate-400 whitespace-nowrap">
                        {formatToIST(app.created_at)}
                      </td>
                      <td className="py-3.5 px-3 whitespace-nowrap">
                        <select
                          value={app.application_status}
                          disabled={actionLoading === app.id}
                          onChange={(e) =>
                            handleStatusChange(app.id, e.target.value as ApplicationStatus)
                          }
                          className={`px-2 py-1 rounded text-[11px] font-bold border focus:outline-none cursor-pointer ${
                            app.application_status === 'Selected'
                              ? 'bg-emerald-950/70 text-emerald-400 border-emerald-500/40'
                              : app.application_status === 'Shortlisted'
                              ? 'bg-blue-950/70 text-blue-400 border-blue-500/40'
                              : app.application_status === 'Rejected'
                              ? 'bg-rose-950/70 text-rose-400 border-rose-500/40'
                              : 'bg-amber-950/70 text-amber-400 border-amber-500/40'
                          }`}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Shortlisted">Shortlisted</option>
                          <option value="Selected">Selected</option>
                          <option value="Rejected">Rejected</option>
                        </select>
                      </td>
                      <td className="py-3.5 px-3 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => setActiveModalApp(app)}
                            className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-cyan-400 transition-colors"
                            title="View Complete Application"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteConfirmApp(app)}
                            className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-rose-400 transition-colors"
                            title="Delete Application"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-500">
                      No applications match the current query criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* VIEW APPLICATION MODAL */}
      {activeModalApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="max-w-lg w-full p-6 rounded-2xl bg-slate-900 border border-cyan-500/40 space-y-5 shadow-[0_0_50px_rgba(0,240,255,0.2)] font-mono text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-slate-400 text-[10px] block">CANDIDATE RECORD</span>
                <span className="text-lg font-bold text-cyan-400">
                  {activeModalApp.application_id}
                </span>
              </div>
              <button
                onClick={() => setActiveModalApp(null)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Full Name:</span>
                <span className="text-white font-bold">{activeModalApp.full_name}</span>
              </div>

              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Roll Number:</span>
                <span className="text-cyan-300 font-bold">{activeModalApp.roll_number}</span>
              </div>

              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Submission Date:</span>
                <span className="text-slate-300">{formatToIST(activeModalApp.created_at)}</span>
              </div>

              <div className="py-1 border-b border-slate-800">
                <span className="text-slate-400 block mb-1.5">Selected Department(s):</span>
                <div className="flex flex-wrap gap-1.5">
                  {activeModalApp.areas_of_interest.map((dept, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded bg-cyan-950 border border-cyan-500/30 text-cyan-300 text-[11px]"
                    >
                      {dept}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between py-1">
                <span className="text-slate-400">Current Status:</span>
                <div className="flex items-center space-x-2">
                  {(['Pending', 'Shortlisted', 'Selected', 'Rejected'] as ApplicationStatus[]).map(
                    (st) => (
                      <button
                        key={st}
                        onClick={() => handleStatusChange(activeModalApp.id, st)}
                        className={`px-2 py-1 rounded text-[10px] font-bold border transition-colors ${
                          activeModalApp.application_status === st
                            ? 'bg-cyan-400 text-black border-cyan-400'
                            : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        {st}
                      </button>
                    )
                  )}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-between items-center">
              <button
                onClick={() => {
                  setDeleteConfirmApp(activeModalApp);
                }}
                className="text-rose-400 hover:text-rose-300 text-xs flex items-center space-x-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Candidate</span>
              </button>

              <button
                onClick={() => setActiveModalApp(null)}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deleteConfirmApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
          <div className="max-w-md w-full p-6 rounded-2xl bg-slate-900 border border-rose-500/40 space-y-4 font-mono text-xs">
            <div className="flex items-center space-x-2 text-rose-400">
              <AlertTriangle className="w-5 h-5" />
              <h3 className="text-base font-bold text-white">Confirm Candidate Deletion</h3>
            </div>

            <p className="text-slate-300 leading-relaxed">
              Are you sure you want to permanently delete application{' '}
              <strong className="text-cyan-400">{deleteConfirmApp.application_id}</strong> for{' '}
              <strong className="text-white">{deleteConfirmApp.full_name}</strong> (Roll:{' '}
              {deleteConfirmApp.roll_number})? This action cannot be reversed.
            </p>

            <div className="pt-3 border-t border-slate-800 flex justify-end space-x-3">
              <button
                onClick={() => setDeleteConfirmApp(null)}
                className="px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
              >
                Cancel
              </button>

              <button
                onClick={() => handleDelete(deleteConfirmApp.id)}
                disabled={actionLoading === deleteConfirmApp.id}
                className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold flex items-center space-x-1.5 disabled:opacity-50"
              >
                {actionLoading === deleteConfirmApp.id ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Trash2 className="w-3.5 h-3.5" />
                )}
                <span>CONFIRM PERMANENT DELETE</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
