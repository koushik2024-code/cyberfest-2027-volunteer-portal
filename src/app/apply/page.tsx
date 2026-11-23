import React, { Suspense } from 'react';
import Link from 'next/link';
import { Shield, ArrowLeft, CheckCircle2, AlertTriangle, Loader2 } from 'lucide-react';
import ApplicationForm from '@/components/ApplicationForm';
import { EVENT_DETAILS } from '@/lib/constants';

export const metadata = {
  title: 'Volunteer Application | CyberFest 2027',
  description: 'Submit your volunteer application for CyberFest 2027, organized by Digital Defence Club (DDC), CBIT Hyderabad.',
};

export default function ApplyPage() {
  return (
    <div className="py-14 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-10">
        {/* Navigation & Header */}
        <div>
          <Link
            href="/"
            className="inline-flex items-center space-x-1.5 text-xs font-mono text-cyan-400 hover:text-cyan-300 transition-colors mb-6"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>BACK TO HOME</span>
          </Link>

          <div className="space-y-3">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-xs font-mono text-cyan-300">
              <Shield className="w-3.5 h-3.5 text-cyan-400" />
              <span>OFFICIAL DDC RECRUITMENT FORM</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold font-mono text-white tracking-tight">
              CyberFest 2027 Volunteer Application
            </h1>

            <p className="text-sm sm:text-base text-slate-400 font-sans leading-relaxed">
              Complete the verification form below to apply for the CyberFest 2027 organizing
              crew at {EVENT_DETAILS.institution}.
            </p>
          </div>
        </div>

        {/* Guidelines Callout */}
        <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs font-mono text-slate-300 space-y-2">
          <span className="font-bold text-cyan-400 block uppercase tracking-wider">
            [ APPLICANT GUIDELINES ]
          </span>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-slate-400">
            <div className="flex items-start space-x-2">
              <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <span>Open to all active students of CBIT across CET, AI&DS, IT, CSE, and core branches.</span>
            </div>
            <div className="flex items-start space-x-2">
              <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <span>Strict duplicate check: Exactly one application allowed per Roll Number.</span>
            </div>
            <div className="flex items-start space-x-2">
              <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <span>Multi-disciplinary: You can select one or multiple departments of interest.</span>
            </div>
            <div className="flex items-start space-x-2">
              <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <span>Permanent record: An immutable Reference ID is generated upon submission.</span>
            </div>
          </div>
        </div>

        {/* Application Form */}
        <Suspense
          fallback={
            <div className="flex items-center justify-center p-12 text-cyan-400 font-mono">
              <Loader2 className="w-6 h-6 animate-spin mr-2" />
              <span>Loading application portal...</span>
            </div>
          }
        >
          <ApplicationForm />
        </Suspense>
      </div>
    </div>
  );
}
