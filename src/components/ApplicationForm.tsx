'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Check,
  AlertCircle,
  Loader2,
  Lock,
  CalendarX,
  Send,
} from 'lucide-react';
import { DEPARTMENTS } from '@/lib/constants';
import { DepartmentName, SystemSettings } from '@/types';
import { validateFullName, validateRollNumber } from '@/lib/validation';

export default function ApplicationForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [fullName, setFullName] = useState('');
  const [rollNumber, setRollNumber] = useState('');
  const [selectedAreas, setSelectedAreas] = useState<DepartmentName[]>([]);

  const [clientErrors, setClientErrors] = useState<{
    fullName?: string;
    rollNumber?: string;
    areasOfInterest?: string;
  }>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [settings, setSettings] = useState<SystemSettings | null>(null);
  const [isLoadingSettings, setIsLoadingSettings] = useState(true);

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

  const toggleDepartment = (dept: DepartmentName) => {
    if (selectedAreas.includes(dept)) {
      setSelectedAreas(selectedAreas.filter((d) => d !== dept));
    } else {
      setSelectedAreas([...selectedAreas, dept]);
    }
    if (clientErrors.areasOfInterest) {
      setClientErrors((prev) => ({ ...prev, areasOfInterest: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    const nameValidation = validateFullName(fullName);
    const rollValidation = validateRollNumber(rollNumber);
    const hasAreas = selectedAreas.length > 0;

    const errors: { fullName?: string; rollNumber?: string; areasOfInterest?: string } = {};

    if (!nameValidation.isValid) errors.fullName = nameValidation.error;
    if (!rollValidation.isValid) errors.rollNumber = rollValidation.error;
    if (!hasAreas) errors.areasOfInterest = 'Select at least one area of interest.';

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
          data.error || 'Failed to submit application. Please try again.'
        );
        setIsSubmitting(false);
        return;
      }

      const refId = data.application?.application_id || 'SUCCESS';
      router.push(`/success?ref=${encodeURIComponent(refId)}`);
    } catch {
      setServerError('Network error. Please check your connection and try again.');
      setIsSubmitting(false);
    }
  };

  if (isLoadingSettings) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-400">
        <Loader2 className="w-6 h-6 animate-spin mb-3 text-cyan-400" />
        <p className="text-sm">Loading...</p>
      </div>
    );
  }

  if (settings && !settings.is_open) {
    return (
      <div className="max-w-lg mx-auto p-8 rounded-2xl bg-slate-900/60 border border-white/[0.06] text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-red-500/10 text-red-400 mb-4">
          <CalendarX className="w-7 h-7" />
        </div>
        <h2 className="text-xl font-semibold text-white mb-2">Registrations Closed</h2>
        <p className="text-sm text-slate-400 max-w-sm mx-auto">
          The registration window for CyberFest 2027 volunteers has ended.
          Selected candidates will be notified through official channels.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="space-y-6"
    >
      {/* Server Error */}
      {serverError && (
        <div className="p-4 rounded-xl bg-red-950/50 border border-red-500/20 text-red-300 flex items-start gap-3 text-sm">
          <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 shrink-0" />
          <span>{serverError}</span>
        </div>
      )}

      {/* Full Name */}
      <div>
        <label
          htmlFor="fullName"
          className="block text-sm font-medium text-slate-300 mb-2"
        >
          Full Name <span className="text-cyan-400">*</span>
        </label>
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
          placeholder="Enter your full name"
          className={`w-full px-4 py-3 rounded-xl bg-white/[0.03] border text-white placeholder-slate-600 text-sm focus:outline-none transition-all ${
            clientErrors.fullName
              ? 'border-red-500/50 focus:border-red-400'
              : 'border-white/[0.08] focus:border-cyan-400/50 focus:bg-white/[0.05]'
          }`}
        />
        {clientErrors.fullName && (
          <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            {clientErrors.fullName}
          </p>
        )}
        <p className="mt-1 text-[11px] text-slate-600">
          As registered with CBIT academic records.
        </p>
      </div>

      {/* Roll Number */}
      <div>
        <label
          htmlFor="rollNumber"
          className="block text-sm font-medium text-slate-300 mb-2"
        >
          Roll Number <span className="text-cyan-400">*</span>
        </label>
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
          className={`w-full px-4 py-3 rounded-xl bg-white/[0.03] border text-white uppercase placeholder-slate-600 text-sm tracking-wider focus:outline-none transition-all ${
            clientErrors.rollNumber
              ? 'border-red-500/50 focus:border-red-400'
              : 'border-white/[0.08] focus:border-cyan-400/50 focus:bg-white/[0.05]'
          }`}
        />
        {clientErrors.rollNumber && (
          <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            {clientErrors.rollNumber}
          </p>
        )}
        <p className="mt-1 text-[11px] text-slate-600">
          One submission per roll number.
        </p>
      </div>

      {/* Areas of Interest */}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-3">
          Areas of Interest <span className="text-cyan-400">*</span>
        </label>

        {clientErrors.areasOfInterest && (
          <p className="mb-3 text-xs text-red-400 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            {clientErrors.areasOfInterest}
          </p>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-2 gap-2">
          {DEPARTMENTS.map((dept) => {
            const isSelected = selectedAreas.includes(dept.name);
            return (
              <button
                key={dept.name}
                type="button"
                onClick={() => toggleDepartment(dept.name)}
                className={`relative text-left px-3.5 py-3 rounded-xl border transition-all text-sm ${
                  isSelected
                    ? 'bg-cyan-400/[0.08] border-cyan-400/30 text-cyan-300'
                    : 'bg-white/[0.02] border-white/[0.06] text-slate-400 hover:border-white/[0.12] hover:text-slate-300'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className={`flex items-center justify-center w-4.5 h-4.5 rounded border transition-all ${
                      isSelected
                        ? 'bg-cyan-400 border-cyan-400'
                        : 'border-slate-600 bg-transparent'
                    }`}
                    style={{ width: '18px', height: '18px', minWidth: '18px' }}
                  >
                    {isSelected && <Check className="w-3 h-3 text-black stroke-[3]" />}
                  </div>
                  <span className="font-medium text-[13px]">{dept.name}</span>
                </div>
              </button>
            );
          })}
        </div>

        <p className="mt-2 text-[11px] text-slate-600">
          {selectedAreas.length} selected
        </p>
      </div>

      {/* Privacy */}
      <div className="flex items-center gap-2.5 py-3 px-4 rounded-xl bg-white/[0.02] border border-white/[0.04] text-xs text-slate-500">
        <Lock className="w-3.5 h-3.5 text-slate-600 shrink-0" />
        <span>Only your name, roll number, and department preferences are collected.</span>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl font-medium text-sm transition-all bg-cyan-400 text-black hover:bg-cyan-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(0,200,255,0.15)] hover:shadow-[0_0_30px_rgba(0,200,255,0.25)]"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Submitting...</span>
          </>
        ) : (
          <>
            <Send className="w-4 h-4" />
            <span>Submit Application</span>
          </>
        )}
      </button>
    </form>
  );
}
