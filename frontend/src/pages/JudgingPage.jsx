import { useEffect, useState } from "react";

import {
  createScore,
  finalizeScore,
  getLeaderboard,
  listHackathons,
  listScores,
  listSubmissions
} from "../services/api";
import { useApp } from "../context/AppContext";

export function JudgingPage() {
  const { isJudge, run, loading } = useApp();
  const [scores, setScores] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [hackathons, setHackathons] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [selectedHackathon, setSelectedHackathon] = useState("");
  const [payload, setPayload] = useState({
    submission: "",
    criteria_scores: [],
    total_score: 0,
    feedback: ""
  });

  const load = async () => {
    const [scoreData, submissionData, hackathonData] = await Promise.all([
      listScores(),
      listSubmissions(),
      listHackathons()
    ]);
    setScores(scoreData);
    setSubmissions(submissionData);
    setHackathons(hackathonData);
  };

  useEffect(() => {
    load();
  }, []);

  if (!isJudge) {
    return (
      <section className="card">
        <h2>Judging</h2>
        <p>Only judges and admins can access this page.</p>
      </section>
    );
  }

  return (
    <section className="card">
      <h2>Judging</h2>
      <div className="list">
        {scores.map((score) => (
          <article key={score.id} className="list-item">
            <div>
              <strong>Submission #{score.submission}</strong>
              <p>Total: {score.total_score} • finalized: {String(score.is_finalized)}</p>
            </div>
            <button
              className="btn btn-ghost"
              onClick={() =>
                run(async () => {
                  await finalizeScore(score.id);
                  await load();
                }, "Score finalized")
              }
            >
              Finalize
            </button>
          </article>
        ))}
      </div>

      <form
        className="form-grid"
        onSubmit={(e) => {
          e.preventDefault();
          run(async () => {
            await createScore(payload);
            setPayload({ submission: "", criteria_scores: [], total_score: 0, feedback: "" });
            await load();
          }, "Score saved");
        }}
      >
        <h3>Add Score</h3>
        <select
          value={payload.submission}
          onChange={(e) => setPayload((s) => ({ ...s, submission: e.target.value }))}
          required
        >
          <option value="">Select submission</option>
          {submissions.map((sub) => (
            <option key={sub.id} value={sub.id}>
              {sub.project_title}
            </option>
          ))}
        </select>
        <input
          type="number"
          min={0}
          max={100}
          value={payload.total_score}
          onChange={(e) => setPayload((s) => ({ ...s, total_score: Number(e.target.value) }))}
          required
        />
        <textarea
          placeholder="Feedback"
          value={payload.feedback}
          onChange={(e) => setPayload((s) => ({ ...s, feedback: e.target.value }))}
        />
        <button className="btn" type="submit" disabled={loading}>
          Save Score
        </button>
      </form>

      <div className="form-grid">
        <h3>Leaderboard</h3>
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
          onClick={() => run(async () => setLeaderboard(await getLeaderboard(selectedHackathon)))}
          disabled={!selectedHackathon}
        >
          Load Leaderboard
        </button>
        <div className="list">
          {leaderboard.map((row) => (
            <article key={row.id} className="list-item">
              <strong>{row.project_title}</strong>
              <p>
                {row.team__name} • {row.final_score}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
