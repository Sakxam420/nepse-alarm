import os
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import matplotlib.patches as patches
import numpy as np

os.makedirs("assets/diagrams", exist_ok=True)

plt.rcParams['font.sans-serif'] = 'DejaVu Sans'
plt.rcParams['font.family'] = 'sans-serif'

# 1. Figure 1.1: Incremental Development Life Cycle Model
def draw_incremental_model():
    fig, ax = plt.subplots(figsize=(8, 4.5), dpi=300)
    ax.axis('off')
    
    stages = [
        "Definition of\nrequirements",
        "System and\nsoftware design",
        "Implementation\nand unit testing",
        "System test",
        "Operation and\nmaintenance"
    ]
    
    x_positions = [0.12, 0.31, 0.50, 0.69, 0.88]
    y_positions = [0.80, 0.62, 0.44, 0.26, 0.08]
    box_w = 0.17
    box_h = 0.14
    
    for i, (stage, x, y) in enumerate(zip(stages, x_positions, y_positions)):
        # Draw box
        rect = patches.FancyBboxPatch(
            (x - box_w/2, y - box_h/2), box_w, box_h,
            boxstyle="square,pad=0.02",
            edgecolor='#1E293B', facecolor='#F8FAFC', linewidth=1.5
        )
        ax.add_patch(rect)
        ax.text(x, y, stage, ha='center', va='center', fontsize=9, fontweight='bold', color='#0F172A')
        
        # Draw stepping arrow to next
        if i < len(stages) - 1:
            next_x = x_positions[i+1]
            next_y = y_positions[i+1]
            # Down-right stepped arrow
            ax.annotate(
                '', xy=(next_x - box_w/2, next_y),
                xytext=(x, y - box_h/2),
                arrowprops=dict(arrowstyle="->", color="#334155", lw=1.5,
                                connectionstyle="angle,angleA=-90,angleB=180,rad=0")
            )
            # Feedback dotted arrow back
            ax.annotate(
                '', xy=(x, y + box_h/2),
                xytext=(next_x - box_w/2, next_y + box_h/2),
                arrowprops=dict(arrowstyle="->", color="#64748B", lw=1.2, ls="--",
                                connectionstyle="angle,angleA=90,angleB=180,rad=0")
            )
            
    # Title / Label
    # Title removed for clean document embedding
    plt.tight_layout()
    plt.savefig("assets/diagrams/fig1_1_incremental_lifecycle.png", dpi=300, bbox_inches='tight')
    plt.close()
    print("Generated fig1_1_incremental_lifecycle.png")

# 2. Figure 2.1: NEPSE Hybrid Sequential-Tabular Machine Learning Architecture
def draw_hybrid_architecture():
    fig, ax = plt.subplots(figsize=(10, 5), dpi=300)
    ax.axis('off')
    
    # Left: Sequential Branch (60-day OHLCV)
    rect_seq = patches.FancyBboxPatch((0.04, 0.60), 0.22, 0.28, boxstyle="round,pad=0.03", edgecolor="#2563EB", facecolor="#EFF6FF", lw=1.5)
    ax.add_patch(rect_seq)
    ax.text(0.15, 0.81, "Sequential OHLCV Input", ha='center', va='center', fontsize=10, fontweight='bold', color="#1E40AF")
    ax.text(0.15, 0.69, "• 60-day Rolling Window\n• Open, High, Low, Close\n• Trading Volume & Trades\n• Normalized (MinMax)", ha='center', va='center', fontsize=8, color="#1E293B")
    
    # Left: Tabular Technical Indicators Branch
    rect_tab = patches.FancyBboxPatch((0.04, 0.12), 0.22, 0.32, boxstyle="round,pad=0.03", edgecolor="#059669", facecolor="#ECFDF5", lw=1.5)
    ax.add_patch(rect_tab)
    ax.text(0.15, 0.37, "Technical Indicators Input", ha='center', va='center', fontsize=10, fontweight='bold', color="#065F46")
    ax.text(0.15, 0.23, "• RSI (14-day Momentum)\n• MACD & Signal Histogram\n• Bollinger Upper/Lower\n• EMA (9, 21, 50, 200)\n• Floor Pivot Points", ha='center', va='center', fontsize=8, color="#1E293B")
    
    # Middle: Deep LSTM Layer
    rect_lstm = patches.FancyBboxPatch((0.34, 0.60), 0.24, 0.28, boxstyle="round,pad=0.03", edgecolor="#4F46E5", facecolor="#EEF2FF", lw=1.5)
    ax.add_patch(rect_lstm)
    ax.text(0.46, 0.81, "Stacked LSTM Network", ha='center', va='center', fontsize=10, fontweight='bold', color="#3730A3")
    ax.text(0.46, 0.69, "• 2x LSTM Layers (128 units)\n• Dropout Regularization (0.2)\n• Temporal Memory Cell State\n• Latent Sequence Embedding", ha='center', va='center', fontsize=8, color="#1E293B")
    
    # Middle: Feature Engineering / Tabular Normalization
    rect_tab_proc = patches.FancyBboxPatch((0.34, 0.12), 0.24, 0.32, boxstyle="round,pad=0.03", edgecolor="#0D9488", facecolor="#F0FDFA", lw=1.5)
    ax.add_patch(rect_tab_proc)
    ax.text(0.46, 0.37, "Tabular Feature Processor", ha='center', va='center', fontsize=10, fontweight='bold', color="#115E59")
    ax.text(0.46, 0.23, "• Robust Standard Scaler\n• Multicollinearity Filter\n• Sector Relative Strength\n• Market Trend Regime Vector", ha='center', va='center', fontsize=8, color="#1E293B")
    
    # Center-Right: Feature Concatenation & XGBoost Ensemble
    rect_ens = patches.FancyBboxPatch((0.65, 0.32), 0.18, 0.40, boxstyle="round,pad=0.03", edgecolor="#D97706", facecolor="#FFFBEB", lw=1.5)
    ax.add_patch(rect_ens)
    ax.text(0.74, 0.64, "Hybrid Ensemble", ha='center', va='center', fontsize=10, fontweight='bold', color="#92400E")
    ax.text(0.74, 0.48, "• Concatenated Latent\n  Representation\n• XGBoost Regressor\n  & Classifier\n• Meta-Learner Stacking\n  Weight: (0.55 LSTM, 0.45 XGB)", ha='center', va='center', fontsize=8, color="#1E293B")
    
    # Far Right: Outputs
    rect_out = patches.FancyBboxPatch((0.88, 0.25), 0.10, 0.54, boxstyle="round,pad=0.03", edgecolor="#DC2626", facecolor="#FEF2F2", lw=1.5)
    ax.add_patch(rect_out)
    ax.text(0.93, 0.70, "Outputs", ha='center', va='center', fontsize=10, fontweight='bold', color="#991B1B")
    ax.text(0.93, 0.52, "• Next-Day\n  Target Price\n• Confidence\n  Intervals\n• Bull/Bear\n  Probability\n• Risk-Adjusted\n  Action", ha='center', va='center', fontsize=8, color="#1E293B")
    
    # Arrows
    ax.annotate('', xy=(0.34, 0.74), xytext=(0.26, 0.74), arrowprops=dict(arrowstyle="->", lw=1.5, color="#1E293B"))
    ax.annotate('', xy=(0.34, 0.28), xytext=(0.26, 0.28), arrowprops=dict(arrowstyle="->", lw=1.5, color="#1E293B"))
    ax.annotate('', xy=(0.65, 0.62), xytext=(0.58, 0.74), arrowprops=dict(arrowstyle="->", lw=1.5, color="#1E293B"))
    ax.annotate('', xy=(0.65, 0.42), xytext=(0.58, 0.28), arrowprops=dict(arrowstyle="->", lw=1.5, color="#1E293B"))
    ax.annotate('', xy=(0.88, 0.52), xytext=(0.83, 0.52), arrowprops=dict(arrowstyle="->", lw=1.5, color="#1E293B"))
    
    # Title removed for clean document embedding
    plt.tight_layout()
    plt.savefig("assets/diagrams/fig2_1_hybrid_architecture.png", dpi=300, bbox_inches='tight')
    plt.close()
    print("Generated fig2_1_hybrid_architecture.png")

