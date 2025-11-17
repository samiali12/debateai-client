"use client";

import React, { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Send } from "lucide-react";
import { useDebateContext } from "@/context/DebateContext";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { ArgumentType } from "@/types/Arguments";
import { useGetAllArgumentsQuery } from "@/redux/features/arguments/argumentsApi";
import { useGetParticipantsListQuery } from "@/redux/features/debates/debateApi";

interface DebateChatUIProps {
  socket: WebSocket | null;
}

const DebateChatUI = ({ socket }: DebateChatUIProps) => {
  const [messages, setMessages] = useState<ArgumentType[]>([]);
  const [content, setContent] = useState("");
  const { debate } = useDebateContext();
  const user = useSelector((state: RootState) => state.auth.user);

  const { data: participantsData, isSuccess: isParticipantsLoaded } =
    useGetParticipantsListQuery({ debate_id: debate.id }, { skip: !debate.id });

  const { data, isSuccess } = useGetAllArgumentsQuery(
    { debate_id: debate?.id },
    { skip: !debate?.id }
  );

  const currentParticipant = useMemo(() => {
    if (!participantsData?.data || !user?.id) return null;
    return participantsData.data.find((p: any) => p.userId === user.id) ?? null;
  }, [participantsData, user]);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const sendMessage = (e: FormEvent) => {
    e.preventDefault();
    if (content.trim() === "") return;
    const message = {
      type: "argument",
      debate_id: debate.id,
      user_id: user?.id,
      role: currentParticipant?.role || "",
      content: content,
      fullName: user?.fullName,
      timestamp: new Date(),
    };
    socket?.send(JSON.stringify(message));
    setContent("");
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (isSuccess && data?.data) {
      setMessages(data.data);
    }
  }, [isSuccess, data]);

  useEffect(() => {
    if (!socket) return;
    socket.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.type === "argument") {
        setMessages((prev) => [...prev, msg]);
      }
    };
  }, [socket]);

  return (
    <div className="flex flex-col h-screen">
      <div className="flex-1 overflow-y-auto p-4 space-y-3 pb-[72px]">
        {messages.map((msg, i) => {
          const isSender = Number(msg.user_id) === user?.id;
          return (
            <div
              key={i}
              className={`flex ${isSender ? "justify-end" : "justify-start"}`}
            >
              <div className="flex flex-col max-w-[70%]">
                {!isSender && (
                  <div className="text-xs mb-1 flex items-center gap-1">
                    <span className="font-medium text-gray-300">
                      {msg.fullName || "Anonymous"}
                    </span>
                    <span className="text-[10px] text-gray-300 bg-white/10 px-1.5 py-[1px] rounded">
                      {msg.role}
                    </span>
                  </div>
                )}
                <div
                  className={`p-3 rounded-2xl shadow-sm text-sm transition-all duration-200 ${
                    isSender
                      ? "bg-[#E45A92] backdrop-blur-sm text-white rounded-br-none border border-white/10 shadow-2xl"
                      : "bg-white/5 backdrop-blur-sm text-slate-300 rounded-bl-none border border-white/10 shadow-2xl"
                  }`}
                >
                  {msg.content}
                </div>
                <span className="text-[10px] text-gray-300 mt-1">
                  {new Date(msg.timestamp).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* 👇 Conditional message input or waiting notice */}
      <div className="sticky bottom-0">
        {debate?.status === "pending" ? (
          <div className="p-3 text-center text-sm text-gray-300 border-t">
            Debate hasn’t started yet. You’ll be able to send arguments once it
            begins.
          </div>
        ) : ( debate.status === "completed") ? (
          <div className="p-3 text-center text-sm text-gray-300 border-t">
            Debate has ended. You can no longer send arguments.
          </div>
        ) : (
          <form onSubmit={sendMessage} className="flex items-center gap-2 p-3">
            <div className="flex-1 ">
              <Input
                type="text"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Type your argument..."
                className="flex-1 w-full px-4 py-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E45A92] focus:border-transparent transition-all duration-300"
              />
            </div>
            <Button
              type="submit"
              className="bg-gradient-to-r from-[#E45A92] to-[#FFACAC] text-white rounded-full px-4 py-2 font-semibold shadow-md shadow-[#E45A92]/50 hover:shadow-md hover:shadow-[#E45A92]/70 transition-all duration-300 hover:scale-105 disabled:opacity-70 "
            >
              <Send />
            </Button>
          </form>
        )}
      </div>
    </div>
  );
};

export default DebateChatUI;
