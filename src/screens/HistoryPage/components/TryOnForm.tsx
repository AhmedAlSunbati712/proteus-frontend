import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Upload, Image as ImageIcon, Loader2 } from 'lucide-react';
import { useState, useRef } from 'react';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

const tryOnSchema = z.object({
  outfitImage: z
    .instanceof(File)
    .refine((file) => file.size <= MAX_FILE_SIZE, 'File size must be less than 10MB')
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
      'Only .jpg, .jpeg, .png and .webp formats are supported'
    ),
  subjectImage: z
    .instanceof(File)
    .refine((file) => file.size <= MAX_FILE_SIZE, 'File size must be less than 10MB')
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
      'Only .jpg, .jpeg, .png and .webp formats are supported'
    ),
});

export type TryOnFormData = z.infer<typeof tryOnSchema>;

interface TryOnFormProps {
  onSubmit: (data: TryOnFormData) => void | Promise<void>;
  isSubmitting?: boolean;
}

interface ImageUploadBoxProps {
  id: string;
  label: string;
  accept: string;
  disabled: boolean;
  error?: string;
  onChange: (file: File | null) => void;
  preview: string | null;
}

function ImageUploadBox({
  id,
  label,
  accept,
  disabled,
  error,
  onChange,
  preview,
}: ImageUploadBoxProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    onChange(file || null);
  };

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Card
        className={`cursor-pointer transition-colors hover:border-primary/50 ${
          error ? 'border-destructive' : ''
        }`}
        onClick={handleClick}
      >
        <CardContent className="flex h-40 items-center justify-center p-4">
          {preview ? (
            <img
              src={preview}
              alt={label}
              className="h-full w-full rounded-md object-contain"
            />
          ) : (
            <div className="flex flex-col items-center gap-2 text-muted-foreground">
              {disabled ? (
                <Loader2 className="h-8 w-8 animate-spin" />
              ) : (
                <>
                  <Upload className="h-8 w-8" />
                  <span className="text-sm">Click to upload</span>
                </>
              )}
            </div>
          )}
        </CardContent>
      </Card>
      <Input
        ref={inputRef}
        id={id}
        type="file"
        accept={accept}
        disabled={disabled}
        className="hidden"
        onChange={handleChange}
      />
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}

export default function TryOnForm({ onSubmit, isSubmitting = false }: TryOnFormProps) {
  const [outfitPreview, setOutfitPreview] = useState<string | null>(null);
  const [subjectPreview, setSubjectPreview] = useState<string | null>(null);

  const form = useForm<TryOnFormData>({
    resolver: zodResolver(tryOnSchema),
    defaultValues: {
      outfitImage: undefined as unknown as File,
      subjectImage: undefined as unknown as File,
    },
  });

  const handleOutfitChange = (file: File | null) => {
    if (file) {
      form.setValue('outfitImage', file);
      form.clearErrors('outfitImage');
      const reader = new FileReader();
      reader.onloadend = () => {
        setOutfitPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setOutfitPreview(null);
    }
  };

  const handleSubjectChange = (file: File | null) => {
    if (file) {
      form.setValue('subjectImage', file);
      form.clearErrors('subjectImage');
      const reader = new FileReader();
      reader.onloadend = () => {
        setSubjectPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setSubjectPreview(null);
    }
  };

  const handleSubmit = form.handleSubmit(async (data) => {
    await onSubmit(data);
  });

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <ImageUploadBox
          id="outfitImage"
          label="Outfit Picture"
          accept={ACCEPTED_IMAGE_TYPES.join(',')}
          disabled={isSubmitting}
          error={form.formState.errors.outfitImage?.message}
          onChange={handleOutfitChange}
          preview={outfitPreview}
        />

        <ImageUploadBox
          id="subjectImage"
          label="Subject Picture"
          accept={ACCEPTED_IMAGE_TYPES.join(',')}
          disabled={isSubmitting}
          error={form.formState.errors.subjectImage?.message}
          onChange={handleSubjectChange}
          preview={subjectPreview}
        />
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Creating try-on...
          </>
        ) : (
          <>
            <ImageIcon className="mr-2 h-4 w-4" />
            Create Try-On
          </>
        )}
      </Button>
    </form>
  );
}
