'use client';

import React, { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  CheckCircle2,
  Shield,
  Copy,
  Check,
  Printer,
  ArrowLeft,
  Calendar,
  User,
  Hash,
  Layers,
  Sparkles,
  Loader2,
} from 'lucide-react';
import Image from 'next/image';
import confetti from 'canvas-confetti';
import { Application } from '@/types';
import { formatToIST } from '@/lib/dateUtils';
import { EVENT_DETAILS } from '@/lib/constants';

function SuccessContent() {
  const searchParams = useSearchParams();
  const refParam = searchParams.get('ref');

  const [application, setApplication] = useState<Application | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Launch celebratory confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#00f0ff', '#38bdf8', '#2563eb', '#00ff9d'],
      });
    } catch {}

    if (refParam) {
      fetch(`/api/applications?ref=${encodeURIComponent(refParam)}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.application) {
            setApplication(data.application);
          }
        })
        .catch(() => {})
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, [refParam]);

  const copyRefId = () => {
    const idToCopy = application?.application_id || refParam || '';
    if (idToCopy) {
      navigator.clipboard.writeText(idToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const refId = application?.application_id || refParam || 'CF27-VOL-SUBMITTED';

  return (
    <div className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Success Header with Official Logos */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-4">
            <div className="relative w-12 h-12 rounded-full p-0.5 bg-slate-900 border border-cyan-500/40 shadow-[0_0_15px_rgba(0,240,255,0.3)]">
              <Image
                src="/images/ddc-logo-circle.png"
                alt="Digital Defence Club"
                fill
                className="object-contain p-0.5 rounded-full"
              />
            </div>
            <div className="relative w-12 h-12 rounded-full p-0.5 bg-slate-900 border border-cyan-500/40 shadow-[0_0_15px_rgba(0,240,255,0.3)]">
              <Image
                src="/images/cyberfest-logo-circle.png"
                alt="CyberFest 2027"
                fill
                className="object-contain p-0.5 rounded-full"
              />
            </div>
          </div>

          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-cyan-500/10 border border-cyan-400 text-cyan-400 shadow-[0_0_30px_rgba(0,240,255,0.4)] animate-bounce">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-cyan-400">
              [ TRANSMISSION CONFIRMED ]
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold font-mono text-white">
              Application Successfully Submitted!
            </h1>
            <p className="text-sm text-slate-400 font-sans max-w-lg mx-auto">
              Your volunteer application for CyberFest 2027 has been securely recorded in the
              Digital Defence Club database.
            </p>
          </div>
        </div>

        {/* Reference ID Card */}
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-cyan-500/40 shadow-[0_0_35px_rgba(0,240,255,0.15)] relative overflow-hidden backdrop-blur-md">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-5 border-b border-slate-800">
            <div>
              <span className="text-xs font-mono text-slate-400 block">
                APPLICATION REFERENCE ID:
              </span>
              <span className="text-2xl sm:text-3xl font-mono font-black text-cyan-400 tracking-wider">
                {refId}
              </span>
            </div>

            <button
              onClick={copyRefId}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-mono text-slate-300 border border-slate-700 transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">COPIED</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-cyan-400" />
                  <span>COPY ID</span>
                </>
              )}
            </button>
          </div>

          {/* Details breakdown */}
          <div className="mt-5 space-y-3 font-mono text-xs">
            {isLoading ? (
              <div className="flex items-center justify-center py-6 text-slate-400">
                <Loader2 className="w-5 h-5 animate-spin mr-2 text-cyan-400" />
                <span>Fetching submission credentials...</span>
              </div>
            ) : application ? (
              <>
                <div className="flex items-center justify-between py-1.5 border-b border-slate-800/60">
                  <span className="text-slate-400 flex items-center space-x-2">
                    <User className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Candidate Name:</span>
                  </span>
                  <span className="text-white font-bold">{application.full_name}</span>
                </div>

                <div className="flex items-center justify-between py-1.5 border-b border-slate-800/60">
                  <span className="text-slate-400 flex items-center space-x-2">
                    <Hash className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Roll Number:</span>
                  </span>
                  <span className="text-cyan-300 font-bold">{application.roll_number}</span>
                </div>

                <div className="flex flex-col py-1.5 border-b border-slate-800/60 gap-1.5">
                  <span className="text-slate-400 flex items-center space-x-2">
                    <Layers className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Selected Department(s):</span>
                  </span>
                  <div className="flex flex-wrap gap-1.5 pl-5">
                    {application.areas_of_interest.map((dept, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-[11px]"
                      >
                        {dept}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between py-1.5 border-b border-slate-800/60">
                  <span className="text-slate-400 flex items-center space-x-2">
                    <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Submission Timestamp (IST):</span>
                  </span>
                  <span className="text-slate-300">{formatToIST(application.created_at)}</span>
                </div>

                <div className="flex items-center justify-between py-1.5">
                  <span className="text-slate-400">Application Status:</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 font-bold">
                    {application.application_status}
                  </span>
                </div>
              </>
            ) : (
              <div className="py-2 text-slate-400">
                Application recorded. Keep your Reference ID safely for future correspondence.
              </div>
            )}
          </div>
        </div>

        {/* Next Steps Card */}
        <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 text-xs font-mono space-y-3">
          <span className="font-bold text-cyan-400 block uppercase tracking-wider">
            [ RECRUITMENT TIMELINE & NEXT STEPS ]
          </span>
          <ol className="list-decimal list-inside space-y-2 text-slate-400 leading-relaxed">
            <li>
              <strong className="text-slate-200">Executive Board Review:</strong> The DDC Core Team
              and Department Leads will evaluate applicant profiles based on branch, interest, and
              prior background.
            </li>
            <li>
              <strong className="text-slate-200">Shortlisting Announcement:</strong> Shortlisted
              students will be contacted via college circulars and official DDC group invites.
            </li>
            <li>
              <strong className="text-slate-200">Orientation & Task Briefing:</strong> Mandatory
              conclave training and on-ground deployment rehearsals at CBIT campus.
            </li>
          </ol>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 text-xs font-mono font-bold transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>RETURN TO HOMEPAGE</span>
          </Link>

          <button
            onClick={handlePrint}
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-3 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-black text-xs font-mono font-bold transition-all shadow-[0_0_20px_rgba(0,240,255,0.3)]"
          >
            <Printer className="w-4 h-4" />
            <span>PRINT / SAVE RECEIPT</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[60vh] text-cyan-400 font-mono">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
