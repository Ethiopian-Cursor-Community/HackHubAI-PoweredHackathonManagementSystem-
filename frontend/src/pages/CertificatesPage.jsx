import { useEffect, useState } from "react";

import { listCertificates, verifyCertificate } from "../services/api";
import { useApp } from "../context/AppContext";

export function CertificatesPage() {
  const { run } = useApp();
  const [certificates, setCertificates] = useState([]);
  const [verificationId, setVerificationId] = useState("");
  const [result, setResult] = useState(null);

  const load = async () => {
    const data = await listCertificates();
    setCertificates(data);
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <section className="card">
      <h2>Certificates</h2>
      <div className="list">
        {certificates.map((c) => (
          <article key={c.id} className="list-item">
            <div>
              <strong>Hackathon #{c.hackathon}</strong>
              <p>Verification ID: {c.verification_id}</p>
            </div>
          </article>
        ))}
      </div>

      <div className="form-grid">
        <h3>Verify Certificate</h3>
        <input
          value={verificationId}
          onChange={(e) => setVerificationId(e.target.value)}
          placeholder="Enter verification id"
        />
        <button
          className="btn"
          onClick={() => run(async () => setResult(await verifyCertificate(verificationId)))}
          disabled={!verificationId}
        >
          Verify
        </button>
        {result && <pre className="json-preview">{JSON.stringify(result, null, 2)}</pre>}
      </div>
    </section>
  );
}
