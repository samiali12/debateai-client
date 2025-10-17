"use client";
import React, { useEffect, useState } from "react";
import DebateNavbar from "./DebateNavbar";
import { useGetDebateByIdQuery } from "@/redux/features/debates/debateApi";
import { useDebateContext } from "@/context/DebateContext";
import { Loader } from "lucide-react";
import DebateChatUI from "./DebateChatUI";

const DebateChat = ({ id }: { id: string }) => {
  const idNum = Number(id);
  const { setDebate } = useDebateContext();
  const { data, isLoading, isSuccess } = useGetDebateByIdQuery(idNum);
  const [socket, setSocket] = useState<WebSocket | null>(null);

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
    <div className="h-full overflow-hidden">
      <DebateNavbar />

      <div className="h-full">
        {socket ? (
          <DebateChatUI socket={socket} />
        ) : (
          <div className="flex items-center justify-center h-full">
            <Loader className="animate-spin" />
          </div>
        )}
      </div>
    </div>
  );
};

export default DebateChat;
