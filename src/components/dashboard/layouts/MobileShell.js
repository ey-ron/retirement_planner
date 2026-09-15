import React from "react";
import RetirementCockpit from "../mobile/RetirementCockpit";

export default function MobileShell({
  user,
  simulationData,
  hasEnteredInfo,
  onUpdateParam,
  onUpdateFullPlan,
  onResetInfo
}) {
  return (
    <div className="w-full h-[100dvh] max-h-[100dvh] bg-[#F2F2F7] text-[#1C1C1E] flex flex-col overflow-hidden pb-[env(safe-area-inset-bottom,0px)]">
      {/* Floating Rounded Rectangle Header */}
      <div className="w-full max-w-2xl mx-auto pt-2 sm:pt-3 px-4 shrink-0 z-30">
        <header className="w-full bg-white/85 backdrop-blur-xl border border-black/8 rounded-2xl sm:rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.06)] px-4 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between transition-all">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#C59A3F] to-[#E5C158] flex items-center justify-center text-white shadow-[0_2px_8px_rgba(197,154,63,0.3)] font-black text-xs select-none">
              RS
            </div>
            <span className="text-base sm:text-lg font-black tracking-tight text-[#1C1C1E]">
              Retirement Simulator
            </span>
          </div>
        </header>
      </div>

      {/* Main Responsive Viewport */}
      <main className="w-full max-w-2xl mx-auto px-4 sm:px-6 pt-2 sm:pt-3 pb-2 flex-1 flex flex-col min-h-0 overflow-hidden">
        <RetirementCockpit
          simulationData={simulationData}
          hasEnteredInfo={hasEnteredInfo}
          onUpdateParam={onUpdateParam}
          onUpdateFullPlan={onUpdateFullPlan}
          onResetInfo={onResetInfo}
        />
      </main>

      {/* 50px Height Bottom Ad Display Card (docked in layout flex flow above safe area, never overlays the card) */}
      <div className="w-full shrink-0 z-40 bg-white/95 backdrop-blur-md border-t border-black/8 px-4 py-2 flex items-center justify-center shadow-[0_-4px_16px_rgba(0,0,0,0.04)]">
        <div className="w-full max-w-2xl mx-auto flex items-center justify-center">
          <div className="w-full h-[50px] rounded-xl border border-dashed border-black/20 bg-[#F8F9FA] flex items-center justify-center gap-2.5 px-4 select-none">
            <span className="px-2 py-0.5 rounded bg-black/10 text-[10px] font-black uppercase tracking-wider text-gray-500">
              AD
            </span>
            <span className="text-xs font-semibold text-gray-400 truncate">
              Ad Placement Area (50px)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}