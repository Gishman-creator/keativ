import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, X, Calendar, AlertTriangle, Users, UserPlus } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { CircularProgress } from "@/components/ui/circular-progress"
import { api } from "@/lib/api"
import { SubscriptionTier } from "@/types"
import { SelectSeparator } from "@/components/ui/select"

interface UserSubscriptionTier {
  tier: string;
  display_name: string;
  status: string;
  billing_period: "monthly" | "yearly";
  start_date: string;
  end_date: string | null;
  trial_end_date: string | null;
  next_payment_date: string | null;
  is_active: boolean;
  is_trial: boolean;
  days_until_renewal: number | null;
}

// Function to format ISO date to "Month Day, Year"
const formatToWords = (isoDate: string | null) => {
  if (!isoDate) return "N/A"
  try {
    const date = new Date(isoDate)
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    }
    return date.toLocaleDateString("en-US", options)
  } catch (e) {
    console.error("Failed to parse date:", e)
    return "Invalid Date"
  }
}

const Billing: React.FC = () => {
  const [showCancelDialog, setShowCancelDialog] = useState(false)
  const [activeTab, setActiveTab] = useState<"billingHistory" | "usageAndLimits">("billingHistory")
  const [tiers, setTiers] = useState<SubscriptionTier[]>([])
  const [userSubscription, setUserSubscription] = useState<UserSubscriptionTier | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchBillingData = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const [tiersResponse, subscriptionResponse] = await Promise.all([
          api.getSubscriptionTiers<{ tiers: SubscriptionTier[] }>(),
          api.getUserSubscriptionTier<{ subscription: UserSubscriptionTier }>(),
        ])

        // Handle tiers response
        if (tiersResponse.success && tiersResponse.data && Array.isArray(tiersResponse.data.tiers)) {
          setTiers(tiersResponse.data.tiers)
        } else {
          setError(tiersResponse.error || "Failed to fetch subscription tiers.")
        }

        // Handle user subscription response
        if (subscriptionResponse.success && subscriptionResponse.data) {
          setUserSubscription(subscriptionResponse.data.subscription)
        } else {
          // If no subscription is found, it's not an error, just an empty state.
          console.warn("No active subscription found.")
          setUserSubscription(null)
        }
      } catch (e) {
        console.error("An error occurred:", e)
        setError("An unexpected error occurred while fetching billing data.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchBillingData()
  }, [])

  // Hardcoded billing history data
  const billingHistory = [
    { id: "FLZ9810", date: "25 Dec 2023", amount: "$149.99", plan: "Professional Plan", status: "Success" },
    { id: "FLZ9810", date: "05 Jul 2023", amount: "$149.99", plan: "Professional Plan", status: "Success" },
  ]

  const formatPrice = (monthly: number) => {
    return { price: monthly, period: "monthly" }
  }

  const currentPlanDetails = tiers.find(tier => tier.name === userSubscription?.tier)

  const nextBillingDateText = userSubscription?.is_trial && userSubscription.trial_end_date
    ? `Trial ends: ${formatToWords(userSubscription.trial_end_date)}`
    : userSubscription?.next_payment_date
      ? `Next payment: ${formatToWords(userSubscription.next_payment_date)}`
      : userSubscription?.end_date
        ? `Plan ends: ${formatToWords(userSubscription.end_date)}`
        : "N/A"

  const getButtonText = (planName: string) => {
    if (userSubscription?.tier === planName) {
      return "Active plan"
    } else if (userSubscription?.is_active) {
      return "Change plan"
    } else if (userSubscription?.end_date) {
      return "Renew plan"
    } else {
      return "Subscribe now"
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Billing</h2>
        <p className="text-gray-600">Pick a billing plan that suits you</p>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Current Subscription</h3>
            {isLoading ? (
              <div className="h-4 bg-gray-200 rounded w-48 animate-pulse"></div>
            ) : userSubscription?.is_trial ? (
              <p className="text-gray-600">
                You are currently on trial for the{" "}
                <span>{userSubscription.display_name}</span> Plan.
              </p>
            ) : (
              <p className="text-gray-600">
                You are currently on the{" "}
                <span>{userSubscription?.display_name || "Free"}</span> tier.
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-600">{nextBillingDateText}</span>
          </div>
          {userSubscription?.is_active && (
            <Button
              variant="outline"
              onClick={() => setShowCancelDialog(true)}
              className="text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300 w-fit"
            >
              <X className="w-4 h-4 mr-2" />
              Cancel Subscription
            </Button>
          )}
        </div>
      </div>

      {error && <div className="text-red-500 text-center">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          // Skeleton Loader
          Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="rounded-lg p-6 flex flex-col bg-white border border-gray-200 animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
              <div className="mb-6">
                <div className="h-10 bg-gray-200 rounded w-1/2"></div>
              </div>
              <div>
                <div className="h-10 bg-gray-200 rounded w-full"></div>
              </div>
              <SelectSeparator className="my-6 bg-gray-200" />
              <div className="flex-grow">
                <ul className="space-y-3 mt-6">
                  {Array.from({ length: 6 }).map((_, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-sm">
                      <Check className="w-4 h-4 mr-3 text-gray-300" />
                      <div className="h-4 bg-gray-200 rounded w-full"></div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))
        ) : (
          tiers.map((plan) => {
            const isActivePlan = userSubscription?.tier === plan.name
            const featuresList = [
              `${plan.features.max_social_accounts === -1 ? "Unlimited" : plan.features.max_social_accounts} Social Accounts`,
              `${plan.features.max_scheduled_posts === -1 ? "Unlimited" : plan.features.max_scheduled_posts} Scheduled Posts`,
              `${plan.features.max_team_members === -1 ? "Unlimited" : plan.features.max_team_members} Team Members`,
              `${plan.features.analytics_retention_days === -1 ? "Unlimited" : `${plan.features.analytics_retention_days}`} Analytics Retention Days`,
              `${plan.features.api_rate_limit} Api Rate Limit`,
              plan.features.gohighlevel_integration && "GoHighLevel Integration",
              plan.features.advanced_analytics && "Advanced Analytics",
              plan.features.priority_support && "Priority Support",
              plan.features.white_label && "White Label",
            ].filter(Boolean) as string[]

            return (
              <div
                key={plan.id}
                className={`rounded-lg p-6 flex flex-col ${isActivePlan ? "bg-secondary text-white" : "bg-white border border-gray-200"
                  }`}
              >
                <h3
                  className={`text-lg font-semibold mb-2 ${isActivePlan ? "text-white" : "text-gray-900"
                    }`}
                >
                  {plan.display_name}
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
                    ${formatPrice(plan.price_monthly).price.toFixed(2)}
                  </span>
                  <span
                    className={`ml-1 ${isActivePlan ? "text-secondary-foreground" : "text-gray-600"
                      }`}
                  >
                    /{formatPrice(plan.price_monthly).period}
                  </span>
                </div>
                <div className="mt-auto">
                  <Button
                    variant={isActivePlan ? "default" : "outline"}
                    disabled={getButtonText(plan.name) === "Active plan"}
                    className={`w-full ${isActivePlan ? "bg-white text-secondary hover:bg-gray-100" : "bg-transparent"
                      }`}
                  >
                    {getButtonText(plan.name)}
                  </Button>
                </div>
                <SelectSeparator className={`my-6 ${isActivePlan && "bg-[#9d72ff]"}`} />
                <div className="flex-grow">
                  <ul className="space-y-3 mb-6">
                    {featuresList.map((feature, index) => (
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
              </div>
            )
          })
        )}
      </div>

      {showCancelDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center mb-4">
              <AlertTriangle className="w-6 h-6 text-red-500 mr-3" />
              <h3 className="text-lg font-semibold text-gray-900">Cancel Subscription</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to cancel your subscription? You'll lose access to all premium features at the end of your current billing period.
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
                {billingHistory.map((item, index) => (
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