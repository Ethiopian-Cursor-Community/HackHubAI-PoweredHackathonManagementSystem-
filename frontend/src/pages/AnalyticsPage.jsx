import { useEffect, useState } from "react";

import { getHackathonAnalytics, listHackathons } from "../services/api";
import { useApp } from "../context/AppContext";

export function AnalyticsPage() {
  const { isOrganizer, run } = useApp();
  const [hackathons, setHackathons] = useState([]);
  const [selectedHackathon, setSelectedHackathon] = useState("");
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    listHackathons().then(setHackathons).catch(() => setHackathons([]));
  }, []);

  if (!isOrganizer) {
    return (
      <section className="card">
        <h2>Analytics</h2>
        <p>Only organizers and admins can access analytics.</p>
      </section>
    );
  }

  return (
    <section className="card">
      <h2>Analytics</h2>
      <div className="form-grid">
        <select value={selectedHackathon} onChange={(e) => setSelectedHackathon(e.target.value)}>
          <option value="">Select hackathon</option>
          {hackathons.map((h) => (
            <option key={h.id} value={h.id}>
              {h.title}
            </option>
          ))}
        </select>
        <button
          className="btn"
          onClick={() => run(async () => setAnalytics(await getHackathonAnalytics(selectedHackathon)))}
          disabled={!selectedHackathon}
        >
          Load Analytics
        </button>
        {analytics && <pre className="json-preview">{JSON.stringify(analytics, null, 2)}</pre>}
      </div>
    </section>
  );
}
