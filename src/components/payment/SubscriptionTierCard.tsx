import React from 'react';
import { Check, Crown, Zap, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { SubscriptionTier } from '@/services/payment';

interface SubscriptionTierCardProps {
  tier: SubscriptionTier;
  isCurrentTier?: boolean;
  isPopular?: boolean;
  billingPeriod: 'monthly' | 'yearly';
  onSelectTier: (tierId: string, billingPeriod: 'monthly' | 'yearly') => void;
  loading?: boolean;
}

const getTierIcon = (tierName: string) => {
  switch (tierName.toLowerCase()) {
    case 'free':
      return null;
    case 'basic':
      return <Zap className="h-5 w-5 text-blue-500" />;
    case 'professional':
      return <Crown className="h-5 w-5 text-purple-500" />;
    case 'enterprise':
      return <Building2 className="h-5 w-5 text-orange-500" />;
    default:
      return null;
  }
};

const getTierColor = (tierName: string) => {
  switch (tierName.toLowerCase()) {
    case 'free':
      return 'bg-gray-50 border-gray-200';
    case 'basic':
      return 'bg-blue-50 border-blue-200';
    case 'professional':
      return 'bg-purple-50 border-purple-200';
    case 'enterprise':
      return 'bg-orange-50 border-orange-200';
    default:
      return 'bg-gray-50 border-gray-200';
  }
};

export const SubscriptionTierCard: React.FC<SubscriptionTierCardProps> = ({
  tier,
  isCurrentTier,
  isPopular,
  billingPeriod,
  onSelectTier,
  loading,
}) => {
  const price = billingPeriod === 'monthly' ? tier.price_monthly : tier.price_yearly;
  const monthlyEquivalent = billingPeriod === 'yearly' ? (tier.price_yearly / 12).toFixed(2) : null;
  const yearlyDiscount = billingPeriod === 'yearly' && tier.price_yearly > 0 
    ? Math.round((1 - (tier.price_yearly / 12) / tier.price_monthly) * 100) 
    : 0;

  const features = [
    { label: `${tier.max_social_accounts} Social Accounts`, included: tier.max_social_accounts > 0 },
    { label: `${tier.max_scheduled_posts} Scheduled Posts/Month`, included: tier.max_scheduled_posts > 0 },
    { label: `${tier.max_team_members} Team Members`, included: tier.max_team_members > 0 },
    { label: `${tier.analytics_retention_days} Days Analytics History`, included: tier.analytics_retention_days > 0 },
    { label: 'GoHighLevel CRM Integration', included: tier.gohighlevel_integration },
    { label: 'Advanced Analytics', included: tier.advanced_analytics },
    { label: 'Priority Support', included: tier.priority_support },
    { label: 'White Label', included: tier.white_label },
  ];

  const includedFeatures = features.filter(f => f.included);

  return (
    <Card className={`relative ${getTierColor(tier.name)} ${isPopular ? 'ring-2 ring-blue-500' : ''}`}>
      {isPopular && (
        <Badge className="absolute -top-2 left-1/2 -translate-x-1/2 bg-blue-500 text-white">
          Most Popular
        </Badge>
      )}
      
      <CardHeader className="text-center pb-4">
        <div className="flex items-center justify-center gap-2 mb-2">
          {getTierIcon(tier.name)}
          <CardTitle className="text-xl">{tier.display_name}</CardTitle>
        </div>
        <CardDescription className="text-sm">{tier.description}</CardDescription>
        
        <div className="mt-4">
          <div className="flex items-baseline justify-center gap-1">
            <span className="text-3xl font-bold">${price}</span>
            <span className="text-gray-600">/{billingPeriod === 'monthly' ? 'month' : 'year'}</span>
          </div>
          {monthlyEquivalent && (
            <div className="text-sm text-gray-600 mt-1">
              ${monthlyEquivalent}/month billed annually
            </div>
          )}
          {yearlyDiscount > 0 && (
            <Badge variant="secondary" className="mt-2">
              Save {yearlyDiscount}%
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="px-6">
        <ul className="space-y-2">
          {includedFeatures.map((feature, index) => (
            <li key={index} className="flex items-start gap-2 text-sm">
              <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span>{feature.label}</span>
            </li>
          ))}
        </ul>
      </CardContent>

      <CardFooter className="px-6 pt-4">
        <Button
          className="w-full"
          variant={isCurrentTier ? "secondary" : "default"}
          disabled={loading || isCurrentTier}
          onClick={() => onSelectTier(tier.id, billingPeriod)}
        >
          {loading ? 'Processing...' : isCurrentTier ? 'Current Plan' : 'Choose Plan'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SubscriptionTierCard;
