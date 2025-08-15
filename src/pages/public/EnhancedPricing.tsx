import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Check, ArrowRight } from 'lucide-react';
import { useSubscriptionTiers, useFeatureAccess } from '@/hooks/usePayment';
import { SubscriptionTierCard } from '@/components/payment/SubscriptionTierCard';

const EnhancedPricing: React.FC = () => {
  const navigate = useNavigate();
  const { data: tiers, isLoading } = useSubscriptionTiers();
  const { subscription } = useFeatureAccess();
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');

  const handleSelectTier = (tierId: string, period: 'monthly' | 'yearly') => {
    // Navigate to subscription setup with tier and billing period
    navigate(`/signup?tier=${tierId}&billing=${period}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const sortedTiers = tiers?.sort((a, b) => a.price_monthly - b.price_monthly) || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <section className="px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <Badge variant="secondary" className="mb-4">
            Pricing Plans
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Choose Your Perfect Plan
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            From individual creators to enterprise teams, we have a plan that scales with your social media ambitions.
            Start free, upgrade anytime.
          </p>

          {/* Billing Period Toggle */}
          <Tabs value={billingPeriod} onValueChange={(value) => setBillingPeriod(value as 'monthly' | 'yearly')} className="mb-12">
            <TabsList className="grid w-fit grid-cols-2 mx-auto">
              <TabsTrigger value="monthly">Monthly</TabsTrigger>
              <TabsTrigger value="yearly" className="relative">
                Yearly
                <Badge className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-0.5">
                  Save 20%
                </Badge>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="monthly" />
            <TabsContent value="yearly">
              <Alert className="max-w-md mx-auto mt-4">
                <AlertDescription className="text-center">
                  💰 Save up to 20% with yearly billing plans!
                </AlertDescription>
              </Alert>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Pricing Tiers */}
      <section className="px-4 pb-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {sortedTiers.map((tier, index) => (
              <SubscriptionTierCard
                key={tier.id}
                tier={tier}
                isCurrentTier={subscription?.tier?.id === tier.id}
                isPopular={index === 1} // Make the second tier (usually Professional) popular
                billingPeriod={billingPeriod}
                onSelectTier={handleSelectTier}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Feature Comparison */}
      <section className="px-4 py-20 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Compare All Features</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              See what's included in each plan and find the perfect fit for your needs
            </p>
          </div>

          {tiers && tiers.length > 0 && (
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="text-left p-4 font-semibold">Features</th>
                        {sortedTiers.map((tier) => (
                          <th key={tier.id} className="text-center p-4 font-semibold min-w-32">
                            {tier.display_name}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      <tr>
                        <td className="p-4 font-medium">Social Accounts</td>
                        {sortedTiers.map((tier) => (
                          <td key={tier.id} className="text-center p-4">
                            {tier.max_social_accounts === -1 ? 'Unlimited' : tier.max_social_accounts}
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <td className="p-4 font-medium">Scheduled Posts per Month</td>
                        {sortedTiers.map((tier) => (
                          <td key={tier.id} className="text-center p-4">
                            {tier.max_scheduled_posts === -1 ? 'Unlimited' : tier.max_scheduled_posts}
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <td className="p-4 font-medium">Team Members</td>
                        {sortedTiers.map((tier) => (
                          <td key={tier.id} className="text-center p-4">
                            {tier.max_team_members}
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <td className="p-4 font-medium">Analytics History</td>
                        {sortedTiers.map((tier) => (
                          <td key={tier.id} className="text-center p-4">
                            {tier.analytics_retention_days} days
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <td className="p-4 font-medium">GoHighLevel CRM Integration</td>
                        {sortedTiers.map((tier) => (
                          <td key={tier.id} className="text-center p-4">
                            {tier.gohighlevel_integration ? (
                              <Check className="h-5 w-5 text-green-500 mx-auto" />
                            ) : (
                              <span className="text-gray-400">—</span>
                            )}
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <td className="p-4 font-medium">Advanced Analytics</td>
                        {sortedTiers.map((tier) => (
                          <td key={tier.id} className="text-center p-4">
                            {tier.advanced_analytics ? (
                              <Check className="h-5 w-5 text-green-500 mx-auto" />
                            ) : (
                              <span className="text-gray-400">—</span>
                            )}
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <td className="p-4 font-medium">Priority Support</td>
                        {sortedTiers.map((tier) => (
                          <td key={tier.id} className="text-center p-4">
                            {tier.priority_support ? (
                              <Check className="h-5 w-5 text-green-500 mx-auto" />
                            ) : (
                              <span className="text-gray-400">—</span>
                            )}
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <td className="p-4 font-medium">White Label</td>
                        {sortedTiers.map((tier) => (
                          <td key={tier.id} className="text-center p-4">
                            {tier.white_label ? (
                              <Check className="h-5 w-5 text-green-500 mx-auto" />
                            ) : (
                              <span className="text-gray-400">—</span>
                            )}
                          </td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="px-4 py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-gray-600">
              Everything you need to know about our pricing and plans
            </p>
          </div>

          <div className="space-y-8">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2">Can I change my plan anytime?</h3>
                <p className="text-gray-600">
                  Yes! You can upgrade or downgrade your plan at any time. Changes will be prorated and reflected in your next billing cycle.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2">What's included in the free plan?</h3>
                <p className="text-gray-600">
                  Our free plan includes essential features to get you started: connect up to 3 social accounts, schedule posts, and access basic analytics.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2">Do you offer refunds?</h3>
                <p className="text-gray-600">
                  We offer a 30-day money-back guarantee for annual plans. Monthly subscribers can cancel anytime without penalty.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2">What is GoHighLevel CRM integration?</h3>
                <p className="text-gray-600">
                  GoHighLevel CRM integration allows you to sync your social media leads directly with your CRM, track customer interactions, and manage your sales pipeline all in one place.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-20 bg-blue-600 text-white text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of creators and businesses already growing their social media presence with SMMS
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild>
              <Link to="/signup">
                Start Free Trial
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="text-blue-600 border-white hover:bg-white" asChild>
              <Link to="/contact">
                Contact Sales
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default EnhancedPricing;
