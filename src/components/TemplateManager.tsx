import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Save, FileText, Trash2, Download, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { InvoiceTemplate } from '@/lib/storage';

interface TemplateManagerProps {
  templates: InvoiceTemplate[];
  onSaveTemplate: (name: string, description: string) => boolean;
  onLoadTemplate: (templateId: string) => boolean;
  onDeleteTemplate: (templateId: string) => boolean;
  onRefreshTemplates: () => void;
}

export const TemplateManager: React.FC<TemplateManagerProps> = ({
  templates,
  onSaveTemplate,
  onLoadTemplate,
  onDeleteTemplate,
  onRefreshTemplates
}) => {
  const { toast } = useToast();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [templateName, setTemplateName] = useState('');
  const [templateDescription, setTemplateDescription] = useState('');

  const handleSaveTemplate = () => {
    if (!templateName.trim()) {
      toast({
        title: "Template name required",
        description: "Please enter a name for your template.",
        variant: "destructive",
      });
      return;
    }

    if (onSaveTemplate(templateName.trim(), templateDescription.trim())) {
      toast({
        title: "Template Saved",
        description: `Template "${templateName}" has been saved successfully.`,
      });
      setTemplateName('');
      setTemplateDescription('');
      setIsCreateDialogOpen(false);
      onRefreshTemplates();
    } else {
      toast({
        title: "Save Failed",
        description: "Unable to save template. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleLoadTemplate = (template: InvoiceTemplate) => {
    if (onLoadTemplate(template.id)) {
      toast({
        title: "Template Loaded",
        description: `Template "${template.name}" has been loaded.`,
      });
    } else {
      toast({
        title: "Load Failed",
        description: "Unable to load template. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteTemplate = (template: InvoiceTemplate) => {
    if (onDeleteTemplate(template.id)) {
      toast({
        title: "Template Deleted",
        description: `Template "${template.name}" has been deleted.`,
      });
      onRefreshTemplates();
    } else {
      toast({
        title: "Delete Failed",
        description: "Unable to delete template. Please try again.",
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Invoice Templates</CardTitle>
            <CardDescription>
              Save and reuse invoice configurations for faster setup
            </CardDescription>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Template
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Invoice Template</DialogTitle>
                <DialogDescription>
                  Save your current invoice configuration as a reusable template
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="template-name">Template Name</Label>
                  <Input
                    id="template-name"
                    placeholder="e.g., Standard Service Invoice"
                    value={templateName}
                    onChange={(e) => setTemplateName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="template-description">Description (optional)</Label>
                  <Textarea
                    id="template-description"
                    placeholder="Brief description of this template..."
                    value={templateDescription}
                    onChange={(e) => setTemplateDescription(e.target.value)}
                    rows={3}
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSaveTemplate}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Template
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {templates.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium mb-2">No templates yet</p>
            <p className="text-sm">Create your first template to save time on future invoices</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {templates.map((template) => (
              <div
                key={template.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-secondary/20 transition-colors"
              >
                <div className="flex-1">
                  <h4 className="font-medium">{template.name}</h4>
                  {template.description && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {template.description}
                    </p>
                  )}
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="secondary" className="text-xs">
                      Created {formatDate(template.createdAt)}
                    </Badge>
                    {template.updatedAt !== template.createdAt && (
                      <Badge variant="outline" className="text-xs">
                        Updated {formatDate(template.updatedAt)}
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleLoadTemplate(template)}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Load
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Template</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete "{template.name}"? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDeleteTemplate(template)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};