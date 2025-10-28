import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { InvoiceData } from '../hooks/useInvoiceData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface InvoiceSettingsProps {
  invoiceData: InvoiceData;
  updateInvoiceData: (field: keyof InvoiceData, value: any) => void;
}

export const InvoiceSettings: React.FC<InvoiceSettingsProps> = ({ invoiceData, updateInvoiceData }) => {
  const currencies = [
    { code: 'USD', name: 'US Dollar', symbol: '$' },
    { code: 'EUR', name: 'Euro', symbol: '€' },
    { code: 'GBP', name: 'British Pound', symbol: '£' },
    { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
    { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
    { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
    { code: 'NGN', name: 'Nigerian Naira', symbol: '₦' }
  ];

  const paymentTermsOptions = [
    'Due on receipt',
    'Net 15',
    'Net 30',
    'Net 45',
    'Net 60',
    'Custom'
  ];

  const statusOptions = [
    { value: 'draft', label: 'Draft', color: 'gray' },
    { value: 'sent', label: 'Sent', color: 'blue' },
    { value: 'paid', label: 'Paid', color: 'green' },
    { value: 'overdue', label: 'Overdue', color: 'red' }
  ];

  return (
    <div className="space-y-6">
      {/* Invoice Details */}
      <Card>
        <CardHeader>
          <CardTitle>Invoice Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="invoice-number">Invoice Number *</Label>
              <Input
                id="invoice-number"
                value={invoiceData.invoiceNumber}
                onChange={(e) => updateInvoiceData('invoiceNumber', e.target.value)}
                placeholder="INV-001"
              />
            </div>
            
            <div>
              <Label htmlFor="status">Status</Label>
              <Select value={invoiceData.status} onValueChange={(value) => updateInvoiceData('status', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="invoice-date">Invoice Date *</Label>
              <Input
                id="invoice-date"
                type="date"
                value={invoiceData.invoiceDate}
                onChange={(e) => updateInvoiceData('invoiceDate', e.target.value)}
              />
            </div>
            
            <div>
              <Label htmlFor="due-date">Due Date *</Label>
              <Input
                id="due-date"
                type="date"
                value={invoiceData.dueDate}
                onChange={(e) => updateInvoiceData('dueDate', e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="payment-terms">Payment Terms</Label>
              <Select value={invoiceData.paymentTerms} onValueChange={(value) => updateInvoiceData('paymentTerms', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {paymentTermsOptions.map(term => (
                    <SelectItem key={term} value={term}>
                      {term}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="currency">Currency</Label>
              <Select value={invoiceData.currency} onValueChange={(value) => updateInvoiceData('currency', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {currencies.map(currency => (
                    <SelectItem key={currency.code} value={currency.code}>
                      {currency.symbol} {currency.name} ({currency.code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Financial Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Financial Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="tax-rate">Tax Rate (%)</Label>
              <Input
                id="tax-rate"
                type="number"
                min="0"
                max="100"
                step="0.01"
                value={invoiceData.taxRate}
                onChange={(e) => updateInvoiceData('taxRate', parseFloat(e.target.value) || 0)}
                placeholder="10.00"
              />
            </div>
            
            <div>
              <Label htmlFor="discount-type">Discount Type</Label>
              <Select value={invoiceData.discountType} onValueChange={(value) => updateInvoiceData('discountType', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="percentage">Percentage (%)</SelectItem>
                  <SelectItem value="fixed">Fixed Amount</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="discount-value">
              Discount Value {invoiceData.discountType === 'percentage' ? '(%)' : `(${invoiceData.currency})`}
            </Label>
            <Input
              id="discount-value"
              type="number"
              min="0"
              step="0.01"
              value={invoiceData.discountValue}
              onChange={(e) => updateInvoiceData('discountValue', parseFloat(e.target.value) || 0)}
              placeholder="0"
            />
          </div>
        </CardContent>
      </Card>

      {/* Notes & Terms */}
      <Card>
        <CardHeader>
          <CardTitle>Additional Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={invoiceData.notes}
              onChange={(e) => updateInvoiceData('notes', e.target.value)}
              placeholder="Thank you for your business!"
              rows={3}
            />
          </div>
          
          <div>
            <Label htmlFor="terms">Terms & Conditions</Label>
            <Textarea
              id="terms"
              value={invoiceData.terms}
              onChange={(e) => updateInvoiceData('terms', e.target.value)}
              placeholder="Payment is due within 30 days. Late payments may incur additional fees."
              rows={3}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
