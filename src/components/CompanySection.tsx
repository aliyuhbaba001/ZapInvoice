
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { InvoiceData } from '../hooks/useInvoiceData';
import { Upload, Image, Loader2 } from 'lucide-react';
import { optimizeCompanyLogo } from '../lib/logoOptimizer';
import { toast } from '@/components/ui/use-toast';

interface CompanySectionProps {
  invoiceData: InvoiceData;
  updateInvoiceData: (field: keyof InvoiceData, value: any) => void;
}

export const CompanySection: React.FC<CompanySectionProps> = ({ invoiceData, updateInvoiceData }) => {
  const [isOptimizingLogo, setIsOptimizingLogo] = useState(false);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml'];
    if (!validTypes.includes(file.type)) {
      toast({
        title: "Invalid File Type",
        description: "Please upload a PNG, JPG, or SVG file.",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      toast({
        title: "File Too Large",
        description: "Please upload a file smaller than 5MB.",
        variant: "destructive",
      });
      return;
    }

    setIsOptimizingLogo(true);
    try {
      // Optimize the logo for better performance and PDF export
      const optimizedLogo = await optimizeCompanyLogo(file);
      updateInvoiceData('companyLogo', optimizedLogo);
      
      toast({
        title: "Logo Uploaded",
        description: "Your company logo has been optimized and uploaded successfully!",
      });
    } catch (error) {
      console.error('Logo optimization error:', error);
      
      // Fallback to original file reading if optimization fails
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        updateInvoiceData('companyLogo', result);
        
        toast({
          title: "Logo Uploaded",
          description: "Logo uploaded successfully (optimization unavailable).",
        });
      };
      reader.onerror = () => {
        toast({
          title: "Upload Failed",
          description: "Failed to upload logo. Please try again.",
          variant: "destructive",
        });
      };
      reader.readAsDataURL(file);
    } finally {
      setIsOptimizingLogo(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Company Information</h3>
        
        {/* Logo Upload */}
        <div className="mb-6">
          <Label htmlFor="logo-upload" className="text-sm font-medium">Company Logo</Label>
          <div className="mt-2 flex items-center space-x-4">
            {invoiceData.companyLogo ? (
              <div className="flex items-center space-x-4">
                <img 
                  src={invoiceData.companyLogo} 
                  alt="Company Logo" 
                  className="h-16 w-16 object-contain border rounded"
                />
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => updateInvoiceData('companyLogo', '')}
                >
                  Remove
                </Button>
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Image className="mx-auto h-8 w-8 text-gray-400" />
                <p className="mt-2 text-sm text-gray-600">Upload your company logo</p>
                <p className="text-xs text-gray-500">PNG, JPG, SVG up to 5MB</p>
              </div>
            )}
          </div>
          <div className="mt-2">
            <input
              id="logo-upload"
              type="file"
              accept="image/png,image/jpeg,image/svg+xml"
              onChange={handleFileUpload}
              className="hidden"
            />
            <Button 
              variant="outline" 
              onClick={() => document.getElementById('logo-upload')?.click()}
              className="flex items-center gap-2"
              disabled={isOptimizingLogo}
            >
              {isOptimizingLogo ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Upload className="h-4 w-4" />
              )}
              {isOptimizingLogo ? 'Optimizing...' : 'Upload Logo'}
            </Button>
          </div>
        </div>

        {/* Brand Color */}
        <div className="mb-6">
          <Label htmlFor="brand-color" className="text-sm font-medium">Brand Color</Label>
          <div className="mt-2 flex items-center space-x-2">
            <input
              id="brand-color"
              type="color"
              value={invoiceData.brandColor}
              onChange={(e) => updateInvoiceData('brandColor', e.target.value)}
              className="h-10 w-20 rounded border border-gray-300"
            />
            <Input
              value={invoiceData.brandColor}
              onChange={(e) => updateInvoiceData('brandColor', e.target.value)}
              placeholder="#3b82f6"
              className="flex-1"
            />
          </div>
        </div>

        {/* Company Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="company-name">Company Name *</Label>
            <Input
              id="company-name"
              value={invoiceData.companyName}
              onChange={(e) => updateInvoiceData('companyName', e.target.value)}
              placeholder="Your Company Name"
            />
          </div>
          
          <div>
            <Label htmlFor="company-email">Email *</Label>
            <Input
              id="company-email"
              type="email"
              value={invoiceData.companyEmail}
              onChange={(e) => updateInvoiceData('companyEmail', e.target.value)}
              placeholder="billing@company.com"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="company-phone">Phone</Label>
            <Input
              id="company-phone"
              value={invoiceData.companyPhone}
              onChange={(e) => updateInvoiceData('companyPhone', e.target.value)}
              placeholder="+1 (555) 123-4567"
            />
          </div>
          
          <div>
            <Label htmlFor="company-website">Website</Label>
            <Input
              id="company-website"
              value={invoiceData.companyWebsite}
              onChange={(e) => updateInvoiceData('companyWebsite', e.target.value)}
              placeholder="www.company.com"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="company-address">Address</Label>
          <Input
            id="company-address"
            value={invoiceData.companyAddress}
            onChange={(e) => updateInvoiceData('companyAddress', e.target.value)}
            placeholder="123 Business Street"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="company-city">City</Label>
            <Input
              id="company-city"
              value={invoiceData.companyCity}
              onChange={(e) => updateInvoiceData('companyCity', e.target.value)}
              placeholder="Business City"
            />
          </div>
          
          <div>
            <Label htmlFor="company-state">State/Province</Label>
            <Input
              id="company-state"
              value={invoiceData.companyState}
              onChange={(e) => updateInvoiceData('companyState', e.target.value)}
              placeholder="State"
            />
          </div>
          
          <div>
            <Label htmlFor="company-zip">ZIP/Postal Code</Label>
            <Input
              id="company-zip"
              value={invoiceData.companyZip}
              onChange={(e) => updateInvoiceData('companyZip', e.target.value)}
              placeholder="12345"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="company-country">Country</Label>
            <Input
              id="company-country"
              value={invoiceData.companyCountry}
              onChange={(e) => updateInvoiceData('companyCountry', e.target.value)}
              placeholder="Country"
            />
          </div>
          
          <div>
            <Label htmlFor="company-tax-id">Tax ID / Registration Number</Label>
            <Input
              id="company-tax-id"
              value={invoiceData.companyTaxId}
              onChange={(e) => updateInvoiceData('companyTaxId', e.target.value)}
              placeholder="TAX123456789"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
