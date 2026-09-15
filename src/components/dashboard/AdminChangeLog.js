export const CURRENT_ADMIN_VERSION = "v1.1.3";

export const ADMIN_CHANGE_LOGS = [
  {
    version: "v1.1.3",
    date: "September 16, 2026",
    title: "Automated Lemon Squeezy Webhook & Direct Full-Page Checkout",
    items: [
      "Built '/api/webhooks/lemonsqueezy' webhook route to automatically provision Supabase Pro user profiles and grant instant cloud access upon payment.",
      "Resolved mobile iframe scroll trapping by opening direct full-screen Lemon Squeezy checkout with native touch scrolling.",
      "Added multi-device Supabase passwordless magic link & password login handling inside the Pro upgrade modal."
    ]
  },
  {
    version: "v1.1.2",
    date: "September 15, 2026",
    title: "Lemon Squeezy $4.00 Pro Suite Checkout Integration",
    items: [
      "Integrated official Lemon Squeezy $4.00 Pro Suite checkout link with embedded Apple Pay, Google Pay, and Card support.",
      "Embedded Lemon.js SDK for seamless in-app payment overlay flow with automatic fallback.",
      "Updated Pro CTA button with '$4.00' pricing badge and direct checkout trigger."
    ]
  },
  {
    version: "v1.1.1",
    date: "September 15, 2026",
    title: "Anti-Wiggle Viewport Lockdown, Stepper Scroll Fix & 2s Pro Carousel",
    items: [
      "Updated Pro carousel auto-advance timer to a brisk 2.0-second interval.",
      "Fixed step 4 input scroll-into-view behavior with multi-pass focus triggers (immediate, 150ms, and 350ms) to clear mobile virtual keyboards.",
      "Added extended bottom scroll runway to step onboarding dialog container.",
      "Applied strict viewport lockdown across html, body, #__next, and main containers with overscroll-behavior: none and touch-action constraints to completely eliminate pull-to-refresh wiggle on Chrome."
    ]
  },
  {
    version: "v1.1.0",
    date: "September 15, 2026",
    title: "Pro Upgrade Carousel Modal, IBKR Partner Slot & Trajectory Curve Synchronization",
    items: [
      "Designed and implemented fixed-height non-scrollable Pro Upgrade Modal with auto-swiping carousel preview.",
      "Expanded preview canvas with dedicated mockup screenshot containers for Monte Carlo, Territory Inflation, Derived CAGR, and Cloud Sync.",
      "Unified carousel descriptions and converted bottom feature indicators to single-line responsive grids.",
      "Integrated Interactive Brokers (IBKR) official SVG affiliate partner ad banner.",
      "Added keyboard auto-detection (visualViewport / focusin) to hide bottom ad banner on mobile inputs.",
      "Refactored retirement trajectory coordinate projection to eliminate label/milestone badge overlap between retirement age and $0 depletion age."
    ]
  }
];