# 3. Figure 2.2: RSI (Relative Strength Index) Indicator Plot
def draw_rsi_plot():
    fig, ax = plt.subplots(figsize=(9, 4), dpi=300)
    days = np.arange(1, 41)
    # Simulate realistic oscillating RSI
    np.random.seed(42)
    rsi_vals = 50 + 22 * np.sin(days / 3.5) + np.random.normal(0, 3, size=len(days))
    rsi_vals = np.clip(rsi_vals, 15, 88)
    
    ax.plot(days, rsi_vals, color='#4F46E5', lw=2.2, label='14-Period RSI Curve')
    ax.axhline(70, color='#DC2626', linestyle='--', lw=1.5, label='Overbought Threshold (70)')
    ax.axhline(30, color='#16A34A', linestyle='--', lw=1.5, label='Oversold Threshold (30)')
    ax.axhline(50, color='#94A3B8', linestyle=':', lw=1.0)
    
    ax.fill_between(days, 70, 90, color='#FEE2E2', alpha=0.5, label='Overbought Zone (Exhaustion / Sell Caution)')
    ax.fill_between(days, 10, 30, color='#DCFCE7', alpha=0.5, label='Oversold Zone (Mean Reversion / Buy Watch)')
    
    # Annotate signals
    ax.scatter([12], [rsi_vals[11]], color='#DC2626', s=70, zorder=5)
    ax.annotate('Overbought Peak (Sell Signal)', xy=(12, rsi_vals[11]), xytext=(14, 82),
                arrowprops=dict(facecolor='#DC2626', arrowstyle='->', lw=1.2), fontsize=8.5, fontweight='bold', color='#991B1B')
    
    ax.scatter([27], [rsi_vals[26]], color='#16A34A', s=70, zorder=5)
    ax.annotate('Oversold Dip (Rebound Opportunity)', xy=(27, rsi_vals[26]), xytext=(28, 22),
                arrowprops=dict(facecolor='#16A34A', arrowstyle='->', lw=1.2), fontsize=8.5, fontweight='bold', color='#166534')
    
    ax.set_ylim(10, 90)
    ax.set_xlim(1, 40)
    ax.set_xlabel('Trading Days', fontsize=9, fontweight='bold', color='#1E293B')
    ax.set_ylabel('RSI Level (0 - 100)', fontsize=9, fontweight='bold', color='#1E293B')
    # Title removed for clean document embedding
    ax.grid(True, linestyle=':', alpha=0.5)
    ax.legend(loc='lower left', fontsize=8, framealpha=0.9)
    
    plt.tight_layout()
    plt.savefig("assets/diagrams/fig2_2_rsi_oscillator.png", dpi=300, bbox_inches='tight')
    plt.close()
    print("Generated fig2_2_rsi_oscillator.png")

# 4. Figure 2.3: MACD (Moving Average Convergence Divergence) Plot
def draw_macd_plot():
    fig, ax = plt.subplots(figsize=(9, 4), dpi=300)
    days = np.arange(1, 41)
    macd_line = 3.5 * np.sin(days / 4.0) + 0.5
    signal_line = 3.2 * np.sin((days - 2) / 4.0) + 0.3
    histogram = macd_line - signal_line
    
    ax.plot(days, macd_line, color='#2563EB', lw=2.0, label='MACD Line (12 EMA - 26 EMA)')
    ax.plot(days, signal_line, color='#EA580C', lw=1.8, linestyle='--', label='Signal Line (9-Period EMA)')
    
    # Histogram bars
    colors = ['#16A34A' if h >= 0 else '#DC2626' for h in histogram]
    ax.bar(days, histogram, color=colors, alpha=0.6, width=0.6, label='MACD Histogram (Momentum Divergence)')
    ax.axhline(0, color='#64748B', lw=1)
    
    # Bullish crossover
    cross_idx = 18
    ax.scatter([days[cross_idx]], [macd_line[cross_idx]], color='#16A34A', s=80, zorder=5)
    ax.annotate('Bullish Golden Crossover', xy=(days[cross_idx], macd_line[cross_idx]), xytext=(days[cross_idx]-6, 2.8),
                arrowprops=dict(facecolor='#16A34A', arrowstyle='->', lw=1.2), fontsize=8.5, fontweight='bold', color='#166534')
    
    ax.set_xlim(1, 40)
    ax.set_xlabel('Trading Sessions', fontsize=9, fontweight='bold', color='#1E293B')
    ax.set_ylabel('MACD Metric Amplitude', fontsize=9, fontweight='bold', color='#1E293B')
    # Title removed for clean document embedding
    ax.grid(True, linestyle=':', alpha=0.5)
    ax.legend(loc='lower right', fontsize=8, framealpha=0.9)
    
    plt.tight_layout()
    plt.savefig("assets/diagrams/fig2_3_macd_signals.png", dpi=300, bbox_inches='tight')
    plt.close()
    print("Generated fig2_3_macd_signals.png")

# 5. Figure 3.1: Use Case Diagram
def draw_use_case_diagram():
    fig, ax = plt.subplots(figsize=(9, 10), dpi=300)
    ax.axis('off')
    
    # System boundary box
    sys_box = patches.FancyBboxPatch((0.26, 0.05), 0.48, 0.88, boxstyle="round,pad=0.02",
                                    edgecolor="#1E293B", facecolor="#F8FAFC", lw=2)
    ax.add_patch(sys_box)
    ax.text(0.50, 0.90, "NEPSE Stock Prediction & Decision Support System", ha='center', va='center',
            fontsize=11, fontweight='bold', color='#0F172A')
    
    use_cases = [
        ("Register & Authenticate Account", 0.83),
        ("View Live Market Ticker & Depth", 0.76),
        ("Analyze Technical Indicators (RSI, MACD, BB)", 0.69),
        ("Generate ML Price Forecasts (LSTM / XGBoost)", 0.62),
        ("Create Custom Price & Volume Alerts", 0.55),
        ("Receive Real-Time WebSocket Alerts", 0.48),
        ("Manage Portfolio Holdings & PnL", 0.41),
        ("Run Multi-Stock Screener & Heatmap", 0.34),
        ("Compare Stock Performance", 0.27),
        ("Export Financial & Performance Analytics", 0.20),
        ("Manage System Configurations & Scrapers", 0.13),
    ]
    
    uc_centers = []
    for text, y in use_cases:
        ellipse = patches.Ellipse((0.50, y), 0.42, 0.05, edgecolor="#2563EB", facecolor="#FFFFFF", lw=1.4)
        ax.add_patch(ellipse)
        ax.text(0.50, y, text, ha='center', va='center', fontsize=8.2, fontweight='bold', color='#1E293B')
        uc_centers.append((0.50, y))
        
    # Actors
    def draw_actor(x, y, label):
        # Head
        ax.add_patch(plt.Circle((x, y + 0.03), 0.018, color="#0F172A", fill=False, lw=1.5))
        # Body
        ax.plot([x, x], [y + 0.012, y - 0.025], color="#0F172A", lw=1.5)
        # Arms
        ax.plot([x - 0.025, x + 0.025], [y - 0.005, y - 0.005], color="#0F172A", lw=1.5)
        # Legs
        ax.plot([x, x - 0.02], [y - 0.025, y - 0.055], color="#0F172A", lw=1.5)
        ax.plot([x, x + 0.02], [y - 0.025, y - 0.055], color="#0F172A", lw=1.5)
        # Label
        ax.text(x, y - 0.075, label, ha='center', va='center', fontsize=9, fontweight='bold', color="#0F172A")
        
    draw_actor(0.12, 0.65, "Retail Investor /\nTrader")
    draw_actor(0.12, 0.35, "Portfolio\nManager")
    draw_actor(0.88, 0.22, "System\nAdministrator")
    draw_actor(0.88, 0.70, "NEPSE Scraper /\nData Feeder\n«system»")
    
    # Connections from Trader (0.12, 0.65) to use cases
    trader_targets = [0, 1, 2, 3, 4, 5, 7, 8]
    for idx in trader_targets:
        ax.plot([0.15, 0.29], [0.65, use_cases[idx][1]], color="#64748B", lw=1.2)
        
    # Connections from Portfolio Manager (0.12, 0.35)
    pm_targets = [1, 2, 3, 6, 7, 8, 9]
    for idx in pm_targets:
        ax.plot([0.15, 0.29], [0.35, use_cases[idx][1]], color="#64748B", lw=1.2)
        
    # Connections from Admin (0.88, 0.22)
    admin_targets = [0, 9, 10]
    for idx in admin_targets:
        ax.plot([0.85, 0.71], [0.22, use_cases[idx][1]], color="#64748B", lw=1.2)
        
    # Connections from NEPSE Scraper actor (0.88, 0.70)
    scraper_targets = [1, 5]
    for idx in scraper_targets:
        ax.plot([0.85, 0.71], [0.70, use_cases[idx][1]], color="#64748B", lw=1.2)
        
    plt.tight_layout()
    plt.savefig("assets/diagrams/fig3_1_use_case.png", dpi=300, bbox_inches='tight')
    plt.close()
    print("Generated fig3_1_use_case.png")

