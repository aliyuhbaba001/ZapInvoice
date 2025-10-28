import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { InvoiceData } from '../hooks/useInvoiceData';

interface PDFOptions {
  format?: 'a4' | 'letter';
  orientation?: 'portrait' | 'landscape';
  margin?: number;
  quality?: number;
}

export class InvoicePDFGenerator {
  private doc: jsPDF;
  private options: Required<PDFOptions>;

  constructor(options: PDFOptions = {}) {
    this.options = {
      format: options.format || 'a4',
      orientation: options.orientation || 'portrait',
      margin: options.margin || 20,
      quality: options.quality || 0.95,
    };

    this.doc = new jsPDF({
      orientation: this.options.orientation,
      unit: 'mm',
      format: this.options.format,
    });
  }

  async generateFromElement(element: HTMLElement, invoiceData: InvoiceData): Promise<Blob> {
    try {
      // Create a clone of the element for PDF-specific styling
      const clonedElement = await this.createPrintableClone(element, invoiceData);
      
      // Generate canvas from the cloned element
      const canvas = await html2canvas(clonedElement, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
        width: clonedElement.scrollWidth,
        height: clonedElement.scrollHeight,
      });

      // Calculate dimensions for PDF
      const pageWidth = this.doc.internal.pageSize.getWidth();
      const pageHeight = this.doc.internal.pageSize.getHeight();
      const imgWidth = pageWidth - (this.options.margin * 2);
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      // Add image to PDF
      const imgData = canvas.toDataURL('image/png', this.options.quality);
      
      // Handle multi-page content
      let heightLeft = imgHeight;
      let position = this.options.margin;

      this.doc.addImage(imgData, 'PNG', this.options.margin, position, imgWidth, imgHeight);
      heightLeft -= pageHeight - (this.options.margin * 2);

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight + this.options.margin;
        this.doc.addPage();
        this.doc.addImage(imgData, 'PNG', this.options.margin, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      // Clean up cloned element
      document.body.removeChild(clonedElement);

      // Return as blob
      return this.doc.output('blob');
    } catch (error) {
      console.error('Error generating PDF:', error);
      throw new Error('Failed to generate PDF');
    }
  }

  private async createPrintableClone(element: HTMLElement, invoiceData: InvoiceData): Promise<HTMLElement> {
    const clone = element.cloneNode(true) as HTMLElement;
    
    // Apply PDF-specific styling
    clone.style.position = 'fixed';
    clone.style.top = '-9999px';
    clone.style.left = '0';
    clone.style.width = '794px'; // A4 width in pixels at 96 DPI
    clone.style.backgroundColor = '#ffffff';
    clone.style.color = '#000000';
    clone.style.fontFamily = 'Arial, sans-serif';
    clone.style.fontSize = '14px';
    clone.style.lineHeight = '1.4';
    clone.style.padding = '40px';
    clone.style.boxSizing = 'border-box';

    // Optimize images in the clone
    const images = clone.querySelectorAll('img') as NodeListOf<HTMLImageElement>;
    await this.optimizeImages(images);

    // Apply print-friendly styles
    this.applyPrintStyles(clone, invoiceData);

    // Add to DOM temporarily for rendering
    document.body.appendChild(clone);

    return clone;
  }

  private async optimizeImages(images: NodeListOf<HTMLImageElement>): Promise<void> {
    const promises = Array.from(images).map(async (img) => {
      try {
        // Skip if image is already optimized or is a data URL
        if (img.src.startsWith('data:')) return;

        // Create canvas for optimization
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Wait for image to load
        await new Promise((resolve, reject) => {
          if (img.complete) {
            resolve(void 0);
          } else {
            img.onload = () => resolve(void 0);
            img.onerror = reject;
          }
        });

        // Set optimal dimensions (max 300px width for logos)
        const maxWidth = 300;
        const aspectRatio = img.naturalHeight / img.naturalWidth;
        canvas.width = Math.min(img.naturalWidth, maxWidth);
        canvas.height = canvas.width * aspectRatio;

        // Draw and compress
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const optimizedData = canvas.toDataURL('image/png', 0.8);
        
        // Replace original src
        img.src = optimizedData;
        img.style.maxWidth = '200px';
        img.style.height = 'auto';
      } catch (error) {
        console.warn('Failed to optimize image:', error);
      }
    });

    await Promise.all(promises);
  }

  private applyPrintStyles(element: HTMLElement, invoiceData: InvoiceData): void {
    // Remove shadows and border radius for print
    const shadowElements = element.querySelectorAll('[class*="shadow"]');
    shadowElements.forEach((el) => {
      (el as HTMLElement).style.boxShadow = 'none';
    });

    const roundedElements = element.querySelectorAll('[class*="rounded"]');
    roundedElements.forEach((el) => {
      (el as HTMLElement).style.borderRadius = '0';
    });

    // Ensure proper contrast for print
    const colorElements = element.querySelectorAll('[style*="color"]');
    colorElements.forEach((el) => {
      const element = el as HTMLElement;
      if (element.style.color && element.style.color.includes('rgb')) {
        // Convert light colors to darker ones for print
        const rgb = element.style.color.match(/\d+/g);
        if (rgb && rgb.length >= 3) {
          const brightness = (parseInt(rgb[0]) + parseInt(rgb[1]) + parseInt(rgb[2])) / 3;
          if (brightness > 150) {
            element.style.color = '#333333';
          }
        }
      }
    });

    // Enhance table borders for print
    const tables = element.querySelectorAll('table');
    tables.forEach((table) => {
      table.style.borderCollapse = 'collapse';
      table.style.width = '100%';
      
      const cells = table.querySelectorAll('td, th');
      cells.forEach((cell) => {
        (cell as HTMLElement).style.border = '1px solid #cccccc';
        (cell as HTMLElement).style.padding = '8px';
      });
    });

    // Style the header with brand color
    const header = element.querySelector('[style*="color: ' + invoiceData.brandColor + '"]');
    if (header) {
      (header as HTMLElement).style.color = invoiceData.brandColor;
      (header as HTMLElement).style.fontWeight = 'bold';
    }

    // Ensure proper page breaks
    const sections = element.querySelectorAll('.space-y-6 > div, .mb-8');
    sections.forEach((section, index) => {
      if (index > 0) {
        (section as HTMLElement).style.pageBreakInside = 'avoid';
        (section as HTMLElement).style.breakInside = 'avoid';
      }
    });
  }

  async downloadPDF(element: HTMLElement, invoiceData: InvoiceData, filename?: string): Promise<void> {
    const blob = await this.generateFromElement(element, invoiceData);
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename || `invoice-${invoiceData.invoiceNumber}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}

// Utility function for quick PDF generation
export const generateInvoicePDF = async (
  element: HTMLElement, 
  invoiceData: InvoiceData, 
  options?: PDFOptions
): Promise<Blob> => {
  const generator = new InvoicePDFGenerator(options);
  return await generator.generateFromElement(element, invoiceData);
};

// Utility function for quick PDF download
export const downloadInvoicePDF = async (
  element: HTMLElement, 
  invoiceData: InvoiceData, 
  filename?: string,
  options?: PDFOptions
): Promise<void> => {
  const generator = new InvoicePDFGenerator(options);
  return await generator.downloadPDF(element, invoiceData, filename);
};