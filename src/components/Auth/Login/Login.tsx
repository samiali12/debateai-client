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
    <div
      className="background flex items-center justify-center
  min-h-screen overflow-auto p-4 sm:p-6 lg:p-8"
    >
      <div className="w-full max-w-sm p-6 bg-card rounded-md shadow-md  overflow-auto ">
        <div className="flex items-center justify-center">
          <Logo />
        </div>
        <h2 className="text-2xl font-semibold text-center text-primary mb-2">
          Welcome Back
        </h2>
        <p className="text-sm text-center text-gray-500 mb-8">
          Log in to access your account
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
          <div className="text-right">
            <Link
              href="/forget-password"
              className="text-primary font-normal text-sm hover:underline text-right underline"
            >
              Forgot Password ?
            </Link>
          </div>
          <Button
            type="submit"
            disabled={isLoading ? true : false}
            className="w-full cursor-pointer py-2 px-4 auth-button rounded-md hover:bg-background/90 transition-all duration-150"
          >
            {isLoading ? "Login ..." : "Login"}
          </Button>
        </form>
        <p className="mt-4 text-sm text-center text-gray-500">
          Don’t have an account?{" "}
          <Link href="/register" className="text-primary hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
