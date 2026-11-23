import React, { Suspense } from 'react';
import Image from 'next/image';
import { Loader2 } from 'lucide-react';
import ApplicationForm from '@/components/ApplicationForm';

export default function HomePage() {
  return (
    <div className="py-12 sm:py-16 px-4 sm:px-6">
      <div className="max-w-lg mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-5">
          <div className="flex items-center justify-center gap-4">
            <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden ring-1 ring-white/10">
              <Image
                src="/images/ddc-logo-circle.png"
                alt="Digital Defence Club"
                fill
                className="object-contain p-1"
                priority
              />
            </div>
            <div className="w-px h-8 bg-white/10" />
            <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden ring-1 ring-white/10">
              <Image
                src="/images/cyberfest-logo-circle.png"
                alt="CyberFest 2027"
                fill
                className="object-contain p-1"
                priority
              />
            </div>
          </div>

          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Volunteer Recruitment
            </h1>
            <p className="mt-1.5 text-sm text-slate-500">
              CyberFest 2027 • Digital Defence Club, CBIT Hyderabad
            </p>
          </div>
        </div>

        {/* Form */}
        <Suspense
          fallback={
            <div className="flex items-center justify-center py-16 text-slate-400">
              <Loader2 className="w-5 h-5 animate-spin mr-2 text-cyan-400" />
              <span className="text-sm">Loading...</span>
            </div>
          }
        >
          <ApplicationForm />
        </Suspense>
      </div>
    </div>
  );
}
