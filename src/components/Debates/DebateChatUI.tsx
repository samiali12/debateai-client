"use client";

import React, { FormEvent, useEffect, useRef, useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Send } from "lucide-react";
import { useDebateContext } from "@/context/DebateContext";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { ArgumentType } from "@/types/Arguments";
import { useGetAllArgumentsQuery } from "@/redux/features/arguments/argumentsApi";

interface DebateChatUIProps {
  socket: WebSocket | null;
}

const DebateChatUI = ({ socket }: DebateChatUIProps) => {
  const [messages, setMessages] = useState<ArgumentType[]>([]);
  const [content, setContent] = useState("");
  const { debate } = useDebateContext();
  const user = useSelector((state: RootState) => state.auth.user);

  const { data, isSuccess } = useGetAllArgumentsQuery(
    { debate_id: debate?.id },
    { skip: !debate?.id }
  );

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const sendMessage = (e: FormEvent) => {
    e.preventDefault();
    if (content.trim() === "") return;
    const message = {
      type: "argument",
      debate_id: debate.id,
      user_id: user?.id,
      role: "for_side",
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
                  <div className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                    <span className="font-medium text-gray-600">
                      {msg.fullName || "Anonymous"}
                    </span>
                    <span className="text-[10px] bg-gray-200 px-1.5 py-[1px] rounded">
                      {msg.role}
                    </span>
                  </div>
                )}
                <div
                  className={`p-3 rounded-2xl shadow-sm text-sm transition-all duration-200 ${
                    isSender
                      ? "background text-white rounded-br-none"
                      : "bg-gray-100 text-slate-900 rounded-bl-none"
                  }`}
                >
                  {msg.content}
                </div>
                <span className="text-[10px] text-gray-400 mt-1">
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
        {debate?.status !== "active" ? (
          <div className="p-3 text-center text-sm text-gray-500 bg-white border-t">
            Debate hasn’t started yet. You’ll be able to send arguments once it begins.
          </div>
        ) : (
          <form
            onSubmit={sendMessage}
            className="flex items-center gap-2 p-3 bg-white"
          >
            <div className="flex-1 p-[1px] rounded-md bg-gradient-to-r from-[#0575E6] to-[#00F260]">
              <Input
                type="text"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Type your argument..."
                className="flex-1 w-full bg-white border rounded-lg px-4 py-2 focus:outline-none"
              />
            </div>
            <Button
              type="submit"
              className="text-white rounded-full px-4 py-2 background"
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
