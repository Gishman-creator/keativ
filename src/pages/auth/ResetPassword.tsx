import type React from "react"

import { useState } from "react"
import { Mail, CheckCircle, XCircle, EyeOff, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { authApi } from "@/lib/api"
import { Link, useParams, useNavigate } from "react-router-dom"
import toast from "react-hot-toast"
import { showCustomToast } from "@/components/CustomToast"

export function ResetPassword() {
  const { token } = useParams<{ token: string }>();
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [passwordError, setPasswordError] = useState<string | null>(null)
  const [confirmPasswordError, setConfirmPasswordError] = useState<string | null>(null)
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    setPasswordError(null)
    setConfirmPasswordError(null)

    let hasError = false

    if (!password.trim()) {
      setPasswordError("Please enter your new password.")
      hasError = true
    } else if (password.length < 8) {
      setPasswordError("Password must be at least 8 characters long.")
      hasError = true
    }

    if (!confirmPassword.trim()) {
      setConfirmPasswordError("Please confirm your new password.")
      hasError = true
    } else if (password !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match.")
      hasError = true
    }

    if (hasError) {
      return
    }

    setIsLoading(true)

    try {
      const response = await authApi.resetPassword(token!, password, confirmPassword)

      if (response.success) {
        setPassword("")
        setConfirmPassword("")
        toast.success("Password reset successfully! Redirecting to login...", {
          // Adjust position and duration as needed
          duration: 3000, // Show the toast for 3 seconds
        });
        
        // Use a setTimeout to allow the user to see the toast before navigation
        setTimeout(() => {
          navigate("/login");
        }, 2000); // Navigate after 2 seconds
      } else {
        const error = response.error || 'Registration failed';
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
            showCustomToast('Login Failed', errorMessages || 'Login failed. Please check your credentials and try again.', 'error');
          } else {
            showCustomToast('Login Failed', 'Login failed. Please check your credentials and try again or account not verified.', 'error');
          }
        }
      }
    } catch {
      showCustomToast("Password Reset Failed", "Failed to reset your password.", "error")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center" style={{ backgroundColor: "#FFFFFF" }}>
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
            <h1
              className="text-3xl font-bold mb-2 font-headers"
              style={{ color: "#2D3748", fontFamily: "Roboto Slab" }}
            >
              Reset Your Password
            </h1>
            <p className="font-body" style={{ color: "#6B7280", fontFamily: "Poppins" }}>
              Enter your new password below.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  className={`${passwordError ? "border-red-500 focus:border-secondary" : ""
                    }`}
                  placeholder="New Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  style={{ fontFamily: "Poppins" }}
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
              {passwordError && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                  {passwordError}
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
                  className={`${confirmPasswordError ? "border-red-500 focus:border-secondary" : ""
                    }`}
                  placeholder="Confirm New Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={isLoading}
                  style={{ fontFamily: "Poppins" }}
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
              {confirmPasswordError && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                  {confirmPasswordError}
                </p>
              )}
            </div>
            <div className="flex justify-end">
              <Button
                type="submit"
                className="w-full font-medium font-body mt-4"
                disabled={isLoading}
                style={{
                  backgroundColor: "#EF4444",
                  fontFamily: "Poppins",
                }}
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <img
                      src="/Rolling@1x-1.0s-200px-200px (2).svg"
                      alt="Loading spinner"
                      className="animate-spin h-5 w-5 mr-2"
                    />
                    Resetting...
                  </span>
                ) : (
                  "Reset Password"
                )}
              </Button>
            </div>
          </form>

          <div className="text-center mt-8">
            <p className="text-sm font-body" style={{ color: "#6B7280", fontFamily: "Poppins" }}>
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-medium transition-colors hover:underline"
                style={{ color: "#EF4444", fontFamily: "Poppins" }}
              >
                Log in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
