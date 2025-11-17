"use client";

import { Montserrat } from "next/font/google";
import "./globals.css";
import { FC } from "react";
import { ToastContainer } from "react-toastify";
import { useLoadUserQuery } from "@/redux/api/apiSlice";
import UnifiedProvider from "./UnifiedProvider";
import { Loader, Loader2 } from "lucide-react";

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
        <UnifiedProvider>
          <CustomLoader>
            {children}
            <ToastContainer />
          </CustomLoader>
        </UnifiedProvider>
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
        <div className="relative min-h-screen bg-gradient-to-b from-[#3E1E68] via-[#2a1447] to-[#1a0c2e] flex items-center justify-center overflow-auto p-4 sm:p-6 lg:p-8">
          <div className="animate-spin">
            <Loader2 className="h-12 w-12 animate-spin text-[#E45A92]" />
          </div>
        </div>
      ) : (
        <>{children}</>
      )}
    </>
  );
};
