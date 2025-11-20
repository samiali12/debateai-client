"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Send } from "lucide-react";
import { useDebateContext } from "@/context/DebateContext";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { ArgumentType } from "@/types/Arguments";
import { useGetAllArgumentsQuery } from "@/redux/features/arguments/argumentsApi";
import { useGetParticipantsListQuery } from "@/redux/features/debates/debateApi";
import axios from "axios";
import { ARGUMENTS_THRESHOLD } from "@/constant/constant";

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
  const lastSuggestedIndex = useRef(0);

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
      temp_id: crypto.randomUUID(),
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
    const argumentMessages = messages.filter((m) => m.type === "argument");
    if (
      argumentMessages.length - lastSuggestedIndex.current >=
      ARGUMENTS_THRESHOLD
    ) {
      fetchSuggestedQuestion(
        argumentMessages[argumentMessages.length - 1].content
      );
    }
    lastSuggestedIndex.current = argumentMessages.length;
  }, [messages]);

  useEffect(() => {
    if (!socket) return;
    socket.onmessage = async (event) => {
      const msg = JSON.parse(event.data);
      if (msg.type === "argument") {
        setMessages((prev) => [...prev, msg]);
      }
      if (msg.type === "civility_analysis") {
        setMessages((prev) =>
          prev.map((m) =>
            m.temp_id === msg.temp_id
              ? {
                  ...m,
                  civility_score: msg.civility_score,
                  toxicity_score: msg.toxicity_score,
                  flag: msg.flag,
                }
              : m
          )
        );
      }
      if (msg.type === "ai_moderator") {
        const moderatorMessage: ArgumentType = {
          debate_ai: true,
          debate_id: debate?.id || 0,
          user_id: 0,
          role: "moderator",
          fullName: "AI Moderator",
          content: msg.follow_up_question || "Moderator feedback received.",
          fairness_warning: msg.fairness_warning,
          toxicity_label: msg.toxicity_label,
          timestamp: new Date(),
          type: "moderator", // custom type
          toxicity_score: msg.toxicity_score ?? 0,
          civility_score: msg.civility_score ?? 1,
          flag: msg.flag ?? null,
          temp_id: crypto.randomUUID(),
        };

        setMessages((prev) => [...prev, moderatorMessage]);
      }
    };
  }, [socket]);

  const fetchSuggestedQuestion = async (msg: string) => {
    try {
      const history = messages
        .filter((m) => m.type === "argument")
        .map((m) => m.content);
      const res = await axios(
        `${process.env.NEXT_PUBLIC_API_URL}/ai-moderator/suggest-question`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          data: {
            topic: debate?.title,
            history: [...history, msg],
          },
        }
      );
      const data = await res.data?.data;
      if (data?.suggestion) {
        const systemMessage: ArgumentType = {
          debate_ai: false,
          debate_id: debate?.id || 0,
          user_id: 0,
          role: "system",
          fullName: "System",
          content: `💡 Suggested question: ${data.suggestion}`,
          timestamp: new Date(),
          type: "system",
          toxicity_score: 0,
          civility_score: 1,
          fairness_warning: false,
          toxicity_label: "",
          flag: "",
          temp_id: crypto.randomUUID(),
        };
        setMessages((prev) => [...prev, systemMessage]);
      }
    } catch (e) {
      console.error("Error fetching suggested question:", e);
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="flex-1 overflow-y-auto p-4 space-y-3 pb-[72px]">
        {messages.map((msg, i) => {
          const isModerator = msg.type === "ai_moderator";
          const isSystem = msg.type === "system";
          const isSender = Number(msg.user_id) === user?.id;

          if (isSystem) {
            return (
              <div key={i} className="flex justify-center">
                <div className="bg-yellow-500/20 text-yellow-200 p-3 rounded-xl max-w-[70%] text-xs border border-yellow-300/20 backdrop-blur-sm shadow">
                  <div className="font-semibold text-center">
                    System Message
                  </div>
                  <div className="mt-1">{msg.content}</div>
                </div>
              </div>
            );
          }

          if (isModerator) {
            return (
              <div key={i} className="flex justify-center">
                <div className="bg-blue-500/20 text-blue-200 p-3 rounded-xl max-w-[70%] text-xs border border-blue-300/20 backdrop-blur-sm shadow">
                  <div className="font-semibold text-center">AI Moderator</div>

                  {msg.toxicity_label && (
                    <div className="mt-1">
                      🧪 Toxicity: {msg.toxicity_label}
                    </div>
                  )}

                  {msg.fairness_warning && (
                    <div className="mt-1">⚖️ {msg.fairness_warning}</div>
                  )}

                  <div className="text-[9px] text-gray-300 mt-1 text-center">
                    {new Date(msg.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
              </div>
            );
          }

          return (
            <div
              key={i}
              className={`flex ${isSender ? "justify-end" : "justify-start"}`}
            >
              <div className="flex flex-col max-w-[75%] gap-1">
                {!isSender && (
                  <div className="flex items-center gap-2 text-xs ">
                    <span className="font-medium text-gray-300">
                      {msg.fullName || "Anonymous"}
                    </span>
                    <span
                      className={`px-2 py-[2px] rounded text-[10px] uppercase tracking-wide 
            ${
              msg.role === "for_side"
                ? "bg-green-500/20 text-green-300"
                : msg.role === "against_side"
                ? "bg-red-500/20 text-red-300"
                : "bg-blue-500/20 text-blue-300"
            }
          `}
                    >
                      {msg.role}
                    </span>
                  </div>
                )}

                <div
                  className={`p-3 rounded-2xl text-sm shadow-lg backdrop-blur-sm border ${
                    isSender
                      ? "bg-[#E45A92] text-white rounded-br-none border-white/20"
                      : "bg-white/5 text-slate-300 rounded-bl-none border-white/10"
                  }`}
                >
                  {msg.content}
                </div>

                {/* Timestamp */}
                <span className="text-[10px] text-gray-400 ml-1">
                  {new Date(msg.timestamp).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>

                <div className="text-[10px] flex items-center gap-3 mt-[2px] ml-1">
                  <span className="text-green-300 font-medium">
                    Civility: {(msg.civility_score * 100).toFixed(1)}%
                  </span>
                  {msg.flag == "toxic" ? (
                    <span className="text-red-400 font-medium">
                      Toxicity: {(msg.toxicity_score * 100).toFixed(1)}%
                    </span>
                  ) : (
                    <span className="text-gray-400">
                      Toxicity: {(msg.toxicity_score * 100).toFixed(1)}%
                    </span>
                  )}
                </div>
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
        ) : debate.status === "completed" ? (
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
