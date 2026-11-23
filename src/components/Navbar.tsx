'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Shield, ShieldAlert, Menu, X, ArrowRight, Lock } from 'lucide-react';
import { SystemSettings } from '@/types';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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
    <nav className="sticky top-0 z-50 w-full border-b border-cyan-500/20 bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Brand */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative flex items-center justify-center w-11 h-11 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/40 group-hover:border-cyan-400 transition-all duration-300 shadow-[0_0_15px_rgba(0,240,255,0.25)]">
              <Shield className="w-6 h-6 text-cyan-400 group-hover:text-cyan-300 transition-colors" />
              <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center space-x-2">
                <span className="text-xl font-extrabold tracking-wider text-white font-mono">
                  CYBER<span className="text-cyan-400">FEST</span>
                </span>
                <span className="px-1.5 py-0.5 text-[10px] font-bold font-mono tracking-widest text-cyan-300 bg-cyan-950/80 border border-cyan-500/30 rounded">
                  2027
                </span>
              </div>
              <span className="text-xs text-slate-400 font-mono tracking-tight">
                DDC • CBIT HYDERABAD
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/#about"
              className="text-sm font-medium text-slate-300 hover:text-cyan-400 transition-colors font-mono"
            >
              About
            </Link>
            <Link
              href="/#why-join"
              className="text-sm font-medium text-slate-300 hover:text-cyan-400 transition-colors font-mono"
            >
              Why Join
            </Link>
            <Link
              href="/#teams"
              className="text-sm font-medium text-slate-300 hover:text-cyan-400 transition-colors font-mono"
            >
              Teams
            </Link>

            {/* Recruitment Status Pill */}
            <div className="flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800">
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
                {isOpen ? 'APPLICATIONS OPEN' : 'APPLICATIONS CLOSED'}
              </span>
            </div>

            {/* Apply CTA Button */}
            {!isAdminPage && (
              <Link
                href="/apply"
                className="relative inline-flex items-center justify-center px-5 py-2 text-sm font-bold font-mono text-black transition-all duration-300 bg-cyan-400 rounded-lg hover:bg-cyan-300 shadow-[0_0_20px_rgba(0,240,255,0.4)] group overflow-hidden"
              >
                <span className="relative z-10 flex items-center space-x-1.5">
                  <span>APPLY NOW</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            )}

            {/* Admin Portal Shortcut */}
            <Link
              href="/admin/dashboard"
              className="p-2 text-slate-400 hover:text-cyan-400 hover:bg-slate-900 rounded-lg transition-colors border border-transparent hover:border-slate-800"
              title="Admin Portal"
            >
              <Lock className="w-4 h-4" />
            </Link>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="md:hidden flex items-center space-x-3">
            <Link
              href="/apply"
              className="px-3 py-1.5 text-xs font-bold font-mono text-black bg-cyan-400 rounded hover:bg-cyan-300"
            >
              APPLY
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-300 hover:text-cyan-400 rounded-lg bg-slate-900 border border-slate-800"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-cyan-500/20 bg-slate-950/95 px-4 pt-3 pb-6 space-y-3">
          <div className="flex items-center space-x-2 px-3 py-1.5 rounded bg-slate-900 border border-slate-800 mb-2">
            <span
              className={`w-2 h-2 rounded-full ${
                isOpen ? 'bg-emerald-400 animate-pulse' : 'bg-rose-500'
              }`}
            />
            <span
              className={`text-xs font-mono font-semibold ${
                isOpen ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              {isOpen ? 'STATUS: APPLICATIONS OPEN' : 'STATUS: CLOSED'}
            </span>
          </div>

          <Link
            href="/#about"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-base font-mono text-slate-300 hover:text-cyan-400"
          >
            About CyberFest
          </Link>
          <Link
            href="/#why-join"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-base font-mono text-slate-300 hover:text-cyan-400"
          >
            Why Join Us
          </Link>
          <Link
            href="/#teams"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-base font-mono text-slate-300 hover:text-cyan-400"
          >
            Recruitment Teams
          </Link>
          <Link
            href="/apply"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-base font-mono font-bold text-cyan-400 hover:underline"
          >
            Volunteer Application Form →
          </Link>
          <Link
            href="/admin/dashboard"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-xs font-mono text-slate-500 hover:text-slate-300"
          >
            Admin Dashboard Login
          </Link>
        </div>
      )}
    </nav>
  );
}
