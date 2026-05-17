import { request } from "./http";

export function getHackathonAnalytics(hackathonId) {
  return request(`/analytics/hackathons/${hackathonId}/`);
}
