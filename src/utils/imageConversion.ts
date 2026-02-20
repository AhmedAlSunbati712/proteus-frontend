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

function loadImageFromBlob(blob: Blob): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(blob);
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

/**
 * Returns a JPEG Blob with EXIF orientation applied (pixels normalized).
 * Uses createImageBitmap(..., { imageOrientation: 'from-image' }) when available.
 * Fallback: JPEG File returns as-is (slice); otherwise load into Image and canvas.
 */
async function orientationNormalizedJpegBlob(
  source: File | Blob,
  quality = 0.9
): Promise<Blob> {
  async function fallback(): Promise<Blob> {
    if (source instanceof File && JPEG_TYPES.has(source.type?.toLowerCase() ?? "")) {
      return source.slice();
    }
    const blob = source instanceof File ? source : source;
    const img = await loadImageFromBlob(blob);
    return canvasToJpegBlob(img, quality);
  }

  if (typeof createImageBitmap !== "function") {
    return fallback();
  }

  try {
    const bitmap = await createImageBitmap(source, {
      imageOrientation: "from-image",
    });
    const canvas = document.createElement("canvas");
    canvas.width = bitmap.width;
    canvas.height = bitmap.height;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      bitmap.close();
      return fallback();
    }
    ctx.drawImage(bitmap, 0, 0);
    bitmap.close();
    return new Promise((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (blob) resolve(blob);
          else reject(new Error("Failed to convert to JPEG"));
        },
        "image/jpeg",
        quality
      );
    });
  } catch {
    return fallback();
  }
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
 * (with EXIF orientation applied when supported) and a .jpg filename.
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
    try {
      const blob = await orientationNormalizedJpegBlob(file);
      return { blob, fileName };
    } catch {
      return { blob: file, fileName };
    }
  }

  if (HEIC_TYPES.has(mime)) {
    const result = await heic2any({
      blob: file,
      toType: "image/jpeg",
      quality: 0.9,
    });
    const heicBlob = Array.isArray(result) ? result[0] : result;
    if (!heicBlob) throw new Error("HEIC conversion failed");
    try {
      const blob = await orientationNormalizedJpegBlob(heicBlob);
      return { blob, fileName };
    } catch {
      return { blob: heicBlob, fileName };
    }
  }

  try {
    const blob = await orientationNormalizedJpegBlob(file);
    return { blob, fileName };
  } catch {
    const img = await loadImage(file);
    const blob = await canvasToJpegBlob(img);
    return { blob, fileName };
  }
}
