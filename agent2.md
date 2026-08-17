# 8th Semester Academic Project: NEPSE AI Stock Prediction & Decision Support System

## 1. Executive Project Summary
* **Project Title:** NEPSE AI Stock Prediction & Decision Support System
* **Academic Goal:** Design and implement a end-to-end data processing and machine learning platform to demonstrate full-stack software engineering, modern microservice architecture, and complex time-series model implementation.
* **Core Framing:** A **Decision Support Tool** generating trend direction (Bullish/Bearish/Neutral) and confidence metrics rather than guaranteed price targets.
* **Target Domain:** Nepal Stock Exchange (NEPSE), focusing on high-liquidity sectors (e.g., Hydropower, Banking).

---

## 2. Technical Stack & Architecture

### Backend Core
* **Framework:** NestJS (TypeScript)
* **Database & ORM:** PostgreSQL + Prisma ORM
* **Task Scheduling:** `@nestjs/schedule` (Cron jobs for daily EOD data collection)
* **API Layer:** RESTful APIs using NestJS Services/Controllers with DTO validation

### Machine Learning Microservice
* **Framework:** Python FastAPI
* **Primary Algorithm:** **Hybrid LSTM-XGBoost Architecture**
  * *Stage 1 (LSTM):* Processes sequential OHLCV price history (30-day sliding windows) to extract temporal trend embeddings/hidden states.
  * *Stage 2 (XGBoost):* Combines extracted LSTM embeddings with engineered technical indicators (RSI, MACD, Moving Averages, Volume Delta) to generate final trend predictions and confidence scores.

### Frontend Client
* **Framework:** React.js / Next.js
* **Styling:** Tailwind CSS (Mobile-first, dark-mode terminal design)
* **Data Visualization:** Recharts / TradingView Lightweight Charts
* **Icons:** Lucide-react

### Data Pipeline & Scraping Strategy
* **Data Access Layer:** Uses `@rumess/nepse-api` wrapper inside a dedicated NestJS service (`verifyTLS: false`).
* **Ingestion Model:** Automated post-market background jobs saving raw data into local PostgreSQL, shielding external endpoints and optimizing user queries.

---

## 3. Implementation Roadmap

### Step 1: Database & Data Schema Setup
* Define schemas for `companies` (symbol, sector, name) and `daily_prices` (date, open, high, low, close, volume).
* Establish relationships between companies and historical price records.

### Step 2: Data Pipeline & Automation (NestJS)
* Set up `MarketDataService` using `@rumess/nepse-api` to pull historical datasets.
* Implement cron jobs to execute automated updates daily post-market close.

### Step 3: Feature Engineering & Preprocessing
* Compute technical indicators (RSI, MACD, EMA) from raw OHLCV data.
* Construct 30-day sliding window sequences for temporal processing.

### Step 4: ML Service Development (FastAPI)
* Train the LSTM model to extract temporal embeddings.
* Train the XGBoost regressor/classifier on the combined feature space.
* Expose a `/predict` REST endpoint for inference.

### Step 5: API Integration & Frontend Dashboard
* Connect NestJS API endpoints to the FastAPI inference engine.
* Build an interactive, responsive dashboard featuring stock exploration, candlestick charts, technical indicator overlays, and confidence/trend cards.

---

## 4. Master Prompt for Google Antigravity

Use the following directive directly in Google Antigravity to generate the complete codebase:

```markdown
# MISSION DIRECTIVE: Full-Stack NEPSE Stock Prediction Platform

Act as a Principal Lead Software Engineer and UI/UX Designer. Build a complete, production-grade NEPSE (Nepal Stock Exchange) Stock Prediction & Decision Support System from scratch. 

## System Architecture Overview
1. Backend Core: NestJS + TypeScript + PostgreSQL + Prisma ORM.
2. Machine Learning Microservice: Python FastAPI (LSTM + XGBoost Hybrid Model).
3. Frontend Client: React.js (or Next.js) + Tailwind CSS + Lucide Icons + Recharts / Lightweight Charts.
4. Data Pipeline: Automated background job via `@rumess/nepse-api` wrapper to collect daily OHLCV data.

---

## Technical Specifications & Requirements

### 1. Code Quality & Standards
* Flawless Execution: Zero runtime errors, strict TypeScript types (`no-implicit-any`), structured module architecture in NestJS.
* Comments & Documentation: Clean inline documentation and clean setup instructions in a generated `README.md`.
* Accessibility (a11y): High contrast UI ratios, full keyboard navigation, proper ARIA attributes (`aria-label`, `aria-expanded`, `role`), and semantic HTML5 elements (`<main>`, `<nav>`, `<header>`, `<article>`).

### 2. UI/UX & Responsiveness
* Modern Design System: Dark-mode-first, crisp financial dashboard layout inspired by TradingView and Bloomberg Terminal.
* Absolute Fluidity: Mobile-first responsive grid system (Tailwind). Mobile drawers for filters, fully adaptable cards, zero horizontal body scrolling on mobile screens.
* Interactive Visualizations: Dynamic financial charts showing historical stock trends, calculated technical indicators (RSI, MACD, Moving Averages), and ML-generated sentiment/trend confidence scores.

### 3. Performance & SEO
* Optimized Assets: Zero unnecessary dependencies. Use native browser APIs and lightweight vector graphics.
* SEO Ready: Include optimized document title tags, meta descriptions, Open Graph tags, canonical link hints, and structured semantic HTML heading hierarchies (`<h1>` through `<h3>`).

---

## Step-by-Step Task Execution Order

### Phase 1: Database & Backend Infrastructure (NestJS)
* Set up a PostgreSQL schema for `companies` (symbol, sector, name) and `daily_prices` (date, open, high, low, close, volume).
* Create a `MarketDataService` in NestJS using `@rumess/nepse-api` with `verifyTLS: false` to ingest historical data.
* Implement a NestJS Schedule (`@nestjs/schedule`) Cron task running daily after market close to update prices automatically.
* Expose clean REST endpoints (`/api/v1/stocks`, `/api/v1/stocks/:symbol/history`, `/api/v1/stocks/:symbol/prediction`).

### Phase 2: ML Microservice (FastAPI + Hybrid Model)
* Build a Python service that receives historical OHLCV sequences and technical indicators.
* Implement a 2-stage inference pipeline:
  1. LSTM model to extract temporal trend embeddings from historical price windows.
  2. XGBoost regressor/classifier combining LSTM embeddings + technical indicators (RSI, MACD, Volume Delta) to generate trend direction and a confidence score percentage.
* Expose an endpoint `/predict` for NestJS to query.

### Phase 3: High-Performance Frontend (React.js)
* Build a dashboard featuring:
  * **Header:** Market Overview ticker (NEPSE Index, Top Gainers/Losers, Market Turnover).
  * **Stock Explorer:** Search bar with live search filtering across NEPSE symbols.
  * **Main Visualizer:** Interactive candlestick/line chart with toggles for RSI, MACD, and EMA overlays.
  * **AI Prediction Card:** Displays trend direction (Bullish/Bearish/Neutral), Signal Strength Confidence %, and Feature Importance breakdown.
  * **Sector Analysis View:** Breakdown of Hydropower, Banking, and Finance sectors.

---

## Final Verification Checklist
Before declaring completion, verify:
1. Mobile, tablet, and desktop viewports are pixel-perfect.
2. Lighthouse performance and accessibility audits pass without critical warnings.
3. API endpoints handle failures gracefully with proper HTTP status codes and user-facing toast alerts.