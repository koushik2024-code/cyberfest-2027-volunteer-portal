import React, { Suspense } from 'react';
import Image from 'next/image';
import { Shield, CheckCircle2, Loader2 } from 'lucide-react';
import ApplicationForm from '@/components/ApplicationForm';
import { EVENT_DETAILS } from '@/lib/constants';

export default function HomePage() {
  return (
    <div className="py-10 sm:py-14 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header Branding with Official Logos */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-5">
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full p-1 bg-slate-900/90 border-2 border-cyan-500/40 shadow-[0_0_25px_rgba(0,240,255,0.35)]">
              <Image
                src="/images/ddc-logo-circle.png"
                alt="Digital Defence Club (DDC) Logo"
                fill
                className="object-contain p-1 rounded-full"
                priority
              />
            </div>
            <div className="h-10 w-[1px] bg-cyan-500/30" />
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full p-1 bg-slate-900/90 border-2 border-cyan-500/40 shadow-[0_0_25px_rgba(0,240,255,0.35)]">
              <Image
                src="/images/cyberfest-logo-circle.png"
                alt="CyberFest 2027 Logo"
                fill
                className="object-contain p-1 rounded-full"
                priority
              />
            </div>
          </div>

          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-cyan-500/30 text-xs font-mono text-cyan-300 shadow-[0_0_15px_rgba(0,240,255,0.2)]">
            <Shield className="w-3.5 h-3.5 text-cyan-400" />
            <span>{EVENT_DETAILS.organizer} • {EVENT_DETAILS.institution}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black font-mono tracking-tight text-white uppercase">
            VOLUNTEER <span className="text-cyan-400 drop-shadow-[0_0_20px_rgba(0,240,255,0.7)]">RECRUITMENT</span>
          </h1>

          <div className="space-y-1">
            <h2 className="text-base sm:text-lg font-mono font-bold text-slate-300 tracking-wide uppercase">
              {EVENT_DETAILS.name} Registration Portal
            </h2>
            <p className="text-xs sm:text-sm font-mono text-cyan-400/90">
              &ldquo;{EVENT_DETAILS.tagline}&rdquo;
            </p>
          </div>
        </div>

        {/* Quick Instructions */}
        <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs font-mono text-slate-300">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-slate-400 text-[11px] sm:text-xs">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span>Open to all CBIT branches &amp; years</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span>1 submission per Roll Number</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span>Multi-select department options</span>
            </div>
          </div>
        </div>

        {/* Volunteer Application Form */}
        <Suspense
          fallback={
            <div className="flex items-center justify-center p-12 text-cyan-400 font-mono">
              <Loader2 className="w-6 h-6 animate-spin mr-2" />
              <span>Loading registration portal...</span>
            </div>
          }
        >
          <ApplicationForm />
        </Suspense>
      </div>
    </div>
  );
}
