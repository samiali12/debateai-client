"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EllipsisVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDebateContext } from "@/context/DebateContext";
import {
  useDeleteDebateMutation,
  useUpdateDebateStatusMutation,
} from "@/redux/features/debates/debateApi";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const DebateNavbar = () => {
  const { debate, setDebate } = useDebateContext();
  const [updateStatus, updateStatusState] = useUpdateDebateStatusMutation();
  const [deleteDebate, deleteState] = useDeleteDebateMutation();

  const { isSuccess, isError, error } = updateStatusState;
  const {
    isLoading: isDeleteLoading,
    isSuccess: isDeleted,
    isError: isDeleteError,
    error: deleteError,
  } = deleteState;

  const handleUpdateStatus = async (
    status: "pending" | "active" | "completed" | "archived"
  ) => {
    if (!debate?.id) return;

    // optimistic update
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
      setDebate({ title: "", description: "", id: 0, status: "pending" });
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
          {debate.status === "pending" && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant={"ghost"} className="cursor-pointer p-2">
                  <EllipsisVertical />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="gradient-border" align="start">
                <DropdownMenuItem onClick={() => handleDeleteDebate()}>
                  Delete debate
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {debate.status == "active" ? (
            <Button
              variant={"destructive"}
              className="cursor-pointer rounded-md"
              onClick={() => handleUpdateStatus("completed")}
            >
              End Debate
            </Button>
          ) : (
            <Button
              disabled={debate.status === "completed" ? true : false}
              onClick={() => handleUpdateStatus("active")}
              className="background cursor-pointer rounded-md"
            >
              Start Debate
            </Button>
          )}
        </div>
      )}
    </header>
  );
};

export default DebateNavbar;
