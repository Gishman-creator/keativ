import { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { authApi } from '@/lib/api';
import { Mail, CheckCircle, XCircle } from 'lucide-react';

interface LocationState {
  email?: string;
  username?: string;
}

export function VerificationPending() {
  const location = useLocation();
  const state = location.state as LocationState;
  const [isResending, setIsResending] = useState(false);
  const [resendResult, setResendResult] = useState<{ success: boolean; message: string } | null>(null);

  const handleResendEmail = async () => {
    if (!state?.email) {
      setResendResult({
        success: false,
        message: 'No email address found. Please try registering again.'
      });
      return;
    }

    setIsResending(true);
    setResendResult(null);

    try {
      const response = await authApi.resendVerificationEmail(state.email);
      
      if (response.success) {
        setResendResult({
          success: true,
          message: 'Verification email sent successfully!'
        });
      } else {
        setResendResult({
          success: false,
          message: response.error || 'Failed to send verification email'
        });
      }
    } catch {
      setResendResult({
        success: false,
        message: 'An error occurred. Please try again.'
      });
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="text-center">
          <Mail className="mx-auto h-12 w-12 text-blue-600" />
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Check Your Email
          </h2>
          <div className="mt-4">
            <p className="text-sm text-gray-600">
              We've sent a verification link to:
            </p>
            <p className="text-sm font-medium text-gray-900 mt-1">
              {state?.email || 'your email address'}
            </p>
          </div>
          <p className="mt-4 text-sm text-gray-600">
            Click the link in the email to verify your account and start using Social Media Manager.
          </p>
        </div>

        {resendResult && (
          <div className={`rounded-md p-4 ${resendResult.success ? 'bg-green-50' : 'bg-red-50'}`}>
            <div className="flex">
              <div className="flex-shrink-0">
                {resendResult.success ? (
                  <CheckCircle className="h-5 w-5 text-green-400" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-400" />
                )}
              </div>
              <div className="ml-3">
                <p className={`text-sm font-medium ${resendResult.success ? 'text-green-800' : 'text-red-800'}`}>
                  {resendResult.message}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
            <h3 className="text-sm font-medium text-blue-800 mb-2">
              Didn't receive the email?
            </h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Check your spam or junk folder</li>
              <li>• Make sure the email address is correct</li>
              <li>• The verification link expires in 24 hours</li>
            </ul>
          </div>

          <button
            onClick={handleResendEmail}
            disabled={isResending}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isResending ? 'Sending...' : 'Resend Verification Email'}
          </button>

          <div className="text-center space-y-2">
            <Link
              to="/login"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Back to Login
            </Link>
            <span className="text-gray-400 mx-2">•</span>
            <Link
              to="/register"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Register Again
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
