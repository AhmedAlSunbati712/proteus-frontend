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

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto mb-10 w-full max-w-2xl">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Create New Try-On</CardTitle>
            <CardDescription>
              Upload one user photo and one outfit photo to start backend processing.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Button onClick={() => setIsCreateModalOpen(true)}>
              Upload Images
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Try-On History</h1>
          <p className="mt-2 text-muted-foreground">
            All of your past VTON jobs and generated outputs.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => refetch()}>
          Refresh
        </Button>
      </div>

      {isHistoryLoading ? (
        <div className="flex min-h-[30vh] items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : isError ? (
        <div className="flex min-h-[30vh] items-center justify-center">
          <p className="text-sm text-destructive">Failed to load your VTON history.</p>
        </div>
      ) : vtons.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>No VTON records yet</CardTitle>
            <CardDescription>
              Create your first try-on request using the form above.
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {vtons.map((entry) => {
            const isComplete = !!entry.outfit_try_on;
            return (
              <Card key={entry.id} className="overflow-hidden py-0">
                <CardContent className="p-0">
                  <div className="relative aspect-[4/5] bg-muted">
                    {entry.outfit_try_on ? (
                      <Image
                        objectKey={entry.outfit_try_on}
                        alt={`Try-on result ${entry.id}`}
                        className="h-full w-full object-cover"
                      />
                    ) : entry.user_snap ? (
                      <Image
                        objectKey={entry.user_snap}
                        alt={`User input ${entry.id}`}
                        className="h-full w-full object-cover opacity-70"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">
                        Waiting for image
                      </div>
                    )}

                    {!isComplete && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/45">
                        <span className="rounded-full bg-background/90 px-3 py-1 text-xs font-medium">
                          Processing
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-1 p-4">
                    <p className="text-xs text-muted-foreground">VTON ID: {entry.id}</p>
                    <p className="text-xs text-muted-foreground">
                      Updated {getDateLabel(entry.updatedAt)}
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <CreateVTONModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
      />
    </div>
  );
}
