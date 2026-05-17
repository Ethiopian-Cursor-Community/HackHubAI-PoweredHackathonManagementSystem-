import { request } from "./http";

export function listSubmissions() {
  return request("/submissions/");
}

export function createSubmission(payload) {
  return request("/submissions/", { method: "POST", body: JSON.stringify(payload) });
}

export function submitSubmission(submissionId) {
  return request(`/submissions/${submissionId}/submit/`, { method: "POST", body: JSON.stringify({}) });
}

export function triggerAiEvaluation(submissionId) {
  return request(`/ai/evaluate/submissions/${submissionId}/`, { method: "POST", body: JSON.stringify({}) });
}
