import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import {
  getMe,
  login as loginApi,
  register as registerApi,
  logout as logoutApi,
} from "../services/authApi";
import { connectSocket, disconnectSocket } from "../services/socket";
import toast from "react-hot-toast";

export function useAuth() {
  const { user, setAuth, setUser, logout: clearAuth } = useAuthStore();
  const navigate = useNavigate();

  const { refetch: refreshMe } = useQuery({
    queryKey: ["me"],
    queryFn: getMe,
    enabled: !!useAuthStore.getState().accessToken,
    retry: 1,
    staleTime: 5 * 60 * 1000,
    onSuccess: (data) => {
      setUser(data);
      connectSocket();
    },
    onError: () => {
      clearAuth();
      disconnectSocket();
    },
  });

  const loginMutation = useMutation({
    mutationFn: loginApi,
    onSuccess: (data, variables) => {
      setAuth(data.user || { email: variables.email }, data.access, data.refresh);
      toast.success("Logged in successfully");
      connectSocket();
      navigate("/hackathons");
    },
    onError: (err) => {
      toast.error(err.message || "Login failed");
    },
  });

  const registerMutation = useMutation({
    mutationFn: registerApi,
    onSuccess: () => {
      toast.success("Account created! Please log in.");
      navigate("/login");
    },
    onError: (err) => {
      toast.error(err.message || "Registration failed");
    },
  });

  const logoutMutation = useMutation({
    mutationFn: logoutApi,
    onSuccess: () => {
      clearAuth();
      disconnectSocket();
      toast.success("Logged out");
      navigate("/");
    },
    onError: () => {
      clearAuth();
      disconnectSocket();
      navigate("/");
    },
  });

  return {
    user,
    isAuthenticated: !!user,
    login: loginMutation.mutate,
    register: registerMutation.mutate,
    logout: logoutMutation.mutate,
    refreshMe,
    isLoading:
      loginMutation.isPending ||
      registerMutation.isPending ||
      logoutMutation.isPending,
  };
}