# 6. Figure 3.2: DFD Level 0 (Context Diagram)
def draw_dfd_level0():
    fig, ax = plt.subplots(figsize=(9, 5), dpi=300)
    ax.axis('off')
    
    # Center: 0.0 System
    circle = patches.Circle((0.50, 0.50), 0.16, edgecolor="#1E293B", facecolor="#EFF6FF", lw=2.2)
    ax.add_patch(circle)
    ax.text(0.50, 0.54, "0.0", ha='center', va='center', fontsize=12, fontweight='bold', color="#1E40AF")
    ax.text(0.50, 0.46, "NEPSE Stock\nPrediction & Decision\nSupport System", ha='center', va='center',
            fontsize=9.5, fontweight='bold', color="#0F172A")
    
    # External Entity: Investor / User (Left)
    rect_user = patches.Rectangle((0.05, 0.38), 0.18, 0.24, edgecolor="#0F172A", facecolor="#F8FAFC", lw=1.8)
    ax.add_patch(rect_user)
    ax.text(0.14, 0.50, "User / Investor\n(Web / Mobile)", ha='center', va='center', fontsize=10, fontweight='bold', color="#0F172A")
    
    # External Entity: NEPSE Market Exchange / Data Provider (Top-Right)
    rect_nepse = patches.Rectangle((0.77, 0.65), 0.18, 0.22, edgecolor="#0F172A", facecolor="#F8FAFC", lw=1.8)
    ax.add_patch(rect_nepse)
    ax.text(0.86, 0.76, "NEPSE Trading Floor\n& Data Source", ha='center', va='center', fontsize=9.5, fontweight='bold', color="#0F172A")
    
    # External Entity: Notification Delivery Services (Bottom-Right)
    rect_notif = patches.Rectangle((0.77, 0.15), 0.18, 0.22, edgecolor="#0F172A", facecolor="#F8FAFC", lw=1.8)
    ax.add_patch(rect_notif)
    ax.text(0.86, 0.26, "Email & WebPush\nGateways", ha='center', va='center', fontsize=9.5, fontweight='bold', color="#0F172A")
    
    # Arrows and Labels
    # User -> System (Queries, Alert Rules, Portfolio Trades)
    ax.annotate('', xy=(0.34, 0.55), xytext=(0.23, 0.55), arrowprops=dict(arrowstyle="->", lw=1.5, color="#1E293B"))
    ax.text(0.285, 0.58, "Login, Rules,\nQueries, Portfolio", ha='center', va='bottom', fontsize=8, color="#1E293B")
    
    # System -> User (Predictions, Charts, Push Alerts)
    ax.annotate('', xy=(0.23, 0.45), xytext=(0.34, 0.45), arrowprops=dict(arrowstyle="->", lw=1.5, color="#1E293B"))
    ax.text(0.285, 0.42, "Price Forecasts,\nLive Tickers, Alerts", ha='center', va='top', fontsize=8, color="#1E293B")
    
    # NEPSE -> System (Raw Quotes, Floor Ticker, Historical Data)
    ax.annotate('', xy=(0.64, 0.58), xytext=(0.77, 0.72), arrowprops=dict(arrowstyle="->", lw=1.5, color="#1E293B"))
    ax.text(0.72, 0.67, "Live Scraped Tickers,\nOHLCV Trade History", ha='center', va='bottom', fontsize=8, color="#1E293B")
    
    # System -> Notification Services (Alert Dispatches)
    ax.annotate('', xy=(0.77, 0.28), xytext=(0.64, 0.42), arrowprops=dict(arrowstyle="->", lw=1.5, color="#1E293B"))
    ax.text(0.72, 0.33, "Triggered Alert Payload\n(Email / WebPush)", ha='center', va='top', fontsize=8, color="#1E293B")
    
    # Figure title removed for clean document embedding
    plt.tight_layout()
    plt.savefig("assets/diagrams/fig3_2_dfd_level0.png", dpi=300, bbox_inches='tight')
    plt.close()
    print("Generated fig3_2_dfd_level0.png")

# 7. Figure 3.3: DFD Level 1
def draw_dfd_level1():
    fig, ax = plt.subplots(figsize=(10, 6), dpi=300)
    ax.axis('off')
    
    # Entities
    rect_user = patches.Rectangle((0.02, 0.42), 0.13, 0.20, edgecolor="#0F172A", facecolor="#F8FAFC", lw=1.5)
    ax.add_patch(rect_user)
    ax.text(0.085, 0.52, "User /\nInvestor", ha='center', va='center', fontsize=9, fontweight='bold')
    
    rect_nepse = patches.Rectangle((0.85, 0.75), 0.13, 0.18, edgecolor="#0F172A", facecolor="#F8FAFC", lw=1.5)
    ax.add_patch(rect_nepse)
    ax.text(0.915, 0.84, "NEPSE Market\nFeed", ha='center', va='center', fontsize=8.5, fontweight='bold')
    
    # Processes (Circles)
    processes = [
        ("1.0\nData Ingestion &\nNormalization", 0.65, 0.82),
        ("2.0\nTechnical Feature\nEngineering", 0.65, 0.56),
        ("3.0\nHybrid ML\nInference", 0.65, 0.28),
        ("4.0\nRule Matching &\nAlert Engine", 0.35, 0.72),
        ("5.0\nPortfolio Accounting\n& Reporting", 0.35, 0.32),
    ]
    for label, x, y in processes:
        c = patches.Circle((x, y), 0.08, edgecolor="#2563EB", facecolor="#EFF6FF", lw=1.6)
        ax.add_patch(c)
        ax.text(x, y, label, ha='center', va='center', fontsize=7.5, fontweight='bold', color="#1E293B")
        
    # Data Stores (Parallel lines)
    def draw_datastore(x, y, label):
        ax.plot([x, x + 0.18], [y + 0.025, y + 0.025], color="#0F172A", lw=1.5)
        ax.plot([x, x + 0.18], [y - 0.025, y - 0.025], color="#0F172A", lw=1.5)
        ax.text(x + 0.09, y, label, ha='center', va='center', fontsize=7.5, fontweight='bold', color="#0F172A")
        
    draw_datastore(0.40, 0.92, "D1: Historical Quotes DB")
    draw_datastore(0.40, 0.46, "D2: Indicator Cache")
    draw_datastore(0.40, 0.12, "D3: Predictions Store")
    draw_datastore(0.08, 0.82, "D4: Alert Rules Store")
    draw_datastore(0.08, 0.18, "D5: Portfolios & Trades")
    
    # Connect NEPSE -> 1.0
    ax.annotate('', xy=(0.73, 0.82), xytext=(0.85, 0.82), arrowprops=dict(arrowstyle="->", lw=1.2, color="#1E293B"))
    # 1.0 -> D1
    ax.annotate('', xy=(0.58, 0.92), xytext=(0.65, 0.86), arrowprops=dict(arrowstyle="->", lw=1.2, color="#1E293B"))
    # D1 -> 2.0
    ax.annotate('', xy=(0.65, 0.64), xytext=(0.58, 0.90), arrowprops=dict(arrowstyle="->", lw=1.2, color="#1E293B"))
    # 2.0 -> D2
    ax.annotate('', xy=(0.58, 0.46), xytext=(0.57, 0.56), arrowprops=dict(arrowstyle="->", lw=1.2, color="#1E293B"))
    # D2 -> 3.0
    ax.annotate('', xy=(0.65, 0.36), xytext=(0.58, 0.46), arrowprops=dict(arrowstyle="->", lw=1.2, color="#1E293B"))
    # 3.0 -> D3
    ax.annotate('', xy=(0.58, 0.12), xytext=(0.65, 0.20), arrowprops=dict(arrowstyle="->", lw=1.2, color="#1E293B"))
    # User -> D4
    ax.annotate('', xy=(0.17, 0.82), xytext=(0.10, 0.62), arrowprops=dict(arrowstyle="->", lw=1.2, color="#1E293B"))
    # D4 -> 4.0
    ax.annotate('', xy=(0.27, 0.72), xytext=(0.26, 0.82), arrowprops=dict(arrowstyle="->", lw=1.2, color="#1E293B"))
    # 1.0 -> 4.0
    ax.annotate('', xy=(0.43, 0.72), xytext=(0.57, 0.82), arrowprops=dict(arrowstyle="->", lw=1.2, color="#1E293B"))
    # 4.0 -> User (Notification)
    ax.annotate('', xy=(0.15, 0.56), xytext=(0.27, 0.72), arrowprops=dict(arrowstyle="->", lw=1.2, color="#DC2626"))
    # User -> 5.0
    ax.annotate('', xy=(0.27, 0.32), xytext=(0.15, 0.46), arrowprops=dict(arrowstyle="->", lw=1.2, color="#1E293B"))
    # 5.0 -> D5
    ax.annotate('', xy=(0.26, 0.18), xytext=(0.27, 0.32), arrowprops=dict(arrowstyle="->", lw=1.2, color="#1E293B"))
    # D3 -> User
    ax.annotate('', xy=(0.15, 0.48), xytext=(0.40, 0.14), arrowprops=dict(arrowstyle="->", lw=1.2, color="#2563EB"))
    
    # Figure title removed for clean document embedding
    plt.tight_layout()
    plt.savefig("assets/diagrams/fig3_3_dfd_level1.png", dpi=300, bbox_inches='tight')
    plt.close()
    print("Generated fig3_3_dfd_level1.png")

