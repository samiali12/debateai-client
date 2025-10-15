"use client";

import { Button } from "@/components/ui/button";
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "react-toastify";
import axios from "axios";
import Logo from "@/components/Logo/Logo";

type FormInputs = {
  email: string;
};

const ForgetPasswordPage = () => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [isSubmitted, setIsSubmitted] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormInputs>();

  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    setIsLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:8000/auth/forgot-password",
        { email: data.email },
        { withCredentials: true }
      );
      if (response.status === 200) {
        toast.success(
          "Password reset link sent on your provided email address"
        );
      }

      setIsSubmitted(true);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="background flex items-center justify-center min-h-screen overflow-auto p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-lg p-6 bg-card rounded-md shadow-md overflow-auto">
        <div className="flex justify-center">
          <Logo />
        </div>
        <div className="bg-white px-8">
          {isSubmitted ? (
            <div className="text-center space-y-4">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full">
                <svg
                  className="h-6 w-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">
                Password Reset Email Sent
              </h1>
              <p className="text-gray-600">
                We&apos;ve sent instructions to reset your password to your
                email address. Please check your inbox and follow the
                instructions.
              </p>
              <Button
                asChild
                className="w-full cursor-pointer py-2 px-4 auth-button rounded-md hover:bg-background/90 transition-all duration-150"
              >
                <Link href="/auth/login">Return to Login</Link>
              </Button>
            </div>
          ) : (
            <>
              <div className="text-center">
                <h1 className="text-2xl font-semibold text-primary">
                  Forgot Password
                </h1>
                <p className="text-sm text-center text-gray-500 mb-8">
                  Enter your email to receive a password reset link
                </p>
              </div>

              <form
                className="mt-6 space-y-4"
                noValidate
                onSubmit={handleSubmit(onSubmit)}
              >
                <div>
                  <Label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-600 mb-1"
                  >
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value:
                          /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/i,
                        message: "Enter a valid email address",
                      },
                    })}
                    type="email"
                    placeholder="example@email.com"
                    className="w-full text-gray-700 px-4 py-2 rounded-md focus:outline-none transition-all"
                    disabled={isLoading}
                  />
                  {errors.email && (
                    <p className="text-primary pt-1 text-sm">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div className="mt-6">
                  <Button
                    disabled={isLoading}
                    type="submit"
                    className="w-full cursor-pointer py-2 px-4 auth-button rounded-md hover:bg-background/90 transition-all duration-150"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      "Send Reset Link"
                    )}
                  </Button>
                </div>
              </form>

              <div className="mt-4 text-center text-sm text-gray-500">
                Remember your password?{" "}
                <Link href="/login" className="text-primary hover:underline">
                  Login
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgetPasswordPage;
