"use client";
import Logo from "@/components/Logo/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRegisterUserMutation } from "@/redux/features/auth/authApi";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";

type RegisterFormInputs = {
  fullName: string;
  email: string;
  password: string;
};

const Register = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormInputs>();
  const router = useRouter();

  const [userRegistration, { isLoading, isSuccess, data, error, isError }] =
    useRegisterUserMutation();

  useEffect(() => {
    if (isSuccess) {
      const message = data.message || "Account created successfully";
      toast.success(message);
    }
    if (isError && error) {
      if ("data" in error) {
        const message =
          (error.data as any)?.detail ||
          "something wrong happening during the registration process";
        toast.error(message);
      } else {
        toast.error(
          "something wrong happening during the registration process"
        );
      }
    }
  });

  const onSubmit: SubmitHandler<RegisterFormInputs> = async (data) => {
    await userRegistration(data).unwrap();
  };

  return (
    <div
      className="background flex items-center justify-center
  min-h-screen overflow-auto p-4 sm:p-6 lg:p-8"
    >
      <div className="w-full max-w-sm p-6 bg-card rounded-md shadow-md overflow-auto ">
        <div className="flex items-center justify-center">
          <Logo />
        </div>
        <h2 className="text-2xl font-semibold text-center text-primary mb-2">
          Create Your Account
        </h2>
        <p className="text-sm text-center text-gray-500 mb-8">
          Join Debate ai and start your journey
        </p>
        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="space-y-2"
        >
          <div>
            <Label
              htmlFor="email"
              className="block text-sm font-medium text-gray-600 mb-1"
            >
              Full Name
            </Label>
            <div className="p-[1px] rounded-md bg-gradient-to-r from-[#0575E6] to-[#00F260]">
              <Input
                {...register("fullName", {
                  required: "Full Name is required",
                })}
                type="text"
                id="fullName"
                name="fullName"
                className="w-ful px-3 py-2 rounded-md bg-white transition-all duration-300 outline-none border-0"
                required
              />
            </div>

            {errors.fullName && (
              <p className="text-red-500 text-xs mt-1">
                {errors.fullName.message}
              </p>
            )}
          </div>
          <div>
            <Label
              htmlFor="email"
              className="block text-sm font-medium text-gray-600 mb-1"
            >
              Email
            </Label>
            <div className="p-[1px] rounded-md bg-gradient-to-r from-[#0575E6] to-[#00F260]">
              <Input
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^\S+@\S+\.\S+$/,
                    message: "Invalid email address",
                  },
                })}
                type="email"
                id="email"
                name="email"
                className="w-ful px-3 py-2 rounded-md bg-white transition-all duration-300 outline-none border-0"
                required
              />
            </div>
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <Label
              htmlFor="password"
              className="block text-sm font-medium text-gray-600 mb-1"
            >
              Password
            </Label>
            <div className="p-[1px] rounded-md bg-gradient-to-r from-[#0575E6] to-[#00F260]">
              <Input
                {...register("password", {
                  required: "Password is required",
                  pattern: {
                    value: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
                    message:
                      "Password must be at least 8 characters long and contain at least one letter and one number",
                  },
                })}
                type="password"
                id="password"
                name="password"
                className="w-ful px-3 py-2 rounded-md bg-white transition-all duration-300 outline-none border-0"
                required
              />
            </div>

            {errors.password && (
              <p className="text-red-500 text-xs mt-1">
                {errors.password.message}
              </p>
            )}
          </div>
          <Button
            disabled={isLoading ? true : false}
            type="submit"
            className="w-full cursor-pointer py-2 px-4 auth-button rounded-md hover:bg-background/90 transition-all duration-150"
          >
            {isLoading ? "Loading..." : "Register"}
          </Button>
        </form>
        <p className="mt-4 text-sm text-center text-gray-500">
          Already have account?{" "}
          <Link href="/login" className="text-primary hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
