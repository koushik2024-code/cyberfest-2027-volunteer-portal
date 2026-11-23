import React from 'react';
import Link from 'next/link';
import { Shield, Terminal, Mail, MapPin } from 'lucide-react';
import { EVENT_DETAILS } from '@/lib/constants';

export default function Footer() {
  return (
    <footer className="relative z-10 border-t border-cyan-500/20 bg-slate-950 text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Column 1: Organization & Identity */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/30">
                <Shield className="w-5 h-5 text-cyan-400" />
              </div>
              <div>
                <span className="text-base font-extrabold text-white font-mono tracking-wider uppercase">
                  VOLUNTEER <span className="text-cyan-400">RECRUITMENTS</span>
                </span>
                <p className="text-xs text-slate-400 font-mono">
                  {EVENT_DETAILS.name} • {EVENT_DETAILS.organizer}
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-400 max-w-md font-mono leading-relaxed">
              Official volunteer recruitment portal for CyberFest 2027 at {EVENT_DETAILS.institution}.
            </p>

            <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 text-[11px] font-mono text-cyan-300">
              Joint initiative under the Departments of Computer Engineering &amp; Technology (CET),
              Artificial Intelligence &amp; Data Science (AI&amp;DS), and Information Technology (IT).
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-3 font-mono">
            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-200">
              Quick Links
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/" className="text-cyan-400 hover:text-cyan-300 transition-colors">
                  Registration Form
                </Link>
              </li>
              <li>
                <Link href="/admin/login" className="text-slate-400 hover:text-white transition-colors">
                  Admin Login
                </Link>
              </li>
              <li>
                <Link href="/admin/dashboard" className="text-slate-500 hover:text-slate-300 transition-colors">
                  Admin Command Center
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact & Campus */}
          <div className="space-y-3 font-mono">
            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-200">
              Campus &amp; Contact
            </h4>
            <div className="space-y-2 text-[11px] text-slate-400">
              <div className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 text-cyan-400 mt-0.5 shrink-0" />
                <span>
                  Chaitanya Bharathi Institute of Technology (A), Gandipet, Hyderabad - 500075
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>ddc@cbit.ac.in</span>
              </div>
              <div className="flex items-center space-x-2">
                <Terminal className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>DDC Security Operations Center</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-slate-500 gap-3">
          <p>© 2026–2027 Digital Defence Club (DDC), CBIT Hyderabad.</p>
          <div className="flex items-center space-x-3">
            <span className="text-cyan-400">&ldquo;Think Beyond. Defend Beyond.&rdquo;</span>
            <span>•</span>
            <span>Zero-Trust Architecture</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
