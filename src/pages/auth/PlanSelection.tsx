import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Check, ArrowRight, Sparkles, Users, BarChart3, Shield } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import api from '@/services/api';

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
  gohighlevel_integration: boolean;
  advanced_analytics: boolean;
  priority_support: boolean;
  white_label: boolean;
  is_active: boolean;
}

interface PlanSelectionResponse {
  tiers: SubscriptionTier[];
  current_user: string;
  is_first_login: boolean;
}

const PlanSelection: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [tiers, setTiers] = useState<SubscriptionTier[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [selectedTier, setSelectedTier] = useState<string | null>(null);

  const fetchTiers = useCallback(async () => {
    try {
      const response = await api.get<PlanSelectionResponse>('/auth/setup/plan-selection/');
      setTiers(response.data.tiers);
      
      // Auto-select free tier
      const freeTier = response.data.tiers.find((tier: SubscriptionTier) => tier.name === 'free');
      if (freeTier) {
        setSelectedTier(freeTier.id);
      }
    } catch (error) {
      console.error('Error fetching tiers:', error);
      toast({
        title: "Error",
        description: "Failed to load subscription plans. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchTiers();
  }, [fetchTiers]);

  const handlePlanSelect = (tierId: string) => {
    setSelectedTier(tierId);
  };

  const handleSkip = async () => {
    setSubmitting(true);
    try {
      await api.post('/auth/setup/complete/', {
        tier_id: selectedTier,
        skip_upgrade: true
      });
      
      toast({
        title: "Setup Complete",
        description: "You're all set! Welcome to your Social Media Manager.",
      });
      
      navigate('/dashboard');
    } catch {
      toast({
        title: "Error",
        description: "Failed to complete setup. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpgrade = async () => {
    if (!selectedTier) return;
    
    setSubmitting(true);
    try {
      const response = await api.post('/auth/setup/complete/', {
        tier_id: selectedTier
      });
      
      if (response.data.payment_required) {
        // Redirect to payment processing
        window.location.href = response.data.payment_url;
      } else {
        toast({
          title: "Plan Updated",
          description: "Your plan has been updated successfully!",
        });
        navigate('/dashboard');
      }
    } catch {
      toast({
        title: "Error",
        description: "Failed to update plan. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const getPlanIcon = (tierName: string) => {
    switch (tierName.toLowerCase()) {
      case 'free':
        return <Sparkles className="h-6 w-6 text-blue-500" />;
      case 'pro':
        return <Users className="h-6 w-6 text-purple-500" />;
      case 'enterprise':
        return <BarChart3 className="h-6 w-6 text-green-500" />;
      default:
        return <Shield className="h-6 w-6 text-gray-500" />;
    }
  };

  const getPlanBadgeVariant = (tierName: string) => {
    switch (tierName.toLowerCase()) {
      case 'free':
        return 'secondary' as const;
      case 'pro':
        return 'default' as const;
      case 'enterprise':
        return 'destructive' as const;
      default:
        return 'outline' as const;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading subscription plans...</p>
        </div>
      </div>
    );
  }

  const selectedTierObj = tiers.find(tier => tier.id === selectedTier);
  const isFreePlan = selectedTierObj?.name === 'free';

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Choose Your Plan
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Welcome! We've set you up with a free account. You can upgrade anytime or continue with the free plan.
          </p>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {tiers.map((tier) => (
            <Card 
              key={tier.id} 
              className={`relative cursor-pointer transition-all duration-200 hover:shadow-lg ${
                selectedTier === tier.id 
                  ? 'ring-2 ring-blue-500 shadow-lg' 
                  : 'hover:shadow-md'
              }`}
              onClick={() => handlePlanSelect(tier.id)}
            >
              {selectedTier === tier.id && (
                <div className="absolute -top-3 -right-3 bg-blue-500 text-white rounded-full p-2">
                  <Check className="h-4 w-4" />
                </div>
              )}
              
              <CardHeader className="text-center pb-4">
                <div className="flex items-center justify-center mb-4">
                  {getPlanIcon(tier.name)}
                </div>
                <CardTitle className="text-2xl font-bold mb-2">
                  {tier.display_name}
                </CardTitle>
                <div className="mb-4">
                  <Badge variant={getPlanBadgeVariant(tier.name)}>
                    {tier.name.toUpperCase()}
                  </Badge>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  ${tier.price_monthly}
                  <span className="text-lg font-normal text-gray-500">/month</span>
                </div>
                <CardDescription className="text-gray-600">
                  {tier.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="pt-0">
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-sm">{tier.max_social_accounts} social accounts</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-sm">{tier.max_scheduled_posts} scheduled posts</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-sm">{tier.max_team_members} team members</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-sm">{tier.analytics_retention_days} days analytics</span>
                  </li>
                  {tier.gohighlevel_integration && (
                    <li className="flex items-center">
                      <Check className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
                      <span className="text-sm">GoHighLevel integration</span>
                    </li>
                  )}
                  {tier.advanced_analytics && (
                    <li className="flex items-center">
                      <Check className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
                      <span className="text-sm">Advanced analytics</span>
                    </li>
                  )}
                  {tier.priority_support && (
                    <li className="flex items-center">
                      <Check className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
                      <span className="text-sm">Priority support</span>
                    </li>
                  )}
                  {tier.white_label && (
                    <li className="flex items-center">
                      <Check className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
                      <span className="text-sm">White label solution</span>
                    </li>
                  )}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button
            variant="outline"
            size="lg"
            onClick={handleSkip}
            disabled={submitting}
            className="w-full sm:w-auto min-w-[200px]"
          >
            {submitting ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : null}
            Continue with Free Plan
          </Button>
          
          {!isFreePlan && (
            <Button
              size="lg"
              onClick={handleUpgrade}
              disabled={submitting || !selectedTier}
              className="w-full sm:w-auto min-w-[200px] bg-blue-600 hover:bg-blue-700"
            >
              {submitting ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <ArrowRight className="h-4 w-4 mr-2" />
              )}
              Upgrade to {selectedTierObj?.display_name}
            </Button>
          )}
        </div>

        {/* Help Text */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">
            You can change your plan anytime from your account settings.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PlanSelection;