# 8. Figure 3.4: Gantt Chart
def draw_gantt_chart():
    fig, ax = plt.subplots(figsize=(10, 4.5), dpi=300)
    
    tasks = [
        "Project Selection & Proposal",
        "Requirements & Market Analysis",
        "System Architecture & Design",
        "Backend & Scraping Ingestion",
        "ML Modeling (LSTM & XGBoost)",
        "Frontend React Dashboard",
        "Alert Engine & WebSocket Feeds",
        "System Testing & Quality Assurance",
        "Deployment & Report Documentation"
    ]
    
    start_weeks = [1, 2, 3, 4, 4.5, 5.5, 6.5, 7.5, 8]
    durations   = [1.5, 1.5, 1.5, 2.5, 3.0, 2.5, 2.0, 1.5, 1.5]
    
    y_pos = np.arange(len(tasks))
    colors = ['#1E3A8A', '#2563EB', '#0284C7', '#0D9488', '#059669', '#16A34A', '#CA8A04', '#EA580C', '#DC2626']
    
    for i, (task, start, dur, col) in enumerate(zip(tasks, start_weeks, durations, colors)):
        ax.barh(i, dur, left=start, height=0.55, align='center', color=col, alpha=0.85, edgecolor='#1E293B', lw=1.0)
        
    ax.set_yticks(y_pos)
    ax.set_yticklabels(tasks, fontsize=8.5, fontweight='bold', color='#1E293B')
    ax.invert_yaxis()
    
    ax.set_xlim(1, 9.5)
    ax.set_xticks(np.arange(1, 10))
    ax.set_xticklabels([f"Week {w}" for w in range(1, 10)], fontsize=9, fontweight='bold', color='#1E293B')
    ax.grid(axis='x', linestyle='--', alpha=0.6)
    
    # Figure title removed for clean document embedding
    plt.tight_layout()
    plt.savefig("assets/diagrams/fig3_4_gantt_chart.png", dpi=300, bbox_inches='tight')
    plt.close()
    print("Generated fig3_4_gantt_chart.png")

# 9. Figure 3.5: Entity Relationship Diagram (ERD)
def draw_erd():
    fig, ax = plt.subplots(figsize=(10, 6.5), dpi=300)
    ax.axis('off')
    
    def draw_entity(x, y, w, h, title, pk_fields, other_fields):
        # Header
        hdr = patches.Rectangle((x, y + h - 0.05), w, 0.05, edgecolor="#1E293B", facecolor="#1E293B", lw=1.2)
        ax.add_patch(hdr)
        ax.text(x + w/2, y + h - 0.025, title, ha='center', va='center', fontsize=8.5, fontweight='bold', color="#FFFFFF")
        # Body
        body = patches.Rectangle((x, y), w, h - 0.05, edgecolor="#1E293B", facecolor="#F8FAFC", lw=1.2)
        ax.add_patch(body)
        
        text_lines = []
        for pk in pk_fields:
            text_lines.append(f"PK {pk}")
        for of in other_fields:
            text_lines.append(f"   {of}")
        ax.text(x + 0.015, y + h - 0.07, "\n".join(text_lines), ha='left', va='top', fontsize=7, color="#0F172A")
        
    # Entities layout
    # Top-Left: User
    draw_entity(0.04, 0.65, 0.22, 0.28, "User", ["id: UUID"],
                ["email: VARCHAR", "password_hash: VARCHAR", "full_name: VARCHAR", "role: ENUM", "created_at: TIMESTAMP"])
    
    # Top-Middle: Portfolio
    draw_entity(0.38, 0.65, 0.24, 0.28, "Portfolio", ["id: UUID"],
                ["user_id: UUID (FK)", "name: VARCHAR", "total_invested: DECIMAL", "current_value: DECIMAL", "cash_balance: DECIMAL"])
    
    # Top-Right: Transaction
    draw_entity(0.72, 0.65, 0.24, 0.28, "Transaction", ["id: UUID"],
                ["portfolio_id: UUID (FK)", "stock_symbol: VARCHAR (FK)", "type: ENUM (BUY/SELL)", "units: INT", "purchase_price: DECIMAL", "traded_at: TIMESTAMP"])
    
    # Bottom-Left: AlertRule
    draw_entity(0.04, 0.12, 0.22, 0.36, "AlertRule", ["id: UUID"],
                ["user_id: UUID (FK)", "stock_symbol: VARCHAR (FK)", "condition: ENUM", "target_value: DECIMAL", "is_triggered: BOOLEAN", "notification_channel: VARCHAR", "triggered_at: TIMESTAMP"])
    
    # Bottom-Middle: Stock
    draw_entity(0.38, 0.12, 0.24, 0.36, "Stock", ["symbol: VARCHAR(10)"],
                ["company_name: VARCHAR", "sector: VARCHAR", "last_traded_price: DECIMAL", "point_change: DECIMAL", "percentage_change: DECIMAL", "volume: BIGINT", "updated_at: TIMESTAMP"])
    
    # Bottom-Right: HistoricalQuote & Prediction
    draw_entity(0.72, 0.26, 0.24, 0.26, "HistoricalQuote", ["id: BIGINT"],
                ["stock_symbol: VARCHAR (FK)", "trade_date: DATE", "open: DECIMAL", "high: DECIMAL", "low: DECIMAL", "close: DECIMAL", "volume: BIGINT"])
    
    draw_entity(0.72, 0.02, 0.24, 0.22, "ModelPrediction", ["id: BIGINT"],
                ["stock_symbol: VARCHAR (FK)", "forecast_date: DATE", "predicted_close: DECIMAL", "confidence_interval: DECIMAL", "model_version: VARCHAR"])
    
    # Relationship Lines
    # User -> Portfolio (1:M)
    ax.plot([0.26, 0.38], [0.78, 0.78], color="#334155", lw=1.5)
    ax.text(0.27, 0.80, "1", fontsize=8, fontweight='bold')
    ax.text(0.36, 0.80, "N", fontsize=8, fontweight='bold')
    
    # Portfolio -> Transaction (1:M)
    ax.plot([0.62, 0.72], [0.78, 0.78], color="#334155", lw=1.5)
    ax.text(0.63, 0.80, "1", fontsize=8, fontweight='bold')
    ax.text(0.70, 0.80, "N", fontsize=8, fontweight='bold')
    
    # User -> AlertRule (1:M)
    ax.plot([0.15, 0.15], [0.65, 0.48], color="#334155", lw=1.5)
    ax.text(0.16, 0.63, "1", fontsize=8, fontweight='bold')
    ax.text(0.16, 0.50, "N", fontsize=8, fontweight='bold')
    
    # Stock -> AlertRule (1:M)
    ax.plot([0.38, 0.26], [0.28, 0.28], color="#334155", lw=1.5)
    ax.text(0.36, 0.30, "1", fontsize=8, fontweight='bold')
    ax.text(0.28, 0.30, "N", fontsize=8, fontweight='bold')
    
    # Stock -> HistoricalQuote (1:M)
    ax.plot([0.62, 0.72], [0.35, 0.35], color="#334155", lw=1.5)
    ax.text(0.63, 0.37, "1", fontsize=8, fontweight='bold')
    ax.text(0.70, 0.37, "N", fontsize=8, fontweight='bold')
    
    # Stock -> ModelPrediction (1:M)
    ax.plot([0.62, 0.72], [0.18, 0.12], color="#334155", lw=1.5)
    ax.text(0.63, 0.20, "1", fontsize=8, fontweight='bold')
    ax.text(0.70, 0.14, "N", fontsize=8, fontweight='bold')
    
    # Figure title removed for clean document embedding
    plt.tight_layout()
    plt.savefig("assets/diagrams/fig3_5_erd.png", dpi=300, bbox_inches='tight')
    plt.close()
    print("Generated fig3_5_erd.png")

