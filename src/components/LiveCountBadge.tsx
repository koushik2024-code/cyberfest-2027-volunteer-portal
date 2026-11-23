'use client';

import React, { useEffect, useState } from 'react';
import { Users } from 'lucide-react';

export default function LiveCountBadge() {
  const [liveCount, setLiveCount] = useState<number | null>(null);
  const [showLiveCount, setShowLiveCount] = useState<boolean>(false);

  useEffect(() => {
    // Check settings first
    fetch('/api/admin/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.settings?.show_live_count) {
          setShowLiveCount(true);
          // If enabled, get count
          fetch('/api/admin/stats')
            .then((r) => r.json())
            .then((sData) => {
              if (sData.success && sData.stats?.total !== undefined) {
                setLiveCount(sData.stats.total);
              }
            })
            .catch(() => {});
        }
      })
      .catch(() => {});
  }, []);

  if (!showLiveCount || liveCount === null) return null;

  return (
    <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 text-xs font-mono shadow-[0_0_15px_rgba(0,240,255,0.2)]">
      <Users className="w-3.5 h-3.5 text-cyan-400" />
      <span>{liveCount} Applications Received</span>
      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
    </div>
  );
}
