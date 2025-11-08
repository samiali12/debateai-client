import React from "react";
import DebateChat from "@/components/Debates/DebateChat";

const DebatePage = async ({ params }: { params: { id?: string | string[] } }) => {
  const { id } = await params;

  if (!id) {
    return null;
  }

  const idStr = Array.isArray(id) ? id[0] ?? "" : id;

  return (
    <div className="h-full">
      <DebateChat id={idStr} />
    </div>
  );
};

export default DebatePage;
