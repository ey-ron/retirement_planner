# Developer Portfolio & Personal Wealth Dashboard

![Vercel Deployment Status](https://deploy-badge.vercel.app/api/eyrons-projects-77a0edda/portfolio)
![Next.js](https://img.shields.io/badge/Next.js-16.1-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-19.0-61DAFB?style=flat-square&logo=react)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.2-38B2AC?style=flat-square&logo=tailwind-css)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=flat-square&logo=supabase)
![License](https://img.shields.io/badge/License-MIT-blue?style=flat-square)

An all-in-one personal finance, portfolio tracker, and wealth management web application built with **Next.js**, **React**, **Tailwind CSS**, and **Supabase**. Features automated brokerage sync (IBKR), bank statement parsing (UOB, DBS, BPI), real-time stock/crypto market tracking, multi-currency conversion, budget pacing analytics, and biometric passkey authentication.

---

## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Project Architecture](#project-architecture)
- [Prerequisites](#prerequisites)
- [Step-by-Step Setup & Installation](#step-by-step-setup--installation)
  - [1. Clone Repository & Install Dependencies](#1-clone-repository--install-dependencies)
  - [2. Supabase Database Setup](#2-supabase-database-setup)
  - [3. Configure Environment Variables](#3-configure-environment-variables)
  - [4. Run Local Development Server](#4-run-local-development-server)
- [Brokerage & API Integrations](#brokerage--api-integrations)
  - [Interactive Brokers (IBKR) Sync](#interactive-brokers-ibkr-sync)
  - [Bank Statement Parser (PDF/XLS)](#bank-statement-parser-pdfxls)
- [Automated Cron Snapshots](#automated-cron-snapshots)
- [Deployment Guide (Vercel)](#deployment-guide-vercel)
- [License](#license)

---

## Overview

This application serves as a unified financial command center designed for mobile PWAs and desktop displays alike. It aggregates assets, liabilities, stocks, options contracts, cash accounts, and monthly expenses into a single real-time dashboard.

Key capabilities include:
- **Real-Time Net Worth Calculation**: Calculates total net worth with instant currency conversions across base and secondary currencies (SGD, USD, PHP, EUR, JPY, etc.).
- **Mobile-First PWA & Adaptive Desktop UI**: Mobile view designed around iOS navigation paradigms with gesture support, dark/light theme switching, and standalone PWA support.
- **Automated Market Price Fetching**: Live price feeds from Yahoo Finance and Phisix APIs with server-side caching.
- **Budget Pacing & Intelligence**: Real-time spending velocity alerts, category budget caps, and AI-assisted financial diagnostics.

---

## Key Features

### 📈 1. Investments & Stock Portfolio
- Multi-asset tracking for Stocks, ETFs, Crypto, Options contracts, and Fixed Income.
- Automated **Interactive Brokers (IBKR) Flex Web Service** sync for live positions and option contracts.
- Interactive charts (Chart.js & TradingView Lightweight Charts) showing performance, cost basis, unrealized P&L, and dividend projections.
- Live search & autocomplete for global ticker symbols with currency auto-conversion.

### 💳 2. Smart Budgeting & Spend Tracking
- Categorized spend logging with monthly budget limits.
- **Budget Pacing Engine**: Tracks daily burn rate against current day of the month with warning indicators for front-loaded or excessive spending.
- **Bank Statement Parser**: Direct upload for UOB (PDF/XLS), DBS (PDF), and BPI (PDF) statements with automatic merchant mapping rules.

### 🏦 3. Asset & Liability Management
- Track liquid cash balances, savings, real estate holdings, retirement accounts, and loan liabilities.
- YoY net worth growth visualizer and monthly trend performance breakdowns.

### 🛡️ 4. Security & Biometrics
- Supabase Auth integration.
- **WebAuthn / Passkey Support**: Biometric authentication (Touch ID, Face ID, Windows Hello) using `@simplewebauthn`.

### 🌓 5. Dynamic Theme Engine
- Native Light & Dark theme toggle with desaturated soft dark color palettes to minimize eye strain.
- Dynamic Chart.js color redraws synchronized with system theme state.

---

## Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Framework** | [Next.js 16](https://nextjs.org/) (Pages Router) |
| **UI & Styling** | [React 19](https://react.dev/), [Tailwind CSS 3](https://tailwindcss.com/), [Framer Motion](https://www.framer.com/motion/) |
| **Database & Auth** | [Supabase](https://supabase.com/) (PostgreSQL, Row Level Security, `@supabase/ssr`) |
| **Authentication** | Passkeys / WebAuthn (`@simplewebauthn`), Supabase Auth |
| **Charts & Visuals** | [Chart.js 4](https://www.chartjs.org/), [Lightweight Charts](https://tradingview.github.io/lightweight-charts/) |
| **Market Data APIs** | Yahoo Finance (`yahoo-finance2`), Phisix API, World Bank Inflation API |
| **Statement Parsers** | `pdf2json`, `xlsx` |
| **AI Integration** | Google Generative AI (`@google/generative-ai`), Groq API |

---

## Project Architecture

```
portfolio/
├── public/                  # Static assets (logos, bank icons, PWA manifest)
├── src/
│   ├── components/
│   │   ├── dashboard/
│   │   │   ├── HomeDashboard.js    # Desktop Layout Command Center
│   │   │   ├── layouts/
│   │   │   │   └── MobileShell.js  # Mobile PWA Container & Global Dark Theme
│   │   │   └── mobile/             # Mobile Sub-Tab Views
│   │   │       ├── HomeTab.js      # YoY Trend Charts & Net Worth Summary
│   │   │       ├── StocksTab.js    # Portfolio, Options & Holdings
│   │   │       ├── SpendsTab.js    # Expense Logs & Pacing Engine
│   │   │       ├── AssetsTab.js    # Assets & Liabilities Breakdown
│   │   │       ├── FutureTab.js    # Projections & Goal Trackers
│   │   │       ├── GoalTab.js      # Financial Independence Target Calculator
│   │   │       └── PerformanceModal.js
│   ├── lib/
│   │   └── supabaseService.js      # Service Role Supabase Client
│   ├── pages/
│   │   ├── _app.js                 # App Entry & Global Styles
│   │   ├── dashboard.js            # Main Dashboard Page Route
│   │   └── api/                    # Serverless API Endpoints
│   │       ├── bootstrap.js        # Unified Dashboard Data Loader
│   │       ├── cron/snapshot.js    # Daily Net Worth Snapshot Cron
│   │       ├── market/             # Market Search, Prices & Rates APIs
│   │       ├── brokerage/          # IBKR Sync & Bank Statement Parsing
│   │       └── system/             # Debug & System Utilities
│   └── utils/
│       └── supabaseClient.js       # Client-side Supabase Browser Client
├── package.json
├── tailwind.config.js
└── next.config.js
```

---

## Prerequisites

Before setting up the project locally, ensure you have the following installed:

- **Node.js**: `v18.x` or `v20.x` or higher (Download from [nodejs.org](https://nodejs.org/))
- **Package Manager**: `npm` (comes with Node.js) or `yarn` / `pnpm`
- **Git**: Installed and configured on your machine
- **Supabase Account**: A free project at [supabase.com](https://supabase.com/)

---

## Step-by-Step Setup & Installation

### 1. Clone Repository & Install Dependencies

Open your terminal and run:

```bash
# Clone the repository
git clone https://github.com/ey-ron/portfolio.git

# Navigate into the project folder
cd portfolio

# Install dependencies
npm install
```

---

### 2. Supabase Database Setup

Create a new project on [Supabase](https://supabase.com/) and create the required SQL tables and RPC functions in the **SQL Editor**:

#### Key Tables Needed:
- `profiles`: User settings, base currency preference, target net worth.
- `investments`: Ticker symbol, asset type, units, avg purchase price, portfolio tag.
- `spends`: Transaction logs (date, amount, category, subcategory, currency).
- `spends_budgets`: Category limit allocations per month.
- `net_worth_history`: Historical snapshots of net worth for growth charts.
- `passkeys`: Biometric credential mappings for WebAuthn auth.

---

### 3. Configure Environment Variables

Create a `.env.local` file in the root of the project:

```bash
cp .env.example .env.local  # Or create .env.local manually
```

Add your credentials into `.env.local`:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-supabase-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# Interactive Brokers (IBKR) Integration (Optional)
IBKR_FLEX_TOKEN=your-ibkr-flex-token
IBKR_FLEX_QUERY_ID=your-ibkr-query-id

# System Security & Cron Authorization
CRON_SECRET=your-custom-cron-secret-token
DASHBOARD_API_SECRET=your-dashboard-api-secret

# AI & Additional Integrations (Optional)
GROQ_API_KEY=your-groq-api-key
SERPAPI_KEY=your-serpapi-key
```

---

### 4. Run Local Development Server

Start the Next.js local development server:

```bash
npm run dev
```

Open your browser and navigate to:
```
http://localhost:3000/dashboard
```

---

## Brokerage & API Integrations

### Interactive Brokers (IBKR) Sync
To enable automated synchronization with IBKR:
1. Log into your **IBKR Account Management**.
2. Navigate to **Performance & Reports > Flex Queries**.
3. Create a new **Flex Query** containing *Open Positions* and *Option Contracts*.
4. Enable **Flex Web Service** under *User Settings* to retrieve your `IBKR_FLEX_TOKEN` and `IBKR_FLEX_QUERY_ID`.
5. Add these tokens to your `.env.local`.

### Bank Statement Parser (PDF/XLS)
In the mobile **Spends Tab**, click the **Upload / Import** button to parse statements:
- **UOB**: Supports e-Statement PDF files and Excel (.xls) exports.
- **DBS**: Supports monthly e-Statement PDF files.
- **BPI**: Supports statement PDF files.

---

## Automated Cron Snapshots

The application includes an automated snapshot handler at `/api/cron/snapshot`. When invoked, it:
1. Fetches current market prices for held stocks & crypto assets.
2. Calculates the current net worth and saves a snapshot into `net_worth_history`.

You can trigger this endpoint automatically using **Vercel Cron** or a scheduled `curl` command:

```bash
curl -X GET "https://your-domain.vercel.app/api/cron/snapshot" \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
```

---

## Deployment Guide (Vercel)

This application is optimized for zero-configuration deployment on **Vercel**:

1. Push your code to GitHub.
2. Import your repository into [Vercel](https://vercel.com/).
3. Add all key-value pairs from `.env.local` into **Project Settings > Environment Variables**.
4. Click **Deploy**.

Vercel will build the production application using `npm run build` and launch Next.js serverless functions for API endpoints.

---

## License

This project is licensed under the **MIT License**. See the [LICENSE.md](LICENSE.md) file for details.
