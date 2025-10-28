
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { InvoiceData } from '../hooks/useInvoiceData';
import { Plus, Users, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ClientSectionProps {
  invoiceData: InvoiceData;
  updateInvoiceData: (field: keyof InvoiceData, value: any) => void;
}

interface SavedClient {
  id: string;
  name: string;
  email: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  phone: string;
}

export const ClientSection: React.FC<ClientSectionProps> = ({ invoiceData, updateInvoiceData }) => {
  const [savedClients, setSavedClients] = useState<SavedClient[]>([
    {
      id: '1',
      name: 'Acme Corporation',
      email: 'billing@acme.com',
      address: '123 Corporate Blvd',
      city: 'New York',
      state: 'NY',
      zip: '10001',
      country: 'United States',
      phone: '+1 (212) 555-0123'
    },
    {
      id: '2',
      name: 'Tech Solutions Inc',
      email: 'accounts@techsolutions.com',
      address: '456 Innovation Drive',
      city: 'San Francisco',
      state: 'CA',
      zip: '94105',
      country: 'United States',
      phone: '+1 (415) 555-0456'
    }
  ]);

  const saveCurrentClient = () => {
    const newClient: SavedClient = {
      id: Date.now().toString(),
      name: invoiceData.clientName,
      email: invoiceData.clientEmail,
      address: invoiceData.clientAddress,
      city: invoiceData.clientCity,
      state: invoiceData.clientState,
      zip: invoiceData.clientZip,
      country: invoiceData.clientCountry,
      phone: invoiceData.clientPhone
    };
    setSavedClients(prev => [...prev, newClient]);
  };

  const loadClient = (client: SavedClient) => {
    updateInvoiceData('clientName', client.name);
    updateInvoiceData('clientEmail', client.email);
    updateInvoiceData('clientAddress', client.address);
    updateInvoiceData('clientCity', client.city);
    updateInvoiceData('clientState', client.state);
    updateInvoiceData('clientZip', client.zip);
    updateInvoiceData('clientCountry', client.country);
    updateInvoiceData('clientPhone', client.phone);
  };

  const deleteClient = (id: string) => {
    setSavedClients(prev => prev.filter(client => client.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Saved Clients */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Saved Clients
          </CardTitle>
        </CardHeader>
        <CardContent>
          {savedClients.length > 0 ? (
            <div className="space-y-2">
              {savedClients.map(client => (
                <div key={client.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                  <div>
                    <p className="font-medium">{client.name}</p>
                    <p className="text-sm text-gray-600">{client.email}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => loadClient(client)}
                    >
                      Load
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => deleteClient(client.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">No saved clients</p>
          )}
        </CardContent>
      </Card>

      {/* Client Information Form */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Client Information</h3>
          <Button 
            variant="outline" 
            size="sm"
            onClick={saveCurrentClient}
            className="flex items-center gap-2"
            disabled={!invoiceData.clientName || !invoiceData.clientEmail}
          >
            <Plus className="h-4 w-4" />
            Save Client
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="client-name">Client Name *</Label>
            <Input
              id="client-name"
              value={invoiceData.clientName}
              onChange={(e) => updateInvoiceData('clientName', e.target.value)}
              placeholder="Client Company Name"
            />
          </div>
          
          <div>
            <Label htmlFor="client-email">Email</Label>
            <Input
              id="client-email"
              type="email"
              value={invoiceData.clientEmail}
              onChange={(e) => updateInvoiceData('clientEmail', e.target.value)}
              placeholder="contact@client.com"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="client-phone">Phone</Label>
          <Input
            id="client-phone"
            value={invoiceData.clientPhone}
            onChange={(e) => updateInvoiceData('clientPhone', e.target.value)}
            placeholder="+1 (555) 987-6543"
          />
        </div>

        <div>
          <Label htmlFor="client-address">Address</Label>
          <Input
            id="client-address"
            value={invoiceData.clientAddress}
            onChange={(e) => updateInvoiceData('clientAddress', e.target.value)}
            placeholder="456 Client Avenue"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="client-city">City</Label>
            <Input
              id="client-city"
              value={invoiceData.clientCity}
              onChange={(e) => updateInvoiceData('clientCity', e.target.value)}
              placeholder="Client City"
            />
          </div>
          
          <div>
            <Label htmlFor="client-state">State/Province</Label>
            <Input
              id="client-state"
              value={invoiceData.clientState}
              onChange={(e) => updateInvoiceData('clientState', e.target.value)}
              placeholder="State"
            />
          </div>
          
          <div>
            <Label htmlFor="client-zip">ZIP/Postal Code</Label>
            <Input
              id="client-zip"
              value={invoiceData.clientZip}
              onChange={(e) => updateInvoiceData('clientZip', e.target.value)}
              placeholder="67890"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="client-country">Country</Label>
          <Input
            id="client-country"
            value={invoiceData.clientCountry}
            onChange={(e) => updateInvoiceData('clientCountry', e.target.value)}
            placeholder="Country"
          />
        </div>
      </div>
    </div>
  );
};
