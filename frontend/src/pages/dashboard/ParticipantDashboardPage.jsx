import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { request } from "../../services/http";
import { DashboardShell } from "../../components/dashboard/DashboardShell";

export function ParticipantDashboardPage() {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const { data: hackathons } = useQuery({
    queryKey: ["participant-hackathons"],
    queryFn: () => request("/hackathons/"),
  });

  const { data: teams } = useQuery({
    queryKey: ["participant-teams"],
    queryFn: () => request("/teams/"),
  });

  const openEvents = hackathons?.filter(h => h.status === "registration_open") || [];
  const myTeams = teams?.filter(t => t.memberships?.some(m => m.user === user?.id)) || [];
  const activeEvents = hackathons?.filter(h => ["ongoing", "judging"].includes(h.status)) || [];

  return (
    <DashboardShell title="Participant Dashboard">
      <div className="bg-gradient-to-br from-green-500/10 via-emerald-500/5 to-transparent rounded-xl border border-[var(--border)] p-5 md:p-6 mb-5">
        <h2 className="text-xl md:text-2xl font-bold mb-1">Hey {user?.first_name || 'Participant'}! 🚀</h2>
        <p className="text-sm text-[var(--muted)]">Find hackathons, join teams, and submit your projects.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
        {[
          { label: "Open Events", value: openEvents.length, icon: "🎯", color: "from-blue-500" },
          { label: "My Teams", value: myTeams.length, icon: "👥", color: "from-green-500" },
          { label: "Active Events", value: activeEvents.length, icon: "⚡", color: "from-purple-500" },
          { label: "Certificates", icon: "🏅", value: "—", color: "from-amber-500" },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 hover:shadow-md transition-shadow">
            <div className="text-2xl mb-1">{s.icon}</div>
            <div className="text-2xl font-bold">{s.value}</div>
            <div className="text-xs text-[var(--muted)]">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-4 mb-5">
        {/* Quick Actions */}
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5">
          <h3 className="font-bold mb-3">🚀 Quick Actions</h3>
          <div className="grid grid-cols-2 gap-2">
            <button onClick={() => navigate("/hackathons")} className="flex items-center gap-2 p-3 rounded-lg border border-[var(--border)] hover:bg-[var(--surface-2)] transition-colors text-sm text-left">
              <span>🎯</span> Find Events
            </button>
            <button onClick={() => navigate("/teams")} className="flex items-center gap-2 p-3 rounded-lg border border-[var(--border)] hover:bg-[var(--surface-2)] transition-colors text-sm text-left">
              <span>👥</span> My Teams
            </button>
            <button onClick={() => navigate("/submissions")} className="flex items-center gap-2 p-3 rounded-lg border border-[var(--border)] hover:bg-[var(--surface-2)] transition-colors text-sm text-left">
              <span>📝</span> My Submissions
            </button>
            <button onClick={() => navigate("/submission-flow")} className="flex items-center gap-2 p-3 rounded-lg border border-[var(--border)] hover:bg-[var(--surface-2)] transition-colors text-sm text-left">
              <span>🚀</span> Submit Project
            </button>
          </div>
        </div>

        {/* My Teams */}
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5">
          <h3 className="font-bold mb-3">👥 My Teams</h3>
          {myTeams.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-sm text-[var(--muted)] mb-3">You haven't joined any teams yet.</p>
              <button onClick={() => navigate("/teams")} className="btn text-sm">Find a Team</button>
            </div>
          ) : (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {myTeams.map((t) => (
                <div key={t.id} className="flex items-center justify-between p-2.5 rounded-lg border border-[var(--border)]">
                  <div>
                    <div className="text-sm font-medium">{t.name}</div>
                    <div className="text-xs text-[var(--muted)]">{t.memberships?.length || 0} members · {t.status}</div>
                  </div>
                  <span className="text-xs text-[var(--muted)]">{t.final_score ? `Score: ${t.final_score}` : ''}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Open Events */}
      <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5">
        <h3 className="font-bold mb-3">🎯 Open for Registration</h3>
        {openEvents.length === 0 ? (
          <p className="text-sm text-[var(--muted)] py-4 text-center">No open events right now. Check back soon!</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {openEvents.slice(0, 6).map((h) => (
              <div key={h.id} className="rounded-lg border border-[var(--border)] p-3 hover:shadow-md transition-shadow">
                <h4 className="font-medium text-sm mb-1 truncate">{h.title}</h4>
                <p className="text-xs text-[var(--muted)] mb-2 line-clamp-2">{h.description?.slice(0, 100)}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[var(--muted)]">{h.stats?.participants || 0} participants</span>
                  <button onClick={() => navigate("/hackathons")} className="btn text-xs px-3 py-1">Register</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardShell>
  );
}