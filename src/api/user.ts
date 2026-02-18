import { User } from "@/types/user";
import axios from "./axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const USER_QUERY_KEY = "users";

export const signUp = async (user: Omit<User, "id">) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (user: Omit<User, "id">) => {
            const response = await axios.post("/user/signup", user);
            return response.data;
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: [USER_QUERY_KEY] });
        },
    });
}