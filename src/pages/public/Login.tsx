import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Share2, Mail, Lock, CheckCircle, AlertCircle } from 'lucide-react';
import { loginStart, loginSuccess, loginFailure } from '../../redux/slices/authSlice';
import { authApi } from '@/lib/api';
import api from '@/services/api';

interface LocationState {
  message?: string;
  username?: string;
  type?: 'success' | 'error';
}

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check for messages from email verification or registration
    const state = location.state as LocationState;
    if (state?.message) {
      if (state.type === 'success') {
        setSuccessMessage(state.message);
        if (state.username) {
          setEmail(state.username);
        }
      } else {
        setErrorMessage(state.message);
      }
    }
  }, [location.state]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');
    setSuccessMessage('');
    dispatch(loginStart());

    try {
      const response = await authApi.login({ username: email, password });
      if (response.success && response.data) {
        dispatch(loginSuccess({ 
          id: response.data.user.id.toString(),
          name: `${response.data.user.first_name} ${response.data.user.last_name}`,
          email: response.data.user.email,
          avatar: response.data.user.profile?.avatar || '',
          businessName: response.data.user.profile?.company_name || '',
          isLoggedIn: true
        }));
        
        // Check if this is a first-time login that needs plan selection
        try {
          const planResponse = await api.get('/auth/setup/plan-selection/');
          if (planResponse.data.is_first_login) {
            navigate('/plan-selection');
          } else {
            navigate('/dashboard');
          }
        } catch {
          // If plan selection check fails, just go to dashboard
          navigate('/dashboard');
        }
      } else {
        const error = response.error || 'Login failed';
        setErrorMessage(error);
        dispatch(loginFailure(error));
      }
    } catch {
      const errorMsg = 'Network error. Please try again.';
      setErrorMessage(errorMsg);
      dispatch(loginFailure(errorMsg));
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    // TODO: Implement Google OAuth login
    setErrorMessage('Google login coming soon. Please use email login.');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center">
            <Share2 className="h-12 w-12 text-red-500" />
          </div>
          <h2 className="mt-6 font-heading text-3xl font-bold text-gray-900">
            Welcome back to Zenith
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Don't have an account?{' '}
            <Link to="/signup" className="text-red-500 hover:text-red-600 font-medium">
              Sign up for free
            </Link>
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Sign in to your account</CardTitle>
            <CardDescription>
              Enter your email and password to access your dashboard
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {successMessage && (
              <div className="flex items-center space-x-2 text-green-600 bg-green-50 p-3 rounded-md">
                <CheckCircle className="h-5 w-5" />
                <span className="text-sm">{successMessage}</span>
              </div>
            )}

            {errorMessage && (
              <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-md">
                <AlertCircle className="h-5 w-5" />
                <span className="text-sm">{errorMessage}</span>
              </div>
            )}

            <Button
              onClick={handleGoogleLogin}
              variant="outline"
              className="w-full"
              type="button"
              disabled={isLoading}
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with email</span>
              </div>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="email">Email address</Label>
                <div className="mt-1 relative">
                  <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="pl-10"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="password">Password</Label>
                <div className="mt-1 relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    required
                    className="pl-10"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <Link to="#" className="text-sm text-red-500 hover:text-red-600">
                  Forgot your password?
                </Link>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-red-500 hover:bg-red-600"
                disabled={isLoading}
              >
                {isLoading ? 'Signing in...' : 'Sign in'}
              </Button>
            </form>

            <div className="text-center space-y-2">
              <p className="text-sm text-gray-600">
                Need to verify your email?{' '}
                <Link
                  to="/resend-verification"
                  className="text-red-500 hover:text-red-600 font-medium"
                >
                  Resend verification
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;