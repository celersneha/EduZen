"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn, getSession } from "next-auth/react";
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
import { Loader2, CheckCircle } from "lucide-react";

const formSchema = z.object({
  identifier: z.string().min(1, "Email or username is required"),
  password: z.string().min(1, "Password is required"),
});

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", content: "" });
  const router = useRouter();
  const searchParams = useSearchParams();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  // Check for verification success message
  useState(() => {
    if (searchParams.get("verified") === "true") {
      setMessage({
        type: "success",
        content: "Email verified successfully! You can now sign in.",
      });
    }
  }, [searchParams]);

  const onSubmit = async (values) => {
    setIsLoading(true);
    setMessage({ type: "", content: "" });

    try {
      const result = await signIn("credentials", {
        identifier: values.identifier,
        password: values.password,
        redirect: false,
      });

      if (result?.error) {
        // Check if it's an UNVERIFIED_USER error
        if (result.error.startsWith("UNVERIFIED_USER:")) {
          const username = result.error.split(":")[1];
          setMessage({
            type: "info",
            content: "Please verify your email first. Redirecting to verification page...",
          });
          
          // Redirect to verification page with username
          setTimeout(() => {
            router.push(`/verify/${username}`);
          }, 2000);
        } else {
          setMessage({
            type: "error",
            content: result.error,
          });
        }
      } else if (result?.ok) {
        setMessage({
          type: "success",
          content: "Login successful! Redirecting...",
        });
        
        // Redirect to dashboard or home page
        setTimeout(() => {
          router.push("/dashboard");
        }, 1000);
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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Sign in to your account
          </CardTitle>
          <CardDescription className="text-center">
            Enter your credentials to access EduZen
          </CardDescription>
        </CardHeader>
        <CardContent>
          {message.content && (
            <Alert className={`mb-4 ${
              message.type === "error" 
                ? "border-red-500" 
                : message.type === "success" 
                ? "border-green-500" 
                : "border-blue-500"
            }`}>
              {message.type === "success" && (
                <CheckCircle className="h-4 w-4" />
              )}
              <AlertDescription className={
                message.type === "error" 
                  ? "text-red-700" 
                  : message.type === "success" 
                  ? "text-green-700" 
                  : "text-blue-700"
              }>
                {message.content}
              </AlertDescription>
            </Alert>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="identifier"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email or Username</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your email or username"
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Enter your password"
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign in"
                )}
              </Button>
            </form>
          </Form>

          <div className="mt-6 text-center text-sm">
            Don't have an account?{" "}
            <Link
              href="/register"
              className="font-medium text-primary hover:underline"
            >
              Create an account
            </Link>
          </div>

          <div className="mt-4 text-center text-sm">
            <Link
              href="/forgot-password"
              className="font-medium text-gray-600 hover:underline"
            >
              Forgot your password?
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
