import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { 
  Crown, 
  Star, 
  Zap, 
  BarChart3, 
  DollarSign,
  Database,
  Edit3,
  Eye
} from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

interface SubscriptionTier {
  id: string;
  name: string;
  display_name: string;
  description: string;
  price_monthly: number;
  price_yearly: number;
  max_social_accounts: number;
  max_scheduled_posts: number;
  max_team_members: number;
  analytics_retention_days: number;
  api_rate_limit: number;
  gohighlevel_integration: boolean;
  advanced_analytics: boolean;
  priority_support: boolean;
  white_label: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface EditPlanDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  planId?: string;
  plan?: SubscriptionTier;
  onSuccess?: () => void;
}

const EditPlanDialog: React.FC<EditPlanDialogProps> = ({ 
  open, 
  onOpenChange, 
  plan: initialPlan, 
  onSuccess 
}) => {
  const [formData, setFormData] = useState<Partial<SubscriptionTier>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [mode, setMode] = useState<'edit' | 'view'>('edit');

  // Use the plan prop if provided, otherwise you could fetch by planId
  const plan = initialPlan;

  useEffect(() => {
    if (plan) {
      setFormData({
        name: plan.name,
        display_name: plan.display_name,
        description: plan.description,
        price_monthly: plan.price_monthly,
        price_yearly: plan.price_yearly,
        max_social_accounts: plan.max_social_accounts,
        max_scheduled_posts: plan.max_scheduled_posts,
        max_team_members: plan.max_team_members,
        analytics_retention_days: plan.analytics_retention_days,
        api_rate_limit: plan.api_rate_limit,
        gohighlevel_integration: plan.gohighlevel_integration,
        advanced_analytics: plan.advanced_analytics,
        priority_support: plan.priority_support,
        white_label: plan.white_label,
        is_active: plan.is_active,
      });
    }
  }, [plan]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name) newErrors.name = 'Plan name is required';
    if (!formData.display_name) newErrors.display_name = 'Display name is required';
    if (!formData.description) newErrors.description = 'Description is required';
    if (!formData.price_monthly) newErrors.price_monthly = 'Monthly price is required';
    if (!formData.max_social_accounts) newErrors.max_social_accounts = 'Social accounts limit is required';
    if (!formData.max_scheduled_posts) newErrors.max_scheduled_posts = 'Scheduled posts limit is required';
    if (!formData.max_team_members) newErrors.max_team_members = 'Team members limit is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || !plan) return;

    setIsSubmitting(true);
    try {
      // This would be an API call to update the plan
      // await updatePlan(plan.id, formData);
      
      toast({
        title: 'Plan Updated',
        description: `${formData.display_name} plan has been updated successfully.`,
      });

      onSuccess?.();
      onOpenChange(false);
    } catch (err) {
      console.error('Error updating plan:', err);
      toast({
        title: 'Error',
        description: 'Failed to update plan. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleStatus = async () => {
    if (!plan) return;

    try {
      // await togglePlanStatus(plan.id, !formData.is_active);
      setFormData({ ...formData, is_active: !formData.is_active });
      
      toast({
        title: `Plan ${formData.is_active ? 'Deactivated' : 'Activated'}`,
        description: `${formData.display_name} plan has been ${formData.is_active ? 'deactivated' : 'activated'}.`,
      });
    } catch (err) {
      console.error('Error toggling plan status:', err);
      toast({
        title: 'Error',
        description: 'Failed to update plan status.',
        variant: 'destructive',
      });
    }
  };

  const getPlanIcon = (planName: string = '') => {
    const name = planName.toLowerCase();
    if (name.includes('enterprise')) return Crown;
    if (name.includes('professional') || name.includes('pro')) return BarChart3;
    if (name.includes('basic') || name.includes('starter')) return Zap;
    return Star;
  };

  const IconComponent = getPlanIcon(formData.name);

  if (!plan) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Plan Not Found</DialogTitle>
            <DialogDescription>
              The requested plan could not be loaded.
            </DialogDescription>
          </DialogHeader>
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <IconComponent className="w-5 h-5" />
            {mode === 'view' ? 'View' : 'Edit'} Subscription Plan
            <Badge variant={formData.is_active ? "default" : "secondary"}>
              {formData.is_active ? "Active" : "Inactive"}
            </Badge>
          </DialogTitle>
          <DialogDescription>
            {mode === 'view' 
              ? 'View plan details and subscription information'
              : 'Modify plan features, pricing, and availability'
            }
          </DialogDescription>
          <div className="flex gap-2 pt-2">
            <Button
              variant={mode === 'view' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setMode('view')}
            >
              <Eye className="w-4 h-4 mr-1" />
              View
            </Button>
            <Button
              variant={mode === 'edit' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setMode('edit')}
            >
              <Edit3 className="w-4 h-4 mr-1" />
              Edit
            </Button>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Plan Status */}
          <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/20">
            <div>
              <Label className="text-base font-medium">Plan Status</Label>
              <p className="text-sm text-muted-foreground">
                {formData.is_active ? 'This plan is available for new subscriptions' : 'This plan is hidden from new subscriptions'}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                checked={formData.is_active}
                onCheckedChange={handleToggleStatus}
                disabled={mode === 'view'}
              />
              <Badge variant={formData.is_active ? "default" : "secondary"}>
                {formData.is_active ? "Active" : "Inactive"}
              </Badge>
            </div>
          </div>

          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Basic Information</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Plan Name (Internal)</Label>
                <Input
                  id="name"
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  disabled={mode === 'view'}
                  className={errors.name ? 'border-destructive' : ''}
                />
                {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
              </div>
              
              <div>
                <Label htmlFor="display_name">Display Name</Label>
                <Input
                  id="display_name"
                  value={formData.display_name || ''}
                  onChange={(e) => setFormData({ ...formData, display_name: e.target.value })}
                  disabled={mode === 'view'}
                  className={errors.display_name ? 'border-destructive' : ''}
                />
                {errors.display_name && <p className="text-sm text-destructive">{errors.display_name}</p>}
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                disabled={mode === 'view'}
                className={errors.description ? 'border-destructive' : ''}
                rows={3}
              />
              {errors.description && <p className="text-sm text-destructive">{errors.description}</p>}
            </div>
          </div>

          {/* Pricing */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              Pricing
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="price_monthly">Monthly Price ($)</Label>
                <Input
                  id="price_monthly"
                  type="number"
                  step="0.01"
                  value={formData.price_monthly || ''}
                  onChange={(e) => setFormData({ ...formData, price_monthly: Number(e.target.value) })}
                  disabled={mode === 'view'}
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
                  value={formData.price_yearly || ''}
                  onChange={(e) => setFormData({ ...formData, price_yearly: Number(e.target.value) })}
                  disabled={mode === 'view'}
                />
                {formData.price_monthly && formData.price_yearly && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Savings: {(((formData.price_monthly * 12) - formData.price_yearly) / (formData.price_monthly * 12) * 100).toFixed(0)}% annually
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Limits and Features */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Database className="w-4 h-4" />
              Limits & Quotas
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="max_social_accounts">Max Social Accounts</Label>
                <Input
                  id="max_social_accounts"
                  type="number"
                  value={formData.max_social_accounts || ''}
                  onChange={(e) => setFormData({ ...formData, max_social_accounts: Number(e.target.value) })}
                  disabled={mode === 'view'}
                  className={errors.max_social_accounts ? 'border-destructive' : ''}
                />
                {errors.max_social_accounts && <p className="text-sm text-destructive">{errors.max_social_accounts}</p>}
              </div>
              
              <div>
                <Label htmlFor="max_scheduled_posts">Max Scheduled Posts</Label>
                <Input
                  id="max_scheduled_posts"
                  type="number"
                  value={formData.max_scheduled_posts || ''}
                  onChange={(e) => setFormData({ ...formData, max_scheduled_posts: Number(e.target.value) })}
                  disabled={mode === 'view'}
                  className={errors.max_scheduled_posts ? 'border-destructive' : ''}
                />
                {errors.max_scheduled_posts && <p className="text-sm text-destructive">{errors.max_scheduled_posts}</p>}
              </div>
              
              <div>
                <Label htmlFor="max_team_members">Max Team Members</Label>
                <Input
                  id="max_team_members"
                  type="number"
                  value={formData.max_team_members || ''}
                  onChange={(e) => setFormData({ ...formData, max_team_members: Number(e.target.value) })}
                  disabled={mode === 'view'}
                  className={errors.max_team_members ? 'border-destructive' : ''}
                />
                {errors.max_team_members && <p className="text-sm text-destructive">{errors.max_team_members}</p>}
              </div>
              
              <div>
                <Label htmlFor="analytics_retention_days">Analytics Retention (Days)</Label>
                <Input
                  id="analytics_retention_days"
                  type="number"
                  value={formData.analytics_retention_days || ''}
                  onChange={(e) => setFormData({ ...formData, analytics_retention_days: Number(e.target.value) })}
                  disabled={mode === 'view'}
                />
              </div>
              
              <div className="col-span-2">
                <Label htmlFor="api_rate_limit">API Rate Limit (requests/hour)</Label>
                <Input
                  id="api_rate_limit"
                  type="number"
                  value={formData.api_rate_limit || ''}
                  onChange={(e) => setFormData({ ...formData, api_rate_limit: Number(e.target.value) })}
                  disabled={mode === 'view'}
                />
              </div>
            </div>
          </div>

          {/* Feature Toggles */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Premium Features</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="cursor-pointer">GoHighLevel Integration</Label>
                  <p className="text-sm text-muted-foreground">Allow CRM integration with GoHighLevel</p>
                </div>
                <Switch
                  checked={formData.gohighlevel_integration}
                  onCheckedChange={(checked) => setFormData({ ...formData, gohighlevel_integration: checked })}
                  disabled={mode === 'view'}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label className="cursor-pointer">Advanced Analytics</Label>
                  <p className="text-sm text-muted-foreground">Detailed insights and custom reports</p>
                </div>
                <Switch
                  checked={formData.advanced_analytics}
                  onCheckedChange={(checked) => setFormData({ ...formData, advanced_analytics: checked })}
                  disabled={mode === 'view'}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label className="cursor-pointer">Priority Support</Label>
                  <p className="text-sm text-muted-foreground">Faster response times and dedicated support</p>
                </div>
                <Switch
                  checked={formData.priority_support}
                  onCheckedChange={(checked) => setFormData({ ...formData, priority_support: checked })}
                  disabled={mode === 'view'}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label className="cursor-pointer">White Label</Label>
                  <p className="text-sm text-muted-foreground">Remove branding and customize appearance</p>
                </div>
                <Switch
                  checked={formData.white_label}
                  onCheckedChange={(checked) => setFormData({ ...formData, white_label: checked })}
                  disabled={mode === 'view'}
                />
              </div>
            </div>
          </div>

          {/* Plan Metadata */}
          {plan && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Plan Information</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <Label className="text-muted-foreground">Created</Label>
                  <p>{new Date(plan.created_at).toLocaleDateString()}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Last Updated</Label>
                  <p>{new Date(plan.updated_at).toLocaleDateString()}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Plan ID</Label>
                  <p className="font-mono text-xs">{plan.id}</p>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2 pt-4">
            {mode === 'edit' ? (
              <>
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="flex-1"
                >
                  {isSubmitting ? 'Updating...' : 'Update Plan'}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => onOpenChange(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </>
            ) : (
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
                className="flex-1"
              >
                Close
              </Button>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditPlanDialog;
