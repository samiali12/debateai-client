"use client";

import { Button } from "@/components/ui/button";
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import Link from "next/link";
import { CircleCheckBigIcon } from "lucide-react";
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
    <div className="relative min-h-screen bg-gradient-to-b from-[#3E1E68] via-[#2a1447] to-[#1a0c2e] flex items-center justify-center overflow-auto p-4 sm:p-6 lg:p-8">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-[#E45A92] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#FFACAC] rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-pulse delay-1000"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10 shadow-2xl">
          <div className="flex justify-center">
            <Logo />
          </div>
          <div className="px-8">
            {isSubmitted ? (
              <div className="text-center space-y-4">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full">
                  <CircleCheckBigIcon className="h-8 w-8 text-white" />
                </div>
                <h1 className="text-2xl font-bold  bg-gradient-to-r from-white to-[#FFACAC] bg-clip-text text-transparent">
                  Password Reset Email Sent
                </h1>
                <p className="text-gray-300 text-sm">
                  We&apos;ve sent instructions to reset your password to your
                  email address. Please check your inbox and follow the
                  instructions.
                </p>
                <Button
                  asChild
                  className="w-full py-3 px-4 bg-gradient-to-r from-[#E45A92] to-[#FFACAC] rounded-xl text-white font-semibold shadow-lg shadow-[#E45A92]/50 hover:shadow-xl hover:shadow-[#E45A92]/70 transition-all duration-300 hover:scale-105 disabled:opacity-70 disabled:scale-100 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Link href="/auth/login">Return to Login</Link>
                </Button>
              </div>
            ) : (
              <>
                <div className="text-center">
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-[#FFACAC] bg-clip-text text-transparent mb-2">
                    Forgot Password
                  </h1>
                  <p className="text-center text-gray-300 mb-8">
                    Enter your email to receive a password reset link
                  </p>
                </div>

                <form
                  className="space-y-5"
                  noValidate
                  onSubmit={handleSubmit(onSubmit)}
                >
                  <div>
                    <Label
                      htmlFor="email"
                      className="block text-sm font-semibold text-gray-200 mb-2"
                    >
                      Email Address
                    </Label>
                    <div className="">
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
                        className="w-full px-4 py-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E45A92] focus:border-transparent transition-all duration-300"
                        disabled={isLoading}
                      />
                    </div>

                    {errors.email && (
                      <p className="text-secondary text-xs mt-2 font-medium">
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  <div className="mt-6">
                    <Button
                      disabled={isLoading}
                      type="submit"
                      className="w-full py-3 px-4 bg-gradient-to-r from-[#E45A92] to-[#FFACAC] rounded-xl text-white font-semibold shadow-lg shadow-[#E45A92]/50 hover:shadow-xl hover:shadow-[#E45A92]/70 transition-all duration-300 hover:scale-105 disabled:opacity-70 disabled:scale-100 disabled:cursor-not-allowed flex items-center justify-center gap-20"
                    >
                      {isLoading ? (
                        <>
                          Sending...
                        </>
                      ) : (
                        "Send Reset Link"
                      )}
                    </Button>
                  </div>
                </form>

                <div className="mt-6 relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/10"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white/5 text-gray-400">or</span>
                  </div>
                </div>

                <div className="mt-4 text-sm text-center text-card-foreground">
                  Remember your password?{" "}
                  <Link
                    href="/login"
                    className="text-card-foreground hover:underline font-semibold transition-colors"
                  >
                    Login
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgetPasswordPage;
