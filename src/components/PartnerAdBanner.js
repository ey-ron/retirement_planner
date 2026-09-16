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
      className="group w-full h-[50px] sm:h-[64px] md:h-[70px] rounded-xl sm:rounded-2xl bg-gradient-to-r from-[#0F172A] via-[#1E293B] to-[#0F172A] border border-white/10 px-3 sm:px-4 md:px-5 flex items-center justify-between shadow-md hover:shadow-lg transition-all duration-200 overflow-hidden relative select-none cursor-pointer"
    >
      {/* Subtle background glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 via-transparent to-red-500/10 opacity-60 group-hover:opacity-100 transition-opacity" />

      {/* Left Content */}
      <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0 z-10 flex-1 mr-2">
        {/* Official Interactive Brokers Logo Image (Local Asset) */}
        <div className="flex items-center justify-center shrink-0 w-7 h-7 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-lg sm:rounded-xl bg-white/10 p-0.5 sm:p-1 border border-white/10 shadow-sm overflow-hidden">
          <img
            src="/images/ibkr-logo.svg"
            alt="Interactive Brokers Logo"
            className="w-full h-full object-contain"
          />
        </div>

        {/* Text Details */}
        <div className="flex flex-col min-w-0 justify-center leading-tight">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <span className="text-[11.5px] sm:text-sm md:text-base font-bold text-white tracking-tight flex items-center gap-1 truncate">
              Interactive Brokers
              <TrendingUp className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 text-emerald-400 shrink-0 inline" />
            </span>
            <span className="text-[7.5px] sm:text-[8.5px] md:text-[9px] uppercase tracking-wider font-extrabold text-slate-400/80 px-1 py-[1px] rounded bg-white/5 border border-white/10 shrink-0 leading-none">
              Partner
            </span>
          </div>
          <span className="text-[10px] sm:text-xs md:text-sm font-medium text-slate-300/95 truncate">
            Earn up to <strong className="text-amber-300 font-bold">$1,000</strong> in free stock
          </span>
        </div>
      </div>

      {/* Right Action Button */}
      <div className="flex items-center shrink-0 z-10">
        <div className="inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3.5 md:px-4 py-1 sm:py-1.5 md:py-2 rounded-lg sm:rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black text-[10.5px] sm:text-xs md:text-sm shadow-sm group-hover:brightness-110 transition-all">
          <span>Claim</span>
          <ExternalLink className="w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-3.5 md:h-3.5 stroke-[2.5]" />
        </div>
      </div>
    </a>
  );
}
