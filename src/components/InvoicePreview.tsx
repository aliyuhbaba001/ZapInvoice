
import React, { forwardRef } from 'react';
import { InvoiceData } from '../hooks/useInvoiceData';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

interface InvoicePreviewProps {
  invoiceData: InvoiceData;
}

export const InvoicePreview = forwardRef<HTMLDivElement, InvoicePreviewProps>(
  ({ invoiceData }, ref) => {
    const subtotal = invoiceData.items.reduce((sum, item) => sum + item.total, 0);
    const discount = invoiceData.discountType === 'percentage' 
      ? (subtotal * invoiceData.discountValue) / 100 
      : invoiceData.discountValue;
    const taxableAmount = subtotal - discount;
    const tax = (taxableAmount * invoiceData.taxRate) / 100;
    const total = taxableAmount + tax;

    const formatCurrency = (amount: number) => {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: invoiceData.currency || 'USD'
      }).format(amount);
    };

    const getStatusColor = (status: string) => {
      switch (status) {
        case 'paid': return 'bg-green-100 text-green-800';
        case 'sent': return 'bg-blue-100 text-blue-800';
        case 'overdue': return 'bg-red-100 text-red-800';
        default: return 'bg-gray-100 text-gray-800';
      }
    };

    return (
      <div ref={ref} className="invoice-container bg-white shadow-lg rounded-lg p-8 max-w-4xl mx-auto" style={{ color: '#1f2937' }}>
        {/* Header */}
        <div className="invoice-header flex justify-between items-start mb-8 page-break-avoid">
          <div className="flex items-center space-x-4">
            {invoiceData.companyLogo && (
              <img 
                src={invoiceData.companyLogo} 
                alt="Company Logo" 
                className="company-logo h-16 w-auto object-contain"
                style={{ maxHeight: '64px' }}
              />
            )}
            <div>
              <h1 className="text-3xl font-bold" style={{ color: invoiceData.brandColor }}>
                {invoiceData.companyName}
              </h1>
              <p className="text-gray-600 mt-1">Professional Invoice</p>
            </div>
          </div>
          <div className="text-right">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">INVOICE</h2>
            <Badge className={`status-badge ${getStatusColor(invoiceData.status)}`}>
              {invoiceData.status.toUpperCase()}
            </Badge>
          </div>
        </div>

        {/* Invoice Details */}
        <div className="invoice-details grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 page-break-avoid">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">From:</h3>
            <div className="text-gray-700 space-y-1">
              <p className="font-semibold">{invoiceData.companyName}</p>
              <p>{invoiceData.companyAddress}</p>
              <p>{invoiceData.companyCity}, {invoiceData.companyState} {invoiceData.companyZip}</p>
              <p>{invoiceData.companyCountry}</p>
              <p>{invoiceData.companyPhone}</p>
              <p>{invoiceData.companyEmail}</p>
              {invoiceData.companyWebsite && <p>{invoiceData.companyWebsite}</p>}
              {invoiceData.companyTaxId && <p>Tax ID: {invoiceData.companyTaxId}</p>}
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">To:</h3>
            <div className="text-gray-700 space-y-1">
              <p className="font-semibold">{invoiceData.clientName}</p>
              <p>{invoiceData.clientAddress}</p>
              <p>{invoiceData.clientCity}, {invoiceData.clientState} {invoiceData.clientZip}</p>
              <p>{invoiceData.clientCountry}</p>
              {invoiceData.clientPhone && <p>{invoiceData.clientPhone}</p>}
              {invoiceData.clientEmail && <p>{invoiceData.clientEmail}</p>}
            </div>
          </div>
        </div>

        {/* Invoice Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 p-4 bg-gray-50 rounded-lg">
          <div>
            <p className="text-sm text-gray-600">Invoice Number</p>
            <p className="font-semibold">{invoiceData.invoiceNumber}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Invoice Date</p>
            <p className="font-semibold">{new Date(invoiceData.invoiceDate).toLocaleDateString()}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Due Date</p>
            <p className="font-semibold">{new Date(invoiceData.dueDate).toLocaleDateString()}</p>
          </div>
        </div>

        {/* Items Table */}
        <div className="invoice-items mb-8 page-break-avoid">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr style={{ backgroundColor: invoiceData.brandColor }} className="text-white">
                  <th className="text-left p-3 font-semibold">Description</th>
                  <th className="text-center p-3 font-semibold w-20">Qty</th>
                  <th className="text-right p-3 font-semibold w-32">Unit Price</th>
                  <th className="text-right p-3 font-semibold w-32">Total</th>
                </tr>
              </thead>
              <tbody>
                {invoiceData.items.map((item, index) => (
                  <tr key={item.id} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                    <td className="p-3 border-b">
                      <div>
                        <p className="font-medium">{item.description}</p>
                        {item.code && <p className="text-sm text-gray-500">Code: {item.code}</p>}
                      </div>
                    </td>
                    <td className="p-3 border-b text-center">{item.quantity}</td>
                    <td className="p-3 border-b text-right">{formatCurrency(item.unitPrice)}</td>
                    <td className="p-3 border-b text-right font-semibold">{formatCurrency(item.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Totals */}
        <div className="invoice-totals flex justify-end mb-8 page-break-avoid">
          <div className="w-full max-w-md">
            <div className="space-y-2">
              <div className="flex justify-between py-2">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-semibold">{formatCurrency(subtotal)}</span>
              </div>
              
              {discount > 0 && (
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">
                    Discount {invoiceData.discountType === 'percentage' 
                      ? `(${invoiceData.discountValue}%)` 
                      : ''
                    }:
                  </span>
                  <span className="font-semibold text-red-600">-{formatCurrency(discount)}</span>
                </div>
              )}
              
              {invoiceData.taxRate > 0 && (
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">Tax ({invoiceData.taxRate}%):</span>
                  <span className="font-semibold">{formatCurrency(tax)}</span>
                </div>
              )}
              
              <Separator />
              
              <div className="flex justify-between py-3 text-lg">
                <span className="font-bold">Total:</span>
                <span className="font-bold" style={{ color: invoiceData.brandColor }}>
                  {formatCurrency(total)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Information */}
        {invoiceData.paymentMethods.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Payment Methods</h3>
            <div className="flex flex-wrap gap-2 mb-4">
              {invoiceData.paymentMethods.map((method, index) => (
                <Badge key={index} variant="outline">{method}</Badge>
              ))}
            </div>
            {invoiceData.paymentInstructions && (
              <p className="text-gray-700 mb-2">{invoiceData.paymentInstructions}</p>
            )}
            {invoiceData.bankDetails && (
              <div className="bg-gray-50 p-3 rounded text-sm">
                <p className="font-semibold mb-1">Bank Details:</p>
                <pre className="whitespace-pre-wrap text-gray-700">{invoiceData.bankDetails}</pre>
              </div>
            )}
          </div>
        )}

        {/* Notes and Terms */}
        <div className="space-y-6">
          {invoiceData.notes && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Notes</h3>
              <p className="text-gray-700">{invoiceData.notes}</p>
            </div>
          )}
          
          {invoiceData.terms && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Terms & Conditions</h3>
              <p className="text-gray-700 text-sm">{invoiceData.terms}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="invoice-footer mt-8 pt-6 border-t text-center text-gray-500 text-sm">
          <p>Thank you for your business!</p>
          <p className="mt-1">Generated on {new Date().toLocaleDateString()}</p>
        </div>
      </div>
    );
  }
);

InvoicePreview.displayName = 'InvoicePreview';
