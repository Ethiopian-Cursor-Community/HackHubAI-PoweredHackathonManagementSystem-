import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { getHealth, getMe } from "../services/api";
import { useAuthStore } from "../store/authStore";
import { connectSocket } from "../services/socket";

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [health, setHealth] = useState("checking...");
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    getHealth()
      .then(() => setHealth("connected"))
      .catch(() => setHealth("offline"));
  }, []);

  // Connect socket when user is available
  useEffect(() => {
    if (user) {
      connectSocket();
    }
  }, [user]);

  const value = useMemo(() => ({ health }), [health]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error("useApp must be used inside AppProvider");
  }
  return ctx;
}