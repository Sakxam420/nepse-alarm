import os
import sys
from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.oxml import OxmlElement, parse_xml
from docx.oxml.ns import nsdecls, qn

def set_cell_border(cell, **kwargs):
    """
    Set cell borders
    kwargs: top, bottom, left, right
    values: dict(sz=12, val='single', color='D3D3D3', space='0')
    """
    tcPr = cell._tc.get_or_add_tcPr()
    tcBorders = parse_xml(r'<w:tcBorders xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"/>')
    for border_name, border_props in kwargs.items():
        node = parse_xml(
            f'<w:{border_name} xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" '
            f'w:val="{border_props.get("val", "single")}" '
            f'w:sz="{border_props.get("sz", "4")}" '
            f'w:space="{border_props.get("space", "0")}" '
            f'w:color="{border_props.get("color", "CCCCCC")}"/>'
        )
        tcBorders.append(node)
    tcPr.append(tcBorders)

def set_cell_shading(cell, color_hex):
    shading_xml = f'<w:shd xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" w:fill="{color_hex}"/>'
    cell._tc.get_or_add_tcPr().append(parse_xml(shading_xml))

def set_cell_margins(cell, top=100, bottom=100, left=140, right=140):
    tcPr = cell._tc.get_or_add_tcPr()
    tcMar = parse_xml(
        f'<w:tcMar xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">'
        f'<w:top w:w="{top}" w:type="dxa"/>'
        f'<w:bottom w:w="{bottom}" w:type="dxa"/>'
        f'<w:left w:w="{left}" w:type="dxa"/>'
        f'<w:right w:w="{right}" w:type="dxa"/>'
        f'</w:tcMar>'
    )
    tcPr.append(tcMar)

def add_page_number_to_section(section, start_type="decimal", start_num=1):
    sectPr = section._sectPr
    pgNumType = parse_xml(
        f'<w:pgNumType xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" '
        f'w:fmt="{start_type}" w:start="{start_num}"/>'
    )
    sectPr.append(pgNumType)

def add_footer_page_number(section):
    footer = section.footer
    p = footer.paragraphs[0]
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p.paragraph_format.line_spacing = 1.0
    p.paragraph_format.space_before = Pt(4)
    p.paragraph_format.space_after = Pt(0)
    run = p.add_run()
    run.font.name = 'Times New Roman'
    run.font.size = Pt(11)

    fldSimple = parse_xml(r'<w:fldSimple xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" w:instr="PAGE"/>')
    p._p.append(fldSimple)

def create_styled_table(doc, headers, data, col_widths, alignments=None):
    """
    Creates an executive-styled academic table:
    - Repeats header on every page (w:tblHeader)
    - Row protection against splitting (w:cantSplit)
    - Dark slate blue header (#1E293B) with white text
    - Alternating soft zebra rows (#FFFFFF / #F8FAFC)
    - Clean subtle border grid (#CBD5E1)
    - Generous cell padding
    - Left-aligned text (or Center/Right per column) with 1.15 line spacing (NO justification)
    """
    tbl = doc.add_table(rows=len(data) + 1, cols=len(headers))
    tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
    tbl.autofit = False

    # 1. Header Row
    hdr_row = tbl.rows[0]
    hdr_trPr = hdr_row._tr.get_or_add_trPr()
    hdr_trPr.append(parse_xml(r'<w:tblHeader xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"/>'))
    hdr_trPr.append(parse_xml(r'<w:cantSplit xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"/>'))

    for idx, title in enumerate(headers):
        cell = hdr_row.cells[idx]
        cell.width = Inches(col_widths[idx])
        set_cell_margins(cell, top=100, bottom=100, left=120, right=120)
        set_cell_shading(cell, "1E293B")
        set_cell_border(cell,
                        top=dict(sz=6, color='1E293B', val='single'),
                        bottom=dict(sz=12, color='0F172A', val='single'),
                        left=dict(sz=4, color='334155', val='single'),
                        right=dict(sz=4, color='334155', val='single'))
        p = cell.paragraphs[0]
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER if (alignments and alignments[idx] == 'C') else WD_ALIGN_PARAGRAPH.LEFT
        p.paragraph_format.space_before = Pt(2)
        p.paragraph_format.space_after = Pt(2)
        p.paragraph_format.line_spacing = 1.15
        r = p.add_run(title)
        r.font.name = 'Times New Roman'
        r.font.size = Pt(10.5)
        r.bold = True
        r.font.color.rgb = RGBColor(255, 255, 255)

    # 2. Data Rows
    for r_idx, row_data in enumerate(data):
        row = tbl.rows[r_idx + 1]
        trPr = row._tr.get_or_add_trPr()
        trPr.append(parse_xml(r'<w:cantSplit xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"/>'))

        bg_color = "F8FAFC" if (r_idx % 2 == 1) else "FFFFFF"

        for c_idx, val in enumerate(row_data):
            cell = row.cells[c_idx]
            cell.width = Inches(col_widths[c_idx])
            set_cell_margins(cell, top=80, bottom=80, left=120, right=120)
            set_cell_shading(cell, bg_color)
            set_cell_border(cell,
                            top=dict(sz=4, color='E2E8F0', val='single'),
                            bottom=dict(sz=4, color='E2E8F0', val='single'),
                            left=dict(sz=4, color='E2E8F0', val='single'),
                            right=dict(sz=4, color='E2E8F0', val='single'))
            p = cell.paragraphs[0]
            if alignments and alignments[c_idx] == 'C':
                p.alignment = WD_ALIGN_PARAGRAPH.CENTER
            elif alignments and alignments[c_idx] == 'R':
                p.alignment = WD_ALIGN_PARAGRAPH.RIGHT
            else:
                p.alignment = WD_ALIGN_PARAGRAPH.LEFT
            p.paragraph_format.space_before = Pt(2)
            p.paragraph_format.space_after = Pt(2)
            p.paragraph_format.line_spacing = 1.15

            r = p.add_run(str(val))
            r.font.name = 'Times New Roman'
            r.font.size = Pt(10)

            # Styling for key terms
            if c_idx == 0:
                r.bold = True
            if str(val) == "PASSED":
                r.bold = True
                r.font.color.rgb = RGBColor(16, 128, 64)
            elif str(val) == "FAILED":
                r.bold = True
                r.font.color.rgb = RGBColor(220, 38, 38)
            elif str(val) == "High":
                r.bold = True
                r.font.color.rgb = RGBColor(185, 28, 28)
            elif str(val) == "Medium":
                r.font.color.rgb = RGBColor(217, 119, 6)
            elif str(val) == "Low":
                r.font.color.rgb = RGBColor(75, 85, 99)

    post_p = doc.add_paragraph()
    post_p.paragraph_format.space_before = Pt(0)
    post_p.paragraph_format.space_after = Pt(8)
    post_p.paragraph_format.line_spacing = 1.0
    return tbl

