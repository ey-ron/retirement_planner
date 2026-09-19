import React, { useState, useEffect } from "react";

function detectBrowser() {
  if (typeof window === "undefined" || !navigator) return "Browser";
  const ua = navigator.userAgent;

  if (/Instagram/i.test(ua)) return "Instagram";
  if (/FBAN|FBAV/i.test(ua)) return "Facebook";
  if (/Line\//i.test(ua)) return "Line";
  if (/MicroMessenger/i.test(ua)) return "WeChat";
  if (/TikTok/i.test(ua)) return "TikTok";
  if (/Twitter|X\//i.test(ua)) return "X/Twitter";
  if (/Edg/i.test(ua)) return "Edge";
  if (/OPR|Opera/i.test(ua)) return "Opera";
  if (/SamsungBrowser/i.test(ua)) return "Samsung";
  if (/Chrome|CriOS/i.test(ua)) return "Chrome";
  if (/Firefox|FxiOS/i.test(ua)) return "Firefox";
  if (/Safari/i.test(ua) && !/Chrome|CriOS/i.test(ua)) return "Safari";

  return "Web";
}

function getTier(w, h) {
  // Tier 1: Ultra-Compact iPhone (e.g. iPhone SE 375x667 or small width <= 375 and h <= 670)
  if (w <= 375 && h <= 670) return "Tier 1";

  // Tier 2: Standard Modern iPhone (e.g. iPhone 15 Pro 393x655, iPhone 12-16 390x664)
  if (h <= 670) return "Tier 2";

  // Tier 3: Standard Android Mid (e.g. Galaxy A54/A55 360x740, narrow <= 370, h 671-780)
  if (w <= 370 && h <= 780) return "Tier 3";

  // Tier 5: Large iPhone Plus / Pro Max (e.g. iPhone 15 Pro Max 430x740, wide >= 420, h <= 780)
  if (w >= 420 && h <= 780) return "Tier 5";

  // Tier 4: Modern Android Note (e.g. Xiaomi Note 12 5G 383x763, w 371-419, h 671-800)
  if (h <= 800) return "Tier 4";

  // Tier 6: Flagship Tall Android (e.g. Samsung S24 Ultra 412x869, Pixel Pro h > 800)
  return "Tier 6";
}

export default function ViewportOverlay() {
  const [dimensions, setDimensions] = useState(null);
  const [browserName, setBrowserName] = useState("");

  useEffect(() => {
    if (typeof window === "undefined") return;

    setBrowserName(detectBrowser());

    const updateSize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const dpr = window.devicePixelRatio ? Math.round(window.devicePixelRatio * 10) / 10 : 1;
      const vh = window.visualViewport ? Math.round(window.visualViewport.height) : h;
      setDimensions({ w, h, dpr, vh });
    };

    updateSize();

    window.addEventListener("resize", updateSize);
    if (window.visualViewport) {
      window.visualViewport.addEventListener("resize", updateSize);
    }

    return () => {
      window.removeEventListener("resize", updateSize);
      if (window.visualViewport) {
        window.visualViewport.removeEventListener("resize", updateSize);
      }
    };
  }, []);

  if (!dimensions) return null;

  const currentTier = getTier(dimensions.w, dimensions.h);

  return (
    <div className="fixed top-2 right-2 z-[99999] pointer-events-none select-none">
      <div className="bg-black/80 backdrop-blur-md text-white border border-white/20 px-2 py-1 rounded-md shadow-lg flex items-center gap-1.5 font-mono text-[9px] sm:text-[10px] leading-tight font-medium">
        <span className="text-cyan-400 font-extrabold">{currentTier}</span>
        <span className="text-white/40">|</span>
        <span className="text-amber-400 font-bold">{browserName}</span>
        <span className="text-white/40">|</span>
        <span className="text-emerald-400 font-semibold">
          {dimensions.w}×{dimensions.h}
        </span>
        <span className="text-white/50 text-[8px] sm:text-[9px]">
          ({dimensions.dpr}x)
        </span>
      </div>
    </div>
  );
}
