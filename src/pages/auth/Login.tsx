import type React from "react"
import { useState } from "react"
import { Eye, EyeOff, LogIn } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { useDispatch } from "react-redux"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { loginFailure, loginStart, loginSuccess } from "@/redux/slices/authSlice"
import { authApi } from "@/lib/api"
import { showCustomToast } from "@/components/CustomToast"

interface LoginFormData {
  email: string
  password: string
}

interface FormErrors {
  [key: string]: string
}

const Login = () => {
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { toast } = useToast()

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    }

    if (!formData.password) {
      newErrors.password = "Password is required"
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    dispatch(loginStart());

    if (!validateForm()) {
      return
    }

    setIsLoading(true)
    setErrors({})

    try {
      const response = await authApi.login({ username: formData.email, password: formData.password });
      if (response.success && response.data) {
        dispatch(loginSuccess({
          id: response.data.user.id.toString(),
          name: `${response.data.user.first_name} ${response.data.user.last_name}`,
          email: response.data.user.email,
          avatar: response.data.user.profile?.avatar || '',
          businessName: response.data.user.profile?.company_name || '',
          isLoggedIn: true
        }));

        navigate('/dashboard');

      } else {
        const error = response.error || 'Login failed';
        if (error === 'Network error') {
          showCustomToast('No Internet', 'Please check your internet connection and try again.', 'error');
        } else {
          // Check if error is an object with key-value pairs
          if (typeof error === 'object' && error !== null) {
            const errorMessages = Object.entries(error)
              .map(([key, value]) => `${Array.isArray(value) ? value.join(', ') : value}`)
              .join('. ');
            showCustomToast('Login Failed', errorMessages || 'Login failed. Please check your credentials and try again.', 'error');
          } else {
            showCustomToast('Login Failed', 'Login failed. Please check your credentials and try again or account not verified.', 'error');
          }
        }
        console.log(response);
        setErrorMessage(error);
        dispatch(loginFailure(error));
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-md w-full mx-4">
        <div className="bg-card rounded-2xl p-8 shadow-[var(--shadow-elegant)]">
          <div className="text-center mb-8">
            <div className="bg-red-50 flex justify-center mx-auto mb-2 w-fit rounded-md overflow-hidden">
              <img
                src="/logo-white.png"
                alt="Keative Logo"
                className="bg-primary w-12 h-12 p-2 object-cover"
              />
            </div>
            <h1 className="text-3xl font-bold mb-2 text-foreground font-headers">
              Welcome Back
            </h1>
            <p className="text-muted-foreground">
              Sign in to your account to continue
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
            <div>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                className={`${errors.email ? "border-red-500 focus:border-secondary" : ""
                  }`}
                placeholder="Email address"
                value={formData.email}
                onChange={handleInputChange}
              />
              {errors.email && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                  {errors.email}
                </p>
              )}
            </div>

            <div>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  className={`pr-12 ${errors.password ? "border-red-500 focus:border-secondary" : ""
                    }`}
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleInputChange}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                  {errors.password}
                </p>
              )}

              <div className="flex items-center justify-end mt-2">
                <Link
                  to="/forgot-password"
                  className="text-sm text-primary hover:text-primary/80 font-medium transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
            </div>

            <div className="flex justify-end">
              <Button
                type="submit"
                className="w-full font-medium mt-4"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <img src="/Rolling@1x-1.0s-200px-200px (2).svg" alt="Loading spinner" className="animate-spin h-5 w-5 mr-2" />
                    Logging In...
                  </span>
                ) : (
                  <>
                    Log In
                  </>
                )}
              </Button>
            </div>
          </form>

          <div className="text-center mt-8">
            <p className="text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link
                to="/signup"
                type="button"
                className="text-primary hover:underline font-medium transition-colors"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login;
