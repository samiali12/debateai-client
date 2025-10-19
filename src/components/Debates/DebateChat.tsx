"use client";
import React, { useEffect, useState, useMemo } from "react";
import DebateNavbar from "./DebateNavbar";
import {
  useGetDebateByIdQuery,
  useGetParticipantsListQuery,
} from "@/redux/features/debates/debateApi";
import { useDebateContext } from "@/context/DebateContext";
import { Loader } from "lucide-react";
import DebateChatUI from "./DebateChatUI";
import { useSelector } from "react-redux";

const DebateChat = ({ id }: { id: string }) => {
  const idNum = Number(id);
  const { setDebate } = useDebateContext();
  const { user } = useSelector((state: any) => state.auth); // assuming you store current user in redux

  const { data, isLoading, isSuccess } = useGetDebateByIdQuery(idNum);
  const [socket, setSocket] = useState<WebSocket | null>(null);

  const { data: participantsData, isSuccess: isParticipantsLoaded } =
    useGetParticipantsListQuery({ debate_id: idNum }, { skip: !idNum });

  // check if user is participant
  const isParticipant = useMemo(() => {
    if (!participantsData?.data || !user?.id) return false;
    return participantsData.data.some((p: any) => p.userId === user.id);
  }, [participantsData, user]);

  useEffect(() => {
    let ws: WebSocket | null = null;

    if (isSuccess && data?.data) {
      const debateData = data.data;
      setDebate({
        id: debateData.id,
        title: debateData.title,
        description: debateData.description,
        status: debateData.status,
        created_by: debateData.created_by,
      });

      ws = new WebSocket(
        `${process.env.NEXT_PUBLIC_WEBSOCKET_API}/debates/ws/debates/${debateData.id}`
      );

      ws.onopen = () => console.log("✅ WebSocket connected");
      ws.onerror = (err) => console.error("❌ WebSocket error", err);
      ws.onclose = () => console.log("🔌 WebSocket closed");

      setSocket(ws);
    }

    return () => {
      if (ws) {
        console.log("🧹 Closing WebSocket...");
        ws.close();
      }
    };
  }, [isSuccess, data, setDebate]);

  if (isLoading) {
    return (
      <div className="p-4 flex items-center justify-center h-screen">
        <Loader className="animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <header className="h-16 shrink-0">
        <DebateNavbar />
      </header>

      <div className="flex-1 min-h-0 overflow-hidden">
        {!socket || !isParticipantsLoaded ? (
          <div className="flex items-center justify-center h-full">
            <Loader className="animate-spin" />
          </div>
        ) : !isParticipant ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            You’re not a participant in this debate.
          </div>
        ) : (
          <DebateChatUI socket={socket} />
        )}
      </div>
    </div>
  );
};

export default DebateChat;
