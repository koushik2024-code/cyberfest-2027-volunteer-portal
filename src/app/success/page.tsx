'use client';

import React, { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  CheckCircle2,
  Copy,
  Check,
  ArrowLeft,
  Loader2,
} from 'lucide-react';
import Image from 'next/image';
import confetti from 'canvas-confetti';
import { Application } from '@/types';
import { formatToIST } from '@/lib/dateUtils';

function SuccessContent() {
  const searchParams = useSearchParams();
  const refParam = searchParams.get('ref');

  const [application, setApplication] = useState<Application | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    try {
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#00d4ff', '#38bdf8', '#2563eb'],
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

  const refId = application?.application_id || refParam || 'SUBMITTED';

  return (
    <div className="py-16 px-4 sm:px-6">
      <div className="max-w-lg mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <div className="relative w-10 h-10 rounded-full overflow-hidden ring-1 ring-white/10">
              <Image
                src="/images/ddc-logo-circle.png"
                alt="DDC"
                fill
                className="object-contain p-0.5"
              />
            </div>
            <div className="relative w-10 h-10 rounded-full overflow-hidden ring-1 ring-white/10">
              <Image
                src="/images/cyberfest-logo-circle.png"
                alt="CyberFest 2027"
                fill
                className="object-contain p-0.5"
              />
            </div>
          </div>

          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-emerald-500/10 text-emerald-400">
            <CheckCircle2 className="w-7 h-7" />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-white">Application Submitted</h1>
            <p className="mt-1.5 text-sm text-slate-400">
              Your volunteer application has been recorded successfully.
            </p>
          </div>
        </div>

        {/* Reference ID */}
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-white/[0.06]">
          <div className="flex items-center justify-between pb-4 border-b border-white/[0.06]">
            <div>
              <span className="text-xs text-slate-500 block mb-1">Reference ID</span>
              <span className="text-xl font-bold text-cyan-400 tracking-wider">
                {refId}
              </span>
            </div>
            <button
              onClick={copyRefId}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-xs text-slate-400 border border-white/[0.06] transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-6 text-slate-500">
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
              <span className="text-sm">Loading details...</span>
            </div>
          ) : application ? (
            <div className="mt-4 space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Name</span>
                <span className="text-white font-medium">{application.full_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Roll Number</span>
                <span className="text-slate-300">{application.roll_number}</span>
              </div>
              <div className="flex flex-col gap-1.5">
                <span className="text-slate-500">Areas of Interest</span>
                <div className="flex flex-wrap gap-1.5">
                  {application.areas_of_interest.map((dept, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded-md bg-cyan-400/[0.08] border border-cyan-400/20 text-cyan-300 text-xs"
                    >
                      {dept}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Submitted</span>
                <span className="text-slate-400 text-xs">{formatToIST(application.created_at)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Status</span>
                <span className="px-2 py-0.5 rounded-md bg-amber-400/10 border border-amber-400/20 text-amber-400 text-xs font-medium">
                  {application.application_status}
                </span>
              </div>
            </div>
          ) : (
            <p className="mt-4 text-sm text-slate-500">
              Save your Reference ID for future correspondence.
            </p>
          )}
        </div>

        {/* What&apos;s Next */}
        <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04] text-sm text-slate-500 space-y-2">
          <span className="text-xs font-medium text-slate-400 block">What happens next?</span>
          <ul className="space-y-1.5 text-xs text-slate-500">
            <li>• The DDC team will review all applications</li>
            <li>• Shortlisted candidates will be contacted via official channels</li>
            <li>• Selected volunteers will receive orientation details</li>
          </ul>
        </div>

        {/* Back */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-sm text-slate-400 border border-white/[0.06] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[60vh] text-slate-400">
          <Loader2 className="w-6 h-6 animate-spin" />
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
