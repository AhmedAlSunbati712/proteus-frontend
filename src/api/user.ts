import { User } from "@/types/user";
import axios from "./axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const USER_QUERY_KEY = "users";

interface LoginInfo {
    email: string;
    password: string;
}
export const signUp = (onSuccess?: () => void, onError?: () => void) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (user: Omit<User, "id">) => {
            const response = await axios.post("/user/signup", user);
            console.log('Signup response:', response);
            return response.data;
        },
        onError: (error) => {
            console.error(error);
            if (onError) onError;
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: [USER_QUERY_KEY] });
            if (onSuccess) onSuccess();
        },
    });
}

export const logIn = (onSuccess?: () => void, onError?: () => void) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (loginInfo: LoginInfo) => {
            const response = await axios.post("/user/login", loginInfo);
            console.log('Login response:', response);
            return response.data;
        },
        onError: (error) => {
            console.error(error);
            if (onError) onError();
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: [USER_QUERY_KEY]});
            if (onSuccess) onSuccess();
        }
    })
}

export const logOut = (onSuccess?: () => void, onError?: () => void) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async () => {
            const response = await axios.post("/user/logout");
            console.log('Logout response:', response);
            return response.data;
        },
        onError: (error) => {
            console.error(error);
            if (onError) onError;
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: [USER_QUERY_KEY] });
            if (onSuccess) onSuccess;
        }
    })
}