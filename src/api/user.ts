import { User } from "@/types/user";
import axios from "./axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";

const USER_QUERY_KEY = "users";

interface LoginInfo {
    email: string;
    password: string;
}

const extractErrorMessage = (error: unknown, fallback: string): string => {
    if (isAxiosError(error)) {
        if (!error.response) {
            return "Cannot reach server. Check that backend/database services are running.";
        }

        const apiMessage = error.response.data?.error || error.response.data?.message;
        if (typeof apiMessage === "string" && apiMessage.trim() !== "") {
            return apiMessage;
        }

        if (error.response.status === 401) {
            return "Invalid email or password.";
        }

        if (error.response.status >= 500) {
            return "Server error while processing your request. Please try again.";
        }
    }

    if (error instanceof Error && error.message.trim() !== "") {
        return error.message;
    }

    return fallback;
}

export const getUser = () => {
    return useQuery({
        queryKey: [USER_QUERY_KEY],
        queryFn: async () => {
            const response = await axios.get("/user");
            return response.data;
        },
    });
}

export const signUp = (onSuccess?: () => void, onError?: (message: string) => void) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (user: Omit<User, "id">) => {
            const response = await axios.post("/user/signup", user);
            console.log('Signup response:', response);
            return response.data;
        },
        onError: (error) => {
            console.error(error);
            onError?.(extractErrorMessage(error, "Signup failed."));
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: [USER_QUERY_KEY] });
            if (onSuccess) onSuccess();
        },
    });
}

export const logIn = (onSuccess?: () => void, onError?: (message: string) => void) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (loginInfo: LoginInfo) => {
            const response = await axios.post("/user/login", loginInfo);
            console.log('Login response:', response);
            return response.data;
        },
        onError: (error) => {
            console.error(error);
            onError?.(extractErrorMessage(error, "Login failed."));
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: [USER_QUERY_KEY]});
            if (onSuccess) onSuccess();
        }
    })
}

export const logOut = (onSuccess?: () => void, onError?: (message: string) => void) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async () => {
            const response = await axios.post("/user/logout");
            console.log('Logout response:', response);
            return response.data;
        },
        onError: (error) => {
            console.error(error);
            onError?.(extractErrorMessage(error, "Logout failed."));
        },
        onSuccess: () => {
            queryClient.setQueryData([USER_QUERY_KEY], null);
            if (onSuccess) onSuccess();
        }
    })
}
