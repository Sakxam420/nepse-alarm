1. Feasibility Assessment & Project FramingAcademic Suitability: Highly feasible and ideal for an 8th-semester BCA project. It provides a strong scope for demonstrating data pipelines, technical indicator engineering, clean system architecture, and machine learning models.NEPSE Market Reality: The Nepal Stock Exchange often lacks deep liquidity and volume compared to global markets, making exact price target predictions noisy and unreliable.Core Framing Strategy: Frame the system as a Decision Support & Risk Management Tool (outputting Buy/Sell/Hold signals or confidence percentages) rather than a guaranteed price prediction bot.2. Algorithm Analysis & Selection StrategyWe evaluated a progression of algorithms based on model capability vs. academic complexity:A. Baseline: Linear RegressionPurpose: Establishes a minimum performance floor. If a complex neural network cannot beat Linear Regression on MSE/RMSE, the feature engineering or data pipeline is flawed.B. The Time-Series Model: LSTM (Long Short-Term Memory)Purpose: A Recurrent Neural Network (RNN) designed to handle temporal dependencies and sequence memory over time without suffering from exploding/vanishing gradients.Role: Processes raw 30-day sequential price windows (Open, High, Low, Close, Volume) to extract latent trend signals.C. The Tabular Feature Model: XGBoostPurpose: A gradient-boosted decision tree algorithm that excels at handling structured tabular data and non-linear interactions.Role: Processes calculated technical indicators (RSI, MACD, Moving Averages, Volume Delta) alongside market metrics.D. Selected Approach: Hybrid LSTM-XGBoost ArchitectureStage 1 (Feature Extractor): An LSTM model processes sequential price history to generate a reduced-dimensional temporal embedding (hidden state vector).Stage 2 (Inference Engine): The LSTM embedding vector is concatenated with the engineered technical indicators and fed into an XGBoost regressor/classifier.Why this wins academically: Demonstrates high architectural complexity, combines deep learning with tree-based models, and allows feature-importance analysis via XGBoost.3. Full-Stack System ArchitectureWe designed a decoupled microservices setup separating application logic from ML operations:[ Frontend: React.js + Tailwind ]
               │
               ▼ (HTTP REST)
 [ Backend: NestJS Core + PostgreSQL ] ◄── (Cron Job) ── [ @rumess/nepse-api ]
               │
               ▼ (HTTP REST)
[ ML Microservice: Python FastAPI (LSTM + XGBoost) ]
Key Architectural Decisions:NestJS Application Core: Manages user authentication, stock discovery, data persistence, and cron job scheduling.PostgreSQL Database: Stores company metadata and historical daily price bars locally. The system reads predictions from local storage rather than fetching external data live during user requests.Python FastAPI ML Service: Dedicated solely to running model training and executing live inference requests sent from NestJS.Data Ingestion via Managed Wrappers: Rather than writing a fragile web scraper from scratch, the NestJS MarketDataService integrates the @rumess/nepse-api wrapper (with verifyTLS: false) to automatically backfill and update stock data post-market close via @nestjs/schedule cron tasks.4. Industry Article Insights (NEPSE Analysis Integration)Based on the strategic review of current AI applications in the Nepali market:Top-Down Screening: Real-world systems analyze NEPSE from Index Level $\rightarrow$ Sector Level (e.g., Hydropower, Banking) $\rightarrow$ Individual Stock.Macro Factor Influence: NEPSE movements correlate heavily with NRB liquidity policies, interbank rates, and remittance inflows.Project Scope Boundary: Focus feature engineering and model training on top-traded, high-liquidity sectors (e.g., Banking or Hydropower) rather than trying to process all 280+ illiquid listed companies simultaneously.5. Implementation Roadmap (Step-by-Step)Step 1 — Schema Design: Define companies and daily_prices tables in PostgreSQL using Prisma ORM.Step 2 — Data Pipeline: Implement @rumess/nepse-api inside NestJS and schedule daily cron jobs to fetch post-market OHLCV data.Step 3 — Feature Engineering: Compute technical indicators (RSI, MACD, EMA) and build 30-day sliding window sequences.Step 4 — FastAPI ML Engine: Build the two-stage LSTM feature extractor + XGBoost predictor pipeline in Python.Step 5 — Integration & API: Connect NestJS to FastAPI via internal HTTP calls and expose /api/v1/stocks/:symbol/prediction.Step 6 — Frontend UI: Build a responsive, dark-mode financial dashboard in React featuring candlestick charts, indicator overlays, and signal confidence gauges.
# AGENTS.md — SYSTEM CONTEXT & GUIDELINES

