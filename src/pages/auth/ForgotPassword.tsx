import type React from "react"

import { useState } from "react"
import { Mail, CheckCircle, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { authApi } from "@/lib/api"
import { Link } from "react-router-dom" // Assuming Link is still needed for "Back to Login" or "Sign up"
import { showCustomToast } from "@/components/CustomToast"

export function ForgotPassword() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email.trim()) {
      setResult({
        success: false,
        message: "Please enter your email address",
      })
      return
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setResult({
        success: false,
        message: "Please enter a valid email address",
      })
      return
    }

    setIsLoading(true)
    setResult(null)

    try {
      const response = await authApi.forgotPassword(email)

      if (response.success) {
        showCustomToast("Email Sent", "Verification email has been sent to your inbox.", "success")
        setEmail("")
      } else {
        const error = response.error || 'Failed to send reset email.';
        console.error('Forgot password error:', error);
        if (error === 'Network error') {
          showCustomToast('No Internet', 'Please check your internet connection and try again.', 'error');
        } else {
          // Check if error is an object with key-value pairs
          if (typeof error === 'object' && error !== null) {
            const errorMessages = Object.entries(error)
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
            showCustomToast('Failed To Send Email', errorMessages || 'Failed to send reset email. Please check your email address and try again.', 'error');
          } else {
            showCustomToast('Failed To Send Email', 'Failed to send reset email. Please check your email address and try again.', 'error');
          }
        }
      }
    } catch {
      showCustomToast("Failed To Send Email", "Failed to send verification email", "error")
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
              Forgot Your Password?
            </h1>
            <p className="font-body" style={{ color: "#6B7280", fontFamily: "Poppins" }}>
              Enter your email address and we'll send you a password reset link
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                className={`${result ? "border-red-500 focus:border-secondary" : ""
                  }`}
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                style={{ fontFamily: "Poppins" }}
              />
              {result && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                  {result.message}
                </p>
              )}
            </div>

            <div className="flex justify-end">
              <Button
                type="submit"
                className="w-full font-medium font-body"
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
                    Sending...
                  </span>
                ) : (
                  "Send Email"
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
