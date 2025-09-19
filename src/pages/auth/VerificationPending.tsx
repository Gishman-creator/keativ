import { useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { authApi } from '@/lib/api';

import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { showCustomToast } from '@/components/CustomToast';

interface LocationState {
  email?: string;
  username?: string;
}

interface VerificationPendingProps {
  email?: string;
}

export function VerificationPending() {
  const location = useLocation();
  const state = location.state as LocationState;
  const { toast } = useToast();
  const [isResending, setIsResending] = useState(false);
  const navigate = useNavigate();

  const handleResendEmail = async () => {
    const emailToSend = state?.email;

    if (!emailToSend) {
      showCustomToast("Failed To Send Email", "No email address found. Please try registering again.", "error");
      return;
    }

    setIsResending(true);

    try {
      const response = await authApi.resendVerificationEmail(emailToSend);
      console.log('Response', response)

      if (response.success) {
        showCustomToast("Email Sent", "Verification email has been sent to your inbox.", "success");
      } else {
        const error = response.error || 'Failed to resend verification email.';
        console.error('Resend verification email error:', error);
        if (error === 'Network error') {
          showCustomToast('No Internet', 'Please check your internet connection and try again.', 'error');
        } else {
          // Check if error is an object with key-value pairs
          if (typeof error === 'object' && error !== null) {
            const errorMessages = Object.entries(error)
              .filter(([key, value]) => key !== 'username')
              .map(([key, value]) => {
                let message;
                if (Array.isArray(value)) {
                  message = value.join(', ');
                } else {
                  // Convert to string to handle numbers, booleans, etc.
                  message = String(value);
                }
                // Add period only if the message doesn't already end with one
                return message.endsWith('.') ? message : message + '.';
              })
              .join(' ');
            showCustomToast('Failed To Send Email', errorMessages || 'Failed to resend verification email. Please try again.', 'error');
          } else {
            showCustomToast('Failed To Send Email', 'Failed to resend verification email. Please try again.', 'error');
          }
        }
      }
    } catch {
      showCustomToast("Failed To Send Email", "Failed to send verification email", "error");
    } finally {
      setIsResending(false);
    }
  };

  const handleBackToLogin = () => {
    toast({
      title: "Redirecting",
      description: "Taking you back to the login page.",
    });
    // In a real application, you would navigate to the login page here.
    // For example: navigate('/login');
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-background">
      <div className="max-w-md w-full mx-4">
        <div>
          <div className="text-center mb-8">
            <div className="bg-red-50 flex justify-center mx-auto mb-2 w-fit rounded-md overflow-hidden">
              <img
                src="/logo-white.png"
                alt="Keative Logo"
                className="bg-primary w-12 h-12 p-2 object-cover"
              />
            </div>
            <h1 className="text-3xl font-bold mb-2 text-foreground font-headers">Check Your Email</h1>
            <p className="text-muted-foreground">We've sent a verification link to your email</p>
          </div>

          <div className="text-center mb-8">
            <div className="mb-6">
              <div className="space-y-2">
                <p className="bg-gray-100 py-2 px-6 mx-auto rounded-md text-sm font-medium text-foreground font-fira-code">
                  {state?.email || "your email address"}
                </p>
              </div>
            </div>
          </div>

          {/* <div className="space-y-4">
            <Button onClick={handleResendEmail} className="w-full font-medium">
              Resend Verification Email
            </Button>
          </div> */}
        </div>

        <div className="text-center mt-24">
          <p className="text-sm text-muted-foreground">
            Didn't get the email?{" "}
            <button
              onClick={handleResendEmail}
              type="button"
              className="text-primary hover:underline font-medium transition-colors"
            >
              Resend now
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default VerificationPending;
