import { clearTokens, request, setTokens } from "./http";

export function getHealth() {
  return request("/health/", { method: "GET" }, false);
}

export function register(payload) {
  return request("/auth/register/", {
    method: "POST",
    body: JSON.stringify(payload)
  }, false);
}

export async function login({ email, password }) {
  const data = await request("/auth/login/", {
    method: "POST",
    body: JSON.stringify({ email, password })
  }, false);
  setTokens({ access: data.access, refresh: data.refresh });
  return data;
}

export async function logout() {
  const refresh = localStorage.getItem("hackhub_refresh_token");
  if (refresh) {
    await request(
      "/auth/logout/",
      {
        method: "POST",
        body: JSON.stringify({ refresh })
      },
      false
    ).catch(() => null);
  }
  clearTokens();
}

export function getMe() {
  return request("/auth/me/");
}
