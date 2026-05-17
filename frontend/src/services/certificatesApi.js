import { request } from "./http";

export function listCertificates() {
  return request("/certificates/");
}

export function verifyCertificate(verificationId) {
  return request(`/certificates/verify/${verificationId}/`, { method: "GET" }, false);
}
