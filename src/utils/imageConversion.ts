import heic2any from "heic2any";

const ALLOWED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/avif",
  "image/gif",
  "image/heic",
  "image/heif",
]);

const JPEG_TYPES = new Set(["image/jpeg", "image/jpg"]);

const HEIC_TYPES = new Set(["image/heic", "image/heif"]);

function toJpegFileName(fileName: string): string {
  const base = fileName.replace(/\.[^.]+$/i, "") || "image";
  return `${base}.jpg`;
}

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to load image"));
    };
    img.src = url;
  });
}

function canvasToJpegBlob(img: HTMLImageElement, quality = 0.9): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement("canvas");
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      reject(new Error("Canvas not supported"));
      return;
    }
    ctx.drawImage(img, 0, 0);
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error("Failed to convert to JPEG"));
      },
      "image/jpeg",
      quality
    );
  });
}

export function isAllowedImageType(mime: string): boolean {
  return ALLOWED_IMAGE_TYPES.has(mime.toLowerCase());
}

/**
 * Validates that the file is an allowed image type, then returns a JPEG Blob
 * and a .jpg filename. If the file is already JPEG, returns it as-is (as Blob).
 */
export async function fileToJpegBlob(
  file: File
): Promise<{ blob: Blob; fileName: string }> {
  const mime = (file.type || "").toLowerCase();
  if (!isAllowedImageType(mime)) {
    throw new Error("Unsupported image format");
  }

  const fileName = toJpegFileName(file.name);

  if (JPEG_TYPES.has(mime)) {
    return { blob: file, fileName };
  }

  if (HEIC_TYPES.has(mime)) {
    const result = await heic2any({
      blob: file,
      toType: "image/jpeg",
      quality: 0.9,
    });
    const blob = Array.isArray(result) ? result[0] : result;
    if (!blob) throw new Error("HEIC conversion failed");
    return { blob, fileName };
  }

  const img = await loadImage(file);
  const blob = await canvasToJpegBlob(img);
  return { blob, fileName };
}
