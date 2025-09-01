import type React from "react"
import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, X, Calendar, AlertTriangle, Users, UserPlus } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { CircularProgress } from "@/components/ui/circular-progress"

// Define the full plan details outside the component
const planDetails = {
  basic: {
    name: "Basic Plan",
    description: "Suitable plan for starter business",
    monthly: 9.99,
    yearly: (9.99 * 12 * 0.8), // 20% off yearly
    features: [
      "5 Social Accounts",
      "100 Scheduled Posts/month",
      "Basic Analytics (90 days)",
      "2 Team Members",
    ],
  },
  professional: {
    name: "Professional Plan",
    description: "Best plan for growing businesses",
    monthly: 14.99,
    yearly: (14.99 * 12 * 0.8), // 20% off yearly
    features: [
      "15 Social Accounts",
      "Unlimited Scheduled Posts",
      "Advanced Analytics (1 year)",
      "10 Team Members",
      "GoHighLevel Integration",
      "API Access",
      "Priority Support",
    ],
  },
  enterprise: {
    name: "Enterprise Plan",
    description: "Comprehensive solution for large enterprises",
    monthly: 19.99,
    yearly: (19.99 * 12 * 0.8), // 20% off yearly
    features: [
      "Unlimited Social Accounts",
      "Unlimited Scheduled Posts",
      "Advanced Analytics (Unlimited)",
      "Unlimited Team Members",
      "GoHighLevel Integration",
      "API Access",
      "White Label",
      "Dedicated Support",
    ],
  },
};

interface BillingData {
  currentPlanName: keyof typeof planDetails;
  currentPlanPeriod: "monthly" | "yearly"; // Add this to track the active plan's period
  nextBilling: string;
  billingHistory: {
    id: string;
    date: string;
    amount: string;
    plan: string;
    status: string;
  }[];
}

