import React from 'react';
import Link from 'next/link';
import { ShieldAlert, ArrowLeft, Terminal } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full p-8 rounded-2xl bg-slate-900/80 border border-rose-500/30 text-center font-mono space-y-6 shadow-[0_0_40px_rgba(244,63,94,0.15)]">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-rose-500/10 border border-rose-500/40 text-rose-400">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold text-rose-400 tracking-widest block uppercase">
            [ HTTP 404: NODE CORRUPTED ]
          </span>
          <h1 className="text-3xl font-black text-white">ACCESS DENIED</h1>
          <p className="text-xs text-slate-400 font-sans">
            The target endpoint does not exist on the CyberFest 2027 network matrix or has been
            quarantined by DDC security protocols.
          </p>
        </div>

        <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-[11px] text-slate-500 text-left">
          <div className="flex items-center space-x-1.5 text-cyan-400 mb-1">
            <Terminal className="w-3.5 h-3.5" />
            <span>Trace Log:</span>
          </div>
          <code>ERR_ENDPOINT_UNRESOLVED // TARGET_NULL</code>
        </div>

        <div>
          <Link
            href="/"
            className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-black text-xs font-bold font-mono transition-all shadow-[0_0_20px_rgba(0,240,255,0.3)]"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>RETURN TO SAFE PROTOCOL</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
