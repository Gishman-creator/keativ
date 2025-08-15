import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  CreditCard, 
  Download, 
  AlertCircle,
  CheckCircle2,
  Clock,
  XCircle,
  Settings,
  Receipt,
  TrendingUp
} from 'lucide-react';

interface Subscription {
  id: string;
  tier: {
    name: string;
    display_name: string;
    price_monthly: number;
    price_yearly: number;
  };
  status: 'active' | 'inactive' | 'past_due' | 'canceled' | 'unpaid' | 'trialing';
  billing_period: 'monthly' | 'yearly';
  current_period_start: string;
  current_period_end: string;
  trial_end_date?: string;
  next_payment_date?: string;
  stripe_customer_id?: string;
}

interface Payment {
  id: string;
  amount: number;
  currency: string;
  status: 'succeeded' | 'pending' | 'failed' | 'refunded';
  payment_date: string;
  stripe_invoice_id?: string;
  description?: string;
}

interface Invoice {
  id: string;
  invoice_number: string;
  amount: number;
  currency: string;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'canceled';
  due_date: string;
  created_at: string;
  pdf_url?: string;
}

const EnhancedBillingDashboard: React.FC = () => {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showChangeDialog, setShowChangeDialog] = useState(false);

  useEffect(() => {
    loadBillingData();
  }, []);

  const loadBillingData = async () => {
    setIsLoading(true);
    try {
      // Mock data - replace with actual API calls
      const mockSubscription: Subscription = {
        id: '1',
        tier: {
          name: 'professional',
          display_name: 'Professional',
          price_monthly: 79,
          price_yearly: 790,
        },
        status: 'active',
        billing_period: 'monthly',
        current_period_start: '2024-08-01T00:00:00Z',
        current_period_end: '2024-09-01T00:00:00Z',
        next_payment_date: '2024-09-01T00:00:00Z',
        stripe_customer_id: 'cus_123456789'
      };

      const mockPayments: Payment[] = [
        {
          id: '1',
          amount: 79.00,
          currency: 'USD',
          status: 'succeeded',
          payment_date: '2024-08-01T00:00:00Z',
          stripe_invoice_id: 'in_123456',
          description: 'Professional Plan - Monthly'
        },
        {
          id: '2',
          amount: 79.00,
          currency: 'USD',
          status: 'succeeded',
          payment_date: '2024-07-01T00:00:00Z',
          stripe_invoice_id: 'in_123455',
          description: 'Professional Plan - Monthly'
        }
      ];

      const mockInvoices: Invoice[] = [
        {
          id: '1',
          invoice_number: 'INV-2024-001',
          amount: 79.00,
          currency: 'USD',
          status: 'paid',
          due_date: '2024-08-01T00:00:00Z',
          created_at: '2024-07-25T00:00:00Z',
          pdf_url: '/api/invoices/1/pdf'
        },
        {
          id: '2',
          invoice_number: 'INV-2024-002',
          amount: 79.00,
          currency: 'USD',
          status: 'paid',
          due_date: '2024-09-01T00:00:00Z',
          created_at: '2024-08-25T00:00:00Z',
          pdf_url: '/api/invoices/2/pdf'
        }
      ];

      setSubscription(mockSubscription);
      setPayments(mockPayments);
      setInvoices(mockInvoices);
    } catch (error) {
      console.error('Error loading billing data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelSubscription = async () => {
    try {
      // Mock cancel - replace with actual API call
      if (subscription) {
        setSubscription({
          ...subscription,
          status: 'canceled'
        });
      }
      setShowCancelDialog(false);
    } catch (error) {
      console.error('Error canceling subscription:', error);
    }
  };

  const handleChangePlan = async () => {
    // Redirect to plan selection or show plan change dialog
    setShowChangeDialog(false);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return { variant: 'success' as const, icon: CheckCircle2, text: 'Active' };
      case 'trialing':
        return { variant: 'secondary' as const, icon: Clock, text: 'Trial' };
      case 'canceled':
      case 'unpaid':
        return { variant: 'destructive' as const, icon: XCircle, text: 'Canceled' };
      case 'past_due':
        return { variant: 'warning' as const, icon: AlertCircle, text: 'Past Due' };
      default:
        return { variant: 'secondary' as const, icon: Clock, text: 'Inactive' };
    }
  };

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case 'succeeded':
        return 'success' as const;
      case 'pending':
        return 'secondary' as const;
      case 'failed':
        return 'destructive' as const;
      case 'refunded':
        return 'warning' as const;
      default:
        return 'secondary' as const;
    }
  };

  const getInvoiceStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return 'success' as const;
      case 'sent':
        return 'secondary' as const;
      case 'overdue':
        return 'destructive' as const;
      case 'canceled':
        return 'warning' as const;
      default:
        return 'secondary' as const;
    }
  };

  const formatCurrency = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading billing information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Billing & Subscription</h1>
          <p className="text-muted-foreground">
            Manage your subscription, payments, and billing information
          </p>
        </div>
      </div>

      {/* Current Subscription Card */}
      {subscription && (
        <Card className="border-primary/20">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Current Subscription
                </CardTitle>
                <CardDescription>
                  {subscription.tier.display_name} Plan
                </CardDescription>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">
                  {formatCurrency(
                    subscription.billing_period === 'monthly' 
                      ? subscription.tier.price_monthly 
                      : subscription.tier.price_yearly / 12
                  )}
                  <span className="text-base font-normal text-muted-foreground">/mo</span>
                </div>
                <Badge variant={getStatusBadge(subscription.status).variant}>
                  {React.createElement(getStatusBadge(subscription.status).icon, { className: "w-3 h-3 mr-1" })}
                  {getStatusBadge(subscription.status).text}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <div className="text-sm text-muted-foreground">Billing Period</div>
                <div className="font-medium capitalize">{subscription.billing_period}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Current Period</div>
                <div className="font-medium">
                  {formatDate(subscription.current_period_start)} - {formatDate(subscription.current_period_end)}
                </div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Next Payment</div>
                <div className="font-medium">
                  {subscription.next_payment_date ? formatDate(subscription.next_payment_date) : 'N/A'}
                </div>
              </div>
            </div>
            
            <div className="flex gap-2 mt-4">
              <Button onClick={() => setShowChangeDialog(true)} variant="outline">
                <Settings className="w-4 h-4 mr-2" />
                Change Plan
              </Button>
              {subscription.status === 'active' && (
                <Button 
                  onClick={() => setShowCancelDialog(true)} 
                  variant="outline"
                  className="text-destructive hover:text-destructive"
                >
                  Cancel Subscription
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="payments" className="space-y-6">
        <TabsList>
          <TabsTrigger value="payments">Payment History</TabsTrigger>
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
          <TabsTrigger value="usage">Usage & Limits</TabsTrigger>
        </TabsList>

        <TabsContent value="payments" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Payment History</CardTitle>
              <CardDescription>
                View all your past payments and transactions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Date</th>
                      <th className="text-left p-2">Description</th>
                      <th className="text-left p-2">Amount</th>
                      <th className="text-left p-2">Status</th>
                      <th className="text-left p-2">Invoice</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments.map((payment) => (
                      <tr key={payment.id} className="border-b hover:bg-muted/50">
                        <td className="p-2">{formatDate(payment.payment_date)}</td>
                        <td className="p-2">{payment.description || 'Subscription Payment'}</td>
                        <td className="p-2 font-medium">
                          {formatCurrency(payment.amount, payment.currency)}
                        </td>
                        <td className="p-2">
                          <Badge variant={getPaymentStatusBadge(payment.status)}>
                            {payment.status}
                          </Badge>
                        </td>
                        <td className="p-2">
                          {payment.stripe_invoice_id && (
                            <Button variant="ghost" size="sm">
                              <Receipt className="w-4 h-4 mr-1" />
                              View
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="invoices" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Invoices</CardTitle>
              <CardDescription>
                Download and manage your invoices
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Invoice #</th>
                      <th className="text-left p-2">Date</th>
                      <th className="text-left p-2">Due Date</th>
                      <th className="text-left p-2">Amount</th>
                      <th className="text-left p-2">Status</th>
                      <th className="text-left p-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoices.map((invoice) => (
                      <tr key={invoice.id} className="border-b hover:bg-muted/50">
                        <td className="p-2 font-medium">{invoice.invoice_number}</td>
                        <td className="p-2">{formatDate(invoice.created_at)}</td>
                        <td className="p-2">{formatDate(invoice.due_date)}</td>
                        <td className="p-2 font-medium">
                          {formatCurrency(invoice.amount, invoice.currency)}
                        </td>
                        <td className="p-2">
                          <Badge variant={getInvoiceStatusBadge(invoice.status)}>
                            {invoice.status}
                          </Badge>
                        </td>
                        <td className="p-2">
                          {invoice.pdf_url && (
                            <Button variant="ghost" size="sm">
                              <Download className="w-4 h-4 mr-1" />
                              Download
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="usage" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Social Accounts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3 / 15</div>
                <div className="w-full bg-secondary rounded-full h-2 mt-2">
                  <div 
                    className="bg-primary h-2 rounded-full" 
                    style={{ width: '20%' }}
                  ></div>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  12 accounts remaining
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Scheduled Posts This Month
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">45 / ∞</div>
                <div className="w-full bg-secondary rounded-full h-2 mt-2">
                  <div 
                    className="bg-primary h-2 rounded-full" 
                    style={{ width: '45%' }}
                  ></div>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Unlimited posts available
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Team Members
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2 / 10</div>
                <div className="w-full bg-secondary rounded-full h-2 mt-2">
                  <div 
                    className="bg-primary h-2 rounded-full" 
                    style={{ width: '20%' }}
                  ></div>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  8 seats available
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Usage Analytics
              </CardTitle>
              <CardDescription>
                Track your usage over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                Usage analytics charts coming soon...
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Cancel Subscription Dialog */}
      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Subscription</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel your subscription? You'll lose access to all premium features.
            </DialogDescription>
          </DialogHeader>
          
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Your subscription will remain active until the end of your current billing period 
              ({subscription && formatDate(subscription.current_period_end)}).
            </AlertDescription>
          </Alert>
          
          <div className="flex gap-2 pt-4">
            <Button 
              onClick={handleCancelSubscription}
              variant="destructive"
            >
              Yes, Cancel Subscription
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setShowCancelDialog(false)}
            >
              Keep Subscription
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Change Plan Dialog */}
      <Dialog open={showChangeDialog} onOpenChange={setShowChangeDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Plan</DialogTitle>
            <DialogDescription>
              Upgrade or downgrade your subscription plan
            </DialogDescription>
          </DialogHeader>
          
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">
              Plan changes will take effect immediately, and you'll be charged or credited the prorated amount.
            </p>
            <Button onClick={handleChangePlan}>
              View Available Plans
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EnhancedBillingDashboard;
