import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, X, Calendar, AlertTriangle } from "lucide-react"

interface BillingData {
  currentPlan: string
  price: string
  period: "monthly" | "yearly"
  nextBilling: string
  features: string[]
  billingHistory: {
    id: string
    date: string
    amount: string
    plan: string
    status: string
  }[]
}

const Billing: React.FC = () => {
  const [displayPeriod, setDisplayPeriod] = useState<"monthly" | "yearly">("monthly")
  const [showCancelDialog, setShowCancelDialog] = useState(false)

  // Hardcoded billing data for now, could be fetched from an API
  const billingData: BillingData = {
    currentPlan: 'Professional Plan',
    price: '$149.99',
    period: 'monthly', // This value is hardcoded
    nextBilling: '25 Dec 2023',
    features: [
      'Get Enterprise Plan',
      'Access All Feature',
      'Get 2TB Cloud Storage',
    ],
    billingHistory: [
      { id: 'FLZ9810', date: '25 Dec 2023', amount: '$149.99', plan: 'Professional Plan', status: 'Success' },
      { id: 'FLZ9810', date: '05 Jul 2023', amount: '$149.99', plan: 'Professional Plan', status: 'Success' },
    ],
  };

  const plans = {
    basic: {
      name: "Basic Plan",
      description: "Suitable plan for starter business",
      monthly: 19,
      yearly: 99.99,
      features: ["Customer Segmentations", "Google Integrations", "Activity Reminder"],
    },
    enterprise: {
      name: "Enterprise Plan",
      description: "Best plan for mid-sized businesses",
      monthly: 59,
      yearly: 590,
      features: ["Get a Basic Plans", "Access All Feature", "Get 1TB Cloud Storage"],
    },
    professional: {
      name: "Professional Plan",
      description: "Suitable plan for starter",
      monthly: 39,
      yearly: 390,
      features: billingData.features,
    },
  }

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
            <p className="text-gray-600">You are currently on the {billingData.currentPlan}</p>
            <p className="text-sm text-gray-500 mt-1">
              Billing period: {billingData.period === "monthly" ? "Monthly" : "Yearly"}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-600">Next payment: {billingData.nextBilling}</span>
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
              <Badge className="ml-3 bg-green-100 text-green-800 hover:bg-green-100">Save up to 58%</Badge>
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
        {/* Basic Plan */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{plans.basic.name}</h3>
          <p className="text-gray-600 text-sm mb-4">{plans.basic.description}</p>
          <div className="mb-6">
            <span className="text-3xl font-bold text-gray-900">
              ${formatPrice(plans.basic.monthly, plans.basic.yearly).price}
            </span>
            <span className="text-gray-600 ml-1">/{formatPrice(plans.basic.monthly, plans.basic.yearly).period}</span>
            {displayPeriod === "yearly" && (
              <div className="text-sm text-gray-500 mt-1">
                ${(plans.basic.yearly / 12).toFixed(2)}/month billed annually
              </div>
            )}
          </div>
          <ul className="space-y-3 mb-6">
            {plans.basic.features.map((feature, index) => (
              <li key={index} className="flex items-center text-sm text-gray-600">
                <Check className="w-4 h-4 mr-3 text-green-500" />
                {feature}
              </li>
            ))}
          </ul>
          <Button variant="outline" className="w-full bg-transparent">
            Choose Plan
          </Button>
        </div>

        {/* Enterprise Plan */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{plans.enterprise.name}</h3>
          <p className="text-gray-600 text-sm mb-4">{plans.enterprise.description}</p>
          <div className="mb-6">
            <span className="text-3xl font-bold text-gray-900">
              ${formatPrice(plans.enterprise.monthly, plans.enterprise.yearly).price}
            </span>
            <span className="text-gray-600 ml-1">
              /{formatPrice(plans.enterprise.monthly, plans.enterprise.yearly).period}
            </span>
            {displayPeriod === "yearly" && (
              <div className="text-sm text-gray-500 mt-1">
                ${(plans.enterprise.yearly / 12).toFixed(2)}/month billed annually
              </div>
            )}
          </div>
          <ul className="space-y-3 mb-6">
            {plans.enterprise.features.map((feature, index) => (
              <li key={index} className="flex items-center text-sm text-gray-600">
                <Check className="w-4 h-4 mr-3 text-green-500" />
                {feature}
              </li>
            ))}
          </ul>
          <Button variant="outline" className="w-full bg-transparent">
            Choose Plan
          </Button>
        </div>

        {/* Professional Plan */}
        <div
          className={`rounded-lg p-6 md:col-span-2 lg:col-span-1 ${billingData.currentPlan === "Professional Plan" && billingData.period === displayPeriod
            ? "bg-secondary text-white"
            : "bg-white border border-gray-200"
            }`}
        >
          <h3
            className={`text-lg font-semibold mb-2 ${billingData.currentPlan === "Professional Plan" && billingData.period === displayPeriod ? "text-white" : "text-gray-900"
              }`}
          >
            {plans.professional.name}
          </h3>
          <p
            className={`text-sm mb-4 ${billingData.currentPlan === "Professional Plan" && billingData.period === displayPeriod ? "text-secondary-foreground" : "text-gray-600"
              }`}
          >
            {plans.professional.description}
          </p>
          <div className="mb-6">
            <span
              className={`text-3xl font-bold ${billingData.currentPlan === "Professional Plan" && billingData.period === displayPeriod ? "text-white" : "text-gray-900"
                }`}
            >
              ${formatPrice(plans.professional.monthly, plans.professional.yearly).price}
            </span>
            <span
              className={`ml-1 ${billingData.currentPlan === "Professional Plan" && billingData.period === displayPeriod ? "text-secondary-foreground" : "text-gray-600"
                }`}
            >
              /{formatPrice(plans.professional.monthly, plans.professional.yearly).period}
            </span>
            {displayPeriod === "yearly" && (
              <div
                className={`text-sm mt-1 ${billingData.currentPlan === "Professional Plan" && billingData.period === displayPeriod ? "text-secondary-foreground" : "text-gray-500"
                  }`}
              >
                ${(plans.professional.yearly / 12).toFixed(2)}/month billed annually
              </div>
            )}
          </div>
          <ul className="space-y-3 mb-6">
            {billingData.features.map((feature, index) => (
              <li
                key={index}
                className={`flex items-center text-sm ${billingData.currentPlan === "Professional Plan" && billingData.period === displayPeriod ? "text-secondary-foreground" : "text-gray-600"
                  }`}
              >
                <Check
                  className={`w-4 h-4 mr-3 ${billingData.currentPlan === "Professional Plan" && billingData.period === displayPeriod ? "text-white" : "text-green-500"
                    }`}
                />
                {feature}
              </li>
            ))}
          </ul>
          {billingData.currentPlan === "Professional Plan" && billingData.period === displayPeriod ? (
            <Button className="w-full bg-white text-secondary hover:bg-gray-100">Active plan</Button>
          ) : (
            <Button variant="outline" className="w-full bg-transparent">
              Choose Plan
            </Button>
          )}
        </div>
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

      {/* Billing History */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Billing History</h3>

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
              {billingData.billingHistory.map((item, index) => (
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
    </div>
  )
}

export default Billing
