
import { useState, useEffect, useCallback, useRef } from 'react';
import { localStorageUtils, sessionStorageUtils, storageUtils, type CompanyProfile, type InvoiceTemplate } from '@/lib/storage';

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
  code?: string;
}

export interface InvoiceData {
  // Invoice Details
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  paymentTerms: string;
  
  // Company Information
  companyName: string;
  companyAddress: string;
  companyCity: string;
  companyState: string;
  companyZip: string;
  companyCountry: string;
  companyPhone: string;
  companyEmail: string;
  companyWebsite: string;
  companyTaxId: string;
  companyLogo: string;
  brandColor: string;
  
  // Client Information
  clientName: string;
  clientAddress: string;
  clientCity: string;
  clientState: string;
  clientZip: string;
  clientCountry: string;
  clientEmail: string;
  clientPhone: string;
  
  // Invoice Items
  items: InvoiceItem[];
  
  // Financial
  currency: string;
  taxRate: number;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  
  // Payment
  paymentMethods: string[];
  paymentInstructions: string;
  bankDetails: string;
  
  // Settings
  notes: string;
  terms: string;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
}

const initialInvoiceData: InvoiceData = {
  invoiceNumber: 'INV-001',
  invoiceDate: new Date().toISOString().split('T')[0],
  dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  paymentTerms: 'Net 30',
  
  companyName: 'Your Company Name',
  companyAddress: '123 Business Street',
  companyCity: 'Business City',
  companyState: 'State',
  companyZip: '12345',
  companyCountry: 'Country',
  companyPhone: '+1 (555) 123-4567',
  companyEmail: 'billing@company.com',
  companyWebsite: 'www.company.com',
  companyTaxId: 'TAX123456789',
  companyLogo: '',
  brandColor: '#3b82f6',
  
  clientName: 'Client Company Name',
  clientAddress: '456 Client Avenue',
  clientCity: 'Client City',
  clientState: 'State',
  clientZip: '67890',
  clientCountry: 'Country',
  clientEmail: 'contact@client.com',
  clientPhone: '+1 (555) 987-6543',
  
  items: [
    {
      id: '1',
      description: 'Professional Services',
      quantity: 1,
      unitPrice: 1000,
      total: 1000,
      code: 'SRV-001'
    }
  ],
  
  currency: 'USD',
  taxRate: 10,
  discountType: 'percentage',
  discountValue: 0,
  
  paymentMethods: ['Bank Transfer', 'Credit Card'],
  paymentInstructions: 'Payment is due within 30 days of invoice date.',
  bankDetails: 'Bank: Your Bank Name\nAccount: 1234567890\nRouting: 123456789',
  
  notes: 'Thank you for your business!',
  terms: 'Payment is due within 30 days. Late payments may incur additional fees.',
  status: 'draft'
};

export const useInvoiceData = () => {
  const [invoiceData, setInvoiceData] = useState<InvoiceData>(initialInvoiceData);
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout>();

  // Load company profile and session data on mount
  useEffect(() => {
    // Load company profile from localStorage
    const companyProfile = localStorageUtils.loadCompanyProfile();
    if (companyProfile) {
      setInvoiceData(prev => storageUtils.mergeCompanyProfile(prev, companyProfile));
    }

    // Load current invoice from sessionStorage
    const { data: sessionData, timestamp } = sessionStorageUtils.loadCurrentInvoice();
    if (sessionData) {
      setInvoiceData(sessionData);
      setLastSaved(timestamp);
    }
  }, []);

  // Auto-save functionality
  const autoSave = useCallback((data: InvoiceData) => {
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
    }

    autoSaveTimeoutRef.current = setTimeout(() => {
      setIsAutoSaving(true);
      if (sessionStorageUtils.saveCurrentInvoice(data)) {
        setLastSaved(new Date().toISOString());
      }
      setIsAutoSaving(false);
    }, 2000); // Auto-save after 2 seconds of inactivity
  }, []);

  // Enhanced setInvoiceData with auto-save
  const setInvoiceDataWithAutoSave = useCallback((data: InvoiceData | ((prev: InvoiceData) => InvoiceData)) => {
    setInvoiceData(prev => {
      const newData = typeof data === 'function' ? data(prev) : data;
      autoSave(newData);
      return newData;
    });
  }, [autoSave]);

  const updateInvoiceData = (field: keyof InvoiceData, value: any) => {
    setInvoiceDataWithAutoSave(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addItem = () => {
    const newItem: InvoiceItem = {
      id: Date.now().toString(),
      description: '',
      quantity: 1,
      unitPrice: 0,
      total: 0
    };
    setInvoiceDataWithAutoSave(prev => ({
      ...prev,
      items: [...prev.items, newItem]
    }));
  };

  const removeItem = (id: string) => {
    setInvoiceDataWithAutoSave(prev => ({
      ...prev,
      items: prev.items.filter(item => item.id !== id)
    }));
  };

  const updateItem = (id: string, field: keyof InvoiceItem, value: any) => {
    setInvoiceDataWithAutoSave(prev => ({
      ...prev,
      items: prev.items.map(item => {
        if (item.id === id) {
          const updatedItem = { ...item, [field]: value };
          if (field === 'quantity' || field === 'unitPrice') {
            updatedItem.total = updatedItem.quantity * updatedItem.unitPrice;
          }
          return updatedItem;
        }
        return item;
      })
    }));
  };

  // Company profile management
  const saveCompanyProfile = useCallback(() => {
    const profile = storageUtils.extractCompanyProfile(invoiceData);
    return localStorageUtils.saveCompanyProfile(profile);
  }, [invoiceData]);

  const loadCompanyProfile = useCallback(() => {
    const profile = localStorageUtils.loadCompanyProfile();
    if (profile) {
      setInvoiceDataWithAutoSave(prev => storageUtils.mergeCompanyProfile(prev, profile));
      return true;
    }
    return false;
  }, [setInvoiceDataWithAutoSave]);

  // Template management
  const saveAsTemplate = useCallback((name: string, description: string = '') => {
    const template: InvoiceTemplate = {
      id: Date.now().toString(),
      name,
      description,
      data: { ...invoiceData },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    return localStorageUtils.saveInvoiceTemplate(template);
  }, [invoiceData]);

  const loadTemplate = useCallback((templateId: string) => {
    const templates = localStorageUtils.loadInvoiceTemplates();
    const template = templates.find(t => t.id === templateId);
    if (template && template.data) {
      setInvoiceDataWithAutoSave(prev => ({ ...prev, ...template.data }));
      return true;
    }
    return false;
  }, [setInvoiceDataWithAutoSave]);

  const getTemplates = useCallback(() => {
    return localStorageUtils.loadInvoiceTemplates();
  }, []);

  const deleteTemplate = useCallback((templateId: string) => {
    return localStorageUtils.deleteInvoiceTemplate(templateId);
  }, []);

  // Session management
  const clearSession = useCallback(() => {
    sessionStorageUtils.clearCurrentInvoice();
    setLastSaved(null);
  }, []);

  const resetInvoice = useCallback(() => {
    setInvoiceDataWithAutoSave(initialInvoiceData);
    clearSession();
  }, [setInvoiceDataWithAutoSave, clearSession]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, []);

  return {
    invoiceData,
    updateInvoiceData,
    addItem,
    removeItem,
    updateItem,
    // Storage management
    isAutoSaving,
    lastSaved,
    saveCompanyProfile,
    loadCompanyProfile,
    // Template management
    saveAsTemplate,
    loadTemplate,
    getTemplates,
    deleteTemplate,
    // Session management
    clearSession,
    resetInvoice
  };
};
