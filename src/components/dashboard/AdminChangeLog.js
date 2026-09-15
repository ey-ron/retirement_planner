export const CURRENT_ADMIN_VERSION = "v1.1.6";

export const ADMIN_CHANGE_LOGS = [
  {
    version: "v1.1.6",
    date: "September 16, 2026",
    title: "Pro Sign Out, Simulator Reset Button & Custom Dynamic Range Sliders",
    items: [
      "Added Pro sign-out action within the Pro Activated modal to clear active Pro sessions and reset back to the standard retirement simulator.",
      "Configured Pro badge click handler to reliably open the Pro Activated modal with account details and sign-out controls.",
      "Added a dedicated icon-only Reset action button alongside 'Edit Plan Parameters' to clear simulation data back to the initial trajectory view.",
      "Replaced native browser slider rendering with custom iOS-style range sliders featuring dynamic gradient track fills to completely eliminate dark/black unfilled backgrounds in dark mode.",
      "Centered range slider thumbs vertically on 6px tracks with matching theme accent rings."
    ]
  },
  {
    version: "v1.1.5",
    date: "September 16, 2026",
    title: "Instant Zero-Password Pro Restoration & Error Elimination",
    items: [
      "Replaced traditional password-required login form with a dedicated 1-click 'Restore Pro Access' endpoint (/api/auth/restore-pro) that restores Pro license directly via purchase email.",
      "Integrated customer name capture from Lemon Squeezy checkout into Supabase profiles, localStorage, and personalized celebration views.",
      "Added dedicated 'Under Development' Pro dashboard placeholder for active Pro subscribers while retaining header and bottom partner ad placements.",
      "Automatically dismissed Lemon Squeezy checkout overlay upon successful payment to immediately reveal the in-app Pro celebration popup.",
      "Eliminated 'Invalid login credentials' error completely for Lemon Squeezy purchasers.",
      "Streamlined Pro celebration pop-up dimensions and internal padding for a compact, snug fit without excess empty space.",
      "Updated header badge to display clean 'Pro' indicator.",
      "Preserved bottom partner placement persistently across both standard and Pro views.",
      "Seamlessly stores verified Pro credentials to localStorage and triggers instant UI unlock across all components."
    ]
  },
  {
    version: "v1.1.4",
    date: "September 16, 2026",
    title: "Instant In-Browser Pro Activation & 1-Click Magic Sign-In Fallback",
    items: [
      "Added instant celebratory success screen upon checkout completion with automatic local session unlock (bypassing password barriers).",
      "Removed bottom partner ad banner automatically when Pro access is active.",
      "Added automatic passwordless Magic Link fallback for returning users so they never see 'Invalid login credentials'."
    ]
  },
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
