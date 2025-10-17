"use client";

import { MessageSquare } from "lucide-react";

const DebatePage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-8">
      <MessageSquare className="w-16 h-16 text-muted-foreground mb-4" />
      <h2 className="text-2xl font-semibold mb-2">No Debate Selected</h2>
      <p className="text-muted-foreground max-w-md mb-6">
        Choose a debate from the sidebar or create a new one to get started.
      </p>
    </div>
  );
};

export default DebatePage;
