import Login from "@/components/Auth/Login/Login";
import React from "react";

export const metadata = {
  title: "Login to Debateai | Access Your Account",
  description: "Login to your Debateai account to perform actions",
};

const LoginPage = () => {
  return (
    <>
      <Login />
    </>
  );
};

export default LoginPage;
