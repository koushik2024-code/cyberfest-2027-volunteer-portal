'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  BarChart3,
  LogOut,
  Sliders,
  ExternalLink,
} from 'lucide-react';

export default function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/auth', { method: 'DELETE' });
      router.push('/admin/login');
      router.refresh();
    } catch {
      router.push('/admin/login');
    }
  };

  const navItems = [
    { label: 'Overview', href: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Applications', href: '/admin/applications', icon: Users },
    { label: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
  ];

  return (
    <div className="w-full bg-slate-950/80 border-b border-cyan-500/20 mb-8 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between py-4 gap-4">
          {/* Admin badge with Official Logos */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1.5 shrink-0">
              <div className="relative w-9 h-9 rounded-full bg-slate-900 border border-cyan-500/30 overflow-hidden">
                <Image
                  src="/images/ddc-logo-circle.png"
                  alt="DDC"
                  fill
                  className="object-contain p-0.5"
                />
              </div>
              <div className="relative w-9 h-9 rounded-full bg-slate-900 border border-cyan-500/30 overflow-hidden">
                <Image
                  src="/images/cyberfest-logo-circle.png"
                  alt="CyberFest 2027"
                  fill
                  className="object-contain p-0.5"
                />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-bold font-mono text-white tracking-wide">
                  DDC COMMAND CENTER
                </span>
                <span className="px-1.5 py-0.5 text-[10px] font-mono font-bold bg-cyan-950 text-cyan-300 border border-cyan-500/30 rounded">
                  ADMIN
                </span>
              </div>
              <span className="text-[11px] text-slate-400 font-mono">
                CyberFest 2027 Recruitment Management
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center space-x-2 font-mono text-xs">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/40 font-bold shadow-[0_0_15px_rgba(0,240,255,0.2)]'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900 border border-transparent'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}

            <div className="h-5 w-px bg-slate-800 mx-1" />

            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center space-x-1 px-3 py-2 text-slate-400 hover:text-cyan-400 transition-colors"
              title="View Public Site"
            >
              <span>Live Site</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>

            <button
              onClick={handleLogout}
              className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 border border-rose-500/30 text-rose-300 transition-colors"
              title="End Administrator Session"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
