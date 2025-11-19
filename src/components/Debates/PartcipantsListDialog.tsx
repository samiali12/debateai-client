"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2, Mail, Shield, Users } from "lucide-react";
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

  const getRoleColor = (role: string) => {
    const roleMap: { [key: string]: string } = {
      proposer: "bg-blue-500/20 text-blue-300 border-blue-500/30",
      opposer: "bg-red-500/20 text-red-300 border-red-500/30",
      moderator: "bg-purple-500/20 text-purple-300 border-purple-500/30",
      judge: "bg-amber-500/20 text-amber-300 border-amber-500/30",
      observer: "bg-gray-500/20 text-gray-300 border-gray-500/30",
    };
    return (
      roleMap[role?.toLowerCase()] ||
      "bg-gray-500/20 text-gray-300 border-gray-500/30"
    );
  };

  if (isError && error) {
    toast.error(
      "data" in error
        ? (error.data as any)?.detail || "Failed to load participants"
        : "Failed to load participants"
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full !max-w-2xl bg-gradient-to-br from-[#3E1E68] via-[#2a1447] to-[#1a0c2e] backdrop-blur-sm rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
        <DialogHeader>
          <DialogTitle className="border-b border-white/10 px-6 py-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#E45A92] to-[#FFACAC] flex items-center justify-center shadow-lg shadow-[#E45A92]/50">
                <Users className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold bg-gradient-to-r from-white to-[#FFACAC] bg-clip-text text-transparent">
                  Debate Participants
                </h2>
                <p className="text-xs text-gray-400">
                  {participants.length} participant
                  {participants.length !== 1 ? "s" : ""}
                </p>
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12 gap-3">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            <p className="text-gray-400">Loading participants...</p>
          </div>
        ) : participants.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 gap-3">
            <Users className="w-12 h-12 text-gray-500" />
            <p className="text-gray-400 font-medium">No participants yet</p>
            <p className="text-sm text-gray-500">
              Participants will appear here once they join
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="">#</TableHead>
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
                  <TableRow
                    key={participant.participantId}
                    className="bg-white/5 backdrop-blur-sm border border-white/10 hover:border-[#E45A92]/50 hover:bg-white/8 transition-all duration-300 hover:shadow-lg hover:shadow-[#E45A92]/20"
                  >
                    <TableCell className="text-white font-bold text-sm">
                      {index + 1}
                    </TableCell>

                    <TableCell className="font-semibold text-white truncate">
                      {participant.fullName}
                    </TableCell>

                    <TableCell className="flex items-center gap-1.5 text-sm text-gray-400 truncate">
                      <Mail className="w-3.5 h-3.5" />
                      {participant.email}
                    </TableCell>

                    <TableCell className="px-3 py-1.5">
                      <div
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-medium text-xs ${getRoleColor(
                          participant.role
                        )}`}
                      >
                        <Shield className="w-3.5 h-3.5" />
                        <span className="capitalize">{participant.role}</span>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              )}
            </TableBody>
          </Table>
        )}

        <div className="flex justify-end mt-4">
          <Button
            className="bg-gradient-to-r from-[#E45A92] to-[#FFACAC]"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ParticipantsListDialog;
