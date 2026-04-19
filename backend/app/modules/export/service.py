import os
import uuid
import logging
import re
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Image
from app.core.config import settings
from app.models.schemas import Question

logger = logging.getLogger(__name__)

def generate_pdf(title: str, questions: list[Question]) -> str:
    filename = f"{uuid.uuid4().hex}.pdf"
    export_dir = settings.EXPORTS_DIR
    os.makedirs(export_dir, exist_ok=True)
    output_path = os.path.join(export_dir, filename)
    
    doc = SimpleDocTemplate(
        output_path, 
        pagesize=A4, 
        rightMargin=25, 
        leftMargin=25, 
        topMargin=25, 
        bottomMargin=25
    )
    styles = getSampleStyleSheet()
    story = []
    
    # Estilos customizados
    title_style = ParagraphStyle(
        'TitleStyle',
        parent=styles['Heading1'],
        alignment=1, # Center
        spaceAfter=15,
        textColor="#1e293b",
        fontSize=14,
        fontName="Helvetica-Bold"
    )
    
    text_title_style = ParagraphStyle(
        'TextTitleStyle',
        parent=styles['Normal'],
        alignment=1, # Center
        spaceAfter=10,
        textColor="#0f172a",
        fontSize=12,
        fontName="Helvetica-Bold",
        textTransform='uppercase'
    )
    
    body_style = ParagraphStyle(
        'BodyStyle',
        parent=styles['Normal'],
        alignment=4, # TA_JUSTIFY
        firstLineIndent=20,
        spaceAfter=8,
        fontSize=10,
        leading=14,
        textColor="#334155"
    )
    
    bold_style = ParagraphStyle('BoldStyle', parent=styles['Normal'], spaceAfter=5, fontSize=10, leading=12, textColor="#0f172a", fontName="Helvetica-Bold")
    alt_style = ParagraphStyle('AltStyle', parent=styles['Normal'], leftIndent=15, spaceAfter=4, fontSize=10, leading=12, textColor="#334155")
    
    story.append(Paragraph(title, title_style))
    story.append(Spacer(1, 10))

    def get_group_key(q: Question) -> str:
        return (q.text or "").strip() + (q.support_image_url or "")

    def process_text_for_pdf(text: str, story_list: list):
        """Converte o texto com regras de Markdown para blocos do ReportLab."""
        blocks = text.split("\n\n")
        for block in blocks:
            block = block.strip()
            if not block: continue
            
            # Trata Título (###)
            if block.startswith("###"):
                clean_title = block.replace("###", "").strip()
                story_list.append(Paragraph(clean_title, text_title_style))
                continue
            
            # Trata Negrito (**text**)
            block_html = re.sub(r'\*\*(.*?)\*\*', r'<b>\1</b>', block)
            # Trata quebras de linha simples dentro do bloco
            block_html = block_html.replace("\n", "<br/>")
            
            story_list.append(Paragraph(block_html, body_style))

    # Group questions sharing the same base text/image
    grouped_questions = []
    seen_groups = set()
    for q in questions:
        key = get_group_key(q)
        if key not in seen_groups:
            seen_groups.add(key)
            for sub_q in questions:
                if get_group_key(sub_q) == key:
                    grouped_questions.append(sub_q)

    last_group_key = None
    
    for i, q in enumerate(grouped_questions, 1):
        key = get_group_key(q)
        if last_group_key and key == last_group_key:
            story.append(Paragraph(f"<b>Questão {i}</b> - {q.descriptor} <i>(Referente ao texto anterior)</i>", bold_style))
            story.append(Spacer(1, 2))
        else:
            story.append(Paragraph(f"<b>Questão {i}</b> - {q.descriptor}", bold_style))
            story.append(Spacer(1, 2))
            
            if q.text and q.text.strip():
                process_text_for_pdf(q.text, story)
                
            if q.support_image_url:
                img_path = q.support_image_url
                if img_path.startswith("/api/static/"):
                    # Se for um link da nossa API, resolvemos para o caminho físico no DATA_DIR
                    rel_path = img_path.replace("/api/static/", "")
                    full_img_path = os.path.join(settings.STATIC_DIR, rel_path)
                else:
                    # Fallback caso seja um caminho relativo simples
                    full_img_path = os.path.join(settings.BASE_DIR, img_path.lstrip("/"))
                
                if os.path.exists(full_img_path):
                    try:
                        img = Image(full_img_path)
                        # Limites maiores para a imagem
                        available_width = doc.width
                        available_height = 450 # Aumentado de 350 para 450
                        
                        img_width, img_height = img.drawWidth, img.drawHeight
                        aspect = img_height / float(img_width)
                        
                        if img_width > available_width:
                            img_width = available_width
                            img_height = img_width * aspect
                            
                        if img_height > available_height:
                            img_height = available_height
                            img_width = img_height / aspect
                            
                        img.drawWidth = img_width
                        img.drawHeight = img_height
                        img.hAlign = 'CENTER'
                        story.append(img)
                        story.append(Spacer(1, 15))
                    except Exception as e:
                        logger.error(f"Error loading image into PDF: {e}")
            
            last_group_key = key
                    
        story.append(Paragraph(f"<b>{q.statement}</b>", bold_style))
        story.append(Spacer(1, 4))
        
        for alt in q.alternatives:
            story.append(Paragraph(f"<b>{alt.letter})</b> {alt.text}", alt_style))
            
        story.append(Spacer(1, 10))
        
    doc.build(story)
    return f"/api/static/exports/{filename}"
