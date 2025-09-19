import type React from "react"
import { useState, useEffect } from "react" // Added useEffect
import { Eye, EyeOff, CheckCircle, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { Link, useNavigate, useSearchParams } from "react-router-dom"
import { authApi } from "@/lib/api"
import Plans from "@/pages/auth/Plans" // Import the Plans component
import { showCustomToast } from "@/components/CustomToast"

interface FormData {
  username: string
  email: string
  password: string
  confirmPassword: string
  first_name: string
  last_name: string
  subscription_tier_id: string | null; // Added subscription_tier_id
}

interface FormErrors {
  [key: string]: string
}

// Define the possible steps
type RegisterStep = 'choice' | 'form' | 'plans';

export function Register() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialStep = searchParams.get('step');
  const validSteps: RegisterStep[] = ['choice', 'form', 'plans'];

  // Fix for TypeScript error: Ensure initial step is valid or defaults to 'plans'
  const [currentStep, setCurrentStep] = useState<RegisterStep>(
    initialStep && validSteps.includes(initialStep as RegisterStep) ? initialStep as RegisterStep : 'plans'
  );

  const [formData, setFormData] = useState<FormData>({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    first_name: "",
    last_name: "",
    subscription_tier_id: null, // Initialize subscription_tier_id
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const { toast } = useToast()
  const navigate = useNavigate()

  // Effect to synchronize currentStep with URL search params
  useEffect(() => {
    const stepFromUrl = searchParams.get('step');
    if (stepFromUrl && validSteps.includes(stepFromUrl as RegisterStep)) {
      setCurrentStep(stepFromUrl as RegisterStep);
    } else {
      // If no valid step is found in the URL, default to 'plans' and update the URL
      setCurrentStep('plans');
      setSearchParams({ step: 'plans' });
    }
  }, [searchParams, validSteps, setSearchParams]); // Add setSearchParams to dependency array

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    }

    if (!formData.password) {
      newErrors.password = "Password is required"
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters"
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password"
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
    }

    if (!formData.first_name.trim()) {
      newErrors.first_name = "First name is required"
    }

    if (!formData.last_name.trim()) {
      newErrors.last_name = "Last name is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (!formData.subscription_tier_id) {
      // If no subscription is selected, prompt user to select one
      showCustomToast('Plan Selection Required', 'Please select a plan before continuing.', 'error');
      setCurrentStep('plans'); // Go back to plans
      setSearchParams({ step: 'plans' });
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      // Assuming the authApi.register function can accept subscription_tier_id
      // The FormData interface has been updated to include it.
      const result = await authApi.register({
        username: formData.email,
        email: formData.email,
        password: formData.password,
        password_confirm: formData.confirmPassword,
        first_name: formData.first_name,
        last_name: formData.last_name,
        subscription_tier_id: formData.subscription_tier_id, // Use the value from formData
        // role: "user" // Assuming role is needed, might need to be added to form or default
      });

      if (result.success && result.data) {
        navigate('/verification-pending', {
          state: {
            email: formData.email,
            username: formData.email,
            message: result.data.message,
          },
        });
      } else {
        const error = result.error || 'Registration failed';
        console.error('Registration failed:', error);
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
            showCustomToast('Registratin Failed', errorMessages || 'Registratin failed. Please check your credentials and try again.', 'error');
          } else {
            showCustomToast('Registratin Failed', 'Registratin failed. Please check your credentials and try again.', 'error');
          }
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  // Handler for when a plan is selected in the Plans component
  const handlePlanSelect = (planId: string) => {
    setFormData((prev) => ({ ...prev, subscription_tier_id: planId })); // Set subscription_tier_id in formData
    toast({
      title: "Plan Selected",
      description: `You have selected plan ID: ${planId}. Proceed to fill in your details.`,
    });
    // Navigate to the form step after plan selection
    setCurrentStep('form'); // <-- Change this
    setSearchParams({ step: 'form' });
  };

  // Effect to scroll to top when currentStep changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentStep]); // Re-run effect when currentStep changes

  // Render 'plans' step
  if (currentStep === 'plans') {
    return (
      <div className="flex items-center justify-center">
        <div className="w-full mx-4">
          <div className="bg-card w-full rounded-2xl shadow-[var(--shadow-elegant)]">

            {/* Render the Plans component here, passing the handler */}
            <Plans onPlanSelect={handlePlanSelect} />

          </div>
        </div>
      </div>
    )
  }

  // Render 'form' step
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-lg w-full mx-4">
        <div className="bg-card rounded-2xl p-8 shadow-[var(--shadow-elegant)]">
          <div className="text-left mb-8">
            <div className="bg-red-50 flex justify-center mx-auto mb-2 w-fit rounded-md overflow-hidden">
              <img
                src="/logo-white.png"
                alt="Keative Logo"
                className="bg-primary w-12 h-12 p-2 object-cover"
              />
            </div>
            <h1 className="text-2xl text-center font-bold mb-2 text-foreground">
              Welcome, Create your account
            </h1>
            <p className="text-sm text-center text-muted-foreground">
              Enter your details and create a password
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Input
                  id="first_name"
                  name="first_name"
                  type="text"
                  autoComplete="given-name"
                  className={`${errors.first_name ? "border-red-500 focus:border-secondary" : ""
                    }`}
                  placeholder="First Name"
                  value={formData.first_name}
                  onChange={handleInputChange}
                />
                {errors.first_name && (
                  <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                    {errors.first_name}
                  </p>
                )}
              </div>

              <div>
                <Input
                  id="last_name"
                  name="last_name"
                  type="text"
                  autoComplete="family-name"
                  className={`${errors.last_name ? "border-red-500 focus:border-secondary" : ""
                    }`}
                  placeholder="Last Name"
                  value={formData.last_name}
                  onChange={handleInputChange}
                />
                {errors.last_name && (
                  <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                    {errors.last_name}
                  </p>
                )}
              </div>
            </div>

            <div className="">
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                className={`${errors.email ? "border-red-500 focus:border-secondary" : ""
                  }`}
                placeholder="Email"
                value={formData.email}
                onChange={handleInputChange}
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-600 dark:text-red-400">
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
                  autoComplete="new-password"
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
                <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                  {errors.password}
                </p>
              )}
            </div>

            <div>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  autoComplete="new-password"
                  className={`pr-12 ${errors.confirmPassword ? "border-red-500 focus:border-secondary" : ""
                    }`}
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            <div className="flex justify-between items-center">
              <Button
                type="button"
                variant="ghost"
                className="w-auto text-gray-500 hover:text-gray-700"
                onClick={() => {
                  setCurrentStep('plans'); // Go back to plans
                  setSearchParams({ step: 'plans' });
                }}
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back
              </Button>
              <Button
                type="button"
                className="w-auto font-medium"
                onClick={handleSubmit} // Trigger handleSubmit
                disabled={isLoading} // Disable button when loading
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <img src="/Rolling@1x-1.0s-200px-200px (2).svg" alt="Loading spinner" className="animate-spin h-5 w-5 mr-2" />
                    Signing Up...
                  </span>
                ) : (
                  "Sign Up"
                )}
              </Button>
            </div>
          </form>

          <div className="text-center mt-6">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-primary hover:underline font-medium"
              >
                Log In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