# 10. Figure 3.6: Class Diagram
def draw_class_diagram():
    fig, ax = plt.subplots(figsize=(10, 6.5), dpi=300)
    ax.axis('off')
    
    def draw_uml_class(x, y, w, h, class_name, attributes, methods):
        # Class box
        rect = patches.Rectangle((x, y), w, h, edgecolor="#1E293B", facecolor="#F8FAFC", lw=1.2)
        ax.add_patch(rect)
        # Header
        hdr = patches.Rectangle((x, y + h - 0.05), w, 0.05, edgecolor="#1E293B", facecolor="#E2E8F0", lw=1.2)
        ax.add_patch(hdr)
        ax.text(x + w/2, y + h - 0.025, class_name, ha='center', va='center', fontsize=8.5, fontweight='bold', color="#0F172A")
        
        # Attributes
        y_attr = y + h - 0.07
        ax.text(x + 0.01, y_attr, "\n".join(attributes), ha='left', va='top', fontsize=6.8, color="#1E293B")
        
        # Divider
        div_y = y + h - 0.07 - len(attributes) * 0.025
        ax.plot([x, x + w], [div_y, div_y], color="#CBD5E1", lw=1)
        
        # Methods
        ax.text(x + 0.01, div_y - 0.015, "\n".join(methods), ha='left', va='top', fontsize=6.8, color="#1E293B")
        
    draw_uml_class(0.03, 0.60, 0.26, 0.32, "User",
                   ["+ id: string", "+ email: string", "+ passwordHash: string", "+ role: UserRole"],
                   ["+ authenticate(pw): bool", "+ createAlert(rule): Alert", "+ getPortfolio(): Portfolio", "+ getWatchlist(): Stock[]"])
    
    draw_uml_class(0.37, 0.60, 0.26, 0.32, "Stock",
                   ["+ symbol: string", "+ name: string", "+ ltp: float", "+ change: float", "+ volume: int"],
                   ["+ getHistoricalQuotes(): Quote[]", "+ calculateRSI(period): float", "+ calculateMACD(): MACDResult", "+ getLiveDepth(): OrderBook"])
    
    draw_uml_class(0.71, 0.60, 0.26, 0.32, "PredictiveModelEngine",
                   ["- lstmWeights: Tensor", "- xgbModel: Booster", "- scaler: MinMaxScaler"],
                   ["+ preprocessSequence(quotes): Tensor", "+ predictPrice(symbol): float", "+ evaluateConfidence(): float", "+ retrainPipeline(): void"])
    
    draw_uml_class(0.03, 0.12, 0.26, 0.36, "AlertEngine",
                   ["- activeRules: Map<id, Rule>", "- wsGateway: Gateway"],
                   ["+ evaluateLiveQuote(quote): void", "+ triggerNotification(alert): void", "+ registerRule(rule): void", "+ dismissAlert(id): void"])
    
    draw_uml_class(0.37, 0.12, 0.26, 0.36, "Portfolio",
                   ["+ id: string", "+ userId: string", "+ cashBalance: float", "+ holdings: Holding[]"],
                   ["+ buyStock(symbol, qty, price): void", "+ sellStock(symbol, qty, price): void", "+ calculatePnL(): PnLSummary", "+ generateReport(): PDF"])
    
    draw_uml_class(0.71, 0.12, 0.26, 0.36, "TechnicalIndicatorService",
                   ["+ smoothingConstant: float"],
                   ["+ computeSMA(data, n): float[]", "+ computeEMA(data, n): float[]", "+ computeRSI(data, 14): float", "+ computeBollinger(data, 20): Bands"])
    
    # Association arrows
    ax.annotate('', xy=(0.37, 0.76), xytext=(0.29, 0.76), arrowprops=dict(arrowstyle="->", lw=1.4, color="#334155"))
    ax.annotate('', xy=(0.71, 0.76), xytext=(0.63, 0.76), arrowprops=dict(arrowstyle="->", lw=1.4, color="#334155"))
    ax.annotate('', xy=(0.16, 0.48), xytext=(0.16, 0.60), arrowprops=dict(arrowstyle="->", lw=1.4, color="#334155"))
    ax.annotate('', xy=(0.50, 0.48), xytext=(0.50, 0.60), arrowprops=dict(arrowstyle="->", lw=1.4, color="#334155"))
    ax.annotate('', xy=(0.63, 0.30), xytext=(0.71, 0.30), arrowprops=dict(arrowstyle="->", lw=1.4, color="#334155"))
    
    # Figure title removed for clean document embedding
    plt.tight_layout()
    plt.savefig("assets/diagrams/fig3_6_class_diagram.png", dpi=300, bbox_inches='tight')
    plt.close()
    print("Generated fig3_6_class_diagram.png")

# 11. Figure 3.7: Object Diagram
def draw_object_diagram():
    fig, ax = plt.subplots(figsize=(9, 5.5), dpi=300)
    ax.axis('off')
    
    def draw_obj(x, y, w, h, obj_name, slots):
        rect = patches.FancyBboxPatch((x, y), w, h, boxstyle="square,pad=0.01", edgecolor="#1E293B", facecolor="#F8FAFC", lw=1.2)
        ax.add_patch(rect)
        hdr = patches.Rectangle((x, y + h - 0.045), w, 0.045, edgecolor="#1E293B", facecolor="#E2E8F0", lw=1.2)
        ax.add_patch(hdr)
        ax.text(x + w/2, y + h - 0.022, obj_name, ha='center', va='center', fontsize=8, fontweight='bold', color="#0F172A")
        ax.text(x + 0.015, y + h - 0.065, "\n".join(slots), ha='left', va='top', fontsize=7, color="#1E293B")
        
    draw_obj(0.04, 0.60, 0.26, 0.28, "user1 : User",
             ["id = 'usr_001'", "name = 'Eshan Giri'", "email = 'eshan@thames.edu'", "role = 'investor'"])
    
    draw_obj(0.37, 0.60, 0.26, 0.28, "nabilStock : Stock",
             ["symbol = 'NABIL'", "company = 'Nabil Bank Ltd.'", "ltp = 512.40", "pointChange = +8.20", "status = 'active'"])
    
    draw_obj(0.70, 0.60, 0.26, 0.28, "pred1 : ModelPrediction",
             ["symbol = 'NABIL'", "predictedClose = 524.80", "direction = 'BULLISH'", "confidence = 88.4%", "horizon = '1_day'"])
    
    draw_obj(0.04, 0.15, 0.26, 0.28, "alert1 : AlertRule",
             ["id = 'alt_492'", "symbol = 'NABIL'", "condition = 'PRICE_ABOVE'", "threshold = 520.00", "isTriggered = true"])
    
    draw_obj(0.37, 0.15, 0.26, 0.28, "port1 : Portfolio",
             ["id = 'port_88'", "userId = 'usr_001'", "totalValue = NPR 2,450,000", "dailyPnL = +NPR 38,400", "holdingsCount = 8"])
    
    draw_obj(0.70, 0.15, 0.26, 0.28, "rsiInd : IndicatorState",
             ["symbol = 'NABIL'", "rsi14 = 63.8", "macdHistogram = +2.45", "signal = 'MOMENTUM_EXPANSION'"])
    
    # Object Links
    ax.plot([0.30, 0.37], [0.74, 0.74], color="#334155", lw=1.5)
    ax.text(0.335, 0.76, "monitors", ha='center', fontsize=7, color="#64748B")
    
    ax.plot([0.63, 0.70], [0.74, 0.74], color="#334155", lw=1.5)
    ax.text(0.665, 0.76, "forecasts", ha='center', fontsize=7, color="#64748B")
    
    ax.plot([0.17, 0.17], [0.60, 0.43], color="#334155", lw=1.5)
    ax.text(0.19, 0.51, "owns", ha='left', fontsize=7, color="#64748B")
    
    ax.plot([0.50, 0.50], [0.60, 0.43], color="#334155", lw=1.5)
    ax.text(0.52, 0.51, "contains", ha='left', fontsize=7, color="#64748B")
    
    ax.plot([0.50, 0.30], [0.60, 0.29], color="#334155", lw=1.5)
    ax.text(0.38, 0.46, "evaluates", ha='center', fontsize=7, color="#64748B")
    
    ax.plot([0.83, 0.83], [0.60, 0.43], color="#334155", lw=1.5)
    ax.text(0.85, 0.51, "computes", ha='left', fontsize=7, color="#64748B")
    
    # Figure title removed for clean document embedding
    plt.tight_layout()
    plt.savefig("assets/diagrams/fig3_7_object_diagram.png", dpi=300, bbox_inches='tight')
    plt.close()
    print("Generated fig3_7_object_diagram.png")

