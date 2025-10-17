"use client";

import React, { FormEvent, useEffect, useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Send } from "lucide-react";
import { useDebateContext } from "@/context/DebateContext";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

interface Message {
  type: string;
  debate_ai: string;
  user_id: string;
  role: string;
  content: string;
}

interface DebateChatUIProps {
  socket: WebSocket | null;
}

const DebateChatUI = ({ socket }: DebateChatUIProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [content, setContent] = useState("");
  const { debate } = useDebateContext();
  const user = useSelector((state: RootState) => state.auth.user);

  const sendMessage = (e: FormEvent) => {
    e.preventDefault();
    if (content.trim() === "") return;
    const message = {
      type: "argument",
      debate_id: debate.id,
      user_id: user?.id,
      role: "for_side",
      content: content,
    };
    socket?.send(JSON.stringify(message));
    setContent("");
  };

  useEffect(() => {
    if (!socket) {
      console.log("socket not ");
      return;
    }
    socket.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      console.log("data ==> ", msg);
      if (msg.type === "argument") {
        setMessages((prev) => [...prev, msg]);
      }
    };
  }, [socket]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg, i) => {
          const isSender = Number(msg.user_id) == user?.id;
          return (
            <div
              key={i}
              className={`flex my-2 ${
                isSender ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-xs p-3 rounded-lg  ${
                  isSender
                    ? "background text-white"
                    : "bg-gray-100 text-slate-900"
                }`}
              >
                {msg.content}
                <span className="text-xs"></span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="sticky bottom-0">
        <form
          onSubmit={sendMessage}
          className="flex items-center gap-2 p-3 bg-white"
        >
          <div className="flex-1  p-[1px] rounded-md bg-gradient-to-r from-[#0575E6] to-[#00F260]">
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
      </div>
    </div>
  );
};

export default DebateChatUI;
