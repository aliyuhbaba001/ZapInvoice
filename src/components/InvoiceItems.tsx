
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { InvoiceItem } from '../hooks/useInvoiceData';
import { Plus, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface InvoiceItemsProps {
  items: InvoiceItem[];
  addItem: () => void;
  removeItem: (id: string) => void;
  updateItem: (id: string, field: keyof InvoiceItem, value: any) => void;
  currency: string;
}

export const InvoiceItems: React.FC<InvoiceItemsProps> = ({
  items,
  addItem,
  removeItem,
  updateItem,
  currency
}) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD'
    }).format(amount);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Invoice Items
          <Button onClick={addItem} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Item
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {items.map((item, index) => (
            <div key={item.id} className="border rounded-lg p-4 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Item {index + 1}</h4>
                {items.length > 1 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeItem(item.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <Label htmlFor={`description-${item.id}`}>Description *</Label>
                  <Input
                    id={`description-${item.id}`}
                    value={item.description}
                    onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                    placeholder="Professional services, consulting, etc."
                  />
                </div>

                <div>
                  <Label htmlFor={`code-${item.id}`}>Item Code (Optional)</Label>
                  <Input
                    id={`code-${item.id}`}
                    value={item.code || ''}
                    onChange={(e) => updateItem(item.id, 'code', e.target.value)}
                    placeholder="SKU or item code"
                  />
                </div>

                <div>
                  <Label htmlFor={`quantity-${item.id}`}>Quantity</Label>
                  <Input
                    id={`quantity-${item.id}`}
                    type="number"
                    min="0"
                    step="0.01"
                    value={item.quantity}
                    onChange={(e) => updateItem(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                  />
                </div>

                <div>
                  <Label htmlFor={`unitPrice-${item.id}`}>Unit Price</Label>
                  <Input
                    id={`unitPrice-${item.id}`}
                    type="number"
                    min="0"
                    step="0.01"
                    value={item.unitPrice}
                    onChange={(e) => updateItem(item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                  />
                </div>

                <div>
                  <Label>Total</Label>
                  <div className="h-10 px-3 py-2 bg-gray-50 border rounded-md flex items-center font-semibold">
                    {formatCurrency(item.total)}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {items.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <p>No items added yet</p>
              <Button onClick={addItem} className="mt-2">
                Add Your First Item
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
