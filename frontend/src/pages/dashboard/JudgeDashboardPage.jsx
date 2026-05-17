import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { request } from "../../services/http";
import { DashboardShell } from "../../components/dashboard/DashboardShell";

export function JudgeDashboardPage() {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const { data: scores } = useQuery({
    queryKey: ["judge-scores"],
    queryFn: () => request("/judging/"),
  });

  const { data: submissions } = useQuery({
    queryKey: ["judge-submissions"],
    queryFn: () => request("/submissions/"),
  });

  const finalizedCount = scores?.filter(s => s.is_finalized).length || 0;
  const pendingCount = scores?.filter(s => !s.is_finalized).length || 0;
  const ungraded = (submissions?.length || 0) - (scores?.length || 0);

  return (
    <DashboardShell title="Judge Dashboard">
      {/* Welcome */}
      <div className="bg-gradient-to-br from-orange-500/10 via-amber-500/5 to-transparent rounded-xl border border-[var(--border)] p-5 md:p-6 mb-5">
        <h2 className="text-xl md:text-2xl font-bold mb-1">Welcome, Judge {user?.last_name || ''} ⚖️</h2>
        <p className="text-sm text-[var(--muted)]">Review submissions, assign scores, and finalize evaluations.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
        {[
          { label: "Total Submissions", value: submissions?.length || 0, icon: "📝", color: "from-blue-500" },
          { label: "Scored", value: scores?.length || 0, icon: "⭐", color: "from-green-500" },
          { label: "Finalized", value: finalizedCount, icon: "✅", color: "from-purple-500" },
          { label: "Ungraded", value: Math.max(0, ungraded), icon: "⏳", color: "from-orange-500" },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 hover:shadow-md transition-shadow">
            <div className="text-2xl mb-1">{s.icon}</div>
            <div className="text-2xl font-bold">{s.value}</div>
            <div className="text-xs text-[var(--muted)]">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        {/* Recent Scores */}
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5">
          <h3 className="font-bold mb-3">⭐ Your Recent Scores</h3>
          {!scores || scores.length === 0 ? (
            <p className="text-sm text-[var(--muted)] py-4 text-center">No scores submitted yet. Start evaluating!</p>
          ) : (
            <div className="space-y-2 max-h-72 overflow-y-auto">
              {scores.slice(0, 6).map((s) => (
                <div key={s.id} className="flex items-center justify-between p-2.5 rounded-lg border border-[var(--border)]">
                  <div>
                    <div className="text-sm font-medium">Submission #{s.submission}</div>
                    <div className="text-xs text-[var(--muted)]">{s.is_finalized ? "✅ Finalized" : "📝 Draft"}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold">{s.total_score}</span>
                    {!s.is_finalized && (
                      <button className="text-xs btn px-2 py-1" onClick={() => navigate("/judging")}>Finalize</button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5">
          <h3 className="font-bold mb-3">⚡ Quick Actions</h3>
          <div className="space-y-2">
            <button onClick={() => navigate("/judging")} className="flex items-center gap-3 w-full p-3 rounded-lg border border-[var(--border)] hover:bg-[var(--surface-2)] transition-colors text-left">
              <span className="text-xl">⭐</span>
              <div>
                <div className="text-sm font-medium">Score Submissions</div>
                <div className="text-xs text-[var(--muted)]">Evaluate and assign scores</div>
              </div>
            </button>
            <button onClick={() => navigate("/submissions")} className="flex items-center gap-3 w-full p-3 rounded-lg border border-[var(--border)] hover:bg-[var(--surface-2)] transition-colors text-left">
              <span className="text-xl">📝</span>
              <div>
                <div className="text-sm font-medium">View All Projects</div>
                <div className="text-xs text-[var(--muted)]">Browse hackathon submissions</div>
              </div>
            </button>
            <button onClick={() => navigate("/hackathons")} className="flex items-center gap-3 w-full p-3 rounded-lg border border-[var(--border)] hover:bg-[var(--surface-2)] transition-colors text-left">
              <span className="text-xl">🏗️</span>
              <div>
                <div className="text-sm font-medium">My Assignments</div>
                <div className="text-xs text-[var(--muted)]">View assigned hackathons</div>
              </div>
            </button>
            <button onClick={() => navigate("/judging")} className="flex items-center gap-3 w-full p-3 rounded-lg border border-[var(--border)] hover:bg-[var(--surface-2)] transition-colors text-left">
              <span className="text-xl">🏆</span>
              <div>
                <div className="text-sm font-medium">Leaderboard</div>
                <div className="text-xs text-[var(--muted)]">View current rankings</div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}