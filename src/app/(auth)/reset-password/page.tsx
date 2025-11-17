"use client";

import React, { Suspense } from "react";
import { useForm } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import axios, { AxiosError } from "axios";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import Logo from "@/components/Logo/Logo";

interface ChangePasswordProps {
  newPassword: string;
  confirmNewPassword: string;
}

const ResetPasswordForm = () => {
  const router = useRouter();
  const params = useSearchParams();
  const token = params.get("token");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ChangePasswordProps>({
    defaultValues: {
      newPassword: "",
      confirmNewPassword: "",
    },
    mode: "onBlur",
  });

  const newPassword = watch("newPassword");

  const onSubmit = async (data: ChangePasswordProps) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/reset-password`,
        { token, newPassword: data.newPassword }
      );

      if (response.status === 200) {
        router.replace("/login");
        toast.success("Password reset successfully");
      }
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        if ("data" in error) {
          toast.error(
            "Something wrong happening while resetting your password. "
          );
        } else {
          toast.error(
            "Something wrong happening while resetting your password. "
          );
        }
      }
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
          <div className="flex items-center justify-center">
            <Logo />
          </div>
          <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-white to-[#FFACAC] bg-clip-text text-transparent mb-2">
            Reset Password
          </h2>
          <p className="text-center text-gray-300 mb-8">
            Enter your new password below
          </p>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <Label
                htmlFor="newPassword"
                className="block text-sm font-semibold text-gray-200 mb-2"
              >
                New Password
              </Label>
              <div className="">
                <Input
                  id="newPassword"
                  type="password"
                  className={`w-full px-4 py-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E45A92] focus:border-transparent transition-all duration-300  ${
                    errors.newPassword
                      ? "text-secondary text-xs mt-2 font-medium"
                      : "outline-none border-0"
                  }`}
                  {...register("newPassword", {
                    required: "New password is required",
                    minLength: {
                      value: 8,
                      message: "Password must be at least 8 characters",
                    },
                    pattern: {
                      value:
                        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                      message:
                        "Password must contain at least one uppercase, one lowercase, one number and one special character",
                    },
                  })}
                />
              </div>

              {errors.newPassword && (
                <p className="text-secondary text-xs mt-2 font-medium">
                  {errors.newPassword.message}
                </p>
              )}
            </div>

            <div>
              <Label
                htmlFor="confirmNewPassword"
                className="block text-sm font-semibold text-gray-200 mb-2"
              >
                Confirm New Password
              </Label>
              <div
                className={`p-[1px] rounded-md ${
                  errors.newPassword
                    ? "text-secondary text-xs mt-2 font-medium"
                    : ""
                }`}
              >
                <Input
                  id="confirmNewPassword"
                  type="password"
                  className={`w-full px-4 py-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E45A92] focus:border-transparent transition-all duration-300  ${
                    errors.confirmNewPassword
                      ? "border-red-500"
                      : "outline-none border-0"
                  }`}
                  {...register("confirmNewPassword", {
                    required: "Please confirm your new password",
                    validate: (value) =>
                      value === newPassword || "Passwords do not match",
                  })}
                />
              </div>

              {errors.confirmNewPassword && (
                <p className="text-secondary text-xs mt-2 font-medium">
                  {errors.confirmNewPassword.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full py-3 px-4 bg-gradient-to-r from-[#E45A92] to-[#FFACAC] rounded-xl text-white font-semibold shadow-lg shadow-[#E45A92]/50 hover:shadow-xl hover:shadow-[#E45A92]/70 transition-all duration-300 hover:scale-105 disabled:opacity-70 disabled:scale-100 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Resetting..." : "Reset Password"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

const ResetPasswordPage = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <ResetPasswordForm />
  </Suspense>
);

export default ResetPasswordPage;
