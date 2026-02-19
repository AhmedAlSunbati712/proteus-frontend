import { useState } from "react";
import { toast } from "react-toastify";
import { createVTON } from "@/api/vton";
import { queueWeaverJob } from "@/api/jobs";
import { uploadImage } from "@/utils/s3";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import CreateVTONForm, { type CreateVTONFormData } from "./CreateVTONForm";

interface CreateVTONModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function getErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof Error && error.message.trim()) {
    return error.message;
  }
  return fallback;
}

export default function CreateVTONModal({
  open,
  onOpenChange,
}: CreateVTONModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { mutateAsync: createVtonAsync } = createVTON();
  const { mutateAsync: queueWeaverAsync } = queueWeaverJob();

  const handleSubmit = async (data: CreateVTONFormData) => {
    setIsSubmitting(true);
    try {
      const userSnapKey = await uploadImage(data.userImage);
      const outfitKey = await uploadImage(data.outfitImage);
      if (!userSnapKey || !outfitKey) {
        throw new Error("Image upload failed. Please try again.");
      }

      const createdVton = (await createVtonAsync({
        user_snap: userSnapKey,
        uncleaned_outfit: outfitKey,
      })) as { id?: string };

      if (!createdVton?.id) {
        throw new Error("Failed to create VTON record.");
      }

      await queueWeaverAsync({
        vton_id: createdVton.id,
        user_snap_s3: userSnapKey,
        uncleaned_outfit_s3: outfitKey,
      });

      toast.success("Try-on submitted. It will appear in your history once processed.");
      onOpenChange(false);
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to submit try-on request."));
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[420px]">
        <DialogHeader className="space-y-1">
          <DialogTitle className="text-xl">Create New Try-On</DialogTitle>
          <DialogDescription>
            Upload one user photo and one outfit photo to start a new VTON job.
          </DialogDescription>
        </DialogHeader>
        <CreateVTONForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
      </DialogContent>
    </Dialog>
  );
}
