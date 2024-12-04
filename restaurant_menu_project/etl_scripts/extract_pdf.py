import PyPDF2
import logging

logger = logging.getLogger(__name__)

def extract_text_from_pdf(pdf_file):
    """
    Extracts text from a PDF file.
    :param pdf_file: File object or path to the PDF file.
    :return: Extracted text as a string.
    """
    try:
        if hasattr(pdf_file, 'read'):  # Handle Django's UploadedFile
            pdf_file = pdf_file.read()
        
        reader = PyPDF2.PdfReader(pdf_file)
        text = ""
        for page in reader.pages:
            text += page.extract_text()
        return text.strip()
    except Exception as e:
        logger.error(f"Error extracting text from PDF: {e}")
        return None
