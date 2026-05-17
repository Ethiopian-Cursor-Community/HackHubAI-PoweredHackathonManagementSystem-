import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "react-router-dom";
import { request } from "../services/http";

export function VerifyCertificatePage() {
  const { verificationId } = useParams();

  const { data, isLoading, error } = useQuery({
    queryKey: ["certificate-verify", verificationId],
    queryFn: () => request(`/certificates/verify/${verificationId}/`, { method: "GET" }, false),
    enabled: !!verificationId,
  });

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="card max-w-md w-full text-center">
        {isLoading && <p>Verifying certificate...</p>}
        {error && <p className="text-red-500">Verification failed: {error.message}</p>}
        {data && (
          <>
            {data.valid ? (
              <>
                <div className="text-5xl mb-4">✅</div>
                <h2 className="text-xl font-bold mb-2">Valid Certificate</h2>
                <div className="text-left space-y-2">
                  <p><strong>Holder:</strong> {data.certificate.holder}</p>
                  <p><strong>Hackathon:</strong> {data.certificate.hackathon}</p>
                  <p><strong>Issued:</strong> {new Date(data.certificate.issued_at).toLocaleDateString()}</p>
                  <p><strong>Verification ID:</strong></p>
                  <code className="text-sm break-all bg-[var(--surface-2)] p-2 rounded block">{data.certificate.verification_id}</code>
                </div>
              </>
            ) : (
              <>
                <div className="text-5xl mb-4">❌</div>
                <h2 className="text-xl font-bold mb-2">Invalid Certificate</h2>
                <p>This verification ID could not be found in our records.</p>
              </>
            )}
            <Link to="/certificates" className="btn mt-4 inline-block">View My Certificates</Link>
          </>
        )}
      </div>
    </div>
  );
}