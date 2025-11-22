"use client";
import React, { useEffect, useState, useMemo } from "react";
import DebateNavbar from "./DebateNavbar";
import {
  useGetDebateByIdQuery,
  useGetParticipantsListQuery,
} from "@/redux/features/debates/debateApi";
import { useDebateContext } from "@/context/DebateContext";
import { Loader2 } from "lucide-react";
import DebateChatUI from "./DebateChatUI";
import { useSelector } from "react-redux";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Analytics from "./Analytics";
import ConsensusResult from "./ConsensusResult";

const DebateChat = ({ id }: { id: string }) => {
  const idNum = Number(id);
  const { setDebate } = useDebateContext();
  const { user } = useSelector((state: any) => state.auth);

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
      <div className="bg-gradient-to-b from-[#3E1E68] via-[#2a1447] to-[#1a0c2e] p-4 flex items-center justify-center h-screen">
        <Loader2 className="animate-spin w-10 h-10 text-[#E45A92]" />
      </div>
    );
  }

  if (!isSuccess || !data?.data) {
    return (
      <div className="bg-gradient-to-b from-[#3E1E68] via-[#2a1447] to-[#1a0c2e] p-4 flex items-center justify-center h-screen text-gray-300">
        Debate not found.
      </div>
    );
  }

  return (
    <div className="overflow-hidden bg-gradient-to-b from-[#3E1E68] via-[#2a1447] to-[#1a0c2e] flex flex-col h-screen w-full">
      <header className="h-14 shrink-0">
        <DebateNavbar />
      </header>

      <div className="flex-1 flex flex-col min-h-0 relative">
        <Tabs
          defaultValue="chat"
          className="w-full h-full flex flex-col"
        >
          <TabsList className="w-full bg-[#2a1447] text-gray-300 shrink-0">
            <TabsTrigger value="chat">Live Chat</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="consensus">Consensus</TabsTrigger>
          </TabsList>
          <TabsContent value="chat" className="flex-1 h-full min-h-0 data-[state=active]:flex flex-col mt-0">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute top-20 left-10 w-72 h-72 bg-[#E45A92] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
              <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#FFACAC] rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-pulse delay-1000"></div>
            </div>
            {!socket || !isParticipantsLoaded ? (
              <div className="flex items-center justify-center h-full">
                <Loader2 className="animate-spin w-10 h-10 text-[#E45A92]" />
              </div>
            ) : !isParticipant ? (
              <div className="flex items-center justify-center h-full text-gray-300">
                You’re not a participant in this debate.
              </div>
            ) : (
              <DebateChatUI socket={socket} />
            )}
          </TabsContent>
          <TabsContent value="analytics" className="flex-1 h-full min-h-0 data-[state=active]:flex flex-col mt-0">
            <Analytics debateId={idNum} />
          </TabsContent>
          <TabsContent value="consensus" className="flex-1 h-full min-h-0 data-[state=active]:flex flex-col mt-0">
            <ConsensusResult debateId={Number(idNum)} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default DebateChat;
