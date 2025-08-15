import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Crown, 
  Star, 
  Zap, 
  BarChart3, 
  Database
} from 'lucide-react';
import { toast } from 'sonner';
import { paymentService, type CreateSubscriptionTierRequest } from '@/services/payment';

interface CreatePlanDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

const CreatePlanDialog: React.FC<CreatePlanDialogProps> = ({ open, onOpenChange, onSuccess }) => {
  const [formData, setFormData] = useState<CreateSubscriptionTierRequest>({
    name: 'basic' as 'free' | 'basic' | 'professional' | 'enterprise',
    display_name: '',
    description: '',
    price_monthly: 0,
    price_yearly: 0,
    max_social_accounts: 1,
    max_scheduled_posts: 10,
    max_team_members: 1,
    analytics_retention_days: 30,
    api_rate_limit: 1000,
    gohighlevel_integration: false,
    advanced_analytics: false,
    priority_support: false,
    white_label: false,
    is_active: true,
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name) newErrors.name = 'Plan name is required';
    if (!formData.display_name) newErrors.display_name = 'Display name is required';
    if (!formData.description) newErrors.description = 'Description is required';
    if (formData.price_monthly < 0) newErrors.price_monthly = 'Monthly price must be 0 or greater';
    if (formData.price_yearly < 0) newErrors.price_yearly = 'Yearly price must be 0 or greater';
    if (formData.max_social_accounts < 1) newErrors.max_social_accounts = 'Max social accounts must be at least 1';
    if (formData.max_scheduled_posts < 1) newErrors.max_scheduled_posts = 'Max scheduled posts must be at least 1';
    if (formData.max_team_members < 1) newErrors.max_team_members = 'Max team members must be at least 1';
    if (formData.analytics_retention_days < 1) newErrors.analytics_retention_days = 'Analytics retention days must be at least 1';
    if (formData.api_rate_limit < 100) newErrors.api_rate_limit = 'API rate limit must be at least 100';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      // Call the API to create the subscription tier
      await paymentService.createSubscriptionTier(formData);
      
      toast('Plan Created', {
        description: `${formData.display_name} plan has been created successfully.`,
      });

      onSuccess?.();
      onOpenChange(false);
      
      // Reset form
      setFormData({
        name: 'basic',
        display_name: '',
        description: '',
        price_monthly: 0,
        price_yearly: 0,
        max_social_accounts: 1,
        max_scheduled_posts: 10,
        max_team_members: 1,
        analytics_retention_days: 30,
        api_rate_limit: 1000,
        gohighlevel_integration: false,
        advanced_analytics: false,
        priority_support: false,
        white_label: false,
        is_active: true,
      });
    } catch (err: unknown) {
      console.error('Error creating plan:', err);
      const errorMessage = err instanceof Error && 'response' in err 
        ? (err.response as { data?: { message?: string } })?.data?.message
        : 'Failed to create plan. Please try again.';
      
      toast('Error', {
        description: errorMessage || 'Failed to create plan. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getPlanIcon = (planName: string) => {
    const name = planName.toLowerCase();
    if (name.includes('enterprise')) return Crown;
    if (name.includes('professional') || name.includes('pro')) return BarChart3;
    if (name.includes('basic') || name.includes('starter')) return Zap;
    return Star;
  };

  const IconComponent = getPlanIcon(formData.name);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <IconComponent className="w-5 h-5" />
            Create New Plan
          </DialogTitle>
          <DialogDescription>
            Create a new subscription plan with custom pricing and features.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Basic Information</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Plan Name *</Label>
                <Select value={formData.name} onValueChange={(value) => setFormData({ ...formData, name: value as typeof formData.name })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select plan name" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="free">Free</SelectItem>
                    <SelectItem value="basic">Basic</SelectItem>
                    <SelectItem value="professional">Professional</SelectItem>
                    <SelectItem value="enterprise">Enterprise</SelectItem>
                  </SelectContent>
                </Select>
                {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
              </div>
              
              <div>
                <Label htmlFor="display_name">Display Name *</Label>
                <Input
                  id="display_name"
                  value={formData.display_name}
                  onChange={(e) => setFormData({ ...formData, display_name: e.target.value })}
                  placeholder="Basic Plan"
                  className={errors.display_name ? 'border-destructive' : ''}
                />
                {errors.display_name && <p className="text-sm text-destructive">{errors.display_name}</p>}
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe what this plan offers..."
                className={errors.description ? 'border-destructive' : ''}
                rows={3}
              />
              {errors.description && <p className="text-sm text-destructive">{errors.description}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="price_monthly">Monthly Price ($) *</Label>
                <Input
                  id="price_monthly"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price_monthly}
                  onChange={(e) => setFormData({ ...formData, price_monthly: Number(e.target.value) })}
                  placeholder="29.99"
                  className={errors.price_monthly ? 'border-destructive' : ''}
                />
                {errors.price_monthly && <p className="text-sm text-destructive">{errors.price_monthly}</p>}
              </div>
              
              <div>
                <Label htmlFor="price_yearly">Yearly Price ($)</Label>
                <Input
                  id="price_yearly"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price_yearly}
                  onChange={(e) => setFormData({ ...formData, price_yearly: Number(e.target.value) })}
                  placeholder="Auto-calculated with 20% discount if 0"
                  className={errors.price_yearly ? 'border-destructive' : ''}
                />
                {formData.price_yearly === 0 && formData.price_monthly > 0 && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Suggested: ${(formData.price_monthly * 12 * 0.8).toFixed(2)} (20% discount)
                  </p>
                )}
                {errors.price_yearly && <p className="text-sm text-destructive">{errors.price_yearly}</p>}
              </div>
            </div>
          </div>

          {/* Limits and Features */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Database className="w-4 h-4" />
              Limits & Quotas
            </h3>
            
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="max_social_accounts">Max Social Accounts</Label>
                <Input
                  id="max_social_accounts"
                  type="number"
                  min="1"
                  value={formData.max_social_accounts}
                  onChange={(e) => setFormData({ ...formData, max_social_accounts: Number(e.target.value) })}
                  placeholder="1"
                  className={errors.max_social_accounts ? 'border-destructive' : ''}
                />
                {errors.max_social_accounts && <p className="text-sm text-destructive">{errors.max_social_accounts}</p>}
              </div>
              
              <div>
                <Label htmlFor="max_scheduled_posts">Max Scheduled Posts</Label>
                <Input
                  id="max_scheduled_posts"
                  type="number"
                  min="1"
                  value={formData.max_scheduled_posts}
                  onChange={(e) => setFormData({ ...formData, max_scheduled_posts: Number(e.target.value) })}
                  placeholder="10"
                  className={errors.max_scheduled_posts ? 'border-destructive' : ''}
                />
                {errors.max_scheduled_posts && <p className="text-sm text-destructive">{errors.max_scheduled_posts}</p>}
              </div>
              
              <div>
                <Label htmlFor="max_team_members">Max Team Members</Label>
                <Input
                  id="max_team_members"
                  type="number"
                  min="1"
                  value={formData.max_team_members}
                  onChange={(e) => setFormData({ ...formData, max_team_members: Number(e.target.value) })}
                  placeholder="1"
                  className={errors.max_team_members ? 'border-destructive' : ''}
                />
                {errors.max_team_members && <p className="text-sm text-destructive">{errors.max_team_members}</p>}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="analytics_retention_days">Analytics Retention (Days)</Label>
                <Input
                  id="analytics_retention_days"
                  type="number"
                  min="1"
                  value={formData.analytics_retention_days}
                  onChange={(e) => setFormData({ ...formData, analytics_retention_days: Number(e.target.value) })}
                  placeholder="30"
                  className={errors.analytics_retention_days ? 'border-destructive' : ''}
                />
                {errors.analytics_retention_days && <p className="text-sm text-destructive">{errors.analytics_retention_days}</p>}
              </div>
              
              <div>
                <Label htmlFor="api_rate_limit">API Rate Limit (per hour)</Label>
                <Input
                  id="api_rate_limit"
                  type="number"
                  min="100"
                  value={formData.api_rate_limit}
                  onChange={(e) => setFormData({ ...formData, api_rate_limit: Number(e.target.value) })}
                  placeholder="1000"
                  className={errors.api_rate_limit ? 'border-destructive' : ''}
                />
                {errors.api_rate_limit && <p className="text-sm text-destructive">{errors.api_rate_limit}</p>}
              </div>
            </div>
          </div>

          {/* Premium Features */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Premium Features</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="gohighlevel_integration"
                  checked={formData.gohighlevel_integration}
                  onCheckedChange={(checked) => setFormData({ ...formData, gohighlevel_integration: checked })}
                />
                <Label htmlFor="gohighlevel_integration">GoHighLevel Integration</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="advanced_analytics"
                  checked={formData.advanced_analytics}
                  onCheckedChange={(checked) => setFormData({ ...formData, advanced_analytics: checked })}
                />
                <Label htmlFor="advanced_analytics">Advanced Analytics</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="priority_support"
                  checked={formData.priority_support}
                  onCheckedChange={(checked) => setFormData({ ...formData, priority_support: checked })}
                />
                <Label htmlFor="priority_support">Priority Support</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="white_label"
                  checked={formData.white_label}
                  onCheckedChange={(checked) => setFormData({ ...formData, white_label: checked })}
                />
                <Label htmlFor="white_label">White Label</Label>
              </div>
            </div>
          </div>

          {/* Status */}
          <div className="flex items-center space-x-2">
            <Switch
              id="is_active"
              checked={formData.is_active}
              onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
            />
            <Label htmlFor="is_active">Active Plan</Label>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Create Plan'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePlanDialog;
