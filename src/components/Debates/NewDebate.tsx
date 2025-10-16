import React, { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { Textarea } from "../ui/textarea";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Button } from "../ui/button";
import { useNewDebateMutation } from "@/redux/features/debates/debateApi";
import { toast } from "react-toastify";

interface DebateInputForm {
  title: string;
  description: string;
  role: "for_side" | "against_side" | "neutral";
}

interface NewDebateProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  refetch: () => void;
}

const NewDebate = ({ open, onOpenChange, refetch }: NewDebateProps) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<DebateInputForm>();
  const [newDebateFn, { isLoading, isSuccess, isError, error }] =
    useNewDebateMutation();

  const onSubmit: SubmitHandler<DebateInputForm> = async (data) => {
    newDebateFn(data).unwrap();
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success("Debate created successfully!");
      refetch();
      onOpenChange(false);
    }
    if (isError && error) {
      if ("data" in error) {
        const message = (error.data as any)?.detail || "Something went wrong";
        toast.error(message);
      } else {
        toast.error("Something went wrong");
      }
    }
  }, [isSuccess, isError, error, onOpenChange]);

  return (
    <div className="">
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">
              Create a New Debate
            </DialogTitle>
          </DialogHeader>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4"
            noValidate
          >
            <div>
              <Label
                htmlFor="title"
                className="block text-sm font-medium text-gray-600 mb-1"
              >
                Debate Title
              </Label>
              <div className="p-[1px] rounded-md bg-gradient-to-r from-[#0575E6] to-[#00F260]">
                <Input
                  {...register("title", { required: "Title is required" })}
                  id="title"
                  placeholder="e.g. Is AI beneficial for society?"
                  required
                  className="w-ful px-3 py-2 rounded-md bg-white transition-all duration-300 outline-none border-0"
                />
              </div>
              {errors.title && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.title.message}
                </p>
              )}
            </div>
            <div>
              <Label
                htmlFor="description"
                className="block text-sm font-medium text-gray-600 mb-1"
              >
                Description
              </Label>
              <div className="p-[1px] rounded-md bg-gradient-to-r from-[#0575E6] to-[#00F260]">
                <Textarea
                  {...register("description", {
                    required: "Description is required",
                  })}
                  id="description"
                  placeholder="Briefly describe the debate topic..."
                  className="w-ful px-3 py-2 rounded-md bg-white transition-all duration-300 outline-none border-0"
                />
              </div>
              {errors.description && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.description.message}
                </p>
              )}
            </div>
            <div>
              <Label>Select Your Role</Label>
              <Controller
                name="role"
                control={control}
                rules={{ required: "Role is required" }}
                render={({ field }) => (
                  <RadioGroup
                    value={field.value}
                    onValueChange={field.onChange}
                    className="flex gap-4 mt-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="for_side" id="for" />
                      <Label htmlFor="for">For</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="against_side" id="against" />
                      <Label htmlFor="against">Against</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="neutral" id="neutral" />
                      <Label htmlFor="neutral">Neutral</Label>
                    </div>
                  </RadioGroup>
                )}
              />

              {errors.role && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.role.message}
                </p>
              )}
            </div>
            <DialogFooter>
              <Button
                disabled={isLoading}
                type="submit"
                className="w-full background cursor-pointer"
              >
                {isLoading ? "Creating..." : "Create Debate"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default NewDebate;
