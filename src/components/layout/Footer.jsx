'use client';

import React from 'react';
import { ShieldCheck } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full border-t border-zinc-800/60 bg-zinc-950/80 shrink-0 py-2.5 sm:py-3 px-4">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-1.5 text-[11px] text-zinc-500">
        <div className="flex items-center gap-1.5 text-zinc-400 font-medium whitespace-nowrap">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span className="whitespace-nowrap">CFP 3.0% Inflation & 4.0% Bengen Safe Withdrawal Standard</span>
        </div>
        <div className="text-[10px] text-zinc-600 whitespace-nowrap">
          © {new Date().getFullYear()} Retirement Planner. Educational financial projection.
        </div>
      </div>
    </footer>
  );
}
