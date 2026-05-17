import { io } from "socket.io-client";
import { useAuthStore } from "../store/authStore";
import { useNotificationStore } from "../store/notificationStore";

let socket = null;

export function connectSocket() {
  const { accessToken, user } = useAuthStore.getState();
  if (!accessToken || !user || socket?.connected) return socket;

  const wsBase = import.meta.env.VITE_SOCKET_URL || "http://localhost:8000";
  socket = io(wsBase, {
    auth: { token: accessToken },
    transports: ["websocket", "polling"],
    reconnection: true,
    reconnectionAttempts: 10,
    reconnectionDelay: 1000,
  });

  socket.on("connect", () => {
    console.log("[Socket] Connected:", socket.id);
  });

  socket.on("notification", (payload) => {
    useNotificationStore.getState().addNotification(payload);
  });

  socket.on("team:invite", (payload) => {
    useNotificationStore.getState().addNotification({
      ...payload,
      event_type: "team:invite",
    });
  });

  socket.on("team:join_request", (payload) => {
    useNotificationStore.getState().addNotification({
      ...payload,
      event_type: "team:join_request",
    });
  });

  socket.on("hackathon:announcement", (payload) => {
    useNotificationStore.getState().addNotification({
      ...payload,
      event_type: "hackathon:announcement",
    });
  });

  socket.on("results:published", (payload) => {
    useNotificationStore.getState().addNotification({
      ...payload,
      event_type: "results:published",
    });
  });

  socket.on("disconnect", (reason) => {
    console.log("[Socket] Disconnected:", reason);
  });

  socket.on("connect_error", (err) => {
    console.error("[Socket] Connection error:", err.message);
  });

  return socket;
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}

export function getSocket() {
  return socket;
}