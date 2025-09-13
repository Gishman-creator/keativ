import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { authApi } from '@/lib/api';
import { CheckCircle, XCircle, RefreshCw, BadgeX, BadgeCheck, LoaderCircle } from 'lucide-react';

interface VerificationResult {
  success: boolean;
  message: string;
  username?: string;
}

export function EmailVerification() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        setIsLoading(true);
        const response = await authApi.verifyEmail(token!);

        if (response.success) {
          setVerificationResult({
            success: true,
            message: (response.data as { message?: string })?.message || 'Email verified successfully!',
            username: (response.data as { username?: string })?.username
          });
        } else {
          setVerificationResult({
            success: false,
            message: response.error || 'Email verification failed'
          });
        }
      } catch {
        setVerificationResult({
          success: false,
          message: 'An error occurred during verification. Please try again.'
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (token) {
      verifyEmail();
    } else {
      setVerificationResult({
        success: false,
        message: 'Invalid verification link'
      });
      setIsLoading(false);
    }
  }, [token]);

  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-white">
        <div className="max-w-md w-full space-y-8 px-8">
          <div className="text-center">
            <LoaderCircle className="mx-auto h-12 w-12 text-primary animate-spin" />
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              Verifying your email...
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Please wait while we verify your email address.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-white">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="text-center">
          {verificationResult?.success ? (
            <>
              <BadgeCheck className="mx-auto h-12 w-12 text-green-600" />
              <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                Email Verified!
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                {verificationResult?.message}
              </p>
              <div className="mt-8 space-y-4">
                <Link
                  to="/login"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/80"
                >
                  Continue to Login
                </Link>
              </div>
            </>
          ) : (
            <>
              <BadgeX className="mx-auto h-12 w-12 text-red-600" />
              <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                Verification Failed
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                {verificationResult?.message}
              </p>
              <div className="mt-8 space-y-4">
                <Link
                  to="/resend-verification"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/80"
                >
                  Request New Verification Email
                </Link>
                <Link
                  to="/login"
                  className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  Back to Login
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
