"use client";

import { useGetDebatesQuery } from "@/redux/features/debates/debateApi";
import React, { useState } from "react";
import { Loader } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

const DebatesSidebar = () => {
  const [isMobile, setIsMobile] = useState(false);
  const { data, isLoading, isError, isSuccess, refetch } = useGetDebatesQuery();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredDebates =
    data?.data?.filter((debate) =>
      debate.title.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

  return (
    <div
      className={`
        px-4
        border-border border-r
          fixed md:relative
          top-0 left-0
          h-full bg-background z-[60]
          transition-all duration-300 ease-in-out
          ${isMobile ? "translate-x-0 w-72" : "-translate-x-full w-0"}
          md:translate-x-0 md:w-80
        `}
    >
      <div className="flex items-center justify-between px-2 py-4 border-b border-border">
        <h2 className="text-lg font-semibold">Debates</h2>
        <Button
          variant="default"
          size="icon"
          className="md:hidden"
          onClick={() => setIsMobile(false)}
        >
          ✕
        </Button>
      </div>

      <div className="mt-4 mb-4 hidden md:block">
        <Input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search chats..."
          className="w-full px-3 py-2 text-sm border rounded focus:outline-none focus:ring focus:ring-primary"
        />

        <Button className="background rounded-md w-full mt-4">
          Create New Debate
        </Button>
      </div>

      <div className="space-y-1 overflow-y-auto h-[calc(100%-120px)] p-2">
        {isLoading ? (
          <div className="h-full flex items-center justify-center">
            <Loader className="animate-spin" />
          </div>
        ) : filteredDebates.length > 0 ? (
          <div className="flex flex-col gap-2">
            {data?.data.map((debate, _) => (
              <div
                className="px-1 py-2 rounded-lg cursor-pointer hover:bg-muted transition"
                key={_}
              >
                <p className="font-medium text-sm">{debate.title}</p>
                <p className="text-xs text-muted-foreground truncate">
                  {debate.description || "No description"}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-sm text-muted-foreground py-8">
            No debates found.
          </div>
        )}
      </div>
    </div>
  );
};

export default DebatesSidebar;