const Billing: React.FC = () => {
  const [displayPeriod, setDisplayPeriod] = useState<"monthly" | "yearly">("monthly");
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [activeTab, setActiveTab] = useState<"billingHistory" | "usageAndLimits">("billingHistory");

  // Hardcoded initial billing data for now, could be fetched from an API
  const initialBillingInfo: BillingData = {
    currentPlanName: 'professional', // Use key directly
    currentPlanPeriod: 'monthly', // Assuming the active plan is monthly
    nextBilling: '25 Dec 2023',
    billingHistory: [
      { id: 'FLZ9810', date: '25 Dec 2023', amount: '$149.99', plan: 'Professional Plan', status: 'Success' },
      { id: 'FLZ9810', date: '05 Jul 2023', amount: '$149.99', plan: 'Professional Plan', status: 'Success' },
    ],
  };

  const currentPlanDetails = planDetails[initialBillingInfo.currentPlanName];

  const plans = [
    planDetails.basic,
    planDetails.professional,
    planDetails.enterprise,
  ];

  const formatPrice = (monthly: number, yearly: number) => {
    if (displayPeriod === "monthly") {
      return { price: monthly, period: "monthly" }
    }
    return { price: yearly, period: "yearly" }
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Billing</h2>
        <p className="text-gray-600">Pick a billing plan that suits you</p>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Current Subscription</h3>
            <p className="text-gray-600">You are currently on the {currentPlanDetails.name}</p>
            <p className="text-sm text-gray-500 mt-1">
              Billing period: {initialBillingInfo.currentPlanPeriod === "monthly" ? "Monthly" : "Yearly"}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-600">Next payment: {initialBillingInfo.nextBilling}</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between mb-6">
          {/* Billing Period Toggle */}
          <div className="flex items-center mb-4 sm:mb-0">
            <div className="bg-gray-100 rounded-lg p-1 flex">
              <button
                onClick={() => setDisplayPeriod("monthly")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${displayPeriod === "monthly" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"
                  }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setDisplayPeriod("yearly")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${displayPeriod === "yearly" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"
                  }`}
              >
                Yearly
              </button>
            </div>
            {displayPeriod === "yearly" && (
              <Badge className="ml-3 shadow-none bg-green-100 text-green-800 hover:bg-green-100">Save up to 20%</Badge>
            )}
          </div>

          {/* Cancel Subscription Button */}
          <Button
            variant="outline"
            onClick={() => setShowCancelDialog(true)}
            className="text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
          >
            <X className="w-4 h-4 mr-2" />
            Cancel Subscription
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plans.map((plan, planIndex) => {
          const isActivePlan = initialBillingInfo.currentPlanName === plan.name.toLowerCase().replace(' plan', '') && initialBillingInfo.currentPlanPeriod === displayPeriod;
          return (
            <div
              key={plan.name}
              className={`rounded-lg p-6 flex flex-col ${isActivePlan
                ? "bg-secondary text-white"
                : "bg-white border border-gray-200"
                }`}
            >
              <h3
                className={`text-lg font-semibold mb-2 ${isActivePlan ? "text-white" : "text-gray-900"
                  }`}
              >
                {plan.name}
              </h3>
              <p
                className={`text-sm mb-4 ${isActivePlan ? "text-secondary-foreground" : "text-gray-600"
                  }`}
              >
                {plan.description}
              </p>
              <div className="mb-6">
                <span
                  className={`text-3xl font-bold ${isActivePlan ? "text-white" : "text-gray-900"
                    }`}
                >
                  ${formatPrice(plan.monthly, plan.yearly).price.toFixed(2)}
                </span>
                <span
                  className={`ml-1 ${isActivePlan ? "text-secondary-foreground" : "text-gray-600"
                    }`}
                >
                  /{formatPrice(plan.monthly, plan.yearly).period}
                </span>
                {displayPeriod === "yearly" && (
                  <div
                    className={`text-sm mt-1 ${isActivePlan ? "text-secondary-foreground" : "text-gray-500"
                      }`}
                  >
                    ${(plan.yearly / 12).toFixed(2)}/month billed annually
                  </div>
                )}
              </div>
              <div className="flex-grow"> {/* This div will push the button to the bottom */}
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, index) => (
                    <li
                      key={index}
                      className={`flex items-center text-sm ${isActivePlan ? "text-secondary-foreground" : "text-gray-600"
                        }`}
                    >
                      <Check
                        className={`w-4 h-4 mr-3 ${isActivePlan ? "text-white" : "text-green-500"
                          }`}
                      />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-auto"> {/* This div ensures the button is at the bottom */}
                {isActivePlan ? (
                  <Button className="w-full bg-white text-secondary hover:bg-gray-100">Active plan</Button>
                ) : (
                  <Button variant="outline" className="w-full bg-transparent">
                    Choose Plan
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {showCancelDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center mb-4">
              <AlertTriangle className="w-6 h-6 text-red-500 mr-3" />
              <h3 className="text-lg font-semibold text-gray-900">Cancel Subscription</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to cancel your subscription? You'll lose access to all premium features at the end
              of your current billing period.
            </p>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setShowCancelDialog(false)} className="flex-1">
                Keep Subscription
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  // Handle cancellation logic here
                  setShowCancelDialog(false)
                }}
                className="flex-1"
              >
                Cancel Subscription
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Tabs for Billing History and Usage & Limits */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          onClick={() => setActiveTab("billingHistory")}
          className={`py-3 px-6 text-sm font-medium ${activeTab === "billingHistory"
            ? "border-b-2 border-primary text-primary"
            : "text-gray-600 hover:text-gray-900"
            }`}
        >
          Billing History
        </button>
        <button
          onClick={() => setActiveTab("usageAndLimits")}
          className={`py-3 px-6 text-sm font-medium ${activeTab === "usageAndLimits"
            ? "border-b-2 border-primary text-primary"
            : "text-gray-600 hover:text-gray-900"
            }`}
        >
          Usage & Limits
        </button>
      </div>

      {activeTab === "billingHistory" && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-600">No.</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Invoice</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Created Date</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Amount</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Plan</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Status</th>
                </tr>
              </thead>
              <tbody>
                {initialBillingInfo.billingHistory.map((item, index) => (
                  <tr key={item.id} className="border-b border-gray-100">
                    <td className="py-4 px-4">0{index + 1}</td>
                    <td className="py-4 px-4 font-medium">Invoice#{item.id}</td>
                    <td className="py-4 px-4">{item.date}</td>
                    <td className="py-4 px-4">{item.amount}</td>
                    <td className="py-4 px-4">{item.plan}</td>
                    <td className="py-4 px-4">
                      <Badge className="bg-secondary/10 text-secondary hover:bg-secondary/20">{item.status}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "usageAndLimits" && (
        <Card className="border-0 shadow-none">
          <CardContent className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
              <div className="text-center">
                <div className="flex items-center justify-start mb-4">
                  <Users className="w-5 h-5 mr-2" />
                  <h3 className="font-headers font-medium text-foreground">
                    Social Accounts
                  </h3>
                </div>
                <div className="flex flex-col items-center">
                  <CircularProgress
                    value={3}
                    max={15}
                    size={120}
                    strokeWidth={8}
                  />
                  <p className="font-body text-sm text-muted-foreground mt-4">
                    12 accounts remaining
                  </p>
                </div>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-start mb-4">
                  <Calendar className="w-5 h-5 mr-2" />
                  <h3 className="font-headers font-medium text-foreground">
                    Scheduled Posts This Month
                  </h3>
                </div>
                <div className="flex flex-col items-center">
                  <CircularProgress
                    value={45}
                    max={100}
                    size={120}
                    strokeWidth={8}
                    isUnlimited={true}
                  />
                  <p className="font-body text-sm text-muted-foreground mt-4">
                    Unlimited posts available
                  </p>
                </div>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-start mb-4">
                  <UserPlus className="w-5 h-5 mr-2" />
                  <h3 className="font-headers font-medium text-foreground">
                    Team Members
                  </h3>
                </div>
                <div className="flex flex-col items-center">
                  <CircularProgress
                    value={2}
                    max={10}
                    size={120}
                    strokeWidth={8}
                  />
                  <p className="font-body text-sm text-muted-foreground mt-4">
                    8 seats available
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default Billing
