import { useState, useEffect } from "react";
import { getPresignedDownloadUrl } from "@/api/image";
import { Loader2 } from "lucide-react";


interface ImageProps {
    key: string;
    className?: string;
}


export default function Image({ key, className }: ImageProps) {
    const [imageUrl, setImageUrl] = useState<string | null>(null);

    useEffect(() => {
        if (key || key != "") {
            getPresignedDownloadUrl(key).then((url) => {
                setImageUrl(url);
            });
        }
    }, [key]);

    return imageUrl ? (
        <img src={imageUrl} className={className} />
    ) : (
        <>
            <Loader2 className="w-4 h-4 animate-spin" /> Loading...
        </>
    );
}