# 12. Figure 3.8: State Machine Diagram
def draw_state_diagram():
    fig, ax = plt.subplots(figsize=(9, 4.5), dpi=300)
    ax.axis('off')
    
    # Initial state
    start_c = patches.Circle((0.08, 0.50), 0.02, color="#0F172A")
    ax.add_patch(start_c)
    
    states = [
        ("Created /\nConfigured", 0.24, 0.50),
        ("Active /\nMonitoring", 0.44, 0.50),
        ("Condition\nEvaluated", 0.64, 0.50),
        ("Triggered &\nDispatched", 0.84, 0.50),
        ("Cooldown /\nDismissed", 0.54, 0.16)
    ]
    
    for text, x, y in states:
        rect = patches.FancyBboxPatch((x - 0.08, y - 0.09), 0.16, 0.18, boxstyle="round,pad=0.02",
                                     edgecolor="#2563EB", facecolor="#EFF6FF", lw=1.5)
        ax.add_patch(rect)
        ax.text(x, y, text, ha='center', va='center', fontsize=8, fontweight='bold', color="#1E293B")
        
    # Final state
    final_outer = patches.Circle((0.95, 0.16), 0.025, edgecolor="#0F172A", facecolor="none", lw=1.5)
    final_inner = patches.Circle((0.95, 0.16), 0.016, color="#0F172A")
    ax.add_patch(final_outer)
    ax.add_patch(final_inner)
    
    # Transitions
    ax.annotate('', xy=(0.16, 0.50), xytext=(0.10, 0.50), arrowprops=dict(arrowstyle="->", lw=1.5, color="#1E293B"))
    ax.annotate('', xy=(0.36, 0.50), xytext=(0.32, 0.50), arrowprops=dict(arrowstyle="->", lw=1.5, color="#1E293B"))
    ax.text(0.34, 0.53, "save()", ha='center', fontsize=7, color="#64748B")
    
    ax.annotate('', xy=(0.56, 0.50), xytext=(0.52, 0.50), arrowprops=dict(arrowstyle="->", lw=1.5, color="#1E293B"))
    ax.text(0.54, 0.53, "tick_received", ha='center', fontsize=7, color="#64748B")
    
    ax.annotate('', xy=(0.76, 0.50), xytext=(0.72, 0.50), arrowprops=dict(arrowstyle="->", lw=1.5, color="#DC2626"))
    ax.text(0.74, 0.53, "[price >= threshold]", ha='center', fontsize=7, fontweight='bold', color="#DC2626")
    
    # Condition false -> loop back to monitoring
    ax.annotate('', xy=(0.44, 0.59), xytext=(0.64, 0.59),
                arrowprops=dict(arrowstyle="->", lw=1.2, color="#64748B", connectionstyle="arc3,rad=-0.4"))
    ax.text(0.54, 0.72, "[price < threshold] keep monitoring", ha='center', fontsize=7, color="#64748B")
    
    # Triggered -> Cooldown
    ax.annotate('', xy=(0.62, 0.16), xytext=(0.84, 0.41),
                arrowprops=dict(arrowstyle="->", lw=1.4, color="#1E293B", connectionstyle="angle,angleA=-90,angleB=0,rad=0.03"))
    ax.text(0.77, 0.25, "dispatch_ws_notification()", ha='left', fontsize=7, color="#1E293B")
    
    # Cooldown -> Active (Reset)
    ax.annotate('', xy=(0.44, 0.41), xytext=(0.46, 0.16),
                arrowprops=dict(arrowstyle="->", lw=1.2, color="#16A34A", connectionstyle="angle,angleA=180,angleB=-90,rad=0.03"))
    ax.text(0.38, 0.28, "reset_threshold()", ha='right', fontsize=7, color="#16A34A")
    
    # Cooldown -> Final
    ax.annotate('', xy=(0.92, 0.16), xytext=(0.62, 0.16), arrowprops=dict(arrowstyle="->", lw=1.4, color="#1E293B"))
    ax.text(0.77, 0.19, "delete_rule()", ha='center', fontsize=7, color="#64748B")
    
    # Figure title removed for clean document embedding
    plt.tight_layout()
    plt.savefig("assets/diagrams/fig3_8_state_diagram.png", dpi=300, bbox_inches='tight')
    plt.close()
    print("Generated fig3_8_state_diagram.png")

# 13. Figure 3.9: Sequence Diagram 1 - Ingestion & Live Broadcast
def draw_seq_ingestion():
    fig, ax = plt.subplots(figsize=(9, 6), dpi=300)
    ax.axis('off')
    
    lifelines = [
        ("NEPSE Scraper\nDaemon", 0.12),
        ("NestJS Backend\nGateway", 0.37),
        ("PostgreSQL\nDatabase", 0.62),
        ("React Client\n(WebSocket)", 0.87)
    ]
    
    for name, x in lifelines:
        rect = patches.FancyBboxPatch((x - 0.10, 0.88), 0.20, 0.08, boxstyle="round,pad=0.01",
                                     edgecolor="#1E293B", facecolor="#E2E8F0", lw=1.2)
        ax.add_patch(rect)
        ax.text(x, 0.92, name, ha='center', va='center', fontsize=7.5, fontweight='bold', color="#0F172A")
        ax.plot([x, x], [0.88, 0.05], color="#94A3B8", linestyle="--", lw=1.2)
        
    messages = [
        (0.12, 0.37, 0.80, "1. POST /api/quotes/live-batch (LTP, Volume)", "solid"),
        (0.37, 0.62, 0.72, "2. Upsert quotes to historical store", "solid"),
        (0.62, 0.37, 0.64, "3. Return DB Commit status", "dashed"),
        (0.37, 0.37, 0.54, "4. Check price thresholds & alerts", "self"),
        (0.37, 0.87, 0.44, "5. WS Broadcast 'market:tick' payload", "solid"),
        (0.87, 0.87, 0.34, "6. Update DOM & chart series in real-time", "self"),
        (0.87, 0.37, 0.24, "7. Client Ack / KeepAlive heartbeat", "dashed"),
        (0.37, 0.12, 0.14, "8. HTTP 200 OK (Batch ingested)", "dashed")
    ]
    
    for x1, x2, y, text, mtype in messages:
        if mtype == "self":
            ax.annotate('', xy=(x1, y - 0.03), xytext=(x1, y),
                        arrowprops=dict(arrowstyle="->", lw=1.3, color="#1E293B", connectionstyle="arc,rad=-0.5"))
            ax.text(x1 + 0.02, y - 0.015, text, ha='left', va='center', fontsize=7, color="#1E293B")
        else:
            ls = "--" if mtype == "dashed" else "-"
            ax.annotate('', xy=(x2, y), xytext=(x1, y),
                        arrowprops=dict(arrowstyle="->", lw=1.3, color="#1E293B", linestyle=ls))
            ax.text((x1 + x2)/2, y + 0.02, text, ha='center', va='bottom', fontsize=7, color="#1E293B")
            
    # Figure title removed for clean document embedding
    plt.tight_layout()
    plt.savefig("assets/diagrams/fig3_9_seq_ingestion.png", dpi=300, bbox_inches='tight')
    plt.close()
    print("Generated fig3_9_seq_ingestion.png")

# 14. Figure 3.10: Sequence Diagram 2 - ML Inference
def draw_seq_ml_inference():
    fig, ax = plt.subplots(figsize=(9, 6), dpi=300)
    ax.axis('off')
    
    lifelines = [
        ("React UI\nClient", 0.12),
        ("NestJS API\nGateway", 0.37),
        ("Python FastAPI\nML Service", 0.62),
        ("LSTM/XGBoost\nInference Model", 0.87)
    ]
    
    for name, x in lifelines:
        rect = patches.FancyBboxPatch((x - 0.10, 0.88), 0.20, 0.08, boxstyle="round,pad=0.01",
                                     edgecolor="#1E293B", facecolor="#E2E8F0", lw=1.2)
        ax.add_patch(rect)
        ax.text(x, 0.92, name, ha='center', va='center', fontsize=7.5, fontweight='bold', color="#0F172A")
        ax.plot([x, x], [0.88, 0.05], color="#94A3B8", linestyle="--", lw=1.2)
        
    messages = [
        (0.12, 0.37, 0.80, "1. GET /api/predictions/NABIL?days=1", "solid"),
        (0.37, 0.62, 0.72, "2. POST /predict (60-day OHLCV + indicators)", "solid"),
        (0.62, 0.62, 0.64, "3. MinMax Scale & Sequence Tensor Reshape", "self"),
        (0.62, 0.87, 0.54, "4. model.forward(tensor_seq)", "solid"),
        (0.87, 0.62, 0.44, "5. Return Raw Logits & Confidence", "dashed"),
        (0.62, 0.62, 0.34, "6. Inverse Transform & Ensemble Weighting", "self"),
        (0.62, 0.37, 0.24, "7. HTTP 200 {targetPrice, conf, direction}", "dashed"),
        (0.37, 0.12, 0.14, "8. Render Forecast Ribbon & Candlestick Overlay", "dashed")
    ]
    
    for x1, x2, y, text, mtype in messages:
        if mtype == "self":
            ax.annotate('', xy=(x1, y - 0.03), xytext=(x1, y),
                        arrowprops=dict(arrowstyle="->", lw=1.3, color="#1E293B", connectionstyle="arc,rad=-0.5"))
            ax.text(x1 + 0.02, y - 0.015, text, ha='left', va='center', fontsize=7, color="#1E293B")
        else:
            ls = "--" if mtype == "dashed" else "-"
            ax.annotate('', xy=(x2, y), xytext=(x1, y),
                        arrowprops=dict(arrowstyle="->", lw=1.3, color="#1E293B", linestyle=ls))
            ax.text((x1 + x2)/2, y + 0.02, text, ha='center', va='bottom', fontsize=7, color="#1E293B")
            
    # Figure title removed for clean document embedding
    plt.tight_layout()
    plt.savefig("assets/diagrams/fig3_10_seq_ml_inference.png", dpi=300, bbox_inches='tight')
    plt.close()
    print("Generated fig3_10_seq_ml_inference.png")

