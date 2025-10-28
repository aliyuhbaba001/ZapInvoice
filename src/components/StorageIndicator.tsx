import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Save, Clock, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface StorageIndicatorProps {
  isAutoSaving: boolean;
  lastSaved: string | null;
  onSaveCompanyProfile: () => boolean;
}

export const StorageIndicator: React.FC<StorageIndicatorProps> = ({
  isAutoSaving,
  lastSaved,
  onSaveCompanyProfile
}) => {
  const { toast } = useToast();

  const handleSaveProfile = () => {
    if (onSaveCompanyProfile()) {
      toast({
        title: "Company Profile Saved",
        description: "Your company information has been saved for future use.",
      });
    } else {
      toast({
        title: "Save Failed",
        description: "Unable to save company profile. Please try again.",
        variant: "destructive",
      });
    }
  };

  const formatLastSaved = (timestamp: string | null) => {
    if (!timestamp) return 'Never';
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMinutes = Math.floor(diffMs / 60000);
    
    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    if (diffMinutes < 1440) return `${Math.floor(diffMinutes / 60)}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="flex items-center gap-3 p-3 bg-secondary/20 rounded-lg border">
      <div className="flex items-center gap-2">
        {isAutoSaving ? (
          <div className="flex items-center gap-2 text-primary">
            <Clock className="h-4 w-4 animate-spin" />
            <Badge variant="secondary">Saving...</Badge>
          </div>
        ) : lastSaved ? (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span className="text-sm">Saved {formatLastSaved(lastSaved)}</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-amber-600">
            <AlertCircle className="h-4 w-4" />
            <span className="text-sm">Not saved</span>
          </div>
        )}
      </div>
      
      <Button
        onClick={handleSaveProfile}
        size="sm"
        variant="outline"
        className="ml-auto"
      >
        <Save className="h-4 w-4 mr-2" />
        Save Profile
      </Button>
    </div>
  );
};