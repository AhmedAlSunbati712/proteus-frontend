import { getPresignedUploadUrl } from "@/api/image";
import { isAllowedImageType, fileToJpegBlob } from "./imageConversion";

export const uploadImage = async (
  image: File,
  onError?: () => void,
  onSuccess?: () => void
): Promise<string | undefined> => {
  try {
    if (!isAllowedImageType(image.type || "")) {
      throw new Error("Unsupported image format");
    }
    const { blob, fileName } = await fileToJpegBlob(image);
    const data = await getPresignedUploadUrl(fileName, "image/jpeg");
    const { url, key } = data;
    const response = await fetch(url, {
      method: "PUT",
      body: blob,
      headers: { "Content-Type": "image/jpeg" },
    });
    if (!response.ok) {
      throw new Error(`Upload failed: ${response.status}`);
    }
    onSuccess?.();
    return key;
  } catch (error) {
    console.error(error);
    onError?.();
  }
};