def add_code_block(doc, title, code_text):
    """
    Renders clean, styled source code container:
    - Monospaced Consolas font (9pt)
    - STRICTLY LEFT-ALIGNED (Never stretched/justified)
    - Elegant light-gray background (#F8FAFC)
    - Subtle borders with a vibrant primary accent left bar (#2563EB)
    - w:cantSplit to prevent ugly page splits
    """
    # Caption first
    p_cap = doc.add_paragraph()
    p_cap.paragraph_format.space_before = Pt(12)
    p_cap.paragraph_format.space_after = Pt(4)
    p_cap.paragraph_format.keep_with_next = True
    p_cap.alignment = WD_ALIGN_PARAGRAPH.LEFT
    r_cap = p_cap.add_run(title)
    r_cap.font.name = 'Times New Roman'
    r_cap.font.size = Pt(11)
    r_cap.bold = True

    # Container 1x1 table
    tbl = doc.add_table(rows=1, cols=1)
    tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
    tbl.autofit = False

    cell = tbl.cell(0, 0)
    cell.width = Inches(6.02)

    trPr = tbl.rows[0]._tr.get_or_add_trPr()
    trPr.append(parse_xml(r'<w:cantSplit xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"/>'))

    set_cell_margins(cell, top=100, bottom=100, left=140, right=140)
    set_cell_shading(cell, "F8FAFC")
    set_cell_border(cell,
                    top=dict(sz=4, color='CBD5E1', val='single'),
                    bottom=dict(sz=4, color='CBD5E1', val='single'),
                    left=dict(sz=16, color='2563EB', val='single'), # 2pt Royal Blue Left Accent Bar
                    right=dict(sz=4, color='CBD5E1', val='single'))

    lines = code_text.strip().split('\n')
    for idx, line in enumerate(lines):
        if idx == 0:
            p = cell.paragraphs[0]
        else:
            p = cell.add_paragraph()
        p.alignment = WD_ALIGN_PARAGRAPH.LEFT # CRITICAL: LEFT ALIGNED, NEVER JUSTIFIED!
        p.paragraph_format.space_before = Pt(0)
        p.paragraph_format.space_after = Pt(1.5)
        p.paragraph_format.line_spacing = 1.15
        r = p.add_run(line if line else ' ')
        r.font.name = 'Consolas'
        r.font.size = Pt(9.0)
        r.font.color.rgb = RGBColor(30, 41, 59)

    post_p = doc.add_paragraph()
    post_p.paragraph_format.space_before = Pt(0)
    post_p.paragraph_format.space_after = Pt(10)
    post_p.paragraph_format.line_spacing = 1.0

def add_figure_image(doc, img_path, caption_title):
    """
    Renders centered image and centered bold caption below it with keep_with_next
    """
    if os.path.exists(img_path):
        p_img = doc.add_paragraph()
        p_img.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p_img.paragraph_format.space_before = Pt(8)
        p_img.paragraph_format.space_after = Pt(4)
        p_img.paragraph_format.keep_with_next = True
        run_img = p_img.add_run()
        run_img.add_picture(img_path, width=Inches(6.0))

        p_cap = doc.add_paragraph()
        p_cap.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p_cap.paragraph_format.space_before = Pt(4)
        p_cap.paragraph_format.space_after = Pt(12)
        r_cap = p_cap.add_run(caption_title)
        r_cap.font.name = 'Times New Roman'
        r_cap.font.size = Pt(12)
        r_cap.bold = True
    else:
        p_cap = doc.add_paragraph()
        p_cap.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p_cap.paragraph_format.space_before = Pt(6)
        p_cap.paragraph_format.space_after = Pt(12)
        r_cap = p_cap.add_run(f"[{caption_title}]")
        r_cap.font.name = 'Times New Roman'
        r_cap.font.size = Pt(12)
        r_cap.bold = True
        r_cap.italic = True
