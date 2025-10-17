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
    <header className="flex items-center justify-between px-4 py-3 border-gradient-bottom bg-background backdrop-blur-sm">
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
              {debate.status.charAt(0).toUpperCase() + debate.status.slice(1)}
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
            className="flex items-center gap-2 cursor-pointer"
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
                  className="cursor-pointer rounded-md"
                  onClick={() => handleUpdateStatus("completed")}
                >
                  End Debate
                </Button>
              ) : (
                <Button
                  disabled={debate.status === "completed"}
                  onClick={() => handleUpdateStatus("active")}
                  className="background cursor-pointer rounded-md"
                >
                  Start Debate
                </Button>
              )}
            </>
          ) : (
            !hasJoined && (
              <Button
                onClick={() => setJoinDebate(true)}
                className="background cursor-pointer"
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
                <DropdownMenuItem onClick={handleDeleteDebate}>
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
