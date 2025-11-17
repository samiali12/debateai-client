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
            Create Your Account
          </h2>
          <p className="text-center text-gray-300 mb-8">
            Join Debate ai and start your journey
          </p>
          <form
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            className="space-y-5"
          >
            <div>
              <Label
                htmlFor="email"
                className="block text-sm font-semibold text-gray-200 mb-2"
              >
                Full Name
              </Label>
              <div className="">
                <Input
                  {...register("fullName", {
                    required: "Full Name is required",
                  })}
                  type="text"
                  id="fullName"
                  name="fullName"
                  className="w-full px-4 py-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E45A92] focus:border-transparent transition-all duration-300"
                  required
                />
              </div>

              {errors.fullName && (
                <p className="text-secondary text-xs mt-2 font-medium">
                  {errors.fullName.message}
                </p>
              )}
            </div>
            <div>
              <Label
                htmlFor="email"
                className="block text-sm font-semibold text-gray-200 mb-2"
              >
                Email
              </Label>
              <div className="">
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
                  className="w-full px-4 py-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E45A92] focus:border-transparent transition-all duration-300"
                  required
                />
              </div>
              {errors.email && (
                <p className="text-secondary text-xs mt-2 font-medium">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <Label
                htmlFor="password"
                className="block text-sm font-semibold text-gray-200 mb-2"
              >
                Password
              </Label>
              <div className="">
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
                  className="w-full px-4 py-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E45A92] focus:border-transparent transition-all duration-300"
                  required
                />
              </div>

              {errors.password && (
                <p className="text-secondary text-xs mt-2 font-medium">
                  {errors.password.message}
                </p>
              )}
            </div>
            <Button
              disabled={isLoading ? true : false}
              type="submit"
              className="w-full py-3 px-4 bg-gradient-to-r from-[#E45A92] to-[#FFACAC] rounded-xl text-white font-semibold shadow-lg shadow-[#E45A92]/50 hover:shadow-xl hover:shadow-[#E45A92]/70 transition-all duration-300 hover:scale-105 disabled:opacity-70 disabled:scale-100 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? "Loading..." : "Register"}
            </Button>
          </form>

          <div className="mt-6 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white/5 text-gray-400">or</span>
            </div>
          </div>

          <p className="mt-4 text-sm text-center text-card-foreground">
            Already have account?{" "}
            <Link
              href="/login"
              className="text-card-foreground hover:underline font-semibold transition-colors"
            >
              Login
            </Link>
          </p>

          <p className="mt-6 text-xs text-center text-gray-400">
            By logging in, you agree to our{" "}
            <a href="#" className="text-[#FFACAC] hover:underline">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="text-[#FFACAC] hover:underline">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
