"use client";

import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useUpdateProfileMutation } from "@/redux/features/users/usersApi";
import { useChangePasswordMutation } from "@/redux/features/auth/authApi";
import { toast } from "react-toastify";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useForm, SubmitHandler } from "react-hook-form";

type ProfileFormInputs = {
    fullName: string;
    email: string;
};

type PasswordFormInputs = {
    oldPassword: string;
    newPassword: string;
};

const Profile = () => {
    const { user } = useSelector((state: any) => state.auth);
    const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();
    const [changePassword, { isLoading: isChangingPassword }] =
        useChangePasswordMutation();

    const {
        register: registerProfile,
        handleSubmit: handleSubmitProfile,
        setValue: setProfileValue,
        formState: { errors: profileErrors },
    } = useForm<ProfileFormInputs>();

    const {
        register: registerPassword,
        handleSubmit: handleSubmitPassword,
        reset: resetPasswordForm,
        formState: { errors: passwordErrors },
    } = useForm<PasswordFormInputs>();

    useEffect(() => {
        if (user) {
            setProfileValue("fullName", user.fullName || "");
            setProfileValue("email", user.email || "");
        }
    }, [user, setProfileValue]);

    const onUpdateProfile: SubmitHandler<ProfileFormInputs> = async (data) => {
        try {
            await updateProfile({ fullName: data.fullName }).unwrap();
            toast.success("Profile updated successfully");
        } catch (error: any) {
            toast.error(error?.data?.message || "Failed to update profile");
        }
    };

    const onChangePassword: SubmitHandler<PasswordFormInputs> = async (data) => {
        try {
            await changePassword({
                old_password: data.oldPassword,
                new_password: data.newPassword,
            }).unwrap();
            toast.success("Password changed successfully");
            resetPasswordForm();
        } catch (error: any) {
            toast.error(error?.data?.detail || "Failed to change password");
        }
    };

    if (!user) {
        return (
            <div className="text-center mt-10">
                Please log in to view your profile.
            </div>
        );
    }

    return (
        <div className="relative min-h-screen bg-gradient-to-b from-[#3E1E68] via-[#2a1447] to-[#1a0c2e] flex items-center justify-center overflow-auto p-4 sm:p-6 lg:p-8">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-10 w-72 h-72 bg-[#E45A92] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#FFACAC] rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-pulse delay-1000"></div>
            </div>

            <div className="w-full max-w-4xl relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Update Profile Section */}
                <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10 shadow-2xl">
                    <h2 className="text-2xl font-bold text-center bg-gradient-to-r from-white to-[#FFACAC] bg-clip-text text-transparent mb-6">
                        Update Profile
                    </h2>
                    <form
                        onSubmit={handleSubmitProfile(onUpdateProfile)}
                        className="space-y-5"
                    >
                        <div>
                            <Label
                                htmlFor="email"
                                className="block text-sm font-semibold text-gray-200 mb-2"
                            >
                                Email
                            </Label>
                            <Input
                                {...registerProfile("email")}
                                type="email"
                                id="email"
                                disabled
                                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-gray-400 cursor-not-allowed"
                            />
                            <p className="text-xs text-gray-500 mt-2">
                                Email cannot be changed.
                            </p>
                        </div>
                        <div>
                            <Label
                                htmlFor="fullName"
                                className="block text-sm font-semibold text-gray-200 mb-2"
                            >
                                Full Name
                            </Label>
                            <Input
                                {...registerProfile("fullName", {
                                    required: "Full Name is required",
                                })}
                                type="text"
                                id="fullName"
                                className="w-full px-4 py-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E45A92] focus:border-transparent transition-all duration-300"
                            />
                            {profileErrors.fullName && (
                                <p className="text-red-500 text-xs mt-2 font-medium">
                                    {profileErrors.fullName.message}
                                </p>
                            )}
                        </div>
                        <Button
                            type="submit"
                            disabled={isUpdating}
                            className="w-full py-3 px-4 bg-gradient-to-r from-[#E45A92] to-[#FFACAC] rounded-xl text-white font-semibold shadow-lg shadow-[#E45A92]/50 hover:shadow-xl hover:shadow-[#E45A92]/70 transition-all duration-300 hover:scale-105 disabled:opacity-70 disabled:scale-100 disabled:cursor-not-allowed"
                        >
                            {isUpdating ? "Updating..." : "Update Profile"}
                        </Button>
                    </form>
                </div>

                {/* Change Password Section */}
                <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10 shadow-2xl">
                    <h2 className="text-2xl font-bold text-center bg-gradient-to-r from-white to-[#FFACAC] bg-clip-text text-transparent mb-6">
                        Change Password
                    </h2>
                    <form
                        onSubmit={handleSubmitPassword(onChangePassword)}
                        className="space-y-5"
                    >
                        <div>
                            <Label
                                htmlFor="oldPassword"
                                className="block text-sm font-semibold text-gray-200 mb-2"
                            >
                                Old Password
                            </Label>
                            <Input
                                {...registerPassword("oldPassword", {
                                    required: "Old Password is required",
                                })}
                                type="password"
                                id="oldPassword"
                                className="w-full px-4 py-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E45A92] focus:border-transparent transition-all duration-300"
                            />
                            {passwordErrors.oldPassword && (
                                <p className="text-red-500 text-xs mt-2 font-medium">
                                    {passwordErrors.oldPassword.message}
                                </p>
                            )}
                        </div>
                        <div>
                            <Label
                                htmlFor="newPassword"
                                className="block text-sm font-semibold text-gray-200 mb-2"
                            >
                                New Password
                            </Label>
                            <Input
                                {...registerPassword("newPassword", {
                                    required: "New Password is required",
                                })}
                                type="password"
                                id="newPassword"
                                className="w-full px-4 py-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E45A92] focus:border-transparent transition-all duration-300"
                            />
                            {passwordErrors.newPassword && (
                                <p className="text-red-500 text-xs mt-2 font-medium">
                                    {passwordErrors.newPassword.message}
                                </p>
                            )}
                        </div>
                        <Button
                            type="submit"
                            disabled={isChangingPassword}
                            className="w-full py-3 px-4 bg-gradient-to-r from-red-500 to-red-400 rounded-xl text-white font-semibold shadow-lg shadow-red-500/50 hover:shadow-xl hover:shadow-red-500/70 transition-all duration-300 hover:scale-105 disabled:opacity-70 disabled:scale-100 disabled:cursor-not-allowed"
                        >
                            {isChangingPassword ? "Changing..." : "Change Password"}
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Profile;
