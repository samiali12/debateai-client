"use client";

import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import Logo from "../../Logo/Logo";
import { Label } from "../../ui/label";
import { Input } from "../../ui/input";
import Link from "next/link";
import { Button } from "../../ui/button";
import { useLoggedInUserMutation } from "@/redux/features/auth/authApi";
import { toast } from "react-toastify";
import { EyeIcon, EyeOffIcon } from "lucide-react";

type LoginFormInputs = {
  email: string;
  password: string;
};

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>();
  const router = useRouter();

  const [showPassword, setShowPassword] = React.useState(false);

  const [loginUser, { isLoading, isError, error, isSuccess, data }] =
    useLoggedInUserMutation();

  useEffect(() => {
    if (isSuccess) {
      const message = data?.message || "User login";
      toast.success(message);
      router.push("/debates");
    }
    if (isError && error) {
      if ("data" in error) {
        const message = (error.data as any)?.detail || "Something went wrong";
        toast.error(message);
      } else {
        toast.error("Something went wrong");
      }
    }
  }, [isSuccess, isError, error]);

  const onSubmit: SubmitHandler<LoginFormInputs> = async (data) => {
    await loginUser(data).unwrap();
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
          <h1 className="text-3xl font-bold text-center bg-gradient-to-r from-white to-[#FFACAC] bg-clip-text text-transparent mb-2">
            Welcome Back
          </h1>
          <p className="text-center text-gray-300 mb-8">
            Log in to your debate platform
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

              <div className="relative">
                <Input
                  {...register("password", {
                    required: "Password is required",
                  })}
                  type={showPassword ? "text" : "password"}
                  id="password"
                  className="w-full px-4 py-3 pr-12 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E45A92] focus:border-transparent transition-all duration-300"
                  required
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-white transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOffIcon size={20} />
                  ) : (
                    <EyeIcon size={20} />
                  )}
                </button>
              </div>

              {errors.password && (
                <p className="text-secondary text-xs mt-2 font-medium">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="text-right">
              <Link
                href="/forget-password"
                className="text-secondary hover:text-white font-medium text-sm transition-colors"
              >
                Forgot Password ?
              </Link>
            </div>
            <Button
              type="submit"
              disabled={isLoading ? true : false}
              className="w-full py-3 px-4 bg-gradient-to-r from-[#E45A92] to-[#FFACAC] rounded-xl text-white font-semibold shadow-lg shadow-[#E45A92]/50 hover:shadow-xl hover:shadow-[#E45A92]/70 transition-all duration-300 hover:scale-105 disabled:opacity-70 disabled:scale-100 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? "Login ..." : "Login to debate"}
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
            Don’t have an account?{" "}
            <Link
              href="/register"
              className="text-card-foreground hover:underline font-semibold transition-colors"
            >
              Register
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

export default Login;
