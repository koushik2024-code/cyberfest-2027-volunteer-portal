'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { SystemSettings } from '@/types';

export default function Navbar() {
  const [settings, setSettings] = useState<SystemSettings | null>(null);

  useEffect(() => {
    fetch('/api/admin/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.settings) {
          setSettings(data.settings);
        }
      })
      .catch(() => {});
  }, []);

  const isOpen = settings ? settings.is_open : true;

  return (
    <nav className="sticky top-0 z-50 w-full bg-slate-950/80 backdrop-blur-xl border-b border-white/[0.06]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="flex items-center gap-1.5">
              <div className="relative w-9 h-9 rounded-full overflow-hidden ring-1 ring-white/10 group-hover:ring-cyan-400/40 transition-all">
                <Image
                  src="/images/ddc-logo-circle.png"
                  alt="DDC"
                  fill
                  className="object-contain p-0.5"
                  priority
                />
              </div>
              <div className="relative w-9 h-9 rounded-full overflow-hidden ring-1 ring-white/10 group-hover:ring-cyan-400/40 transition-all">
                <Image
                  src="/images/cyberfest-logo-circle.png"
                  alt="CyberFest 2027"
                  fill
                  className="object-contain p-0.5"
                  priority
                />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-white tracking-wide">
                Volunteer <span className="text-cyan-400">Recruitment</span>
              </span>
              <span className="text-[10px] text-slate-500 tracking-tight">
                CyberFest 2027 • DDC CBIT
              </span>
            </div>
          </Link>

          {/* Status Pill */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.06]">
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                isOpen
                  ? 'bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.6)]'
                  : 'bg-red-400'
              }`}
            />
            <span
              className={`text-[11px] font-medium tracking-wide ${
                isOpen ? 'text-emerald-400' : 'text-red-400'
              }`}
            >
              {isOpen ? 'Registrations Open' : 'Closed'}
            </span>
          </div>
        </div>
      </div>
    </nav>
  );
}