## 1. Project Overview & Scope
* **Project Name:** NEPSE AI Stock Prediction & Decision Support System
* **Academic Context:** 8th Semester BCA Final Project
* **Core Philosophy:** Build a Decision Support System (providing Bullish/Bearish/Neutral signals, confidence scores, and technical indicator metrics) rather than a speculative price-target bot.
* **Target Domain:** Nepal Stock Exchange (NEPSE), focusing on high-liquidity, top-traded sectors (e.g., Hydropower, Banking).

---

## 2. Technical Stack & System Architecture
[ Frontend: React.js / Next.js + Tailwind CSS ]
│
▼ (HTTP REST)
[ Backend: NestJS Core + PostgreSQL (Prisma ORM) ] ◄── (Cron) ── [ @rumess/nepse-api ]
│
▼ (HTTP REST)
[ ML Microservice: Python FastAPI (LSTM + XGBoost Hybrid) ]
### Core Components
* **Backend Core:** NestJS + TypeScript + PostgreSQL + Prisma ORM
* **ML Microservice:** Python FastAPI running a 2-stage hybrid model:
  1. *Stage 1 (LSTM):* Processes 30-day sequential price windows to extract temporal embeddings.
  2. *Stage 2 (XGBoost):* Combines LSTM embeddings with engineered technical indicators (RSI, MACD, Moving Averages, Volume Delta) to output final confidence scores and signal directions.
* **Data Ingestion Pipeline:** NestJS `MarketDataService` calling `@rumess/nepse-api` wrapper (`verifyTLS: false`) scheduled via `@nestjs/schedule` post-market close.
* **Frontend Dashboard:** Dark-mode-first, responsive terminal layout (Tailwind CSS, Lucide Icons, Recharts / TradingView Lightweight Charts).

---

## 3. Engineering & Architectural Rules

### Code Quality & Standards
* **Type Safety:** Strict TypeScript types (`no-implicit-any`) across NestJS and React.
* **Separation of Concerns:** Keep ML inference cleanly isolated inside FastAPI; keep data management, cron scheduling, and API serving inside NestJS.
* **Accessibility:** High-contrast dark mode palette, semantic HTML5 elements (`<main>`, `<nav>`, `<article>`), explicit keyboard navigation, and proper `aria-label` attributes.

### Data Ingestion Strategy
* Do NOT hit external APIs on live user requests. All price data must be cached and served locally from PostgreSQL.
* The API wrapper handles post-market end-of-day (EOD) updates via background workers.

---

## 4. Implementation Checklist

- [ ] **Phase 1 (Database):** Define Prisma schemas for `companies` (symbol, sector, name) and `daily_prices` (date, open, high, low, close, volume).
- [ ] **Phase 2 (NestJS Backend):** Implement `MarketDataService` with `@rumess/nepse-api`, cron jobs, and REST endpoints for stock discovery and price history.
- [ ] **Phase 3 (FastAPI ML Service):** Implement sequence preprocessing, LSTM feature extraction, XGBoost prediction, and the `/predict` endpoint.
- [ ] **Phase 4 (Frontend UI):** Build responsive stock explorer, candlestick chart visualizer, technical indicator overlays, and AI prediction confidence cards.