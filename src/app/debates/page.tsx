"use client";

import { MessageSquare } from "lucide-react";

const DebatePage = () => {
  return (
    <div className="bg-gradient-to-b from-[#3E1E68] via-[#2a1447] to-[#1a0c2e]
    flex flex-col items-center justify-center h-full text-center p-8">
      <MessageSquare className="w-16 h-16 text-muted-foreground mb-4" />
      <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-white to-[#FFACAC] bg-clip-text text-transparent mb-2">No Debate Selected</h2>
      <p className="text-center text-gray-300 max-w-md mb-6">
        Choose a debate from the sidebar or create a new one to get started.
      </p>
    </div>
  );
};

export default DebatePage;
