'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';

export default function AdvancedMonitoringCTA() {
  return (
    <div className="mt-3.5 sm:mt-4 relative overflow-hidden rounded-xl border border-emerald-500/40 bg-gradient-to-r from-emerald-950/50 via-zinc-900/90 to-teal-950/40 p-3 sm:p-4 shadow-[0_0_20px_rgba(16,185,129,0.1)]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-start sm:items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs sm:text-sm font-bold text-white whitespace-nowrap">
                Want Advanced Recorded Monitoring?
              </span>
              <span className="hidden md:inline-block text-[10px] uppercase font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-500/30 px-1.5 py-0.5 rounded whitespace-nowrap">
                Supabase Sync
              </span>
            </div>
            <p className="text-[11px] text-zinc-400 mt-0.5">
              Save your trial plan and record your ongoing monthly progress with automated tracking.
            </p>
          </div>
        </div>

        {/* Action button */}
        <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
          <Link
            href="/register"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-lg font-bold text-xs bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 text-black shadow-[0_0_12px_rgba(16,185,129,0.25)] transition-all whitespace-nowrap cursor-pointer"
          >
            <span className="whitespace-nowrap">Save Plan & Register</span>
            <ArrowRight className="w-3.5 h-3.5 shrink-0" />
          </Link>
          <Link
            href="/login"
            className="inline-flex items-center px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-lg font-medium text-xs border border-zinc-700 bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 hover:text-white transition-colors whitespace-nowrap"
          >
            <span className="whitespace-nowrap">Sign In</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
