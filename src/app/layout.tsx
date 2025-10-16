"use client";

import { Montserrat } from "next/font/google";
import "./globals.css";
import StoreProvider from "./StoreProvider";
import { FC } from "react";
import { ToastContainer } from "react-toastify";
import { useLoadUserQuery } from "@/redux/api/apiSlice";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-montserrat",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${montserrat.className} antialiased`}>
        <StoreProvider>
          {children}
          <ToastContainer />
        </StoreProvider>
      </body>
    </html>
  );
}

interface CustomLoaderProps {
  children: React.ReactNode;
}

const CustomLoader: FC<CustomLoaderProps> = ({
  children,
}: CustomLoaderProps) => {
  const { isLoading } = useLoadUserQuery(undefined);

  return (
    <>
      {isLoading ? (
        <div className="h-screen flex items-center justify-center">
          <div className="loader"></div>
        </div>
      ) : (
        <>{children}</>
      )}
    </>
  );
};
