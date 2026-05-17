const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api/v1";
const ACCESS_TOKEN_KEY = "hackhub_access_token";
const REFRESH_TOKEN_KEY = "hackhub_refresh_token";

export function setTokens({ access, refresh }) {
  if (access) localStorage.setItem(ACCESS_TOKEN_KEY, access);
  if (refresh) localStorage.setItem(REFRESH_TOKEN_KEY, refresh);
}

export function clearTokens() {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
}

export function getAccessToken() {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

function getRefreshToken() {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

export async function request(path, options = {}, retry = true) {
  const token = getAccessToken();
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {})
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(`${API_BASE_URL}${path}`, { ...options, headers });

  if (response.status === 401 && retry && getRefreshToken()) {
    const refreshed = await refreshToken();
    if (refreshed?.access) return request(path, options, false);
  }

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.detail || "Request failed");
  }
  if (response.status === 204) return null;
  return response.json();
}

export async function refreshToken() {
  const refresh = getRefreshToken();
  if (!refresh) return null;
  const data = await request(
    "/auth/refresh-token/",
    { method: "POST", body: JSON.stringify({ refresh }) },
    false
  );
  setTokens({ access: data.access, refresh: data.refresh });
  return data;
}
