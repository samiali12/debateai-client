"use client";

import { useGetDebatesQuery } from "@/redux/features/debates/debateApi";
import React, { useState } from "react";
import { Loader, Loader2 } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import NewDebate from "./NewDebate";
import { DebateType } from "@/types/Debates";
import { useDebateContext } from "@/context/DebateContext";
import { useRouter } from "next/navigation";
import Link from "next/link";

const DebatesSidebar = () => {
  const router = useRouter();
  const [isMobile, setIsMobile] = useState(false);
  const { data, isLoading, refetch } = useGetDebatesQuery();
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const { setDebate } = useDebateContext();

  const filteredDebates =
    data?.data?.filter((debate) =>
      debate.title.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

  const handleDebateClick = (debate: DebateType) => {
    setDebate(debate as unknown as any);
    router.push(`/debates/${debate.id}`);
  };

  return (
    <div
      className={`
        border-r
        border-white/10
        z-[40]
        px-4
        bg-gradient-to-b from-[#3E1E68] via-[#2a1447] to-[#1a0c2e]
        fixed md:relative
        top-0 left-0
        h-full
        transition-all duration-300 ease-in-out
        ${isMobile ? "translate-x-0 w-72" : "-translate-x-full w-0"}
        md:translate-x-0 md:w-80
      `}
    >
      <div className="flex items-center justify-between px-2 py-4">
        <Link href="/" className="text-lg font-semibold">Debates</Link>
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
        <div className="">
          <Input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search chats..."
            className="w-full px-4 py-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E45A92] focus:border-transparent transition-all duration-300"
          />
        </div>

        <Button
          variant="default"
          size="sm"
          onClick={() => setIsCreating(true)}
          className="w-full mt-4 py-3 px-4 bg-gradient-to-r from-[#E45A92] to-[#FFACAC] rounded-xl text-white font-semibold shadow-lg shadow-[#E45A92]/50 hover:shadow-xl hover:shadow-[#E45A92]/70 transition-all duration-300 hover:scale-105 disabled:opacity-70 disabled:scale-100 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          Create New Debate
        </Button>
      </div>

      <div className="space-y-1 overflow-y-auto h-[calc(100%-120px)] pr-2">
        {isLoading ? (
          <div className="h-full flex items-center justify-center">
            <Loader2 className=" animate-spin text-[#E45A92]" />
          </div>
        ) : filteredDebates.length > 0 ? (
          <div className="flex flex-col gap-2">
            {data?.data.map((debate, _) => (
              <div
                onClick={() => handleDebateClick(debate)}
                className="bg-white/5 backdrop-blur-sm rounded-2xl px-6 py-4 border border-white/10 hover:border-[#E45A92]/50 transition-all duration-300 cursor-pointer"
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

      {isCreating && (
        <NewDebate
          open={isCreating}
          onOpenChange={setIsCreating}
          refetch={refetch}
        />
      )}
    </div>
  );
};

export default DebatesSidebar;
