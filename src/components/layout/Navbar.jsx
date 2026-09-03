'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, LogIn, User } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="w-full border-b border-zinc-800/80 bg-zinc-950/90 backdrop-blur-md shrink-0 z-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 h-12 sm:h-14 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2 group whitespace-nowrap shrink-0">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-black font-extrabold text-xs sm:text-sm shadow-[0_0_12px_rgba(16,185,129,0.3)] group-hover:scale-105 transition-transform shrink-0">
            RP
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm sm:text-base font-bold text-white tracking-tight group-hover:text-emerald-300 transition-colors whitespace-nowrap">
              Retirement Planner
            </span>
          </div>
        </Link>

        {/* Center Mode Pill */}
        <div className="hidden md:inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-zinc-900 border border-zinc-800 text-[11px] text-zinc-300 whitespace-nowrap">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
          <span className="font-medium whitespace-nowrap">Trial Sandbox</span>
          <span className="text-zinc-500">·</span>
          <span className="text-zinc-400 whitespace-nowrap">3.0% CFP Standard</span>
        </div>

        {/* Right CTA Actions */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          <Link
            href="/login"
            className="inline-flex items-center gap-1 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg text-xs font-semibold text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors whitespace-nowrap"
          >
            <LogIn className="w-3.5 h-3.5 shrink-0" />
            <span className="whitespace-nowrap">Sign In</span>
          </Link>
          <Link
            href="/register"
            className="inline-flex items-center gap-1 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-lg text-xs font-semibold bg-emerald-500 hover:bg-emerald-400 text-black shadow-[0_0_10px_rgba(16,185,129,0.25)] transition-all whitespace-nowrap"
          >
            <User className="w-3.5 h-3.5 shrink-0" />
            <span className="whitespace-nowrap">Create Account</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}
