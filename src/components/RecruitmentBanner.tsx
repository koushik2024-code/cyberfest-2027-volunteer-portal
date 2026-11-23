'use client';

import React, { useEffect, useState } from 'react';
import { Bell, Clock, AlertTriangle } from 'lucide-react';
import { SystemSettings } from '@/types';
import { formatToIST } from '@/lib/dateUtils';

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

  return (
    <div
      className={`border-b text-xs font-mono py-2.5 px-4 transition-colors ${
        settings.is_open
          ? 'bg-cyan-950/70 border-cyan-500/30 text-cyan-200'
          : 'bg-rose-950/70 border-rose-500/40 text-rose-200'
      }`}
    >
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center space-x-2 text-center sm:text-left">
          {settings.is_open ? (
            <Bell className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
          ) : (
            <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
          )}
          <span>{settings.announcement}</span>
        </div>

        {settings.is_open && settings.deadline && (
          <div className="flex items-center space-x-1.5 text-slate-300 bg-slate-900/80 px-2.5 py-1 rounded border border-cyan-500/20 shrink-0">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span>Deadline: {formatToIST(settings.deadline)}</span>
          </div>
        )}
      </div>
    </div>
  );
}
