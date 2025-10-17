import React from "react";
import DebateChat from "@/components/Debates/DebateChat";

const DebatePage = ({ params }: { params: { id?: string | string[] } }) => {
  const { id } = params;

  if (!id) {
    return null;
  }

  const idStr = Array.isArray(id) ? id[0] ?? "" : id;

  return (
    <div>
      <DebateChat id={idStr} />
    </div>
  );
};

export default DebatePage;
