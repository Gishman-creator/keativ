import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, ArrowRight, X } from 'lucide-react';
import { api } from '@/lib/api'; // Import the api client
import { Separator } from '@/components/ui/separator';
import NetworkError from "@/pages/public/NetworkError" // Import NetworkError component

interface Feature {
  max_social_accounts: number;
  max_scheduled_posts: number;
  max_team_members: number;
  analytics_retention_days: number;
  api_rate_limit: number;
  gohighlevel_integration: boolean;
  advanced_analytics: boolean;
  priority_support: boolean;
  white_label: boolean;
}

interface Tier {
  id: string;
  name: string;
  display_name: string;
  description: string;
  price_monthly: number;
  price_yearly: number;
  features: Feature;
}

interface SubscriptionTiersResponse {
  success: boolean;
  tiers: Tier[];
}

const Pricing = () => {
  const [tiers, setTiers] = useState<Tier[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasNetworkError, setHasNetworkError] = useState(false); // New state for network error

  useEffect(() => {
    const fetchSubscriptionTiers = async () => {
      try {
        const response = await api.getSubscriptionTiers<SubscriptionTiersResponse>();
        if (response.success && response.data) {
          setTiers(response.data.tiers);
        } else {
          throw new Error(response.error || 'Failed to fetch subscription tiers');
        }
      } catch (e: any) {
        if (e.message === 'Network error' || (e.response && e.response.status === 503)) {
          setHasNetworkError(true); // Set network error state to true
        } else {
          setError(e.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptionTiers();
  }, []);

  const SkeletonCard = () => (
    <div className="relative border md:border-0 transition-shadow rounded-lg bg-white p-6 flex flex-col animate-pulse">
      <div className="text-center pb-8">
        <div className="h-6 bg-gray-200 rounded w-3/4 mx-auto mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-full mb-6"></div>
        <div className="h-10 bg-gray-200 rounded w-1/2 mx-auto"></div>
      </div>
      <div className="flex flex-col justify-between h-full">
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center space-x-3">
              <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
              <div className="h-4 w-2/3 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
        <div className="block mt-auto pt-14">
          <div className="h-10 bg-gray-200 rounded w-full mx-auto"></div>
        </div>
      </div>
    </div>
  );

  const SkeletonTable = () => (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden animate-pulse">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left font-medium text-gray-900 sticky left-0 bg-gray-50 z-10">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </th>
              <th className="px-6 py-4 text-center font-medium text-gray-900">
                <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
              </th>
              <th className="px-6 py-4 text-center font-medium text-gray-900">
                <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
              </th>
              <th className="px-6 py-4 text-center font-medium text-gray-900">
                <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {[...Array(8)].map((_, rowIndex) => (
              <tr key={rowIndex}>
                <td className="px-6 py-4 text-sm font-medium text-gray-900 sticky left-0 bg-white z-10">
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                </td>
                <td className="px-6 py-4 text-sm text-center text-gray-700">
                  <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
                </td>
                <td className="px-6 py-4 text-sm text-center text-gray-700">
                  <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
                </td>
                <td className="px-6 py-4 text-sm text-center text-gray-700">
                  <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  if (hasNetworkError) {
    return <NetworkError />;
  }

  if (error) {
    return <div className="text-center py-20 text-red-500">Error: {error}</div>;
  }

  const plans = tiers; // Use fetched tiers as plans

  const faqs = [
    {
      question: 'Can I change plans anytime?',
      answer: 'Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately and are prorated.'
    },
    {
      question: 'Is there a setup fee?',
      answer: 'No setup fees. You only pay the monthly subscription fee for your chosen plan.'
    },
    {
      question: 'Do you offer refunds?',
      answer: 'We offer a 30-day money-back guarantee on all paid plans. No questions asked.'
    },
    {
      question: 'Can I cancel anytime?',
      answer: 'Yes, you can cancel your subscription at any time. Your account will remain active until the end of your billing period.'
    }
  ];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-gray-50 to-white pt-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-heading text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Simple, Transparent
            <span className="text-red-500"> Pricing</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Choose the plan that fits your needs. Start free and scale as you grow.
            No hidden fees, no commitments.
          </p>
          <div className="inline-flex items-center bg-green-100 text-green-800 text-sm font-medium px-4 py-2 rounded-full mb-10">
            <span>🎉 14-day free trial on all plans</span>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8">
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8">
              {plans.map((plan, index) => (
                <div key={index} className={`relative border md:border-0 transition-shadow rounded-lg bg-white p-6 flex flex-col ${plan.name === 'professional' ? 'ring-2 ring-red-500 shadow-lg' : ''
                  }`}>
                  {plan.name === 'professional' && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-red-500 text-white px-4 py-1">
                        Most Popular
                      </Badge>
                    </div>
                  )}

                  <div className="pb-4">
                    <h3 className="text-2xl font-bold">{plan.display_name}</h3>
                    <p className="text-gray-600 mt-2">
                      {plan.description}
                    </p>
                    <div className="mt-6">
                      <span className="text-4xl font-bold text-gray-900">${plan.price_monthly.toFixed(2)}</span>
                      <span className="text-gray-500 ml-1">/month</span>
                    </div>
                  </div>

                  {/* Modified Button to call onPlanSelect */}
                  <Button
                    className={`w-full mt-2 ${plan.name === 'professional'
                      ? 'bg-red-500 hover:bg-red-600 text-white'
                      : ''
                      }`}
                    variant={plan.name === 'professional' ? 'default' : 'outline'}
                  >
                    Start Trial
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>

                  <Separator className="my-8" />

                  <div className="flex flex-col justify-between h-full">
                    <div className="space-y-3">
                      {Object.entries(plan.features).map(([key, value], i) => {
                        if (typeof value === 'boolean' && !value) return null;

                        const featureText = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                        let displayValue: React.ReactNode = '';

                        if (typeof value === 'boolean') {
                          if (value) {
                            displayValue = featureText;
                          } else {
                            return null;
                          }
                        } else if (value === -1) {
                          displayValue = `Unlimited ${featureText.replace('Max ', '')}`;
                        } else {
                          displayValue = `${value} ${featureText.replace('Max ', '')}`;
                        }

                        return (
                          <div key={i} className="flex items-center space-x-3">
                            <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                            <span className="text-sm text-gray-700">
                              {displayValue}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Features Comparison */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-heading text-3xl font-bold text-gray-900 mb-4">
              Compare Features
            </h2>
            <p className="text-xl text-gray-600">
              See what's included in each plan
            </p>
          </div>

          {loading ? (
            <SkeletonTable />
          ) : (
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left font-medium text-gray-900 sticky left-0 bg-gray-50 z-10">Features</th>
                      {plans.map((plan, index) => (
                        <th key={index} className="px-6 py-4 text-center font-medium text-gray-900">{plan.display_name}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {Object.keys(plans[0]?.features || {}).map((featureKey, index) => {
                      const featureName = featureKey.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                      return (
                        <tr key={index}>
                          <td className="px-6 py-4 text-sm font-medium text-gray-900 sticky left-0 bg-white z-10">
                            {featureName}
                          </td>
                          {plans.map((plan, planIndex) => {
                            const featureValue = plan.features[featureKey as keyof Feature];
                            let displayValue: React.ReactNode;

                            if (typeof featureValue === 'boolean') {
                              displayValue = featureValue ? <Check className="h-5 w-5 text-green-500 mx-auto" /> : <X className="h-5 w-5 text-gray-400 mx-auto" />;
                            } else if (featureValue === -1) {
                              displayValue = 'Unlimited';
                            } else {
                              displayValue = featureValue;
                            }

                            return (
                              <td key={planIndex} className="px-6 py-4 text-sm text-center text-gray-700">
                                {displayValue}
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-heading text-3xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-8">
            {faqs.map((faq, index) => (
              <div key={index} className="border-b border-gray-200 pb-8">
                <h3 className="font-heading text-lg font-semibold text-gray-900 mb-3">
                  {faq.question}
                </h3>
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Pricing;
