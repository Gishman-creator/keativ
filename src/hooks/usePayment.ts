import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { paymentService, type SubscriptionTier, type CreateSubscriptionRequest, type UpdateSubscriptionRequest } from '../services/payment';

// Hook to get subscription tiers
export const useSubscriptionTiers = () => {
  return useQuery({
    queryKey: ['subscriptionTiers'],
    queryFn: paymentService.getSubscriptionTiers,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook to get user subscription
export const useUserSubscription = () => {
  return useQuery({
    queryKey: ['userSubscription'],
    queryFn: paymentService.getUserSubscription,
    staleTime: 60 * 1000, // 1 minute
  });
};

// Hook to get payment history
export const usePaymentHistory = () => {
  return useQuery({
    queryKey: ['paymentHistory'],
    queryFn: paymentService.getPaymentHistory,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Hook to create subscription
export const useCreateSubscription = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateSubscriptionRequest) => paymentService.createSubscription(data),
    onSuccess: () => {
      // Invalidate and refetch subscription data
      queryClient.invalidateQueries({ queryKey: ['userSubscription'] });
      queryClient.invalidateQueries({ queryKey: ['paymentHistory'] });
    },
  });
};

// Hook to update subscription
export const useUpdateSubscription = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateSubscriptionRequest) => paymentService.updateSubscription(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userSubscription'] });
    },
  });
};

// Hook to cancel subscription
export const useCancelSubscription = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => paymentService.cancelSubscription(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userSubscription'] });
    },
  });
};

// Hook to create Stripe customer
export const useCreateStripeCustomer = () => {
  return useMutation({
    mutationFn: () => paymentService.createStripeCustomer(),
  });
};

// Custom hook to check if user has access to a feature based on subscription
export const useFeatureAccess = () => {
  const { data: subscription } = useUserSubscription();

  const hasFeature = (feature: keyof SubscriptionTier): boolean => {
    if (!subscription?.tier) return false;
    
    const featureValue = subscription.tier[feature];
    if (typeof featureValue === 'boolean') {
      return featureValue;
    }
    if (typeof featureValue === 'number') {
      return featureValue > 0;
    }
    return Boolean(featureValue);
  };

  const getFeatureLimit = (feature: keyof SubscriptionTier): number => {
    if (!subscription?.tier) return 0;
    
    const featureValue = subscription.tier[feature];
    return typeof featureValue === 'number' ? featureValue : 0;
  };

  return {
    subscription,
    hasFeature,
    getFeatureLimit,
    isSubscribed: subscription?.status === 'active',
    isOnTrial: subscription?.is_trial || false,
    tierName: subscription?.tier?.name || 'free',
  };
};
