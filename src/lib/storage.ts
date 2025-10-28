// Storage utility service for localStorage and sessionStorage
import { InvoiceData } from '@/hooks/useInvoiceData';

// Keys for localStorage
const STORAGE_KEYS = {
  COMPANY_PROFILE: 'zapinvoice_company_profile',
  INVOICE_TEMPLATES: 'zapinvoice_invoice_templates',
  APP_SETTINGS: 'zapinvoice_app_settings',
} as const;

// Keys for sessionStorage
const SESSION_KEYS = {
  CURRENT_INVOICE: 'zapinvoice_current_invoice',
  AUTO_SAVE_TIMESTAMP: 'zapinvoice_auto_save_timestamp',
} as const;

// Company profile interface (subset of InvoiceData)
export interface CompanyProfile {
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
  paymentMethods: string[];
  bankDetails: string;
}

// Invoice template interface
export interface InvoiceTemplate {
  id: string;
  name: string;
  description: string;
  data: Partial<InvoiceData>;
  createdAt: string;
  updatedAt: string;
}

// localStorage utilities
export const localStorageUtils = {
  // Company profile management
  saveCompanyProfile: (profile: CompanyProfile): boolean => {
    try {
      localStorage.setItem(STORAGE_KEYS.COMPANY_PROFILE, JSON.stringify(profile));
      return true;
    } catch (error) {
      console.error('Failed to save company profile:', error);
      return false;
    }
  },

  loadCompanyProfile: (): CompanyProfile | null => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.COMPANY_PROFILE);
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.error('Failed to load company profile:', error);
      return null;
    }
  },

  // Invoice templates management
  saveInvoiceTemplate: (template: InvoiceTemplate): boolean => {
    try {
      const templates = localStorageUtils.loadInvoiceTemplates();
      const updatedTemplates = templates.filter(t => t.id !== template.id);
      updatedTemplates.push({
        ...template,
        updatedAt: new Date().toISOString()
      });
      localStorage.setItem(STORAGE_KEYS.INVOICE_TEMPLATES, JSON.stringify(updatedTemplates));
      return true;
    } catch (error) {
      console.error('Failed to save invoice template:', error);
      return false;
    }
  },

  loadInvoiceTemplates: (): InvoiceTemplate[] => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.INVOICE_TEMPLATES);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Failed to load invoice templates:', error);
      return [];
    }
  },

  deleteInvoiceTemplate: (templateId: string): boolean => {
    try {
      const templates = localStorageUtils.loadInvoiceTemplates();
      const updatedTemplates = templates.filter(t => t.id !== templateId);
      localStorage.setItem(STORAGE_KEYS.INVOICE_TEMPLATES, JSON.stringify(updatedTemplates));
      return true;
    } catch (error) {
      console.error('Failed to delete invoice template:', error);
      return false;
    }
  },

  // Clear all localStorage data
  clearAllData: (): boolean => {
    try {
      Object.values(STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key);
      });
      return true;
    } catch (error) {
      console.error('Failed to clear localStorage data:', error);
      return false;
    }
  }
};

// sessionStorage utilities
export const sessionStorageUtils = {
  // Auto-save current invoice data
  saveCurrentInvoice: (invoiceData: InvoiceData): boolean => {
    try {
      sessionStorage.setItem(SESSION_KEYS.CURRENT_INVOICE, JSON.stringify(invoiceData));
      sessionStorage.setItem(SESSION_KEYS.AUTO_SAVE_TIMESTAMP, new Date().toISOString());
      return true;
    } catch (error) {
      console.error('Failed to save current invoice:', error);
      return false;
    }
  },

  loadCurrentInvoice: (): { data: InvoiceData | null; timestamp: string | null } => {
    try {
      const stored = sessionStorage.getItem(SESSION_KEYS.CURRENT_INVOICE);
      const timestamp = sessionStorage.getItem(SESSION_KEYS.AUTO_SAVE_TIMESTAMP);
      return {
        data: stored ? JSON.parse(stored) : null,
        timestamp
      };
    } catch (error) {
      console.error('Failed to load current invoice:', error);
      return { data: null, timestamp: null };
    }
  },

  clearCurrentInvoice: (): boolean => {
    try {
      sessionStorage.removeItem(SESSION_KEYS.CURRENT_INVOICE);
      sessionStorage.removeItem(SESSION_KEYS.AUTO_SAVE_TIMESTAMP);
      return true;
    } catch (error) {
      console.error('Failed to clear current invoice:', error);
      return false;
    }
  },

  getAutoSaveTimestamp: (): string | null => {
    return sessionStorage.getItem(SESSION_KEYS.AUTO_SAVE_TIMESTAMP);
  }
};

// Utility functions
export const storageUtils = {
  // Extract company profile from invoice data
  extractCompanyProfile: (invoiceData: InvoiceData): CompanyProfile => ({
    companyName: invoiceData.companyName,
    companyAddress: invoiceData.companyAddress,
    companyCity: invoiceData.companyCity,
    companyState: invoiceData.companyState,
    companyZip: invoiceData.companyZip,
    companyCountry: invoiceData.companyCountry,
    companyPhone: invoiceData.companyPhone,
    companyEmail: invoiceData.companyEmail,
    companyWebsite: invoiceData.companyWebsite,
    companyTaxId: invoiceData.companyTaxId,
    companyLogo: invoiceData.companyLogo,
    brandColor: invoiceData.brandColor,
    paymentMethods: invoiceData.paymentMethods,
    bankDetails: invoiceData.bankDetails,
  }),

  // Merge company profile into invoice data
  mergeCompanyProfile: (invoiceData: InvoiceData, profile: CompanyProfile): InvoiceData => ({
    ...invoiceData,
    ...profile,
  }),

  // Check if storage is available
  isStorageAvailable: (type: 'localStorage' | 'sessionStorage'): boolean => {
    try {
      const storage = window[type];
      const testKey = '__storage_test__';
      storage.setItem(testKey, 'test');
      storage.removeItem(testKey);
      return true;
    } catch (error) {
      return false;
    }
  }
};