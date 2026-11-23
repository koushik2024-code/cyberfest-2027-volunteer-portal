import React from 'react';
import Link from 'next/link';
import { Shield, ExternalLink, Terminal, Mail, MapPin } from 'lucide-react';
import { EVENT_DETAILS } from '@/lib/constants';

export default function Footer() {
  return (
    <footer className="relative z-10 border-t border-cyan-500/20 bg-slate-950 text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Column 1: Organization & Identity */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/30">
                <Shield className="w-5 h-5 text-cyan-400" />
              </div>
              <div>
                <span className="text-lg font-extrabold text-white font-mono tracking-wider">
                  CYBER<span className="text-cyan-400">FEST</span> 2027
                </span>
                <p className="text-xs text-slate-400 font-mono">
                  {EVENT_DETAILS.organizer} • {EVENT_DETAILS.institution}
                </p>
              </div>
            </div>

            <p className="text-sm text-slate-400 max-w-md font-sans leading-relaxed">
              CyberFest is the flagship national-scale cybersecurity conclave bringing together
              ethical hackers, security researchers, CTF champions, and industry leaders.
            </p>

            <div className="p-3.5 rounded-lg bg-slate-900/80 border border-slate-800 text-xs font-mono text-cyan-300">
              <span className="text-slate-400 block mb-1">Academic Governance:</span>
              Joint initiative under the Departments of Computer Engineering & Technology (CET),
              Artificial Intelligence & Data Science (AI&DS), and Information Technology (IT).
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-3 font-mono">
            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-200">
              Navigation
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/#about" className="hover:text-cyan-400 transition-colors">
                  About CyberFest
                </Link>
              </li>
              <li>
                <Link href="/#why-join" className="hover:text-cyan-400 transition-colors">
                  Why Join Volunteer Team
                </Link>
              </li>
              <li>
                <Link href="/#teams" className="hover:text-cyan-400 transition-colors">
                  Recruitment Wings
                </Link>
              </li>
              <li>
                <Link href="/apply" className="text-cyan-400 hover:text-cyan-300 transition-colors">
                  Apply As Volunteer →
                </Link>
              </li>
              <li>
                <Link href="/admin/login" className="text-slate-500 hover:text-slate-300 transition-colors">
                  Admin Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact & Campus */}
          <div className="space-y-3 font-mono">
            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-200">
              Campus & Contact
            </h4>
            <div className="space-y-2 text-xs text-slate-400">
              <div className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 text-cyan-400 mt-0.5 shrink-0" />
                <span>
                  Chaitanya Bharathi Institute of Technology (A), Gandipet, Hyderabad, Telangana - 500075
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>ddc@cbit.ac.in</span>
              </div>
              <div className="flex items-center space-x-2">
                <Terminal className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>DDC Security Operations Center (SOC)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-slate-500 gap-4">
          <p>© 2026–2027 Digital Defence Club (DDC), CBIT Hyderabad. All rights reserved.</p>
          <div className="flex items-center space-x-4">
            <span className="text-cyan-400 font-semibold">&ldquo;Think Beyond. Defend Beyond.&rdquo;</span>
            <span>•</span>
            <span>Zero-Trust Architecture</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
