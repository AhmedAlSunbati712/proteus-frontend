import { VTON } from "@/types/vton";
import axios from "./axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const VTON_QUERY_KEY = "vtons";

export const getVTONS = (query: Partial<VTON>) => {
  return useQuery({
    queryKey: [VTON_QUERY_KEY, query],
    queryFn: async () => {
      const response = await axios.get("/vton", { params: query });
      return response.data;
    },
  });
};

type CreateVTONData = Omit<
  VTON,
  "id" | "user_id" | "createdAt" | "updatedAt"
>;
type UpdateVTONVariables = { vton_id: string; data: Partial<VTON> };

export const createVTON = (onSuccess?: () => void, onError?: () => void) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateVTONData) => {
      const response = await axios.post("/vton", data);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [VTON_QUERY_KEY] });
      onSuccess?.();
    },
    onError: (error) => {
      console.error(error);
      onError?.();
    },
  });
};

export const updateVTON = (onSuccess?: () => void, onError?: () => void) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      vton_id,
      data,
    }: UpdateVTONVariables): Promise<VTON> => {
      const response = await axios.put(`/vton/${vton_id}`, data);
      return response.data;
    },
    onMutate: async ({ vton_id, data: updateData }) => {
      await queryClient.cancelQueries({ queryKey: [VTON_QUERY_KEY] });
      const previousVtons = queryClient.getQueriesData({ queryKey: [VTON_QUERY_KEY] });
      queryClient.setQueriesData(
        { queryKey: [VTON_QUERY_KEY] },
        (old: VTON[] | undefined) => {
          if (!old) return old;
          return old.map((v) =>
            v.id === vton_id ? { ...v, ...updateData } : v
          );
        }
      );
      return { previousVtons };
    },
    onError: (error, _variables, context) => {
      if (context?.previousVtons) {
        context.previousVtons.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      console.error(error);
      onError?.();
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [VTON_QUERY_KEY] });
    },
    onSuccess: () => {
      onSuccess?.();
    },
  });
};

export const deleteVTON = (onSuccess?: () => void, onError?: () => void) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (vton_id: string) => {
      const response = await axios.delete(`/vton/${vton_id}`);
      return response.data;
    },
    onMutate: async (vton_id) => {
      await queryClient.cancelQueries({ queryKey: [VTON_QUERY_KEY] });
      const previousVtons = queryClient.getQueriesData({ queryKey: [VTON_QUERY_KEY] });
      queryClient.setQueriesData(
        { queryKey: [VTON_QUERY_KEY] },
        (old: VTON[] | undefined) => {
          if (!old) return old;
          return old.filter((v) => v.id !== vton_id);
        }
      );
      return { previousVtons };
    },
    onError: (error, _vton_id, context) => {
      if (context?.previousVtons) {
        context.previousVtons.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      console.error(error);
      onError?.();
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [VTON_QUERY_KEY] });
    },
    onSuccess: () => {
      onSuccess?.();
    },
  });
};
