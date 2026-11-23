'use client';

import React from 'react';
import Link from 'next/link';
import {
  Terminal,
  CalendarCheck,
  Megaphone,
  Palette,
  Video,
  Handshake,
  Globe,
  FileText,
  ArrowUpRight,
  CheckCircle2,
} from 'lucide-react';
import { DepartmentInfo } from '@/lib/constants';

const ICON_MAP: Record<string, React.ElementType> = {
  Terminal,
  CalendarCheck,
  Megaphone,
  Palette,
  Video,
  Handshake,
  Globe,
  FileText,
};

export default function DepartmentCard({ dept }: { dept: DepartmentInfo }) {
  const Icon = ICON_MAP[dept.iconName] || Terminal;

  return (
    <div className="relative group flex flex-col justify-between p-6 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/40 transition-all duration-300 hover:shadow-[0_0_25px_rgba(0,240,255,0.15)] backdrop-blur-sm">
      {/* Top Header */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div
            className={`flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br ${dept.color} border transition-all duration-300 group-hover:scale-105`}
          >
            <Icon className="w-6 h-6" />
          </div>
          <span className="text-[11px] font-mono tracking-widest text-slate-500 uppercase">
            WING
          </span>
        </div>

        <h3 className="text-xl font-bold font-mono text-white group-hover:text-cyan-400 transition-colors">
          {dept.name}
        </h3>

        <p className="mt-1 text-xs font-mono text-cyan-300/80 tracking-wide">
          {dept.tagline}
        </p>

        <p className="mt-3 text-sm text-slate-400 font-sans leading-relaxed">
          {dept.description}
        </p>

        {/* Responsibilities list */}
        <div className="mt-4 pt-3 border-t border-slate-800/80">
          <span className="text-xs font-mono font-semibold text-slate-300 block mb-2">
            Core Responsibilities:
          </span>
          <ul className="space-y-1.5">
            {dept.responsibilities.slice(0, 3).map((resp, i) => (
              <li key={i} className="flex items-start space-x-2 text-xs text-slate-400">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 mt-0.5 shrink-0" />
                <span>{resp}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Skills & Action */}
      <div className="mt-6 pt-4 border-t border-slate-800/80">
        <div className="flex flex-wrap gap-1.5 mb-4">
          {dept.skills.map((skill, idx) => (
            <span
              key={idx}
              className="px-2 py-0.5 text-[10px] font-mono bg-slate-800 text-slate-300 rounded border border-slate-700/60"
            >
              {skill}
            </span>
          ))}
        </div>

        <Link
          href={`/apply?dept=${encodeURIComponent(dept.name)}`}
          className="w-full inline-flex items-center justify-center space-x-1.5 py-2 px-3 text-xs font-mono font-bold text-cyan-400 bg-cyan-950/40 hover:bg-cyan-900/60 border border-cyan-500/30 hover:border-cyan-400 rounded-lg transition-all group/btn"
        >
          <span>APPLY FOR {dept.name.toUpperCase()}</span>
          <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
        </Link>
      </div>
    </div>
  );
}
