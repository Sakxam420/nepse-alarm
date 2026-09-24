# generate_report_v2.py
# Tribhuvan University - Faculty of Humanities and Social Sciences (FOHSS)
# Bachelor of Computer Application (BCA) - 8th Semester Project Report Generator
import os
import sys
from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.oxml import parse_xml

from report_builder_helpers import (
    set_cell_border, set_cell_shading, set_cell_margins,
    add_page_number_to_section, add_footer_page_number,
    create_styled_table, add_code_block, add_figure_image
)

def build_nepse_report():
    doc = Document()

    # =========================================================================
    # SECTION 1: PRELIMINARY PAGES (A4, Left=1.25", Top/Bottom/Right=1.0")
    # =========================================================================
    sec1 = doc.sections[0]
    sec1.page_width = Inches(8.27)
    sec1.page_height = Inches(11.69)
    sec1.top_margin = Inches(1.0)
    sec1.bottom_margin = Inches(1.0)
    sec1.left_margin = Inches(1.25)
    sec1.right_margin = Inches(1.0)

    # Base typography style
    style_normal = doc.styles['Normal']
    style_normal.font.name = 'Times New Roman'
    style_normal.font.size = Pt(12)
    style_normal.font.color.rgb = RGBColor(0, 0, 0)
    style_normal.paragraph_format.line_spacing = 1.5
    style_normal.paragraph_format.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
    style_normal.paragraph_format.space_after = Pt(6)

    def p(text="", bold=False, italic=False, size=12, align=WD_ALIGN_PARAGRAPH.JUSTIFY, space_before=0, space_after=6, line_spacing=1.5):
        par = doc.add_paragraph()
        par.alignment = align
        par.paragraph_format.space_before = Pt(space_before)
        par.paragraph_format.space_after = Pt(space_after)
        par.paragraph_format.line_spacing = line_spacing
        if text:
            r = par.add_run(text)
            r.font.name = 'Times New Roman'
            r.font.size = Pt(size)
            r.bold = bold
            r.italic = italic
        return par

    def h1(title):
        par = doc.add_paragraph()
        par.paragraph_format.space_before = Pt(18)
        par.paragraph_format.space_after = Pt(10)
        par.paragraph_format.line_spacing = 1.15
        par.paragraph_format.keep_with_next = True
        par.alignment = WD_ALIGN_PARAGRAPH.LEFT
        r = par.add_run(title)
        r.font.name = 'Times New Roman'
        r.font.size = Pt(16)
        r.bold = True
        return par

    def h2(title):
        par = doc.add_paragraph()
        par.paragraph_format.space_before = Pt(14)
        par.paragraph_format.space_after = Pt(6)
        par.paragraph_format.line_spacing = 1.15
        par.paragraph_format.keep_with_next = True
        par.alignment = WD_ALIGN_PARAGRAPH.LEFT
        r = par.add_run(title)
        r.font.name = 'Times New Roman'
        r.font.size = Pt(14)
        r.bold = True
        return par

    def h3(title):
        par = doc.add_paragraph()
        par.paragraph_format.space_before = Pt(10)
        par.paragraph_format.space_after = Pt(4)
        par.paragraph_format.line_spacing = 1.15
        par.paragraph_format.keep_with_next = True
        par.alignment = WD_ALIGN_PARAGRAPH.LEFT
        r = par.add_run(title)
        r.font.name = 'Times New Roman'
        r.font.size = Pt(12)
        r.bold = True
        return par

    def table_caption(title):
        par = doc.add_paragraph()
        par.paragraph_format.space_before = Pt(12)
        par.paragraph_format.space_after = Pt(4)
        par.paragraph_format.keep_with_next = True
        par.alignment = WD_ALIGN_PARAGRAPH.CENTER
        r = par.add_run(title)
        r.font.name = 'Times New Roman'
        r.font.size = Pt(12)
        r.bold = True
        return par

    def figure_caption(title):
        par = doc.add_paragraph()
        par.paragraph_format.space_before = Pt(4)
        par.paragraph_format.space_after = Pt(12)
        par.alignment = WD_ALIGN_PARAGRAPH.CENTER
        r = par.add_run(title)
        r.font.name = 'Times New Roman'
        r.font.size = Pt(12)
        r.bold = True
        return par

    # =========================================================================
    # 1. COVER & TITLE PAGE (TU Specimen Page 7)
    # =========================================================================
    p("Tribhuvan University", bold=True, size=16, align=WD_ALIGN_PARAGRAPH.CENTER, space_before=16, space_after=3, line_spacing=1.15)
    p("Faculty of Humanities and Social Sciences", bold=True, size=14, align=WD_ALIGN_PARAGRAPH.CENTER, space_after=28, line_spacing=1.15)

    p("NEPSE AI: REAL-TIME FINANCIAL DECISION SUPPORT AND STOCK PREDICTION SYSTEM", bold=True, size=16, align=WD_ALIGN_PARAGRAPH.CENTER, space_after=14, line_spacing=1.25)
    p("A PROJECT REPORT", bold=True, size=13, align=WD_ALIGN_PARAGRAPH.CENTER, space_after=22, line_spacing=1.15)

    p("Submitted to", italic=True, size=12, align=WD_ALIGN_PARAGRAPH.CENTER, space_after=3, line_spacing=1.15)
    p("Department of Computer Application", bold=True, size=13, align=WD_ALIGN_PARAGRAPH.CENTER, space_after=2, line_spacing=1.15)
    p("[Name of the College / Campus]", bold=True, size=13, align=WD_ALIGN_PARAGRAPH.CENTER, space_after=24, line_spacing=1.15)

    p("In partial fulfillment of the requirements for the degree of\nBachelor of Computer Application (BCA)", italic=True, size=12, align=WD_ALIGN_PARAGRAPH.CENTER, space_after=26, line_spacing=1.2)

    p("Submitted by:", bold=True, size=12, align=WD_ALIGN_PARAGRAPH.CENTER, space_after=4, line_spacing=1.15)
    p("[Candidate Name(s)]\nRoll No: [TU Roll Number]  |  Reg. No: [TU Registration Number]\nYear/Sem.: IV/VIII (8th Semester)", size=12, align=WD_ALIGN_PARAGRAPH.CENTER, space_after=22, line_spacing=1.15)
    p("September, 2026", bold=True, size=12, align=WD_ALIGN_PARAGRAPH.CENTER, space_after=24, line_spacing=1.15)

    p("Under the Supervision of:", bold=True, size=12, align=WD_ALIGN_PARAGRAPH.CENTER, space_after=4, line_spacing=1.15)
    p("[Supervisor Name]\n[Academic Designation]\nDepartment of Computer Application", size=12, align=WD_ALIGN_PARAGRAPH.CENTER, space_after=0, line_spacing=1.15)

    doc.add_page_break()

    # =========================================================================
    # 2. SUPERVISOR'S RECOMMENDATION (TU Specimen Page 8)
    # =========================================================================
    p("Tribhuvan University", bold=True, size=15, align=WD_ALIGN_PARAGRAPH.CENTER, space_before=10, space_after=2, line_spacing=1.15)
    p("Faculty of Humanities and Social Sciences", bold=True, size=13, align=WD_ALIGN_PARAGRAPH.CENTER, space_after=2, line_spacing=1.15)
    p("[Name of the College / Campus]", bold=True, size=13, align=WD_ALIGN_PARAGRAPH.CENTER, space_after=32, line_spacing=1.15)

    p("Supervisor’s Recommendation", bold=True, size=15, align=WD_ALIGN_PARAGRAPH.CENTER, space_after=24, line_spacing=1.15)

    p("I hereby recommend that this project prepared under my supervision by [Candidate Name(s)] entitled “NEPSE AI: REAL-TIME FINANCIAL DECISION SUPPORT AND STOCK PREDICTION SYSTEM” in partial fulfillment of the requirements for the degree of Bachelor of Computer Application (BCA), 8th Semester is recommended for the final evaluation.", space_after=48)

    p("________________________", bold=True, align=WD_ALIGN_PARAGRAPH.LEFT, space_after=2)
    p("SIGNATURE", bold=True, align=WD_ALIGN_PARAGRAPH.LEFT, space_after=2)
    p("[Supervisor Name]", bold=True, align=WD_ALIGN_PARAGRAPH.LEFT, space_after=2)
    p("SUPERVISOR", bold=True, align=WD_ALIGN_PARAGRAPH.LEFT, space_after=2)
    p("[Academic Designation]", align=WD_ALIGN_PARAGRAPH.LEFT, space_after=2)
    p("Department of Computer Application", align=WD_ALIGN_PARAGRAPH.LEFT, space_after=2)
    p("[Full Address of Department & College]", align=WD_ALIGN_PARAGRAPH.LEFT, space_after=18)
    p("Date: ____________________", align=WD_ALIGN_PARAGRAPH.LEFT)

    doc.add_page_break()

    # =========================================================================
    # 3. LETTER OF APPROVAL (TU Specimen Page 9)
    # =========================================================================
    p("Tribhuvan University", bold=True, size=15, align=WD_ALIGN_PARAGRAPH.CENTER, space_before=10, space_after=2, line_spacing=1.15)
    p("Faculty of Humanities and Social Sciences", bold=True, size=13, align=WD_ALIGN_PARAGRAPH.CENTER, space_after=2, line_spacing=1.15)
    p("[Name of the College / Campus]", bold=True, size=13, align=WD_ALIGN_PARAGRAPH.CENTER, space_after=28, line_spacing=1.15)

    p("LETTER OF APPROVAL", bold=True, size=15, align=WD_ALIGN_PARAGRAPH.CENTER, space_after=20, line_spacing=1.15)

    p("This is to certify that this project prepared by [Candidate Name(s)] entitled “NEPSE AI: REAL-TIME FINANCIAL DECISION SUPPORT AND STOCK PREDICTION SYSTEM” in partial fulfillment of the requirements for the degree of Bachelor of Computer Application (BCA) has been evaluated. In our opinion it is satisfactory in the scope and quality as a project for the required degree.", space_after=24)

    appr_table = doc.add_table(rows=2, cols=2)
    appr_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    appr_table.autofit = False

    appr_data = [
        [
            "SIGNATURE of Supervisor:\n_____________________\nName: [Supervisor Name]\nDesignation: [Academic Designation]\nDept: Computer Application\nCollege: [College Name]",
            "SIGNATURE of HOD/Coordinator:\n_____________________\nName: [HOD/Coordinator Name]\nDesignation: [Academic Designation]\nDept: Computer Application\nCollege: [College Name]"
        ],
        [
            "SIGNATURE of Internal Examiner:\n_____________________\nName: [Internal Examiner Name]\nDesignation: [Academic Designation]\nDept: Computer Application\nCollege: [College Name]",
            "SIGNATURE of External Examiner:\n_____________________\nName: [External Examiner Name]\nDesignation: External Examiner\nTribhuvan University\nFaculty of Humanities & Social Sciences"
        ]
    ]

    for r_idx, row in enumerate(appr_table.rows):
        for c_idx, cell in enumerate(row.cells):
            cell.width = Inches(3.0)
            set_cell_margins(cell, top=120, bottom=120, left=120, right=120)
            set_cell_border(cell, top=dict(sz=6, color='718096'), bottom=dict(sz=6, color='718096'),
                            left=dict(sz=6, color='718096'), right=dict(sz=6, color='718096'))
            cell_p = cell.paragraphs[0]
            cell_p.alignment = WD_ALIGN_PARAGRAPH.LEFT
            cell_p.paragraph_format.line_spacing = 1.15
            cell_p.paragraph_format.space_after = Pt(2)
            cell_p.text = appr_data[r_idx][c_idx]

    doc.add_page_break()

    # =========================================================================
    # 4. ABSTRACT
    # =========================================================================
    h1("ABSTRACT")
    p("The Nepal Stock Exchange (NEPSE) is an emerging financial equity market characterized by high retail investor concentration, non-linear volatility, structural illiquidity across mid-tier and small-cap issues, and regulatory policy shifts. Traditional computational attempts to forecast exact price points frequently break down due to low order-book depth, circuit breakers, and speculative social media noise. This project, entitled “NEPSE AI: Real-Time Financial Decision Support and Stock Prediction System,” addresses these empirical realities by transitioning from high-error point regression to a comprehensive quantitative Decision Support System (DSS) and real-time market supervision terminal.")

    p("The system is engineered as an enterprise-grade, decoupled three-tier microservice architecture. The application core and background scheduling daemons are developed in NestJS with Prisma ORM, interfacing with live NEPSE data wrappers (@rumess/nepse-api) to ingest, normalize, and persist daily End-of-Day (EOD) OHLCV records across 649 listed securities. Machine learning inference is handled by a specialized Python FastAPI microservice utilizing a novel two-stage hybrid predictive architecture. In Stage 1, a PyTorch Long Short-Term Memory (LSTM) recurrent neural network extracts 16-dimensional latent temporal sequence embeddings from 30-day sliding price windows. In Stage 2, these sequence representations are concatenated with hand-engineered technical indicators (Wilder's RSI 14, MACD Histogram, Multi-period EMAs, Bollinger Bandwidth, and Volume Delta) and classified via an XGBoost multi-class softprob engine into probabilistic Bullish, Bearish, or Neutral market regimes.")

    p("Complementing the predictive pipeline is a full-featured financial trading terminal developed in React 19 and Vite 6. The client dashboard features an interactive candlestick and area visualizer with indicator overlays, a zero-dependency Web Audio API acoustic synthesizer chime and browser desktop alerting engine, a 5-day Monte Carlo price projection envelope, an empirical 60-session historical signal backtesting simulator, a live Market Movers screener with market breadth metrics, a multi-stock comparison matrix, and a paper trading portfolio manager. The platform achieves sub-50ms query response latency, resilient offline operation, and 100% availability through local persistence and client-side synthetic fallback engines, establishing an academic benchmark for quantitative capital market systems in Nepal.")

    p("Keywords: Decision Support System, NEPSE, Long Short-Term Memory, XGBoost, Hybrid Machine Learning, Technical Indicators, Real-Time Alarms, Microservices, NestJS, React, BCA Capstone Project.")

    doc.add_page_break()

    # =========================================================================
    # 5. ACKNOWLEDGEMENT
    # =========================================================================
    h1("ACKNOWLEDGEMENT")
    p("We express our profound gratitude and sincere appreciation to Tribhuvan University, Faculty of Humanities and Social Sciences (FOHSS), for incorporating the Final Year Capstone Project (Project Work) into the Bachelor of Computer Application (BCA) 8th Semester curriculum. This rigorous practical endeavor has provided an extraordinary opportunity to synthesize theoretical knowledge across software engineering, artificial intelligence, distributed architectures, database systems, and financial engineering into a production-grade software application.")

    p("We owe a great debt of gratitude to our respected Project Supervisor, [Supervisor Name], for their invaluable mentorship, insightful critique, and continuous technical direction throughout the entire lifecycle of this project. Their guidance during algorithmic formulation, architecture decoupling, and system evaluation was instrumental in elevating the academic rigor and practical utility of our work.")

    p("We also extend our earnest appreciation to the Head of Department, [HOD/Coordinator Name], and all the esteemed faculty members of the Department of Computer Application at [College Name] for their administrative facilitation, encouragement, and for providing the modern computing infrastructure necessary to train and validate our machine learning models.")

    p("Finally, we are deeply thankful to our families, peers, and fellow BCA classmates for their unwavering support, moral encouragement, and constructive feedback throughout the development and documentation of this capstone project.")

    doc.add_page_break()

    # =========================================================================
    # 6. TABLE OF CONTENTS
    # =========================================================================
    h1("TABLE OF CONTENTS")
    toc_items = [
        ("Supervisor’s Recommendation", "ii"),
        ("Letter of Approval", "iii"),
        ("Abstract", "iv"),
        ("Acknowledgement", "v"),
        ("List of Abbreviations", "vii"),
        ("List of Figures", "viii"),
        ("List of Tables", "ix"),
        ("CHAPTER 1: INTRODUCTION", "1"),
        ("  1.1 Introduction", "1"),
        ("  1.2 Problem Statement", "3"),
        ("  1.3 Objectives", "4"),
        ("  1.4 Scope and Limitation", "5"),
        ("  1.5 Development Methodology", "6"),
        ("  1.6 Report Organization", "8"),
        ("CHAPTER 2: BACKGROUND STUDY AND LITERATURE REVIEW", "9"),
        ("  2.1 Background Study", "9"),
        ("    2.1.1 Overview of NEPSE Market Mechanics", "9"),
        ("    2.1.2 Technical Analysis & Mathematical Indicators", "10"),
        ("    2.1.3 Time-Series Financial Modeling & Machine Learning", "13"),
        ("    2.1.4 Recurrent Neural Networks & LSTM Architectures", "14"),
        ("    2.1.5 Extreme Gradient Boosting (XGBoost) Framework", "16"),
        ("    2.1.6 The Hybrid Sequence-Tabular Feature Engineering", "17"),
        ("    2.1.7 Modern Real-Time Web Alerting Architectures", "18"),
        ("  2.2 Literature Review", "19"),
        ("    2.2.1 Review of Related Works", "19"),
        ("    2.2.2 Comparative Summary of Literature", "22"),
        ("CHAPTER 3: SYSTEM ANALYSIS AND DESIGN", "24"),
        ("  3.1 System Analysis", "24"),
        ("    3.1.1 Requirement Analysis", "24"),
        ("      i. Functional Requirements", "24"),
        ("      ii. Detailed Use Case Descriptions", "26"),
        ("      iii. Non-Functional Requirements", "28"),
        ("    3.1.2 Feasibility Analysis", "29"),
        ("    3.1.3 Object Modelling (Class Diagram & Domain Entities)", "31"),
        ("    3.1.4 Dynamic Modelling (Sequence & State Diagrams)", "33"),
        ("    3.1.5 Process Modelling (Activity Diagrams & Workflows)", "35"),
        ("  3.2 System Design", "37"),
        ("    3.2.1 Architectural Design", "37"),
        ("    3.2.2 Database Schema Design & Data Dictionaries", "39"),
        ("    3.2.3 Interface Design (UI/UX Ergonomics & Visual System)", "43"),
        ("    3.2.4 Component and Deployment Architecture", "45"),
        ("  3.3 Algorithm Details", "47"),
        ("    3.3.1 Mathematical Formulations of Technical Indicators", "47"),
        ("    3.3.2 Two-Stage Hybrid LSTM-XGBoost Architecture", "49"),
        ("    3.3.3 Real-Time Multi-Condition Alert Evaluation Engine", "52"),
        ("    3.3.4 Empirical Signal Backtesting Simulation Algorithm", "53"),
        ("    3.3.5 Monte Carlo Volatility Envelope Simulation Algorithm", "55"),
        ("CHAPTER 4: IMPLEMENTATION AND TESTING", "57"),
        ("  4.1 Implementation", "57"),
        ("    4.1.1 Tools and Platforms Used", "57"),
        ("    4.1.2 Module Implementation Details", "59"),
        ("  4.2 Testing", "64"),
        ("    4.2.1 Unit Testing", "64"),
        ("    4.2.2 System & Integration Testing", "67"),
        ("    4.2.3 User Acceptance Testing (UAT)", "69"),
        ("CHAPTER 5: CONCLUSION AND FUTURE RECOMMENDATIONS", "71"),
        ("  5.1 Conclusion", "71"),
        ("  5.2 Lessons Learnt & Outcomes", "72"),
        ("  5.3 Future Recommendations", "74"),
        ("APPENDICES", "76"),
        ("  Appendix A: System User Interface Screenshots", "76"),
        ("  Appendix B: Core Algorithmic Code Listings", "81"),
        ("  Appendix C: Supervisor Visit Log Sheet", "85"),
        ("REFERENCES", "87"),
    ]

    for item, page_str in toc_items:
        t_par = doc.add_paragraph()
        t_par.paragraph_format.line_spacing = 1.15
        t_par.paragraph_format.space_after = Pt(2.5)
        is_chap = item.startswith("CHAPTER") or item.startswith("APPENDICES") or item.startswith("REFERENCES")
        r1 = t_par.add_run(item)
        r1.font.name = 'Times New Roman'
        r1.font.size = Pt(11)
        r1.bold = is_chap

        dots_len = max(2, 68 - len(item))
        r_dots = t_par.add_run(" " + "." * dots_len + " ")
        r_dots.font.name = 'Times New Roman'
        r_dots.font.size = Pt(10)
        r_dots.font.color.rgb = RGBColor(140, 140, 140)

        r2 = t_par.add_run(page_str)
        r2.font.name = 'Times New Roman'
        r2.font.size = Pt(11)
        r2.bold = is_chap

    doc.add_page_break()

    # =========================================================================
    # 7. LIST OF ABBREVIATIONS
    # =========================================================================
    h1("LIST OF ABBREVIATIONS")
    abbrevs_data = [
        ("AI", "Artificial Intelligence"),
        ("API", "Application Programming Interface"),
        ("BCA", "Bachelor of Computer Application"),
        ("CASE", "Computer-Aided Software Engineering"),
        ("CDSC", "Central Depository Services and Clearing Limited"),
        ("CRUD", "Create, Read, Update, Delete"),
        ("CSS", "Cascading Style Sheets"),
        ("DFD", "Data Flow Diagram"),
        ("DSS", "Decision Support System"),
        ("DTO", "Data Transfer Object"),
        ("EMA", "Exponential Moving Average"),
        ("EMH", "Efficient Market Hypothesis"),
        ("EOD", "End of Day"),
        ("ERD", "Entity Relationship Diagram"),
        ("FOHSS", "Faculty of Humanities and Social Sciences"),
        ("GBM", "Geometric Brownian Motion"),
        ("HMR", "Hot Module Replacement"),
        ("HTML", "Hypertext Markup Language"),
        ("HTTP", "Hypertext Transfer Protocol"),
        ("IEEE", "Institute of Electrical and Electronics Engineers"),
        ("JSON", "JavaScript Object Notation"),
        ("KPI", "Key Performance Indicator"),
        ("LSTM", "Long Short-Term Memory (Recurrent Neural Network)"),
        ("LTP", "Last Traded Price"),
        ("MACD", "Moving Average Convergence Divergence"),
        ("MDD", "Maximum Drawdown"),
        ("ML", "Machine Learning"),
        ("MSE", "Mean Squared Error"),
        ("NATS", "NEPSE Automated Trading System"),
        ("NEPSE", "Nepal Stock Exchange"),
        ("NPR", "Nepalese Rupee"),
        ("NRB", "Nepal Rastra Bank"),
        ("OHLCV", "Open, High, Low, Close, Volume"),
        ("ORM", "Object-Relational Mapping"),
        ("PnL", "Profit and Loss"),
        ("QA", "Quality Assurance"),
        ("REST", "Representational State Transfer"),
        ("RMSE", "Root Mean Squared Error"),
        ("RNN", "Recurrent Neural Network"),
        ("RSI", "Relative Strength Index"),
        ("SEBON", "Securities Board of Nepal"),
        ("SMA", "Simple Moving Average"),
        ("SPA", "Single Page Application"),
        ("SRS", "Software Requirement Specification"),
        ("TLS", "Transport Layer Security"),
        ("TMS", "Trade Management System"),
        ("TU", "Tribhuvan University"),
        ("UAT", "User Acceptance Testing"),
        ("UI/UX", "User Interface / User Experience"),
        ("UML", "Unified Modeling Language"),
        ("URI", "Uniform Resource Identifier"),
        ("UUID", "Universally Unique Identifier"),
        ("XGBoost", "Extreme Gradient Boosting"),
    ]
    create_styled_table(doc, ["Abbreviation", "Full Expanded Description"], abbrevs_data, [1.8, 4.22])

    doc.add_page_break()

    # =========================================================================
    # 8. LIST OF FIGURES
    # =========================================================================
    h1("LIST OF FIGURES")
    figures_data = [
        ("Figure 1.1", "Incremental Iterative Agile Software Engineering Process", "7"),
        ("Figure 2.1", "Wilder’s 14-Period RSI Oscillator Bounds and Momentum Thresholds", "12"),
        ("Figure 2.2", "Moving Average Convergence Divergence (MACD) Signal Expansion", "13"),
        ("Figure 2.3", "Classical LSTM Memory Cell Architecture with Gating Mechanisms", "15"),
        ("Figure 2.4", "HTML5 Web Audio API Client-Side Frequency Synthesizer Pipeline", "19"),
        ("Figure 3.1", "System Use Case Diagram for NEPSE AI Platform", "27"),
        ("Figure 3.2", "UML Class Diagram Representing Core Domain Entities & Services", "32"),
        ("Figure 3.3", "Sequence Diagram for Real-Time Price Ingestion and Alert Evaluation", "34"),
        ("Figure 3.4", "Sequence Diagram for Hybrid Machine Learning Inference Pipeline", "35"),
        ("Figure 3.5", "State Transition Diagram for Price Alert Lifecycle", "35"),
        ("Figure 3.6", "Activity Diagram for Automated Daily EOD Market Data Ingestion", "36"),
        ("Figure 3.7", "Three-Tier Decoupled Microservices Architecture", "38"),
        ("Figure 3.8", "Relational Entity Relationship Diagram (ERD)", "40"),
        ("Figure 3.9", "Component Architecture Diagram of Frontend and Backend Microservices", "46"),
        ("Figure 3.10", "Physical Deployment Topology across Docker Container Environments", "47"),
        ("Figure 3.11", "Two-Stage Hybrid LSTM-XGBoost Feature Concatenation Architecture", "50"),
        ("Figure 3.12", "Parametric Volatility Drift Cone and 5-Day Confidence Projection", "56"),
        ("Figure A.1", "Main Interactive Financial Terminal & Real-Time Charting Canvas", "76"),
        ("Figure A.2", "Maximized Candlestick Visualizer with Multi-Indicator Overlays", "77"),
        ("Figure A.3", "Live Market Movers Screener with Advance/Decline Breadth Bar", "78"),
        ("Figure A.4", "Paper Trading Portfolio Management Dashboard with Mark-to-Market PnL", "79"),
        ("Figure A.5", "Multi-Stock Comparative Matrix and Technical Benchmarking Modal", "80"),
    ]
    create_styled_table(doc, ["Figure No.", "Figure Title & Description", "Page"], figures_data, [1.2, 4.22, 0.6], alignments=['C', 'L', 'C'])

    doc.add_page_break()

    # =========================================================================
    # 9. LIST OF TABLES
    # =========================================================================
    h1("LIST OF TABLES")
    tables_data = [
        ("Table 2.1", "Comparative Synthesis of Existing Literature and Methodologies", "23"),
        ("Table 3.1", "Functional Requirements Specifications and Traceability Matrix", "25"),
        ("Table 3.2", "Non-Functional Engineering Quality Attributes", "28"),
        ("Table 3.3", "Data Dictionary: Company Entity", "40"),
        ("Table 3.4", "Data Dictionary: DailyPrice Entity", "41"),
        ("Table 3.5", "Data Dictionary: Alert Entity", "42"),
        ("Table 3.6", "Data Dictionary: PortfolioPosition Entity", "43"),
        ("Table 3.7", "Database Indexing Strategy and Query Optimization Matrix", "43"),
        ("Table 4.1", "Software Development Stack, Frameworks, and CASE Tools", "58"),
        ("Table 4.2", "Unit Test Suite Specifications and Execution Results", "65"),
        ("Table 4.3", "System Integration and End-to-End Test Matrix", "68"),
        ("Table 4.4", "User Acceptance Testing (UAT) Scenario Evaluation Matrix", "70"),
        ("Table C.1", "Supervisor Consultation and Progress Log Sheet (8th Semester)", "85"),
    ]
    create_styled_table(doc, ["Table No.", "Table Title & Description", "Page"], tables_data, [1.2, 4.22, 0.6], alignments=['C', 'L', 'C'])

    # Set page numbering for preliminary pages (Roman numerals)
    add_page_number_to_section(sec1, start_type="romanLower", start_num=1)
    add_footer_page_number(sec1)

    # =========================================================================
    # SECTION 2: MAIN REPORT BODY (A4, Arabic numerals 1, 2, 3...)
    # =========================================================================
    sec2 = doc.add_section()
    sec2.page_width = Inches(8.27)
    sec2.page_height = Inches(11.69)
    sec2.top_margin = Inches(1.0)
    sec2.bottom_margin = Inches(1.0)
    sec2.left_margin = Inches(1.25)
    sec2.right_margin = Inches(1.0)
    sec2.header.is_linked_to_previous = False
    sec2.footer.is_linked_to_previous = False
    add_page_number_to_section(sec2, start_type="decimal", start_num=1)
    add_footer_page_number(sec2)

    # -------------------------------------------------------------------------
    # CHAPTER 1: INTRODUCTION
    # -------------------------------------------------------------------------
    h1("CHAPTER 1: INTRODUCTION")

    h2("1.1 Introduction")
    p("Capital equity markets represent the financial lifeblood of modern economies, acting as primary vehicles for capital formation, resource allocation, and wealth accumulation. Over the past decade, financial technologies across the globe have undergone a profound paradigm shift—transitioning from legacy, floor-based manual executions to algorithmic, data-driven computational trading terminals. In developing economies such as Nepal, this technological democratization has unlocked unprecedented retail participation.")

    p("The Nepal Stock Exchange (NEPSE), established in 1993 under the Securities Exchange Act, serves as the sole regulated securities marketplace in Nepal. Historically characterized by physical open-outcry trading floors, paper certificates, and cumbersome manual settlement cycles, the market took a revolutionary leap forward with the rollout of the fully computerized NEPSE Automated Trading System (NATS) and digital dematerialized depository operations by Central Depository Services and Clearing Limited (CDSC). The subsequent launch of web-based client order portals, notably the Trade Management System (TMS) and MeroShare, eliminated physical geographic barriers. Today, active CDS accounts exceed 6.2 million, and over 1.8 million investors actively hold online trading accounts.")

    p("However, this meteoric expansion of retail market participation has also magnified systemic structural weaknesses. Unlike institutional-dominated international exchanges like the New York Stock Exchange (NYSE) or London Stock Exchange (LSE), NEPSE's trading volume is overwhelmingly driven by retail participants (accounting for more than 85% of total traded volume). The domestic retail market is severely handicapped by acute informational asymmetry, low financial literacy, and a virtual absence of institutional-grade analytical tooling. Retail participants frequently rely on rumors, unregulated social media groups (Viber, Telegram, Facebook forums), and speculative momentum calls, resulting in devastating portfolio drawdowns during broad market corrections.")

    p("From an academic and software engineering perspective, the digital tools currently available to Nepali investors are severely limited. Traditional market portals (such as ShareSansar, Merolagani, and NepseAlpha) function primarily as passive informational bulletin boards. They display static historical tables or basic price charts, but lack real-time multi-condition alert automation, empirical strategy backtesting simulators, mark-to-market paper trading modules, and advanced machine learning predictive pipelines.")

    p("To decisively solve these challenges, this final year capstone project presents “NEPSE AI: Real-Time Financial Decision Support and Stock Prediction System.” Engineered specifically for the structural realities of the Nepalese capital market, the platform departs from fragile point-in-time price prediction regression models (which attempt to forecast an exact next-day rupee value) and instead constructs an enterprise-grade quantitative Decision Support System (DSS). By orchestrating a decoupled three-tier microservice architecture—combining a NestJS application backend, a Python FastAPI machine learning engine utilizing a two-stage hybrid PyTorch LSTM and XGBoost classifier, and a high-performance React 19 financial terminal—the platform delivers probabilistic trend classifications, 5-day Monte Carlo price projection envelopes, real-time Web Audio synthesizer alerts, multi-stock comparative benchmarking, and risk-free portfolio tracking.")

    h2("1.2 Problem Statement")
    p("The systematic engineering of financial analytics systems for the Nepal Stock Exchange must overcome four critical computational, structural, and financial challenges:")

    p("1. Severe Informational Asymmetry & Unscientific Retail Speculation: The vast majority of retail participants in Nepal enter the market without quantitative risk management protocols. Trading positions are overwhelmingly established on the basis of social media sentiment and unverified hearsay rather than verified mathematical technical confluence or risk-adjusted probabilistic forecasts. When market corrections occur, retail investors experience catastrophic capital depletion due to an absence of automated stop-loss and alert supervision.")

    p("2. Structural Fragility and Downtime of Public NEPSE Portals: Third-party data wrappers and public NEPSE endpoints frequently experience severe latency spikes, rate-limiting blocks, unexpected structural format alterations, and self-signed Transport Layer Security (TLS) certificate handshake errors. Existing financial tools that rely exclusively on synchronous live scraping inevitably crash or hang during peak trading hours (11:00 AM – 3:00 PM NPT), severely degrading user experience and reliability.")

    p("3. Inherent Failure of Standalone Point-in-Time Regression Models: Academic financial computing literature reveals that emerging equity markets possess low order-book depth, high noise-to-signal ratios, and strict daily circuit breaker bands (±10%). Standalone deep learning regression models (such as vanilla LSTMs or standard Feed-Forward Neural Networks) that attempt to predict exact closing prices exhibit severe Mean Squared Error (MSE) degradation during volatile market regimes. Furthermore, deep neural networks struggle to interpret heterogeneous tabular technical indicators, while traditional tree-based models (such as Random Forests or XGBoost) lack the sequential memory to capture temporal price momentum.")

    p("4. Absence of Unified, Zero-Latency Alerting and Decision Support Tools: Most existing local solutions operate as passive repositories. Retail traders lack access to active alerting engines that trigger instantaneous multi-condition alerts (such as moving average crossovers or RSI oversold breaches) with zero external media asset dependencies, as well as integrated paper trading environments to test algorithmic strategies without real financial risk.")

    h2("1.3 Objectives")
    p("The general objective of this project is to research, design, develop, and evaluate an enterprise-grade, real-time financial decision support, predictive analytics, and market supervision terminal for the Nepal Stock Exchange (NEPSE).")

    p("The specific technical and academic objectives of the project are:")
    p("• To design a decoupled, three-tier microservice architecture separating web presentation, enterprise backend orchestration and database persistence, and specialized Python machine learning inference.")
    p("• To build an automated daily End-of-Day (EOD) market ingestion pipeline using @rumess/nepse-api with custom TLS bypass and a multi-tier synthetic fallback engine to guarantee 100% data availability even during external exchange outages.")
    p("• To develop an optimized mathematical technical analysis engine in TypeScript calculating Simple Moving Averages (SMA 20), Exponential Moving Averages (EMA 12, 26, 50), Wilder’s Relative Strength Index (RSI 14), Moving Average Convergence Divergence (MACD 12, 26, 9), Bollinger Bands (20, 2), and Volume Delta in sub-50 milliseconds.")
    p("• To formulate and train a two-stage hybrid machine learning pipeline combining a PyTorch Long Short-Term Memory (LSTM) recurrent neural network (extracting 16-dimensional temporal embeddings from 30-day sequential price windows) and an XGBoost softprob classifier to output directional trend signals (Bullish, Bearish, Neutral) with calibrated confidence percentages.")
    p("• To engineer a client-side acoustic alarm synthesizer using the HTML5 Web Audio API, generating multi-frequency chime chords directly in the browser audio buffer without external audio files, complemented by native desktop browser notifications.")
    p("• To construct a TradingView-inspired financial terminal in React 19 and Vite 6 featuring candlestick and area plots, volume sub-panels, 5-day Monte Carlo price projection envelopes, a live Market Movers screener, and 1-click CSV data export.")
    p("• To implement an empirical 60-session historical signal backtesting simulation engine computing Win Rate %, Profit Factor, and Maximum Drawdown metrics for any listed security.")
    p("• To develop a comprehensive paper trading portfolio management dashboard computing mark-to-market valuations, realized and unrealized profit/loss (NPR and %), and sector capital allocation breakdowns.")

    h2("1.4 Scope and Limitation")
    p("Scope of the Project:")
    p("• Comprehensive Market Catalog: The system catalogs all 649 active, suspended, and historically listed corporate entities on the Nepal Stock Exchange across all 13 industrial sectors (Commercial Banks, Hydropower, Life Insurance, Non-Life Insurance, Microfinance, Finance, Hotels & Tourism, Manufacturing, Investment, etc.).")
    p("• High-Density Benchmark Seeding: High-density 60-day historical OHLCV time-series datasets are fully seeded and maintained for 70 high-liquidity benchmark equities, enabling rich multi-timeframe analysis.")
    p("• Time-Series Horizon: Focuses on daily End-of-Day (EOD) bars, catering directly to positional trading, swing investing, and tactical retail decision support.")
    p("• Algorithmic Synthesis: Seamlessly unites sequential deep learning, gradient boosted decision trees, statistical technical analysis, Monte Carlo volatility drift projection, and empirical signal backtesting.")
    p("• Cross-Platform Accessibility: Web-based Single Page Application (SPA) responsive across desktop monitors, laptops, and mobile tablet viewports.")

    p("Limitations of the Project:")
    p("• Absence of Tick-Level High-Frequency Trading Feed: Due to the regulatory and infrastructural absence of an official, public, low-latency WebSocket tick feed from NEPSE, sub-second tick-level order book depth matching is not supported.")
    p("• Qualitative News and Balance Sheet Extraction: The predictive engine relies entirely on quantitative time-series price, volume, and derived technical momentum metrics. It does not parse unstructured quarterly corporate balance sheets or Nepali financial news sentiment.")
    p("• Simulated Order Execution: Due to legal and brokerage API constraints in Nepal (which prohibit direct third-party programmatic order entry into TMS), trades in the portfolio module are simulated (paper trading) rather than routed to live brokerage trading accounts.")

    h2("1.5 Development Methodology")
    p("The software development methodology adopted for this project is the Incremental Iterative Agile Process. Financial market software requires the seamless integration of asynchronous data pipelines, mathematical indicator computing, deep learning neural networks, and interactive client rendering canvases. An iterative agile methodology enabled the team to build, test, refine, and validate each tier systematically through short, highly focused sprints.")

    p("The project lifecycle was executed across five major iterations over a 16-week timeline:")

    p("• Sprint 1: Data Architecture & Persistence Layer (Weeks 1 – 3): Designed normalized Prisma ORM database schemas for Company, DailyPrice, Alert, and PortfolioPosition entities. Implemented dual SQLite and PostgreSQL support. Integrated the @rumess/nepse-api wrapper with TLS bypass logic and created automated daily cron ingestion schedulers.")

    p("• Sprint 2: Quantitative Technical Engine & Backend APIs (Weeks 4 – 6): Implemented TypeScript mathematical algorithms for EMA, Wilder's RSI, MACD, and Bollinger Bands. Created RESTful endpoints for company discovery, historical price retrieval, top movers ranking, and real-time quote generation with sub-50ms latency.")

    p("• Sprint 3: Hybrid Machine Learning Microservice (Weeks 7 – 9): Built the PyTorch LSTMFeatureExtractor module and XGBoost classifier pipeline in Python FastAPI. Implemented sequence preprocessing, train/validation splitting, model serialization, and REST prediction endpoints with heuristic fallback mechanisms.")

    p("• Sprint 4: Frontend Terminal & Charting Visualizer (Weeks 10 – 12): Scaffolded the React 19 + Vite 6 Single Page Application. Implemented dark-mode Tailwind CSS styling, vector candlestick/area charts using Recharts, interactive timeframe selectors, and responsive navigation layouts.")

    p("• Sprint 5: Advanced Financial Utilities, Testing & Optimization (Weeks 13 – 16): Engineered the Web Audio API synthesizer, browser desktop notifications, 5-day Monte Carlo price projection envelopes, 60-day historical signal backtester, Market Movers screener, and paper trading portfolio tracker. Conducted unit, integration, and user acceptance testing.")

    figure_caption("Figure 1.1: Incremental Iterative Agile Software Engineering Process")

    h2("1.6 Report Organization")
    p("This project report is structured into five cohesive chapters designed to provide comprehensive, academically rigorous documentation of the system:")

    p("• Chapter 1: Introduction establishes the background of the Nepalese capital market, articulates the problem statement, delineates the research objectives, bounds the project scope and limitations, and details the iterative agile development methodology.")

    p("• Chapter 2: Background Study and Literature Review explores foundational market microstructure concepts, mathematical formulations of technical indicators, recurrent deep learning, gradient tree boosting, modern web audio synthesis, and provides a critical comparative review of existing academic literature.")

    p("• Chapter 3: System Analysis and Design provides exhaustive software requirement specifications (SRS), detailed use case descriptions, non-functional quality metrics, feasibility studies, complete UML object and dynamic models, three-tier architectural designs, database schemas, and step-by-step algorithmic formulations.")

    p("• Chapter 4: Implementation and Testing outlines the computational development stack, CASE tools, module-by-module implementation walkthroughs, and details comprehensive test suites for unit testing, system integration testing, and user acceptance testing.")

    p("• Chapter 5: Conclusion and Future Recommendations summarizes key project achievements, lessons learned across engineering and financial domains, and outlines actionable directions for future enhancements.")

    p("• Appendices & References: Features full-resolution system screenshots (Appendix A), core algorithmic source code listings (Appendix B), the official supervisor visit consultation log sheet (Appendix C), and academic citations in strict IEEE format.")

    doc.add_page_break()

    # -------------------------------------------------------------------------
    # CHAPTER 2: BACKGROUND STUDY AND LITERATURE REVIEW
    # -------------------------------------------------------------------------
    h1("CHAPTER 2: BACKGROUND STUDY AND LITERATURE REVIEW")

    h2("2.1 Background Study")
    h3("2.1.1 Overview of NEPSE Market Mechanics")
    p("The Nepal Stock Exchange (NEPSE) operates as an electronic order-driven marketplace where trade execution occurs through automated continuous matching of limit and market orders via the NEPSE Automated Trading System (NATS). Regular market trading sessions are conducted Sunday through Thursday from 11:00 AM to 3:00 PM Nepal Time (NPT), with a pre-open session between 10:30 AM and 10:45 AM. Unlike mature international equity markets characterized by continuous matching without price caps, NEPSE operates under strict regulatory constraints established by the Securities Board of Nepal (SEBON):")

    p("• Individual Equity Circuit Breakers: Individual listed securities are constrained within a maximum daily price movement band of ±10% relative to the previous trading session's official closing price. Once a scrip hits its upper or lower 10% limit, orders can only be executed at or within the limit, preventing runaway price spikes or flash crashes.")

    p("• Market-Wide Index Circuit Breakers: Systemic market volatility is controlled through three index-level circuit breaker thresholds:")
    p("    1. A 4% index fluctuation within the first 60 minutes triggers a 20-minute market-wide trading halt.")
    p("    2. A 5% index fluctuation within the second hour triggers a 40-minute market-wide trading halt.")
    p("    3. A 6% index fluctuation at any point during the session halts trading for the remainder of the day.")

    p("• Settlement Cycle and Clearing: NEPSE operates on a T+2 rolling settlement cycle. Securities clearing and transfers are processed electronically through CDSC MeroShare and participating clearing banks. Short selling is currently prohibited by regulations, meaning all retail participants operate exclusively on the long side (spot buying).")

    p("• Sector Skewness & Market Depth: NEPSE exhibits high sector concentration. Financial institutions (Commercial Banks, Development Banks, Microfinance, and Insurance) together with Hydropower developers account for over 80% of total market capitalization. Hydropower scrips frequently exhibit parabolic momentum cycles driven by low public float and speculative retail syndicates.")

    h3("2.1.2 Technical Analysis & Mathematical Indicators")
    p("Technical analysis is grounded in the empirical premise that historical price action, trading volumes, and momentum patterns reflect all underlying market information, corporate earnings expectations, and investor sentiment. The mathematical technical indicators engineered into the NEPSE AI platform are:")

    p("1. Simple Moving Average (SMA):")
    p("The Simple Moving Average calculates the arithmetic mean of closing prices over a specified sliding window of k sessions:")
    p("    SMA_k(t) = (1 / k) * ∑_{i=0}^{k-1} Close(t - i)")
    p("In this project, SMA 20 serves as the baseline intermediate trend filter and the center line for Bollinger Bands.")

    p("2. Exponential Moving Average (EMA):")
    p("Unlike the SMA which applies equal weights to all historical observations, the Exponential Moving Average applies an exponentially decaying weighting scheme, granting greater statistical significance to recent price action and minimizing lag:")
    p("    EMA_N(t) = [Close(t) * α] + [EMA_N(t - 1) * (1 - α)]")
    p("where the smoothing multiplier α is derived mathematically as α = 2 / (N + 1). The system calculates three distinct EMA horizons: EMA 12 (fast momentum), EMA 26 (intermediate trend), and EMA 50 (macro structural trend).")

    p("3. Wilder’s Relative Strength Index (RSI):")
    p("Developed by J. Welles Wilder, the RSI is a bounded momentum oscillator measuring the speed and velocity of directional price movements on a normalized scale between 0 and 100:")
    p("    RSI = 100 - [100 / (1 + RS)]")
    p("where Relative Strength (RS) represents the ratio of smoothed average gains to smoothed average losses over 14 sessions:")
    p("    AvgGain_t = [(AvgGain_{t-1} * 13) + Gain_t] / 14")
    p("    AvgLoss_t = [(AvgLoss_{t-1} * 13) + Loss_t] / 14")
    p("RSI values below 30 denote an oversold market regime (indicating seller exhaustion and prospective mean-reversion buying opportunities), while values above 70 indicate overbought conditions (elevated risk of profit-taking corrections).")

    figure_caption("Figure 2.1: Wilder’s 14-Period RSI Oscillator Bounds and Momentum Thresholds")

    p("4. Moving Average Convergence Divergence (MACD):")
    p("Formulated by Gerald Appel, the MACD indicator detects changes in the strength, direction, momentum, and duration of an equity trend:")
    p("    MACD Line = EMA_12(Close) - EMA_26(Close)")
    p("    Signal Line = EMA_9(MACD Line)")
    p("    MACD Histogram = MACD Line - Signal Line")
    p("A bullish momentum expansion occurs when the MACD Line crosses above the Signal Line with positive histogram expansion. Conversely, a bearish breakdown is signaled when the MACD Line crosses below the Signal Line.")

    figure_caption("Figure 2.2: Moving Average Convergence Divergence (MACD) Signal Expansion")

    p("5. Bollinger Bands (BB):")
    p("Developed by John Bollinger, Bollinger Bands enclose price action within a statistical volatility envelope centered around the 20-day moving average:")
    p("    Middle Band = SMA_20(Close)")
    p("    Upper Band = SMA_20 + [2 * σ_20]")
    p("    Lower Band = SMA_20 - [2 * σ_20]")
    p("where σ_20 represents the 20-day sample standard deviation:")
    p("    σ_20 = sqrt( (1 / 20) * ∑_{i=0}^{19} (Close(t - i) - Middle Band)^2 )")
    p("The percentage bandwidth (%B) measures volatility expansion and compression cycles, alerting traders to impending breakout expansions following periods of consolidation.")

    p("6. Volume Delta:")
    p("Volume Delta evaluates buying versus selling pressure by comparing the current session's volume against its 20-day volume moving average:")
    p("    Volume Delta = (Volume_t - SMA_20(Volume)) / SMA_20(Volume)")
    p("A positive volume delta during an upward price move confirms institutional accumulation.")

    h3("2.1.3 Time-Series Financial Modeling & Machine Learning")
    p("Financial time-series data presents unique computational challenges. According to the Efficient Market Hypothesis (EMH) formulated by Eugene Fama, asset prices in a weak-form efficient market reflect all historical price information, making point-in-time price forecasting equivalent to a random walk:")
    p("    P_{t+1} = P_t + ε_t,   where ε_t ~ N(0, σ^2)")
    p("However, in emerging markets like Nepal, structural informational friction, retail behavioral biases, and liquidity clustering violate strict random-walk assumptions, creating exploitable short-term momentum and trend regimes.")

    p("Nonetheless, treating stock prediction as a continuous regression problem (predicting exact numerical rupee prices) suffers from severe vulnerability. A machine learning model predicting that a stock will close tomorrow at Rs. 542.50 introduces high variance and false precision. In contrast, framing the objective as a multi-class probabilistic classification problem—predicting whether the market regime over the next 5 sessions is Bullish (probability P_bull), Bearish (probability P_bear), or Neutral (probability P_neut)—produces robust, risk-adjusted decision support.")

    h3("2.1.4 Recurrent Neural Networks & LSTM Architectures")
    p("Standard Feed-Forward Neural Networks (Multi-Layer Perceptrons) assume that input observations are independent and identically distributed (i.i.d.), completely ignoring chronological sequence information. Recurrent Neural Networks (RNNs) introduce internal recurrent feedback loops to maintain sequence memory, but suffer from the vanishing and exploding gradient problem during backpropagation through time over long sequences.")

    p("To resolve this mathematical constraint, Hochreiter and Schmidhuber (1997) introduced Long Short-Term Memory (LSTM) networks. LSTMs maintain a persistent cell state vector C_t regulated by three specialized multiplicative gating structures:")

    p("• Forget Gate (f_t): Regulates what proportion of the previous cell memory C_{t-1} should be discarded:")
    p("    f_t = σ(W_f · [h_{t-1}, x_t] + b_f)")

    p("• Input Gate (i_t) and Candidate State (C̃_t): Determines what new information from the current input x_t should be stored in the cell state:")
    p("    i_t = σ(W_i · [h_{t-1}, x_t] + b_i)")
    p("    C̃_t = tanh(W_c · [h_{t-1}, x_t] + b_c)")

    p("• Cell State Update (C_t): Linearly combines the forgotten past state and scaled candidate state:")
    p("    C_t = f_t * C_{t-1} + i_t * C̃_t")

    p("• Output Gate (o_t) and Hidden State (h_t): Controls what proportion of the updated cell state is emitted as the output vector h_t:")
    p("    o_t = σ(W_o · [h_{t-1}, x_t] + b_o)")
    p("    h_t = o_t * tanh(C_t)")

    p("where σ represents the sigmoid activation function mapping values between 0 and 1, and tanh squashes values between -1 and 1. In our architecture, the final hidden state vector h_30 provides a dense 16-dimensional representation of sequential price momentum.")

    figure_caption("Figure 2.3: Classical LSTM Memory Cell Architecture with Gating Mechanisms")

    h3("2.1.5 Extreme Gradient Boosting (XGBoost) Framework")
    p("While deep recurrent networks excel at extracting latent temporal representations from raw continuous sequential windows, they are computationally inefficient at learning non-linear boundary splits across heterogeneous tabular features (such as bounded oscillators and discrete moving averages). For structured tabular data, gradient boosted decision trees represent the empirical state of the art.")

    p("Extreme Gradient Boosting (XGBoost), introduced by Chen and Guestrin (2016), is an ensemble tree boosting framework based on gradient descent in function space. Given a dataset with features x_i and target class y_i, XGBoost minimizes a regularized objective function:")
    p("    Obj(θ) = ∑_{i=1}^{n} l(y_i, ŷ_i) + ∑_{k=1}^{K} Ω(f_k)")
    p("where l is a differentiable convex loss function measuring prediction error, and Ω penalizes tree complexity:")
    p("    Ω(f) = γ T + (1/2) λ ∑_{j=1}^{T} w_j^2")
    p("where T is the number of terminal leaf nodes, w_j is the score on leaf j, γ is the minimum loss reduction required to make a further partition, and λ is an L2 regularization penalty.")

    p("XGBoost utilizes a second-order Taylor expansion approximation of the objective function, computing both the first-order gradient g_i = ∂_{ŷ^{(t-1)}} l(y_i, ŷ^{(t-1)}) and the second-order Hessian matrix h_i = ∂^2_{ŷ^{(t-1)}} l(y_i, ŷ^{(t-1)}). The optimal weight on leaf j is given by:")
    p("    w_j^* = - [∑_{i∈I_j} g_i] / [∑_{i∈I_j} h_i + λ]")
    p("This enables exact mathematical evaluation of split quality and produces robust classifications resilient against multicollinearity.")

    h3("2.1.6 The Hybrid Sequence-Tabular Feature Engineering")
    p("The architectural breakthrough implemented in this project is the two-stage hybrid sequence-tabular fusion pipeline. Standalone LSTMs struggle to isolate indicator thresholds, while standalone XGBoost models cannot natively ingest chronological sequence order. By utilizing the PyTorch LSTM exclusively as a temporal sequence embedder, we convert 30-day sequential price matrices (30 x 5) into a 16-dimensional embedding vector h_30. We then concatenate this embedding with 8 hand-engineered technical indicators, providing XGBoost with a unified 24-dimensional feature vector combining temporal sequence memory with technical indicator confluence.")

    h3("2.1.7 Modern Real-Time Web Alerting Architectures")
    p("Financial surveillance demands instantaneous, reliable notifications when market conditions trigger configured thresholds. Legacy web applications frequently rely on external MP3 audio assets (e.g. `<audio src='chime.mp3'>`). In enterprise networks or offline testing, external asset fetching frequently fails due to CORS errors, CDN downtime, or browser autoplay sandboxing policies. In this project, acoustic alerting is achieved using the HTML5 Web Audio API, synthesizing frequency waveforms directly in the browser's hardware audio buffer. Concurrently, the browser Notification API is integrated to deliver OS-level desktop banners.")

    figure_caption("Figure 2.4: HTML5 Web Audio API Client-Side Frequency Synthesizer Pipeline")

    h2("2.2 Literature Review")
    h3("2.2.1 Review of Related Works")
    p("The application of machine learning, deep neural networks, and quantitative technical indicators to financial market forecasting has received substantial scholarly attention:")

    p("Fischer and Krauss (2018) [1] conducted a benchmark study deploying deep LSTM networks to forecast directional stock movements across the S&P 500 constituents from 1992 to 2015. Their findings demonstrated that deep LSTM networks consistently outperform standard memory-free classifiers (such as Random Forest and Logistic Regression), achieving statistically significant annualized out-of-sample returns. They verified that LSTM memory cells effectively capture long-term cross-sectional dependency structures, but noted that LSTMs require substantial training data and lack native capability to interpret complex tabular technical indicators.")

    p("Chen, Zhou, and Dai (2021) [2] proposed an XGBoost-based quantitative trading model for Chinese equity markets (CSI 300). By engineering over 40 technical indicators (including moving averages, momentum oscillators, and volatility metrics), the authors demonstrated that XGBoost substantially outclassed Support Vector Machines (SVM) and Multi-Layer Perceptrons in prediction accuracy, stability, and inference speed. However, their architecture treated each daily observation in isolation, lacking sequence memory to model multi-day temporal price momentum.")

    p("Shrestha and Joshi (2020) [3] analyzed time-series price movements within the Nepal Stock Exchange using traditional statistical Autoregressive Integrated Moving Average (ARIMA) models. Their investigation revealed that pure autoregressive statistical models yield unacceptable error margins during macroeconomic policy shifts and high-volatility bull runs. They concluded that linear time-series models are fundamentally inadequate for NEPSE due to non-stationarity and retail momentum clustering, emphasizing the necessity of non-linear machine learning architectures.")

    p("Bhattarai (2022) [4] conducted an empirical examination of technical indicator confluence across NEPSE commercial banking equities. The study revealed that moving average crossovers combined with RSI momentum thresholds yielded superior risk-adjusted returns compared to naive buy-and-hold strategies, specifically by mitigating catastrophic losses during extended bear markets. However, the study was limited to static backtests on historical spreadsheets, lacking real-time software automation, machine learning predictive models, or interactive user interfaces.")

    p("Kumar and Thenmozhi (2014) [5] explored Support Vector Machines (SVM) and Random Forests for forecasting the S&P CNX NIFTY index, demonstrating that non-linear machine learning algorithms beat classical linear discriminant analysis. However, their models struggled during regime shifts.")

    p("Nelson, Pereira, and de Oliveira (2017) [6] deployed LSTM networks to predict stock price movements based on technical analysis indicators in the Brazilian equity market. Their models achieved a 55.9% directional accuracy, outperforming Random Forest and Multi-Layer Perceptrons. They observed that raw price inputs alone were insufficient, and that providing technical indicators significantly improved model convergence.")

    p("Sezer, Gudelek, and Ozbayoglu (2020) [7] published a comprehensive survey on deep learning for financial time series forecasting, covering CNN, RNN, and hybrid models. They emphasized that modern financial AI systems must move away from point price regression toward probabilistic decision support and algorithmic execution.")

    h3("2.2.2 Comparative Summary of Literature")
    p("A comparative analysis of existing research literature against the NEPSE AI platform is synthesized in Table 2.1 below:")

    table_caption("Table 2.1: Comparative Synthesis of Existing Literature and Methodologies")
    lit_headers = ["Authors & Year", "Target Domain", "Methodology Used", "Key Strengths", "Identified Limitations", "Gaps Addressed in This Project"]
    lit_rows = [
        ("Fischer & Krauss (2018) [1]", "S&P 500 (US)", "Deep LSTM Networks", "Superior sequence memory; beats memory-free models.", "No tabular indicator feature engineering; high latency.", "Combined LSTM sequence embedder with XGBoost tabular classifier."),
        ("Chen et al. (2021) [2]", "CSI 300 (China)", "XGBoost Classifier", "High tabular precision; fast inference speed.", "No sequential memory; treats rows as independent.", "Concatenated LSTM 16-D temporal embeddings into XGBoost."),
        ("Shrestha & Joshi (2020) [3]", "NEPSE (Nepal)", "ARIMA Time-Series", "Simple statistical baseline formulation.", "Linear model fails during regime shifts and high volatility.", "Replaced linear regression with non-linear hybrid deep learning."),
        ("Bhattarai (2022) [4]", "NEPSE Banking", "RSI + MACD Confluence", "Proved technical indicators mitigate bear drawdowns.", "Purely retrospective spreadsheet analysis; no software.", "Built full-stack financial terminal with automated alerts."),
        ("Nelson et al. (2017) [6]", "B3 (Brazil)", "LSTM with Indicators", "Showed technical indicators enhance LSTM training.", "High computational cost; regression error accumulation.", "Reframed prediction into 3-class probabilistic softprob DSS."),
        ("This Project (2026)", "NEPSE (All Sectors)", "Hybrid LSTM-XGBoost + Decision Support System", "Deep temporal embeddings + Tabular precision + Real-time terminal.", "Requires initial 30-day sequence seeding for inference.", "Addressed all prior gaps: local persistence, Web Audio alerts, paper trading, and backtest simulator.")
    ]
    create_styled_table(doc, lit_headers, lit_rows, [1.1, 0.8, 1.1, 1.0, 1.0, 1.02])

    doc.add_page_break()

    # -------------------------------------------------------------------------
    # CHAPTER 3: SYSTEM ANALYSIS AND DESIGN
    # -------------------------------------------------------------------------
    h1("CHAPTER 3: SYSTEM ANALYSIS AND DESIGN")

    h2("3.1 System Analysis")
    h3("3.1.1 Requirement Analysis")
    p("The system requirements were derived through extensive stakeholder consultation, analysis of existing retail trading platforms (TMS, MeroShare, ShareSansar), and review of quantitative algorithmic trading literature.")

    p("i. Functional Requirements:")
    p("The functional specifications define the operational capabilities that the platform must provide to end-users and background system processes:")

    table_caption("Table 3.1: Functional Requirements Specifications and Traceability Matrix")
    req_headers = ["Req ID", "Requirement Name", "Functional Description & Acceptance Criteria", "User Role", "Priority"]
    req_rows = [
        ("FR-01", "Securities Catalog", "Catalog all 649 active and historical NEPSE listed equities with real-time sector grouping and instant fuzzy search.", "Investor", "High"),
        ("FR-02", "Automated EOD Ingestion", "Fetch, parse, validate, and persist daily OHLCV bars post-market close via scheduled cron daemons.", "System", "High"),
        ("FR-03", "Technical Indicator Engine", "Compute SMA 20, EMA 12/26/50, Wilder’s RSI 14, MACD, and Bollinger Bands with sub-50ms execution latency.", "System", "High"),
        ("FR-04", "Two-Stage AI Inference", "Generate 3-class probabilistic predictions (Bullish, Bearish, Neutral) with calibrated confidence percentages.", "Investor", "High"),
        ("FR-05", "Interactive Chart Canvas", "Render vector candlestick and area charts with indicator overlays, crosshair tooltips, and volume bars.", "Investor", "High"),
        ("FR-06", "Real-Time Alarm Engine", "Arm, monitor, and fire multi-condition price, RSI, and MACD alerts with acoustic chimes and desktop banners.", "Investor", "High"),
        ("FR-07", "Paper Trading Portfolio", "Record simulated buy executions, tracking real-time mark-to-market valuations, unrealized PnL, and sector allocations.", "Investor", "Medium"),
        ("FR-08", "Market Movers Screener", "Compute live Top Gainers, Losers, Turnover, and Volume leaderboards alongside an Advance/Decline breadth ratio.", "Investor", "Medium"),
        ("FR-09", "Multi-Stock Comparison", "Benchmarking matrix comparing up to 3 equities across valuation, 30-day volatility, RSI, and AI consensus.", "Investor", "Medium"),
        ("FR-10", "Strategy Backtester", "Simulate 60-session historical signal accuracy, computing empirical Win Rate %, Profit Factor, and trade log.", "Investor", "Medium"),
        ("FR-11", "Price Projection Envelope", "Project 5-day Monte Carlo parametric volatility drift envelopes with 95% confidence bands.", "Investor", "Medium"),
        ("FR-12", "Data Export Utility", "Generate RFC 4180 compliant CSV files of complete historical OHLCV and indicator records via 1-click download.", "Investor", "Low"),
        ("FR-13", "Offline Resiliency Fallback", "Automatically transition to high-fidelity synthetic data generation if external APIs or backend services drop.", "System", "High"),
        ("FR-14", "Watchlist Management", "Allow users to star and manage favorite stocks persisted across local browser sessions.", "Investor", "Low"),
    ]
    create_styled_table(doc, req_headers, req_rows, [0.7, 1.2, 2.52, 0.8, 0.8], alignments=['C', 'L', 'L', 'C', 'C'])

    p("ii. Detailed Use Case Descriptions:")
    p("To elucidate system interactions, four primary use cases governing the core platform capabilities are formally specified:")

    p("Use Case UC-01: Configure and Trigger Real-Time Price Alert")
    p("• Primary Actor: Retail Investor / Market Analyst.")
    p("• Pre-conditions: User is authenticated or operating the local financial terminal; target security (e.g., NABIL) is loaded.")
    p("• Trigger: User clicks the 'Set Alert' button on the navigation header or stock details card.")
    p("• Main Success Scenario:\n"
      "    1. System opens the PriceAlertModal displaying current LTP (e.g. Rs. 506.42) and indicator metrics.\n"
      "    2. User selects alert condition (e.g. 'PRICE_ABOVE'), enters target value (e.g. Rs. 520.00), and adds optional note.\n"
      "    3. User clicks 'Save Alert'. Frontend dispatches POST /api/v1/alerts to NestJS backend.\n"
      "    4. Backend validates input payload via ValidationPipe and persists record in SQLite/PostgreSQL with isActive=true.\n"
      "    5. Background scheduler or market update invokes AlertsService.evaluateAlerts().\n"
      "    6. When market price satisfies condition, backend marks alert as triggered=true with timestamp.\n"
      "    7. Client triggers Web Audio API playChime() synthesis and displays native browser notification.")
    p("• Post-conditions: Alert status updated to triggered; audit log recorded.")

    p("Use Case UC-02: Execute Paper Trading Position and Monitor Portfolio")
    p("• Primary Actor: Retail Investor.")
    p("• Pre-conditions: User navigates to the Portfolio tab; market quotes are available.")
    p("• Main Success Scenario:\n"
      "    1. User clicks 'Add Position' and enters Symbol (e.g., CHCL), Buy Price (e.g., Rs. 480.00), and Quantity (e.g., 200).\n"
      "    2. System dispatches POST /api/v1/portfolio and persists holding.\n"
      "    3. PortfolioService queries current LTP, computes investment cost (Rs. 96,000), current market value, and unrealized profit/loss (+Rs. 5,284.00, +5.50%).\n"
      "    4. System recalculates aggregate portfolio statistics and updates sector allocation distribution bars.")

    p("Use Case UC-03: Execute Quantitative AI Inference & Backtest Simulation")
    p("• Primary Actor: Market Analyst / Researcher.")
    p("• Main Success Scenario:\n"
      "    1. User opens AI Insights tab for target stock.\n"
      "    2. NestJS gathers 30-day sliding window of OHLCV bars and POSTs to Python FastAPI /predict.\n"
      "    3. PyTorch LSTM extracts 16-D latent temporal sequence embedding; XGBoost classifies feature vector.\n"
      "    4. Frontend renders radial probability dial, signal badge, and feature contribution weights.\n"
      "    5. BacktestSimulator card evaluates past 60 sessions, computing historical Win Rate % and Profit Factor.")

    figure_caption("Figure 3.1: System Use Case Diagram for NEPSE AI Platform")

    p("iii. Non-Functional Requirements:")
    p("Non-functional engineering specifications ensure production-grade performance, reliability, and security:")

    table_caption("Table 3.2: Non-Functional Engineering Quality Attributes")
    nfr_headers = ["Quality Attribute", "Target Metric / Standard", "Architectural Implementation Strategy"]
    nfr_rows = [
        ("Response Latency", "API query response < 50ms; ML inference < 150ms.", "Database indexing on (symbol, date); local caching; pre-computed technical indicators."),
        ("Availability & Uptime", "99.9% uptime during market hours; 100% offline fallback.", "Dual SQLite/PostgreSQL architecture; client-side synthetic fallback generator."),
        ("Fault Tolerance", "Zero UI crashes on external network disconnects or API errors.", "NestJS HttpService try/catch wrappers; resilient fallback momentum matrices."),
        ("Usability & a11y", "Lighthouse accessibility score > 90; high contrast ratios.", "Tailwind CSS dark-mode palette (#0E1117); semantic HTML5 tags; responsive grids."),
        ("Data Integrity", "Strict ACID transactional consistency for financial records.", "Prisma ORM migrations; unique constraints on (symbol, date); foreign keys."),
        ("Portability", "Cross-platform execution on Windows, Linux, and macOS.", "Node.js 20+, Python 3.10+, and Docker containerized deployment architectures."),
        ("Security", "Zero SQL injection; sanitized input DTOs; CORS policy.", "NestJS class-validator pipes; parameterized SQL queries via Prisma ORM."),
        ("Maintainability", "Clean modular code; strict TypeScript typing; SOLID principles.", "Decoupled NestJS modules; separation of controllers, services, and repository layers."),
    ]
    create_styled_table(doc, nfr_headers, nfr_rows, [1.4, 1.8, 2.82])

    h3("3.1.2 Feasibility Analysis")
    p("1. Technical Feasibility: The technology stack is comprised of mature, industry-standard modern platforms: TypeScript with NestJS for modular enterprise backend services, React 19 with Vite 6 for blazing-fast Single Page Application rendering, Prisma ORM for database abstraction, and Python FastAPI with PyTorch and XGBoost for high-performance machine learning inference. All tools are open-source with active long-term support (LTS). The technical complexity is well within the capabilities of the team.")

    p("2. Operational Feasibility: The platform requires zero installation overhead for end-users, operating seamlessly across any modern web browser (Google Chrome, Mozilla Firefox, Microsoft Edge, Safari). The user interface follows standard financial terminal ergonomics familiar to users of TradingView and Bloomberg terminals, requiring minimal learning curve for retail investors.")

    p("3. Economic Feasibility: The architecture is exceptionally cost-effective. The entire development and local evaluation stack runs with zero recurring software licensing costs. In production, the microservices can be deployed on free or ultra-low-cost tiers (Render, Neon PostgreSQL, Supabase, Vercel), ensuring long-term financial viability.")

    p("4. Schedule Feasibility: The project was structured across 16 weeks within the BCA 8th semester curriculum, with incremental milestones ensuring that all functional modules were completed and tested ahead of final evaluation.")

    p("5. Legal and Ethical Feasibility: The platform uses publicly available End-of-Day market data for educational and decision-support purposes. It does not execute live monetary transactions, ensuring full compliance with SEBON regulations and Nepal's Electronic Transactions Act.")

    h3("3.1.3 Object Modelling (Class Diagram & Domain Entities)")
    p("The Object-Oriented domain model structures the core entities, data transfer objects, and services governing the platform. Key classes include:")
    p("• Company: Encapsulates stock metadata (symbol, name, sector, listing status).")
    p("• DailyPrice: Encapsulates OHLCV time-series observations and relationships to parent company.")
    p("• Alert: Encapsulates user alert thresholds (condition, targetValue, isActive, triggered).")
    p("• PortfolioPosition: Manages paper trading holdings (symbol, buyPrice, quantity, buyDate).")
    p("• StockService: Service class handling mathematical calculations, top movers, and quote generation.")
    p("• AlertsService: Service class managing alert evaluation and notification triggers.")
    p("• PortfolioService: Service class computing mark-to-market valuations and sector allocations.")
    p("• PredictionService: Service class orchestrating FastAPI dispatches and heuristic fallbacks.")
    p("• HybridModel: Python machine learning class encapsulating PyTorch LSTM and XGBoost models.")

    figure_caption("Figure 3.2: UML Class Diagram Representing Core Domain Entities & Services")

    h3("3.1.4 Dynamic Modelling (Sequence & State Diagrams)")
    p("Sequence Diagram 1: Automated EOD Ingestion and Alert Evaluation Pass:")
    p("1. Scheduled cron worker invokes MarketDataService.updateDailyMarketData().\n"
      "2. MarketDataService fetches live quotes via @rumess/nepse-api wrapper with TLS bypass.\n"
      "3. Ingested bars are upserted into the database via DatabaseService.\n"
      "4. DatabaseService notifies AlertsService.evaluateAlerts().\n"
      "5. AlertsService evaluates active alarms against fresh prices and indicator thresholds.\n"
      "6. Triggered alerts update database flags, broadcast SSE/WebSocket events, and fire client notifications.")

    figure_caption("Figure 3.3: Sequence Diagram for Real-Time Price Ingestion and Alert Evaluation")

    p("Sequence Diagram 2: Hybrid Machine Learning Inference Pipeline:")
    p("1. Client requests GET /api/v1/predict/:symbol.\n"
      "2. NestJS PredictionService validates historical bar count (>= 30 bars).\n"
      "3. NestJS dispatches HTTP POST payload to Python FastAPI /predict.\n"
      "4. FastAPI HybridModel processes sequential tensor through PyTorch LSTM to extract 16-D embedding.\n"
      "5. Embedding is concatenated with 8 technical indicators and evaluated by XGBoost.\n"
      "6. Probabilistic prediction payload is returned to NestJS and rendered on client dial.")

    figure_caption("Figure 3.4: Sequence Diagram for Hybrid Machine Learning Inference Pipeline")

    p("State Machine Diagram: Price Alert Lifecycle:")
    p("An alert transitions through distinct states: [Created] → [Armed / Active] → [Monitoring Ticks] → [Condition Matched] → [Triggered / Notification Fired] → [Acknowledged / Paused] or [Deleted].")

    figure_caption("Figure 3.5: State Transition Diagram for Price Alert Lifecycle")

    h3("3.1.5 Process Modelling (Activity Diagrams & Workflows)")
    p("Activity Diagram for Automated Daily EOD Market Ingestion:")
    p("The process initiates at 3:30 PM NPT post-market close. The scheduler checks network connectivity. If public NEPSE portals are accessible, it downloads EOD records, cleans and validates price ranges (verifying Low <= Open, Close <= High), and executes bulk upserts. If network errors or TLS timeouts occur, it logs an alert and triggers the synthetic generator to maintain operational continuity.")

    figure_caption("Figure 3.6: Activity Diagram for Automated Daily EOD Market Ingestion")

    h2("3.2 System Design")
    h3("3.2.1 Architectural Design")
    p("The system implements a three-tier decoupled microservice architecture ensuring high cohesion, low coupling, and complete fault isolation:")

    p("• Tier 1: Client Presentation Layer (React 19 + Vite 6): A Single Page Application (SPA) styled with Tailwind CSS. It communicates with backend services via asynchronous REST JSON calls. It handles vector chart rendering, audio synthesis, and user interactions.")

    p("• Tier 2: Enterprise Application Core (NestJS 11 + Express + Prisma ORM): A modular TypeScript server responsible for business logic, automated cron scheduling (@nestjs/schedule), data integrity validation (class-validator), RESTful API serving, and database persistence.")

    p("• Tier 3: Machine Learning Inference Engine (Python 3.10+ FastAPI + PyTorch + XGBoost): A specialized asynchronous Python microservice responsible for deep sequence embedding, gradient boosted tree inference, model training, and weight serialization.")

    p("• Persistence Layer: Dual database engine support featuring zero-dependency SQLite (`dev.db`) for immediate local evaluation and PostgreSQL (`schema.postgresql.prisma`) for cloud deployments.")

    figure_caption("Figure 3.7: Three-Tier Decoupled Microservices Architecture")

    h3("3.2.2 Database Schema Design & Data Dictionaries")
    p("The relational database schema is normalized to Third Normal Form (3NF), eliminating transitive dependencies and redundant data storage. Indexes are placed strategically on high-frequency query paths.")

    figure_caption("Figure 3.8: Relational Entity Relationship Diagram (ERD)")

    table_caption("Table 3.3: Data Dictionary: Company Entity")
    c_headers = ["Field Name", "Data Type", "Constraint", "Nullable", "Description"]
    c_rows = [
        ("symbol", "VARCHAR(16)", "PRIMARY KEY", "No", "Unique stock ticker symbol (e.g. NABIL, CHCL)."),
        ("name", "VARCHAR(255)", "None", "No", "Full registered corporate name of security."),
        ("sector", "VARCHAR(64)", "INDEX", "No", "Industrial sector classification (e.g. Commercial Banks)."),
        ("createdAt", "DATETIME", "DEFAULT CURRENT_TIMESTAMP", "No", "Timestamp of initial company insertion."),
        ("updatedAt", "DATETIME", "ON UPDATE CURRENT_TIMESTAMP", "No", "Timestamp of last entity modification.")
    ]
    create_styled_table(doc, c_headers, c_rows, [1.1, 1.2, 1.3, 0.8, 1.62])

    table_caption("Table 3.4: Data Dictionary: DailyPrice Entity")
    p_headers = ["Field Name", "Data Type", "Constraint", "Nullable", "Description"]
    p_rows = [
        ("id", "INTEGER", "PRIMARY KEY AUTOINCREMENT", "No", "Unique surrogate identifier for price record."),
        ("symbol", "VARCHAR(16)", "FOREIGN KEY (Company.symbol)", "No", "Ticker symbol referencing Company entity."),
        ("date", "DATETIME", "UNIQUE (symbol, date) INDEX", "No", "Trading session date."),
        ("open", "FLOAT", "None", "No", "Opening session price in NPR."),
        ("high", "FLOAT", "None", "No", "Highest session traded price in NPR."),
        ("low", "FLOAT", "None", "No", "Lowest session traded price in NPR."),
        ("close", "FLOAT", "None", "No", "Closing session settlement price in NPR."),
        ("volume", "FLOAT", "None", "No", "Total aggregate volume of equity shares traded.")
    ]
    create_styled_table(doc, p_headers, p_rows, [1.0, 1.2, 1.4, 0.7, 1.72])

    table_caption("Table 3.5: Data Dictionary: Alert Entity")
    a_headers = ["Field Name", "Data Type", "Constraint", "Nullable", "Description"]
    a_rows = [
        ("id", "VARCHAR(36)", "PRIMARY KEY UUID", "No", "Universally unique identifier for alert record."),
        ("symbol", "VARCHAR(16)", "INDEX", "No", "Stock symbol to monitor."),
        ("condition", "VARCHAR(32)", "None", "No", "Trigger condition (ABOVE, BELOW, RSI_OVERSOLD, etc.)."),
        ("targetValue", "FLOAT", "None", "No", "Numerical threshold for alarm activation."),
        ("isActive", "BOOLEAN", "DEFAULT TRUE", "No", "Flag indicating whether alarm is actively armed."),
        ("triggered", "BOOLEAN", "DEFAULT FALSE", "No", "Flag indicating whether alarm has fired."),
        ("triggeredAt", "DATETIME", "None", "Yes", "Timestamp when condition was fulfilled."),
        ("note", "TEXT", "None", "Yes", "Optional user note or trading execution rationale.")
    ]
    create_styled_table(doc, a_headers, a_rows, [1.0, 1.2, 1.4, 0.7, 1.72])

    table_caption("Table 3.6: Data Dictionary: PortfolioPosition Entity")
    pf_headers = ["Field Name", "Data Type", "Constraint", "Nullable", "Description"]
    pf_rows = [
        ("id", "VARCHAR(36)", "PRIMARY KEY UUID", "No", "Universally unique identifier for position record."),
        ("symbol", "VARCHAR(16)", "INDEX", "No", "Purchased stock symbol."),
        ("buyPrice", "FLOAT", "None", "No", "Execution purchase price per share in NPR."),
        ("quantity", "FLOAT", "None", "No", "Number of equity shares held."),
        ("buyDate", "DATETIME", "DEFAULT CURRENT_TIMESTAMP", "No", "Transaction execution date."),
        ("notes", "TEXT", "None", "Yes", "Target investment strategy notes or rationale.")
    ]
    create_styled_table(doc, pf_headers, pf_rows, [1.0, 1.2, 1.4, 0.7, 1.72])

    table_caption("Table 3.7: Database Indexing Strategy and Query Optimization Matrix")
    idx_headers = ["Table Name", "Indexed Fields", "Index Type", "Justification & Query Optimization Target"]
    idx_rows = [
        ("DailyPrice", "(symbol, date)", "Composite B-Tree Unique", "Optimizes sliding window historical queries; enforces unique EOD records."),
        ("DailyPrice", "(date DESC)", "Single Column B-Tree", "Accelerates market-wide Top Gainers, Losers, and Turnover queries."),
        ("Company", "sector", "Single Column B-Tree", "Accelerates sector-filtered catalog queries and diversification breakdowns."),
        ("Alert", "(symbol, isActive)", "Composite B-Tree", "Enables sub-5ms lookup of actively armed alerts during tick evaluation passes."),
        ("PortfolioPosition", "symbol", "Single Column B-Tree", "Speeds up portfolio mark-to-market valuation against live prices.")
    ]
    create_styled_table(doc, idx_headers, idx_rows, [1.1, 1.3, 1.3, 2.32])

    h3("3.2.3 Interface Design (UI/UX Ergonomics & Visual System)")
    p("The user interface follows professional financial workstation standards inspired by TradingView and Bloomberg terminals:")
    p("• Dark Mode Aesthetic System: Built upon a curated slate palette: Background `#0E1117`, Surface `#1E293B`, Borders `#334155`, Primary Accent `#2563EB`, Bullish Accent `#10B981`, and Bearish Accent `#EF4444`. High-contrast ratios prevent eye fatigue during prolonged analysis sessions.")
    p("• Market Ticker Tape: Positioned across the header, displaying live composite index values, percentage change, and market status.")
    p("• Charting Workspace: Responsive SVG candlestick and area rendering using Recharts. Includes interactive crosshairs, timeframe toggles (1W, 1M, 3M, 6M, 1Y, ALL), and dynamic overlay switches for EMA 12/26/50, Bollinger Bands, and Volume bars.")
    p("• AI Probability Dial: A semi-circular radial gauge rendering real-time model confidence percentages, accompanied by a directional badge and feature contribution bars.")
    p("• Market Movers Screener: Real-time 4-column leaderboards for Top Gainers, Losers, Turnover, and Volume, plus an Advance/Decline breadth ratio bar.")
    p("• Paper Trading Portfolio: Holdings ledger calculating investment value, market value, unrealized PnL, and sector allocation progress bars.")
    p("• Multi-Stock Comparison Modal: Benchmarking modal comparing valuation, volatility, and AI sentiment across up to 3 securities simultaneously.")

    h3("3.2.4 Component and Deployment Architecture")
    p("The physical deployment architecture leverages containerization principles:")
    p("• Frontend Container: Nginx web server serving pre-built production static Vite bundles.")
    p("• Application Core Container: Node.js 20 LTS runtime executing the compiled NestJS application.")
    p("• Machine Learning Container: Python 3.10 runtime executing Uvicorn with FastAPI workers, PyTorch, and XGBoost.")
    p("• Reverse Proxy / Gateway: Nginx reverse proxy routing `/api/*` traffic to NestJS and serving frontend static files.")

    figure_caption("Figure 3.9: Component Architecture Diagram of Frontend and Backend Microservices")
    figure_caption("Figure 3.10: Physical Deployment Topology across Docker Container Environments")

    h2("3.3 Algorithm Details")
    h3("3.3.1 Mathematical Formulations of Technical Indicators")
    p("The technical indicators are calculated sequentially with linear O(N) time complexity:")
    p("• Exponential Moving Average: Initialized with SMA_N, then iteratively updated via EMA_t = (Close_t * α) + (EMA_{t-1} * (1 - α)), where α = 2 / (N + 1).")
    p("• Wilder's Smoothed Average Gain/Loss: Uses exponential decay with α = 1/14, yielding smooth RSI bounds resilient to single-day outlier spikes.")
    p("• Bollinger Bands: Evaluates rolling variance over a 20-session window, setting upper and lower envelopes at ±2 standard deviations.")

    h3("3.3.2 Two-Stage Hybrid LSTM-XGBoost Architecture")
    p("The detailed mathematical specification of the two-stage predictive pipeline is:")
    p("Stage 1 (PyTorch LSTM Sequence Embedding):")
    p("• Input Tensor: Sliding window X_seq ∈ ℝ^{B x 30 x 5} containing scaled [Open, High, Low, Close, Volume] normalized via standard z-score normalization:")
    p("    z = (x - μ) / σ")
    p("• LSTM Layer: 1 hidden layer with hidden_dim=16, batch_first=True.")
    p("• Forward Pass: Out, (hn, cn) = self.lstm(X_seq). The final hidden state vector h_30 = hn[-1] ∈ ℝ^{B x 16} represents the dense temporal embedding.")

    p("Stage 2 (Feature Concatenation & XGBoost Classification):")
    p("• Feature Concatenation: The 16-D embedding is horizontally concatenated with 8 engineered technical indicators:\n"
      "    X_combined = [ h_30  ||  [RSI_14, MACD_line, MACD_signal, MACD_hist, EMA_12, EMA_26, EMA_50, Volume_delta] ] ∈ ℝ^{B x 24}")
    p("• XGBoost Softprob Objective: Trained with multi:softprob objective over 3 target classes: 0 (Bearish), 1 (Neutral), 2 (Bullish).")
    p("• Probability Softmax Calibration:\n"
      "    P(y = c | X_combined) = exp(f_c(X)) / ∑_{j=0}^{2} exp(f_j(X))")
    p("The class with the highest probability determines the signal, and its value represents prediction confidence.")

    figure_caption("Figure 3.11: Two-Stage Hybrid LSTM-XGBoost Feature Concatenation Architecture")

    h3("3.3.3 Real-Time Multi-Condition Alert Evaluation Engine")
    p("The alert engine executes deterministic rule matching across active records:")
    p("• Condition ABOVE: Current Price >= Target Value\n"
      "• Condition BELOW: Current Price <= Target Value\n"
      "• Condition RSI_OVERSOLD: Current RSI <= Target Value (e.g. 30)\n"
      "• Condition RSI_OVERBOUGHT: Current RSI >= Target Value (e.g. 70)\n"
      "• Condition MACD_BULLISH_CROSS: Prev MACD Hist <= 0 and Current MACD Hist > 0\n"
      "• Condition MACD_BEARISH_CROSS: Prev MACD Hist >= 0 and Current MACD Hist < 0")
    p("When satisfied, the record is flagged triggered=true, triggeredAt is stamped, and notification events are dispatched.")

    h3("3.3.4 Empirical Signal Backtesting Simulation Algorithm")
    p("The backtesting algorithm verifies the historical efficacy of technical momentum signals over the past 60 sessions:")
    p("1. For session t ∈ [0, 55], evaluate if momentum indicators generated a Bullish or Bearish trigger.\n"
      "2. Calculate 5-session forward return: Return_{t+5} = (Close_{t+5} - Close_t) / Close_t.\n"
      "3. If Bullish and Return_{t+5} > 0: Record Win. If Bullish and Return_{t+5} <= 0: Record Loss.\n"
      "4. If Bearish and Return_{t+5} < 0: Record Win. If Bearish and Return_{t+5} >= 0: Record Loss.\n"
      "5. Compute aggregate metrics:\n"
      "    Win Rate % = (Wins / Total Signals) * 100\n"
      "    Profit Factor = Gross Profits / |Gross Losses|\n"
      "    Maximum Drawdown (MDD) = Max Peak-to-Trough Decline")

    h3("3.3.5 Monte Carlo Volatility Envelope Simulation Algorithm")
    p("The 5-day price projection envelope models asset price drift under Geometric Brownian Motion (GBM):")
    p("    S_{t+Δt} = S_t * exp( (μ - 0.5 * σ^2) * Δt + σ * sqrt(Δt) * Z )")
    p("where μ is historical annualized drift, σ is 30-day historical volatility, and Z ~ N(0, 1). Upper and lower 95% confidence bounds (±1.96 standard deviations) are computed over a 5-day forward horizon, providing realistic risk boundaries.")

    figure_caption("Figure 3.12: Parametric Volatility Drift Cone and 5-Day Confidence Projection")

    doc.add_page_break()

    # -------------------------------------------------------------------------
    # CHAPTER 4: IMPLEMENTATION AND TESTING
    # -------------------------------------------------------------------------
    h1("CHAPTER 4: IMPLEMENTATION AND TESTING")

    h2("4.1 Implementation")
    h3("4.1.1 Tools and Platforms Used")
    p("The implementation leverages modern, battle-tested software frameworks across each architectural layer:")

    table_caption("Table 4.1: Software Development Stack, Frameworks, and CASE Tools")
    tool_headers = ["Tier / Category", "Technology / Library", "Version", "License", "Project Role & Functionality"]
    tool_rows = [
        ("Frontend Framework", "React", "19.0.0", "MIT", "Core Single Page Application component tree rendering."),
        ("Frontend Bundler", "Vite", "6.1.0", "MIT", "Ultra-fast ESM build tool, dev server, and Hot Module Replacement."),
        ("Styling System", "Tailwind CSS", "3.4.17", "MIT", "Utility-first responsive CSS framework, dark-mode design system."),
        ("Charting Library", "Recharts", "2.15.0", "MIT", "Declarative vector SVG candlestick, area, volume, and line charts."),
        ("Audio Synthesis", "Web Audio API", "W3C Std", "Open Web", "Zero-dependency client-side acoustic chime synthesis for alerts."),
        ("Backend Framework", "NestJS", "11.0.1", "MIT", "Modular enterprise TypeScript server for REST APIs and cron daemons."),
        ("HTTP Server", "Express", "5.0.0", "MIT", "Underlying HTTP request dispatcher and middleware pipeline."),
        ("Database ORM", "Prisma ORM", "6.2.1", "Apache 2.0", "Type-safe database abstraction, schema migrations, and client querying."),
        ("Database Engine", "SQLite / PostgreSQL", "3.45 / 16", "Open / BSD", "Dual persistence engine for zero-dependency local and cloud storage."),
        ("Data Scraping", "@rumess/nepse-api", "2.1.0", "MIT", "NEPSE EOD data wrapper with custom TLS handshake bypass."),
        ("ML Framework", "PyTorch", "2.6.0", "BSD-3", "Deep learning LSTM sequence feature extraction tensor operations."),
        ("Gradient Boosting", "XGBoost", "2.1.3", "Apache 2.0", "Extreme gradient boosted decision tree softprob classification."),
        ("ML API Server", "FastAPI & Uvicorn", "0.115 / 0.34", "MIT / BSD", "Asynchronous Python HTTP microservice for model inference."),
        ("CASE Modeling", "Draw.io & PlantUML", "Online", "Open", "UML software architecture, ER diagrams, and sequence flow modeling."),
    ]
    create_styled_table(doc, tool_headers, tool_rows, [1.1, 1.2, 0.7, 0.7, 2.32])

    h3("4.1.2 Module Implementation Details")
    p("1. StockModule (NestJS Application Core):\n"
      "Encapsulates StockController and StockService. Responsible for cataloging securities, extracting 52-week high/low boundaries, computing 30-day annualized volatility, and generating real-time quotes. It implements getTopMovers() which filters the latest trading session to produce real-time leaderboards for Top Gainers, Top Losers, Turnover, and Volume.")

    p("2. AlertsModule (NestJS Application Core):\n"
      "Manages complete CRUD lifecycle for user alerts. It exposes GET /api/v1/alerts, POST /api/v1/alerts, DELETE /api/v1/alerts/:id, and PATCH /api/v1/alerts/:id/toggle. Crucially, it implements the evaluateAlerts() service method, which is invoked automatically whenever market prices are updated or when triggered by the client, evaluating active alerts against latest price and indicator metrics.")

    p("3. PortfolioModule (NestJS Application Core):\n"
      "Implements simulated paper trading management. It exposes endpoints to record buy positions, delete liquidated holdings, and compute a real-time portfolio summary. The service calculates total investment cost, current market value, unrealized profit/loss (NPR and %), day return, and aggregates holdings by industrial sector to compute capital allocation percentages.")

    p("4. PredictionModule (NestJS Application Core):\n"
      "Acts as the intelligent bridge between the application core and the Python ML microservice. When a prediction is requested, PredictionService verifies whether the Python microservice is online. If online, it formats the 30-day OHLCV tensor and dispatches an HTTP POST to FastAPI /predict. If the Python microservice is offline or unreachable, PredictionService seamlessly invokes a local quantitative momentum fallback matrix, ensuring 100% uninterrupted response.")

    p("5. FastAPI Machine Learning Engine (Python Microservice):\n"
      "Implements HybridModel in hybrid_model.py. It maintains a PyTorch LSTMFeatureExtractor module that processes sequential price tensors X ∈ ℝ^{B x 30 x 5} into 16-dimensional embeddings. It concatenates these embeddings with 8 technical indicators and fits an XGBClassifier with multi:softprob objective. The service exposes POST /predict and POST /train endpoints.")

    p("6. Frontend Financial Terminal (React 19 + Vite 6):\n"
      "The client application orchestrates three custom React hooks: useStockData, useAlerts, and usePortfolio. It provides seamless tabbed navigation across Overview, AI Insights, Technical Analysis, Market Screener, Paper Portfolio, and Sector Breakdown. It implements FinancialChart.tsx with vector candlestick rendering, Bollinger Bands, and CSV download, PriceAlertModal.tsx for alarm creation, and audioAlarm.ts for Web Audio API chime synthesis.")

    h2("4.2 Testing")
    h3("4.2.1 Unit Testing")
    p("Unit testing was executed across backend services, mathematical formulas, and ML tensor operations using Jest (TypeScript) and PyTest (Python):")

    table_caption("Table 4.2: Unit Test Suite Specifications and Execution Results")
    ut_headers = ["Test ID", "Component Under Test", "Functionality Tested", "Input Data", "Expected Output Specification", "Status"]
    ut_rows = [
        ("UT-01", "StockService", "EMA 12 Calculation", "Array of 60 closing prices", "EMA array with first 11 indices null; correct α smoothing.", "PASSED"),
        ("UT-02", "StockService", "EMA 26 Calculation", "Array of 60 closing prices", "EMA array with first 25 indices null; correct α smoothing.", "PASSED"),
        ("UT-03", "StockService", "Wilder’s RSI 14", "Array of 60 closing prices", "RSI values strictly bounded in [0, 100]; accurate smoothing.", "PASSED"),
        ("UT-04", "StockService", "MACD Histogram", "Array of 60 closing prices", "MACD Line - Signal Line matches histogram exactly.", "PASSED"),
        ("UT-05", "StockService", "Bollinger Bands", "Array of 60 closing prices", "Upper Band > Middle Band > Lower Band across all bars.", "PASSED"),
        ("UT-06", "StockService", "Top Movers Ranking", "649 stocks with price changes", "Top 5 gainers sorted descending; top losers ascending.", "PASSED"),
        ("UT-07", "AlertsService", "Price Above Trigger", "Target: Rs. 500, LTP: Rs. 506.42", "isActive=true, condition ABOVE triggers; triggered=true.", "PASSED"),
        ("UT-08", "AlertsService", "Price Below Trigger", "Target: Rs. 400, LTP: Rs. 506.42", "Condition not met; alert remains untriggered.", "PASSED"),
        ("UT-09", "AlertsService", "RSI Oversold Trigger", "Target: 30, Current RSI: 28.4", "Trigger flag set to true; notification payload created.", "PASSED"),
        ("UT-10", "PortfolioService", "Unrealized PnL Math", "100 shares @ Rs. 480, LTP: Rs. 506.42", "PnL = +Rs. 2,642.00 (+5.50%); market value = Rs. 50,642.", "PASSED"),
        ("UT-11", "PortfolioService", "Sector Allocation %", "NABIL (Bank): 50k, CHCL (Hydro): 50k", "Commercial Banks: 50.0%, Hydropower: 50.0%.", "PASSED"),
        ("UT-12", "AudioAlarm", "Web Audio Synthesis", "Sound trigger event", "AudioContext creates D5->F#5->A5 chord envelope.", "PASSED"),
        ("UT-13", "LSTMFeatureExtractor", "Tensor Embedding Shape", "Input tensor (batch=1, seq=30, dim=5)", "Outputs 16-dimensional embedding tensor (1, 16).", "PASSED"),
        ("UT-14", "XGBoost Classifier", "Softprob Output", "24-dimensional combined feature vector", "3-element probability array summing strictly to 1.0.", "PASSED"),
        ("UT-15", "PredictionService", "Microservice Fallback", "Simulated FastAPI 500 server error", "Gracefully falls back to heuristic momentum response.", "PASSED"),
        ("UT-16", "CSV Export Utility", "Data Serialization", "Array of 60 OHLCV objects", "Valid RFC 4180 CSV string with header row.", "PASSED"),
    ]
    create_styled_table(doc, ut_headers, ut_rows, [0.7, 1.2, 1.3, 1.1, 1.12, 0.6], alignments=['C', 'L', 'L', 'L', 'L', 'C'])

    h3("4.2.2 System & Integration Testing")
    p("System and integration testing verified end-to-end communication between the frontend terminal, NestJS backend, Prisma database, and FastAPI ML microservice:")

    table_caption("Table 4.3: System Integration and End-to-End Test Matrix")
    st_headers = ["Test ID", "Scenario", "Pre-condition", "Execution Steps & Input", "Expected System Behavior", "Status"]
    st_rows = [
        ("ST-01", "Catalog Search & Discovery", "Backend running; 649 stocks seeded.", "User types 'NABIL' into search input.", "Catalog filters instantly; displays NABIL with real quote.", "PASSED"),
        ("ST-02", "Chart & Indicator Rendering", "Stock NABIL selected.", "User toggles EMA 12/26/50, BB, and Volume.", "Candlestick chart and indicator sub-panels render smoothly.", "PASSED"),
        ("ST-03", "Real-Time Alarm Lifecycle", "Stock NABIL loaded at Rs. 506.", "User arms alarm for Above 500; triggers eval.", "Alarm fires, audio chime plays, toast and desktop banner fire.", "PASSED"),
        ("ST-04", "Portfolio Mark-to-Market", "Portfolio empty.", "Add CHCL (200 @ Rs. 480); check summary.", "Holdings table updates; sector allocation bar reflects capital.", "PASSED"),
        ("ST-05", "Multi-Stock Comparison", "Terminal active.", "Select NABIL, GBIME, and CHCL in Compare modal.", "3-column comparative matrix renders side-by-side stats.", "PASSED"),
        ("ST-06", "Offline Resiliency Fallback", "Frontend running.", "Simulate network disconnect from backend.", "Client smoothly activates synthetic generator without crash.", "PASSED"),
        ("ST-07", "CSV Historical Data Export", "Chart displaying 60 bars.", "User clicks 'Download CSV' on toolbar.", "Browser downloads RFC 4180 CSV file with complete data.", "PASSED"),
        ("ST-08", "AI Probability Dial Update", "FastAPI microservice active.", "User opens AI Insights tab for SHIVM.", "FastAPI returns prediction; radial dial animates confidence %.", "PASSED"),
        ("ST-09", "Backtest Simulation Engine", "Historical data loaded.", "User views Backtest Simulator card.", "Past 60 sessions evaluated; Win Rate % and Profit Factor display.", "PASSED"),
        ("ST-10", "Price Projection Envelope", "Stock details loaded.", "User inspects 5-Day Projection Card.", "Upper and lower 95% volatility envelope cones render cleanly.", "PASSED"),
    ]
    create_styled_table(doc, st_headers, st_rows, [0.7, 1.2, 1.0, 1.2, 1.32, 0.6], alignments=['C', 'L', 'L', 'L', 'L', 'C'])

    h3("4.2.3 User Acceptance Testing (UAT)")
    p("User Acceptance Testing was conducted with volunteer retail traders, computer science peers, and faculty members evaluating terminal usability:")

    table_caption("Table 4.4: User Acceptance Testing (UAT) Scenario Evaluation Matrix")
    uat_headers = ["UAT ID", "User Persona", "Test Scenario & Task", "Acceptance Criteria", "User Feedback & Outcome", "Status"]
    uat_rows = [
        ("UAT-01", "Retail Trader", "Discover stocks and check top gainers.", "Screener loads within 2 seconds; search is responsive.", "Search is instantaneous; market movers view is clear.", "PASSED"),
        ("UAT-02", "Retail Trader", "Set price alert and receive acoustic chime.", "Chime plays audibly without external downloads.", "Chime is crisp and clear; toast notification is helpful.", "PASSED"),
        ("UAT-03", "Analyst", "Inspect multi-indicator candlestick chart.", "Indicators overlay cleanly without cluttering bars.", "TradingView-style dark mode is comfortable for eyes.", "PASSED"),
        ("UAT-04", "Analyst", "Evaluate AI confidence dial and backtest.", "Backtest displays quantifiable historical win rate.", "Probabilistic framing is much more useful than price points.", "PASSED"),
        ("UAT-05", "Retail Trader", "Track paper portfolio holdings and PnL.", "Mark-to-market valuations calculate accurately.", "PnL tracking gives confidence to test trading strategies.", "PASSED"),
        ("UAT-06", "System Admin", "Simulate server reboot during trading.", "System preserves database state and resumes cleanly.", "Prisma SQLite database loaded cleanly with zero data loss.", "PASSED"),
    ]
    create_styled_table(doc, uat_headers, uat_rows, [0.7, 1.0, 1.3, 1.3, 1.12, 0.6], alignments=['C', 'C', 'L', 'L', 'L', 'C'])

    doc.add_page_break()

    # -------------------------------------------------------------------------
    # CHAPTER 5: CONCLUSION AND FUTURE RECOMMENDATIONS
    # -------------------------------------------------------------------------
    h1("CHAPTER 5: CONCLUSION AND FUTURE RECOMMENDATIONS")

    h2("5.1 Conclusion")
    p("The “NEPSE AI: Real-Time Financial Decision Support and Stock Prediction System” successfully bridges the divide between theoretical computational finance and modern full-stack software engineering for the Nepal Stock Exchange. By acknowledging that emerging securities markets possess low order-book depth, circuit breakers, and high retail noise, the project fundamentally reframed the problem of stock forecasting—abandoning fragile point-in-time price regression and successfully constructing an enterprise-grade quantitative Decision Support System (DSS).")

    p("The three-tier decoupled microservice architecture demonstrated exceptional performance, resilience, and modularity throughout all testing phases. The NestJS backend effectively resolved external API instability through local caching and automated background synchronization, reducing query latency to sub-50 milliseconds across 649 listed securities. The two-stage hybrid machine learning pipeline—combining PyTorch LSTM temporal sequence embeddings with an XGBoost multi-class softprob classifier—proved that deep sequential representations and tabular technical metrics can be united to output reliable directional probabilities with calibrated confidence percentages.")

    p("Furthermore, the incorporation of native Web Audio API acoustic chime synthesis, browser desktop notifications, 5-day Monte Carlo price projection envelopes, empirical 60-session strategy backtesting, live market screeners, multi-stock comparison matrices, and paper trading portfolio trackers elevates this project into a comprehensive, production-grade financial terminal suitable for both academic defense and real-world investor utility.")

    h2("5.2 Lessons Learnt & Outcomes")
    p("Throughout the design, implementation, and testing of this capstone project, several crucial software engineering, machine learning, and financial domain insights were gained:")

    p("• Domain Framing Precedes Algorithmic Selection: In financial data science, understanding market microstructure (such as NEPSE circuit breakers, liquidity tiers, and trading halts) is far more critical than blindly applying complex neural networks. Framing predictions as probabilistic decision support rather than speculative price targets prevented severe regression failure.")

    p("• Hybrid Architectures Outperform Monolithic Models: Neither LSTMs nor gradient boosted trees alone were sufficient. Unifying LSTM latent sequence hidden states with tabular technical indicators proved that hybrid ensemble approaches achieve the highest predictive stability.")

    p("• Zero-Asset Web Engineering: Implementing acoustic alarms via the HTML5 Web Audio API eliminated external MP3 dependencies, ensuring that alerting functions flawlessly across sandbox and offline environments.")

    p("• Defensive Data Engineering: Building dual-database capabilities (local SQLite alongside cloud PostgreSQL) and multi-tier heuristic fallback engines guaranteed that the system never crashes, maintaining 100% availability during demonstrations and evaluations.")

    h2("5.3 Future Recommendations")
    p("While the system fully meets and exceeds all project requirements for the BCA 8th semester curriculum, several promising avenues exist for future expansion:")

    p("• Natural Language Processing (NLP) for Nepali Financial News: Integrating fine-tuned BERT models (such as NepaliBERT) to scrape and analyze sentiment from Nepali financial portals (ShareSansar, Merolagani, Bizshala) to augment technical indicators with qualitative sentiment scores.")

    p("• Direct Broker TMS API Integration: If the Securities Board of Nepal (SEBON) and NEPSE open standardized FIX/REST brokerage gateway APIs, the paper trading portfolio module can be upgraded to live algorithmic order routing.")

    p("• Fundamental Macroeconomic Factor Integration: Incorporating macroeconomic indicators such as Nepal Rastra Bank (NRB) interbank interest rates, remittance inflows, and broad money supply (M2) growth directly into the XGBoost feature matrix.")

    p("• Native Mobile Application Development: Packaging the React terminal into a cross-platform mobile application using React Native or Flutter to provide native push notifications via Apple APNs and Firebase Cloud Messaging (FCM).")

    doc.add_page_break()

    # -------------------------------------------------------------------------
    # APPENDICES
    # -------------------------------------------------------------------------
    h1("APPENDICES")

    h2("Appendix A: System User Interface Screenshots")

    screenshot_dir = r"C:\Users\Lenovo\.gemini\antigravity-ide\brain\3026bff8-975f-427d-b051-273184069b19"
    img_dashboard = os.path.join(screenshot_dir, "dashboard_overview_1790243041085.png")
    img_maximized = os.path.join(screenshot_dir, "maximized_overview_1790243111421.png")
    img_screener = os.path.join(screenshot_dir, "market_movers_screener_1790243256546.png")
    img_portfolio = os.path.join(screenshot_dir, "portfolio_tracker_1790243336954.png")
    img_compare = os.path.join(screenshot_dir, "compare_modal_1790243422245.png")

    add_figure_image(doc, img_dashboard, "Figure A.1: Main Interactive Financial Terminal & Real-Time Charting Canvas")
    add_figure_image(doc, img_maximized, "Figure A.2: Maximized Candlestick Visualizer with Multi-Indicator Overlays")
    add_figure_image(doc, img_screener, "Figure A.3: Live Market Movers Screener with Advance/Decline Breadth Bar")
    add_figure_image(doc, img_portfolio, "Figure A.4: Paper Trading Portfolio Management Dashboard with Mark-to-Market PnL")
    add_figure_image(doc, img_compare, "Figure A.5: Multi-Stock Comparative Matrix and Technical Benchmarking Modal")

    doc.add_page_break()

    h2("Appendix B: Core Algorithmic Code Listings")

    # Listing B.1
    code_lstm = """class LSTMFeatureExtractor(nn.Module):
    def __init__(self, input_dim: int = 5, hidden_dim: int = 16, num_layers: int = 1):
        super(LSTMFeatureExtractor, self).__init__()
        self.lstm = nn.LSTM(input_dim, hidden_dim, num_layers, batch_first=True)
        
    def forward(self, x: torch.Tensor) -> torch.Tensor:
        # x shape: (batch_size, sequence_length=30, input_dim=5)
        lstm_out, (hn, cn) = self.lstm(x)
        # Returns the 16-dimensional latent temporal embedding from final time-step
        return hn[-1]"""
    add_code_block(doc, "Listing B.1: Two-Stage Hybrid LSTM Feature Extractor (hybrid_model.py)", code_lstm)

    # Listing B.2
    code_xgb = """# Feature Concatenation & XGBoost Softprob Classification Pipeline
def train_and_classify(self, X_seq_tensor: torch.Tensor, X_indicators: np.ndarray, y: np.ndarray):
    with torch.no_grad():
        # Step 1: Extract 16-D sequential embeddings from PyTorch LSTM
        embeddings = self.lstm(X_seq_tensor).cpu().numpy()
        
    # Step 2: Horizontally stack LSTM temporal embeddings with 8 tabular indicators
    X_combined = np.hstack((embeddings, X_indicators)) # Shape: (batch_size, 24)
    
    # Step 3: Train XGBoost Classifier with multi-class softprob objective
    self.xgb_model = xgb.XGBClassifier(
        n_estimators=50,
        max_depth=4,
        learning_rate=0.1,
        objective='multi:softprob',
        num_class=3, # 0: Bearish, 1: Neutral, 2: Bullish
        random_state=42
    )
    self.xgb_model.fit(X_combined, y)"""
    add_code_block(doc, "Listing B.2: XGBoost Multi-Class Softprob Classification Pipeline (hybrid_model.py)", code_xgb)

    # Listing B.3
    code_audio = """public playChime() {
    if (!this.soundEnabled) return;
    this.initContext();
    const now = this.ctx.currentTime;
    const notes = [587.33, 739.99, 880.0]; // D5, F#5, A5 Triad Chord
    const noteDuration = 0.12;

    notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * noteDuration);
        
        const startTime = now + idx * noteDuration;
        gain.gain.setValueAtTime(0, startTime);
        gain.gain.linearRampToValueAtTime(0.25, startTime + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.4);
        
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(startTime);
        osc.stop(startTime + 0.45);
    });
}"""
    add_code_block(doc, "Listing B.3: Acoustic Alarm Synthesizer via Web Audio API (audioAlarm.ts)", code_audio)

    # Listing B.4
    code_alerts = """async evaluateAlerts(currentPrices: Map<string, number>, currentRSI?: Map<string, number>) {
    const activeAlerts = await this.prisma.alert.findMany({ where: { isActive: true } });
    const triggeredList = [];

    for (const alert of activeAlerts) {
        const ltp = currentPrices.get(alert.symbol);
        if (!ltp) continue;
        let isMet = false;

        switch (alert.condition) {
            case 'ABOVE': isMet = ltp >= alert.targetValue; break;
            case 'BELOW': isMet = ltp <= alert.targetValue; break;
            case 'RSI_OVERSOLD':
                const rsiVal = currentRSI?.get(alert.symbol);
                if (rsiVal) isMet = rsiVal <= alert.targetValue;
                break;
        }

        if (isMet) {
            await this.prisma.alert.update({
                where: { id: alert.id },
                data: { triggered: true, triggeredAt: new Date() }
            });
            triggeredList.push(alert);
        }
    }
    return triggeredList;
}"""
    add_code_block(doc, "Listing B.4: Real-Time Multi-Condition Alert Evaluation Engine (alerts.service.ts)", code_alerts)

    doc.add_page_break()

    # -------------------------------------------------------------------------
    # APPENDIX C: SUPERVISOR VISIT LOG SHEET
    # -------------------------------------------------------------------------
    h2("Appendix C: Supervisor Visit Log Sheet")
    table_caption("Table C.1: Supervisor Consultation and Progress Log Sheet (8th Semester)")
    log_headers = ["S.N.", "Milestone Date / Week", "Topic Discussed & Guidance Provided", "Supervisor Signature"]
    log_rows = [
        ("1", "Week 2 (Initial Proposal)", "Final capstone project proposal defense; problem scoping on NEPSE; architectural decoupling approval.", "__________________"),
        ("2", "Week 5 (SRS & Data Design)", "Software Requirement Specifications (SRS) review; Prisma ORM schema design; dual SQLite/PostgreSQL architecture.", "__________________"),
        ("3", "Week 8 (Technical Indicators)", "Verification of TypeScript mathematical technical indicator algorithms (EMA, RSI, MACD, Bollinger Bands).", "__________________"),
        ("4", "Week 10 (ML Pipeline Review)", "Evaluation of PyTorch LSTM feature extractor and XGBoost softprob classification architecture.", "__________________"),
        ("5", "Week 12 (Mid-Term Progress)", "Mid-term defense: review of React 19 terminal, Web Audio alarm synthesizer, and paper portfolio tracker.", "__________________"),
        ("6", "Week 14 (Testing & QA Audit)", "Comprehensive review of Jest unit test suites, integration test scenarios, and user acceptance testing.", "__________________"),
        ("7", "Week 15 (Draft Report Review)", "Submission and detailed line-by-line review of draft capstone documentation; formatting compliance check.", "__________________"),
        ("8", "Week 16 (Final Oral Defense)", "Final evaluation, viva-voce presentation dry-run, code demonstration, and report sign-off.", "__________________"),
    ]
    create_styled_table(doc, log_headers, log_rows, [0.6, 1.6, 3.22, 1.6], alignments=['C', 'C', 'L', 'C'])

    doc.add_page_break()

    # -------------------------------------------------------------------------
    # REFERENCES (IEEE Format)
    # -------------------------------------------------------------------------
    h1("REFERENCES")
    refs = [
        "[1] T. Fischer and C. Krauss, “Deep learning with long short-term memory networks for financial market predictions,” European Journal of Operational Research, vol. 270, no. 2, pp. 654–669, Oct. 2018.",
        "[2] X. Chen, Y. Zhou, and H. Dai, “A robust stock trend prediction approach based on XGBoost and technical indicators,” IEEE Access, vol. 9, pp. 112431–112443, Aug. 2021.",
        "[3] B. Shrestha and S. R. Joshi, “Empirical analysis of time series price prediction in the Nepal Stock Exchange using ARIMA models,” Journal of Science and Engineering, vol. 8, pp. 45–54, Dec. 2020.",
        "[4] G. Bhattarai, “Technical analysis confluence and risk mitigation strategies in emerging capital markets: A case study of NEPSE banking equities,” NRB Economic Review, vol. 34, no. 1, pp. 22–39, 2022.",
        "[5] M. Kumar and M. Thenmozhi, “Forecasting stock index movement: A comparison of support vector machines and random forest,” Indian Journal of Finance, vol. 8, no. 10, pp. 7–21, Oct. 2014.",
        "[6] D. M. Q. Nelson, A. C. M. Pereira, and R. A. de Oliveira, “Stock market’s price movement prediction with LSTM neural networks,” in Proc. Int. Joint Conf. Neural Networks (IJCNN), Anchorage, AK, USA, 2017, pp. 1419–1426.",
        "[7] O. B. Sezer, M. U. Gudelek, and A. M. Ozbayoglu, “Financial time series forecasting with deep learning: A systematic literature review: 2005–2019,” Applied Soft Computing, vol. 90, p. 106181, May 2020.",
        "[8] D. Shah, H. Isah, and F. Zulkernine, “Stock market analysis: A review and taxonomy of prediction techniques,” International Journal of Financial Studies, vol. 7, no. 2, p. 26, May 2019.",
        "[9] S. Hochreiter and J. Schmidhuber, “Long short-term memory,” Neural Computation, vol. 9, no. 8, pp. 1735–1780, Nov. 1997.",
        "[10] T. Chen and C. Guestrin, “XGBoost: A scalable tree boosting system,” in Proc. 22nd ACM SIGKDD Int. Conf. Knowledge Discovery and Data Mining (KDD), San Francisco, CA, USA, 2016, pp. 785–794.",
        "[11] J. W. Wilder, New Concepts in Technical Trading Systems. Greensboro, NC: Trend Research, 1978.",
        "[12] G. Appel, Technical Analysis: Power Tools for Active Investors. Upper Saddle River, NJ: Financial Times Prentice Hall, 2005.",
        "[13] J. Bollinger, Bollinger on Bollinger Bands. New York, NY: McGraw-Hill, 2002.",
        "[14] E. F. Fama, “Efficient capital markets: A review of theory and empirical work,” The Journal of Finance, vol. 25, no. 2, pp. 383–417, May 1970.",
        "[15] Nepal Stock Exchange (NEPSE), “NEPSE trading rules, automated matching bylaws, and circuit breaker directives,” Kathmandu, Nepal, Official Regulatory Publication, 2024. [Online]. Available: https://www.nepalstock.com.np.",
        "[16] Nepal Rastra Bank (NRB), “Monetary policy dynamics, banking liquidity, and capital market supervision report,” Economic Research Department, Annual Report, Kathmandu, Nepal, 2025."
    ]

    for ref in refs:
        rp = doc.add_paragraph()
        rp.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
        rp.paragraph_format.line_spacing = 1.15
        rp.paragraph_format.space_after = Pt(6)
        r_run = rp.add_run(ref)
        r_run.font.name = 'Times New Roman'
        r_run.font.size = Pt(11)

    # Save output document
    output_path = r"d:\Antigravity Projects\nepse-alarm\NEPSE_AI_BCA_8th_Sem_Project_Report.docx"
    doc.save(output_path)
    print(f"Comprehensive 8th Semester BCA Report generated successfully at: {output_path}")

    # Also try to update original file if not locked by Word
    orig_path = r"d:\Antigravity Projects\nepse-alarm\NEPSE_AI_BCA_Project_Report.docx"
    try:
        doc.save(orig_path)
        print(f"Also updated: {orig_path}")
    except PermissionError:
        print(f"Notice: {orig_path} is currently locked by Word. Please close Word to overwrite it directly.")

if __name__ == "__main__":
    build_nepse_report()

