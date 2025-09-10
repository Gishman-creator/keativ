import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, ArrowRight, X } from 'lucide-react';
import { API_ENDPOINTS } from '@/config/constants';
import { api } from '@/lib/api'; // Import the api client
import { Separator } from '@/components/ui/separator';
import NetworkError from "@/pages/public/NetworkError" // Import NetworkError component
import { Link, useNavigate } from 'react-router-dom';

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

// Define the props for the Plans component
interface PlansProps {
  onPlanSelect: (planId: string) => void;
}

const Plans = ({ onPlanSelect }: PlansProps) => { // Accept onPlanSelect prop
  const [displayPeriod, setDisplayPeriod] = useState<"monthly" | "yearly">("monthly");
  const [tiers, setTiers] = useState<Tier[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasNetworkError, setHasNetworkError] = useState(false); // New state for network error
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSubscriptionTiers = async () => {
      try {
        // Assuming api.getSubscriptionTiers is the correct endpoint for fetching plans
        const response = await api.getSubscriptionTiers<SubscriptionTiersResponse>();
        if (response.success && response.data) {
          setTiers(response.data.tiers);
        } else {
          throw new Error(response.error || 'Failed to fetch subscription tiers');
        }
      } catch (e: any) {
        if (e.message === 'Network error' || (e.response && e.response.status === 503)) {
          setHasNetworkError(true);
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

  if (hasNetworkError) {
    return <NetworkError />;
  }

  if (error) {
    return <div className="text-center py-20 text-red-500">Error: {error}</div>;
  }

  const plans = tiers; // Use fetched tiers as plans

  return (
    <div className="bg-white">
      {/* Header Section */}
      <div className="bg-card rounded-2xl p-8 shadow-[var(--shadow-elegant)] mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-2">
          <div className="bg-red-50 flex justify-center mx-auto mb-2 w-fit rounded-md overflow-hidden">
            <img
              src="/logo-white.png"
              alt="Keative Logo"
              className="bg-primary w-12 h-12 p-2 object-cover"
            />
          </div>
          <h1 className="text-2xl text-center font-bold mb-2 text-foreground">
            Choose Your Plan
          </h1>
          <p className="text-sm text-center text-muted-foreground mb-8">
            Select the plan that best fits your needs to get started.
          </p>
          <div className="w-fit items-center bg-green-100 text-green-800 text-sm font-medium px-4 py-2 rounded-full mx-auto">
            <span>🎉 14-day free trial on all plans</span>
          </div>
        </div>
      </div>

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
            <div>
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
                      <p className="text-gray-600 text-sm mt-2">
                        {plan.description}
                      </p>
                      <div className="mt-6">
                        <span className="text-3xl font-bold text-gray-900">${plan.price_monthly.toFixed(2)}</span>
                        <span className="text-gray-500 text-sm ml-1">/month</span>
                      </div>
                    </div>

                    {/* Modified Button to call onPlanSelect */}
                    <Button
                      className={`w-full mt-2 ${plan.name === 'professional'
                        ? 'bg-red-500 hover:bg-red-600 text-white'
                        : ''
                        }`}
                      variant={plan.name === 'professional' ? 'default' : 'outline'}
                      onClick={() => {
                        onPlanSelect(plan.id); // Call the handler with plan ID
                      }}
                    >
                      Start Trial
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>

                    <Separator className="my-8" />

                    <div className="flex flex-col justify-between h-full">
                      <div className="space-y-3">
                        {Object.entries(plan.features).map(([key, value], i) => {
                          if (typeof value === 'boolean' && !value) return null;

                          let featureText = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
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

              <div className="text-center mt-6 mb-10">
                <p className="text-sm text-muted-foreground">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="text-primary hover:underline font-medium"
                  >
                    Log In
                  </Link>
                </p>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Plans;
