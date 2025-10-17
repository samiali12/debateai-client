"use client";
import React, { useEffect } from "react";
import DebateNavbar from "./DebateNavbar";
import { useGetDebateByIdQuery } from "@/redux/features/debates/debateApi";
import { useDebateContext } from "@/context/DebateContext";
import { Loader } from "lucide-react";

const DebateChat = ({ id }: { id: string }) => {
  const idNum = Number(id);
  const { setDebate } = useDebateContext();
  const { data, isLoading, isSuccess } = useGetDebateByIdQuery(idNum);

  useEffect(() => {
    if (isSuccess && data?.data) {
      const debateData = data.data;
      setDebate({
        id: debateData.id,
        title: debateData.title,
        description: debateData.description,
        status: debateData.status,
        created_by: debateData.created_by,
      });
    }
  }, [isSuccess, data, setDebate]);

  if (isLoading) {
    return (
      <div className="p-4 flex items-center justify-center h-screen">
        <Loader className="animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <DebateNavbar />
    </div>
  );
};

export default DebateChat;
