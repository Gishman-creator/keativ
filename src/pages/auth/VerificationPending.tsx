import { useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { authApi } from '@/lib/api';

import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

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
      toast({
        title: "Error",
        description: "No email address found. Please try registering again.",
        variant: "destructive",
      });
      return;
    }

    setIsResending(true);

    try {
      const response = await authApi.resendVerificationEmail(emailToSend);

      if (response.success) {
        toast({
          title: "Email Sent",
          description: "Verification email has been resent to your inbox.",
        });
      } else {
        toast({
          title: "Error",
          description: response.error || 'Failed to send verification email',
          variant: "destructive",
        });
      }
    } catch {
      toast({
        title: "Error",
        description: 'An error occurred. Please try again.',
        variant: "destructive",
      });
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
                <p className="text-sm font-medium text-foreground">{state?.email || "your email address"}</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <Button onClick={handleResendEmail} className="w-full font-medium">
              Resend Verification Email
            </Button>
          </div>
        </div>

        <div className="text-center mt-8">
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              to="/login"
              type="button"
              className="text-primary hover:underline font-medium transition-colors"
            >
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default VerificationPending;
