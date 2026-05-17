import { request } from "./http";

export function listTeams() {
  return request("/teams/");
}

export function createTeam(payload) {
  return request("/teams/", { method: "POST", body: JSON.stringify(payload) });
}
