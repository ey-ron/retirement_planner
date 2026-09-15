export const CURRENT_ADMIN_VERSION = "v1.1.1";

export const ADMIN_CHANGE_LOGS = [
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
