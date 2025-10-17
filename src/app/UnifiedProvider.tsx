import React from "react";
import StoreProvider from "./StoreProvider";
import DebateProvider from "@/context/DebateContext";

interface UnifiedProviderProps {
  children: React.ReactNode;
}

const UnifiedProvider: React.FC<UnifiedProviderProps> = ({ children }) => {
  return (
    <StoreProvider>
      <DebateProvider>{children}</DebateProvider>
    </StoreProvider>
  );
};

export default UnifiedProvider;
