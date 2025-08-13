import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  Instagram,
  Twitter,
  Facebook,
  Linkedin,
  Youtube,
  Link as LinkIcon,
  Users,
  Loader2
} from 'lucide-react';
import { socialSetsApi } from '@/lib/socialSetsApi';
import type { SocialSet } from '@/types';

interface SocialMediaAccount {
  id: string;
  platform: string;
  username: string;
  is_active: boolean;
  follower_count: number;
  following_count: number;
  platform_user_id: string;
  created_at: string;
}

interface CreateSocialSetDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSocialSetCreated: () => void;
  editingSocialSet?: SocialSet | null;
}

const CreateSocialSetDialog: React.FC<CreateSocialSetDialogProps> = ({
  open,
  onOpenChange,
  onSocialSetCreated,
  editingSocialSet
}) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    selectedAccounts: [] as string[]
  });
  const [availableAccounts, setAvailableAccounts] = useState<SocialMediaAccount[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingAccounts, setLoadingAccounts] = useState(false);

  const isEditing = !!editingSocialSet;

  const loadAvailableAccounts = React.useCallback(async () => {
    try {
      setLoadingAccounts(true);
      const accounts = await socialSetsApi.getAvailableAccounts();
      setAvailableAccounts(accounts);
    } catch (error) {
      console.error('Failed to load available accounts:', error);
      toast({
        title: "Error",
        description: "Failed to load social media accounts.",
        variant: "destructive",
      });
    } finally {
      setLoadingAccounts(false);
    }
  }, [toast]);

  useEffect(() => {
    if (open) {
      loadAvailableAccounts();
      
      if (isEditing && editingSocialSet) {
        setFormData({
          name: editingSocialSet.name,
          description: editingSocialSet.description || '',
          selectedAccounts: editingSocialSet.platforms.map(p => p.id)
        });
      } else {
        setFormData({
          name: '',
          description: '',
          selectedAccounts: []
        });
      }
    }
  }, [open, editingSocialSet, isEditing, loadAvailableAccounts]);

  const getPlatformIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'instagram':
        return <Instagram className="h-5 w-5" />;
      case 'twitter':
        return <Twitter className="h-5 w-5" />;
      case 'facebook':
        return <Facebook className="h-5 w-5" />;
      case 'linkedin':
        return <Linkedin className="h-5 w-5" />;
      case 'youtube':
        return <Youtube className="h-5 w-5" />;
      default:
        return <LinkIcon className="h-5 w-5" />;
    }
  };

  const getPlatformColor = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'instagram':
        return 'text-pink-600 bg-pink-100';
      case 'twitter':
        return 'text-blue-600 bg-blue-100';
      case 'facebook':
        return 'text-blue-700 bg-blue-100';
      case 'linkedin':
        return 'text-blue-800 bg-blue-100';
      case 'youtube':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const handleAccountToggle = (accountId: string) => {
    setFormData(prev => ({
      ...prev,
      selectedAccounts: prev.selectedAccounts.includes(accountId)
        ? prev.selectedAccounts.filter(id => id !== accountId)
        : [...prev.selectedAccounts, accountId]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter a name for your social set.",
        variant: "destructive",
      });
      return;
    }

    if (formData.selectedAccounts.length === 0) {
      toast({
        title: "Validation Error",
        description: "Please select at least one social media account.",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      
      if (isEditing && editingSocialSet) {
        await socialSetsApi.updateSocialSet(editingSocialSet.id, {
          name: formData.name,
          description: formData.description,
          accounts: formData.selectedAccounts
        });
        toast({
          title: "Updated",
          description: "Social set has been updated successfully.",
        });
      } else {
        await socialSetsApi.createSocialSet({
          name: formData.name,
          description: formData.description,
          accounts: formData.selectedAccounts
        });
        toast({
          title: "Created",
          description: "Social set has been created successfully.",
        });
      }
      
      onSocialSetCreated();
      onOpenChange(false);
    } catch (error) {
      console.error('Failed to save social set:', error);
      toast({
        title: "Error",
        description: `Failed to ${isEditing ? 'update' : 'create'} social set.`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Edit Social Set' : 'Create New Social Set'}
          </DialogTitle>
          <DialogDescription>
            {isEditing 
              ? 'Update your social set configuration and selected accounts.'
              : 'Create a collection of social media accounts for coordinated posting.'
            }
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Social Set Name *</Label>
              <Input
                id="name"
                placeholder="e.g., Main Brand, Personal, Campaign 2025"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                placeholder="Describe the purpose of this social set..."
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="mt-1"
                rows={3}
              />
            </div>
          </div>

          <div>
            <Label className="text-base font-medium">Select Social Media Accounts</Label>
            <p className="text-sm text-gray-600 mb-4">
              Choose which accounts should be part of this social set
            </p>
            
            {loadingAccounts ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin mr-2" />
                <span>Loading accounts...</span>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3 max-h-60 overflow-y-auto">
                {availableAccounts.map((account) => (
                  <Card 
                    key={account.id} 
                    className={`cursor-pointer transition-colors ${
                      formData.selectedAccounts.includes(account.id) 
                        ? 'ring-2 ring-red-500 bg-red-50' 
                        : 'hover:bg-gray-50'
                    } ${!account.is_active ? 'opacity-50' : ''}`}
                    onClick={() => account.is_active && handleAccountToggle(account.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3">
                        <Checkbox
                          checked={formData.selectedAccounts.includes(account.id)}
                          onChange={() => handleAccountToggle(account.id)}
                          disabled={!account.is_active}
                        />
                        
                        <div className={`p-2 rounded-lg ${getPlatformColor(account.platform)}`}>
                          {getPlatformIcon(account.platform)}
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <h4 className="font-medium">{account.username}</h4>
                            <Badge variant={account.is_active ? 'default' : 'secondary'}>
                              {account.is_active ? 'Connected' : 'Not Connected'}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600">@{account.username}</p>
                          {account.is_active && account.follower_count > 0 && (
                            <div className="flex items-center space-x-1 text-xs text-gray-500 mt-1">
                              <Users className="h-3 w-3" />
                              <span>{account.follower_count.toLocaleString()} followers</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
            
            {availableAccounts.length === 0 && !loadingAccounts && (
              <div className="text-center py-8 text-gray-500">
                <p>No social media accounts found.</p>
                <p className="text-sm">Connect your accounts first in the Integrations page.</p>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-red-500 hover:bg-red-600"
              disabled={loading || loadingAccounts}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isEditing ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                isEditing ? 'Update Social Set' : 'Create Social Set'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateSocialSetDialog;
