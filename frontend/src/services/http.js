import { useAuthStore } from "../store/authStore";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api/v1";

async function refreshAccessToken() {
  const { refreshToken, setTokens, logout } = useAuthStore.getState();
  if (!refreshToken) {
    logout();
    return null;
  }
  try {
    const res = await fetch(`${API_BASE_URL}/auth/refresh-token/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh: refreshToken }),
    });
    if (!res.ok) {
      logout();
      return null;
    }
    const data = await res.json();
    setTokens(data.access, data.refresh);
    return data.access;
  } catch {
    logout();
    return null;
  }
}

export async function request(path, options = {}, retry = true) {
  const { accessToken } = useAuthStore.getState();
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };
  if (accessToken) headers.Authorization = `Bearer ${accessToken}`;

  const response = await fetch(`${API_BASE_URL}${path}`, { ...options, headers });

  if (response.status === 401 && retry) {
    const newToken = await refreshAccessToken();
    if (newToken) {
      headers.Authorization = `Bearer ${newToken}`;
      const retryRes = await fetch(`${API_BASE_URL}${path}`, {
        ...options,
        headers,
      });
      if (!retryRes.ok) {
        const data = await retryRes.json().catch(() => ({}));
        throw new Error(data.detail || "Request failed");
      }
      if (retryRes.status === 204) return null;
      return retryRes.json();
    }
  }

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.detail || "Request failed");
  }
  if (response.status === 204) return null;
  return response.json();
}

export async function uploadFile(path, formData) {
  const { accessToken } = useAuthStore.getState();
  const headers = {};
  if (accessToken) headers.Authorization = `Bearer ${accessToken}`;

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers,
    body: formData,
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.detail || "Upload failed");
  }
  return response.json();
}

export { API_BASE_URL };