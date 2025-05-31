"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, CheckCircle, ArrowRight, UserPlus } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", content: "" });
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      username: "",
      password: "",
    },
  });

  const onSubmit = async (values) => {
    setIsLoading(true);
    setMessage({ type: "", content: "" });

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (data.success) {
        setMessage({
          type: "success",
          content: data.message,
        });
        // Redirect to verify page after successful registration
        setTimeout(() => {
          router.push(`/verify?email=${values.email}`);
        }, 2000);
      } else {
        setMessage({
          type: "error",
          content: data.message,
        });
      }
    } catch (error) {
      setMessage({
        type: "error",
        content: "Something went wrong. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Create your account</h1>
            <p className="text-gray-600">Join thousands of students transforming their learning</p>
          </div>

          <Card className="backdrop-blur-sm bg-white/80 border border-white/20 shadow-xl rounded-2xl">
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <UserPlus className="h-8 w-8 text-blue-600" />
              </div>
              <CardTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                Get Started Free
              </CardTitle>
              <CardDescription className="text-gray-600">
                Start your AI-powered learning journey today
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {message.content && (
                <Alert className={`border-l-4 ${
                  message.type === "error" 
                    ? "border-l-red-500 bg-red-50" 
                    : "border-l-green-500 bg-green-50"
                }`}>
                  {message.type === "success" && (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  )}
                  <AlertDescription className={
                    message.type === "error" ? "text-red-700" : "text-green-700"
                  }>
                    {message.content}
                  </AlertDescription>
                </Alert>
              )}

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-gray-700">Full Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter your full name"
                            {...field}
                            disabled={isLoading}
                            className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
                          />
                        </FormControl>
                        <FormMessage className="text-red-500 text-xs" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-gray-700">Email</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="Enter your email"
                            {...field}
                            disabled={isLoading}
                            className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
                          />
                        </FormControl>
                        <FormMessage className="text-red-500 text-xs" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-gray-700">Username</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Choose a username"
                            {...field}
                            disabled={isLoading}
                            className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
                          />
                        </FormControl>
                        <FormMessage className="text-red-500 text-xs" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-gray-700">Password</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="Create a password"
                            {...field}
                            disabled={isLoading}
                            className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
                          />
                        </FormControl>
                        <FormMessage className="text-red-500 text-xs" />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-lg transition-all duration-300 hover:shadow-lg"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Creating account...
                      </>
                    ) : (
                      <>
                        Create account
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </>
                    )}
                  </Button>
                </form>
              </Form>

              {/* Features list */}
              <div className="pt-4 border-t border-gray-100">
                <p className="text-xs text-gray-500 mb-3 text-center">What you'll get:</p>
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-600">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                    <span>AI-powered test generation</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                    <span>Smart syllabus management</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                    <span>Performance analytics</span>
                  </div>
                </div>
              </div>

              <div className="text-center pt-4 border-t border-gray-100">
                <p className="text-sm text-gray-600">
                  Already have an account?{" "}
                  <Link
                    href="/login"
                    className="font-medium text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    Sign in here
                  </Link>
                </p>
              </div>

              <div className="text-center">
                <p className="text-xs text-gray-500">
                  By creating an account, you agree to our{" "}
                  <Link href="#" className="text-blue-600 hover:underline">Terms of Service</Link>
                  {" "}and{" "}
                  <Link href="#" className="text-blue-600 hover:underline">Privacy Policy</Link>
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
