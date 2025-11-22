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
          type: "ai_moderator",
          toxicity_score: msg.toxicity_score ?? 0,
          civility_score: msg.civility_score ?? 1,
          flag: msg.flag ?? null,
          temp_id: crypto.randomUUID(),
          relevance_score: 0,
          consistency_score: 0,
          evidence_score: 0,
          overall_strength: 0,
        };

        setMessages((prev) => [...prev, moderatorMessage]);
      }
      if (msg.type === "credibility_score") {
        setMessages((prev) => {
          const updated = prev.map((m) => {
            if (m.temp_id === msg.temp_id) {
              const updatedMsg = {
                ...m,
                type: "sender",
                relevance_score: msg.relevance_score ?? m.relevance_score,
                consistency_score: msg.consistency_score ?? m.consistency_score,
                evidence_score: msg.evidence_score ?? m.evidence_score,
                overall_strength: msg.overall_strength ?? m.overall_strength,
              };
              return updatedMsg;
            }

            return m;
          });
          return updated;
        });
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
          relevance_score: 0,
          consistency_score: 0,
          evidence_score: 0,
          overall_strength: 0,
        };
        setMessages((prev) => [...prev, systemMessage]);
      }
    } catch (e) {
      console.error("Error fetching suggested question:", e);
    }
  };

  return (
    <div className="flex flex-col h-full min-h-0 w-full relative">
      <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0">
        {messages.map((msg, i) => {
          const isModerator = msg.type === "ai_moderator";
          const isSystem = msg.type === "system";
          const isSender = Number(msg.user_id) === user?.id;
          const isNewMessage = i === messages.length - 1;

          if (isSystem) {
            return (
              <div
                key={i}
                className="flex justify-center animate-in fade-in-50 slide-in-from-bottom-5 duration-500"
              >
                <div className="bg-yellow-500/20 text-yellow-200 my-6 p-4 rounded-2xl max-w-[70%] text-sm border border-yellow-300/20 backdrop-blur-sm shadow-lg hover:shadow-yellow-500/10 transition-all duration-300 hover:scale-[1.02]">
                  <div className="font-semibold text-center flex items-center justify-center gap-2">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full animate-ping"></div>
                    System Message
                  </div>
                  <div className="mt-1 text-center">{msg.content}</div>
                </div>
              </div>
            );
          }

          if (isModerator) {
            return (
              <div
                key={i}
                className="flex justify-center animate-in fade-in-50 slide-in-from-bottom-5 duration-500"
              >
                <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-200 p-4 rounded-2xl max-w-[70%] text-sm border border-blue-300/20 backdrop-blur-sm shadow-lg hover:shadow-blue-500/10 transition-all duration-300 hover:scale-[1.02]">
                  <div className="font-semibold text-center flex items-center justify-center gap-2 mb-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                    AI Moderator
                  </div>

                  {msg.toxicity_label && (
                    <div className="mt-2 p-2 bg-red-500/10 rounded-lg border border-red-500/20">
                      🧪 Toxicity: {msg.toxicity_label}
                    </div>
                  )}

                  {msg.fairness_warning && (
                    <div className="mt-2 p-2 bg-orange-500/10 rounded-lg border border-orange-500/20">
                      ⚖️ {msg.fairness_warning}
                    </div>
                  )}

                  {msg.content && (
                    <div className="mt-3 p-3 bg-white/5 rounded-lg border border-white/10">
                      {msg.content}
                    </div>
                  )}

                  <div className="text-xs text-gray-300 mt-2 text-center">
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
              className={`flex ${
                isSender ? "justify-end" : "justify-start"
              } animate-in fade-in-50 slide-in-from-bottom-5 duration-500 ${
                isNewMessage ? "animate-bounce-in" : ""
              }`}
            >
              <div className="flex flex-col max-w-[75%] gap-1 group">
                {!isSender && (
                  <div className="flex items-center gap-2 text-xs animate-in fade-in-50 duration-300">
                    <span className="font-medium text-gray-300 bg-white/5 px-3 py-1 rounded-full backdrop-blur-sm">
                      {msg.fullName || "Anonymous"}
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide transition-all duration-300 backdrop-blur-sm
            ${
              msg.role === "for_side"
                ? "bg-gradient-to-r from-green-500/30 to-emerald-500/30 text-green-300 border border-green-500/30 hover:shadow-green-500/20 hover:shadow-lg"
                : msg.role === "against_side"
                ? "bg-gradient-to-r from-red-500/30 to-pink-500/30 text-red-300 border border-red-500/30 hover:shadow-red-500/20 hover:shadow-lg"
                : "bg-gradient-to-r from-blue-500/30 to-cyan-500/30 text-blue-300 border border-blue-500/30 hover:shadow-blue-500/20 hover:shadow-lg"
            }
          `}
                    >
                      {msg.role.replace("_", " ")}
                    </span>
                  </div>
                )}

                <div
                  className={`p-4 rounded-2xl text-sm shadow-2xl backdrop-blur-sm border transition-all duration-300 group-hover:scale-[1.02] group-hover:shadow-xl
                    ${
                      isSender
                        ? "bg-gradient-to-br from-[#E45A92] to-[#FF6B9C] text-white rounded-br-none border-pink-400/30 shadow-pink-500/20 hover:shadow-pink-500/30"
                        : "bg-gradient-to-br from-white/10 to-white/5 text-slate-300 rounded-bl-none border-white/20 shadow-white/5 hover:shadow-white/10"
                    }`}
                >
                  {msg.content}
                </div>

                {/* Timestamp */}
                <div className="flex items-center gap-3 ml-1">
                  <span className="text-xs text-gray-400 transition-opacity duration-300 group-hover:opacity-100 opacity-70">
                    {new Date(msg.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>

                  <div className="flex items-center gap-3 text-xs transition-opacity duration-300 group-hover:opacity-100 opacity-70">
                    <span className="text-green-300 font-medium flex items-center gap-1">
                      <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                      {(msg.civility_score * 100).toFixed(1)}%
                    </span>
                    {msg.flag == "toxic" ? (
                      <span className="text-red-400 font-medium flex items-center gap-1">
                        <div className="w-1.5 h-1.5 bg-red-400 rounded-full animate-pulse"></div>
                        {(msg.toxicity_score * 100).toFixed(1)}%
                      </span>
                    ) : (
                      <span className="text-gray-400 flex items-center gap-1">
                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                        {(msg.toxicity_score * 100).toFixed(1)}%
                      </span>
                    )}

                    {msg.overall_strength !== undefined && (
                      <span className="text-blue-300 font-semibold flex items-center gap-1">
                        <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                        {msg.overall_strength?.toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>

                {msg.overall_strength !== undefined && (
                  <div className="opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0">
                    <div className="flex items-center gap-4 text-[10px] text-blue-300 bg-blue-500/10 p-2 rounded-lg border border-blue-500/20 backdrop-blur-sm mt-1">
                      <span>Rel: {msg.relevance_score?.toFixed(2)}</span>
                      <span>Con: {msg.consistency_score?.toFixed(2)}</span>
                      <span>Evid: {msg.evidence_score?.toFixed(2)}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* 👇 Conditional message input or waiting notice */}
      <div className="shrink-0 mt-auto p-4 z-10">
        {debate?.status === "pending" ? (
          <div className="text-center text-sm text-gray-300">
            Debate hasn’t started yet. You’ll be able to send arguments once it
            begins.
          </div>
        ) : debate.status === "completed" ? (
          <div className="text-center text-sm text-gray-300">
            Debate has ended. You can no longer send arguments.
          </div>
        ) : (
          <form onSubmit={sendMessage} className="flex items-center gap-2">
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
              className="bg-gradient-to-r from-[#E45A92] to-[#FFACAC] text-white rounded-full px-4 py-2 font-semibold shadow-md shadow-[#E45A92]/50 hover:shadow-md hover:shadow-[#E45A92]/70 transition-all duration-300 hover:scale-105 disabled:opacity-70"
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
