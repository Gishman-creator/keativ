import React, { useState } from 'react';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';
import stripePromise, { stripeConfig } from '@/services/stripe';

interface PaymentFormProps {
  onPaymentSuccess: (paymentMethodId: string) => void;
  onCancel: () => void;
  loading?: boolean;
  title?: string;
  description?: string;
}

const PaymentForm: React.FC<PaymentFormProps> = ({
  onPaymentSuccess,
  onCancel,
  loading,
  title = "Payment Details",
  description = "Enter your payment information below."
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);
    setError(null);

    const cardElement = elements.getElement(CardElement);

    if (!cardElement) {
      setError('Card element not found');
      setProcessing(false);
      return;
    }

    try {
      const { error: stripeError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
      });

      if (stripeError) {
        setError(stripeError.message || 'An error occurred while processing your payment.');
      } else if (paymentMethod) {
        onPaymentSuccess(paymentMethod.id);
      }
    } catch {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#424770',
        '::placeholder': {
          color: '#aab7c4',
        },
        padding: '12px',
      },
      invalid: {
        color: '#9e2146',
      },
    },
    hidePostalCode: false,
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="border rounded-lg p-3 bg-white">
            <CardElement options={cardElementOptions} />
          </div>

          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={onCancel}
              disabled={processing || loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={!stripe || processing || loading}
            >
              {processing || loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                'Save Payment Method'
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

// Wrapper component to provide Stripe context
export const PaymentMethodForm: React.FC<PaymentFormProps> = (props) => {
  return (
    <Elements stripe={stripePromise} options={stripeConfig}>
      <PaymentForm {...props} />
    </Elements>
  );
};

export default PaymentMethodForm;
