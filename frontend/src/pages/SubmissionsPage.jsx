import { useSubmissions, useCreateSubmission, useSubmitSubmission, useTriggerAiEvaluation } from "../hooks/useSubmission";
import { useAuthStore } from "../store/authStore";
import { useState } from "react";

export function SubmissionsPage() {
  const { data: submissions, isLoading } = useSubmissions();
  const user = useAuthStore((s) => s.user);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ team: "", project_title: "", description: "", github_url: "", tech_stack: [] });

  const createMutation = useCreateSubmission();
  const submitMutation = useSubmitSubmission();
  const aiMutation = useTriggerAiEvaluation();

  const handleCreate = (e) => {
    e.preventDefault();
    createMutation.mutate(form, { onSuccess: () => { setShowForm(false); setForm({ team: "", project_title: "", description: "", github_url: "", tech_stack: [] }); } });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Submissions</h1>
        {user?.role === "participant" && <button className="btn" onClick={() => setShowForm(!showForm)}>{showForm ? "Cancel" : "+ New Submission"}</button>}
      </div>

      {showForm && (
        <div className="card mb-4">
          <h3 className="font-bold mb-3">Create Submission</h3>
          <form onSubmit={handleCreate} className="space-y-3">
            <div>
              <label className="block text-sm">Team ID</label>
              <input value={form.team} onChange={(e) => setForm({ ...form, team: e.target.value })} required />
            </div>
            <div>
              <label className="block text-sm">Project Title</label>
              <input value={form.project_title} onChange={(e) => setForm({ ...form, project_title: e.target.value })} required />
            </div>
            <div>
              <label className="block text-sm">Description</label>
              <textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
            </div>
            <div>
              <label className="block text-sm">GitHub URL</label>
              <input value={form.github_url} onChange={(e) => setForm({ ...form, github_url: e.target.value })} required placeholder="https://github.com/..." />
            </div>
            <div>
              <label className="block text-sm">Tech Stack (comma separated)</label>
              <input value={form.tech_stack.join(",")} onChange={(e) => setForm({ ...form, tech_stack: e.target.value.split(",").map(s => s.trim()) })} />
            </div>
            <button type="submit" className="btn">Create</button>
          </form>
        </div>
      )}

      {isLoading ? <p>Loading submissions...</p> : (
        <div className="space-y-3">
          {submissions?.length === 0 && <p className="text-[var(--muted)]">No submissions found.</p>}
          {submissions?.map((sub) => (
            <div key={sub.id} className="card">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-bold m-0">{sub.project_title}</h3>
                  <p className="text-sm text-[var(--muted)] m-0">{sub.description?.slice(0, 200)}</p>
                  <div className="flex gap-2 mt-1 text-xs text-[var(--muted)]">
                    <span>Status: {sub.status}</span>
                    <span>Score: {sub.final_score ?? "—"}</span>
                    <span>Rank: {sub.rank ?? "—"}</span>
                  </div>
                  {sub.tech_stack?.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {sub.tech_stack.map((t, i) => <span key={i} className="badge">{t}</span>)}
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-1.5 shrink-0">
                  {sub.status === "draft" && <button className="btn text-sm" onClick={() => submitMutation.mutate(sub.id)}>Submit</button>}
                  {(user?.role === "organizer" || user?.role === "judge") && (
                    <button className="btn btn-ghost text-sm" onClick={() => aiMutation.mutate(sub.id)}>AI Evaluate</button>
                  )}
                </div>
              </div>
              {sub.ai_evaluation && Object.keys(sub.ai_evaluation).length > 0 && (
                <div className="mt-3 p-3 bg-[var(--surface-2)] rounded-lg text-sm">
                  <strong>AI Evaluation:</strong>
                  <pre className="json-preview mt-1">{JSON.stringify(sub.ai_evaluation, null, 2)}</pre>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}