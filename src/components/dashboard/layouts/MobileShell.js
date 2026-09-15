import React, { useState, useEffect } from "react";
import RetirementCockpit from "../mobile/RetirementCockpit";
import PartnerAdBanner from "../PartnerAdBanner";
import PremiumUpgradeModal from "../PremiumUpgradeModal";
import { Sparkles } from "lucide-react";

export default function MobileShell({
  user,
  simulationData,
  hasEnteredInfo,
  onUpdateParam,
  onUpdateFullPlan,
  onResetInfo
}) {
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);

  // Detect mobile virtual keyboard via visualViewport resize or input focus
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleFocusIn = (e) => {
      const tag = e.target?.tagName?.toLowerCase();
      if (tag === "input" || tag === "textarea" || tag === "select") {
        setIsKeyboardOpen(true);
      }
    };

    const handleFocusOut = () => {
      // Small timeout to avoid rapid flash when switching between inputs
      setTimeout(() => {
        const activeTag = document.activeElement?.tagName?.toLowerCase();
        if (activeTag !== "input" && activeTag !== "textarea" && activeTag !== "select") {
          setIsKeyboardOpen(false);
        }
      }, 150);
    };

    // Modern mobile visual viewport tracking
    let initialHeight = window.visualViewport?.height || window.innerHeight;
    const handleViewportResize = () => {
      if (window.visualViewport) {
        // If viewport shrinks by more than 120px, the soft keyboard is open
        const isShrunk = initialHeight - window.visualViewport.height > 120;
        setIsKeyboardOpen(isShrunk);
      }
    };

    window.addEventListener("focusin", handleFocusIn);
    window.addEventListener("focusout", handleFocusOut);
    if (window.visualViewport) {
      window.visualViewport.addEventListener("resize", handleViewportResize);
    }

    return () => {
      window.removeEventListener("focusin", handleFocusIn);
      window.removeEventListener("focusout", handleFocusOut);
      if (window.visualViewport) {
        window.visualViewport.removeEventListener("resize", handleViewportResize);
      }
    };
  }, []);

  return (
    <div className="w-full h-[100dvh] max-h-[100dvh] bg-[#F2F2F7] text-[#1C1C1E] flex flex-col overflow-hidden pb-[env(safe-area-inset-bottom,0px)]">
      {/* Floating Rounded Rectangle Header */}
      <div className="w-full max-w-2xl mx-auto pt-2 sm:pt-3 px-4 shrink-0 z-30">
        <header className="w-full bg-white/85 backdrop-blur-xl border border-black/8 rounded-2xl sm:rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.06)] px-3.5 sm:px-5 py-2 sm:py-2.5 flex items-center justify-between transition-all">
          <div className="flex items-center gap-2.5 min-w-0">
            <img
              src="/icon-192x192.png"
              alt="Retirement Simulator Icon"
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl object-contain shadow-[0_2px_8px_rgba(0,0,0,0.08)] select-none shrink-0"
            />
            <span className="text-sm sm:text-base font-black tracking-tight text-[#1C1C1E] truncate">
              Retirement Simulator
            </span>
          </div>

          {/* Header Action: Go Pro Button */}
          <button
            type="button"
            onClick={() => setIsUpgradeModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#C59A3F] to-[#A37B2C] hover:from-[#A37B2C] hover:to-[#825F1D] active:scale-95 text-white font-extrabold text-[11px] shadow-[0_2px_10px_rgba(197,154,63,0.3)] transition-all cursor-pointer shrink-0"
          >
            <Sparkles size={13} className="text-amber-200" />
            <span>Go Pro</span>
          </button>
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

      {/* Upgrade / Auth Modal */}
      <PremiumUpgradeModal
        isOpen={isUpgradeModalOpen}
        onClose={() => setIsUpgradeModalOpen(false)}
      />

      {/* 50px Height Bottom Partner Placement (auto-hidden when mobile keyboard is open) */}
      {!isKeyboardOpen && (
        <div className="w-full shrink-0 z-40 bg-white/95 backdrop-blur-md border-t border-black/8 px-4 py-2 flex items-center justify-center shadow-[0_-4px_16px_rgba(0,0,0,0.04)] animate-in fade-in duration-150">
          <div className="w-full max-w-2xl mx-auto flex items-center justify-center">
            <PartnerAdBanner referralUrl="https://ibkr.com/referral/aaron6369" />
          </div>
        </div>
      )}
    </div>
  );
}