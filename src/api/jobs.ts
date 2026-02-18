import { TailorJob, WeaverJob } from "@/types/jobs";
import axios from "./axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";


const WEAVER_JOBS_QUERY_KEY = "weaver"
const TAILOR_JOBS_QUERY_KEY = "tailor"

export const queueWeaverJob = (onSuccess?: () => void, onError?: () => void) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (job: Omit<WeaverJob, "id" | "created_at" | "userId">) => {
            const response = await axios.post("/jobs/weaver", job);
            return response.data;
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: [WEAVER_JOBS_QUERY_KEY] });
            onSuccess?.();
        },
        onError: (error) => {
            console.error(error);
            onError?.();
        }
    })
}

export const queueTailorJob = (onSuccess?: () => void, onError?: () => void) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (job: Omit<TailorJob, "id" | "created_at" | "userId">) => {
            const response = await axios.post("/jobs/tailor", job);
            return response.data;
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: [TAILOR_JOBS_QUERY_KEY] });
            onSuccess?.();
        },
        onError: (error) => {
            console.error(error);
            onError?.();
        }
    })
}