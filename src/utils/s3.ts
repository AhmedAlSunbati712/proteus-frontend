import axios from "../api/axios";
import { getPresignedUploadUrl } from "@/api/image";


export const uploadImage = async (image: File, onError?: () => void, onSuccess?: () => void) => {
    try {
        const fileName = image.name;
        const fileType = image.type;
        const data = await getPresignedUploadUrl(fileName, fileType);
        const {url, key} = data;
        await axios.put(url, image, {
            headers: {
                'Content-Type': fileType,
            }
        })
        console.log(`Image ${fileName}.${fileType} uploaded successfully!`);
        onSuccess?.();
        return key;
    } catch (error) {
        console.error(error);
        onError?.();
    }
}