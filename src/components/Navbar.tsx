'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Shield, Lock } from 'lucide-react';
import { SystemSettings } from '@/types';

export default function Navbar() {
  const [settings, setSettings] = useState<SystemSettings | null>(null);
  const pathname = usePathname();

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
  const isAdminPage = pathname.startsWith('/admin');

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-cyan-500/20 bg-slate-950/85 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Brand: Volunteer Recruitment */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative flex items-center justify-center w-11 h-11 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/40 group-hover:border-cyan-400 transition-all duration-300 shadow-[0_0_15px_rgba(0,240,255,0.25)]">
              <Shield className="w-6 h-6 text-cyan-400 group-hover:text-cyan-300 transition-colors" />
              <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center space-x-2">
                <span className="text-lg sm:text-xl font-extrabold tracking-wider text-white font-mono uppercase">
                  VOLUNTEER <span className="text-cyan-400">RECRUITMENT</span>
                </span>
              </div>
              <span className="text-[11px] text-slate-400 font-mono tracking-tight">
                CYBERFEST 2027 • DDC CBIT HYDERABAD
              </span>
            </div>
          </Link>

          {/* Right Header Status & Admin Portal */}
          <div className="flex items-center space-x-4">
            {/* Recruitment Status Pill */}
            <div className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800">
              <span
                className={`w-2 h-2 rounded-full ${
                  isOpen ? 'bg-emerald-400 animate-ping' : 'bg-rose-500'
                }`}
              />
              <span
                className={`text-xs font-mono font-semibold ${
                  isOpen ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                {isOpen ? 'APPLICATIONS OPEN' : 'CLOSED'}
              </span>
            </div>

            {/* Admin Portal Shortcut */}
            <Link
              href="/admin/dashboard"
              className="p-2 text-slate-400 hover:text-cyan-400 hover:bg-slate-900 rounded-lg transition-colors border border-transparent hover:border-slate-800"
              title="Admin Portal"
            >
              <Lock className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
