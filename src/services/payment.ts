import api from './api';

// Types for payment data
export interface SubscriptionTier {
  id: string;
  name: string;
  display_name: string;
  description: string;
  price_monthly: number;
  price_yearly: number;
  features: {
    max_social_accounts: number;
    max_scheduled_posts: number;
    max_team_members: number;
    analytics_retention_days: number;
    api_rate_limit: number;
    gohighlevel_integration: boolean;
    advanced_analytics: boolean;
    priority_support: boolean;
    white_label: boolean;
  };
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateSubscriptionTierRequest {
  name: 'free' | 'basic' | 'professional' | 'enterprise';
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
  is_active?: boolean;
}

export interface UserSubscription {
  id: string;
  user: string;
  tier: SubscriptionTier;
  status: 'active' | 'inactive' | 'past_due' | 'canceled' | 'unpaid' | 'trialing';
  billing_period: 'monthly' | 'yearly';
  start_date: string;
  end_date?: string;
  trial_end_date?: string;
  last_payment_date?: string;
  next_payment_date?: string;
  stripe_customer_id?: string;
  stripe_subscription_id?: string;
  is_active: boolean;
  is_trial: boolean;
  days_until_renewal?: number;
}

export interface PaymentHistory {
  id: string;
  user: string;
  subscription: string;
  amount: number;
  currency: string;
  status: 'succeeded' | 'failed' | 'pending' | 'refunded';
  payment_date: string;
  stripe_payment_intent_id?: string;
  stripe_invoice_id?: string;
}

export interface CreateSubscriptionRequest {
  tier_id: string;
  billing_period: 'monthly' | 'yearly';
  payment_method_id: string;
}

export interface UpdateSubscriptionRequest {
  tier_id?: string;
  billing_period?: 'monthly' | 'yearly';
}



export interface UpdateSubscriptionTierRequest {
  name?: 'free' | 'basic' | 'professional' | 'enterprise';
  description?: string;
  monthly_price?: number;
  yearly_price?: number;
  features?: string[];
  max_accounts?: number;
  max_posts_per_month?: number;
  is_active?: boolean;
  stripe_price_id_monthly?: string;
  stripe_price_id_yearly?: string;
}

// Payment API functions
export const paymentService = {
  // Get all available subscription tiers
  getSubscriptionTiers: async (): Promise<SubscriptionTier[]> => {
    const response = await api.get('/core/payment/tiers/');
    return response.data;
  },

  // Get user's current subscription
  getUserSubscription: async (): Promise<UserSubscription | null> => {
    const response = await api.get('/core/payment/subscription/');
    return response.data;
  },

  // Create new subscription
  createSubscription: async (data: CreateSubscriptionRequest): Promise<UserSubscription> => {
    const response = await api.post('/core/payment/subscription/', data);
    return response.data;
  },

  // Update existing subscription
  updateSubscription: async (data: UpdateSubscriptionRequest): Promise<UserSubscription> => {
    const response = await api.put('/core/payment/subscription/', data);
    return response.data;
  },

  // Cancel subscription
  cancelSubscription: async (): Promise<{ message: string }> => {
    const response = await api.delete('/core/payment/subscription/');
    return response.data;
  },

  // Get payment history
  getPaymentHistory: async (): Promise<PaymentHistory[]> => {
    const response = await api.get('/core/payment/history/');
    return response.data;
  },

  // Create Stripe customer
  createStripeCustomer: async (): Promise<{ customer_id: string }> => {
    const response = await api.post('/core/payment/customer/');
    return response.data;
  },

  // Create payment intent for one-time payments
  createPaymentIntent: async (amount: number, currency = 'usd'): Promise<{ client_secret: string }> => {
    const response = await api.post('/core/payment/intent/', { amount, currency });
    return response.data;
  },

  // Admin functions for managing subscription tiers
  createSubscriptionTier: async (data: CreateSubscriptionTierRequest): Promise<SubscriptionTier> => {
    const response = await api.post('/core/payment/admin/tiers/', data);
    return response.data;
  },

  updateSubscriptionTier: async (tierId: string, data: UpdateSubscriptionTierRequest): Promise<SubscriptionTier> => {
    const response = await api.put(`/core/payment/admin/tiers/${tierId}/`, data);
    return response.data;
  },

  deleteSubscriptionTier: async (tierId: string): Promise<{ message: string }> => {
    const response = await api.delete(`/core/payment/admin/tiers/${tierId}/`);
    return response.data;
  },
};

export default paymentService;
