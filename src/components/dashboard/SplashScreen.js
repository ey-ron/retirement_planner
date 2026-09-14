import React, { useState, useEffect } from "react";

/**
 * Premium Retirement Simulator Splash Screen
 * 120Hz hardware-composited, sophisticated financial entrance.
 * Designed with a light-mode aesthetic, ascending wealth trajectory flourish,
 * refined brand typography, and buttery-smooth spring exit.
 */
export default function SplashScreen({ onComplete }) {
  const [fadingOut, setFadingOut] = useState(false);

  useEffect(() => {
    // 1. Smooth fadeout trigger at 1450ms
    const fadeTimer = setTimeout(() => {
      setFadingOut(true);
    }, 1450);

    // 2. Complete transition and reveal dashboard at 1900ms
    const doneTimer = setTimeout(() => {
      if (onComplete) onComplete();
    }, 1900);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(doneTimer);
    };
  }, [onComplete]);

  return (
    <div
      id="retirement-splash"
      className={`fixed inset-0 z-[99999999] bg-[#F2F2F7] flex flex-col items-center justify-center overflow-hidden pointer-events-auto select-none transition-all duration-500 ease-out ${
        fadingOut ? "opacity-0 scale-[1.02] pointer-events-none" : "opacity-100 scale-100"
      }`}
      style={{
        transform: "translate3d(0, 0, 0)",
        willChange: "opacity, transform",
        backfaceVisibility: "hidden"
      }}
    >
      <style>{`
        /* 120Hz ProMotion Smooth Curves */
        @keyframes emblemEntrance {
          0% {
            transform: scale3d(0.82, 0.82, 1) translate3d(0, 14px, 0);
            opacity: 0;
          }
          100% {
            transform: scale3d(1, 1, 1) translate3d(0, 0, 0);
            opacity: 1;
          }
        }

        @keyframes trajectoryDraw {
          0% {
            stroke-dashoffset: 120;
          }
          100% {
            stroke-dashoffset: 0;
          }
        }

        @keyframes pointGlow {
          0%, 30% {
            transform: scale3d(0, 0, 1);
            opacity: 0;
          }
          60% {
            transform: scale3d(1.4, 1.4, 1);
            opacity: 1;
          }
          100% {
            transform: scale3d(1, 1, 1);
            opacity: 1;
          }
        }

        @keyframes textEntrance {
          0% {
            transform: translate3d(0, 10px, 0);
            opacity: 0;
          }
          100% {
            transform: translate3d(0, 0, 0);
            opacity: 1;
          }
        }

        @keyframes progressBar {
          0% {
            width: 0%;
          }
          40% {
            width: 55%;
          }
          100% {
            width: 100%;
          }
        }

        @keyframes ambientAura {
          0%, 100% {
            transform: scale3d(0.95, 0.95, 1);
            opacity: 0.5;
          }
          50% {
            transform: scale3d(1.08, 1.08, 1);
            opacity: 0.85;
          }
        }

        .anim-emblem {
          animation: emblemEntrance 0.75s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .anim-trajectory {
          stroke-dasharray: 120;
          stroke-dashoffset: 120;
          animation: trajectoryDraw 1.1s cubic-bezier(0.2, 0.8, 0.25, 1) 0.15s forwards;
        }

        .anim-point {
          transform-origin: 40px 14px;
          animation: pointGlow 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.4s forwards;
        }

        .anim-text {
          animation: textEntrance 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.25s forwards;
        }

        .anim-progress {
          animation: progressBar 1.35s cubic-bezier(0.2, 0.85, 0.3, 1) 0.2s forwards;
        }

        .anim-aura {
          animation: ambientAura 2.5s ease-in-out infinite;
        }
      `}</style>

      {/* Subtle Warm Golden Ambient Glow in Center */}
      <div 
        className="absolute w-[360px] h-[360px] rounded-full pointer-events-none anim-aura"
        style={{
          background: "radial-gradient(circle, rgba(197, 154, 63, 0.12) 0%, rgba(212, 175, 55, 0.05) 50%, transparent 70%)",
          filter: "blur(40px)"
        }}
      />

      {/* Core Brand Card / Emblem */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-xs px-6">
        
        {/* Golden Horizon Emblem */}
        <div className="relative mb-5 anim-emblem">
          {/* Outer Soft Ring */}
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-[#C59A3F] to-[#F3D78A] p-[1.5px] shadow-[0_12px_32px_rgba(197,154,63,0.22)]">
            <div className="w-full h-full rounded-[22px] bg-white flex items-center justify-center relative overflow-hidden">
              
              {/* Internal subtle gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-b from-[#C59A3F]/10 via-transparent to-transparent pointer-events-none" />

              {/* Dynamic Upward Trajectory Arc SVG */}
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none" className="relative z-10">
                {/* Horizontal Horizon Baseline */}
                <line 
                  x1="8" y1="38" x2="40" y2="38" 
                  stroke="rgba(28, 28, 30, 0.12)" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                />

                {/* Steeper Wealth Accumulation Growth Curve */}
                <path
                  d="M 10 36 C 20 36, 26 28, 38 14"
                  fill="none"
                  stroke="url(#trajectoryGradient)"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  className="anim-trajectory"
                />

                {/* Milestone Goal Star / Compass Point */}
                <circle
                  cx="38"
                  cy="14"
                  r="4"
                  fill="#C59A3F"
                  stroke="#FFFFFF"
                  strokeWidth="2"
                  className="anim-point"
                />

                {/* Gradient Definition */}
                <defs>
                  <linearGradient id="trajectoryGradient" x1="10" y1="36" x2="38" y2="14" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#A37B2C" />
                    <stop offset="0.6" stopColor="#C59A3F" />
                    <stop offset="1" stopColor="#E5C158" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>

          {/* Floating Subtle Shimmer Badge */}
          <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-gradient-to-tr from-[#C59A3F] to-[#E5C158] border-2 border-white flex items-center justify-center shadow-md">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="19" x2="12" y2="5"></line>
              <polyline points="5 12 12 5 19 12"></polyline>
            </svg>
          </div>
        </div>

        {/* Title & Identity */}
        <div className="flex flex-col items-center opacity-0 anim-text">
          <div className="flex items-center gap-1.5">
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-[#1C1C1E]">
              Retirement Simulator
            </h1>
            <span className="w-1.5 h-1.5 rounded-full bg-[#C59A3F] shadow-[0_0_6px_#C59A3F] shrink-0 mb-0.5" />
          </div>

          <p className="text-[11px] font-bold text-gray-500 tracking-wider uppercase mt-1.5 leading-relaxed">
            Financial Horizon & Trajectory
          </p>

          {/* Elegant Slim Loading Bar */}
          <div className="w-36 h-[3px] bg-black/5 rounded-full overflow-hidden mt-5 relative">
            <div className="h-full bg-gradient-to-r from-[#C59A3F] via-[#E5C158] to-[#C59A3F] rounded-full anim-progress" />
          </div>
        </div>

      </div>
    </div>
  );
}