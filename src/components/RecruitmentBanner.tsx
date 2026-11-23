'use client';

import React, { useEffect, useState } from 'react';
import { Clock, AlertTriangle } from 'lucide-react';
import { SystemSettings } from '@/types';
import { formatShortDateIST } from '@/lib/dateUtils';

export default function RecruitmentBanner() {
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

  if (!settings) return null;

  if (!settings.is_open) {
    return (
      <div className="border-b border-red-500/20 bg-red-950/40 py-2 px-4">
        <div className="max-w-5xl mx-auto flex items-center justify-center gap-2 text-xs text-red-300">
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>Registrations are closed</span>
        </div>
      </div>
    );
  }

  return (
    <div className="border-b border-cyan-500/10 bg-cyan-950/20 py-2 px-4">
      <div className="max-w-5xl mx-auto flex items-center justify-center gap-4 text-xs text-slate-400">
        <span className="text-cyan-400/80">Volunteer registrations are open</span>
        {settings.deadline && (
          <div className="flex items-center gap-1 text-slate-500">
            <Clock className="w-3 h-3" />
            <span>Deadline: {formatShortDateIST(settings.deadline)}</span>
          </div>
        )}
      </div>
    </div>
  );
}
