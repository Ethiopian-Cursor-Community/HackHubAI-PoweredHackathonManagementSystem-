import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "../store/authStore";
import { useState } from "react";
import { request } from "../services/http";
import toast from "react-hot-toast";

export function JudgingPage() {
  const user = useAuthStore((s) => s.user);
  const [submissionId, setSubmissionId] = useState("");
  const [scores, setScores] = useState({ criteria_scores: [], total_score: 0, feedback: "" });

  const { data: scoresList, isLoading, refetch } = useQuery({
    queryKey: ["judging"],
    queryFn: () => request("/judging/"),
    enabled: user?.role === "judge" || user?.role === "admin",
  });

  const handleScoreSubmit = async (e) => {
    e.preventDefault();
    try {
      await request("/judging/", {
        method: "POST",
        body: JSON.stringify({ submission: submissionId, ...scores }),
      });
      toast.success("Score submitted");
      setScores({ criteria_scores: [], total_score: 0, feedback: "" });
      refetch();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleFinalize = async (scoreId) => {
    try {
      await request(`/judging/${scoreId}/finalize/`, { method: "POST" });
      toast.success("Score finalized");
      refetch();
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Judging Panel</h1>

      <div className="card mb-4">
        <h3 className="font-bold mb-3">Submit Score</h3>
        <form onSubmit={handleScoreSubmit} className="space-y-3">
          <div>
            <label className="block text-sm">Submission ID</label>
            <input value={submissionId} onChange={(e) => setSubmissionId(e.target.value)} required placeholder="Enter submission ID" />
          </div>
          <div>
            <label className="block text-sm">Total Score (0-100)</label>
            <input type="number" value={scores.total_score} onChange={(e) => setScores({ ...scores, total_score: Number(e.target.value) })} min={0} max={100} required />
          </div>
          <div>
            <label className="block text-sm">Feedback</label>
            <textarea rows={3} value={scores.feedback} onChange={(e) => setScores({ ...scores, feedback: e.target.value })} />
          </div>
          <button type="submit" className="btn">Submit Score</button>
        </form>
      </div>

      <h2 className="text-xl font-bold mb-2">Existing Scores</h2>
      {isLoading ? <p>Loading scores...</p> : (
        <div className="space-y-3">
          {scoresList?.length === 0 && <p className="text-[var(--muted)]">No scores yet.</p>}
          {scoresList?.map((score) => (
            <div key={score.id} className="card">
              <div className="flex items-start justify-between">
                <div>
                  <p><strong>Submission:</strong> {score.submission}</p>
                  <p><strong>Score:</strong> {score.total_score}</p>
                  <p><strong>Feedback:</strong> {score.feedback}</p>
                  <p className="text-xs text-[var(--muted)]">
                    Judge: {score.judge} · {score.is_finalized ? "✅ Finalized" : "📝 Draft"}
                  </p>
                </div>
                {!score.is_finalized && score.judge === user?.id && (
                  <button className="btn text-sm" onClick={() => handleFinalize(score.id)}>Finalize</button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}