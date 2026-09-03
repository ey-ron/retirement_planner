'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, LogIn, Sparkles } from 'lucide-react';

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md p-8 rounded-3xl border border-zinc-800 bg-zinc-900/80 backdrop-blur-xl shadow-2xl">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-400 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Trial Calculator
        </Link>

        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold w-fit mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          Supabase Auth Gateway
        </div>

        <h1 className="text-2xl font-bold text-white tracking-tight">Sign in to your account</h1>
        <p className="text-sm text-zinc-400 mt-1 mb-6">
          Access your recorded retirement milestones and portfolio monitoring.
        </p>

        <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-xl font-bold text-sm bg-emerald-500 hover:bg-emerald-400 text-black shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all flex items-center justify-center gap-2 mt-2"
          >
            <LogIn className="w-4 h-4" />
            Sign In (Supabase Ready)
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-zinc-800 text-center text-xs text-zinc-400">
          Don&apos;t have an account yet?{' '}
          <Link href="/register" className="text-emerald-400 font-semibold hover:underline">
            Register here
          </Link>
        </div>
      </div>
    </main>
  );
}
