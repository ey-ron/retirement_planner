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
  const [isPro, setIsPro] = useState(false);
  const [proName, setProName] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsPro(localStorage.getItem("retirement_is_pro") === "true");
      setProName(localStorage.getItem("retirement_pro_name") || "");
    }
  }, []);

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
      setTimeout(() => {
        const activeTag = document.activeElement?.tagName?.toLowerCase();
        if (activeTag !== "input" && activeTag !== "textarea" && activeTag !== "select") {
          setIsKeyboardOpen(false);
        }
      }, 100);
    };

    const handleViewportResize = () => {
      if (!window.visualViewport) return;
      const isKeyboard = window.innerHeight - window.visualViewport.height > 150;
      setIsKeyboardOpen(isKeyboard);
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
            {isPro ? (
              <div className="flex flex-col min-w-0 leading-tight">
                <span className="text-sm sm:text-base font-black tracking-tight text-[#1C1C1E] truncate">
                  {proName || "Pro Member"}
                </span>
                <span className="text-[10px] sm:text-[11px] font-semibold text-[#8A6414] tracking-tight truncate">
                  Retirement Journey
                </span>
              </div>
            ) : (
              <span className="text-sm sm:text-base font-black tracking-tight text-[#1C1C1E] truncate">
                Retirement Simulator
              </span>
            )}
          </div>

          {/* Header Action: Pro Badge or Go Pro CTA */}
          {isPro ? (
            <button
              type="button"
              onClick={() => setIsUpgradeModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 font-black text-[11px] shadow-sm cursor-pointer shrink-0"
            >
              <Sparkles size={13} className="text-emerald-600" />
              <span>Pro</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setIsUpgradeModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#C59A3F] to-[#A37B2C] hover:from-[#A37B2C] hover:to-[#825F1D] active:scale-95 text-white font-extrabold text-[11px] shadow-[0_2px_10px_rgba(197,154,63,0.3)] transition-all cursor-pointer shrink-0"
            >
              <Sparkles size={13} className="text-amber-200" />
              <span>Go Pro</span>
            </button>
          )}
        </header>
      </div>

      {/* Main Responsive Viewport */}
      <main className="w-full max-w-2xl mx-auto px-4 sm:px-6 pt-2 sm:pt-3 pb-2 flex-1 flex flex-col min-h-0 overflow-hidden">
        {isPro ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-6 bg-white/80 backdrop-blur-xl border border-black/8 rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] animate-in fade-in zoom-in-95 duration-200">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#C59A3F] to-[#E5C158] flex items-center justify-center text-white shadow-lg shadow-amber-500/20 mb-3.5 animate-pulse">
              <Sparkles size={28} />
            </div>

            <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-200/80 mb-2">
              Pro Member Access
            </span>

            <h3 className="text-xl font-black text-[#1C1C1E] tracking-tight mb-2">
              Under Development
            </h3>

            <p className="text-xs text-gray-600 max-w-sm leading-relaxed mb-5">
              We are actively building the dedicated Pro Suite features, including 10,000+ Monte Carlo engine, advanced asset modeling, and cloud scenario syncing. Check back soon for the full release!
            </p>

            <div className="w-full max-w-xs p-3 bg-[#F8F9FA] rounded-2xl border border-black/5 flex items-center justify-between text-xs text-gray-600">
              <span className="font-semibold text-gray-500">License Status:</span>
              <span className="font-bold text-emerald-600 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                Active Pro
              </span>
            </div>
          </div>
        ) : (
          <RetirementCockpit
            simulationData={simulationData}
            hasEnteredInfo={hasEnteredInfo}
            onUpdateParam={onUpdateParam}
            onUpdateFullPlan={onUpdateFullPlan}
            onResetInfo={onResetInfo}
          />
        )}
      </main>

      {/* Upgrade / Auth Modal */}
      <PremiumUpgradeModal
        isOpen={isUpgradeModalOpen}
        isPro={isPro}
        onClose={() => setIsUpgradeModalOpen(false)}
        onProActivated={() => {
          setIsPro(true);
          try {
            setProName(localStorage.getItem("retirement_pro_name") || "");
          } catch (e) {}
        }}
        onSignOut={() => {
          setIsPro(false);
          setProName("");
        }}
      />

      {/* 50px Height Bottom Partner Placement (hidden only when keyboard is open) */}
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