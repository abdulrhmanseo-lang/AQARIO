from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.units import cm
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer, Image
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_RIGHT
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from io import BytesIO
from datetime import datetime
import os
from django.conf import settings


def generate_invoice_pdf(invoice):
    """
    Generate a professional PDF invoice with Arabic support
    """
    buffer = BytesIO()
    
    # Create PDF document
    doc = SimpleDocTemplate(
        buffer,
        pagesize=A4,
        rightMargin=2*cm,
        leftMargin=2*cm,
        topMargin=2*cm,
        bottomMargin=2*cm
    )
    
    # Container for PDF elements
    elements = []
    styles = getSampleStyleSheet()
    
    # Custom styles for RTL Arabic
    title_style = ParagraphStyle(
        'CustomTitle',
        parent=styles['Heading1'],
        fontSize=24,
        textColor=colors.HexColor('#7C3AED'),
        spaceAfter=30,
        alignment=TA_CENTER,
        fontName='Helvetica-Bold'
    )
    
    heading_style = ParagraphStyle(
        'CustomHeading',
        parent=styles['Heading2'],
        fontSize=14,
        textColor=colors.HexColor('#4B5563'),
        spaceAfter=12,
        alignment=TA_RIGHT
    )
    
    normal_style = ParagraphStyle(
        'CustomNormal',
        parent=styles['Normal'],
        fontSize=11,
        textColor=colors.HexColor('#1F2937'),
        alignment=TA_RIGHT
    )
    
    # Header - Company Branding
    title = Paragraph("Aqario | نظام الفواتير", title_style)
    elements.append(title)
    elements.append(Spacer(1, 0.5*cm))
    
    # Invoice Info
    invoice_date = datetime.now().strftime('%Y-%m-%d')
    info_data = [
        ['رقم الفاتورة:', f'#{invoice.invoice_number}'],
        ['التاريخ:', invoice_date],
        ['حالة الدفع:', dict(invoice.STATUS_CHOICES).get(invoice.status, 'معلق')],
    ]
    
    info_table = Table(info_data, colWidths=[4*cm, 10*cm])
    info_table.setStyle(TableStyle([
        ('ALIGN', (0, 0), (-1, -1), 'RIGHT'),
        ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, -1), 11),
        ('TEXTCOLOR', (0, 0), (0, -1), colors.HexColor('#7C3AED')),
        ('TEXTCOLOR', (1, 0), (1, -1), colors.HexColor('#1F2937')),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
    ]))
    elements.append(info_table)
    elements.append(Spacer(1, 1*cm))
    
    # Client Information
    if invoice.contract and invoice.contract.client:
        client = invoice.contract.client
        client_heading = Paragraph("معلومات العميل", heading_style)
        elements.append(client_heading)
        
        client_data = [
            ['الاسم:', client.name],
            ['الهاتف:', client.phone],
            ['البريد الإلكتروني:', client.email or '-'],
        ]
        
        client_table = Table(client_data, colWidths=[4*cm, 10*cm])
        client_table.setStyle(TableStyle([
            ('ALIGN', (0, 0), (-1, -1), 'RIGHT'),
            ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, -1), 10),
            ('TEXTCOLOR', (0, 0), (-1, -1), colors.HexColor('#4B5563')),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
        ]))
        elements.append(client_table)
        elements.append(Spacer(1, 1*cm))
    
    # Invoice Details Table
    details_heading = Paragraph("تفاصيل الفاتورة", heading_style)
    elements.append(details_heading)
    
    details_data = [
        ['البيان', 'المبلغ (ريال)'],
        ['المبلغ الأساسي', f'{float(invoice.amount):,.2f}'],
        [f'الضريبة ({float(invoice.tax_rate)}%)', f'{float(invoice.tax_amount):,.2f}'],
    ]
    
    details_table = Table(details_data, colWidths=[10*cm, 4*cm])
    details_table.setStyle(TableStyle([
        ('ALIGN', (0, 0), (-1, -1), 'RIGHT'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, -1), 11),
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#F3F4F6')),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.HexColor('#1F2937')),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#E5E7EB')),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 10),
        ('TOPPADDING', (0, 0), (-1, -1), 10),
    ]))
    elements.append(details_table)
    elements.append(Spacer(1, 0.3*cm))
    
    # Total Amount
    total_data = [
        ['الإجمالي', f'{float(invoice.total_amount):,.2f} ريال']
    ]
    
    total_table = Table(total_data, colWidths=[10*cm, 4*cm])
    total_table.setStyle(TableStyle([
        ('ALIGN', (0, 0), (-1, -1), 'RIGHT'),
        ('FONTNAME', (0, 0), (-1, -1), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, -1), 14),
        ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor('#7C3AED')),
        ('TEXTCOLOR', (0, 0), (-1, -1), colors.white),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 12),
        ('TOPPADDING', (0, 0), (-1, -1), 12),
    ]))
    elements.append(total_table)
    elements.append(Spacer(1, 2*cm))
    
    # Footer
    footer_style = ParagraphStyle(
        'Footer',
        parent=styles['Normal'],
        fontSize=10,
        textColor=colors.HexColor('#9CA3AF'),
        alignment=TA_CENTER
    )
    
    footer_text = "شكراً لتعاملكم معنا | Aqario Real Estate Management System"
    footer = Paragraph(footer_text, footer_style)
    elements.append(footer)
    
    # Build PDF
    doc.build(elements)
    
    # Get PDF data
    pdf_data = buffer.getvalue()
    buffer.close()
    
    return pdf_data
