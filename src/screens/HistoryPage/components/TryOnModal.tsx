import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import TryOnForm, { type TryOnFormData } from './TryOnForm';

interface TryOnModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function TryOnModal({ open, onOpenChange }: TryOnModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: TryOnFormData) => {
    setIsSubmitting(true);
    try {
      // TODO: Implement submission logic
      // 1. Get presigned URLs for both images
      // 2. Upload images to S3
      // 3. Create VTON record with image keys
      console.log('Form data:', data);
      
      // Placeholder - just close the modal after a short delay
      // Remove this when implementing actual submission
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      onOpenChange(false);
    } catch (error) {
      console.error('Submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader className="space-y-1">
          <DialogTitle className="text-xl">Create New Try-On</DialogTitle>
          <DialogDescription>
            Upload an outfit picture and a subject picture to generate a virtual try-on.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4">
          <TryOnForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
