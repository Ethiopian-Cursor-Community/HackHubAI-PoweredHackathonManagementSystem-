import { useQuery } from "@tanstack/react-query";
import { request } from "../services/http";
import { Link } from "react-router-dom";

export function CertificatesPage() {
  const { data: certificates, isLoading } = useQuery({
    queryKey: ["certificates"],
    queryFn: () => request("/certificates/"),
  });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">🏅 Certificates</h1>
      {isLoading ? <p>Loading certificates...</p> : (
        <div className="space-y-3">
          {certificates?.length === 0 && <p className="text-[var(--muted)]">No certificates yet. Participate in hackathons to earn them!</p>}
          {certificates?.map((cert) => (
            <div key={cert.id} className="card">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-bold m-0">Certificate #{cert.id}</h3>
                  <p className="text-sm text-[var(--muted)]">Verification ID:</p>
                  <code className="text-xs break-all">{cert.verification_id}</code>
                  <p className="text-xs text-[var(--muted)] mt-1">Issued: {new Date(cert.created_at).toLocaleDateString()}</p>
                </div>
                <Link to={`/certificates/verify/${cert.verification_id}`} className="btn btn-ghost text-sm">
                  Verify
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}