import axios from "./axios";


export const getPresignedUploadUrl = async (fileName: string, fileType: string) => {
    try {
        const response = await axios.post("/images/presignedUploadUrl", {fileName, fileType});
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export const getPresignedDownloadUrl = async (key: string) => {
    try {
        const response = await axios.post("/images/presignedDownloadUrl", {key});
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}