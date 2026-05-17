import { request } from "./http";
import { useAuthStore } from "../store/authStore";

export function getHealth() {
  return request("/health/", { method: "GET" }, false);
}

export function register(payload) {
  return request("/auth/register/", {
    method: "POST",
    body: JSON.stringify(payload),
  }, false);
}

export async function login({ email, password }) {
  const data = await request("/auth/login/", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  }, false);
  useAuthStore.getState().setTokens(data.access, data.refresh);
  return data;
}

export async function logout() {
  const { refreshToken, logout: clearAuth } = useAuthStore.getState();
  if (refreshToken) {
    await request("/auth/logout/", {
      method: "POST",
      body: JSON.stringify({ refresh: refreshToken }),
    }, false).catch(() => null);
  }
  clearAuth();
}

export function getMe() {
  return request("/auth/me/");
}