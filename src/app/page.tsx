import React from 'react';
import Link from 'next/link';
import {
  Shield,
  ArrowRight,
  Terminal,
  Cpu,
  Sparkles,
  Users,
  Wrench,
  Network,
  ShieldAlert,
  Award,
  ChevronDown,
  Lock,
  Flame,
  CheckCircle,
} from 'lucide-react';
import { EVENT_DETAILS, DEPARTMENTS, WHY_JOIN_US } from '@/lib/constants';
import DepartmentCard from '@/components/DepartmentCard';
import LiveCountBadge from '@/components/LiveCountBadge';

const ICON_MAP: Record<string, React.ElementType> = {
  Wrench,
  Users,
  Sparkles,
  Network,
  ShieldAlert,
  Award,
};

export default function HomePage() {
  return (
    <div className="relative">
      {/* =====================================================================
          1. HERO SECTION
         ===================================================================== */}
      <section className="relative pt-20 pb-28 px-4 sm:px-6 lg:px-8 text-center overflow-hidden">
        {/* Ambient Top Glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto space-y-8 relative z-10">
          {/* Institutional Header Pill */}
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-cyan-500/30 text-xs font-mono text-cyan-300">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span>{EVENT_DETAILS.organizer} • {EVENT_DETAILS.institution}</span>
          </div>

          {/* Main Hero Heading */}
          <div className="space-y-4">
            <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black font-mono tracking-tight text-white uppercase">
              CYBER<span className="text-cyan-400 drop-shadow-[0_0_25px_rgba(0,240,255,0.8)]">FEST</span>{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                2027
              </span>
            </h1>

            <p className="text-lg sm:text-2xl font-mono font-medium text-cyan-200/90 max-w-3xl mx-auto tracking-wide">
              &ldquo;{EVENT_DETAILS.subheading}&rdquo;
            </p>

            <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto font-sans leading-relaxed">
              Join the core organizing force behind Hyderabad’s most ambitious collegiate
              cybersecurity conclave. Shape the CTFs, manage national operations, build industry
              bridges, and defend beyond.
            </p>
          </div>

          {/* Live Application Count (Configurable) */}
          <div className="pt-2">
            <LiveCountBadge />
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/apply"
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-8 py-4 rounded-xl text-sm font-mono font-bold uppercase tracking-wider bg-gradient-to-r from-cyan-400 to-blue-500 text-black hover:from-cyan-300 hover:to-blue-400 shadow-[0_0_30px_rgba(0,240,255,0.4)] transition-all duration-300 hover:scale-105"
            >
              <span>APPLY AS A VOLUNTEER</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="#teams"
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-8 py-4 rounded-xl text-sm font-mono font-bold uppercase tracking-wider text-slate-300 bg-slate-900/80 hover:bg-slate-800 border border-slate-700 hover:border-cyan-500/50 transition-all duration-300"
            >
              <span>EXPLORE TEAMS</span>
              <ChevronDown className="w-4 h-4" />
            </Link>
          </div>

          {/* Event Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-12 max-w-4xl mx-auto text-left font-mono">
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm">
              <span className="text-2xl font-bold text-cyan-400 block">36H</span>
              <span className="text-xs text-slate-400">National Hackathon</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm">
              <span className="text-2xl font-bold text-cyan-400 block">1000+</span>
              <span className="text-xs text-slate-400">Target Attendees</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm">
              <span className="text-2xl font-bold text-cyan-400 block">8 Wings</span>
              <span className="text-xs text-slate-400">Recruitment Teams</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm">
              <span className="text-2xl font-bold text-cyan-400 block">3 Depts</span>
              <span className="text-xs text-slate-400">CET • AI&DS • IT</span>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          2. ABOUT CYBERFEST SECTION
         ===================================================================== */}
      <section id="about" className="py-20 px-4 sm:px-6 lg:px-8 border-t border-slate-800/80">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3 font-mono">
            <span className="text-xs font-bold uppercase tracking-widest text-cyan-400">
              [ MISSION BRIEFING ]
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              About CyberFest 2027
            </h2>
            <p className="text-sm text-slate-400 font-sans leading-relaxed">
              CyberFest is a cybersecurity-focused technical event bringing together students,
              cybersecurity enthusiasts, professionals, and institutions through technical
              competitions, workshops, and interactive activities.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 relative group hover:border-cyan-500/40 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-4">
                <Terminal className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold font-mono text-white mb-2">Technical Competitions</h3>
              <p className="text-sm text-slate-400 font-sans leading-relaxed">
                Flagship Capture The Flag (CryptX), real-time bug bounty simulations, algorithmic
                security trials, and offensive attack-defense challenges designed by DDC technical leads.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 relative group hover:border-cyan-500/40 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 mb-4">
                <Cpu className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold font-mono text-white mb-2">Specialized Workshops</h3>
              <p className="text-sm text-slate-400 font-sans leading-relaxed">
                Deep-dive technical sessions covering ForensIQ (Digital Forensics), QuantumSecure
                (Post-Quantum Cryptography), Reverse Engineering, and Defensive Engineering for LLMs.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 relative group hover:border-cyan-500/40 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-4">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold font-mono text-white mb-2">Industry Networking</h3>
              <p className="text-sm text-slate-400 font-sans leading-relaxed">
                Keynote addresses by top CISOs, leadership summits with government cybersecurity
                bodies (DSCI, CCoE), and career interaction opportunities with leading security firms.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          3. WHY JOIN US SECTION
         ===================================================================== */}
      <section id="why-join" className="py-20 px-4 sm:px-6 lg:px-8 border-t border-slate-800/80 bg-slate-950/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3 font-mono">
            <span className="text-xs font-bold uppercase tracking-widest text-cyan-400">
              [ VOLUNTEER VALUE PROPOSITION ]
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              Why Join The CyberFest Organizing Team?
            </h2>
            <p className="text-sm text-slate-400 font-sans">
              Volunteering for CyberFest 2027 is more than just organizing an event—it’s an
              accelerator for your technical, managerial, and professional trajectory at CBIT.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {WHY_JOIN_US.map((item, idx) => {
              const Icon = ICON_MAP[item.iconName] || Award;
              return (
                <div
                  key={idx}
                  className="p-6 rounded-xl bg-slate-900/60 border border-slate-800/90 hover:border-cyan-500/40 transition-all duration-300 group"
                >
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 group-hover:scale-110 transition-transform">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-mono text-slate-500">0{idx + 1}</span>
                  </div>
                  <h3 className="text-lg font-bold font-mono text-white group-hover:text-cyan-300 transition-colors mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-slate-400 font-sans leading-relaxed">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =====================================================================
          4. OUR TEAMS / DEPARTMENTS SECTION
         ===================================================================== */}
      <section id="teams" className="py-20 px-4 sm:px-6 lg:px-8 border-t border-slate-800/80">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3 font-mono">
            <span className="text-xs font-bold uppercase tracking-widest text-cyan-400">
              [ RECRUITMENT WINGS ]
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              Explore Our 8 Specialized Teams
            </h2>
            <p className="text-sm text-slate-400 font-sans">
              Choose the department that aligns with your passions, technical skills, and career
              goals. You may apply for one or multiple wings.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {DEPARTMENTS.map((dept) => (
              <DepartmentCard key={dept.name} dept={dept} />
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================================
          5. CALL TO ACTION BANNER
         ===================================================================== */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-slate-800/80">
        <div className="max-w-5xl mx-auto p-8 sm:p-14 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-cyan-950/40 border border-cyan-500/40 text-center relative overflow-hidden shadow-[0_0_50px_rgba(0,240,255,0.15)]">
          <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-6 max-w-2xl mx-auto">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-xs font-mono text-cyan-300">
              <Flame className="w-3.5 h-3.5 text-cyan-400" />
              <span>RECRUITMENT STAGE ACTIVE</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-black font-mono text-white tracking-tight">
              Ready to Defend Beyond?
            </h2>

            <p className="text-sm sm:text-base text-slate-300 font-sans">
              Don’t miss the chance to be part of the core crew making CyberFest 2027 a historic
              milestone for CBIT and Telangana.
            </p>

            <div className="pt-2">
              <Link
                href="/apply"
                className="inline-flex items-center space-x-2 px-10 py-4 rounded-xl text-sm font-mono font-bold uppercase tracking-wider bg-gradient-to-r from-cyan-400 to-blue-500 text-black hover:from-cyan-300 hover:to-blue-400 shadow-[0_0_30px_rgba(0,240,255,0.4)] transition-all hover:scale-105"
              >
                <span>SUBMIT YOUR APPLICATION</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
