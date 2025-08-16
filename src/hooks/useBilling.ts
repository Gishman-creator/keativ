import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/components/ui/use-toast';
import api from '@/services/api';

// Types
interface ApiError {
  response?: {
    status: number;
    data?: {
      detail?: string;
    };
  };
}
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
}

export interface UserSubscription {
  id: string;
  tier: SubscriptionTier;
  status: 'active' | 'inactive' | 'past_due' | 'canceled' | 'unpaid' | 'trialing';
  billing_period: 'monthly' | 'yearly';
  start_date: string;
  end_date: string;
  trial_end_date?: string;
  last_payment_date?: string;
  next_payment_date?: string;
  stripe_customer_id?: string;
  stripe_subscription_id?: string;
}

export interface PaymentHistory {
  id: string;
  amount: number;
  currency: string;
  status: 'pending' | 'succeeded' | 'failed' | 'refunded';
  payment_date: string;
  stripe_payment_intent_id: string;
  stripe_invoice_id?: string;
  description?: string;
}

// API Functions
const subscriptionApi = {
  getTiers: () => api.get('/api/core/subscriptions/tiers/'),
  getUserSubscription: () => api.get('/api/core/subscriptions/user/'),
  createSubscription: (data: { tier_id: string; billing_period: string }) =>
    api.post('/api/core/subscriptions/create/', data),
  updateSubscription: (data: { billing_period?: string }) =>
    api.put('/api/core/subscriptions/update/', data),
  cancelSubscription: () => api.post('/api/core/subscriptions/cancel/'),
  getPaymentHistory: () => api.get('/api/core/payments/history/'),
  createStripeCustomer: () => api.post('/api/core/stripe/customer/'),
};

// Custom Hooks

export const useSubscriptionTiers = () => {
  return useQuery({
    queryKey: ['subscription-tiers'],
    queryFn: async () => {
      const response = await subscriptionApi.getTiers();
      return response.data as SubscriptionTier[];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useUserSubscription = () => {
  return useQuery({
    queryKey: ['user-subscription'],
    queryFn: async () => {
      const response = await subscriptionApi.getUserSubscription();
      return response.data as UserSubscription;
    },
    retry: (failureCount: number, error: ApiError) => {
      // Don't retry if user has no subscription (404)
      if (error?.response?.status === 404) return false;
      return failureCount < 3;
    },
  });
};

export const usePaymentHistory = () => {
  return useQuery({
    queryKey: ['payment-history'],
    queryFn: async () => {
      const response = await subscriptionApi.getPaymentHistory();
      return response.data as PaymentHistory[];
    },
  });
};

export const useCreateSubscription = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: subscriptionApi.createSubscription,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-subscription'] });
      queryClient.invalidateQueries({ queryKey: ['payment-history'] });
      toast({
        title: 'Success!',
        description: 'Your subscription has been created successfully.',
      });
    },
    onError: (error: ApiError) => {
      toast({
        title: 'Subscription Failed',
        description: error?.response?.data?.detail || 'Failed to create subscription',
        variant: 'destructive',
      });
    },
  });
};

export const useUpdateSubscription = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: subscriptionApi.updateSubscription,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-subscription'] });
      toast({
        title: 'Subscription Updated',
        description: 'Your subscription has been updated successfully.',
      });
    },
    onError: (error: ApiError) => {
      toast({
        title: 'Update Failed',
        description: error?.response?.data?.detail || 'Failed to update subscription',
        variant: 'destructive',
      });
    },
  });
};

export const useCancelSubscription = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: subscriptionApi.cancelSubscription,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-subscription'] });
      toast({
        title: 'Subscription Canceled',
        description: 'Your subscription has been canceled. You will retain access until the end of your billing period.',
      });
    },
    onError: (error: ApiError) => {
      toast({
        title: 'Cancellation Failed',
        description: error?.response?.data?.detail || 'Failed to cancel subscription',
        variant: 'destructive',
      });
    },
  });
};

export const useCreateStripeCustomer = () => {
  return useMutation({
    mutationFn: subscriptionApi.createStripeCustomer,
    onSuccess: () => {
      toast({
        title: 'Payment Setup',
        description: 'Your payment information has been set up successfully.',
      });
    },
    onError: (error: ApiError) => {
      toast({
        title: 'Setup Failed',
        description: error?.response?.data?.detail || 'Failed to set up payment information',
        variant: 'destructive',
      });
    },
  });
};

// Feature access hooks
export const useFeatureAccess = () => {
  const { data: subscription } = useUserSubscription();

  const isSubscribed = subscription?.status === 'active';
  const isOnTrial = subscription?.status === 'trialing';
  const hasAccess = isSubscribed || isOnTrial;

  const features = subscription?.tier?.features || {
    max_social_accounts: 1,
    max_scheduled_posts: 10,
    max_team_members: 1,
    analytics_retention_days: 30,
    api_rate_limit: 1000,
    gohighlevel_integration: false,
    advanced_analytics: false,
    priority_support: false,
    white_label: false,
  };

  return {
    isSubscribed,
    isOnTrial,
    hasAccess,
    features,
    subscription,
    canAccessFeature: (feature: keyof typeof features) => {
      return hasAccess && features[feature];
    },
    getRemainingDays: () => {
      if (!subscription?.end_date) return null;
      const endDate = new Date(subscription.end_date);
      const today = new Date();
      const diffTime = endDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return Math.max(0, diffDays);
    },
  };
};
