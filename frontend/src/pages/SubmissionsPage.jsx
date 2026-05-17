import { useEffect, useState } from "react";

import {
  createSubmission,
  listSubmissions,
  listTeams,
  submitSubmission,
  triggerAiEvaluation
} from "../services/api";
import { useApp } from "../context/AppContext";

export function SubmissionsPage() {
  const { isParticipant, isOrganizer, isJudge, run, loading } = useApp();
  const [submissions, setSubmissions] = useState([]);
  const [teams, setTeams] = useState([]);
  const [payload, setPayload] = useState({
    team: "",
    project_title: "",
    description: "",
    github_url: "",
    demo_url: "",
    video_url: "",
    tech_stack: []
  });

  const load = async () => {
    const [submissionData, teamData] = await Promise.all([listSubmissions(), listTeams()]);
    setSubmissions(submissionData);
    setTeams(teamData);
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <section className="card">
      <h2>Submissions</h2>
      <div className="list">
        {submissions.map((sub) => (
          <article key={sub.id} className="list-item">
            <div>
              <strong>{sub.project_title}</strong>
              <p>Status: {sub.status}</p>
            </div>
            <div className="row-actions">
              {isParticipant && (
                <button
                  className="btn btn-ghost"
                  onClick={() => run(async () => {
                    await submitSubmission(sub.id);
                    await load();
                  }, "Submission sent")}
                >
                  Submit
                </button>
              )}
              {(isOrganizer || isJudge) && (
                <button className="btn btn-ghost" onClick={() => run(() => triggerAiEvaluation(sub.id), "AI evaluated")}>
                  AI Evaluate
                </button>
              )}
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
              await createSubmission(payload);
              setPayload({
                team: "",
                project_title: "",
                description: "",
                github_url: "",
                demo_url: "",
                video_url: "",
                tech_stack: []
              });
              await load();
            }, "Submission created");
          }}
        >
          <h3>Create Submission</h3>
          <select
            value={payload.team}
            onChange={(e) => setPayload((s) => ({ ...s, team: e.target.value }))}
            required
          >
            <option value="">Select team</option>
            {teams.map((team) => (
              <option key={team.id} value={team.id}>
                {team.name}
              </option>
            ))}
          </select>
          <input
            placeholder="Project title"
            value={payload.project_title}
            onChange={(e) => setPayload((s) => ({ ...s, project_title: e.target.value }))}
            required
          />
          <textarea
            placeholder="Project description"
            value={payload.description}
            onChange={(e) => setPayload((s) => ({ ...s, description: e.target.value }))}
            required
          />
          <input
            placeholder="GitHub URL"
            type="url"
            value={payload.github_url}
            onChange={(e) => setPayload((s) => ({ ...s, github_url: e.target.value }))}
            required
          />
          <input
            placeholder="Demo URL"
            type="url"
            value={payload.demo_url}
            onChange={(e) => setPayload((s) => ({ ...s, demo_url: e.target.value }))}
          />
          <button className="btn" type="submit" disabled={loading}>
            Save Submission
          </button>
        </form>
      )}
    </section>
  );
}
