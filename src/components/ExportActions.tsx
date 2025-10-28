
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { InvoiceData } from '../hooks/useInvoiceData';
import { Download, Printer, Mail, FileText, Image, Loader2 } from 'lucide-react';
import { downloadInvoicePDF, generateInvoicePDF } from '../lib/pdfGenerator';
import { toast } from '@/components/ui/use-toast';

interface ExportActionsProps {
  invoiceRef: React.RefObject<HTMLDivElement>;
  invoiceData: InvoiceData;
}

export const ExportActions: React.FC<ExportActionsProps> = ({ invoiceRef, invoiceData }) => {
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [isExportingHTML, setIsExportingHTML] = useState(false);

  const handlePrint = () => {
    if (invoiceRef.current) {
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        // Get computed styles for the invoice
        const styles = document.head.querySelectorAll('style, link[rel="stylesheet"]');
        let stylesHtml = '';
        styles.forEach(style => {
          stylesHtml += style.outerHTML;
        });
        
        printWindow.document.write(`
          <html>
            <head>
              <title>Invoice ${invoiceData.invoiceNumber}</title>
              ${stylesHtml}
              <style>
                body { margin: 0; padding: 20px; font-family: Arial, sans-serif; background-color: white; }
                @media print {
                  body { margin: 0; }
                  .no-print { display: none; }
                }
                .invoice-container { max-width: 800px; margin: 0 auto; }
              </style>
            </head>
            <body>
              <div class="invoice-container">
                ${invoiceRef.current.outerHTML}
              </div>
            </body>
          </html>
        `);
        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
      }
    }
  };

  const handleExportPDF = async () => {
    if (!invoiceRef.current) {
      toast({
        title: "Error",
        description: "Invoice preview not found. Please try again.",
        variant: "destructive",
      });
      return;
    }

    setIsGeneratingPDF(true);
    try {
      await downloadInvoicePDF(
        invoiceRef.current, 
        invoiceData, 
        `invoice-${invoiceData.invoiceNumber}.pdf`,
        {
          format: 'a4',
          orientation: 'portrait',
          margin: 15,
          quality: 0.95,
        }
      );
      
      toast({
        title: "Success",
        description: "PDF exported successfully!",
      });
    } catch (error) {
      console.error('PDF export error:', error);
      toast({
        title: "Export Failed",
        description: "Failed to export PDF. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const handleExportHTML = async () => {
    if (!invoiceRef.current) {
      toast({
        title: "Error",
        description: "Invoice preview not found. Please try again.",
        variant: "destructive",
      });
      return;
    }

    setIsExportingHTML(true);
    try {
      // Get computed styles for the invoice
      const styles = document.head.querySelectorAll('style, link[rel="stylesheet"]');
      let stylesHtml = '';
      styles.forEach(style => {
        stylesHtml += style.outerHTML;
      });
      
      const htmlContent = `
        <!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Invoice ${invoiceData.invoiceNumber}</title>
            ${stylesHtml}
            <style>
              body { 
                margin: 0; 
                padding: 20px; 
                font-family: Arial, sans-serif; 
                background-color: white; 
                color: #1f2937;
                line-height: 1.4;
              }
              .invoice-container { 
                max-width: 800px; 
                margin: 0 auto; 
                box-shadow: none;
                border: 1px solid #e5e7eb;
              }
              @media print {
                body { padding: 0; }
                .invoice-container { 
                  box-shadow: none; 
                  border: none;
                  max-width: none;
                  margin: 0;
                }
              }
              @media screen and (max-width: 768px) {
                body { padding: 10px; }
                .invoice-container { padding: 15px; }
              }
            </style>
          </head>
          <body>
            <div class="invoice-container">
              ${invoiceRef.current.outerHTML}
            </div>
          </body>
        </html>
      `;
      
      const blob = new Blob([htmlContent], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `invoice-${invoiceData.invoiceNumber}.html`;
      a.click();
      URL.revokeObjectURL(url);
      
      toast({
        title: "Success",
        description: "HTML file exported successfully!",
      });
    } catch (error) {
      console.error('HTML export error:', error);
      toast({
        title: "Export Failed",
        description: "Failed to export HTML. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsExportingHTML(false);
    }
  };

  const handleEmailInvoice = () => {
    const subject = `Invoice ${invoiceData.invoiceNumber} from ${invoiceData.companyName}`;
    const body = `Dear ${invoiceData.clientName},

Please find attached invoice ${invoiceData.invoiceNumber} for your review.

Invoice Details:
- Invoice Number: ${invoiceData.invoiceNumber}
- Issue Date: ${new Date(invoiceData.invoiceDate).toLocaleDateString()}
- Due Date: ${new Date(invoiceData.dueDate).toLocaleDateString()}
- Amount: ${new Intl.NumberFormat('en-US', { style: 'currency', currency: invoiceData.currency }).format(
  invoiceData.items.reduce((sum, item) => sum + item.total, 0) * (1 + invoiceData.taxRate / 100)
)}

Thank you for your business!

Best regards,
${invoiceData.companyName}`;

    const mailtoLink = `mailto:${invoiceData.clientEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailtoLink);
  };

  const handleSaveAsDraft = () => {
    const invoiceDataString = JSON.stringify(invoiceData, null, 2);
    const blob = new Blob([invoiceDataString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `invoice-draft-${invoiceData.invoiceNumber}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const calculateTotal = () => {
    const subtotal = invoiceData.items.reduce((sum, item) => sum + item.total, 0);
    const discount = invoiceData.discountType === 'percentage' 
      ? (subtotal * invoiceData.discountValue) / 100 
      : invoiceData.discountValue;
    const taxableAmount = subtotal - discount;
    const tax = (taxableAmount * invoiceData.taxRate) / 100;
    return taxableAmount + tax;
  };

  return (
    <div className="space-y-6">
      {/* Invoice Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Invoice Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-600">Invoice Number</p>
              <p className="font-semibold">{invoiceData.invoiceNumber}</p>
            </div>
            <div>
              <p className="text-gray-600">Status</p>
              <Badge variant={
                invoiceData.status === 'paid' ? 'default' :
                invoiceData.status === 'sent' ? 'secondary' :
                invoiceData.status === 'overdue' ? 'destructive' : 'outline'
              }>
                {invoiceData.status.toUpperCase()}
              </Badge>
            </div>
            <div>
              <p className="text-gray-600">Total Amount</p>
              <p className="font-semibold text-lg">
                {new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: invoiceData.currency
                }).format(calculateTotal())}
              </p>
            </div>
            <div>
              <p className="text-gray-600">Due Date</p>
              <p className="font-semibold">{new Date(invoiceData.dueDate).toLocaleDateString()}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Export Options */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Export & Share
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button onClick={handlePrint} className="flex items-center gap-2">
              <Printer className="h-4 w-4" />
              Print Invoice
            </Button>
            
            <Button 
              onClick={handleExportPDF} 
              variant="outline" 
              className="flex items-center gap-2"
              disabled={isGeneratingPDF}
            >
              {isGeneratingPDF ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <FileText className="h-4 w-4" />
              )}
              {isGeneratingPDF ? 'Generating PDF...' : 'Export as PDF'}
            </Button>
            
            <Button 
              onClick={handleExportHTML} 
              variant="outline" 
              className="flex items-center gap-2"
              disabled={isExportingHTML}
            >
              {isExportingHTML ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Image className="h-4 w-4" />
              )}
              {isExportingHTML ? 'Exporting...' : 'Export as HTML'}
            </Button>
            
            <Button 
              onClick={handleEmailInvoice} 
              variant="outline" 
              className="flex items-center gap-2"
              disabled={!invoiceData.clientEmail}
            >
              <Mail className="h-4 w-4" />
              Email Invoice
            </Button>
          </div>
          
          <div className="mt-4 pt-4 border-t">
            <Button 
              onClick={handleSaveAsDraft} 
              variant="ghost" 
              className="w-full flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Save Draft Data
            </Button>
            <p className="text-xs text-gray-500 mt-1 text-center">
              Save invoice data as JSON file for backup or later editing
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Button 
              variant="outline" 
              className="w-full justify-start" 
              onClick={() => window.open('#', '_blank')}
            >
              Create New Invoice
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => console.log('Duplicate invoice')}
            >
              Duplicate This Invoice
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => console.log('View all invoices')}
            >
              View All Invoices
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