# 15. Figure 3.11: Sequence Diagram 3 - Real-Time Alert Triggering
def draw_seq_alert():
    fig, ax = plt.subplots(figsize=(9, 6), dpi=300)
    ax.axis('off')
    
    lifelines = [
        ("Market Stream\n(Redis/WS)", 0.12),
        ("Alert Evaluation\nService", 0.37),
        ("Notification\nWorker", 0.62),
        ("Investor Client\nDevice", 0.87)
    ]
    
    for name, x in lifelines:
        rect = patches.FancyBboxPatch((x - 0.10, 0.88), 0.20, 0.08, boxstyle="round,pad=0.01",
                                     edgecolor="#1E293B", facecolor="#E2E8F0", lw=1.2)
        ax.add_patch(rect)
        ax.text(x, 0.92, name, ha='center', va='center', fontsize=7.5, fontweight='bold', color="#0F172A")
        ax.plot([x, x], [0.88, 0.05], color="#94A3B8", linestyle="--", lw=1.2)
        
    messages = [
        (0.12, 0.37, 0.80, "1. Emit 'tick:NABIL' (Price: 522.0)", "solid"),
        (0.37, 0.37, 0.72, "2. Match against active rules: 522 >= 520 (Breach)", "self"),
        (0.37, 0.37, 0.64, "3. Check Debounce timer (No spam)", "self"),
        (0.37, 0.62, 0.54, "4. Enqueue Alert Job {userId, ruleId, ltp}", "solid"),
        (0.62, 0.62, 0.44, "5. Format Audio & WebPush Notification Payload", "self"),
        (0.62, 0.87, 0.34, "6. Push WebSocket Notification to User Socket", "solid"),
        (0.87, 0.87, 0.24, "7. Play Sound Siren & Flash Alert Modal", "self"),
        (0.87, 0.37, 0.14, "8. Acknowledge / Dismiss Alert Action", "dashed")
    ]
    
    for x1, x2, y, text, mtype in messages:
        if mtype == "self":
            ax.annotate('', xy=(x1, y - 0.03), xytext=(x1, y),
                        arrowprops=dict(arrowstyle="->", lw=1.3, color="#1E293B", connectionstyle="arc,rad=-0.5"))
            ax.text(x1 + 0.02, y - 0.015, text, ha='left', va='center', fontsize=7, color="#1E293B")
        else:
            ls = "--" if mtype == "dashed" else "-"
            ax.annotate('', xy=(x2, y), xytext=(x1, y),
                        arrowprops=dict(arrowstyle="->", lw=1.3, color="#1E293B", linestyle=ls))
            ax.text((x1 + x2)/2, y + 0.02, text, ha='center', va='bottom', fontsize=7, color="#1E293B")
            
    # Figure title removed for clean document embedding
    plt.tight_layout()
    plt.savefig("assets/diagrams/fig3_11_seq_alert_dispatch.png", dpi=300, bbox_inches='tight')
    plt.close()
    print("Generated fig3_11_seq_alert_dispatch.png")

# 16. Figure 3.12: Activity Diagram
def draw_activity_diagram():
    fig, ax = plt.subplots(figsize=(9, 8), dpi=300)
    ax.axis('off')
    
    # 3 Swimlanes: Investor (User), Backend Server, ML / Alert Engine
    ax.plot([0.33, 0.33], [0.05, 0.92], color="#94A3B8", lw=1.5)
    ax.plot([0.66, 0.66], [0.05, 0.92], color="#94A3B8", lw=1.5)
    
    # Swimlane headers
    ax.text(0.165, 0.94, "Investor (Frontend UI)", ha='center', va='center', fontsize=9.5, fontweight='bold', color="#1E293B")
    ax.text(0.50, 0.94, "Backend (NestJS / DB)", ha='center', va='center', fontsize=9.5, fontweight='bold', color="#1E293B")
    ax.text(0.83, 0.94, "Engine (ML & Alert Daemon)", ha='center', va='center', fontsize=9.5, fontweight='bold', color="#1E293B")
    
    def draw_act(x, y, w, h, text):
        rect = patches.FancyBboxPatch((x - w/2, y - h/2), w, h, boxstyle="round,pad=0.015",
                                     edgecolor="#2563EB", facecolor="#EFF6FF", lw=1.3)
        ax.add_patch(rect)
        ax.text(x, y, text, ha='center', va='center', fontsize=7.2, fontweight='bold', color="#0F172A")
        
    def draw_decision(x, y, w, h, text):
        diamond = patches.Polygon([[x, y + h/2], [x + w/2, y], [x, y - h/2], [x - w/2, y]],
                                 closed=True, edgecolor="#D97706", facecolor="#FFFBEB", lw=1.3)
        ax.add_patch(diamond)
        ax.text(x, y, text, ha='center', va='center', fontsize=6.8, fontweight='bold', color="#78350F")
        
    # Start node
    start = patches.Circle((0.165, 0.88), 0.018, color="#0F172A")
    ax.add_patch(start)
    
    draw_act(0.165, 0.80, 0.26, 0.06, "Log in & Select Stock (NABIL)")
    draw_act(0.50, 0.72, 0.26, 0.06, "Fetch History & Ingest Live Feed")
    draw_act(0.83, 0.64, 0.28, 0.06, "Compute RSI, MACD & Predict Close")
    draw_act(0.165, 0.54, 0.26, 0.06, "Review Forecast & Set Price Alert")
    draw_act(0.50, 0.44, 0.26, 0.06, "Store Alert Rule in DB & Cache")
    draw_act(0.83, 0.34, 0.26, 0.06, "Poll Floor Ticker & Match Conditions")
    draw_decision(0.83, 0.22, 0.24, 0.08, "Threshold\nBreached?")
    draw_act(0.50, 0.12, 0.26, 0.06, "Push Alert via WebSocket & Siren")
    draw_act(0.165, 0.12, 0.26, 0.06, "Execute Trade / Update Portfolio")
    
    # Connect
    ax.annotate('', xy=(0.165, 0.83), xytext=(0.165, 0.86), arrowprops=dict(arrowstyle="->", lw=1.2, color="#1E293B"))
    ax.annotate('', xy=(0.50, 0.75), xytext=(0.165, 0.77), arrowprops=dict(arrowstyle="->", lw=1.2, color="#1E293B"))
    ax.annotate('', xy=(0.83, 0.67), xytext=(0.50, 0.69), arrowprops=dict(arrowstyle="->", lw=1.2, color="#1E293B"))
    ax.annotate('', xy=(0.165, 0.57), xytext=(0.83, 0.61), arrowprops=dict(arrowstyle="->", lw=1.2, color="#1E293B"))
    ax.annotate('', xy=(0.50, 0.47), xytext=(0.165, 0.51), arrowprops=dict(arrowstyle="->", lw=1.2, color="#1E293B"))
    ax.annotate('', xy=(0.83, 0.37), xytext=(0.50, 0.41), arrowprops=dict(arrowstyle="->", lw=1.2, color="#1E293B"))
    ax.annotate('', xy=(0.83, 0.26), xytext=(0.83, 0.31), arrowprops=dict(arrowstyle="->", lw=1.2, color="#1E293B"))
    
    # Decision branch
    ax.annotate('', xy=(0.50, 0.15), xytext=(0.83, 0.18), arrowprops=dict(arrowstyle="->", lw=1.2, color="#16A34A"))
    ax.text(0.70, 0.18, "[Yes] Trigger", ha='center', fontsize=7, fontweight='bold', color="#16A34A")
    
    ax.annotate('', xy=(0.95, 0.34), xytext=(0.83, 0.26),
                arrowprops=dict(arrowstyle="->", lw=1.2, color="#DC2626", connectionstyle="arc3,rad=-0.4"))
    ax.text(0.96, 0.28, "[No] Continue", ha='left', fontsize=6.8, color="#DC2626")
    
    ax.annotate('', xy=(0.165, 0.12), xytext=(0.37, 0.12), arrowprops=dict(arrowstyle="->", lw=1.2, color="#1E293B"))
    
    # End node
    end_outer = patches.Circle((0.165, 0.05), 0.018, edgecolor="#0F172A", facecolor="none", lw=1.4)
    end_inner = patches.Circle((0.165, 0.05), 0.011, color="#0F172A")
    ax.add_patch(end_outer)
    ax.add_patch(end_inner)
    ax.annotate('', xy=(0.165, 0.068), xytext=(0.165, 0.09), arrowprops=dict(arrowstyle="->", lw=1.2, color="#1E293B"))
    
    # Figure title removed for clean document embedding
    plt.tight_layout()
    plt.savefig("assets/diagrams/fig3_12_activity_diagram.png", dpi=300, bbox_inches='tight')
    plt.close()
    print("Generated fig3_12_activity_diagram.png")

