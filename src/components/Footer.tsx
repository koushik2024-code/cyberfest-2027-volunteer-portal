import React from 'react';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="relative z-10 border-t border-white/[0.06] bg-slate-950">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <div className="relative w-7 h-7 rounded-full overflow-hidden ring-1 ring-white/10">
                <Image
                  src="/images/ddc-logo-circle.png"
                  alt="DDC"
                  fill
                  className="object-contain p-0.5"
                />
              </div>
              <div className="relative w-7 h-7 rounded-full overflow-hidden ring-1 ring-white/10">
                <Image
                  src="/images/cyberfest-logo-circle.png"
                  alt="CyberFest 2027"
                  fill
                  className="object-contain p-0.5"
                />
              </div>
            </div>
            <span className="text-xs text-slate-500">
              Digital Defence Club • CBIT Hyderabad
            </span>
          </div>

          {/* Tagline & Copyright */}
          <div className="flex items-center gap-3 text-xs text-slate-600">
            <span className="text-cyan-500/60">&ldquo;Think Beyond. Defend Beyond.&rdquo;</span>
            <span>•</span>
            <span>© 2026–2027 DDC</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
