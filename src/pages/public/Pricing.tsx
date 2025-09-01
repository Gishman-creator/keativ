import { Link } from 'react-router-dom';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, ArrowRight, X } from 'lucide-react';
import { planDetails } from '@/config/billingPlans';

const Pricing = () => {
  const [displayPeriod, setDisplayPeriod] = useState<"monthly" | "yearly">("monthly");

  const plans = [
    planDetails.basic,
    planDetails.professional,
    planDetails.enterprise,
  ];

  const formatPrice = (monthly: number, yearly: number) => {
    if (displayPeriod === "monthly") {
      return { price: monthly, period: "month" }
    }
    return { price: yearly, period: "year" }
  }

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
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Choose the plan that fits your needs. Start free and scale as you grow.
            No hidden fees, no commitments.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Billing Period Toggle */}
          <div className="relative flex justify-center mb-16 w-fit sm:mx-auto">
            <div className="p-1 flex">
              <button
                onClick={() => setDisplayPeriod("monthly")}
                className={`px-4 py-2 text-sm font-medium transition-colors ${displayPeriod === "monthly" ? "text-primary border-b-2 border-primary" : "text-gray-600 hover:text-gray-900"
                  }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setDisplayPeriod("yearly")}
                className={`px-4 py-2 text-sm font-medium transition-colors ${displayPeriod === "yearly" ? "text-primary border-b-2 border-primary" : "text-gray-600 hover:text-gray-900"
                  }`}
              >
                Yearly
              </button>
            </div>
            <div className={` absolute left-full ml-4 top-1/2 -translate-y-1/2 transform ${displayPeriod === "yearly" ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
              <Badge className="shadow-none bg-green-100 text-green-800 hover:bg-green-100 whitespace-nowrap">Save up to 20%</Badge>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8">
            {plans.map((plan, index) => (
              <div key={index} className={`relative border md:border-0 transition-shadow rounded-lg bg-white p-6 flex flex-col ${plan.popular ? 'ring-2 ring-red-500 shadow-lg' : ''
                }`}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-red-500 text-white px-4 py-1">
                      Most Popular
                    </Badge>
                  </div>
                )}

                <div className="text-center pb-8">
                  <h3 className="text-2xl font-bold">{plan.name}</h3>
                  <p className="text-gray-600 mt-2">
                    {plan.description}
                  </p>
                  <div className="mt-6">
                    <span className="text-4xl font-bold text-gray-900">${formatPrice(plan.monthly, plan.yearly).price.toFixed(2)}</span>
                    <span className="text-gray-500 ml-1">/{formatPrice(plan.monthly, plan.yearly).period}</span>
                    {displayPeriod === "yearly" && (
                      <div className="text-sm mt-1 text-gray-500">
                        ${(plan.yearly / 12).toFixed(2)}/month billed annually
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col justify-between h-full">
                  <div className="space-y-3">
                    {plan.features.map((feature, i) => (
                      <div key={i} className="flex items-center space-x-3">
                        <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <Link to="/signup" className="block mt-auto pt-6">
                    <Button
                      className={`w-full ${plan.popular
                        ? 'bg-red-500 hover:bg-red-600 text-white'
                        : ''
                        }`}
                      variant={plan.popular ? 'default' : 'outline'}
                    >
                      {plan.buttonText}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
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

          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left font-medium text-gray-900 sticky left-0 bg-gray-50 z-10">Features</th>
                    <th className="px-6 py-4 text-center font-medium text-gray-900">Basic</th>
                    <th className="px-6 py-4 text-center font-medium text-gray-900">Professional</th>
                    <th className="px-6 py-4 text-center font-medium text-gray-900">Enterprise</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {[
                    { feature: 'Social Accounts', basic: '5', pro: '15', enterprise: 'Unlimited' },
                    { feature: 'Scheduled Posts', basic: '100/month', pro: 'Unlimited', enterprise: 'Unlimited' },
                    { feature: 'Analytics', basic: 'Basic (90 days)', pro: 'Advanced (1 year)', enterprise: 'Advanced (Unlimited)' },
                    { feature: 'Team Members', basic: '2', pro: '10', enterprise: 'Unlimited' },
                    { feature: 'GoHighLevel Integration', basic: <X className="h-5 w-5 text-gray-400 mx-auto" />, pro: <Check className="h-5 w-5 text-green-500 mx-auto" />, enterprise: <Check className="h-5 w-5 text-green-500 mx-auto" /> },
                    { feature: 'API Access', basic: <X className="h-5 w-5 text-gray-400 mx-auto" />, pro: <Check className="h-5 w-5 text-green-500 mx-auto" />, enterprise: <Check className="h-5 w-5 text-green-500 mx-auto" /> },
                    { feature: 'White Label', basic: <X className="h-5 w-5 text-gray-400 mx-auto" />, pro: <X className="h-5 w-5 text-gray-400 mx-auto" />, enterprise: <Check className="h-5 w-5 text-green-500 mx-auto" /> },
                    { feature: 'Support', basic: 'Email', pro: 'Priority', enterprise: 'Dedicated' }
                  ].map((row, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900 sticky left-0 bg-white z-10">{row.feature}</td>
                      <td className="px-6 py-4 text-sm text-center text-gray-700">{typeof row.basic === 'string' ? row.basic : row.basic}</td>
                      <td className="px-6 py-4 text-sm text-center text-gray-700">{typeof row.pro === 'string' ? row.pro : row.pro}</td>
                      <td className="px-6 py-4 text-sm text-center text-gray-700">{typeof row.enterprise === 'string' ? row.enterprise : row.enterprise}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
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
