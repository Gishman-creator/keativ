import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Share2, Mail, Lock, User, Building, AlertCircle, ChevronRight, ChevronLeft, Eye, EyeOff } from 'lucide-react';
import { authApi } from '@/lib/api';
import { registerStart, registerSuccess, registerFailure } from '../../redux/slices/authSlice';

interface FormData {
  // Step 1: Personal Info
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  
  // Step 2: Business Info (maps to company_name in backend)
  companyName: string;
  role: string;
  
  // Step 3: Terms
  termsAccepted: boolean;
}

interface StepProps {
  formData: FormData;
  errors: Record<string, string>;
  onChange: (field: keyof FormData, value: string | boolean | string[]) => void;
  showPassword: boolean;
  showConfirmPassword: boolean;
  togglePasswordVisibility: () => void;
  toggleConfirmPasswordVisibility: () => void;
}

// Step 1: Personal Information
const PersonalInfoStep = ({ formData, errors, onChange, showPassword, showConfirmPassword, togglePasswordVisibility, toggleConfirmPasswordVisibility }: StepProps) => (
  <div className="space-y-4">
    <div className="grid grid-cols-2 gap-4">
      <div>
        <Label htmlFor="firstName">First Name *</Label>
        <div className="mt-1 relative">
          <Input
            id="firstName"
            type="text"
            required
            className={`pl-10 ${errors.firstName ? 'border-red-300' : ''}`}
            placeholder="First name"
            value={formData.firstName}
            onChange={(e) => onChange('firstName', e.target.value)}
          />
          <User className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
        </div>
        {errors.firstName && <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>}
      </div>

      <div>
        <Label htmlFor="lastName">Last Name *</Label>
        <div className="mt-1 relative">
          <Input
            id="lastName"
            type="text"
            required
            className={`pl-10 ${errors.lastName ? 'border-red-300' : ''}`}
            placeholder="Last name"
            value={formData.lastName}
            onChange={(e) => onChange('lastName', e.target.value)}
          />
          <User className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
        </div>
        {errors.lastName && <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>}
      </div>
    </div>

    <div>
      <Label htmlFor="email">Email Address *</Label>
      <div className="mt-1 relative">
        <Input
          id="email"
          type="email"
          required
          className={`pl-10 ${errors.email ? 'border-red-300' : ''}`}
          placeholder="Enter your email"
          value={formData.email}
          onChange={(e) => onChange('email', e.target.value)}
        />
        <Mail className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
      </div>
      {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
    </div>

    <div>
      <Label htmlFor="password">Password *</Label>
      <div className="mt-1 relative">
        <Input
          id="password"
          type={showPassword ? 'text' : 'password'}
          required
          className={`pl-10 pr-10 ${errors.password ? 'border-red-300' : ''}`}
          placeholder="Create a strong password"
          value={formData.password}
          onChange={(e) => onChange('password', e.target.value)}
        />
        <Lock className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
        <button
          type="button"
          className="absolute right-3 top-2.5"
          onClick={togglePasswordVisibility}
        >
          {showPassword ? <EyeOff className="h-4 w-4 text-gray-400" /> : <Eye className="h-4 w-4 text-gray-400" />}
        </button>
      </div>
      {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
      <p className="mt-1 text-xs text-gray-500">Must be at least 8 characters with uppercase, lowercase, and numbers</p>
    </div>

    <div>
      <Label htmlFor="confirmPassword">Confirm Password *</Label>
      <div className="mt-1 relative">
        <Input
          id="confirmPassword"
          type={showConfirmPassword ? 'text' : 'password'}
          required
          className={`pl-10 pr-10 ${errors.confirmPassword ? 'border-red-300' : ''}`}
          placeholder="Confirm your password"
          value={formData.confirmPassword}
          onChange={(e) => onChange('confirmPassword', e.target.value)}
        />
        <Lock className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
        <button
          type="button"
          className="absolute right-3 top-2.5"
          onClick={toggleConfirmPasswordVisibility}
        >
          {showConfirmPassword ? <EyeOff className="h-4 w-4 text-gray-400" /> : <Eye className="h-4 w-4 text-gray-400" />}
        </button>
      </div>
      {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>}
    </div>
  </div>
);

// Step 2: Business Information
const BusinessInfoStep = ({ formData, errors, onChange }: StepProps) => (
  <div className="space-y-4">
    <div>
      <Label htmlFor="companyName">Business/Company Name (Optional)</Label>
      <div className="mt-1 relative">
        <Input
          id="companyName"
          type="text"
          className={`pl-10 ${errors.companyName ? 'border-red-300' : ''}`}
          placeholder="Your business or company name"
          value={formData.companyName}
          onChange={(e) => onChange('companyName', e.target.value)}
        />
        <Building className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
      </div>
      {errors.companyName && <p className="mt-1 text-sm text-red-600">{errors.companyName}</p>}
    </div>

    <div>
      <Label htmlFor="role">Role *</Label>
      <Select value={formData.role} onValueChange={(value) => onChange('role', value)}>
        <SelectTrigger className={errors.role ? 'border-red-300' : ''}>
          <SelectValue placeholder="Select your role" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="marketing-manager">Marketing Manager</SelectItem>
          <SelectItem value="social-media-manager">Social Media Manager</SelectItem>
          <SelectItem value="content-creator">Content Creator</SelectItem>
          <SelectItem value="business-owner">Business Owner</SelectItem>
          <SelectItem value="freelancer">Freelancer</SelectItem>
          <SelectItem value="agency">Agency</SelectItem>
          <SelectItem value="consultant">Consultant</SelectItem>
          <SelectItem value="student">Student</SelectItem>
          <SelectItem value="other">Other</SelectItem>
        </SelectContent>
      </Select>
      {errors.role && <p className="mt-1 text-sm text-red-600">{errors.role}</p>}
    </div>
  </div>
);

// Step 3: Terms and Conditions
const TermsStep = ({ formData, errors, onChange }: StepProps) => (
  <div className="space-y-6">
    <div className="text-center">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Almost Done!</h3>
      <p className="text-sm text-gray-600 mb-6">
        Just agree to our terms and you'll be ready to start managing your social media presence.
      </p>
    </div>

    <div className="space-y-4 pt-4 border-t">
      <div className="flex items-start space-x-3">
        <Checkbox
          id="termsAccepted"
          checked={formData.termsAccepted}
          onCheckedChange={(checked) => onChange('termsAccepted', checked as boolean)}
        />
        <div className="leading-none">
          <Label htmlFor="termsAccepted" className="text-sm font-normal">
            I agree to the{' '}
            <Link to="/terms" className="text-red-500 hover:text-red-600 underline">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link to="/privacy" className="text-red-500 hover:text-red-600 underline">
              Privacy Policy
            </Link>{' '}
            *
          </Label>
        </div>
      </div>
      {errors.termsAccepted && <p className="mt-1 text-sm text-red-600">{errors.termsAccepted}</p>}
    </div>

    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
      <div className="flex">
        <div className="flex-shrink-0">
          <Share2 className="h-5 w-5 text-blue-400" />
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-blue-800">What's next?</h3>
          <div className="mt-2 text-sm text-blue-700">
            <ul className="list-disc pl-5 space-y-1">
              <li>Verify your email address</li>
              <li>Connect your social media accounts</li>
              <li>Start creating and scheduling content</li>
              <li>Monitor your social media performance</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default function Signup() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    // Step 1: Personal Info
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    
    // Step 2: Business Info
    companyName: '',
    role: '',
    
    // Step 3: Terms
    termsAccepted: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const steps = [
    { number: 1, title: 'Personal Info', description: 'Basic account details' },
    { number: 2, title: 'Business Info', description: 'Tell us about your business' },
    { number: 3, title: 'Terms', description: 'Accept terms and get started' },
  ];

  const handleFieldChange = (field: keyof FormData, value: string | boolean | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    switch (step) {
      case 1:
        if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
        if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
        if (!formData.email.trim()) {
          newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
          newErrors.email = 'Email is invalid';
        }
        if (!formData.password) {
          newErrors.password = 'Password is required';
        } else if (formData.password.length < 8) {
          newErrors.password = 'Password must be at least 8 characters';
        } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
          newErrors.password = 'Password must contain uppercase, lowercase, and numbers';
        }
        if (formData.password !== formData.confirmPassword) {
          newErrors.confirmPassword = 'Passwords do not match';
        }
        break;

      case 2:
        if (!formData.role) newErrors.role = 'Role is required';
        break;

      case 3:
        if (!formData.termsAccepted) {
          newErrors.termsAccepted = 'You must accept the terms and conditions';
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 3));
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateStep(3)) return;

    setIsLoading(true);
    setError('');
    dispatch(registerStart());

    try {
      const registrationData = {
        username: formData.email, // Use email as username
        email: formData.email,
        password: formData.password,
        password_confirm: formData.confirmPassword,
        first_name: formData.firstName,
        last_name: formData.lastName,
        company_name: formData.companyName, // Maps to company_name in backend
      };

      const response = await authApi.register(registrationData);
      
      if (response.success) {
        dispatch(registerSuccess());
        
        navigate('/verification-pending', { 
          state: { 
            email: formData.email,
            message: 'Registration successful! Please check your email to verify your account.'
          }
        });
      } else {
        throw new Error('Registration failed');
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error 
        ? err.message 
        : 'Registration failed. Please try again.';
      setError(errorMessage);
      dispatch(registerFailure(errorMessage));
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword);

  const renderStep = () => {
    const stepProps = {
      formData,
      errors,
      onChange: handleFieldChange,
      showPassword,
      showConfirmPassword,
      togglePasswordVisibility,
      toggleConfirmPasswordVisibility,
    };

    switch (currentStep) {
      case 1:
        return <PersonalInfoStep {...stepProps} />;
      case 2:
        return <BusinessInfoStep {...stepProps} />;
      case 3:
        return <TermsStep {...stepProps} />;
      default:
        return <PersonalInfoStep {...stepProps} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="bg-red-500 p-3 rounded-full">
            <Share2 className="h-8 w-8 text-white" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Join Social Media Manager
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-red-500 hover:text-red-600">
            Sign in here
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-2xl">
        <Card>
          <CardHeader className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-xl">
                  Step {currentStep} of 4: {steps[currentStep - 1].title}
                </CardTitle>
                <CardDescription>
                  {steps[currentStep - 1].description}
                </CardDescription>
              </div>
              <div className="text-sm text-gray-500">
                {currentStep}/3
              </div>
            </div>
            
            {/* Progress bar */}
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-red-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / 3) * 100}%` }}
              />
            </div>

            {/* Step indicators */}
            <div className="flex justify-between">
              {steps.map((step) => (
                <div
                  key={step.number}
                  className={`flex flex-col items-center space-y-1 ${
                    step.number <= currentStep ? 'text-red-500' : 'text-gray-400'
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      step.number <= currentStep
                        ? 'bg-red-500 text-white'
                        : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    {step.number}
                  </div>
                  <div className="text-xs text-center hidden sm:block">
                    {step.title}
                  </div>
                </div>
              ))}
            </div>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-md p-4">
                  <div className="flex">
                    <AlertCircle className="h-5 w-5 text-red-400" />
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-800">
                        Registration Error
                      </h3>
                      <div className="mt-2 text-sm text-red-700">
                        {error}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {renderStep()}

              <div className="flex justify-between space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={currentStep === 1}
                  className="flex items-center space-x-2"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span>Previous</span>
                </Button>

                {currentStep < 3 ? (
                  <Button
                    type="button"
                    onClick={handleNext}
                    className="flex items-center space-x-2 bg-red-500 hover:bg-red-600"
                  >
                    <span>Next</span>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="bg-red-500 hover:bg-red-600"
                  >
                    {isLoading ? 'Creating Account...' : 'Create Account'}
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}