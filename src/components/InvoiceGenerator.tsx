
import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { InvoicePreview } from './InvoicePreview';
import { CompanySection } from './CompanySection';
import { ClientSection } from './ClientSection';
import { InvoiceItems } from './InvoiceItems';
import { InvoiceSettings } from './InvoiceSettings';
import { PaymentSection } from './PaymentSection';
import { ExportActions } from './ExportActions';
import { StorageIndicator } from './StorageIndicator';
import { TemplateManager } from './TemplateManager';
import { useInvoiceData } from '../hooks/useInvoiceData';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Settings, Users, CreditCard, Download, FolderOpen } from 'lucide-react';

const InvoiceGenerator = () => {
  const { 
    invoiceData, 
    updateInvoiceData, 
    addItem, 
    removeItem, 
    updateItem,
    isAutoSaving,
    lastSaved,
    saveCompanyProfile,
    saveAsTemplate,
    loadTemplate,
    getTemplates,
    deleteTemplate
  } = useInvoiceData();
  const [activeTab, setActiveTab] = useState('invoice');
  const [templates, setTemplates] = useState(getTemplates());
  const invoiceRef = useRef<HTMLDivElement>(null);

  const refreshTemplates = () => {
    setTemplates(getTemplates());
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent mb-2">
            ⚡ ZapInvoice
          </h1>
          <p className="text-lg text-muted-foreground">Create beautiful, professional invoices in minutes</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Panel - Invoice Builder */}
          <div className="space-y-6">
            {/* Storage Indicator */}
            <StorageIndicator
              isAutoSaving={isAutoSaving}
              lastSaved={lastSaved}
              onSaveCompanyProfile={saveCompanyProfile}
            />

            <Card className="shadow-lg border-0 bg-card/50 backdrop-blur">
              <CardHeader className="bg-gradient-primary text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Invoice Builder
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-6 rounded-none border-b">
                    <TabsTrigger value="invoice" className="flex items-center gap-1">
                      <FileText className="h-4 w-4" />
                      <span className="hidden sm:inline">Invoice</span>
                    </TabsTrigger>
                    <TabsTrigger value="company" className="flex items-center gap-1">
                      <Settings className="h-4 w-4" />
                      <span className="hidden sm:inline">Company</span>
                    </TabsTrigger>
                    <TabsTrigger value="client" className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span className="hidden sm:inline">Client</span>
                    </TabsTrigger>
                    <TabsTrigger value="payment" className="flex items-center gap-1">
                      <CreditCard className="h-4 w-4" />
                      <span className="hidden sm:inline">Payment</span>
                    </TabsTrigger>
                    <TabsTrigger value="templates" className="flex items-center gap-1">
                      <FolderOpen className="h-4 w-4" />
                      <span className="hidden sm:inline">Templates</span>
                    </TabsTrigger>
                    <TabsTrigger value="export" className="flex items-center gap-1">
                      <Download className="h-4 w-4" />
                      <span className="hidden sm:inline">Export</span>
                    </TabsTrigger>
                  </TabsList>

                  <div className="p-6">
                    <TabsContent value="invoice" className="space-y-6 mt-0">
                      <InvoiceSettings invoiceData={invoiceData} updateInvoiceData={updateInvoiceData} />
                      <Separator />
                      <InvoiceItems 
                        items={invoiceData.items}
                        addItem={addItem}
                        removeItem={removeItem}
                        updateItem={updateItem}
                        currency={invoiceData.currency}
                      />
                    </TabsContent>

                    <TabsContent value="company" className="mt-0">
                      <CompanySection invoiceData={invoiceData} updateInvoiceData={updateInvoiceData} />
                    </TabsContent>

                    <TabsContent value="client" className="mt-0">
                      <ClientSection invoiceData={invoiceData} updateInvoiceData={updateInvoiceData} />
                    </TabsContent>

                    <TabsContent value="payment" className="mt-0">
                      <PaymentSection invoiceData={invoiceData} updateInvoiceData={updateInvoiceData} />
                    </TabsContent>

                    <TabsContent value="templates" className="mt-0">
                      <TemplateManager
                        templates={templates}
                        onSaveTemplate={saveAsTemplate}
                        onLoadTemplate={loadTemplate}
                        onDeleteTemplate={deleteTemplate}
                        onRefreshTemplates={refreshTemplates}
                      />
                    </TabsContent>

                    <TabsContent value="export" className="mt-0">
                      <ExportActions invoiceRef={invoiceRef} invoiceData={invoiceData} />
                    </TabsContent>
                  </div>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Right Panel - Live Preview */}
          <div className="space-y-6">
            <Card className="shadow-lg border-0 bg-card/50 backdrop-blur">
              <CardHeader className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Live Preview
                  <Badge variant="secondary" className="ml-auto bg-white text-emerald-600">
                    Real-time
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="bg-gray-50 p-4 max-h-[800px] overflow-y-auto">
                  <InvoicePreview ref={invoiceRef} invoiceData={invoiceData} />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceGenerator;
