import { getAccessToken } from "./http";

export function createNotificationsSocket(onMessage) {
  const token = getAccessToken();
  if (!token) return null;

  const wsBase = import.meta.env.VITE_WS_BASE_URL || "ws://localhost:8000";
  const url = `${wsBase.replace(/\/$/, "")}/ws/notifications/?token=${encodeURIComponent(token)}`;
  const socket = new WebSocket(url);

  socket.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      onMessage?.(data);
    } catch {
      // ignore malformed payloads
    }
  };

  return socket;
}
