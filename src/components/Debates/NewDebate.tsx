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
  role: "for_side" | "against_side" | "neutral_side";
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

  // Validation helpers
  const looksLikeGibberish = (text: string) => {
    const t = String(text || "").trim();
    if (!t) return true;
    // must contain at least one alphanumeric
    if (!/[A-Za-z0-9]/.test(t)) return true;
    // if one character repeats for most of the string, it's gibberish
    const chars = t.replace(/\s+/g, "");
    const freq: Record<string, number> = {};
    for (const c of chars) freq[c] = (freq[c] || 0) + 1;
    const max = Math.max(...Object.values(freq));
    if (chars.length > 0 && max / chars.length > 0.6) return true;
    // keyboard mashes or common placeholders
    if (/(?:asdf|qwerty|test|random|lorem|demo|12345)/i.test(t)) return true;
    return false;
  };

  const titleValidation = (value: string) => {
    const v = String(value || "").trim();
    if (v.length < 10) return "Title must be at least 10 characters";
    if (v.length > 120) return "Title must be at most 120 characters";
    const words = v.split(/\s+/).filter((w) => w.replace(/[^A-Za-z0-9]/g, "").length > 0);
    if (words.length < 3) return "Please use at least 3 meaningful words in the title";
    if (looksLikeGibberish(v)) return "Please provide a descriptive, non-gibberish title";
    return true;
  };

  const descriptionValidation = (value: string) => {
    const v = String(value || "").trim();
    if (v.length < 20) return "Description must be at least 20 characters";
    if (v.length > 1000) return "Description must be at most 1000 characters";
    const words = v.split(/\s+/).filter((w) => w.replace(/[^A-Za-z0-9]/g, "").length > 0);
    if (words.length < 6) return "Description should contain a few meaningful words (min 6)";
    if (looksLikeGibberish(v)) return "Please provide a meaningful description";
    return true;
  };
  const [newDebateFn, { isLoading, isSuccess, isError, error }] =
    useNewDebateMutation();

  const onSubmit: SubmitHandler<DebateInputForm> = async (data) => {
    // Trim inputs before sending
    const payload = {
      title: data.title.trim(),
      description: data.description.trim(),
      role: data.role,
    } as DebateInputForm;

    newDebateFn(payload).unwrap();
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
        <DialogContent className="max-w-md bg-gradient-to-br from-[#3E1E68] via-[#2a1447] to-[#1a0c2e] backdrop-blur-sm rounded-2xl border border-white/10 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold bg-gradient-to-r from-white to-[#FFACAC] bg-clip-text text-transparent">
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
                className="block text-sm font-semibold text-gray-200 mb-2"
              >
                Debate Title
              </Label>
              <div>
                <Input
                  {...register("title", {
                    required: "Title is required",
                    validate: titleValidation,
                  })}
                  id="title"
                  placeholder="e.g. Is AI beneficial for society?"
                  required
                  className="w-full px-4 py-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E45A92] focus:border-transparent transition-all duration-300"
                />
              </div>
              {errors.title && (
                <p className="text-secondary text-xs mt-2 font-medium">
                  {errors.title.message}
                </p>
              )}
            </div>
            <div>
              <Label
                htmlFor="description"
                className="block text-sm font-semibold text-gray-200 mb-2"
              >
                Description
              </Label>
              <div>
                <Textarea
                  {...register("description", {
                    required: "Description is required",
                    validate: descriptionValidation,
                  })}
                  id="description"
                  placeholder="Briefly describe the debate topic..."
                  className="w-full px-4 py-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E45A92] focus:border-transparent transition-all duration-300"
                />
              </div>
              {errors.description && (
                <p className="text-secondary text-xs mt-2 font-medium">
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
                      <RadioGroupItem value="neutral_side" id="neutral" />
                      <Label htmlFor="neutral">Neutral</Label>
                    </div>
                  </RadioGroup>
                )}
              />

              {errors.role && (
                <p className="text-secondary text-xs mt-2 font-medium">
                  {errors.role.message}
                </p>
              )}
            </div>
            <DialogFooter>
              <Button
                disabled={isLoading}
                type="submit"
                className="w-full py-3 px-4 bg-gradient-to-r from-[#E45A92] to-[#FFACAC] rounded-xl text-white font-semibold shadow-lg shadow-[#E45A92]/50 hover:shadow-xl hover:shadow-[#E45A92]/70 transition-all duration-300 hover:scale-105 disabled:opacity-70 disabled:scale-100 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
