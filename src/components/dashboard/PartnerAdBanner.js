import React from "react";
import { ExternalLink, TrendingUp } from "lucide-react";

export default function PartnerAdBanner({
  referralUrl = "https://ibkr.com/referral/aaron6369"
}) {
  return (
    <a
      href={referralUrl}
      target="_blank"
      rel="noopener noreferrer sponsored"
      className="group w-full h-[50px] rounded-xl bg-gradient-to-r from-[#0F172A] via-[#1E293B] to-[#0F172A] border border-white/10 px-3 flex items-center justify-between shadow-md hover:shadow-lg transition-all duration-200 overflow-hidden relative select-none cursor-pointer"
    >
      {/* Subtle background glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 via-transparent to-red-500/10 opacity-60 group-hover:opacity-100 transition-opacity" />

      {/* Left Content */}
      <div className="flex items-center gap-2 min-w-0 z-10 flex-1 mr-2">
        {/* Official Interactive Brokers Logo Image (Local Asset) */}
        <div className="flex items-center justify-center shrink-0 w-7 h-7 rounded-lg bg-white/10 p-0.5 border border-white/10 shadow-sm overflow-hidden">
          <img
            src="/images/ibkr-logo.svg"
            alt="Interactive Brokers Logo"
            className="w-full h-full object-contain"
          />
        </div>

        {/* Text Details */}
        <div className="flex flex-col min-w-0 justify-center leading-tight">
          <div className="flex items-center gap-1.5">
            <span className="text-[11.5px] font-bold text-white tracking-tight flex items-center gap-1 truncate">
              Interactive Brokers
              <TrendingUp size={11} className="text-emerald-400 shrink-0 inline" />
            </span>
            <span className="text-[7.5px] uppercase tracking-wider font-extrabold text-slate-400/80 px-1 py-[1px] rounded bg-white/5 border border-white/10 shrink-0 leading-none">
              Partner
            </span>
          </div>
          <span className="text-[10px] font-medium text-slate-300/95 truncate">
            Earn up to <strong className="text-amber-300 font-bold">$1,000</strong> in free stock
          </span>
        </div>
      </div>

      {/* Right Action Button */}
      <div className="flex items-center shrink-0 z-10">
        <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold text-[10.5px] shadow-sm group-hover:brightness-110 transition-all">
          <span>Claim</span>
          <ExternalLink size={10.5} className="stroke-[2.5]" />
        </div>
      </div>
    </a>
  );
}
