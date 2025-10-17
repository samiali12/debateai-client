"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2 } from "lucide-react";
import { useGetParticipantsListQuery } from "@/redux/features/debates/debateApi";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";

interface ParticipantsListDialogProps {
  debate_id: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ParticipantsListDialog = ({
  debate_id,
  open,
  onOpenChange,
}: ParticipantsListDialogProps) => {
  const { data, isLoading, isError, error } = useGetParticipantsListQuery({
    debate_id,
  });

  const participants = data?.data || [];

  if (isError && error) {
    toast.error(
      "data" in error
        ? (error.data as any)?.detail || "Failed to load participants"
        : "Failed to load participants"
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            Participants List
          </DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex justify-center items-center py-10">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : participants.length === 0 ? (
          <p className="text-center text-sm text-muted-foreground py-6">
            No participants yet.
          </p>
        ) : (
          <ScrollArea className="max-h-[300px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">#</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {participants.map(
                  (
                    participant: {
                      participantId: number;
                      userId: number;
                      fullName: string;
                      email: string;
                      role: string;
                    },
                    index: number
                  ) => (
                    <TableRow key={participant.participantId}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell className="font-medium">
                        {participant.fullName}
                      </TableCell>
                      <TableCell>{participant.email}</TableCell>
                      <TableCell>{participant.role}</TableCell>
                    </TableRow>
                  )
                )}
              </TableBody>
            </Table>
          </ScrollArea>
        )}

        <div className="flex justify-end mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ParticipantsListDialog;
