import type React from "react"

import { useState } from "react"
import { Mail, CheckCircle, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { authApi } from "@/lib/api"
import { Link } from "react-router-dom" // Assuming Link is still needed for "Back to Login" or "Sign up"

export function ResendVerification() {
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
      const response = await authApi.resendVerificationEmail(email)

      if (response.success) {
        setResult({
          success: true,
          message: "Verification email sent successfully! Please check your inbox.",
        })
        setEmail("")
      } else {
        setResult({
          success: false,
          message: response.error || "Failed to send verification email",
        })
      }
    } catch {
      setResult({
        success: false,
        message: "An error occurred. Please try again.",
      })
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
              Resend Verification
            </h1>
            <p className="font-body" style={{ color: "#6B7280", fontFamily: "Poppins" }}>
              Enter your email address and we'll send you a new verification link
            </p>
          </div>

          {result && (
            <div
              className={`rounded-lg p-4 mb-6 border ${
                result.success
                  ? "bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800"
                  : "bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800"
              }`}
            >
              <div className="flex">
                <div className="flex-shrink-0">
                  {result.success ? (
                    <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                  )}
                </div>
                <div className="ml-3">
                  <p
                    className={`text-sm font-medium font-body ${
                      result.success ? "text-green-800 dark:text-green-400" : "text-red-800 dark:text-red-400"
                    }`}
                    style={{ fontFamily: "Poppins" }}
                  >
                    {result.message}
                  </p>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                className="font-body"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                style={{ fontFamily: "Poppins" }}
              />
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
                  "Send Verification Email"
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
