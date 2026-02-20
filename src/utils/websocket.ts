import axios from "@/api/axios";

const BASE_API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

function getWsUrl(): string {
  const url = new URL(BASE_API_URL);
  const protocol = url.protocol === "https:" ? "wss" : "ws";
  return `${protocol}://${url.host}/ws`;
}

/**
 * Payload received when a job completes (from events:job_done Redis channel).
 * General JobDoneEvent; infer job type from job_type ("tailor" | "try_on").
 */
export interface JobDoneEvent {
  job_id: string;
  job_type: "tailor" | "try_on";
  status: "done" | "failed";
  user_id: string;
  vton_id: string;
  result_s3_key: string | null;
  error: string | null;
  finished_at: string;
}

export interface ConnectWebSocketOptions {
  /**
   * Called when the WebSocket connection is successfully established.
   * Use this to queue jobs (e.g. tailor/weaver) so you're guaranteed to be listening
   * before any result arrives. Receives the connected WebSocket instance.
   */
  onSuccess?: (ws: WebSocket) => void;
  /**
   * Called when connection fails or errors occur.
   */
  onError?: (error: Event | Error) => void;
  /**
   * Custom handler for incoming messages (events:job_done payloads).
   */
  onMessage?: (payload: JobDoneEvent) => void;
}

/**
 * Fetches a WebSocket token using the current session (cookie auth).
 */
async function fetchWsToken(): Promise<string | null> {
  try {
    const response = await axios.get<{ token: string }>("/user/ws-token");
    return response.data?.token ?? null;
  } catch {
    return null;
  }
}

/**
 * Connects to the backend WebSocket, authenticates with JWT, and wires up
 * the provided callbacks.
 *
 * - onSuccess: Called when connected. Queue jobs here so the WebSocket is
 *   ready before results can arrive.
 * - onError: Called on connection failure or errors.
 * - onMessage: Called for each job completion event (job_type: tailor | try_on).
 *
 * @returns Object with disconnect() to close the connection.
 */
export function connectWebSocket(
  options: ConnectWebSocketOptions = {}
): { disconnect: () => void } {
  const { onSuccess, onError, onMessage } = options;

  let ws: WebSocket | null = null;

  const connect = async () => {
    const token = await fetchWsToken();
    if (!token) {
      onError?.(new Error("Failed to get WebSocket token. Are you logged in?"));
      return;
    }

    const url = `${getWsUrl()}?token=${encodeURIComponent(token)}`;
    const socket = new WebSocket(url);

    socket.onopen = () => {
      onSuccess?.(socket);
    };

    socket.onerror = (event) => {
      onError?.(event);
    };

    socket.onclose = (event) => {
      if (!event.wasClean && event.code !== 1000) {
        onError?.(new Error(`WebSocket closed: ${event.code} ${event.reason || "Connection closed"}`));
      }
    };

    socket.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data) as JobDoneEvent;
        onMessage?.(payload);
      } catch (err) {
        console.error("Failed to parse WebSocket message:", err);
      }
    };

    ws = socket;
  };

  connect();

  return {
    disconnect: () => {
      if (ws) {
        ws.close(1000, "Client disconnect");
        ws = null;
      }
    },
  };
}
