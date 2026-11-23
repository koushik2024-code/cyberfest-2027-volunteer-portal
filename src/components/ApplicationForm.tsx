'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Shield,
  Check,
  AlertCircle,
  Loader2,
  Lock,
  Sparkles,
  Info,
  CalendarX,
  FileCheck2,
} from 'lucide-react';
import { DEPARTMENTS } from '@/lib/constants';
import { DepartmentName, SystemSettings } from '@/types';
import { validateFullName, validateRollNumber } from '@/lib/validation';

export default function ApplicationForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Form State
  const [fullName, setFullName] = useState('');
  const [rollNumber, setRollNumber] = useState('');
  const [selectedAreas, setSelectedAreas] = useState<DepartmentName[]>([]);

  // Validation & Submission State
  const [clientErrors, setClientErrors] = useState<{
    fullName?: string;
    rollNumber?: string;
    areasOfInterest?: string;
  }>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [settings, setSettings] = useState<SystemSettings | null>(null);
  const [isLoadingSettings, setIsLoadingSettings] = useState(true);

  // Initialize department from query parameter if provided (e.g. /apply?dept=Technical)
  useEffect(() => {
    const deptQuery = searchParams.get('dept');
    if (deptQuery) {
      const match = DEPARTMENTS.find(
        (d) => d.name.toLowerCase() === deptQuery.toLowerCase()
      );
      if (match && !selectedAreas.includes(match.name)) {
        setSelectedAreas([match.name]);
      }
    }
  }, [searchParams]);

  // Fetch recruitment settings
  useEffect(() => {
    fetch('/api/admin/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.settings) {
          setSettings(data.settings);
        }
      })
      .catch(() => {})
      .finally(() => setIsLoadingSettings(false));
  }, []);

  // Toggle department checkbox
  const toggleDepartment = (dept: DepartmentName) => {
    if (selectedAreas.includes(dept)) {
      setSelectedAreas(selectedAreas.filter((d) => d !== dept));
    } else {
      setSelectedAreas([...selectedAreas, dept]);
    }
    // Clear area error if any
    if (clientErrors.areasOfInterest) {
      setClientErrors((prev) => ({ ...prev, areasOfInterest: undefined }));
    }
  };

  // Select all or clear all
  const selectAll = () => {
    setSelectedAreas(DEPARTMENTS.map((d) => d.name));
    setClientErrors((prev) => ({ ...prev, areasOfInterest: undefined }));
  };

  const clearAll = () => {
    setSelectedAreas([]);
  };

  // Form submission handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    // 1. Client-Side Validation
    const nameValidation = validateFullName(fullName);
    const rollValidation = validateRollNumber(rollNumber);
    const hasAreas = selectedAreas.length > 0;

    const errors: { fullName?: string; rollNumber?: string; areasOfInterest?: string } = {};

    if (!nameValidation.isValid) {
      errors.fullName = nameValidation.error;
    }
    if (!rollValidation.isValid) {
      errors.rollNumber = rollValidation.error;
    }
    if (!hasAreas) {
      errors.areasOfInterest = 'Please select at least one department you want to contribute to.';
    }

    if (Object.keys(errors).length > 0) {
      setClientErrors(errors);
      return;
    }

    setClientErrors({});
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: fullName.trim(),
          rollNumber: rollNumber.trim().toUpperCase(),
          areasOfInterest: selectedAreas,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setServerError(
          data.error || 'Failed to submit application. Please check your inputs and try again.'
        );
        setIsSubmitting(false);
        return;
      }

      // Successful submission -> redirect to /success with application reference ID
      const refId = data.application?.application_id || 'SUCCESS';
      router.push(`/success?ref=${encodeURIComponent(refId)}`);
    } catch (err: any) {
      setServerError('A network error occurred. Please check your connection and try again.');
      setIsSubmitting(false);
    }
  };

  if (isLoadingSettings) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-cyan-400 font-mono">
        <Loader2 className="w-8 h-8 animate-spin mb-3" />
        <p className="text-sm">Verifying recruitment portal status...</p>
      </div>
    );
  }

  // If recruitment is closed by admin:
  if (settings && !settings.is_open) {
    return (
      <div className="max-w-2xl mx-auto p-8 rounded-2xl bg-slate-900/90 border border-rose-500/30 text-center font-mono">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-rose-500/10 border border-rose-500/40 text-rose-400 mb-4">
          <CalendarX className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">APPLICATIONS CLOSED</h2>
        <p className="text-sm text-slate-400 max-w-lg mx-auto mb-6">
          The recruitment window for CyberFest 2027 volunteer positions has concluded. Thank you
          to all the students who submitted their applications.
        </p>
        <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 text-xs text-cyan-300">
          Selected applicants will be notified via institutional circulars and official DDC
          communications.
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <form
        onSubmit={handleSubmit}
        noValidate
        className="relative p-6 sm:p-10 rounded-2xl bg-slate-900/80 border border-cyan-500/30 shadow-[0_0_40px_rgba(0,240,255,0.08)] backdrop-blur-md"
      >
        {/* Glow corners */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-600/10 rounded-full blur-2xl pointer-events-none" />

        {/* Server Error Alert */}
        {serverError && (
          <div className="mb-6 p-4 rounded-xl bg-rose-950/80 border border-rose-500/50 text-rose-300 flex items-start space-x-3 font-mono text-sm animate-pulse">
            <AlertCircle className="w-5 h-5 text-rose-400 mt-0.5 shrink-0" />
            <div>
              <span className="font-bold block">Submission Error:</span>
              <span>{serverError}</span>
            </div>
          </div>
        )}

        {/* Section 1: Personal Identification */}
        <div className="space-y-6">
          <div>
            <label
              htmlFor="fullName"
              className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-300 mb-1.5"
            >
              Full Name <span className="text-cyan-400">*</span>
            </label>
            <div className="relative">
              <input
                id="fullName"
                type="text"
                autoComplete="name"
                value={fullName}
                onChange={(e) => {
                  setFullName(e.target.value);
                  if (clientErrors.fullName) {
                    setClientErrors((prev) => ({ ...prev, fullName: undefined }));
                  }
                }}
                placeholder="e.g. Koushik Ram Reddy"
                className={`w-full px-4 py-3 rounded-xl bg-slate-950 border text-white placeholder-slate-600 font-mono text-sm focus:outline-none transition-all duration-200 ${
                  clientErrors.fullName
                    ? 'border-rose-500 focus:ring-2 focus:ring-rose-500/40'
                    : 'border-slate-800 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/30'
                }`}
              />
            </div>
            {clientErrors.fullName && (
              <p className="mt-1.5 text-xs text-rose-400 font-mono flex items-center space-x-1">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{clientErrors.fullName}</span>
              </p>
            )}
            <p className="mt-1 text-[11px] text-slate-500 font-mono">
              Enter your official name as registered with CBIT academic records.
            </p>
          </div>

          <div>
            <label
              htmlFor="rollNumber"
              className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-300 mb-1.5"
            >
              Roll Number <span className="text-cyan-400">*</span>
            </label>
            <div className="relative">
              <input
                id="rollNumber"
                type="text"
                autoComplete="off"
                value={rollNumber}
                onChange={(e) => {
                  setRollNumber(e.target.value.toUpperCase());
                  if (clientErrors.rollNumber) {
                    setClientErrors((prev) => ({ ...prev, rollNumber: undefined }));
                  }
                }}
                placeholder="e.g. 160123733045"
                className={`w-full px-4 py-3 rounded-xl bg-slate-950 border text-white uppercase placeholder-slate-600 font-mono text-sm tracking-wider focus:outline-none transition-all duration-200 ${
                  clientErrors.rollNumber
                    ? 'border-rose-500 focus:ring-2 focus:ring-rose-500/40'
                    : 'border-slate-800 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/30'
                }`}
              />
            </div>
            {clientErrors.rollNumber && (
              <p className="mt-1.5 text-xs text-rose-400 font-mono flex items-center space-x-1">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{clientErrors.rollNumber}</span>
              </p>
            )}
            <p className="mt-1 text-[11px] text-slate-500 font-mono">
              Duplicate submissions with the same roll number are strictly prevented by the
              database.
            </p>
          </div>
        </div>

        {/* Section 2: Department Selection (Multi-select) */}
        <div className="mt-8 pt-8 border-t border-slate-800">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 gap-2">
            <div>
              <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
                Area(s) of Interest <span className="text-cyan-400">*</span>
              </label>
              <p className="text-[11px] text-slate-400 font-mono">
                Select one or multiple departments you would like to be considered for.
              </p>
            </div>
            <div className="flex items-center space-x-3 text-xs font-mono">
              <button
                type="button"
                onClick={selectAll}
                className="text-cyan-400 hover:text-cyan-300 underline"
              >
                Select All
              </button>
              <span className="text-slate-600">•</span>
              <button
                type="button"
                onClick={clearAll}
                className="text-slate-400 hover:text-slate-200 underline"
              >
                Clear
              </button>
            </div>
          </div>

          {clientErrors.areasOfInterest && (
            <p className="mb-3 text-xs text-rose-400 font-mono flex items-center space-x-1">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{clientErrors.areasOfInterest}</span>
            </p>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
            {DEPARTMENTS.map((dept) => {
              const isSelected = selectedAreas.includes(dept.name);
              return (
                <div
                  key={dept.name}
                  onClick={() => toggleDepartment(dept.name)}
                  className={`cursor-pointer select-none p-3.5 rounded-xl border transition-all duration-200 flex items-start space-x-3 ${
                    isSelected
                      ? 'bg-cyan-950/40 border-cyan-400 shadow-[0_0_15px_rgba(0,240,255,0.2)]'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div
                    className={`mt-0.5 flex items-center justify-center w-5 h-5 rounded border transition-colors ${
                      isSelected
                        ? 'bg-cyan-400 border-cyan-400 text-black'
                        : 'border-slate-700 bg-slate-900'
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>

                  <div className="flex-1">
                    <span
                      className={`text-sm font-mono font-bold block ${
                        isSelected ? 'text-cyan-300' : 'text-slate-200'
                      }`}
                    >
                      {dept.name}
                    </span>
                    <span className="text-[11px] text-slate-400 line-clamp-1 block">
                      {dept.tagline}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-3 flex items-center justify-between text-xs font-mono text-slate-400">
            <span>{selectedAreas.length} department(s) selected</span>
          </div>
        </div>

        {/* Data Privacy & Minimal Information Notice */}
        <div className="mt-8 p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center space-x-3 text-xs font-mono text-slate-400">
          <Lock className="w-4 h-4 text-cyan-400 shrink-0" />
          <span>
            Privacy Notice: Only mandatory fields (Name, Roll No, Department) are collected. No
            extraneous personal data is stored.
          </span>
        </div>

        {/* Submit Button */}
        <div className="mt-8">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full relative flex items-center justify-center space-x-2 py-4 px-6 rounded-xl font-mono font-bold text-sm tracking-wider uppercase transition-all duration-300 bg-gradient-to-r from-cyan-400 to-blue-500 text-black hover:from-cyan-300 hover:to-blue-400 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_30px_rgba(0,240,255,0.4)]"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>CRYPTOGRAPHICALLY VERIFYING & SUBMITTING...</span>
              </>
            ) : (
              <>
                <FileCheck2 className="w-5 h-5" />
                <span>SUBMIT VOLUNTEER APPLICATION</span>
              </>
            )}
          </button>
        </div>

        <p className="mt-3 text-center text-[11px] font-mono text-slate-500">
          Upon successful submission, you will receive an immutable Application Reference ID.
        </p>
      </form>
    </div>
  );
}
