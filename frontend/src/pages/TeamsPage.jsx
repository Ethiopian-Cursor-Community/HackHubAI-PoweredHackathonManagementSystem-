import { useEffect, useState } from "react";

import { createTeam, listHackathons, listTeams } from "../services/api";
import { useApp } from "../context/AppContext";

export function TeamsPage() {
  const { isParticipant, run, loading } = useApp();
  const [teams, setTeams] = useState([]);
  const [hackathons, setHackathons] = useState([]);
  const [payload, setPayload] = useState({ name: "", hackathon: "" });

  const load = async () => {
    const [teamData, hackathonData] = await Promise.all([listTeams(), listHackathons()]);
    setTeams(teamData);
    setHackathons(hackathonData);
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <section className="card">
      <h2>Teams</h2>
      <div className="list">
        {teams.map((team) => (
          <article key={team.id} className="list-item">
            <div>
              <strong>{team.name}</strong>
              <p>Status: {team.status}</p>
            </div>
          </article>
        ))}
      </div>

      {isParticipant && (
        <form
          className="form-grid"
          onSubmit={(e) => {
            e.preventDefault();
            run(async () => {
              await createTeam(payload);
              setPayload({ name: "", hackathon: "" });
              await load();
            }, "Team created");
          }}
        >
          <h3>Create Team</h3>
          <input
            placeholder="Team name"
            value={payload.name}
            onChange={(e) => setPayload((s) => ({ ...s, name: e.target.value }))}
            required
          />
          <select
            value={payload.hackathon}
            onChange={(e) => setPayload((s) => ({ ...s, hackathon: e.target.value }))}
            required
          >
            <option value="">Select hackathon</option>
            {hackathons.map((h) => (
              <option key={h.id} value={h.id}>
                {h.title}
              </option>
            ))}
          </select>
          <button className="btn" type="submit" disabled={loading}>
            Create Team
          </button>
        </form>
      )}
    </section>
  );
}
