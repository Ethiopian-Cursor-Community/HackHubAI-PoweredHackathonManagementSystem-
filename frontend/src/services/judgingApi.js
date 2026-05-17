import { request } from "./http";

export function listScores() {
  return request("/judging/");
}

export function createScore(payload) {
  return request("/judging/", { method: "POST", body: JSON.stringify(payload) });
}

export function finalizeScore(scoreId) {
  return request(`/judging/${scoreId}/finalize/`, { method: "POST", body: JSON.stringify({}) });
}

export function getLeaderboard(hackathonId) {
  return request(`/judging/leaderboard/${hackathonId}/`);
}
