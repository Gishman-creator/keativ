import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle, 
  BarChart3,
  Zap,
  Crown,
  ArrowRight,
  Star
} from 'lucide-react';

interface PlanFeature {
  name: string;
  included: boolean;
  limit?: string;
}

interface PlanData {
  id: string;
  name: string;
  display_name: string;
  description: string;
  price_monthly: number;
  price_yearly: number;
  features: PlanFeature[];
  popular?: boolean;
  enterprise?: boolean;
}

const plans: PlanData[] = [
  {
    id: 'free',
    name: 'free',
    display_name: 'Free',
    description: 'Perfect for individuals getting started with social media',
    price_monthly: 0,
    price_yearly: 0,
    features: [
      { name: 'Social Accounts', included: true, limit: '1 account' },
      { name: 'Scheduled Posts', included: true, limit: '10 posts/month' },
      { name: 'Basic Analytics', included: true, limit: '30 days' },
      { name: 'Team Members', included: false },
      { name: 'GoHighLevel Integration', included: false },
      { name: 'Advanced Analytics', included: false },
      { name: 'Priority Support', included: false },
    ]
  },
  {
    id: 'basic',
    name: 'basic',
    display_name: 'Basic',
    description: 'Great for small businesses and content creators',
    price_monthly: 29,
    price_yearly: 290,
    popular: true,
    features: [
      { name: 'Social Accounts', included: true, limit: '5 accounts' },
      { name: 'Scheduled Posts', included: true, limit: '100 posts/month' },
      { name: 'Basic Analytics', included: true, limit: '90 days' },
      { name: 'Team Members', included: true, limit: '2 members' },
      { name: 'GoHighLevel Integration', included: false },
      { name: 'Advanced Analytics', included: false },
      { name: 'Priority Support', included: false },
    ]
  },
  {
    id: 'professional',
    name: 'professional',
    display_name: 'Professional',
    description: 'Perfect for growing businesses and marketing teams',
    price_monthly: 79,
    price_yearly: 790,
    features: [
      { name: 'Social Accounts', included: true, limit: '15 accounts' },
      { name: 'Scheduled Posts', included: true, limit: 'Unlimited' },
      { name: 'Advanced Analytics', included: true, limit: '1 year' },
      { name: 'Team Members', included: true, limit: '10 members' },
      { name: 'GoHighLevel Integration', included: true },
      { name: 'API Access', included: true },
      { name: 'Priority Support', included: true },
    ]
  },
  {
    id: 'enterprise',
    name: 'enterprise',
    display_name: 'Enterprise',
    description: 'For large organizations with advanced needs',
    price_monthly: 199,
    price_yearly: 1990,
    enterprise: true,
    features: [
      { name: 'Social Accounts', included: true, limit: 'Unlimited' },
      { name: 'Scheduled Posts', included: true, limit: 'Unlimited' },
      { name: 'Advanced Analytics', included: true, limit: 'Unlimited' },
      { name: 'Team Members', included: true, limit: 'Unlimited' },
      { name: 'GoHighLevel Integration', included: true },
      { name: 'API Access', included: true },
      { name: 'White Label', included: true },
      { name: 'Dedicated Support', included: true },
    ]
  }
];

const PlanSelection: React.FC = () => {
  const navigate = useNavigate();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const handleSelectPlan = async (planId: string) => {
    if (planId === 'free') {
      // Handle free plan signup
      navigate('/dashboard');
      return;
    }

    setIsLoading(true);
    setSelectedPlan(planId);
    
    try {
      // Redirect to billing page with selected plan
      navigate(`/dashboard/billing?plan=${planId}&cycle=${billingCycle}`);
    } catch (error) {
      console.error('Error selecting plan:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getIcon = (planName: string) => {
    switch (planName) {
      case 'free':
        return <Star className="w-6 h-6" />;
      case 'basic':
        return <Zap className="w-6 h-6" />;
      case 'professional':
        return <BarChart3 className="w-6 h-6" />;
      case 'enterprise':
        return <Crown className="w-6 h-6" />;
      default:
        return <Star className="w-6 h-6" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Choose Your Plan</h1>
          <p className="text-xl text-muted-foreground mb-8">
            Select the perfect plan for your social media management needs
          </p>
          
          {/* Billing Toggle */}
          <div className="inline-flex items-center bg-card border rounded-lg p-1">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                billingCycle === 'monthly'
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                billingCycle === 'yearly'
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Yearly
              <Badge variant="secondary" className="ml-2 text-xs">Save 20%</Badge>
            </button>
          </div>
        </div>

        {/* Plans Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {plans.map((plan) => (
            <Card
              key={plan.id}
              className={`relative transition-all duration-300 hover:shadow-lg ${
                plan.popular ? 'border-primary shadow-lg scale-105' : ''
              } ${
                plan.enterprise ? 'border-gradient-to-r from-purple-500 to-pink-500' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-primary text-primary-foreground">
                    Most Popular
                  </Badge>
                </div>
              )}
              
              <CardHeader className="text-center pb-4">
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full mb-4 ${
                  plan.enterprise ? 'bg-gradient-to-r from-purple-500 to-pink-500' :
                  plan.popular ? 'bg-primary' : 'bg-secondary'
                } text-white`}>
                  {getIcon(plan.name)}
                </div>
                <CardTitle className="text-2xl">{plan.display_name}</CardTitle>
                <CardDescription className="text-sm">
                  {plan.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="pt-0">
                {/* Pricing */}
                <div className="text-center mb-6">
                  <div className="text-4xl font-bold mb-2">
                    ${billingCycle === 'monthly' ? plan.price_monthly : Math.round(plan.price_yearly / 12)}
                    <span className="text-lg font-normal text-muted-foreground">/mo</span>
                  </div>
                  {billingCycle === 'yearly' && plan.price_yearly > 0 && (
                    <div className="text-sm text-muted-foreground">
                      ${plan.price_yearly} billed annually
                    </div>
                  )}
                </div>

                {/* Features */}
                <div className="space-y-3 mb-8">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-start">
                      {feature.included ? (
                        <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      ) : (
                        <div className="w-5 h-5 rounded-full border-2 border-muted mr-3 mt-0.5 flex-shrink-0" />
                      )}
                      <div className="text-sm">
                        <span className={feature.included ? 'text-foreground' : 'text-muted-foreground'}>
                          {feature.name}
                        </span>
                        {feature.limit && (
                          <span className="block text-xs text-muted-foreground">
                            {feature.limit}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* CTA Button */}
                <Button
                  onClick={() => handleSelectPlan(plan.id)}
                  disabled={isLoading && selectedPlan === plan.id}
                  className={`w-full ${
                    plan.popular ? 'bg-primary hover:bg-primary/90' :
                    plan.enterprise ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600' :
                    ''
                  }`}
                  variant={plan.name === 'free' ? 'outline' : 'default'}
                >
                  {isLoading && selectedPlan === plan.id ? (
                    'Processing...'
                  ) : plan.name === 'free' ? (
                    'Get Started Free'
                  ) : (
                    <>
                      Choose {plan.display_name}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Enterprise Contact */}
        <Card className="bg-gradient-to-r from-slate-900 to-slate-800 text-white">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold mb-4">Need a Custom Solution?</h3>
            <p className="text-slate-300 mb-6">
              Contact our sales team for enterprise pricing, custom integrations, and volume discounts.
            </p>
            <Button variant="outline" className="bg-white text-slate-900 hover:bg-slate-100">
              Contact Sales
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PlanSelection;
