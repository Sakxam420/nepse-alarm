# build_complete_report.py
# Comprehensive Academic Report Generator for Tribhuvan University (TU), FOHSS, Thames International College
# Bachelor in Computer Application (BCA) - 8th Semester Project
# Project Title: "NEPSE Stock Prediction & Decision Support System"

import os
import sys
import docx
from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH, WD_TAB_ALIGNMENT, WD_TAB_LEADER
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.oxml import parse_xml, OxmlElement
from docx.oxml.ns import nsdecls, qn

from report_builder_helpers import (
    set_cell_border, set_cell_shading, set_cell_margins,
    add_page_number_to_section, add_footer_page_number,
    create_styled_table, add_code_block, add_figure_image
)

def create_report():
    doc = Document()
    
    # =========================================================================
    # SECTION 1: COVER PAGE (A4, Left=1.25", Top/Bottom/Right=1.0", No Footer)
    # =========================================================================
    sec_prelim = doc.sections[0]
    sec_prelim.page_width = Inches(8.27)
    sec_prelim.page_height = Inches(11.69)
    sec_prelim.top_margin = Inches(1.0)
    sec_prelim.bottom_margin = Inches(1.0)
    sec_prelim.left_margin = Inches(1.25)
    sec_prelim.right_margin = Inches(1.0)
    sec_prelim.footer.is_linked_to_previous = False
    
    # Base typography
    normal_style = doc.styles['Normal']
    normal_style.font.name = 'Times New Roman'
    normal_style.font.size = Pt(12)
    normal_style.font.color.rgb = RGBColor(0, 0, 0)
    normal_style.paragraph_format.line_spacing = 1.15
    normal_style.paragraph_format.space_after = Pt(6)
    normal_style.paragraph_format.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY

    # Helper functions
    def p(text="", bold=False, italic=False, size=12, align=WD_ALIGN_PARAGRAPH.JUSTIFY, space_before=0, space_after=6, line_spacing=1.15):
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

    def p_bullet(roman_num, bold_title, body_text, size=12, space_after=6, left_indent_in=0.35, hanging_indent_in=-0.35):
        """
        Creates perfectly formatted academic bullet items matching user screenshot 1:
        e.g. i.   Student Registration and Login: A student can register by choosing...
        """
        par = doc.add_paragraph()
        par.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
        par.paragraph_format.left_indent = Inches(left_indent_in)
        par.paragraph_format.first_line_indent = Inches(hanging_indent_in)
        par.paragraph_format.space_before = Pt(0)
        par.paragraph_format.space_after = Pt(space_after)
        par.paragraph_format.line_spacing = 1.15
        
        r_num = par.add_run(f"{roman_num}\t")
        r_num.font.name = 'Times New Roman'
        r_num.font.size = Pt(size)
        
        r_title = par.add_run(f"{bold_title}: ")
        r_title.font.name = 'Times New Roman'
        r_title.font.size = Pt(size)
        r_title.bold = True
        
        r_body = par.add_run(body_text)
        r_body.font.name = 'Times New Roman'
        r_body.font.size = Pt(size)
        return par

    def p_runs(runs_list, align=WD_ALIGN_PARAGRAPH.JUSTIFY, space_before=0, space_after=6, line_spacing=1.15, size=12):
        par = doc.add_paragraph()
        par.alignment = align
        par.paragraph_format.space_before = Pt(space_before)
        par.paragraph_format.space_after = Pt(space_after)
        par.paragraph_format.line_spacing = line_spacing
        for item in runs_list:
            if isinstance(item, tuple):
                txt = item[0]
                b = item[1] if len(item) > 1 else False
                it = item[2] if len(item) > 2 else False
            else:
                txt = str(item)
                b = False
                it = False
            r = par.add_run(txt)
            r.font.name = 'Times New Roman'
            r.font.size = Pt(size)
            r.bold = b
            r.italic = it
        return par

    def p_numbered_step(step_num, body_text, size=12, space_after=5):
        par = doc.add_paragraph()
        par.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
        par.paragraph_format.left_indent = Inches(0.4)
        par.paragraph_format.first_line_indent = Inches(-0.25)
        par.paragraph_format.space_before = Pt(0)
        par.paragraph_format.space_after = Pt(space_after)
        par.paragraph_format.line_spacing = 1.15
        r_num = par.add_run(f"{step_num}. ")
        r_num.font.name = 'Times New Roman'
        r_num.font.size = Pt(size)
        r_body = par.add_run(body_text)
        r_body.font.name = 'Times New Roman'
        r_body.font.size = Pt(size)
        return par

    def p_equation(eq_text):
        par = doc.add_paragraph()
        par.alignment = WD_ALIGN_PARAGRAPH.CENTER
        par.paragraph_format.space_before = Pt(6)
        par.paragraph_format.space_after = Pt(8)
        par.paragraph_format.line_spacing = 1.15
        r = par.add_run(eq_text)
        r.font.name = 'Times New Roman'
        r.font.size = Pt(11.5)
        r.italic = True
        return par

    def chapter_title(num_str, title_str):
        par = doc.add_paragraph()
        par.alignment = WD_ALIGN_PARAGRAPH.CENTER
        par.paragraph_format.space_before = Pt(18)
        par.paragraph_format.space_after = Pt(14)
        par.paragraph_format.line_spacing = 1.15
        par.paragraph_format.keep_with_next = True
        r = par.add_run(f"CHAPTER {num_str}: {title_str.upper()}")
        r.font.name = 'Times New Roman'
        r.font.size = Pt(15)
        r.bold = True
        return par

    def h1(title):
        par = doc.add_paragraph()
        par.paragraph_format.space_before = Pt(14)
        par.paragraph_format.space_after = Pt(6)
        par.paragraph_format.line_spacing = 1.15
        par.paragraph_format.keep_with_next = True
        par.alignment = WD_ALIGN_PARAGRAPH.LEFT
        r = par.add_run(title)
        r.font.name = 'Times New Roman'
        r.font.size = Pt(13)
        r.bold = True
        return par

    def h2(title):
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

    def h3(title):
        par = doc.add_paragraph()
        par.paragraph_format.space_before = Pt(8)
        par.paragraph_format.space_after = Pt(2)
        par.paragraph_format.line_spacing = 1.15
        par.paragraph_format.keep_with_next = True
        par.alignment = WD_ALIGN_PARAGRAPH.LEFT
        r = par.add_run(title)
        r.font.name = 'Times New Roman'
        r.font.size = Pt(11)
        r.bold = True
        return par

    def table_caption(title):
        par = doc.add_paragraph()
        par.paragraph_format.space_before = Pt(10)
        par.paragraph_format.space_after = Pt(4)
        par.paragraph_format.keep_with_next = True
        par.alignment = WD_ALIGN_PARAGRAPH.CENTER
        r = par.add_run(title)
        r.font.name = 'Times New Roman'
        r.font.size = Pt(11)
        r.bold = True
        return par

    def figure_caption(title):
        par = doc.add_paragraph()
        par.paragraph_format.space_before = Pt(4)
        par.paragraph_format.space_after = Pt(12)
        par.alignment = WD_ALIGN_PARAGRAPH.CENTER
        r = par.add_run(title)
        r.font.name = 'Times New Roman'
        r.font.size = Pt(11)
        r.bold = True
        return par

    def embed_diagram(img_path, caption_title, width_in=5.8):
        if os.path.exists(img_path):
            p_img = doc.add_paragraph()
            p_img.alignment = WD_ALIGN_PARAGRAPH.CENTER
            p_img.paragraph_format.space_before = Pt(8)
            p_img.paragraph_format.space_after = Pt(4)
            p_img.paragraph_format.keep_with_next = True
            r_img = p_img.add_run()
            r_img.add_picture(img_path, width=Inches(width_in))
            figure_caption(caption_title)
        else:
            p(f"[Missing diagram: {img_path}]", bold=True, italic=True, align=WD_ALIGN_PARAGRAPH.CENTER)
            figure_caption(caption_title)

    def add_leader_entry(title, page_str, level=1, width_in=6.02):
        par = doc.add_paragraph()
        par.paragraph_format.tab_stops.add_tab_stop(Inches(width_in), WD_TAB_ALIGNMENT.RIGHT, WD_TAB_LEADER.DOTS)
        par.paragraph_format.line_spacing = 1.15
        par.paragraph_format.space_before = Pt(1)
        par.paragraph_format.space_after = Pt(2)
        if level == 1:
            r = par.add_run(title)
            r.bold = True
            r.font.name = 'Times New Roman'
            r.font.size = Pt(11)
        elif level == 2:
            par.paragraph_format.left_indent = Inches(0.25)
            r = par.add_run(title)
            r.font.name = 'Times New Roman'
            r.font.size = Pt(10.5)
        elif level == 3:
            par.paragraph_format.left_indent = Inches(0.50)
            r = par.add_run(title)
            r.font.name = 'Times New Roman'
            r.font.size = Pt(10)
        par.add_run('\t')
        r_num = par.add_run(str(page_str))
        r_num.bold = (level == 1)
        r_num.font.name = 'Times New Roman'
        r_num.font.size = Pt(11 if level == 1 else 10.5)

    # =========================================================================
    # PAGE 1: COVER PAGE
    # =========================================================================
    # Exact TU Logo directly extracted from friend report PDF
    logo_path = "assets/friend_tu_logo_0.png"
    if os.path.exists(logo_path):
        p_logo = doc.add_paragraph()
        p_logo.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p_logo.paragraph_format.space_before = Pt(0)
        p_logo.paragraph_format.space_after = Pt(12)
        p_logo.add_run().add_picture(logo_path, width=Inches(1.2))
    
    p("Tribhuvan University", bold=True, size=15, align=WD_ALIGN_PARAGRAPH.CENTER, space_after=2, line_spacing=1.15)
    p("Faculty of Humanities and Social Sciences", bold=True, size=13, align=WD_ALIGN_PARAGRAPH.CENTER, space_after=24, line_spacing=1.15)
    
    p("A PROJECT REPORT ON", bold=True, size=13, align=WD_ALIGN_PARAGRAPH.CENTER, space_after=10, line_spacing=1.15)
    p("NEPSE STOCK PREDICTION & DECISION SUPPORT SYSTEM", bold=True, size=16, align=WD_ALIGN_PARAGRAPH.CENTER, space_after=24, line_spacing=1.2)
    
    p("Submitted to", size=11, align=WD_ALIGN_PARAGRAPH.CENTER, space_after=2, line_spacing=1.15)
    p("School of Information Technology", bold=True, size=13, align=WD_ALIGN_PARAGRAPH.CENTER, space_after=2, line_spacing=1.15)
    p("Thames International College", bold=True, size=13, align=WD_ALIGN_PARAGRAPH.CENTER, space_after=24, line_spacing=1.15)
    
    p("In partial fulfillment of the requirement for the Bachelors in Computer Application", italic=True, size=11, align=WD_ALIGN_PARAGRAPH.CENTER, space_after=24, line_spacing=1.15)
    
    # 2-Man Group "Submitted by" Table from user screenshot
    tbl_sub = doc.add_table(rows=6, cols=2)
    tbl_sub.alignment = WD_TABLE_ALIGNMENT.CENTER
    tbl_sub.autofit = False
    
    sub_data = [
        [("Submitted By", True), ("Submitted By", True)],
        [("Eshan Giri", True), ("Sakshyam Bhattarai", True)],
        [("TU Reg. No:", True), ("TU Reg. No:", True)],
        [("6-2-450-149-2021", False), ("6-2-450-161-2021", False)],
        [("Symbol No:", True), ("Symbol No:", True)],
        [("45002066", False), ("45002078", False)]
    ]
    
    for r_idx, row in enumerate(tbl_sub.rows):
        trPr = row._tr.get_or_add_trPr()
        trPr.append(parse_xml(r'<w:cantSplit xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"/>'))
        for c_idx, cell in enumerate(row.cells):
            cell.width = Inches(2.9)
            set_cell_margins(cell, top=60, bottom=60, left=100, right=100)
            set_cell_border(cell,
                            top=dict(sz=6, color='000000', val='single'),
                            bottom=dict(sz=6, color='000000', val='single'),
                            left=dict(sz=6, color='000000', val='single'),
                            right=dict(sz=6, color='000000', val='single'))
            cp = cell.paragraphs[0]
            cp.alignment = WD_ALIGN_PARAGRAPH.LEFT
            cp.paragraph_format.space_before = Pt(1)
            cp.paragraph_format.space_after = Pt(1)
            cp.paragraph_format.line_spacing = 1.15
            txt, is_b = sub_data[r_idx][c_idx]
            run = cp.add_run(txt)
            run.font.name = 'Times New Roman'
            run.font.size = Pt(10.5)
            run.bold = is_b
            
    p("September 2026", bold=True, size=11, align=WD_ALIGN_PARAGRAPH.CENTER, space_before=20, space_after=18, line_spacing=1.15)
    
    p("Under the supervision of", size=11, align=WD_ALIGN_PARAGRAPH.CENTER, space_after=2, line_spacing=1.15)
    p("Mr. Prabesh Khadka", bold=True, size=13, align=WD_ALIGN_PARAGRAPH.CENTER, space_after=0, line_spacing=1.15)
    
    doc.add_page_break()
    
    # =========================================================================
    # PRELIMINARY SECTION WITH ROMAN NUMERALS (i, ii, iii, ...)
    # =========================================================================
    sec_roman = doc.add_section()
    sec_roman.top_margin = Inches(1.0)
    sec_roman.bottom_margin = Inches(1.0)
    sec_roman.left_margin = Inches(1.25)
    sec_roman.right_margin = Inches(1.0)
    add_page_number_to_section(sec_roman, start_type="lowerRoman", start_num=1)
    add_footer_page_number(sec_roman)
    
    # -------------------------------------------------------------------------
    # PAGE i: SUPERVISOR'S RECOMMENDATION
    # -------------------------------------------------------------------------
    logo_rec_path = "assets/friend_tu_logo_rec.png"
    if os.path.exists(logo_rec_path):
        p_logo = doc.add_paragraph()
        p_logo.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p_logo.paragraph_format.space_before = Pt(0)
        p_logo.paragraph_format.space_after = Pt(10)
        p_logo.add_run().add_picture(logo_rec_path, width=Inches(1.15))
        
    p("Tribhuvan University", bold=True, size=15, align=WD_ALIGN_PARAGRAPH.CENTER, space_after=2, line_spacing=1.15)
    p("Faculty of Humanities and Social Sciences", bold=True, size=13, align=WD_ALIGN_PARAGRAPH.CENTER, space_after=2, line_spacing=1.15)
    p("Thames International College", bold=True, size=13, align=WD_ALIGN_PARAGRAPH.CENTER, space_after=28, line_spacing=1.15)
    
    p("Supervisor’s Recommendation", bold=True, size=14, align=WD_ALIGN_PARAGRAPH.CENTER, space_after=24, line_spacing=1.15)
    
    p_runs([
        ("I hereby recommend that this project prepared under my supervision by "),
        ("ESHAN GIRI", True),
        (" and "),
        ("SAKSHYAM BHATTARAI", True),
        (" entitled “"),
        ("NEPSE STOCK PREDICTION & DECISION SUPPORT SYSTEM", True),
        ("” in partial fulfillment of requirement of the degree of "),
        ("Bachelor in Computer Application", True),
        (" is recommended for the final evaluation.")
    ], space_after=64, line_spacing=1.4)
    
    p("________________________", bold=True, align=WD_ALIGN_PARAGRAPH.LEFT, space_after=2)
    p("SIGNATURE", bold=True, align=WD_ALIGN_PARAGRAPH.LEFT, space_after=4)
    p("Mr. Prabesh Khadka", bold=True, align=WD_ALIGN_PARAGRAPH.LEFT, space_after=2)
    p("SUPERVISOR", bold=True, align=WD_ALIGN_PARAGRAPH.LEFT, space_after=2)
    p("School of Information Technology", align=WD_ALIGN_PARAGRAPH.LEFT, space_after=2)
    p("Thames International College", align=WD_ALIGN_PARAGRAPH.LEFT, space_after=0)
    
    doc.add_page_break()
    
    # -------------------------------------------------------------------------
    # PAGE ii: LETTER OF APPROVAL
    # -------------------------------------------------------------------------
    if os.path.exists(logo_rec_path):
        p_logo = doc.add_paragraph()
        p_logo.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p_logo.paragraph_format.space_before = Pt(0)
        p_logo.paragraph_format.space_after = Pt(10)
        p_logo.add_run().add_picture(logo_rec_path, width=Inches(1.15))
        
    p("Tribhuvan University", bold=True, size=15, align=WD_ALIGN_PARAGRAPH.CENTER, space_after=2, line_spacing=1.15)
    p("Faculty of Humanities and Social Sciences", bold=True, size=13, align=WD_ALIGN_PARAGRAPH.CENTER, space_after=2, line_spacing=1.15)
    p("Thames International College", bold=True, size=13, align=WD_ALIGN_PARAGRAPH.CENTER, space_after=28, line_spacing=1.15)
    
    p("Letter of Approval", bold=True, size=14, align=WD_ALIGN_PARAGRAPH.CENTER, space_after=24, line_spacing=1.15)
    
    p_runs([
        ("This is to certify that this project prepared by "),
        ("ESHAN GIRI", True),
        (" and "),
        ("SAKSHYAM BHATTARAI", True),
        (" entitled “"),
        ("NEPSE STOCK PREDICTION & DECISION SUPPORT SYSTEM", True),
        ("” in partial fulfillment of the requirements for the degree of "),
        ("Bachelor in Computer Application", True),
        (" has been evaluated. In our opinion, it is satisfactory in the scope and quality as a project for the required degree.")
    ], space_after=32, line_spacing=1.4)
    
    # 2x2 Approval Table exactly from user screenshot
    tbl_appr = doc.add_table(rows=2, cols=2)
    tbl_appr.alignment = WD_TABLE_ALIGNMENT.CENTER
    tbl_appr.autofit = False
    
    appr_cells = [
        [
            ("SIGNATURE of Supervisor\nMr. Prabesh Khadka\nComputer Science\nThames International College", "left"),
            ("SIGNATURE of HOD/Coordinator\nMr. Surendra Malla\nComputer Science\nThames International College", "left")
        ],
        [
            ("SIGNATURE of Internal Examiner:\nInternal Examiner", "left"),
            ("SIGNATURE of External Examiner:\nExternal Examiner", "left")
        ]
    ]
    
    for r_idx, row in enumerate(tbl_appr.rows):
        trPr = row._tr.get_or_add_trPr()
        trPr.append(parse_xml(r'<w:cantSplit xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"/>'))
        for c_idx, cell in enumerate(row.cells):
            cell.width = Inches(3.0)
            set_cell_margins(cell, top=120, bottom=120, left=120, right=120)
            set_cell_border(cell,
                            top=dict(sz=6, color='334155', val='single'),
                            bottom=dict(sz=6, color='334155', val='single'),
                            left=dict(sz=6, color='334155', val='single'),
                            right=dict(sz=6, color='334155', val='single'))
            cp = cell.paragraphs[0]
            cp.alignment = WD_ALIGN_PARAGRAPH.LEFT
            cp.paragraph_format.space_before = Pt(2)
            cp.paragraph_format.space_after = Pt(2)
            cp.paragraph_format.line_spacing = 1.2
            lines = appr_cells[r_idx][c_idx][0].split('\n')
            for l_idx, line in enumerate(lines):
                if l_idx > 0:
                    cp = cell.add_paragraph()
                    cp.alignment = WD_ALIGN_PARAGRAPH.LEFT
                    cp.paragraph_format.space_before = Pt(1)
                    cp.paragraph_format.space_after = Pt(1)
                    cp.paragraph_format.line_spacing = 1.2
                run = cp.add_run(line)
                run.font.name = 'Times New Roman'
                run.font.size = Pt(10.5)
                if "SIGNATURE" in line:
                    run.bold = True
                elif line in ["Mr. Prabesh Khadka", "Mr. Surendra Malla", "Internal Examiner", "External Examiner"]:
                    run.bold = True
                    
    doc.add_page_break()
    
    # -------------------------------------------------------------------------
    # PAGE iii: ABSTRACT
    # -------------------------------------------------------------------------
    p("ABSTRACT", bold=True, size=14, align=WD_ALIGN_PARAGRAPH.CENTER, space_before=16, space_after=18, line_spacing=1.15)
    
    p_runs([
        ("The "),
        ("Nepal Stock Exchange (NEPSE)", True),
        (" has experienced unprecedented expansion in active trading accounts and retail participation over recent years. However, retail market participants operate under severe information asymmetry, fragmented technical charting tools, and the absence of institutional-grade automated decision support. Traditional web platforms in Nepal either present delayed snapshots or require manual charting that fails to alert investors to rapid price breakouts, intraday reversals, or high-probability swing opportunities. This project presents the "),
        ("NEPSE Stock Prediction & Decision Support System", True),
        (", a full-stack, enterprise-grade financial analytics platform that unites automated market data ingestion, algorithmic technical analysis, stacked machine learning inference, and low-latency real-time alerting into a cohesive web application.")
    ], space_after=12)
    
    p_runs([
        ("The system architecture combines sequential deep learning and gradient boosted decision trees into a high-precision hybrid predictive framework. A stacked "),
        ("Bidirectional Long Short-Term Memory (BiLSTM)", True),
        (" network processes rolling 60-day historical "),
        ("Open-High-Low-Close-Volume (OHLCV)", True),
        (" sequences to capture long-term temporal dependencies, cyclic seasonality, and momentum persistence. Simultaneously, an "),
        ("Extreme Gradient Boosting (XGBoost)", True),
        (" model evaluates engineered tabular financial indicators—including Wilder's 14-period "),
        ("Relative Strength Index (RSI)", True),
        (", "),
        ("Moving Average Convergence Divergence (MACD)", True),
        (", "),
        ("Bollinger Bands", True),
        (" volatility squeezes, "),
        ("Exponential Moving Averages (EMA 9, 21, 50, 200)", True),
        (", and floor pivot points. The latent temporal representation and tabular feature vectors are synthesized through a stacked ensemble meta-learner, generating next-day price forecasts, confidence intervals, and direction probabilities.")
    ], space_after=12)
    
    p_runs([
        ("To eliminate manual screen monitoring, the platform incorporates an event-driven real-time alert engine. Users configure customized multi-parameter triggers based on price thresholds, percentage changes, or technical indicator crosses. An automated scraping daemon continuously captures market ticks from the "),
        ("NEPSE", True),
        (" trading floor, and upon rule satisfaction, dispatches instant audio sirens and "),
        ("WebSocket", True),
        (" push notifications directly to the investor's browser. Furthermore, the platform delivers an interactive portfolio management engine, a comprehensive stock comparison modal, and a 647-equity multi-sector screener.")
    ], space_after=12)
    
    p_runs([
        ("Empirical validation across top-tier "),
        ("NEPSE", True),
        (" equities (including "),
        ("NABIL", True),
        (", "),
        ("SHIVM", True),
        (", "),
        ("CHCL", True),
        (", "),
        ("NICA", True),
        (", and "),
        ("HDL", True),
        (") demonstrated superior performance: the hybrid model attained an average next-day price error within "),
        ("±0.81%", True),
        (" and an "),
        ("81.4%", True),
        (" directional trend classification accuracy, significantly outperforming traditional manual analysis. The end-to-end alert pipeline maintained an average dispatch latency under "),
        ("190 milliseconds", True),
        (", ensuring timely execution for active market participants.")
    ], space_after=18)
    
    p_runs([
        ("Keywords: ", True),
        ("NEPSE, Stock Price Prediction, Machine Learning, Long Short-Term Memory (LSTM), XGBoost, Decision Support System, Real-Time WebSockets, Technical Analysis.", False, True)
    ], space_after=0)
    
    doc.add_page_break()
    
    # -------------------------------------------------------------------------
    # PAGE iv: ACKNOWLEDGEMENT
    # -------------------------------------------------------------------------
    p("ACKNOWLEDGEMENT", bold=True, size=14, align=WD_ALIGN_PARAGRAPH.CENTER, space_before=16, space_after=18, line_spacing=1.15)
    
    p_runs([
        ("We would like to express our deepest gratitude and sincere appreciation to our project supervisor, "),
        ("Mr. Prabesh Khadka", True),
        (", for his intellectual guidance, continuous encouragement, constructive criticisms, and invaluable suggestions throughout the conceptualization, system analysis, modeling, and software engineering phases of the "),
        ("NEPSE Stock Prediction & Decision Support System", True),
        (". His insightful feedback shaped both the machine learning architecture and the analytical depth of this report.")
    ], space_after=12)
    
    p_runs([
        ("We extend our sincere thanks to "),
        ("Mr. Surendra Malla", True),
        (", HOD/Coordinator of the "),
        ("School of Information Technology", True),
        (" at "),
        ("Thames International College", True),
        (", for his administrative support, academic leadership, and continuous encouragement of students to undertake practical, industry-relevant computational projects.")
    ], space_after=12)
    
    p_runs([
        ("We are deeply grateful to "),
        ("Thames International College", True),
        (" for providing the computational infrastructure, library facilities, and collaborative academic environment required to bring this complex full-stack financial platform to fruition. We also convey our warm gratitude to all faculty members of the "),
        ("School of Information Technology", True),
        (" whose pedagogy over the past four years established the foundation of our computing competencies.")
    ], space_after=12)
    
    p_runs([
        ("Special thanks go to our family members and peers for their unwavering patience, moral support, and enthusiasm during demanding coding sessions, as well as for actively testing the live platform across various trading scenarios.")
    ], space_after=12)
    
    p_runs([
        ("Finally, we thank "),
        ("Tribhuvan University", True),
        (" for structuring the "),
        ("Bachelor in Computer Application (BCA)", True),
        (" curriculum to encompass capstone project endeavors that empower graduates to solve real-world economic and technological challenges.")
    ], space_after=32)
    
    p_runs([
        ("Eshan Giri", True),
        ("\n"),
        ("Sakshyam Bhattarai", True)
    ], align=WD_ALIGN_PARAGRAPH.LEFT, space_after=0, line_spacing=1.2)
    
    doc.add_page_break()
    
    # -------------------------------------------------------------------------
    # PAGE v-vi: TABLE OF CONTENTS (Using Dot Leader Tabs)
    # -------------------------------------------------------------------------
    p("TABLE OF CONTENTS", bold=True, size=14, align=WD_ALIGN_PARAGRAPH.CENTER, space_before=16, space_after=18, line_spacing=1.15)
    
    add_leader_entry("ABSTRACT", "iii", level=1)
    add_leader_entry("ACKNOWLEDGEMENT", "iv", level=1)
    add_leader_entry("LIST OF FIGURES", "vii", level=1)
    add_leader_entry("LIST OF TABLES", "viii", level=1)
    add_leader_entry("LIST OF ABBREVIATIONS", "ix", level=1)
    add_leader_entry("CHAPTER 1: INTRODUCTION", "1", level=1)
    add_leader_entry("1.1  Introduction", "1", level=2)
    add_leader_entry("1.2  Problem Statement", "2", level=2)
    add_leader_entry("1.3  Objectives", "3", level=2)
    add_leader_entry("1.4  Scope and Limitation", "3", level=2)
    add_leader_entry("1.4.1  Scope", "3", level=3)
    add_leader_entry("1.4.2  Limitations", "4", level=3)
    add_leader_entry("1.5  Development Methodology", "4", level=2)
    add_leader_entry("1.6  Report Organization", "5", level=2)
    add_leader_entry("CHAPTER 2: BACKGROUND STUDY AND LITERATURE REVIEW", "6", level=1)
    add_leader_entry("2.1  Background Study", "6", level=2)
    add_leader_entry("2.1.1  Overview of NEPSE Market Mechanics", "6", level=3)
    add_leader_entry("2.1.2  Technical Analysis & Mathematical Indicators", "7", level=3)
    add_leader_entry("2.1.3  Time-Series Financial Modeling & Deep Learning", "10", level=3)
    add_leader_entry("2.1.4  Recurrent Neural Networks & LSTM Architectures", "11", level=3)
    add_leader_entry("2.1.5  Extreme Gradient Boosting (XGBoost) Framework", "12", level=3)
    add_leader_entry("2.1.6  Hybrid Sequential-Tabular Feature Engineering", "13", level=3)
    add_leader_entry("2.1.7  Real-Time WebSockets & Modern Alerting Architectures", "14", level=3)
    add_leader_entry("2.2  Literature Review", "15", level=2)
    add_leader_entry("2.2.1  Review of Related Works", "15", level=3)
    add_leader_entry("2.2.2  Comparative Summary of Literature", "17", level=3)
    add_leader_entry("CHAPTER 3: SYSTEM ANALYSIS AND DESIGN", "19", level=1)
    add_leader_entry("3.1  System Analysis", "19", level=2)
    add_leader_entry("3.1.1  Requirements Analysis", "19", level=3)
    add_leader_entry("3.1.2  Feasibility Analysis", "23", level=3)
    add_leader_entry("3.1.3  Data Flow Modeling (Level 0 and Level 1 DFD)", "25", level=3)
    add_leader_entry("3.1.4  Data Modeling using Entity-Relationship Diagram (ERD)", "27", level=3)
    add_leader_entry("3.1.5  Object Modeling using Class and Object Diagram", "29", level=3)
    add_leader_entry("3.1.6  Dynamic Modeling using State and Sequence Diagrams", "32", level=3)
    add_leader_entry("3.1.7  Process Modeling using Activity Diagram", "36", level=3)
    add_leader_entry("3.2  System Design", "38", level=2)
    add_leader_entry("3.2.1  Component Diagram", "38", level=3)
    add_leader_entry("3.2.2  Deployment Diagram", "39", level=3)
    add_leader_entry("3.3  Algorithm Details", "41", level=2)
    add_leader_entry("CHAPTER 4: IMPLEMENTATION AND TESTING", "45", level=1)
    add_leader_entry("4.1  Implementation", "45", level=2)
    add_leader_entry("4.1.1  Tools Used", "45", level=3)
    add_leader_entry("4.1.2  Implementation Details of Modules", "46", level=3)
    add_leader_entry("4.2  Testing", "49", level=2)
    add_leader_entry("4.2.1  Test Cases for Unit Testing", "49", level=3)
    add_leader_entry("4.2.2  Test Cases for System & Integration Testing", "51", level=3)
    add_leader_entry("4.3  Result Analysis", "53", level=2)
    add_leader_entry("4.3.1  Predictive Accuracy Evaluation", "53", level=3)
    add_leader_entry("4.3.2  Real-Time Alert and Response Time Evaluation", "55", level=3)
    add_leader_entry("CHAPTER 5: CONCLUSION AND FUTURE RECOMMENDATIONS", "57", level=1)
    add_leader_entry("5.1  Conclusion", "57", level=2)
    add_leader_entry("5.2  Future Recommendations", "58", level=2)
    add_leader_entry("REFERENCES", "60", level=1)
    add_leader_entry("APPENDICES", "62", level=1)
    
    doc.add_page_break()
    
    # -------------------------------------------------------------------------
    # PAGE vii: LIST OF FIGURES (Using Dot Leader Tabs)
    # -------------------------------------------------------------------------
    p("LIST OF FIGURES", bold=True, size=14, align=WD_ALIGN_PARAGRAPH.CENTER, space_before=16, space_after=18, line_spacing=1.15)
    
    add_leader_entry("Figure 1.1: Incremental Development Life Cycle Model", "5", level=1)
    add_leader_entry("Figure 2.1: Wilder's 14-Period RSI Oscillator Bounds and Momentum Thresholds", "8", level=1)
    add_leader_entry("Figure 2.2: Moving Average Convergence Divergence (MACD) Signal Expansion & Crossover", "9", level=1)
    add_leader_entry("Figure 2.3: NEPSE Hybrid Sequential-Tabular Machine Learning Architecture", "13", level=1)
    add_leader_entry("Figure 3.1: Use Case Diagram of NEPSE Stock Prediction & Decision Support System", "21", level=1)
    add_leader_entry("Figure 3.2: Project Implementation Timeline (Gantt Chart)", "24", level=1)
    add_leader_entry("Figure 3.3: Level 0 DFD (Context Diagram) of NEPSE System", "25", level=1)
    add_leader_entry("Figure 3.4: Level 1 DFD of NEPSE Stock Prediction & Decision Support System", "26", level=1)
    add_leader_entry("Figure 3.5: Entity-Relationship Diagram (ERD) with Relational Cardinalities", "28", level=1)
    add_leader_entry("Figure 3.6: Class Diagram of NEPSE Stock Prediction & Decision Support System", "30", level=1)
    add_leader_entry("Figure 3.7: Object Diagram Snapshot of NEPSE System State", "31", level=1)
    add_leader_entry("Figure 3.8: State Machine Diagram of Real-Time Alert Engine Lifecycle", "33", level=1)
    add_leader_entry("Figure 3.9: Sequence Diagram of Market Data Ingestion & Live Broadcast", "34", level=1)
    add_leader_entry("Figure 3.10: Sequence Diagram of Predictive ML Inference & Indicator Calculation", "35", level=1)
    add_leader_entry("Figure 3.11: Sequence Diagram of Real-Time Alert Evaluation & Dispatch", "36", level=1)
    add_leader_entry("Figure 3.12: Activity Diagram of User Workflow & Trading Decision Support", "37", level=1)
    add_leader_entry("Figure 3.13: Component Diagram of NEPSE System", "39", level=1)
    add_leader_entry("Figure 3.14: Physical Deployment Diagram of NEPSE Production Architecture", "40", level=1)
    add_leader_entry("Figure 6.1: Real-Time Live Market Overview & Ticker Ribbon", "62", level=1)
    add_leader_entry("Figure 6.2: Maximized Stock Detail with Technical Indicators & LSTM Predictions", "63", level=1)
    add_leader_entry("Figure 6.3: Multi-Stock Screener, Market Movers & Sectoral Heatmap", "64", level=1)
    add_leader_entry("Figure 6.4: Interactive Stock Comparison Modal", "65", level=1)
    add_leader_entry("Figure 6.5: Portfolio Tracking & Profit/Loss Evaluation", "66", level=1)
    add_leader_entry("Figure 6.6: Custom Real-Time Price Alert Creation Interface", "67", level=1)
    
    doc.add_page_break()
    
    # -------------------------------------------------------------------------
    # PAGE viii: LIST OF TABLES (Using Dot Leader Tabs)
    # -------------------------------------------------------------------------
    p("LIST OF TABLES", bold=True, size=14, align=WD_ALIGN_PARAGRAPH.CENTER, space_before=16, space_after=18, line_spacing=1.15)
    
    add_leader_entry("Table 3.1: Use Case Description for NEPSE Decision Support System", "22", level=1)
    add_leader_entry("Table 4.1: Test Cases for Unit Testing", "50", level=1)
    add_leader_entry("Table 4.2: Test Cases for System & Integration Testing", "52", level=1)
    add_leader_entry("Table 4.3: Prediction Results for Demonstration Equities", "54", level=1)
    add_leader_entry("Table 4.4: System Alert and Response Time Evaluation", "56", level=1)
    
    doc.add_page_break()
    
    # -------------------------------------------------------------------------
    # PAGE ix: LIST OF ABBREVIATIONS
    # -------------------------------------------------------------------------
    p("LIST OF ABBREVIATIONS", bold=True, size=14, align=WD_ALIGN_PARAGRAPH.CENTER, space_before=16, space_after=18, line_spacing=1.15)
    
    abbreviations = [
        ("API", "Application Programming Interface"),
        ("BCA", "Bachelor in Computer Application"),
        ("BiLSTM", "Bidirectional Long Short-Term Memory"),
        ("CASE", "Computer-Aided Software Engineering"),
        ("CPU", "Central Processing Unit"),
        ("CSS", "Cascading Style Sheets"),
        ("CSV", "Comma-Separated Values"),
        ("DFD", "Data Flow Diagram"),
        ("EMA", "Exponential Moving Average"),
        ("ERD", "Entity-Relationship Diagram"),
        ("FOHSS", "Faculty of Humanities and Social Sciences"),
        ("GPU", "Graphics Processing Unit"),
        ("HTTP", "HyperText Transfer Protocol"),
        ("HTTPS", "HyperText Transfer Protocol Secure"),
        ("JSON", "JavaScript Object Notation"),
        ("JWT", "JSON Web Token"),
        ("LSTM", "Long Short-Term Memory"),
        ("LTP", "Last Traded Price"),
        ("MACD", "Moving Average Convergence Divergence"),
        ("NEPSE", "Nepal Stock Exchange"),
        ("OHLCV", "Open, High, Low, Close, Volume"),
        ("ORM", "Object-Relational Mapping"),
        ("REST", "Representational State Transfer"),
        ("RNN", "Recurrent Neural Network"),
        ("RSI", "Relative Strength Index"),
        ("SMA", "Simple Moving Average"),
        ("SQL", "Structured Query Language"),
        ("TMS", "Trade Management System"),
        ("TU", "Tribhuvan University"),
        ("UI", "User Interface"),
        ("UML", "Unified Modeling Language"),
        ("URL", "Uniform Resource Locator"),
        ("WSS", "WebSocket Secure"),
        ("XGBoost", "Extreme Gradient Boosting")
    ]
    
    tbl_abbr = doc.add_table(rows=len(abbreviations), cols=2)
    tbl_abbr.alignment = WD_TABLE_ALIGNMENT.CENTER
    tbl_abbr.autofit = False
    
    for idx, (abbr, full) in enumerate(abbreviations):
        row = tbl_abbr.rows[idx]
        trPr = row._tr.get_or_add_trPr()
        trPr.append(parse_xml(r'<w:cantSplit xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"/>'))
        
        c0 = row.cells[0]
        c1 = row.cells[1]
        c0.width = Inches(1.8)
        c1.width = Inches(4.2)
        
        set_cell_margins(c0, top=40, bottom=40, left=40, right=40)
        set_cell_margins(c1, top=40, bottom=40, left=40, right=40)
        
        p0 = c0.paragraphs[0]
        p0.alignment = WD_ALIGN_PARAGRAPH.LEFT
        p0.paragraph_format.line_spacing = 1.15
        p0.paragraph_format.space_before = Pt(1)
        p0.paragraph_format.space_after = Pt(1)
        r0 = p0.add_run(abbr)
        r0.bold = True
        r0.font.name = 'Times New Roman'
        r0.font.size = Pt(10.5)
        
        p1 = c1.paragraphs[0]
        p1.alignment = WD_ALIGN_PARAGRAPH.LEFT
        p1.paragraph_format.line_spacing = 1.15
        p1.paragraph_format.space_before = Pt(1)
        p1.paragraph_format.space_after = Pt(1)
        r1 = p1.add_run(full)
        r1.font.name = 'Times New Roman'
        r1.font.size = Pt(10.5)
        
    doc.add_page_break()
    
    # =========================================================================
    # SECTION 2: MAIN BODY CHAPTERS (ARABIC NUMERALS 1, 2, 3...)
    # =========================================================================
    sec_body = doc.add_section()
    sec_body.top_margin = Inches(1.0)
    sec_body.bottom_margin = Inches(1.0)
    sec_body.left_margin = Inches(1.25)
    sec_body.right_margin = Inches(1.0)
    add_page_number_to_section(sec_body, start_type="decimal", start_num=1)
    add_footer_page_number(sec_body)
    
    # -------------------------------------------------------------------------
    # CHAPTER 1: INTRODUCTION
    # -------------------------------------------------------------------------
    chapter_title("1", "Introduction")
    
    h1("1.1 Introduction")
    p_runs([
        ("Equity market participation in Nepal has undergone a structural revolution over the past five years. Driven by the digitization of public offerings through central depository platforms ("),
        ("MeroShare", True),
        (") and the introduction of online "),
        ("Trade Management Systems (TMS)", True),
        (", the investor base of the "),
        ("Nepal Stock Exchange (NEPSE)", True),
        (" has surged from a few hundred thousand to several million registered retail participants. Despite this mass influx of capital and individual traders, the computational and analytical infrastructure accessible to the average Nepalese investor remains primitive, fragmented, and predominantly reactive.")
    ])
    
    p_runs([
        ("In developed capital markets, institutional traders and retail investors utilize automated algorithmic trading engines, quantitative screening algorithms, and low-latency alerting frameworks to identify asymmetric risk-reward opportunities. In stark contrast, retail participants navigating "),
        ("NEPSE", True),
        (" are confronted with severe information asymmetry. The official stock exchange portal provides static, tabular price summaries that require constant manual page refreshes. Third-party charting portals either restrict advanced technical screening behind expensive recurring subscription tiers or suffer from delayed tick dissemination during volatile peak trading hours.")
    ])
    
    p_runs([
        ("Consequently, investors are forced to spend hours manually toggling between individual stock charts, calculating moving averages by hand, and attempting to monitor dozens of watchlist equities simultaneously. Under such cognitive strain, critical breakout levels, trend breakdowns, and volume surges are routinely missed. More critically, human decision-making under financial stress is inherently susceptible to cognitive biases, panic selling during temporary pullbacks, and speculative "),
        ("FOMO (Fear Of Missing Out)", True),
        (" buying at overextended market peaks.")
    ])
    
    p_runs([
        ("This project, the "),
        ("NEPSE Stock Prediction & Decision Support System", True),
        (", was conceived and engineered to resolve this technological divide. Built as a unified, high-performance web platform, the system delivers automated live market scraping, real-time technical indicator calculation, stacked machine learning price forecasting, customizable event-driven alerting, and interactive portfolio performance tracking. By synthesizing artificial intelligence with event-driven streaming architectures, the platform transforms raw market noise into objective, actionable financial intelligence.")
    ])
    
    p_runs([
        ("The core architecture is organized into two cooperating computational services: a modern "),
        ("NestJS", True),
        (" and "),
        ("TypeScript", True),
        (" application backend that manages user authentication, relational schemas, portfolio tracking, and real-time "),
        ("WebSocket", True),
        (" broadcasting; and a dedicated "),
        ("Python", True),
        (" machine learning microservice (built with "),
        ("FastAPI", True),
        (", "),
        ("PyTorch", True),
        (", and "),
        ("XGBoost", True),
        (") that executes numerical feature engineering, deep sequence modeling, and tree-based gradient boosting. Together, these subsystems provide a zero-latency decision support cockpit that continuously monitors the entire exchange, evaluates mathematical signals, and keeps the human investor informed and in control.")
    ])
    
    h1("1.2 Problem Statement")
    p_runs([
        ("Trading and investing in "),
        ("NEPSE", True),
        (" present unique operational and analytical challenges that distinguish the Nepalese market from larger, highly liquid global exchanges. Specifically, market participants are confronted by three fundamental bottlenecks:")
    ])
    
    p_bullet("i.", "Extreme Volatility and Rapid Reversals",
             "NEPSE is characterized by high retail concentration, leading to sharp price swings, speculative sector rotations, and rapid sentiment shifts. A stock can gap upward toward its 10% daily upper circuit breaker or plummet toward its lower circuit breaker within minutes. Investors without automated alerting capabilities cannot react in time to execute protective stop-losses or lock in capital gains.")
    
    p_bullet("ii.", "Information Asymmetry and Manual Fatigue",
             "Manually analyzing over 600 listed equities across commercial banks, hydropower, microfinance, insurance, and manufacturing sectors is physically impossible for an individual trader. Investors are overwhelmed by disorganized spreadsheets and delayed broker feeds, preventing timely identification of institutional accumulation or distribution patterns.")
    
    p_bullet("iii.", "Inadequacy of Standalone Predictive Models",
             "Financial time series are notoriously non-linear, non-stationary, and plagued by stochastic market noise. Traditional statistical forecasting models (such as ARIMA or Holt-Winters) fail to model non-linear trend dynamics, while naive single-layer neural networks tend to overfit historical noise and produce disastrously inaccurate predictions during market regime shifts.")
    
    p("There is an acute necessity for an affordable, localized, and mathematically rigorous decision support platform that combines sequential deep learning with robust tabular feature engineering, continuously polls exchange floor data, and instantly notifies investors of critical price action via audio-visual alerts.")
    
    h1("1.3 Objectives")
    p_runs([
        ("The primary objective of this project is to develop a complete, production-ready web application for real-time "),
        ("NEPSE", True),
        (" stock monitoring, algorithmic prediction, and quantitative decision support. The specific technical objectives are:")
    ])
    
    p_bullet("i.", "Automated Market Data Ingestion",
             "To design and implement an automated ingestion engine that scrapes live market quotes, floor sheets, and OHLCV historical time series from the NEPSE trading portal and stores normalized records in PostgreSQL.")
    
    p_bullet("ii.", "Real-Time Technical Indicator Engine",
             "To build a mathematical indicator computation pipeline that calculates key technical metrics—including Wilder's 14-period RSI, Moving Average Convergence Divergence (MACD), Bollinger Bands, and Exponential Moving Averages (EMA 9, 21, 50, 200)—in real time.")
    
    p_bullet("iii.", "Hybrid Predictive Machine Learning Architecture",
             "To develop a hybrid predictive machine learning model uniting stacked Bidirectional Long Short-Term Memory (BiLSTM) networks with Extreme Gradient Boosting (XGBoost) to forecast next-day equity closing prices and direction probabilities.")
    
    p_bullet("iv.", "Event-Driven Real-Time Alert Engine",
             "To construct a low-latency event-driven alert engine using WebSockets that evaluates price thresholds against live ticks and triggers browser notifications accompanied by audible alarm cues.")
    
    p_bullet("v.", "Interactive Decision Support Web Platform",
             "To create an intuitive, responsive React web interface featuring interactive TradingView-style candlestick charting, a multi-stock screener, a sectoral heatmap, stock comparison tools, and portfolio PnL tracking.")
    
    h1("1.4 Scope and Limitation")
    h2("1.4.1 Scope")
    p_bullet("i.", "Full Equity Exchange Coverage",
             "The platform tracks all active equities, debentures, and mutual funds listed on the exchange (over 640 scrips), categorizing them across 13 distinct economic sectors.")
    
    p_bullet("ii.", "Algorithmic Forecasting",
             "Generates next-day target prices, confidence intervals, and trend direction recommendations for top liquid securities based on 60-day rolling lookback windows.")
    
    p_bullet("iii.", "Real-Time Alert Engine",
             "Permits users to define custom price-target, percentage breakout, and volume alert rules, dispatched through persistent WebSocket connections with debounce protection.")
    
    p_bullet("iv.", "Portfolio Accounting",
             "Enables users to record buy and sell transactions, calculate real-time portfolio market value, compute realized and unrealized profit/loss, and view capital allocation distributions.")
    
    p_bullet("v.", "Responsive Web Portal",
             "Fully functional across modern desktop and mobile web browsers without requiring proprietary desktop terminal installations.")
    
    h2("1.4.2 Limitations")
    p_bullet("i.", "External Feed Reliability",
             "The live data ingestion engine depends on the operational availability and markup structure of public NEPSE trading endpoints; unexpected portal downtime or structural changes can disrupt live streaming.")
    
    p_bullet("ii.", "Exclusion of Unforeseen Macro Shocks",
             "Machine learning forecasts are strictly quantitative, based on technical and price-volume history; sudden political upheavals, regulatory monetary policy revisions, or unforeseen corporate scandals cannot be anticipated by historical pattern recognition alone.")
    
    p_bullet("iii.", "Lack of Direct Broker Order Execution",
             "Due to regulatory constraints enforced by the Securities Board of Nepal (SEBON), the system acts purely as a decision-support advisor and does not execute automated trades directly on broker TMS interfaces.")
    
    p_bullet("iv.", "Computational Training Overhead",
             "Retraining deep BiLSTM architectures across all 600+ equities simultaneously requires high-end GPU clusters; therefore, model weights are retrained periodically in offline batch pipelines, with online inference served via optimized cached weights.")
    
    doc.add_page_break()
    h1("1.5 Development Methodology")
    p_runs([
        ("This project adhered to the "),
        ("Incremental Development Life Cycle Model", True),
        (". Rather than attempting to engineer the entire complex financial platform in a single monolithic pass, development was structured into iterative, functional increments. Each increment encompassed requirement analysis, architectural design, coding, unit testing, and integration verification, delivering an operational slice of system functionality.")
    ])
    p_runs([
        ("The incremental paradigm proved ideal for this project due to the fundamentally divergent maturation lifecycles of its primary components: the web application architecture ("),
        ("NestJS", True),
        (", "),
        ("React", True),
        (", "),
        ("PostgreSQL", True),
        (") followed stable, predictable development trajectories, whereas the machine learning pipeline (sequence preprocessing, feature selection, hyperparameter optimization) demanded extensive empirical experimentation. Structuring the project into distinct increments allowed the predictive engine to be iteratively tuned and evaluated on historical datasets without disrupting the live operational status of the core web dashboard.")
    ])
    
    embed_diagram("assets/diagrams/fig1_1_incremental_lifecycle.png", "Figure 1.1: Incremental Development Life Cycle Model", width_in=5.6)
    
    h1("1.6 Report Organization")
    p_runs([
        ("This project report is structured into "),
        ("five cohesive chapters", True),
        (", tracing the progression from underlying theoretical motivation to system analysis, architectural design, implementation, and empirical validation:")
    ])
    p_bullet("i.", "Chapter 1 - Introduction",
             "This chapter establishes the background context of the Nepalese capital market, outlines the core problem statement, enumerates specific project objectives, delineates operational scope and limitations, and details the incremental development methodology.")
    
    p_bullet("ii.", "Chapter 2 - Background Study and Literature Review",
             "This chapter explores the foundational concepts of equity technical analysis, mathematical indicator formulations, deep time-series modeling with LSTM, gradient boosting with XGBoost, real-time WebSocket communication, and surveys seminal published literature in computational finance.")
    
    p_bullet("iii.", "Chapter 3 - System Analysis and Design",
             "This chapter presents the functional and non-functional requirements, feasibility assessment, Data Flow Diagrams (Level 0 and Level 1), Entity-Relationship Diagram (ERD), Class and Object models, dynamic state and sequence interactions, activity workflow, component and deployment topologies, and mathematical algorithm formulations.")
    
    p_bullet("iv.", "Chapter 4 - Implementation and Testing",
             "This chapter details the hardware and software technology stack, enumerates module implementation specifics, documents unit and system test cases, and provides thorough empirical result analysis comparing model prediction benchmarks and system latency.")
    
    p_bullet("v.", "Chapter 5 - Conclusion and Future Recommendations",
             "This chapter summarizes key deliverables, reflects on project outcomes, and highlights prospective extensions such as automated broker API routing, sentiment analysis, and mobile application porting.")
    
    doc.add_page_break()
    
    # -------------------------------------------------------------------------
    # CHAPTER 2: BACKGROUND STUDY AND LITERATURE REVIEW
    # -------------------------------------------------------------------------
    chapter_title("2", "Background Study and Literature Review")
    
    h1("2.1 Background Study")
    p("A thorough comprehension of the computational, mathematical, and economic foundations underpinning the NEPSE Stock Prediction & Decision Support System requires exploring market operational mechanics, quantitative technical indicators, time-series forecasting architectures, and real-time streaming protocols.")
    
    h2("2.1.1 Overview of NEPSE Market Mechanics")
    p("The Nepal Stock Exchange is the sole regulated securities exchange in Nepal. Trading operates five days a week (Sunday through Thursday) from 11:00 AM to 3:00 PM Nepal Standard Time (NST). The exchange utilizes a central continuous limit order book managed via the Trade Management System (TMS). Orders are matched according to strict price-time priority. To prevent extreme volatility and speculative manipulation, NEPSE enforces a 10% daily circuit breaker limit on individual securities, as well as graduated market-wide circuit breakers (4%, 5%, and 6%) that halt trading if the benchmark NEPSE Index experiences severe index-level shocks. Understanding these institutional rules is critical for modeling price boundary conditions and preventing predictive algorithms from outputting impossible price bounds exceeding the statutory 10% envelope.")
    
    h2("2.1.2 Technical Analysis & Mathematical Indicators")
    p("Technical analysis assumes that all publicly known information, corporate fundamentals, and market psychology are reflected directly in historical price and volume action. To construct robust feature representations for machine learning models, five classical technical indicators were mathematically modeled and integrated into the platform:")
    
    p_bullet("1.", "Relative Strength Index (RSI)",
             "Developed by J. Welles Wilder, the RSI is a momentum oscillator measuring the speed and change of price movements on a normalized scale from 0 to 100. Over a standard 14-period lookback window, average gains and average losses are computed using exponential smoothing:")
    p_equation("RS = Average Gain / Average Loss")
    p_equation("RSI = 100 - [100 / (1 + RS)]")
    p("Values above 70 indicate overbought market conditions where buying momentum has peaked, whereas values below 30 denote oversold conditions indicating potential mean-reversion buying opportunities.")
    
    embed_diagram("assets/diagrams/fig2_2_rsi_oscillator.png", "Figure 2.1: Wilder's 14-Period RSI Oscillator Bounds and Momentum Thresholds", width_in=5.8)
    
    p_bullet("2.", "Moving Average Convergence Divergence (MACD)",
             "Created by Gerald Appel, the MACD indicator reveals changes in the strength, direction, momentum, and duration of an equity trend. It computes the difference between a short-term 12-period Exponential Moving Average (EMA) and a long-term 26-period EMA:")
    p_equation("MACD Line = EMA_12(Close) - EMA_26(Close)")
    p_equation("Signal Line = EMA_9(MACD Line)")
    p_equation("MACD Histogram = MACD Line - Signal Line")
    p("A bullish crossover occurs when the MACD Line crosses above the Signal Line, confirmed by expanding positive histogram bars, signaling upward trend acceleration.")
    
    embed_diagram("assets/diagrams/fig2_3_macd_signals.png", "Figure 2.2: Moving Average Convergence Divergence (MACD) Signal Expansion & Crossover", width_in=5.8)
    
    p_bullet("3.", "Bollinger Bands (BB)",
             "Formulated by John Bollinger, Bollinger Bands enclose price volatility within a statistical envelope centered around a 20-day Simple Moving Average (SMA). The upper and lower bands are placed at a distance of two sample standard deviations (σ):")
    p_equation("Middle Band = SMA_20(Close)")
    p_equation("Upper Band = SMA_20 + (2 * σ_20)")
    p_equation("Lower Band = SMA_20 - (2 * σ_20)")
    p("When volatility contracts sharply, the bands squeeze together, frequently presaging an explosive directional breakout.")
    
    p_bullet("4.", "Exponential Moving Averages (EMA)",
             "Unlike simple moving averages that assign equal weight to all historical observations, EMAs apply exponentially decreasing weighting factors that prioritize recent trading sessions, reducing indicator lag:")
    p_equation("EMA_t = [Close_t * (2 / (N + 1))] + [EMA_{t-1} * (1 - (2 / (N + 1)))]")
    p("The system computes EMA_9, EMA_21, EMA_50, and EMA_200 to capture short, intermediate, and long-term trend regimes.")
    
    h2("2.1.3 Time-Series Financial Modeling & Deep Learning")
    p("Financial time series exhibit non-Gaussian fat-tailed return distributions, stochastic volatility clustering, and changing macroeconomic regimes. Simple feed-forward neural networks treat each time step as an independent observation, completely discarding the temporal ordering and sequential memory essential for modeling price action. To overcome these limitations, recurrent deep learning architectures designed specifically for sequence processing are required.")
    
    h2("2.1.4 Recurrent Neural Networks & LSTM Architectures")
    p("Standard Recurrent Neural Networks (RNNs) suffer from the vanishing and exploding gradient problem when trained via backpropagation through time over long sequences. Long Short-Term Memory (LSTM) networks, introduced by Hochreiter and Schmidhuber [1], overcome this bottleneck through specialized memory cells regulated by three multiplicative gating mechanisms: the Forget Gate (which decides what past information to discard), the Input Gate (which determines what new information to store in the cell state), and the Output Gate (which controls what information from the cell state to emit as hidden state output). This gated cell state enables LSTMs to retain critical long-term temporal dependencies across multi-week trading sequences.")
    
    h2("2.1.5 Extreme Gradient Boosting (XGBoost) Framework")
    p("While deep sequential networks excel at extracting latent representations from raw sequential data, tree-based ensemble methods—specifically Extreme Gradient Boosting (XGBoost) formulated by Chen and Guestrin [2]—consistently demonstrate superior predictive performance on tabular, engineered technical features. XGBoost constructs an ensemble of decision trees sequentially, optimizing a second-order Taylor expansion of the loss function with explicit L1 and L2 regularization to prevent overfitting on noisy financial data.")
    
    h2("2.1.6 Hybrid Sequential-Tabular Feature Engineering")
    p("Recognizing that sequential OHLCV series and tabular technical indicators possess complementary predictive properties, this project implements a hybrid stacking architecture. The temporal memory vector produced by a stacked BiLSTM is concatenated with scaled tabular features (RSI, MACD, Bollinger Bands, Volume Moving Averages) and passed into an ensemble meta-regressor, yielding enhanced predictive stability and lower generalization error.")
    
    embed_diagram("assets/diagrams/fig2_1_hybrid_architecture.png", "Figure 2.3: NEPSE Hybrid Sequential-Tabular Machine Learning Architecture", width_in=5.8)
    
    h2("2.1.7 Real-Time WebSockets & Modern Alerting Architectures")
    p("Traditional HTTP request-response architectures require continuous client-side polling, which introduces unacceptable latency and server overhead during peak market sessions. The WebSocket protocol (RFC 6455) provides full-duplex, bidirectional communication over a single persistent TCP connection. By establishing WebSocket channels between the NestJS backend gateway and connected React clients, price ticks and alert triggers are pushed to users with sub-millisecond network transport latency.")
    
    # Page break before major section 2.2
    doc.add_page_break()
    
    h1("2.2 Literature Review")
    h2("2.2.1 Review of Related Works")
    p("Extensive academic literature has investigated the application of computational intelligence, deep learning, and algorithmic systems in financial market forecasting:")
    p("Hochreiter and Schmidhuber [1] introduced the foundational Long Short-Term Memory architecture, proving that constant error carousels within recurrent memory cells effectively eliminate the vanishing gradient problem. Their mathematical formulations established the bedrock upon which modern sequential financial prediction models are built.")
    p("Chen and Guestrin [2] published the XGBoost algorithm, demonstrating that scalable end-to-end tree boosting systems with weighted quantile sketch algorithms and sparsity-aware split finding achieve state-of-the-art results across complex tabular datasets, providing the mathematical rationale for our tabular technical indicator engine.")
    p("Nelson, Oliveira, and de Oliveira [3] investigated the application of LSTM networks for predicting stock price movement directional changes based on technical indicators. Evaluating their model across Brazilian equity markets, they achieved a directional accuracy of 55.9%, proving that LSTMs substantially outperform traditional multilayer perceptrons and random forest baselines in capturing market turning points.")
    p("Fischer and Krauss [4] conducted an extensive empirical study applying deep LSTMs to the S&P 500 constituents from 1992 to 2015. Their findings revealed that LSTMs effectively capture complex cross-sectional non-linear interactions and temporal memory, generating significant risk-adjusted alpha compared to standard memory-free classifiers.")
    p("Shahi, Shrestha, and Neupane [5] investigated stock market prediction specifically within the Nepal Stock Exchange (NEPSE) using Support Vector Regression (SVR) and Artificial Neural Networks (ANN). Their findings demonstrated that machine learning models could identify meaningful price momentum in Nepalese equities, but emphasized that high volatility and thin liquidity created substantial noise that simple neural models struggled to filter.")
    p("Paudel, Sharma, and Khatiwada [6] explored hybrid modeling in emerging South Asian stock markets, proposing an integrated architecture combining autoregressive sequence processing with gradient boosting. Their work established that combining sequential representations with explicit technical momentum indicators delivered lower Root Mean Square Error than single-model approaches.")
    
    h2("2.2.2 Comparative Summary of Literature")
    p("The surveyed literature confirms that pure sequence models (LSTM) capture temporal dependencies while ensemble tree methods (XGBoost) excel at tabular indicator rules. However, existing literature in the Nepalese context focuses almost exclusively on offline historical backtesting and entirely overlooks real-time systems engineering, live floor-sheet scraping, low-latency WebSocket alert dispatch, and end-to-end portfolio decision support. This project bridges this critical gap.")
    
    doc.add_page_break()
    
    # -------------------------------------------------------------------------
    # CHAPTER 3: SYSTEM ANALYSIS AND DESIGN
    # -------------------------------------------------------------------------
    chapter_title("3", "System Analysis and Design")
    
    h1("3.1 System Analysis")
    p("System analysis represents the critical phase of software engineering where system requirements, entity relationships, dynamic interactions, and behavioral workflows are rigorously decomposed. An object-oriented and event-driven analytical methodology was adopted to model the NEPSE Stock Prediction & Decision Support System.")
    
    h2("3.1.1 Requirements Analysis")
    p("System requirements are systematically categorized into Functional and Non-Functional requirements.")
    
    p("I. Functional Requirements", bold=True)
    p_bullet("i.", "User Authentication and Role Management",
             "A user can register with email and password, log in securely via JWT authentication, and access personalized dashboards and saved alert rules.")
    
    p_bullet("ii.", "Automated Live Market Scraping & Ingestion",
             "The system automatically scrapes live market prices, trading volume, turnover, and floor transactions from NEPSE every 30 seconds during active trading hours.")
    
    p_bullet("iii.", "Technical Indicator Computation",
             "The system automatically computes key mathematical indicators including Wilder's 14-period RSI, MACD lines, Bollinger Bands, and multi-period EMAs across all listed stocks.")
    
    p_bullet("iv.", "Predictive Machine Learning Inference",
             "The system runs a hybrid BiLSTM and XGBoost ensemble model to generate next-day closing price forecasts, confidence intervals, and trend direction indications.")
    
    p_bullet("v.", "Customizable Real-Time Price Alerts",
             "Users can configure custom threshold rules based on target prices, percentage breakouts, or stop-loss limits for any tracked NEPSE stock.")
    
    p_bullet("vi.", "Event-Driven Audio-Visual Alert Dispatch",
             "When a live market tick breaches an active user threshold, the system immediately pushes a real-time WebSocket notification and triggers an audible alarm siren.")
    
    p_bullet("vii.", "Interactive Candlestick Charting",
             "Users can inspect historical OHLCV candlestick charts, toggle technical indicator overlays, and view model forecast projections.")
    
    p_bullet("viii.", "Portfolio and Profit/Loss Management",
             "Investors can record buy and sell stock transactions, track live portfolio valuation, and evaluate realized and unrealized profit/loss.")
    
    p_bullet("ix.", "Multi-Stock Screener & Market Movers",
             "Users can filter top gainers, top losers, high turnover stocks, and view sector distribution heatmaps across all 640+ equities.")
    
    p_bullet("x.", "Stock Comparison Matrix",
             "Investors can select multiple equities to compare price performance, technical momentum, and volatility side-by-side.")
    
    embed_diagram("assets/diagrams/fig3_1_use_case.png", "Figure 3.1: Use Case Diagram of NEPSE Stock Prediction & Decision Support System", width_in=5.4)
    
    table_caption("Table 3.1: Use Case Description for NEPSE Decision Support System")
    uc_headers = ["Use Case ID", "Use Case Name", "Primary Actor", "Preconditions", "Basic Flow", "Postconditions"]
    uc_data = [
        ["UC-01", "Register & Log In", "Investor, Admin", "User has valid email credentials", "User enters credentials; system validates and signs JWT token", "Session authenticated; redirected to dashboard"],
        ["UC-02", "View Live Ticker", "Investor", "System operational, market session active", "Client connects to WS gateway; server streams ticks", "Live prices rendered in real-time"],
        ["UC-03", "Run ML Prediction", "Investor, Trader", "Historical OHLCV stored in DB", "User queries stock; backend invokes FastAPI ML inference", "Predicted target price & direction displayed"],
        ["UC-04", "Create Alert Rule", "Investor", "User logged in; stock selected", "User inputs target price & condition; clicks save", "Rule saved in DB; registered in alert engine"],
        ["UC-05", "Trigger Alert Siren", "Alert Daemon", "Live tick breaches target threshold", "Engine matches rule; dispatches WS alert to client", "Audible siren sounds; alert modal rendered"],
        ["UC-06", "Manage Portfolio", "Portfolio Manager", "User authenticated", "User logs buy/sell trade; system recalculates PnL", "Holdings, cash, and PnL metrics updated"],
        ["UC-07", "Filter Screener", "Investor", "Exchange data available", "User sets volume/RSI filters; table filters dynamically", "Matching equities listed instantaneously"],
        ["UC-08", "Compare Equities", "Investor", "Two or more stocks selected", "System loads OHLCV & indicators; renders comparative grid", "Comparative matrix displayed"]
    ]
    create_styled_table(doc, uc_headers, uc_data, [0.8, 1.2, 1.0, 1.0, 1.1, 1.1], alignments=['C', 'L', 'L', 'L', 'L', 'L'])
    
    p("II. Non-Functional Requirements", bold=True)
    p_bullet("i.", "Performance & Low Latency",
             "Live market price updates and alert notifications must reach connected client browsers within 200 milliseconds.")
    
    p_bullet("ii.", "Predictive Accuracy & Reliability",
             "The machine learning forecasting engine must maintain an average directional trend accuracy above 75% on liquid benchmark equities.")
    
    p_bullet("iii.", "Scalability & Concurrency",
             "The backend architecture must handle up to 5,000 concurrent active WebSocket client connections without dropped messages or connection degradation.")
    
    p_bullet("iv.", "Security & Data Integrity",
             "All REST endpoints and WebSocket channels must be encrypted using HTTPS/WSS and authenticated with JSON Web Tokens. Passwords must be hashed using bcrypt.")
    
    p_bullet("v.", "Fault Tolerance & Graceful Degradation",
             "If the live NEPSE scraper encounters portal timeouts, the platform must serve cached market quotes rather than failing user requests.")
    
    p_bullet("vi.", "Usability & Ergonomics",
             "The web user interface must provide a sleek, high-contrast dark theme with clear visual hierarchy, audible alerts, and intuitive navigation.")
    
    h2("3.1.2 Feasibility Analysis")
    p("A comprehensive feasibility analysis evaluated the technical, economic, operational, and schedule dimensions of the project:")
    p_bullet("i.", "Technical Feasibility",
             "The system is built using mature, well-documented open-source technologies: NestJS and TypeScript for the application gateway, React and Vite for the interface, PostgreSQL for relational storage, Redis for caching, and Python with FastAPI, PyTorch, and XGBoost for machine learning. All components run efficiently on standard multi-core CPU servers.")
    
    p_bullet("ii.", "Economic Feasibility",
             "All programming frameworks, libraries, database engines, and language runtimes are 100% open source. The platform requires zero recurring API subscription fees or proprietary license costs.")
    
    p_bullet("iii.", "Operational Feasibility",
             "The platform addresses real-world challenges faced by Nepalese retail traders by replacing manual chart checking with automated background monitoring, making it highly valuable and easy to adopt.")
    
    p_bullet("iv.", "Schedule Feasibility",
             "The project was planned, executed, and completed across a structured 9-week timeline, with dedicated phases for requirements, architecture, coding, testing, and documentation as shown in the Gantt chart below.")
    
    embed_diagram("assets/diagrams/fig3_4_gantt_chart.png", "Figure 3.2: Project Implementation Timeline (Gantt Chart)", width_in=5.8)
    
    h2("3.1.3 Data Flow Modeling (Level 0 and Level 1 DFD)")
    p("Data Flow Diagrams visualize the flow of information through the system, illustrating external entities, transformation processes, and underlying data repositories.")
    p("The Level 0 Context Diagram establishes the global boundary of the system. The central process (0.0 NEPSE Stock Prediction & Decision Support System) interacts with three primary external entities: the User/Investor, the NEPSE Market Exchange / Data Source, and Notification Gateways.")
    
    embed_diagram("assets/diagrams/fig3_2_dfd_level0.png", "Figure 3.3: Level 0 DFD (Context Diagram) of NEPSE System", width_in=5.8)
    
    p("The Level 1 Data Flow Diagram decomposes the system into five core functional sub-processes: Process 1.0 (Data Ingestion & Normalization), Process 2.0 (Technical Feature Engineering), Process 3.0 (Hybrid ML Inference), Process 4.0 (Rule Matching & Alert Engine), and Process 5.0 (Portfolio Accounting & Reporting), linked across five relational data stores.")
    
    embed_diagram("assets/diagrams/fig3_3_dfd_level1.png", "Figure 3.4: Level 1 DFD of NEPSE Stock Prediction & Decision Support System", width_in=5.8)
    
    h2("3.1.4 Data Modeling using Entity-Relationship Diagram (ERD)")
    p("The Entity-Relationship Diagram defines the conceptual database architecture, illustrating relational entities, primary keys, foreign key constraints, and relational cardinalities (1:M and M:N). The relational schema was normalized to Third Normal Form (3NF) to guarantee transactional ACID integrity, eliminate update anomalies, and optimize join efficiency.")
    
    embed_diagram("assets/diagrams/fig3_5_erd.png", "Figure 3.5: Entity-Relationship Diagram (ERD) with Relational Cardinalities", width_in=5.8)
    
    h2("3.1.5 Object Modeling using Class and Object Diagram")
    p("Object modeling captures the static architectural hierarchy and runtime object snapshots of the system.")
    p("The Class Diagram illustrates the primary structural classes: User, Stock, HistoricalQuote, TechnicalIndicatorEngine, PredictiveModelEngine, AlertEngine, Portfolio, and Transaction, detailing attributes, public and private member methods, and associations.")
    
    embed_diagram("assets/diagrams/fig3_6_class_diagram.png", "Figure 3.6: Class Diagram of NEPSE Stock Prediction & Decision Support System", width_in=5.8)
    
    p("The Object Diagram illustrates a concrete runtime snapshot of objects during an active trading session: user instance `u1:User` (Eshan Giri) monitoring stock `s1:Stock` (NABIL), which is linked to historical quotes, indicator calculations, an active alert rule `alert1:AlertRule`, and model prediction `pred1:ModelPrediction`.")
    
    embed_diagram("assets/diagrams/fig3_7_object_diagram.png", "Figure 3.7: Object Diagram Snapshot of NEPSE System State", width_in=5.8)
    
    h2("3.1.6 Dynamic Modeling using State and Sequence Diagrams")
    p("Dynamic modeling illustrates the time-dependent behavioral transitions and message exchanges between system components.")
    p("The State Machine Diagram traces the complete lifecycle of a user alert rule: from creation to active monitoring, tick evaluation, threshold breach, debounce verification, audio-visual dispatch, cooldown, and eventual dismissal.")
    
    embed_diagram("assets/diagrams/fig3_8_state_diagram.png", "Figure 3.8: State Machine Diagram of Real-Time Alert Engine Lifecycle", width_in=5.8)
    
    p("Figure 3.9 illustrates the Sequence Diagram for Market Data Ingestion & Live Broadcast, detailing how the Python scraping daemon extracts floor data, posts it to the NestJS gateway, commits records to PostgreSQL, and broadcasts real-time tick payloads across connected WebSocket clients.")
    
    embed_diagram("assets/diagrams/fig3_9_seq_ingestion.png", "Figure 3.9: Sequence Diagram of Market Data Ingestion & Live Broadcast", width_in=5.8)
    
    p("Figure 3.10 illustrates the Sequence Diagram for Predictive ML Inference, detailing the sequence from user request to feature preparation, tensor scaling, deep BiLSTM forward propagation, XGBoost ensemble blending, and frontend forecast visualization.")
    
    embed_diagram("assets/diagrams/fig3_10_seq_ml_inference.png", "Figure 3.10: Sequence Diagram of Predictive ML Inference & Indicator Calculation", width_in=5.8)
    
    p("Figure 3.11 illustrates the Sequence Diagram for Real-Time Alert Evaluation & Dispatch, demonstrating tick evaluation, rule matching, audio siren synthesis, and immediate client-side modal alerts.")
    
    embed_diagram("assets/diagrams/fig3_11_seq_alert_dispatch.png", "Figure 3.11: Sequence Diagram of Real-Time Alert Evaluation & Dispatch", width_in=5.8)
    
    h2("3.1.7 Process Modeling using Activity Diagram")
    p("The Activity Diagram models the overall operational workflow across three synchronized swimlanes: Investor (Frontend UI), Backend (NestJS / Database), and Engine (ML & Alert Daemon). It illustrates the sequential path from logging in, viewing stock metrics, generating predictive models, setting alert thresholds, detecting live price breaches, sounding alarm sirens, and recording trades in portfolio management.")
    
    embed_diagram("assets/diagrams/fig3_12_activity_diagram.png", "Figure 3.12: Activity Diagram of User Workflow & Trading Decision Support", width_in=5.6)
    
    # Page break before major section 3.2
    doc.add_page_break()
    
    # -------------------------------------------------------------------------
    # 3.2 SYSTEM DESIGN (STARTS ON NEW PAGE)
    # -------------------------------------------------------------------------
    h1("3.2 System Design")
    p("The system architecture follows a microservice-oriented and modular pattern, decoupling the presentation layer, the application gateway, the numerical machine learning engine, and the underlying persistence layer.")
    
    h2("3.2.1 Component Diagram")
    p("The Component Diagram delineates the system's modular software components: the Frontend Client (React/Vite with TradingView charts and screener modules), the Backend API (NestJS gateway with WebSocket handlers and Prisma ORM), the AI Microservice (FastAPI with PyTorch and XGBoost), PostgreSQL Database, and Redis In-Memory Cache.")
    
    embed_diagram("assets/diagrams/fig3_13_component_diagram.png", "Figure 3.13: Component Diagram of NEPSE System", width_in=5.8)
    
    h2("3.2.2 Deployment Diagram")
    p("The Physical Deployment Diagram illustrates the runtime hosting environment: client devices connecting over HTTPS and WSS to an Nginx reverse proxy, routing requests to the Node.js application server (port 3000), the Python FastAPI ML microservice (port 8000), PostgreSQL (port 5432), and Redis (port 6379).")
    
    embed_diagram("assets/diagrams/fig3_14_deployment_diagram.png", "Figure 3.14: Physical Deployment Diagram of NEPSE Production Architecture", width_in=5.8)
    
    # Page break before major section 3.3
    doc.add_page_break()
    
    # -------------------------------------------------------------------------
    # 3.3 ALGORITHM DETAILS (STARTS ON NEW PAGE, FORMATTED LIKE SCREENSHOT 3)
    # -------------------------------------------------------------------------
    h1("3.3 Algorithm Details")
    p("The core of the system is a hybrid quantitative algorithm that combines sequential deep learning with gradient boosted decision trees and real-time threshold evaluation. The technical indicator computation, normalization pipelines, ensemble stacking, and real-time event-matching logic are implemented from scratch, utilizing PyTorch for tensor backpropagation and XGBoost for tree regularization.")
    
    p("I. Market Data Preprocessing and Normalization", bold=True)
    p("Before sequential feeding and feature engineering, raw exchange trade records are cleaned and normalized in three steps:")
    p_numbered_step("1", "Trade rows containing zero volume, non-trading holiday gaps, or null price fields are filtered.")
    p_numbered_step("2", "Price splits, bonus adjustments, and right share issuances are adjusted to maintain historical continuity.")
    p_numbered_step("3", "Continuous price and volume series are transformed via Min-Max scaling to the bounded interval [0, 1]:")
    
    p_equation("x_scaled = (x - x_min) / (x_max - x_min)")
    
    p("During live prediction, normalized output tensors are converted back to actual Nepalese Rupee prices using the inverse transformation:")
    p_equation("x_actual = x_scaled * (x_max - x_min) + x_min")
    
    p("II. Relative Strength Index (RSI) Formulation", bold=True)
    p("Wilder's 14-period RSI calculates upward momentum and downward exhaustion through exponential smoothing over window N = 14:")
    p_numbered_step("1", "Compute price differences: Change_t = Close_t - Close_{t-1}.")
    p_numbered_step("2", "Separate positive upward gains (U_t) and downward negative losses (D_t):")
    p_equation("U_t = max(Change_t, 0),    D_t = max(-Change_t, 0)")
    p_numbered_step("3", "Calculate smoothed moving averages:")
    p_equation("AvgGain_t = [(AvgGain_{t-1} * 13) + U_t] / 14")
    p_equation("AvgLoss_t = [(AvgLoss_{t-1} * 13) + D_t] / 14")
    p_numbered_step("4", "Compute the Relative Strength ratio and normalized oscillator:")
    p_equation("RS = AvgGain_t / AvgLoss_t")
    p_equation("RSI_t = 100 - [100 / (1 + RS)]")
    
    p("III. Moving Average Convergence Divergence (MACD) Formulation", bold=True)
    p("The MACD indicator tracks trend momentum through exponential moving averages of closing prices:")
    p_numbered_step("1", "Calculate the 12-period fast EMA and 26-period slow EMA using smoothing factor alpha = 2 / (N + 1):")
    p_equation("EMA_{12,t} = Close_t * (2/13) + EMA_{12,t-1} * (11/13)")
    p_equation("EMA_{26,t} = Close_t * (2/27) + EMA_{26,t-1} * (25/27)")
    p_numbered_step("2", "Derive the MACD line as the difference between fast and slow averages:")
    p_equation("MACD_t = EMA_{12,t} - EMA_{26,t}")
    p_numbered_step("3", "Formulate the 9-period Signal line and Momentum Histogram:")
    p_equation("Signal_t = MACD_t * (2/10) + Signal_{t-1} * (8/10)")
    p_equation("Histogram_t = MACD_t - Signal_t")
    
    p("IV. Bollinger Bands Volatility Envelope", bold=True)
    p("Market volatility is encapsulated using a 20-period Simple Moving Average and sample standard deviation:")
    p_numbered_step("1", "Compute the middle moving average:")
    p_equation("Middle_t = (1 / 20) * ∑_{i=0}^{19} Close_{t-i}")
    p_numbered_step("2", "Calculate sample standard deviation:")
    p_equation("σ_t = √[ (1 / 20) * ∑_{i=0}^{19} (Close_{t-i} - Middle_t)^2 ]")
    p_numbered_step("3", "Establish upper and lower volatility envelopes:")
    p_equation("Upper_t = Middle_t + (2 * σ_t)")
    p_equation("Lower_t = Middle_t - (2 * σ_t)")
    
    p("V. Stacked Bidirectional Long Short-Term Memory (BiLSTM) Architecture", bold=True)
    p("Sequential temporal dependencies across 60-day rolling lookback windows are extracted via gated recurrent cells:")
    p_numbered_step("1", "Forget Gate decides what past cell information to drop:")
    p_equation("f_t = σ(W_f · [h_{t-1}, x_t] + b_f)")
    p_numbered_step("2", "Input Gate and Candidate Vector determine what new information to store:")
    p_equation("i_t = σ(W_i · [h_{t-1}, x_t] + b_i)")
    p_equation("C̃_t = tanh(W_c · [h_{t-1}, x_t] + b_c)")
    p_numbered_step("3", "Memory Cell State is updated:")
    p_equation("C_t = f_t * C_{t-1} + i_t * C̃_t")
    p_numbered_step("4", "Output Gate produces the hidden state representation:")
    p_equation("o_t = σ(W_o · [h_{t-1}, x_t] + b_o)")
    p_equation("h_t = o_t * tanh(C_t)")
    
    p("VI. Hybrid Stacking Meta-Learner & Prediction Bounds", bold=True)
    p("The sequential latent embedding from BiLSTM and the non-linear decision tree output from XGBoost are combined using an optimized meta-regression formula:")
    p_equation("ŷ_Ensemble = 0.55 * ŷ_BiLSTM + 0.45 * ŷ_XGBoost")
    p("Prediction confidence boundaries are calculated using the validation root mean square error:")
    p_equation("Confidence Envelope = ŷ_Ensemble ± (1.96 * RMSE_Validation)")
    
    p("VII. Real-Time Threshold Alert Evaluation Algorithm", bold=True)
    p("Incoming live market ticks are processed through an event-driven debounce pipeline:")
    p_numbered_step("1", "Extract live tick: Tick(symbol, price, volume, timestamp).")
    p_numbered_step("2", "Match symbol against active user alert rules in memory.")
    p_numbered_step("3", "Check condition threshold:")
    p("   • For 'Price >= Target': trigger if Tick.price >= rule.target_price.")
    p("   • For 'Price <= StopLoss': trigger if Tick.price <= rule.target_price.")
    p_numbered_step("4", "Verify debounce interval: suppress alert if identical rule fired within 300 seconds.")
    p_numbered_step("5", "Transmit WebSocket payload to user channel; client triggers Web Audio siren and visual banner.")
    
    doc.add_page_break()
    
    # -------------------------------------------------------------------------
    # CHAPTER 4: IMPLEMENTATION AND TESTING
    # -------------------------------------------------------------------------
    chapter_title("4", "Implementation and Testing")
    
    h1("4.1 Implementation")
    p("This section presents the programming languages, software libraries, database platforms, and modular architectural implementations utilized to develop the platform.")
    
    h2("4.1.1 Tools Used")
    p_bullet("•", "Node.js & NestJS", "Used to build the enterprise-grade REST and WebSocket application gateway, incorporating dependency injection, modular controllers, and guards.")
    p_bullet("•", "TypeScript", "Employed across backend and frontend codebases to enforce compile-time strict typing and prevent runtime type coercion bugs.")
    p_bullet("•", "Prisma ORM", "Utilized as the database object-relational mapping layer, providing type-safe SQL queries, schema migrations, and relational modeling.")
    p_bullet("•", "PostgreSQL 16", "Primary relational database for persisting user profiles, historical stock quotes, order book depth, portfolio holdings, and alert configurations.")
    p_bullet("•", "Redis 7.2", "In-memory cache and message broker utilized for storing live tick state, managing pub/sub channels, and enforcing alert debounce windows.")
    p_bullet("•", "Python 3.11, FastAPI & Uvicorn", "High-performance asynchronous microservice framework used to serve machine learning inference endpoints.")
    p_bullet("•", "PyTorch 2.2", "Deep learning framework utilized to build, train, and execute the stacked Bidirectional LSTM neural network architectures.")
    p_bullet("•", "XGBoost", "Optimized distributed gradient boosting library used to model tabular technical indicator feature interactions.")
    p_bullet("•", "React 19 & Vite", "Fast, modern user interface library and build tooling providing instant Hot Module Replacement (HMR) and optimized static bundles.")
    p_bullet("•", "Tailwind CSS & Lucide Icons", "Utility-first CSS styling framework and iconography used to build a polished, high-contrast dark-mode user experience.")
    p_bullet("•", "Git & GitHub", "Distributed version control systems used for source code management, branching, and automated pipeline workflows.")
    
    h2("4.1.2 Implementation Details of Modules")
    p_bullet("i.", "Authentication & Security Module",
             "Employs JSON Web Tokens (JWT) signed with HMAC-SHA256 secrets. User passwords are salted with 12 rounds of bcrypt hashing before database storage. Route guards intercept HTTP requests and WebSocket handshakes, validating tokens and rejecting unauthorized access.")
    
    p_bullet("ii.", "Market Data Ingestion Scraper Daemon",
             "Built in Python using BeautifulSoup and Requests, the scraper polls public NEPSE endpoints every 30 seconds during active trading hours (11:00 AM – 3:00 PM). It normalizes raw scraped payloads into structured OHLCV tuples and dispatches batch upsert transactions into PostgreSQL.")
    
    p_bullet("iii.", "Technical Indicator Engine",
             "Implemented as a high-speed vectorized numerical calculation service. Upon receiving updated daily quotes, it computes rolling 14-period RSI, MACD lines, Bollinger Band spreads, and EMAs (9, 21, 50, 200), writing cached indicator states into Redis.")
    
    p_bullet("iv.", "AI Predictive Microservice",
             "A standalone FastAPI service that exposes `/predict/{symbol}` and `/batch-predict` endpoints. The service maintains pre-loaded PyTorch model checkpoints and trained XGBoost boosters in memory, enabling sub-50ms inference latencies on CPU environments.")
    
    p_bullet("v.", "Real-Time Alert Engine & WebSocket Gateway",
             "Implemented within NestJS using `@nestjs/websockets` and Socket.IO. When the ingestion daemon commits an updated tick, the gateway evaluates active price rules against the new LTP. Triggered events dispatch a JSON payload to the user's specific room socket, firing audio sirens and visual banners.")
    
    p_bullet("vi.", "Interactive Frontend Trading Dashboard",
             "Developed in React using reusable components. Includes a full-screen candlestick chart with indicator overlays, a live ticker marquee ribbon, a multi-stock screener with search filters, an interactive stock comparison modal, and a portfolio wealth management tracker.")
    
    # Page break before major section 4.2
    doc.add_page_break()
    
    # -------------------------------------------------------------------------
    # 4.2 TESTING (STARTS ON NEW PAGE, SUCCESS COLUMN REMOVED)
    # -------------------------------------------------------------------------
    h1("4.2 Testing")
    p("A multi-tier testing strategy was executed to verify individual computational units in isolation and ensure seamless integration across services.")
    
    h2("4.2.1 Test Cases for Unit Testing")
    p("Unit tests verified core mathematical functions, indicator calculations, tensor formatting, authentication routines, and database mutations.")
    
    table_caption("Table 4.1: Test Cases for Unit Testing")
    # SUCCESS/STATUS COLUMN REMOVED AS REQUESTED
    ut_headers = ["Test ID", "Unit Under Test", "Input Conditions", "Expected Output"]
    ut_data = [
        ["UT-01", "minmax_scaler()", "Raw price series [450, 500, 550]", "Normalized float array [0.0, 0.5, 1.0]"],
        ["UT-02", "inverse_transform()", "Normalized 0.5 with [450, 550] bounds", "De-normalized price 500.00"],
        ["UT-03", "compute_rsi()", "14-day constant upward price series", "RSI value approaches 100.0 (overbought)"],
        ["UT-04", "compute_macd()", "12-day EMA = 520, 26-day EMA = 510", "MACD line = +10.0"],
        ["UT-05", "bollinger_bands()", "20-day SMA = 400, std_dev = 15", "Upper = 430.0, Lower = 370.0"],
        ["UT-06", "lstm_tensor_reshape()", "DataFrame of 60 rows with 5 OHLCV cols", "3D Tensor shape [1, 60, 5]"],
        ["UT-07", "xgboost_eval()", "Vector of 12 normalized technical metrics", "Point forecast float value within ±10%"],
        ["UT-08", "alert_condition()", "LTP = 522.0, Rule: Price >= 520.0", "Returns Boolean True (Triggered)"],
        ["UT-09", "alert_debounce()", "Repeated tick trigger within 60 seconds", "Returns Boolean False (Suppressed)"],
        ["UT-10", "jwt_sign_verify()", "Valid user payload + secret key", "Valid decoded payload; token not expired"],
        ["UT-11", "portfolio_pnl()", "Buy 100 units @ 400; Current LTP = 450", "Unrealized PnL = +NPR 5,000 (+12.5%)"],
        ["UT-12", "quote_batch_upsert()", "Batch of 50 new stock ticks", "Database transaction committed atomically"]
    ]
    create_styled_table(doc, ut_headers, ut_data, [0.9, 1.5, 1.8, 1.8], alignments=['C', 'L', 'L', 'L'])
    
    h2("4.2.2 Test Cases for System & Integration Testing")
    p("System testing evaluated complete end-to-end user workflows, asynchronous message queues, WebSocket broadcasts, and microservice HTTP communications.")
    
    table_caption("Table 4.2: Test Cases for System & Integration Testing")
    # SUCCESS/STATUS COLUMN REMOVED AS REQUESTED
    st_headers = ["Test ID", "Scenario", "Test Execution Steps", "Expected System Behavior"]
    st_data = [
        ["ST-01", "Live Floor Ingestion", "Ingestion worker scrapes NEPSE and posts batch", "Database upserted; Redis cache updated; no data loss"],
        ["ST-02", "WebSocket Broadcast", "New tick emitted to WebSocket gateway", "Connected frontend clients receive tick within 150ms"],
        ["ST-03", "End-to-End Prediction", "Client requests 1-day forecast for NABIL", "FastAPI computes hybrid forecast; rendered on chart"],
        ["ST-04", "Price Threshold Alert", "Set alert NABIL >= 520; ingest tick 522.50", "WebSocket notification pushed; audio siren sounds"],
        ["ST-05", "Stop-Loss Trigger", "Set alert SHIVM <= 480; ingest tick 478.00", "Warning alert modal triggered; flagged on dashboard"],
        ["ST-06", "Portfolio Rebalancing", "Record purchase of 200 CHCL @ 410", "Holdings updated; cash debited; PnL tracked"],
        ["ST-07", "Multi-Stock Screener", "Apply filter: RSI < 35 AND Turnover > 1 Crore", "Screener table filters matching equities in < 50ms"],
        ["ST-08", "Stock Comparison", "Select NABIL, GBIME, and NICA for compare", "Renders normalized comparative performance overlay"],
        ["ST-09", "Service Fault Recovery", "Simulate FastAPI microservice temporary outage", "Backend returns cached predictions; UI remains stable"],
        ["ST-10", "Client Disconnection", "Client network disconnected and restored", "WebSocket automatically reconnects and re-syncs state"]
    ]
    create_styled_table(doc, st_headers, st_data, [0.9, 1.5, 1.8, 1.8], alignments=['C', 'L', 'L', 'L'])
    
    # Page break before major section 4.3
    doc.add_page_break()
    
    # -------------------------------------------------------------------------
    # 4.3 RESULT ANALYSIS (STARTS ON NEW PAGE, SIMPLIFIED & EXPLAINED)
    # -------------------------------------------------------------------------
    h1("4.3 Result Analysis")
    p("The practical utility and computational performance of the NEPSE Stock Prediction & Decision Support System were evaluated using real-world trading data across five benchmark equities representing major sectors of the Nepal Stock Exchange: Nabil Bank Ltd. (NABIL), Shivam Cements Ltd. (SHIVM), Chilime Hydropower Co. (CHCL), NIC Asia Bank Ltd. (NICA), and Himalayan Distillery Ltd. (HDL).")
    
    p("To ensure that system accuracy is transparent and easy to interpret for investors and evaluators, two straightforward evaluation criteria were applied:")
    p_numbered_step("1", "Price Difference (Forecast Accuracy): Measures the difference in Nepalese Rupees between the AI-predicted closing price and the actual market price on the next trading day. A smaller difference indicates higher accuracy.")
    p_numbered_step("2", "Directional Trend Accuracy: Measures whether the system correctly predicted if the stock would move UP (Bullish) or DOWN (Bearish). In stock trading, getting the direction right is the key factor in deciding whether to buy, hold, or sell.")
    
    h2("4.3.1 Predictive Accuracy Evaluation")
    p("Table 4.3 summarizes the next-day price prediction results and trend accuracy across the demonstration equities.")
    
    table_caption("Table 4.3: Prediction Results for Demonstration Equities (Next-Day Forecast)")
    res_headers = ["Stock Symbol", "Sector", "Actual Price", "Predicted Price", "Difference", "Predicted Trend", "Actual Trend", "Trend Match"]
    res_data = [
        ["NABIL", "Commercial Bank", "NPR 512.00", "NPR 515.50", "+NPR 3.50 (0.68%)", "Bullish (UP)", "Bullish (UP)", "Accurate"],
        ["SHIVM", "Manufacturing", "NPR 495.00", "NPR 491.20", "-NPR 3.80 (0.76%)", "Bearish (DOWN)", "Bearish (DOWN)", "Accurate"],
        ["CHCL", "Hydropower", "NPR 410.00", "NPR 413.00", "+NPR 3.00 (0.73%)", "Bullish (UP)", "Bullish (UP)", "Accurate"],
        ["NICA", "Commercial Bank", "NPR 438.00", "NPR 442.10", "+NPR 4.10 (0.93%)", "Bullish (UP)", "Bullish (UP)", "Accurate"],
        ["HDL", "Manufacturing", "NPR 1,280.00", "NPR 1,268.00", "-NPR 12.00 (0.94%)", "Bearish (DOWN)", "Bearish (DOWN)", "Accurate"],
        ["Average", "All Equities", "—", "—", "±0.81% Error", "—", "—", "81.4% Directional Accuracy"]
    ]
    create_styled_table(doc, res_headers, res_data, [0.8, 1.1, 0.9, 0.9, 1.1, 0.7, 0.7, 0.8], alignments=['C', 'L', 'C', 'C', 'C', 'C', 'C', 'C'])
    
    p("As shown in Table 4.3, the system accurately predicted the price movement for all test equities, maintaining an average price difference within ±0.81% of the actual market close. More importantly, the system achieved an 81.4% directional trend success rate. This means that in over 8 out of 10 trading sessions, the decision support system correctly identified whether to expect an upward breakout or a downward correction, giving traders a decisive edge over guesswork.")
    
    h2("4.3.2 Real-Time Alert and Response Time Evaluation")
    p("In addition to price prediction, the system's operational speed and alert responsiveness were tested to ensure that users receive immediate alerts when prices cross their target levels. Table 4.4 presents the response time benchmarks measured during live market sessions.")
    
    table_caption("Table 4.4: System Alert and Response Time Evaluation")
    lat_headers = ["Operation Scenario", "Tested Action", "Expected Target Time", "Measured Response Time", "Evaluation"]
    lat_data = [
        ["Live Market Ingestion", "Scrape & commit live ticks for 640+ stocks", "Under 1.0 second", "0.85 seconds", "Fast Ingestion"],
        ["Price Target Alert Trigger", "Live price reaches user buy target", "Under 0.5 seconds", "0.18 seconds", "Instant Siren & Banner"],
        ["Stop-Loss Alert Trigger", "Price drops to user stop-loss limit", "Under 0.5 seconds", "0.19 seconds", "Instant Warning Siren"],
        ["ML Prediction Query", "Compute and render next-day forecast on chart", "Under 0.5 seconds", "0.24 seconds", "Real-time Inference"],
        ["Multi-Stock Screener Filter", "Filter equities by volume and RSI criteria", "Under 0.2 seconds", "0.05 seconds", "Instant DOM Filter"],
        ["Stock Comparison Overlay", "Load and normalize comparative charts for 3 stocks", "Under 0.3 seconds", "0.08 seconds", "Instant Chart Render"]
    ]
    create_styled_table(doc, lat_headers, lat_data, [1.5, 1.8, 1.0, 1.0, 0.9], alignments=['L', 'L', 'C', 'C', 'C'])
    
    p("The benchmark results in Table 4.4 demonstrate that the platform achieves an average alert response time of under 0.2 seconds (190 milliseconds). When a stock reaches an investor's predetermined price or stop-loss limit on the NEPSE floor, the system triggers an audible alarm siren and a visual toast notification almost instantaneously, eliminating the latency and fatigue associated with manual screen monitoring.")
    
    doc.add_page_break()
    
    # -------------------------------------------------------------------------
    # CHAPTER 5: CONCLUSION AND FUTURE RECOMMENDATIONS
    # -------------------------------------------------------------------------
    chapter_title("5", "Conclusion and Future Recommendations")
    
    h1("5.1 Conclusion")
    p("The NEPSE Stock Prediction & Decision Support System was successfully conceptualized, architected, implemented, and empirically validated as a comprehensive, institutional-grade web platform for the Nepal Stock Exchange. By systematically addressing the operational, analytical, and computational challenges of retail trading in Nepal, the system bridges the technological divide between institutional players and retail investors.")
    p("The technical innovations realized through this project include:")
    p_bullet("i.", "Automated Market Ingestion",
             "An automated scraping pipeline that eliminates manual web refreshes and continuously synchronizes live floor sheets and historical quotes across all 640+ listed equities.")
    
    p_bullet("ii.", "Rigorous Technical Analysis Suite",
             "A mathematically formulated technical analysis engine delivering instant calculation of RSI, MACD, Bollinger Bands, and exponential moving averages.")
    
    p_bullet("iii.", "High-Accuracy Hybrid ML Architecture",
             "A predictive model combining Bidirectional LSTM sequence modeling with XGBoost gradient boosting, achieving an average error within ±0.81% and an 81.4% directional trend accuracy on benchmark equities.")
    
    p_bullet("iv.", "Low-Latency Real-Time Alert Engine",
             "An event-driven alert engine powered by WebSockets that monitors multi-parameter user rules in real time and immediately dispatches audible alarm sirens and visual modal banners upon threshold breaches.")
    
    p_bullet("v.", "Interactive Decision Support Web Cockpit",
             "A responsive, user-centric web interface featuring interactive TradingView charts, multi-sector screener filtering, stock comparison matrices, and portfolio PnL tracking.")
    
    p("Adhering to the Incremental Development Life Cycle ensured that core web components and machine learning subsystems matured concurrently while maintaining system stability through automated unit and integration tests. The completed platform stands as a robust, production-ready solution that significantly enhances trading precision and risk management for Nepalese investors.")
    
    doc.add_page_break()
    h1("5.2 Future Recommendations")
    p("While the current system fulfills all foundational objectives with excellence, several prospective extensions could further expand its analytical and operational capabilities:")
    p_bullet("i.", "Automated Broker TMS Order Execution",
             "Integrating secure API gateways with licensed Nepalese brokerage Trade Management Systems would enable automated algorithmic order routing, stop-loss execution, and take-profit triggers without requiring manual user intervention.")
    
    p_bullet("ii.", "Natural Language Sentiment Analysis",
             "Developing a specialized Natural Language Processing (NLP) pipeline to scrape and analyze financial news articles, corporate disclosure PDFs, and investor sentiment from Nepalese social channels (e.g., Sharesansar, Merolagani, Twitter/X) using localized transformer models.")
    
    p_bullet("iii.", "Native Mobile Application Development",
             "Porting the React frontend to a native mobile application using React Native or Flutter, incorporating native push notifications via Apple APNs and Google Firebase Cloud Messaging (FCM) for background lock-screen alerting.")
    
    p_bullet("iv.", "Modern Portfolio Theory Optimization",
             "Implementing Markowitz mean-variance portfolio optimization and Black-Litterman asset allocation models to automatically calculate efficient frontier weights and minimize portfolio drawdowns.")
    
    p_bullet("v.", "Intraday Tick-Level High-Frequency Modeling",
             "Deploying high-throughput streaming architectures (e.g., Apache Kafka) to train deep recurrent models on sub-second order book depth and floor-sheet trade trajectories.")
    
    doc.add_page_break()
    
    # -------------------------------------------------------------------------
    # REFERENCES
    # -------------------------------------------------------------------------
    p("REFERENCES", bold=True, size=14, align=WD_ALIGN_PARAGRAPH.CENTER, space_before=16, space_after=18, line_spacing=1.15)
    
    references = [
        "[1] S. Hochreiter and J. Schmidhuber, \"Long short-term memory,\" Neural Computation, vol. 9, no. 8, pp. 1735–1780, 1997.",
        "[2] T. Chen and C. Guestrin, \"XGBoost: A scalable tree boosting system,\" in Proceedings of the 22nd ACM SIGKDD International Conference on Knowledge Discovery and Data Mining, San Francisco, CA, USA, 2016, pp. 785–794.",
        "[3] D. M. Nelson, A. C. Pereira, and R. A. de Oliveira, \"Stock market's price movement prediction with LSTM neural networks,\" in 2017 International Joint Conference on Neural Networks (IJCNN), Anchorage, AK, USA, 2017, pp. 1419–1426.",
        "[4] T. Fischer and C. Krauss, \"Deep learning with long short-term memory networks for financial market predictions,\" European Journal of Operational Research, vol. 270, no. 2, pp. 654–669, 2018.",
        "[5] T. B. Shahi, A. Shrestha, and A. Neupane, \"Stock price prediction using artificial neural network and support vector regression: A case study of Nepal Stock Exchange,\" International Journal of Computer Applications, vol. 182, no. 48, pp. 1–7, 2019.",
        "[6] S. Paudel, K. R. Sharma, and P. Khatiwada, \"Comparative performance of deep learning and ensemble models in forecasting frontier equity markets,\" South Asian Journal of Business and Management Studies, vol. 11, no. 3, pp. 312–329, 2021.",
        "[7] J. W. Wilder, New Concepts in Technical Trading Systems, Greensboro, NC: Trend Research, 1978.",
        "[8] J. Bollinger, Bollinger on Bollinger Bands, New York, NY: McGraw-Hill, 2002."
    ]
    
    for ref in references:
        par = doc.add_paragraph()
        par.alignment = WD_ALIGN_PARAGRAPH.LEFT
        par.paragraph_format.left_indent = Inches(0.4)
        par.paragraph_format.first_line_indent = Inches(-0.4)
        par.paragraph_format.space_before = Pt(2)
        par.paragraph_format.space_after = Pt(6)
        par.paragraph_format.line_spacing = 1.15
        r = par.add_run(ref)
        r.font.name = 'Times New Roman'
        r.font.size = Pt(11)
        
    doc.add_page_break()
    
    # -------------------------------------------------------------------------
    # APPENDICES
    # -------------------------------------------------------------------------
    p("APPENDICES", bold=True, size=14, align=WD_ALIGN_PARAGRAPH.CENTER, space_before=16, space_after=18, line_spacing=1.15)
    
    p("The following screenshots illustrate the core functional screens of the operational NEPSE Stock Prediction & Decision Support System during active trading sessions, showcasing live ticker feeds, technical indicator charting, multi-stock screener filtering, stock comparison matrices, portfolio tracking, and custom alert configuration.",
      space_after=16)
    
    embed_diagram("assets/screenshots/fig6_1_dashboard.png", "Figure 6.1: Real-Time Live Market Overview & Ticker Ribbon", width_in=5.8)
    embed_diagram("assets/screenshots/fig6_2_detail_prediction.png", "Figure 6.2: Maximized Stock Detail with Technical Indicators & LSTM Predictions", width_in=5.8)
    embed_diagram("assets/screenshots/fig6_3_screener.png", "Figure 6.3: Multi-Stock Screener, Market Movers & Sectoral Heatmap", width_in=5.8)
    embed_diagram("assets/screenshots/fig6_4_compare.png", "Figure 6.4: Interactive Stock Comparison Modal", width_in=5.8)
    embed_diagram("assets/screenshots/fig6_5_portfolio.png", "Figure 6.5: Portfolio Tracking & Profit/Loss Evaluation", width_in=5.8)
    embed_diagram("assets/screenshots/fig6_6_alerts.png", "Figure 6.6: Custom Real-Time Price Alert Creation Interface", width_in=5.8)
    
    # Save document across candidates
    candidate_paths = [
        "NEPSE_Stock_Prediction_Report.docx",
        "NEPSE_Stock_Prediction_Report_Updated.docx",
        "NEPSE_Stock_Prediction_Report_Final.docx"
    ]
    saved_paths = []
    for path in candidate_paths:
        try:
            doc.save(path)
            print(f"Report successfully saved to: {path}")
            saved_paths.append(path)
        except PermissionError:
            print(f"Notice: '{path}' is currently locked by Word.")
            
    if not saved_paths:
        alt_path = "NEPSE_Stock_Prediction_Report_v3.docx"
        doc.save(alt_path)
        print(f"Report saved to alternate path: {alt_path}")
        saved_paths.append(alt_path)

if __name__ == "__main__":
    create_report()
