import { Navigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { getVTONS } from "@/api/vton";
import Image from "@/components/Image/Image";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ROUTES } from "@/utils/constants";
import type { VTON } from "@/types/vton";

function getDateLabel(value: Date | string | undefined) {
  if (!value) return "Unknown date";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Unknown date";
  return date.toLocaleString();
}

function normalizeVtons(data: unknown): VTON[] {
  if (Array.isArray(data)) return data as VTON[];
  if (data && typeof data === "object" && Array.isArray((data as { data?: unknown[] }).data)) {
    return (data as { data: VTON[] }).data;
  }
  return [];
}

export default function HistoryPage() {
  const { user, isLoading: isAuthLoading } = useAuth();

  const {
    data,
    isLoading: isHistoryLoading,
    isError,
  } = getVTONS(user ? { user_id: user.id } : {});

  if (isAuthLoading || user === undefined) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to={ROUTES.AUTH} replace />;
  }

  if (isHistoryLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="mx-auto flex min-h-[60vh] w-full max-w-6xl items-center justify-center px-4">
        <p className="text-sm text-destructive">Failed to load your try-on history.</p>
      </div>
    );
  }

  const vtons = normalizeVtons(data)
    .filter((entry) => entry.user_id === user.id && !!entry.outfit_try_on)
    .sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight">Try-On History</h1>
        <p className="mt-2 text-muted-foreground">
          Review your previous generated outfit results.
        </p>
      </div>

      {vtons.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>No results yet</CardTitle>
            <CardDescription>
              No completed try-on outputs were found for your account yet.
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {vtons.map((entry) => (
            <Card key={entry.id} className="overflow-hidden py-0">
              <CardContent className="p-0">
                <div className="aspect-[4/5] bg-muted">
                  <Image
                    objectKey={entry.outfit_try_on!}
                    alt={`Try-on result ${entry.id}`}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <p className="text-xs text-muted-foreground">
                    Updated {getDateLabel(entry.updatedAt)}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
