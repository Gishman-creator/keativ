import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, CreditCard, Calendar, DollarSign, AlertCircle } from 'lucide-react';
import { useUserSubscription, usePaymentHistory, useFeatureAccess, useCancelSubscription } from '@/hooks/usePayment';
import { format } from 'date-fns';

const BillingDashboard: React.FC = () => {
  const { data: subscription, isLoading: subscriptionLoading } = useUserSubscription();
  const { data: paymentHistory, isLoading: historyLoading } = usePaymentHistory();
  const { isSubscribed, isOnTrial } = useFeatureAccess();
  const cancelSubscription = useCancelSubscription();
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  const handleCancelSubscription = async () => {
    try {
      await cancelSubscription.mutateAsync();
      setShowCancelConfirm(false);
    } catch (error) {
      console.error('Failed to cancel subscription:', error);
    }
  };

  if (subscriptionLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'active':
        return 'success' as const;
      case 'trialing':
        return 'secondary' as const;
      case 'canceled':
      case 'unpaid':
        return 'destructive' as const;
      case 'past_due':
        return 'warning' as const;
      default:
        return 'secondary' as const;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Billing & Subscription</h1>
        <p className="text-gray-600 mt-2">Manage your subscription and billing information</p>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="history">Payment History</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Current Subscription */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Current Subscription
              </CardTitle>
              <CardDescription>
                Your current plan and billing information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {subscription ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-lg">{subscription.tier.display_name}</h3>
                      <p className="text-gray-600">{subscription.tier.description}</p>
                    </div>
                    <Badge variant={getStatusBadgeVariant(subscription.status)}>
                      {subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-green-500" />
                      <div>
                        <p className="text-sm text-gray-600">Price</p>
                        <p className="font-semibold">
                          ${subscription.billing_period === 'monthly' 
                            ? subscription.tier.price_monthly 
                            : subscription.tier.price_yearly
                          }/{subscription.billing_period === 'monthly' ? 'month' : 'year'}
                        </p>
                      </div>
                    </div>

                    {subscription.next_payment_date && (
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-blue-500" />
                        <div>
                          <p className="text-sm text-gray-600">Next Payment</p>
                          <p className="font-semibold">
                            {format(new Date(subscription.next_payment_date), 'MMM dd, yyyy')}
                          </p>
                        </div>
                      </div>
                    )}

                    {subscription.trial_end_date && isOnTrial && (
                      <div className="flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 text-orange-500" />
                        <div>
                          <p className="text-sm text-gray-600">Trial Ends</p>
                          <p className="font-semibold">
                            {format(new Date(subscription.trial_end_date), 'MMM dd, yyyy')}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Plan Features */}
                  <div className="border-t pt-4">
                    <h4 className="font-semibold mb-3">Plan Features</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Social Accounts</p>
                        <p className="font-semibold">{subscription.tier.max_social_accounts}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Monthly Posts</p>
                        <p className="font-semibold">{subscription.tier.max_scheduled_posts}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Team Members</p>
                        <p className="font-semibold">{subscription.tier.max_team_members}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Analytics History</p>
                        <p className="font-semibold">{subscription.tier.analytics_retention_days} days</p>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="border-t pt-4 space-y-3">
                    <div className="flex gap-3">
                      <Button variant="outline" className="flex-1">
                        Change Plan
                      </Button>
                      <Button variant="outline" className="flex-1">
                        Update Payment Method
                      </Button>
                    </div>
                    
                    {isSubscribed && !showCancelConfirm && (
                      <Button 
                        variant="destructive" 
                        className="w-full"
                        onClick={() => setShowCancelConfirm(true)}
                      >
                        Cancel Subscription
                      </Button>
                    )}

                    {showCancelConfirm && (
                      <Alert>
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                          Are you sure you want to cancel your subscription? You'll lose access to premium features at the end of your billing period.
                        </AlertDescription>
                        <div className="flex gap-2 mt-3">
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={handleCancelSubscription}
                            disabled={cancelSubscription.isPending}
                          >
                            {cancelSubscription.isPending ? (
                              <>
                                <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                                Canceling...
                              </>
                            ) : (
                              'Yes, Cancel'
                            )}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setShowCancelConfirm(false)}
                          >
                            Keep Subscription
                          </Button>
                        </div>
                      </Alert>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-600 mb-4">You don't have an active subscription</p>
                  <Button>Choose a Plan</Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Payment History</CardTitle>
              <CardDescription>
                Your payment and billing history
              </CardDescription>
            </CardHeader>
            <CardContent>
              {historyLoading ? (
                <div className="flex items-center justify-center h-32">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              ) : paymentHistory && paymentHistory.length > 0 ? (
                <div className="space-y-4">
                  {paymentHistory.map((payment) => (
                    <div key={payment.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-semibold">
                          ${payment.amount} {payment.currency.toUpperCase()}
                        </p>
                        <p className="text-sm text-gray-600">
                          {format(new Date(payment.payment_date), 'MMM dd, yyyy')}
                        </p>
                      </div>
                      <Badge variant={getStatusBadgeVariant(payment.status)}>
                        {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-600">No payment history available</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BillingDashboard;
