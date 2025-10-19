"use client";

import React, { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Controller, useForm } from "react-hook-form";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { toast } from "react-toastify";
import { useJoinDebateMutation } from "@/redux/features/debates/debateApi";

interface JoinDebateInput {
  role: "for_side" | "against_side" | "neutral_side";
}

interface JoinDebateDialogProps {
  debate_id: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const JoinDebateDialog = ({
  debate_id,
  open,
  onOpenChange,
}: JoinDebateDialogProps) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<JoinDebateInput>({
    defaultValues: { role: "neutral_side" },
  });

  const [joinDebate, { isLoading, isSuccess, isError, error }] =
    useJoinDebateMutation();

  const onSubmit = async (data: JoinDebateInput) => {
    try {
      await joinDebate({ debate_id, role: data.role }).unwrap();
      toast.success("You’ve joined the debate successfully!");
      onOpenChange(false);
      reset();
    } catch (err: any) {
      toast.error(err?.data?.detail || "Failed to join debate");
    }
  };

  useEffect(() => {
    if (isError && error) {
      toast.error(
        "data" in error
          ? (error.data as any)?.detail || "Something went wrong"
          : "Something went wrong"
      );
    }
  }, [isError, error]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            Join Debate
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label>Select Your Role</Label>
            <Controller
              name="role"
              control={control}
              rules={{ required: "Please select a role" }}
              render={({ field }) => (
                <RadioGroup
                  value={field.value}
                  onValueChange={field.onChange}
                  className="flex gap-4 mt-3"
                >
                  {[
                    { id: "for", label: "For", value: "for_side" },
                    { id: "against", label: "Against", value: "against_side" },
                    { id: "neutral", label: "Neutral", value: "neutral_side" },
                  ].map((option) => (
                    <div
                      key={option.id}
                      className="flex items-center space-x-2"
                    >
                      <RadioGroupItem value={option.value} id={option.id} />
                      <Label htmlFor={option.id}>{option.label}</Label>
                    </div>
                  ))}
                </RadioGroup>
              )}
            />
            {errors.role && (
              <p className="text-sm text-red-500 mt-1">{errors.role.message}</p>
            )}
          </div>

          <Button
            disabled={isLoading}
            type="submit"
            className="w-full background cursor-pointer"
          >
            {isLoading ? "Joining..." : "Join Debate"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default JoinDebateDialog;
