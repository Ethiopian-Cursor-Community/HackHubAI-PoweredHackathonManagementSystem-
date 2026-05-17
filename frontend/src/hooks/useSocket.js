import { useEffect } from "react";
import { useAuthStore } from "../store/authStore";
import { connectSocket, disconnectSocket } from "../services/socket";

export function useSocket() {
  const { accessToken, user } = useAuthStore();

  useEffect(() => {
    if (accessToken && user) {
      connectSocket();
      return () => {
        disconnectSocket();
      };
    }
  }, [accessToken, user?.id]);

  return { connected: !!accessToken && !!user };
}