# 17. Figure 3.13: Component Diagram
def draw_component_diagram():
    fig, ax = plt.subplots(figsize=(9.5, 6), dpi=300)
    ax.axis('off')
    
    def draw_component(x, y, w, h, name, submodules):
        # Component box with UML tabs
        rect = patches.Rectangle((x, y), w, h, edgecolor="#1E293B", facecolor="#F8FAFC", lw=1.4)
        ax.add_patch(rect)
        # Small tabs on left
        tab1 = patches.Rectangle((x - 0.015, y + h - 0.04), 0.03, 0.02, edgecolor="#1E293B", facecolor="#CBD5E1", lw=1)
        tab2 = patches.Rectangle((x - 0.015, y + h - 0.08), 0.03, 0.02, edgecolor="#1E293B", facecolor="#CBD5E1", lw=1)
        ax.add_patch(tab1)
        ax.add_patch(tab2)
        
        ax.text(x + w/2, y + h - 0.03, f"«component»\n{name}", ha='center', va='center', fontsize=8, fontweight='bold', color="#0F172A")
        
        sub_y = y + h - 0.075
        for sm in submodules:
            sm_rect = patches.Rectangle((x + 0.015, sub_y - 0.035), w - 0.03, 0.035, edgecolor="#94A3B8", facecolor="#FFFFFF", lw=1)
            ax.add_patch(sm_rect)
            ax.text(x + w/2, sub_y - 0.018, sm, ha='center', va='center', fontsize=7, color="#1E293B")
            sub_y -= 0.045
            
    # Frontend Component
    draw_component(0.04, 0.52, 0.28, 0.38, "Frontend Client (React/Vite)",
                   ["TradingView Chart View", "Stock Screener & Heatmap", "Portfolio Tracker View", "Alert Configuration Modal", "WebSocket State Provider"])
    
    # Backend Gateway Component
    draw_component(0.36, 0.52, 0.28, 0.38, "Backend API (NestJS)",
                   ["Auth & JWT Interceptor", "Quote Controller & Services", "Live WebSocket Gateway", "Alert Rule Evaluator", "Prisma ORM Access Layer"])
    
    # ML Engine Component
    draw_component(0.68, 0.52, 0.28, 0.38, "AI Microservice (FastAPI)",
                   ["Tensor Data Preprocessor", "BiLSTM Model Runner", "XGBoost Stacking Ensemble", "Indicator Calc (RSI/MACD)", "REST Inference Endpoints"])
    
    # Data Storage Components (Bottom)
    draw_component(0.20, 0.08, 0.28, 0.34, "PostgreSQL Database",
                   ["Users & Auth Table", "Stock Tickers & Sectors", "Historical OHLCV Store", "Alert Rules & Logs", "User Portfolios & Holdings"])
    
    draw_component(0.56, 0.08, 0.28, 0.34, "Redis Cache & Ingestion",
                   ["Real-Time Quote Pub/Sub", "Market Ticker Cache", "Debounce Alert State", "NEPSE Python Scraper Feed", "Celery Task Queue"])
    
    # Arrows
    ax.annotate('', xy=(0.36, 0.72), xytext=(0.32, 0.72), arrowprops=dict(arrowstyle="<->", lw=1.5, color="#1E293B"))
    ax.text(0.34, 0.75, "HTTPS / WSS", ha='center', fontsize=6.8, fontweight='bold', color="#2563EB")
    
    ax.annotate('', xy=(0.68, 0.72), xytext=(0.64, 0.72), arrowprops=dict(arrowstyle="<->", lw=1.5, color="#1E293B"))
    ax.text(0.66, 0.75, "REST JSON", ha='center', fontsize=6.8, fontweight='bold', color="#2563EB")
    
    ax.annotate('', xy=(0.34, 0.42), xytext=(0.44, 0.52), arrowprops=dict(arrowstyle="<->", lw=1.4, color="#1E293B"))
    ax.text(0.36, 0.46, "Prisma SQL", ha='center', fontsize=6.8, color="#059669")
    
    ax.annotate('', xy=(0.62, 0.42), xytext=(0.54, 0.52), arrowprops=dict(arrowstyle="<->", lw=1.4, color="#1E293B"))
    ax.text(0.60, 0.46, "Redis Socket", ha='center', fontsize=6.8, color="#DC2626")
    
    # Figure title removed for clean document embedding
    plt.tight_layout()
    plt.savefig("assets/diagrams/fig3_13_component_diagram.png", dpi=300, bbox_inches='tight')
    plt.close()
    print("Generated fig3_13_component_diagram.png")

# 18. Figure 3.14: Deployment Diagram
def draw_deployment_diagram():
    fig, ax = plt.subplots(figsize=(9.5, 6), dpi=300)
    ax.axis('off')
    
    def draw_node(x, y, w, h, name, env_desc, artifacts):
        # 3D Node effect
        cube_dx = 0.02
        cube_dy = 0.02
        # Front face
        rect = patches.Rectangle((x, y), w, h, edgecolor="#1E293B", facecolor="#F8FAFC", lw=1.4)
        ax.add_patch(rect)
        # Top face
        top_poly = patches.Polygon([[x, y + h], [x + cube_dx, y + h + cube_dy], [x + w + cube_dx, y + h + cube_dy], [x + w, y + h]],
                                   closed=True, edgecolor="#1E293B", facecolor="#E2E8F0", lw=1.4)
        ax.add_patch(top_poly)
        # Side face
        side_poly = patches.Polygon([[x + w, y], [x + w + cube_dx, y + cube_dy], [x + w + cube_dx, y + h + cube_dy], [x + w, y + h]],
                                    closed=True, edgecolor="#1E293B", facecolor="#CBD5E1", lw=1.4)
        ax.add_patch(side_poly)
        
        ax.text(x + w/2, y + h - 0.035, f"«device»\n{name}", ha='center', va='center', fontsize=8, fontweight='bold', color="#0F172A")
        ax.text(x + w/2, y + h - 0.075, f"[{env_desc}]", ha='center', va='center', fontsize=7, color="#475569")
        
        art_y = y + h - 0.10
        for art in artifacts:
            a_rect = patches.Rectangle((x + 0.015, art_y - 0.035), w - 0.03, 0.035, edgecolor="#94A3B8", facecolor="#FFFFFF", lw=0.9)
            ax.add_patch(a_rect)
            ax.text(x + w/2, art_y - 0.018, f"«artifact» {art}", ha='center', va='center', fontsize=6.8, color="#1E293B")
            art_y -= 0.045
            
    draw_node(0.04, 0.52, 0.25, 0.38, "Client Device", "Desktop / Mobile Browser",
              ["React 19 SPA Bundle", "Chart.js / Canvas Engine", "Audio Alert Synthesizer", "Local Storage Session"])
    
    draw_node(0.37, 0.52, 0.26, 0.38, "Application Server", "Node.js v20.x & Nginx",
              ["NestJS REST Gateway", "WebSocket Server (:3000)", "Prisma Data Client", "Background Alert Evaluator"])
    
    draw_node(0.70, 0.52, 0.26, 0.38, "ML Compute Server", "Python 3.11 & FastAPI",
              ["PyTorch LSTM Engine", "XGBoost Regressor (:8000)", "MinMax Pipeline Scaler", "Data Cleaning Daemon"])
    
    draw_node(0.22, 0.08, 0.26, 0.34, "Database Cluster", "PostgreSQL v16 Engine",
              ["Relational Schemas (:5432)", "ACID Transaction Tables", "TimeSeries Quote Indexes", "Encrypted Passwords"])
    
    draw_node(0.58, 0.08, 0.26, 0.34, "Cache & Ingestion Host", "Redis v7.2 & Scraper",
              ["In-Memory Quotes (:6379)", "WebSocket PubSub Bus", "NEPSE Scraper Cron", "Debounce Key-Value Store"])
    
    # Network links
    ax.annotate('', xy=(0.37, 0.70), xytext=(0.29, 0.70), arrowprops=dict(arrowstyle="<->", lw=1.5, color="#1E293B"))
    ax.text(0.33, 0.73, "HTTPS / WSS", ha='center', fontsize=6.8, fontweight='bold', color="#2563EB")
    
    ax.annotate('', xy=(0.70, 0.70), xytext=(0.63, 0.70), arrowprops=dict(arrowstyle="<->", lw=1.5, color="#1E293B"))
    ax.text(0.665, 0.73, "TCP / HTTP (gRPC)", ha='center', fontsize=6.8, fontweight='bold', color="#2563EB")
    
    ax.annotate('', xy=(0.35, 0.42), xytext=(0.45, 0.52), arrowprops=dict(arrowstyle="<->", lw=1.4, color="#1E293B"))
    ax.text(0.38, 0.47, "TCP:5432", ha='center', fontsize=6.8, color="#059669")
    
    ax.annotate('', xy=(0.65, 0.42), xytext=(0.55, 0.52), arrowprops=dict(arrowstyle="<->", lw=1.4, color="#1E293B"))
    ax.text(0.62, 0.47, "TCP:6379", ha='center', fontsize=6.8, color="#DC2626")
    
    # Figure title removed for clean document embedding
    plt.tight_layout()
    plt.savefig("assets/diagrams/fig3_14_deployment_diagram.png", dpi=300, bbox_inches='tight')
    plt.close()
    print("Generated fig3_14_deployment_diagram.png")

if __name__ == '__main__':
    draw_incremental_model()
    draw_hybrid_architecture()
    draw_rsi_plot()
    draw_macd_plot()
    draw_use_case_diagram()
    draw_dfd_level0()
    draw_dfd_level1()
    draw_gantt_chart()
    draw_erd()
    draw_class_diagram()
    draw_object_diagram()
    draw_state_diagram()
    draw_seq_ingestion()
    draw_seq_ml_inference()
    draw_seq_alert()
    draw_activity_diagram()
    draw_component_diagram()
    draw_deployment_diagram()
    print("ALL 18 DIAGRAMS GENERATED SUCCESSFULLY!")
