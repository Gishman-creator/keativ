// Type definitions for dialog components

// Plan Management Types
export interface SubscriptionTier {
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

export interface CreatePlanDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export interface EditPlanDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  planId?: string;
  plan?: SubscriptionTier;
  onSuccess?: () => void;
}

// CRM Types
export interface CRMContact {
  id?: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  company?: string;
  status: 'lead' | 'prospect' | 'customer' | 'inactive';
  tags: string[];
  notes?: string;
  social_media_profiles?: {
    linkedin?: string;
    twitter?: string;
    facebook?: string;
    instagram?: string;
  };
  created_at?: string;
  updated_at?: string;
}

export interface CreateContactDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: (contact: CRMContact) => void;
}

// Messaging Types
export interface SendMessageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contacts?: CRMContact[];
  selectedContactId?: string;
  onSuccess?: () => void;
}

// GoHighLevel Integration Types
export interface GoHighLevelIntegration {
  id: string;
  api_key: string;
  location_id: string;
  webhook_url: string;
  sync_contacts: boolean;
  sync_opportunities: boolean;
  sync_calendars: boolean;
  auto_create_contacts: boolean;
  status: 'connected' | 'disconnected' | 'error';
  last_sync_date: string;
  created_at: string;
  updated_at: string;
}

// Analytics Types
export interface AnalyticsData {
  total_posts: number;
  total_engagement: number;
  reach: number;
  impressions: number;
  click_through_rate: number;
  engagement_rate: number;
  follower_growth: number;
  top_performing_posts: Array<{
    id: string;
    content: string;
    engagement: number;
    platform: string;
  }>;
}

// Billing Types
export interface PaymentHistory {
  id: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  payment_method: string;
  transaction_id: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface UserSubscription {
  id: string;
  user_id: string;
  tier_id: string;
  tier: SubscriptionTier;
  status: 'active' | 'cancelled' | 'expired' | 'past_due';
  current_period_start: string;
  current_period_end: string;
  cancel_at_period_end: boolean;
  billing_cycle: 'monthly' | 'yearly';
  next_billing_date: string;
  created_at: string;
  updated_at: string;
}

// Common Dialog Props
export interface BaseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  className?: string;
}

// Form Validation Types
export interface FormErrors {
  [key: string]: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: FormErrors;
}
