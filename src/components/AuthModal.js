import React, { useState, useEffect } from "react";
import {
  X, Sparkles, User, Mail, CheckCircle2, ArrowRight, LogIn, LogOut, Lock, Unlock, ShieldCheck, Globe2
} from "lucide-react";
import { COUNTRIES } from "../lib/retirementCalculations";

export const UNLOCKABLE_DEFINITIONS = [
  {
    id: "unlock_1",
    name: "Professional Institutional Standard",
    desc: "10,000+ stochastic sequence-of-returns variance simulation & risk modeling"
  },
  {
    id: "unlock_2",
    name: "Territory Based Inflation",
    desc: "Real-time regional & country CPI feeds for location-specific annual cost drag"
  },
  {
    id: "unlock_3",
    name: "Weighted Growth CAGR",
    desc: "Dynamic multi-asset allocation based on 20-year annual average market returns"
  }
];

export default function AuthModal({
  isOpen,
  isPro,
  proName,
  userCountry = "Singapore",
  currentPlan = null,
  unlocks = {},
  onClose,
  onAuthSuccess,
  onSignOut
}) {
  const [mode, setMode] = useState("login"); // 'login' | 'register'
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [country, setCountry] = useState(userCountry || "Singapore");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [storedEmail, setStoredEmail] = useState("");

  const handleUnlockClick = (def) => {
    const updatedUnlocks = { ...unlocks, [def.id]: "Unlocked" };
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("retirement_unlocks", JSON.stringify(updatedUnlocks));
      } catch (e) {}
    }
    if (onAuthSuccess) {
      onAuthSuccess({
        name: proName || name,
        email: storedEmail || email,
        country,
        planData: currentPlan,
        unlocks: updatedUnlocks
      });
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      setStoredEmail(localStorage.getItem("retirement_pro_email") || "");
      const savedCountry = localStorage.getItem("retirement_user_country");
      if (savedCountry) setCountry(savedCountry);
      if (proName) {
        setName(proName);
      }
    }
  }, [isOpen, proName]);

  useEffect(() => {
    if (isOpen) {
      setErrorMsg("");
      setMode("login");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedEmail || !trimmedEmail.includes("@") || !trimmedEmail.includes(".")) {
      setErrorMsg("Please enter a valid email address.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmedEmail })
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok || !data.success) {
        // Client-side fallback check if user registered on this browser
        const localSavedEmail = typeof window !== "undefined" ? localStorage.getItem("retirement_pro_email") : null;
        if (localSavedEmail && localSavedEmail.toLowerCase() === trimmedEmail) {
          const memberName = localStorage.getItem("retirement_pro_name") || trimmedEmail.split("@")[0];
          const memberCountry = localStorage.getItem("retirement_user_country") || "Singapore";
          let memberUnlocks = {
            unlock_1: "Locked",
            unlock_2: "Locked",
            unlock_3: "Locked",
            unlock_4: "Locked",
            unlock_5: "Locked",
            unlock_6: "Locked",
            unlock_7: "Locked"
          };
          try {
            const parsed = JSON.parse(localStorage.getItem("retirement_unlocks"));
            if (parsed) memberUnlocks = parsed;
          } catch (e) {}

          let loadedPlan = currentPlan;
          try {
            const savedPlan = localStorage.getItem("retirement_saved_plan");
            if (savedPlan) loadedPlan = JSON.parse(savedPlan);
          } catch (e) {}

          localStorage.setItem("retirement_is_pro", "true");
          if (onAuthSuccess) {
            onAuthSuccess({
              name: memberName,
              email: trimmedEmail,
              country: memberCountry,
              planData: loadedPlan,
              unlocks: memberUnlocks
            });
          }
          onClose();
          return;
        }

        setErrorMsg(data.message || "Account not found. Please register below.");
        setLoading(false);
        return;
      }

      const memberName = data.name || trimmedEmail.split("@")[0];
      const memberCountry = data.country || "Singapore";
      const memberPlan = data.planData || currentPlan;
      const memberUnlocks = data.unlocks || {
        unlock_1: "Locked",
        unlock_2: "Locked",
        unlock_3: "Locked",
        unlock_4: "Locked",
        unlock_5: "Locked",
        unlock_6: "Locked",
        unlock_7: "Locked"
      };

      if (typeof window !== "undefined") {
        try {
          localStorage.setItem("retirement_is_pro", "true");
          localStorage.setItem("retirement_pro_name", memberName);
          localStorage.setItem("retirement_pro_email", trimmedEmail);
          localStorage.setItem("retirement_user_country", memberCountry);
          if (memberPlan) {
            localStorage.setItem("retirement_saved_plan", JSON.stringify(memberPlan));
          }
          localStorage.setItem("retirement_unlocks", JSON.stringify(memberUnlocks));
        } catch (err) {}
      }

      if (onAuthSuccess) {
        onAuthSuccess({
          name: memberName,
          email: trimmedEmail,
          country: memberCountry,
          planData: memberPlan,
          unlocks: memberUnlocks
        });
      }

      onClose();
    } catch (err) {
      console.warn("Login network error:", err);
      setErrorMsg("Connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    const trimmedName = name.trim();
    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedName) {
      setErrorMsg("Please enter your name.");
      return;
    }

    if (!trimmedEmail || !trimmedEmail.includes("@") || !trimmedEmail.includes(".")) {
      setErrorMsg("Please enter a valid email address.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: trimmedName,
          email: trimmedEmail,
          country,
          planData: currentPlan
        })
      });

      const data = await res.json().catch(() => ({}));

      const memberUnlocks = data.unlocks || {
        unlock_1: "Locked",
        unlock_2: "Locked",
        unlock_3: "Locked",
        unlock_4: "Locked",
        unlock_5: "Locked",
        unlock_6: "Locked",
        unlock_7: "Locked"
      };

      if (typeof window !== "undefined") {
        try {
          localStorage.setItem("retirement_is_pro", "true");
          localStorage.setItem("retirement_pro_name", trimmedName);
          localStorage.setItem("retirement_pro_email", trimmedEmail);
          localStorage.setItem("retirement_user_country", country);
          if (currentPlan) {
            localStorage.setItem("retirement_saved_plan", JSON.stringify(currentPlan));
          }
          localStorage.setItem("retirement_unlocks", JSON.stringify(memberUnlocks));
        } catch (err) {}
      }

      if (onAuthSuccess) {
        onAuthSuccess({
          name: trimmedName,
          email: trimmedEmail,
          country,
          planData: currentPlan,
          unlocks: memberUnlocks
        });
      }

      onClose();
    } catch (err) {
      console.warn("Registration error, falling back locally:", err);
      const memberUnlocks = {
        unlock_1: "Locked",
        unlock_2: "Locked",
        unlock_3: "Locked",
        unlock_4: "Locked",
        unlock_5: "Locked",
        unlock_6: "Locked",
        unlock_7: "Locked"
      };

      if (typeof window !== "undefined") {
        try {
          localStorage.setItem("retirement_is_pro", "true");
          localStorage.setItem("retirement_pro_name", trimmedName);
          localStorage.setItem("retirement_pro_email", trimmedEmail);
          localStorage.setItem("retirement_user_country", country);
          if (currentPlan) {
            localStorage.setItem("retirement_saved_plan", JSON.stringify(currentPlan));
          }
          localStorage.setItem("retirement_unlocks", JSON.stringify(memberUnlocks));
        } catch (e) {}
      }

      if (onAuthSuccess) {
        onAuthSuccess({
          name: trimmedName,
          email: trimmedEmail,
          country,
          planData: currentPlan,
          unlocks: memberUnlocks
        });
      }

      onClose();
    } finally {
      setLoading(false);
    }
  };

  const handleSignOutClick = () => {
    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem("retirement_is_pro");
        localStorage.removeItem("retirement_pro_name");
        localStorage.removeItem("retirement_pro_email");
        localStorage.removeItem("retirement_unlocks");
      } catch (e) {}
    }
    setName("");
    setEmail("");
    if (onSignOut) {
      onSignOut();
    }
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-black/10 overflow-hidden flex flex-col p-4 sm:p-5 select-none animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Dedicated Top Header with Close Button */}
        <div className="w-full flex items-center justify-between pb-2.5 mb-3 border-b border-black/10 shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#C59A3F] animate-pulse" />
            <span className="text-[11px] font-black uppercase tracking-[0.18em] text-gray-500">
              {isPro ? "Member Profile" : "Member Portal"}
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full text-gray-400 hover:text-gray-700 hover:bg-black/5 transition-all cursor-pointer"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        {isPro ? (
          /* Logged In View - Compact & Single-Screen Fitted */
          <div className="flex flex-col">
            {/* Compact Member Summary Card */}
            <div className="w-full p-2.5 sm:p-3 bg-[#F8F9FA] rounded-2xl border border-black/6 flex items-center justify-between gap-3 mb-2.5">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white shadow-md shadow-emerald-500/15 shrink-0">
                  <CheckCircle2 size={20} />
                </div>
                <div className="flex flex-col min-w-0 justify-center leading-tight">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs sm:text-sm font-black text-[#1C1C1E] truncate">
                      {proName || "Member Account"}
                    </span>
                    <span className="text-[8.5px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 shrink-0">
                      Active
                    </span>
                  </div>
                  <span className="text-[10.5px] text-gray-500 truncate mt-0.5">
                    {storedEmail || email || "Signed in"}
                  </span>
                </div>
              </div>

              {/* Right Country Pill */}
              <div className="flex flex-col items-end shrink-0 pl-1">
                <span className="text-[9px] font-bold uppercase tracking-wider text-gray-400">
                  Country
                </span>
                <span className="text-[11px] font-bold text-[#8A6414] truncate max-w-[105px]">
                  {country || "Singapore"}
                </span>
              </div>
            </div>

            {/* Quick Unlocks Status Preview */}
            <div className="w-full mb-3 p-2 bg-[#F8F9FA] rounded-2xl border border-black/5 flex flex-col gap-1.5 text-left">
              <div className="flex items-center justify-between px-1 pt-0.5">
                <span className="text-[10px] font-black uppercase tracking-wider text-gray-500">
                  Feature Unlock Status
                </span>
                <span className="text-[9.5px] font-bold text-gray-400">
                  3 Modules
                </span>
              </div>
              {UNLOCKABLE_DEFINITIONS.map((def) => {
                const isUnlocked = (unlocks[def.id] || "").toLowerCase() === "unlocked";
                return (
                  <div
                    key={def.id}
                    className="p-2 sm:p-2.5 rounded-xl bg-white border border-black/6 flex items-center justify-between gap-2 shadow-xs transition-colors"
                  >
                    <div className="flex flex-col min-w-0 pr-1">
                      <span className="font-bold text-[#1C1C1E] text-[11px] sm:text-[11.5px] leading-snug">
                        {def.name}
                      </span>
                      <span className="text-[9.5px] sm:text-[10px] text-gray-500 font-medium leading-tight mt-0.5">
                        {def.desc}
                      </span>
                    </div>
                    {isUnlocked ? (
                      <span className="px-2.5 py-1 rounded-lg bg-gray-100 text-gray-400 border border-gray-200/80 text-[9px] sm:text-[9.5px] font-bold uppercase tracking-wider flex items-center gap-1 shrink-0 self-center select-none opacity-80">
                        <CheckCircle2 size={11} className="text-emerald-600/70" />
                        <span>Unlocked</span>
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleUnlockClick(def)}
                        className="px-2.5 py-1 rounded-lg bg-gradient-to-r from-[#C59A3F] to-[#A37B2C] hover:from-[#A37B2C] hover:to-[#825F1D] text-white text-[9px] sm:text-[9.5px] font-black uppercase tracking-wider flex items-center gap-1 shrink-0 self-center shadow-xs active:scale-95 transition-all cursor-pointer whitespace-nowrap"
                      >
                        <Sparkles size={11} className="text-amber-200 shrink-0" />
                        <span>Unlock · $2</span>
                      </button>
                    )}
                  </div>
                );
              })}
            </div>

            <button
              type="button"
              onClick={handleSignOutClick}
              className="w-full py-2 px-4 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
            >
              <LogOut size={13} />
              <span>Sign Out / Switch Account</span>
            </button>
          </div>
        ) : (
          /* Auth Form: Tabbed Log In (Default) & Register */
          <div className="flex flex-col">
            {/* Mode Switcher Tabs */}
            <div className="flex items-center p-1 bg-[#F2F2F7] rounded-xl mb-4">
              <button
                type="button"
                onClick={() => { setMode("login"); setErrorMsg(""); }}
                className={`flex-1 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer ${
                  mode === "login"
                    ? "bg-white text-[#1C1C1E] shadow-sm"
                    : "text-gray-500 hover:text-gray-900"
                }`}
              >
                Log In
              </button>
              <button
                type="button"
                onClick={() => { setMode("register"); setErrorMsg(""); }}
                className={`flex-1 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer ${
                  mode === "register"
                    ? "bg-white text-[#1C1C1E] shadow-sm"
                    : "text-gray-500 hover:text-gray-900"
                }`}
              >
                Register
              </button>
            </div>

            {/* Header */}
            <div className="flex items-center gap-3 mb-3.5">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#C59A3F] to-[#E5C158] flex items-center justify-center text-white shadow-md shadow-amber-500/20 shrink-0">
                {mode === "login" ? <LogIn size={20} /> : <Sparkles size={20} />}
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-black text-[#1C1C1E] tracking-tight">
                  {mode === "login" ? "Welcome Back" : "Create Member Account"}
                </h3>
                <p className="text-[11.5px] text-gray-500 mt-0.5">
                  {mode === "login"
                    ? "Log in to access your saved simulation and unlockables"
                    : "Register to save your retirement plan and unlock features"}
                </p>
              </div>
            </div>

            {/* Error Banner */}
            {errorMsg && (
              <div className="mb-3 px-3 py-2 bg-red-50 border border-red-200 rounded-xl text-xs font-bold text-red-600 animate-in fade-in">
                {errorMsg}
              </div>
            )}

            {mode === "login" ? (
              /* LOG IN FORM */
              <form onSubmit={handleLoginSubmit} className="flex flex-col">
                <div className="flex flex-col gap-1 mb-4">
                  <label className="text-[10.5px] font-bold text-gray-500 uppercase tracking-wider">
                    Registered Email Address
                  </label>
                  <div className="relative">
                    <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    <input
                      type="email"
                      required
                      placeholder="alex@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full py-2.5 pl-9 pr-3 bg-[#F2F2F7] border border-black/10 rounded-xl font-medium text-xs sm:text-sm text-[#1C1C1E] outline-none focus:border-[#C59A3F] focus:bg-white shadow-sm transition-all"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 bg-gradient-to-r from-[#C59A3F] to-[#A37B2C] hover:from-[#A37B2C] hover:to-[#825F1D] active:scale-98 text-white font-black uppercase tracking-wider text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <LogIn size={14} />
                      <span>Log In</span>
                    </>
                  )}
                </button>
              </form>
            ) : (
              /* REGISTER FORM */
              <form onSubmit={handleRegisterSubmit} className="flex flex-col">
                <div className="flex flex-col gap-3 mb-4">
                  {/* Name Input */}
                  <div className="flex flex-col gap-1">
                    <label className="text-[10.5px] font-bold text-gray-500 uppercase tracking-wider">
                      Your Full Name
                    </label>
                    <div className="relative">
                      <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                      <input
                        type="text"
                        required
                        placeholder="e.g. Alex Morgan"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full py-2.5 pl-9 pr-3 bg-[#F2F2F7] border border-black/10 rounded-xl font-medium text-xs sm:text-sm text-[#1C1C1E] outline-none focus:border-[#C59A3F] focus:bg-white shadow-sm transition-all"
                      />
                    </div>
                  </div>

                  {/* Country Dropdown */}
                  <div className="flex flex-col gap-1">
                    <label className="text-[10.5px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                      <Globe2 size={13} className="text-[#8A6414]" />
                      <span>Country of Residence</span>
                    </label>
                    <select
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="w-full py-2.5 px-3 bg-[#F2F2F7] border border-black/10 rounded-xl font-medium text-xs sm:text-sm text-[#1C1C1E] outline-none focus:border-[#C59A3F] focus:bg-white shadow-sm cursor-pointer transition-all"
                    >
                      {COUNTRIES.map((c) => (
                        <option key={c.code} value={c.name}>
                          {c.name} ({c.symbol})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Email Input */}
                  <div className="flex flex-col gap-1">
                    <label className="text-[10.5px] font-bold text-gray-500 uppercase tracking-wider">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                      <input
                        type="email"
                        required
                        placeholder="alex@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full py-2.5 pl-9 pr-3 bg-[#F2F2F7] border border-black/10 rounded-xl font-medium text-xs sm:text-sm text-[#1C1C1E] outline-none focus:border-[#C59A3F] focus:bg-white shadow-sm transition-all"
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 bg-gradient-to-r from-[#C59A3F] to-[#A37B2C] hover:from-[#A37B2C] hover:to-[#825F1D] active:scale-98 text-white font-black uppercase tracking-wider text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Complete Registration</span>
                      <ArrowRight size={14} />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
