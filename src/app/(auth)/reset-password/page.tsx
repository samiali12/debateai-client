"use client";

import React from "react";
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

const ResetPasswordPage = () => {
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
    } catch (error) {
      const err = error as AxiosError;
      toast.error(
        err.response?.data?.message ||
          "An error occurred while resetting your password"
      );
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-secondary/30  overflow-auto p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-sm p-6 bg-card rounded-md shadow-md overflow-auto">
        <div className="flex justify-center">
          <Logo />
        </div>
        <h2 className="text-2xl font-semibold text-center text-primary mb-4">
          Reset Password
        </h2>
        <p className="text-sm text-center text-gray-500 mb-8">
          Enter your new password below
        </p>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mt-6 w-full space-y-6"
        >
          <div className="space-y-4">
            <div>
              <Label
                htmlFor="newPassword"
                className="mb-2 block text-sm font-medium text-gray-600"
              >
                New Password
              </Label>
              <Input
                id="newPassword"
                type="password"
                className={`w-full text-gray-700 ${
                  errors.newPassword ? "border-red-500" : "border-gray-300"
                }`}
                {...register("newPassword", {
                  required: "New password is required",
                  minLength: {
                    value: 8,
                    message: "Password must be at least 8 characters",
                  },
                  // pattern: {
                  //   value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                  //   message: "Password must contain at least one uppercase, one lowercase, one number and one special character"
                  // }
                })}
              />
              {errors.newPassword && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.newPassword.message}
                </p>
              )}
            </div>

            <div>
              <Label
                htmlFor="confirmNewPassword"
                className="mb-2 block text-sm font-medium text-gray-600"
              >
                Confirm New Password
              </Label>
              <Input
                id="confirmNewPassword"
                type="password"
                className={`w-full text-gray-700 ${
                  errors.confirmNewPassword
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
                {...register("confirmNewPassword", {
                  required: "Please confirm your new password",
                  validate: (value) =>
                    value === newPassword || "Passwords do not match",
                })}
              />
              {errors.confirmNewPassword && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.confirmNewPassword.message}
                </p>
              )}
            </div>
          </div>

          <Button
            type="submit"
            className="w-full cursor-pointer py-2 px-4 auth-button rounded-md hover:bg-background/90 transition-all duration-150"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Resetting..." : "Reset Password"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
