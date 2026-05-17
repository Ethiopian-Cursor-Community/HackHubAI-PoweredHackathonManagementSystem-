import { createContext, useContext, useEffect, useMemo, useState } from "react";

import { getHealth, getMe, login, logout, register } from "../services/api";
import { createNotificationsSocket } from "../services/socket";

const AppContext = createContext(null);

const initialRegisterForm = {
  email: "",
  username: "",
  password: "",
  role: "participant",
  first_name: "",
  last_name: "",
  skills: []
};

export function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  const [health, setHealth] = useState("checking...");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [realtimeNotifications, setRealtimeNotifications] = useState([]);
  const [theme, setTheme] = useState(() => localStorage.getItem("hackhub_theme") || "light");

  const clearMessages = () => {
    setError("");
    setSuccess("");
  };

  const run = async (fn, successMessage) => {
    setLoading(true);
    clearMessages();
    try {
      const result = await fn();
      if (successMessage) {
        setSuccess(successMessage);
      }
      return result;
    } catch (err) {
      setError(err.message || "Something went wrong");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const refreshMe = async () => {
    try {
      const me = await getMe();
      setUser(me);
      return me;
    } catch {
      setUser(null);
      return null;
    }
  };

  const loginAction = async (payload) => {
    await run(() => login(payload), "Logged in");
    await refreshMe();
  };

  const registerAction = async (payload) => {
    await run(() => register(payload), "Account created");
    await run(() => login({ email: payload.email, password: payload.password }), "Logged in");
    await refreshMe();
  };

  const logoutAction = async () => {
    await run(() => logout(), "Logged out");
    setUser(null);
    setRealtimeNotifications([]);
  };

  useEffect(() => {
    getHealth()
      .then(() => setHealth("connected"))
      .catch(() => setHealth("offline"));
    refreshMe();
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("hackhub_theme", theme);
  }, [theme]);

  useEffect(() => {
    if (!user) {
      return undefined;
    }
    const socket = createNotificationsSocket((payload) => {
      setRealtimeNotifications((prev) => [payload, ...prev].slice(0, 50));
      setSuccess(payload?.title ? `New notification: ${payload.title}` : "New notification");
    });

    return () => {
      if (socket && socket.readyState === WebSocket.OPEN) {
        socket.close(1000, "component unmount");
      } else if (socket) {
        socket.close();
      }
    };
  }, [user]);

  const value = useMemo(
    () => ({
      user,
      health,
      error,
      success,
      loading,
      realtimeNotifications,
      initialRegisterForm,
      setError,
      setSuccess,
      clearMessages,
      run,
      refreshMe,
      loginAction,
      registerAction,
      logoutAction,
      clearRealtimeNotifications: () => setRealtimeNotifications([]),
      theme,
      toggleTheme: () => setTheme((prev) => (prev === "light" ? "dark" : "light")),
      isOrganizer: user?.role === "organizer" || user?.role === "admin",
      isJudge: user?.role === "judge" || user?.role === "admin",
      isParticipant: user?.role === "participant" || user?.role === "admin"
    }),
    [user, health, error, success, loading, realtimeNotifications, theme]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error("useApp must be used inside AppProvider");
  }
  return ctx;
}
