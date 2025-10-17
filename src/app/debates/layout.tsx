import DebatesSidebar from "@/components/Debates/DebatesSidebar";
import React from "react";

interface DebateLayout {
  children: React.ReactNode;
}

const layout = ({ children }: DebateLayout) => {
  return (
    <div className="flex flex-col h-screen max-h-screen overflow-hidden">
      <div className="flex flex-1 min-h-0 overflow-hidden">
        <DebatesSidebar />
        <div className="flex-col flex-1 h-full overflow-hidden">
          <main className="h-full flex-1 overflow-auto">{children}</main>
        </div>
      </div>
    </div>
  );
};

export default layout;
