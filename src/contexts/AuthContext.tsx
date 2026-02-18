import { createContext, useContext, useMemo } from "react";
import { getUser } from "@/api/user";
import type { User } from "@/types/user";

type AuthUser = Pick<User, "id" | "user_name" | "email">;

interface AuthContextValue {
  user: AuthUser | null | undefined;
  isLoading: boolean;
  isError: boolean;
  refetch: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data, isLoading, isError, refetch } = getUser();

  const value = useMemo<AuthContextValue>(() => {
    const user =
      !isError && data && typeof data === "object" && "id" in data
        ? { id: data.id, user_name: data.user_name, email: data.email }
        : null;

    return {
      user: isLoading ? undefined : user,
      isLoading,
      isError,
      refetch,
    };
  }, [data, isLoading, isError, refetch]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
