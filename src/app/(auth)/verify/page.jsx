"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import {
  ArrowRight,
  Mail,
  CheckCircle,
  Loader2,
  RefreshCw,
} from "lucide-react";

function VerifyContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, otp }),
      });

      if (response.ok) {
        router.push("/login?verified=true");
      } else {
        const data = await response.json();
        setError(data.error || "Invalid verification code");
      }
    } catch (err) {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    setResendSuccess(false);
    setError("");

    try {
      const response = await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setResendSuccess(true);
      } else {
        const data = await response.json();
        setError(data.error || "Failed to resend verification code");
      }
    } catch (err) {
      setError("Failed to resend verification code");
    } finally {
      setResending(false);
    }
  };

  if (!email) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        {/* Background with gradients and animations */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-white"></div>
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-purple-200 rounded-full filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-40 -left-24 w-96 h-96 bg-blue-200 rounded-full filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>

        <div className="relative z-10 flex items-center justify-center min-h-screen py-12 px-4 sm:px-6 lg:px-8">
          <div className="w-full max-w-md">
            {/* Logo/Brand */}
            <div className="text-center mb-8">
              <Link href="/" className="inline-block">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-xl p-3 mb-4">
                  <span className="text-2xl">EduZen</span>
                </div>
              </Link>
            </div>

            <Card className="backdrop-blur-sm bg-white/80 border border-white/20 shadow-xl rounded-2xl">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-gradient-to-r from-red-100 to-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="h-8 w-8 text-red-600" />
                </div>
                <CardTitle className="text-2xl font-bold text-red-600">
                  Invalid Verification Link
                </CardTitle>
                <CardDescription className="text-gray-600">
                  The verification link is missing or invalid
                </CardDescription>
              </CardHeader>

              <CardContent className="text-center space-y-6">
                <Alert className="border-l-4 border-l-red-500 bg-red-50">
                  <AlertDescription className="text-red-700">
                    Please try registering again or contact support if the problem
                    persists.
                  </AlertDescription>
                </Alert>

                <Button
                  onClick={() => router.push("/register")}
                  className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-lg transition-all duration-300 hover:shadow-lg"
                >
                  Go to Register
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>

                <div className="text-center">
                  <Link
                    href="/"
                    className="text-sm text-gray-500 hover:text-gray-700 transition-colors flex items-center justify-center"
                  >
                    ← Back to home
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Add animations */}
        <style jsx>{`
          .animate-blob {
            animation: blob 7s infinite;
          }
          .animation-delay-2000 {
            animation-delay: 2s;
          }
          @keyframes blob {
            0% {
              transform: translate(0px, 0px) scale(1);
            }
            33% {
              transform: translate(30px, -50px) scale(1.1);
            }
            66% {
              transform: translate(-20px, 20px) scale(0.9);
            }
            100% {
              transform: translate(0px, 0px) scale(1);
            }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background with gradients and animations */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-white"></div>
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-purple-200 rounded-full filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute top-40 -left-24 w-96 h-96 bg-blue-200 rounded-full filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>

      <div className="relative z-10 flex items-center justify-center min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          {/* Logo/Brand */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-block">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-xl p-3 mb-4">
                <span className="text-2xl">EduZen</span>
              </div>
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Check your email
            </h1>
            <p className="text-gray-600">
              We&apos;ve sent a verification code to your inbox
            </p>
          </div>

          <Card className="backdrop-blur-sm bg-white/80 border border-white/20 shadow-xl rounded-2xl">
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="h-8 w-8 text-blue-600" />
              </div>
              <CardTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                Verify Your Email
              </CardTitle>
              <CardDescription className="text-gray-600">
                Enter the 6-digit code sent to{" "}
                <span className="font-medium text-gray-900">{email}</span>
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Success message for resend */}
              {resendSuccess && (
                <Alert className="border-l-4 border-l-green-500 bg-green-50">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-700">
                    Verification code resent successfully! Check your inbox.
                  </AlertDescription>
                </Alert>
              )}

              {/* Error message */}
              {error && (
                <Alert className="border-l-4 border-l-red-500 bg-red-50">
                  <AlertDescription className="text-red-700">{error}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label
                    htmlFor="otp"
                    className="text-sm font-medium text-gray-700"
                  >
                    Verification Code
                  </label>
                  <Input
                    id="otp"
                    name="otp"
                    type="text"
                    maxLength={6}
                    required
                    value={otp}
                    onChange={(e) =>
                      setOtp(e.target.value.replace(/\D/g, ""))
                    }
                    className="h-16 text-center text-2xl tracking-widest font-mono border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
                    placeholder="000000"
                    disabled={loading}
                  />
                  <p className="text-xs text-gray-500 text-center">
                    Enter the 6-digit code from your email
                  </p>
                </div>

                <Button
                  type="submit"
                  disabled={loading || otp.length !== 6}
                  className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-lg transition-all duration-300 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    <>
                      Verify Email
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </>
                  )}
                </Button>
              </form>

              {/* Resend section */}
              <div className="pt-4 border-t border-gray-100 text-center space-y-4">
                <p className="text-sm text-gray-600">Didn&apos;t receive the code?</p>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleResend}
                  disabled={resending}
                  className="w-full h-10 border-gray-200 hover:border-blue-300 transition-colors"
                >
                  {resending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Resending...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Resend Code
                    </>
                  )}
                </Button>
              </div>

              {/* Help text */}
              <div className="text-center pt-4 border-t border-gray-100">
                <p className="text-xs text-gray-500">
                  Check your spam folder if you don&apos;t see the email.{" "}
                  <Link
                    href="/register"
                    className="text-blue-600 hover:underline"
                  >
                    Try a different email
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Back to home link */}
          <div className="text-center mt-6">
            <Link
              href="/"
              className="text-sm text-gray-500 hover:text-gray-700 transition-colors flex items-center justify-center"
            >
              ← Back to home
            </Link>
          </div>
        </div>
      </div>

      {/* Add animations */}
      <style jsx>{`
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
      `}</style>
    </div>
  );
}

export default function Verify() {
  return (
    <Suspense fallback={
      <div className="min-h-screen relative overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-white"></div>
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    }>
      <VerifyContent />
    </Suspense>
  );
}