import { useState, useEffect } from "react";
import { getPresignedDownloadUrl } from "@/api/image";
import { Loader2 } from "lucide-react";


interface ImageProps {
    objectKey: string;
    alt?: string;
    className?: string;
}


export default function Image({ objectKey, alt = "image", className }: ImageProps) {
    const [imageUrl, setImageUrl] = useState<string | null>(null);

    useEffect(() => {
        if (objectKey) {
            getPresignedDownloadUrl(objectKey).then((data) => {
                const url = typeof data === "string" ? data : data?.url;
                setImageUrl(url ?? null);
            });
        }
    }, [objectKey]);

    return imageUrl ? (
        <img src={imageUrl} alt={alt} className={className} />
    ) : (
        <>
            <Loader2 className="w-4 h-4 animate-spin" /> Loading...
        </>
    );
}
