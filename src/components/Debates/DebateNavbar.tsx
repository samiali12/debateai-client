"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EllipsisVertical, Users } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDebateContext } from "@/context/DebateContext";
import {
  useDeleteDebateMutation,
  useGetParticipantsListQuery,
  useUpdateDebateStatusMutation,
} from "@/redux/features/debates/debateApi";
import { useEffect, useState, useMemo } from "react";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import JoinDebateDialog from "./JoinDebateDialog";
import PartcipantsListDialog from "./PartcipantsListDialog";

const DebateNavbar = () => {
  const { debate, setDebate } = useDebateContext();
  const user = useSelector((state: RootState) => state.auth.user);

  const [updateStatus, updateStatusState] = useUpdateDebateStatusMutation();
  const [deleteDebate, deleteState] = useDeleteDebateMutation();

  const [joinDebate, setJoinDebate] = useState(false);
  const [openParticipantListDialog, setOpenParticipantsListDialog] =
    useState(false);

  const { data: participantsData } = useGetParticipantsListQuery(
    { debate_id: debate?.id },
    { skip: !debate?.id }
  );

  const participants = participantsData?.data || [];

  const hasJoined = useMemo(
    () => participants.some((p: any) => p.userId === user?.id),
    [participants, user]
  );

  const { isError, error } = updateStatusState;
  const { isError: isDeleteError, error: deleteError } = deleteState;

  const handleUpdateStatus = async (
    status: "pending" | "active" | "completed" | "archived"
  ) => {
    if (!debate?.id) return;
    setDebate((prev) => ({ ...prev, status }));
    try {
      const res = await updateStatus({ debate_id: debate.id, status }).unwrap();
      setDebate((prev) => ({ ...prev, status: res.status }));
      toast.success("Debate status updated successfully");
    } catch (err: any) {
      toast.error(err?.data?.detail || "Failed to update debate status");
    }
  };

  const handleDeleteDebate = async () => {
    if (!debate?.id) return;
    try {
      await deleteDebate({ debate_id: debate.id }).unwrap();
      toast.success("Debate deleted successfully");
      setDebate({
        title: "",
        description: "",
        id: 0,
        status: "pending",
        created_by: 0,
      });
    } catch (err: any) {
      toast.error(err?.data?.detail || "Failed to delete debate");
    }
  };

  useEffect(() => {
    if (isError && error)
      toast.error(
        "data" in error
          ? (error.data as any)?.detail || "Something went wrong"
          : "Something went wrong"
      );
    if (isDeleteError && deleteError)
      toast.error(
        "data" in deleteError
          ? (deleteError.data as any)?.detail || "Failed to delete debate"
          : "Failed to delete debate"
      );
  }, [isError, error, isDeleteError, deleteError]);

  return (
    <header className="h-full flex items-center justify-between px-4 py-3 z-50 backdrop-blur-lg border-b border-white/10 bg-gradient-to-b from-[#3E1E68]/95 to-[#3E1E68]/80">
      {/* Left side */}
      <div className="flex items-center gap-3">
        <div>
          <h2 className="text-base font-semibold leading-none">
            {debate.title || "No Debate Selected"}
          </h2>
          {debate.title && (
            <Badge
              variant={
                debate.status === "pending"
                  ? "outline"
                  : debate.status === "active"
                  ? "default"
                  : debate.status === "completed"
                  ? "destructive"
                  : "default"
              }
              className="mt-2"
            >
              {debate?.status?.charAt(0).toUpperCase() +
                debate?.status?.slice(1)}
            </Badge>
          )}
        </div>
      </div>

      {/* Right side */}
      {debate.title && (
        <div className="flex items-center gap-3">
          {/* Participants List */}
          <Button
            variant="outline"
            className="bg-gradient-to-r from-[#E45A92] to-[#FFACAC] text-white rounded-lg px-4 py-2 font-semibold text-center shadow-lg shadow-[#E45A92]/50 "
            onClick={() => setOpenParticipantsListDialog(true)}
          >
            <Users className="w-4 h-4" /> View Participants
          </Button>

          {/* Start / End / Join */}
          {debate.created_by === user?.id ? (
            <>
              {debate.status === "active" ? (
                <Button
                  variant={"destructive"}
                  className="block px-4 py-2 rounded-lg text-white font-semibold hover:bg-white/10 transition-all duration-300 border border-white/20 text-center"
                  onClick={() => handleUpdateStatus("completed")}
                >
                  End Debate
                </Button>
              ) : (
                <Button
                  disabled={debate.status === "completed"}
                  onClick={() => handleUpdateStatus("active")}
                  className="py-3 px-4 bg-gradient-to-r from-[#E45A92] to-[#FFACAC] rounded-xl text-white font-semibold shadow-lg shadow-[#E45A92]/50 hover:shadow-xl hover:shadow-[#E45A92]/70 transition-all duration-300 hover:scale-105 disabled:opacity-70 disabled:scale-100 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  Start Debate
                </Button>
              )}
            </>
          ) : (
            !hasJoined && (
              <Button
                onClick={() => setJoinDebate(true)}
                className="py-3 px-4 bg-gradient-to-r from-[#E45A92] to-[#FFACAC] rounded-xl text-white font-semibold shadow-lg shadow-[#E45A92]/50 hover:shadow-xl hover:shadow-[#E45A92]/70 transition-all duration-300 hover:scale-105 disabled:opacity-70 disabled:scale-100 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                Join
              </Button>
            )
          )}

          {/* Only creator can see delete option */}
          {debate.status === "pending" && debate.created_by === user?.id && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant={"ghost"} className="cursor-pointer p-2">
                  <EllipsisVertical />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="gradient-border" align="start">
                <DropdownMenuItem onClick={handleDeleteDebate} className="bg-red-500 hover:bg-red-600 text-white">
                  Delete debate
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      )}

      {/* Dialogs */}
      <JoinDebateDialog
        debate_id={debate.id}
        open={joinDebate}
        onOpenChange={setJoinDebate}
      />
      <PartcipantsListDialog
        open={openParticipantListDialog}
        onOpenChange={setOpenParticipantsListDialog}
        debate_id={debate.id}
      />
    </header>
  );
};

export default DebateNavbar;
