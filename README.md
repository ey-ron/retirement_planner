# Retirement Simulator & Horizon Cockpit

![Next.js](https://img.shields.io/badge/Next.js-16.1-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-19.0-61DAFB?style=flat-square&logo=react)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.2-38B2AC?style=flat-square&logo=tailwind-css)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=flat-square&logo=supabase)
![Lemon Squeezy](https://img.shields.io/badge/Lemon_Squeezy-Integrated-yellow?style=flat-square)
![License](https://img.shields.io/badge/License-MIT-blue?style=flat-square)

An intelligent, mobile-first **Retirement Planning & Portfolio Trajectory Simulator** built with **Next.js**, **React**, **Tailwind CSS**, and **Supabase**. The platform helps individuals calculate their required retirement corpus, simulate compound portfolio growth, detect potential capital depletion before end-of-life, and stress-test assumptions with real-time actuarial mathematics and interactive trajectory curves.

---

## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Step-by-Step Navigation Guide](#step-by-step-navigation-guide)
  - [1. First Launch & Splash Screen](#1-first-launch--splash-screen)
  - [2. 6-Step Guided Planning Wizard](#2-6-step-guided-planning-wizard)
  - [3. Main Retirement Cockpit Dashboard](#3-main-retirement-cockpit-dashboard)
  - [4. Trajectory Visualization & Depletion Detection](#4-trajectory-visualization--depletion-detection)
  - [5. Editing and Resetting Plans](#5-editing-and-resetting-plans)
  - [6. Monetization & Interactive Brokers Banner](#6-monetization--interactive-brokers-banner)
  - [7. Premium Pro Upgrade & Checkout Workflow](#7-premium-pro-upgrade--checkout-workflow)
- [Mathematical & Simulation Engine](#mathematical--simulation-engine)
- [Project Architecture](#project-architecture)
- [Tech Stack](#tech-stack)
- [Prerequisites & Local Development](#prerequisites--local-development)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [Deployment (Vercel)](#deployment-vercel)
- [License](#license)

---

## Overview

Traditional retirement calculators present static spreadsheets and unrealistic linear projections that ignore inflation compounding and sequence-of-returns drawdown realities. 

**Retirement Simulator** provides:
- **Instant Actuarial Feedback**: Automatic age calculation from birth date, dynamic retirement horizons, and real-time required nest egg calculations.
- **Visualized Decumulation & Depletion Alerts**: An interactive SVG trajectory curve that plots accumulation to retirement apex and monitors drawdown down to life expectancy, with early $0 depletion badges and guaranteed milestone separation.
- **Mobile-First PWA Experience**: Crafted with native iOS styling, safe area padding, virtual keyboard detection, and tactile card feedback.
- **Seamless Pro Monetization**: Built-in Lemon Squeezy payment integration and Supabase authentication for premium stress-testing and cloud synchronization.

---

## Key Features

### 🧮 1. Dynamic Actuarial & Financial Modeling
- Exact age derivation from user birth date.
- Real-time compounding of current monthly expenses into future retirement living costs using custom inflation estimates.
- Present-value discounted corpus estimation for drawdown years.
- Annuity compounding of existing nest egg plus recurring monthly contributions.

### 📈 2. Interactive SVG Trajectory Curve
- Dynamic Bézier/linear SVG path plotting portfolio accumulation from current age to retirement age, followed by drawdown through life expectancy.
- **Visual Separation Algorithm**: Ensures milestone badges (Retirement Age and $0 Depletion point) never collide visually, even when depletion occurs shortly after retirement.
- Real-time funded status badge (`% Funded`, `On Track`, or `Shortfall`).

### 📱 3. Mobile Shell & PWA Support
- Built-in `viewport-fit=cover` and iOS safe area spacing (`env(safe-area-inset-bottom)`).
- **Virtual Keyboard Awareness**: Uses `window.visualViewport` and focus listeners to prevent mobile keyboard layout thrashing and hide fixed bottom banners during typing.
- Persistent local storage caching for immediate offline scenario retention.

### 💎 4. Pro Suite & Payment Ecosystem
- Native Lemon Squeezy checkout integration via in-app overlay.
- Webhook and client-side license verification endpoints.
- Dedicated Pro Member state with custom avatar branding.
- Preview carousel showcasing 10,000+ Monte Carlo runs, regional CPI data feeds, and multi-asset yield modeling.

### 🤝 5. Affiliate Partner Integration
- Native Interactive Brokers (IBKR) partner banner providing referral monetization.

---

## Step-by-Step Navigation Guide

This section explains how to navigate every feature and screen in the application.

```
                  ┌──────────────────────┐
                  │    Splash Screen     │
                  │  (Supernova Intro)   │
                  └──────────┬───────────┘
                             │
            ┌────────────────┴────────────────┐
            ▼                                 ▼
   [First-time Visitor]              [Returning Visitor]
 ┌──────────────────────┐          ┌──────────────────────┐
 │  6-Step Setup Wizard │          │  Retirement Cockpit  │
 └──────────┬───────────┘          └──────────┬───────────┘
            │ "Apply to Simulation"           │
            └────────────────►◄───────────────┘
                               │
       ┌───────────────────────┼───────────────────────┐
       ▼                       ▼                       ▼
┌──────────────┐      ┌─────────────────┐     ┌──────────────────┐
│ Edit / Reset │      │ "Go Pro" Modal  │     │ Partner Banner   │
│ Plan Params  │      │ (Lemon Squeezy) │     │ (IBKR Referral)  │
└──────────────┘      └─────────────────┘     └──────────────────┘
```

### 1. First Launch & Splash Screen
1. Navigate to the website root (`/`).
2. The **Supernova Splash Screen** renders with high-performance animations while initial assets mount.
3. Once complete, visitors always enter directly into the **6-Step Setup Wizard** (the simulation is ephemeral and intentionally not saved in browser storage, so returning visitors start fresh each visit).

---

### 2. 6-Step Guided Planning Wizard
The wizard guides users through entering their retirement inputs with instant validation:

- **Step 1: Date of Birth**
  - Select **Month**, **Day**, and **Year** from the stylized pickers.
  - The calculated actuarial age updates automatically in real-time.
  - Tap **Next Step** to proceed.

- **Step 2: Monthly Living Expenses**
  - Enter current monthly costs using numeric input with automatic thousand-separator formatting (`$3,000`).
  - Or tap quick-preset buttons: **$2,000**, **$3,000**, **$5,000**, or **$8,000**.
  - Tap **Next Step**.

- **Step 3: Target Retirement Age & Life Horizon**
  - Adjust the **Retire Age** slider (minimum: Current Age + 1, maximum: 80).
  - Adjust the **Horizon / Life Expectancy** slider (minimum: Retire Age + 1, maximum: 105).
  - The live card calculates the total drawdown window in years.
  - Tap **Next Step**.

- **Step 4: Starting Nest Egg & Ongoing Savings**
  - Input **Current Starting Nest Egg** (existing portfolio/savings).
  - Input **Planned Monthly Contribution** (monthly dollar amount committed).
  - Tap **Next Step**.

- **Step 5: Expected Market Returns & Inflation**
  - Slide **Growth (CAGR)** between 2.0% and 15.0% (default: 8.0%).
  - Slide **Inflation (Est.)** between 1.0% and 8.0% (default: 3.5%).
  - Real Net Growth Rate is computed automatically (`CAGR - Inflation`).
  - Tap **Next Step**.

- **Step 6: Simulation Forecast & Verification**
  - Review the calculated metrics:
    - **Future Monthly Burn**: Compounded living cost at retirement age.
    - **Required Target Corpus**: Total capital required to sustain expenses.
    - **Projected Nest Egg**: Expected capital accumulated by retirement.
    - **Status Badge**: Displays `ON TRACK` (green) or `SHORTFALL` (orange) with gap amount.
  - Tap **Apply to Simulation** to save to `localStorage` and transition into the interactive Cockpit.

---

### 3. Main Retirement Cockpit Dashboard
Once parameters are applied, the user lands on the **Retirement Cockpit**:

1. **Hero Summary Card (Top Gold Card)**:
   - Displays **Retire Year**, **Retirement Age**, and **% Funded**.
   - Side-by-side comparison of **Target Corpus** vs. **Projected Savings**.
   - *Quick Interaction*: Clicking anywhere on this hero card opens the parameter editor modal.

2. **Portfolio Trajectory Card (Central Chart)**:
   - Interactive SVG displaying portfolio balance trajectory from current age to life expectancy.
   - Highlights the apex at retirement age.
   - Displays timeline milestone points along the horizontal axis.

3. **Risk Warning & Sequence of Returns Card**:
   - Outlines why linear returns fail during early retirement market drawdowns.
   - Prompts users to explore Monte Carlo stress-testing in the Pro Suite.

4. **Action Bar (Bottom)**:
   - **Edit Plan Parameters (Gold Button)**: Reopens the 6-step wizard to tweak assumptions.
   - **Reset Simulation (Rotate Icon Button)**: Clears `retirement_info_entered` and returns to the initial state.

---

### 4. Trajectory Visualization & Depletion Detection
The visual trajectory engine monitors portfolio solvency during the drawdown phase:
- **Solvent Plan**: The curve remains above $0 throughout retirement up to life expectancy. The gold **Retire** badge marks the turning point.
- **Insolvent Plan ($0 Depletion)**:
  - If annual living expenses exceed portfolio growth during drawdown, the curve drops to zero.
  - An elevated red **$0** badge appears at the exact depletion age.
  - A dashed guideline drops to the timeline axis, alerting the user to early capital exhaustion.
  - The chart enforces minimum visual spacing between the Retire badge and the $0 badge so labels never overlap.

---

### 5. Editing and Resetting Plans
- **To update variables**: Tap **Edit Plan Parameters** or tap the **Hero Card**. You can jump back and forth between steps using the **Back** and **Next Step** buttons.
- **To reset**: Tap the circular **Reset** button next to Edit Plan Parameters. This resets the cache and reopens the initial setup.

---

### 6. Monetization & Interactive Brokers Banner
- A fixed bottom banner displays official Interactive Brokers branding.
- Tapping **Claim** opens the referral URL in a new tab with sponsor attributes (`rel="noopener noreferrer sponsored"`).
- When a mobile keyboard is open, the banner automatically hides to maximize screen real estate.

---

### 7. Member Authentication & 7 Unlockables Suite
1. **Open Authentication Modal**: Tap the **Log In** button in the top floating header (proportional in height and padding to the bottom partner banner).
2. **Log In (Default)**:
   - Enter your registered email address to sign in and load your 7 module statuses.
   - Or click **Register here** to switch to the registration view.
3. **Register Tab**:
   - Enter **Full Name** and **Email Address** without verification friction.
   - Tap **Complete Registration** to create your profile and initialize unlockable statuses.
4. **Member UI & 7 Unlockables**:
   - Displays the **Member Feature Suite** containing 7 placeholder modules (`unlock_1` to `unlock_7`), each displaying its **Unlocked** or **Locked** status:
     1. 10,000+ Monte Carlo Engine
     2. Regional CPI & Macro Inflation Feeds
     3. Multi-Asset Yield Allocation
     4. Encrypted Cloud Plan Vault
     5. Bear Market Drawdown Simulator
     6. Tax & Drawdown Optimization
     7. Multi-Scenario Side-by-Side Comparison
   - Includes a **Simulator** toggle to jump between the Member Modules view and the Interactive Simulator sandbox.
5. **Preserved Pro Modal**:
   - The previous Lemon Squeezy checkout & feature carousel modal is preserved in `src/components/PremiumUpgradeModal.js`.

---

## Mathematical & Simulation Engine

### 1. Actuarial Age Calculation
$$\text{Age} = \text{CurrentYear} - \text{BirthYear} - (1 \text{ if birthday hasn't occurred this year, else } 0)$$

### 2. Compounded Future Monthly Expense
$$\text{Future Expense} = \text{Current Expense} \times (1 + r_{\text{inf\_m}})^{\text{MonthsToRetire}}$$
*where $r_{\text{inf\_m}} = \frac{\text{Inflation Rate}}{12}$.*

### 3. Required Corpus at Retirement
Calculated backwards from final life expectancy month ($M_{\text{retire}}$ down to $0$):
$$\text{Corpus}_{m-1} = \frac{\text{Corpus}_m + \text{Expense}_m}{1 + r_{\text{cagr\_m}}}$$
*where $r_{\text{cagr\_m}} = \frac{\text{Expected CAGR}}{12}$.*

### 4. Projected Accumulated Nest Egg
$$\text{Projected} = \left[ \text{Initial Nest Egg} \times (1 + r_{\text{cagr\_m}})^N \right] + \sum_{i=0}^{N-1} \text{Monthly Investment} \times (1 + r_{\text{cagr\_m}})^{N - 1 - i}$$
*where $N = \text{Months to Retire}$.*

### 5. Funded Percentage & Solvency
$$\text{Funded \%} = \min\left(250\%, \frac{\text{Projected Nest Egg}}{\text{Required Target Corpus}} \times 100\right)$$
$$\text{Shortfall} = \text{Required Target Corpus} - \text{Projected Nest Egg}$$

---

## Project Architecture

```
retirement_planner/
├── public/
│   ├── favicon.ico
│   ├── icon-192x192.png
│   ├── icon-512x512.png
│   ├── manifest.json            # PWA Web App Manifest
│   └── images/
│       └── ibkr-logo.svg        # Partner brand asset
├── src/
│   ├── components/
│   │   ├── HomeDashboard.js     # Top-level state & offline cache coordinator
│   │   ├── MobileShell.js       # App shell, responsive header, viewport tracking
│   │   ├── RetirementCockpit.js # 6-Step wizard, trajectory SVG, simulation math
│   │   ├── PartnerAdBanner.js   # Interactive Brokers affiliate banner
│   │   ├── PremiumUpgradeModal.js # Feature carousel, Lemon Squeezy checkout & auth
│   │   └── SplashScreen.js      # Animated entry splash screen
│   ├── lib/
│   │   └── supabaseClient.js    # Client-side Supabase client initialization
│   ├── pages/
│   │   ├── _app.js              # Global styles & layout wrapper
│   │   ├── _document.js         # HTML document & meta tags
│   │   ├── index.js             # Root entry route
│   │   └── api/
│   │       ├── auth/
│   │       │   ├── record-purchase.js # Purchase recording endpoint
│   │       │   └── restore-pro.js     # Pro subscription recovery
│   │       └── webhooks/
│   │           └── lemonsqueezy.js    # Lemon Squeezy payment webhook handler
│   └── styles/
│       └── globals.css          # Tailwind directives & custom slider styles
├── package.json
├── tailwind.config.js
├── next.config.js
└── README.md
```

---

## Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Framework** | [Next.js 16](https://nextjs.org/) (Pages Router) |
| **UI Library** | [React 19](https://react.dev/) |
| **Styling** | [Tailwind CSS 3](https://tailwindcss.com/) with Vanilla CSS enhancements |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **Database & Auth** | [Supabase](https://supabase.com/) |
| **Payments** | [Lemon Squeezy](https://www.lemonsqueezy.com/) (Lemon.js SDK & Webhooks) |
| **PWA** | Web App Manifest, Standalone viewport-fit mode |

---

## Prerequisites & Local Development

### Prerequisites
- **Node.js**: `v18.x` or `v20.x` or higher
- **npm** or **pnpm**
- **Git**

### Installation Steps

1. **Clone the repository**:
   ```bash
   git clone https://github.com/ey-ron/retirement_planner.git
   cd retirement_planner
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the local development server**:
   ```bash
   npm run dev
   ```

4. **Access the application**:
   Open your browser at [http://localhost:3000](http://localhost:3000).

---

## Environment Variables

Create a `.env.local` file in the project root:

```env
# Supabase (Auth and Database)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Lemon Squeezy Payment Gateway
LEMONSQUEEZY_WEBHOOK_SECRET=your-lemon-squeezy-webhook-secret
LEMONSQUEEZY_API_KEY=your-lemon-squeezy-api-key
LEMONSQUEEZY_STORE_ID=your-lemon-squeezy-store-id
```

---

## API Endpoints

| Endpoint | Method | Purpose |
| :--- | :--- | :--- |
| `/api/auth/register` | `POST` | Registers a new member (name, email, country), initializes 7 feature unlocks, and saves current simulation plan. |
| `/api/auth/login` | `POST` | Frictionless login via email, returning member profile, feature unlock states, and latest saved plan. |
| `/api/auth/save-plan` | `POST` | Auto-saves completed simulation metrics and parameters directly to `user_retirement_plans` table. |
| `/api/webhooks/lemonsqueezy` | `POST` | Receives and validates order creation events from Lemon Squeezy. |
| `/api/auth/record-purchase` | `POST` | Records verified customer purchases into Supabase. |
| `/api/auth/restore-pro` | `POST` | Restores Pro status for existing customers via verified email. |

---

## Deployment (Vercel)

The application is configured for deployment on **Vercel**:

1. Push your repository to GitHub or GitLab.
2. Connect your repository in [Vercel Dashboard](https://vercel.com).
3. Under **Settings > Environment Variables**, add your Supabase and Lemon Squeezy environment variables.
4. Deploy. Build command: `npm run build`.

---

## License

Distributed under the **MIT License**. See [LICENSE.md](LICENSE.md) for details.
