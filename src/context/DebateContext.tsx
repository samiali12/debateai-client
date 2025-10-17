import { createContext, useContext, useState, type ReactNode } from "react";

interface Debate {
  id: number;
  title: string;
  description: string;
  status: "pending" | "active" | "completed" | "archived";
  created_by: number;
}

interface DebateContextType {
  debate: Debate;
  setDebate: React.Dispatch<React.SetStateAction<Debate>>;
}

const DebateContext = createContext<DebateContextType | null>(null);

export const DebateProvider = ({ children }: { children: ReactNode }) => {
  const [debate, setDebate] = useState<Debate>({
    id: 0,
    title: "",
    description: "",
    status: "active",
    created_by: 0,
  });
  return (
    <DebateContext.Provider value={{ debate, setDebate }}>
      {children}
    </DebateContext.Provider>
  );
};

export const useDebateContext = () => {
  const context = useContext(DebateContext);
  if (!context) {
    throw new Error("useDebateContext must be used within a DebateProvider");
  }
  return context;
};

export default DebateProvider;
