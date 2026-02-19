import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const imageFileSchema = z
  .instanceof(File, { message: "Image is required" })
  .refine((file) => file.size > 0, "Image is required")
  .refine((file) => file.type.startsWith("image/"), "File must be an image");

const createVtonSchema = z.object({
  userImage: imageFileSchema,
  outfitImage: imageFileSchema,
});

export type CreateVTONFormData = z.infer<typeof createVtonSchema>;

interface CreateVTONFormProps {
  onSubmit: (data: CreateVTONFormData) => void | Promise<void>;
  isSubmitting?: boolean;
}

export default function CreateVTONForm({
  onSubmit,
  isSubmitting = false,
}: CreateVTONFormProps) {
  const form = useForm<CreateVTONFormData>({
    resolver: zodResolver(createVtonSchema),
    defaultValues: {
      userImage: undefined as unknown as File,
      outfitImage: undefined as unknown as File,
    },
  });

  const handleSubmit = form.handleSubmit(async (data) => {
    await onSubmit(data);
  });

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField
          control={form.control}
          name="userImage"
          render={({ field: { value: _value, onChange, ...field } }) => (
            <FormItem>
              <FormLabel>User Photo</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="file"
                  accept="image/*"
                  disabled={isSubmitting}
                  onChange={(event) => {
                    onChange(event.target.files?.[0]);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="outfitImage"
          render={({ field: { value: _value, onChange, ...field } }) => (
            <FormItem>
              <FormLabel>Outfit Photo</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="file"
                  accept="image/*"
                  disabled={isSubmitting}
                  onChange={(event) => {
                    onChange(event.target.files?.[0]);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Create Try-On"}
        </Button>
      </form>
    </Form>
  );
}
