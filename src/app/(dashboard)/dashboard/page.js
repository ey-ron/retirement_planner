'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, BarChart3, Database, ShieldCheck, Sparkles } from 'lucide-react';

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 p-6 md:p-12">
      <div className="max-w-4xl mx-auto space-y-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Trial Calculator
        </Link>

        <div className="p-8 rounded-3xl border border-zinc-800 bg-zinc-900/60 backdrop-blur-xl">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold w-fit mb-3">
            <Database className="w-3.5 h-3.5" />
            Supabase Protected Space
          </div>
          <h1 className="text-3xl font-extrabold text-white">Recorded Monitoring Dashboard</h1>
          <p className="text-sm text-zinc-400 mt-2">
            This space is reserved for logged-in users with active Supabase synchronization. Here, actual monthly deposits, real asset values, and milestone tracking will be stored and updated over time.
          </p>
        </div>
      </div>
    </main>
  );
}
