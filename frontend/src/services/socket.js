// Native WebSocket implementation (replaces Socket.IO)
// Backend uses Django Channels with raw WebSocket at ws://host:port/ws/notifications/
import { useAuthStore } from "../store/authStore";
import { useNotificationStore } from "../store/notificationStore";

let socket = null;
let reconnectTimer = null;
let reconnectAttempts = 0;
const MAX_RECONNECT_ATTEMPTS = 10;
const RECONNECT_DELAY_MS = 1000;

function getWebSocketUrl() {
  const wsBase =
    import.meta.env.VITE_SOCKET_URL || "http://localhost:8000";
  // Convert http/https to ws/wss and append the Django Channels path
  const wsUrl = wsBase
    .replace(/^http:/, "ws:")
    .replace(/^https:/, "wss:");
  return `${wsUrl}/ws/notifications/`;
}

function scheduleReconnect() {
  if (reconnectTimer) {
    clearTimeout(reconnectTimer);
    reconnectTimer = null;
  }
  if (reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
    console.error("[Socket] Max reconnect attempts reached");
    return;
  }
  reconnectAttempts += 1;
  reconnectTimer = setTimeout(() => {
    connectSocket();
  }, RECONNECT_DELAY_MS * reconnectAttempts);
}

export function connectSocket() {
  const { accessToken, user } = useAuthStore.getState();
  if (!accessToken || !user || (socket && socket.readyState === WebSocket.OPEN)) {
    return socket;
  }

  // Close existing socket if any
  if (socket) {
    socket.close();
    socket = null;
  }

  const wsUrl = getWebSocketUrl();
  console.log("[Socket] Connecting to:", wsUrl);

  socket = new WebSocket(wsUrl);

  socket.onopen = () => {
    console.log("[Socket] Connected");
    reconnectAttempts = 0;
    // Send JWT token as first message for authentication
    if (accessToken) {
      socket.send(JSON.stringify({ type: "auth", token: accessToken }));
    }
  };

  socket.onmessage = (event) => {
    try {
      const payload = JSON.parse(event.data);
      console.log("[Socket] Message received:", payload.type || "notification");

      // Handle different message types
      if (payload.type === "notification" ||
          payload.event_type === "team:invite" ||
          payload.event_type === "team:join_request" ||
          payload.event_type === "hackathon:announcement" ||
          payload.event_type === "results:published") {
        useNotificationStore.getState().addNotification(payload);
      } else if (!payload.type || payload.type === "notification") {
        // Generic notification fallback
        useNotificationStore.getState().addNotification(payload);
      }
    } catch (err) {
      console.error("[Socket] Failed to parse message:", err);
    }
  };

  socket.onclose = (event) => {
    console.log("[Socket] Disconnected (code:", event.code, ")");
    socket = null;
    if (event.code !== 1000 && event.code !== 4401) {
      // Unexpected close – attempt reconnect
      scheduleReconnect();
    }
  };

  socket.onerror = (err) => {
    console.error("[Socket] Error:", err);
  };

  return socket;
}

export function disconnectSocket() {
  if (reconnectTimer) {
    clearTimeout(reconnectTimer);
    reconnectTimer = null;
  }
  if (socket) {
    socket.close(1000, "Client disconnecting");
    socket = null;
  }
  reconnectAttempts = 0;
}

export function getSocket() {
  return socket;
}