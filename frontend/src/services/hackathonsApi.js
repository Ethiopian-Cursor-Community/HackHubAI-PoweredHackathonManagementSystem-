import { request } from "./http";

export function listHackathons() {
  return request("/hackathons/", { method: "GET" }, false);
}

export function createHackathon(payload) {
  return request("/hackathons/", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export function registerHackathon(hackathonId) {
  return request(`/hackathons/${hackathonId}/register/`, { method: "POST", body: JSON.stringify({}) });
}

export function publishHackathon(hackathonId) {
  return request(`/hackathons/${hackathonId}/publish/`, { method: "POST", body: JSON.stringify({}) });
}

export function announceHackathon(hackathonId, message) {
  return request(`/hackathons/${hackathonId}/announce/`, {
    method: "POST",
    body: JSON.stringify({ message })
  });
}

export function publishResults(hackathonId) {
  return request(`/hackathons/${hackathonId}/results/publish/`, { method: "POST", body: JSON.stringify({}) });
}
