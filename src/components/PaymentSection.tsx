
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { InvoiceData } from '../hooks/useInvoiceData';
import { Plus, X, CreditCard } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface PaymentSectionProps {
  invoiceData: InvoiceData;
  updateInvoiceData: (field: keyof InvoiceData, value: any) => void;
}

export const PaymentSection: React.FC<PaymentSectionProps> = ({ invoiceData, updateInvoiceData }) => {
  const [newPaymentMethod, setNewPaymentMethod] = useState('');

  const commonPaymentMethods = [
    'Bank Transfer',
    'Credit Card',
    'PayPal',
    'Stripe',
    'Check',
    'Cash',
    'Wire Transfer',
    'ACH',
    'Zelle',
    'Venmo'
  ];

  const addPaymentMethod = (method: string) => {
    if (!invoiceData.paymentMethods.includes(method)) {
      updateInvoiceData('paymentMethods', [...invoiceData.paymentMethods, method]);
    }
  };

  const removePaymentMethod = (method: string) => {
    updateInvoiceData('paymentMethods', 
      invoiceData.paymentMethods.filter(m => m !== method)
    );
  };

  const addCustomPaymentMethod = () => {
    if (newPaymentMethod && !invoiceData.paymentMethods.includes(newPaymentMethod)) {
      addPaymentMethod(newPaymentMethod);
      setNewPaymentMethod('');
    }
  };

  return (
    <div className="space-y-6">
      {/* Payment Methods */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Payment Methods
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Common Payment Methods */}
          <div>
            <Label className="text-base font-medium">Select Payment Methods</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
              {commonPaymentMethods.map(method => (
                <div key={method} className="flex items-center space-x-2">
                  <Checkbox
                    id={`payment-${method}`}
                    checked={invoiceData.paymentMethods.includes(method)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        addPaymentMethod(method);
                      } else {
                        removePaymentMethod(method);
                      }
                    }}
                  />
                  <Label 
                    htmlFor={`payment-${method}`}
                    className="text-sm font-normal cursor-pointer"
                  >
                    {method}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Custom Payment Method */}
          <div>
            <Label htmlFor="custom-payment">Add Custom Payment Method</Label>
            <div className="flex gap-2 mt-1">
              <Input
                id="custom-payment"
                value={newPaymentMethod}
                onChange={(e) => setNewPaymentMethod(e.target.value)}
                placeholder="Enter custom payment method"
                onKeyPress={(e) => e.key === 'Enter' && addCustomPaymentMethod()}
              />
              <Button onClick={addCustomPaymentMethod} disabled={!newPaymentMethod}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Selected Payment Methods */}
          {invoiceData.paymentMethods.length > 0 && (
            <div>
              <Label className="text-base font-medium">Selected Payment Methods</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {invoiceData.paymentMethods.map(method => (
                  <div 
                    key={method} 
                    className="flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                  >
                    {method}
                    <button
                      onClick={() => removePaymentMethod(method)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Payment Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Instructions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="payment-instructions">Payment Instructions</Label>
            <Textarea
              id="payment-instructions"
              value={invoiceData.paymentInstructions}
              onChange={(e) => updateInvoiceData('paymentInstructions', e.target.value)}
              placeholder="Payment is due within 30 days of invoice date. Please include invoice number in payment reference."
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="bank-details">Bank Details</Label>
            <Textarea
              id="bank-details"
              value={invoiceData.bankDetails}
              onChange={(e) => updateInvoiceData('bankDetails', e.target.value)}
              placeholder={`Bank: Your Bank Name
Account Name: Your Company Name
Account Number: 1234567890
Routing Number: 123456789
SWIFT/BIC: YOURBANK123 (for international transfers)`}
              rows={6}
            />
            <p className="text-sm text-gray-600 mt-1">
              Include bank details for wire transfers and international payments
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
