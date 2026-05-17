import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { request } from "../../services/http";
import { DashboardShell } from "../../components/dashboard/DashboardShell";

export function MentorDashboardPage() {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const { data: hackathons } = useQuery({
    queryKey: ["mentor-hackathons"],
    queryFn: () => request("/hackathons/"),
  });

  const { data: teams } = useQuery({
    queryKey: ["mentor-teams"],
    queryFn: () => request("/teams/"),
  });

  return (
    <DashboardShell title="Mentor Dashboard">
      <div className="bg-gradient-to-br from-teal-500/10 via-cyan-500/5 to-transparent rounded-xl border border-[var(--border)] p-5 md:p-6 mb-5">
        <h2 className="text-xl md:text-2xl font-bold mb-1">Welcome, Mentor {user?.last_name || ''} 🧠</h2>
        <p className="text-sm text-[var(--muted)]">Guide participants, review team progress, and share your expertise.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-5">
        {[
          { label: "Active Hackathons", value: hackathons?.filter(h => ["ongoing", "registration_open"].includes(h.status)).length || 0, icon: "🏗️" },
          { label: "Teams", value: teams?.length || 0, icon: "👥" },
          { label: "Participants", value: "—", icon: "🎓" },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 hover:shadow-md transition-shadow">
            <div className="text-2xl mb-1">{s.icon}</div>
            <div className="text-2xl font-bold">{s.value}</div>
            <div className="text-xs text-[var(--muted)]">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5">
          <h3 className="font-bold mb-3">⚡ Quick Actions</h3>
          <div className="space-y-2">
            <button onClick={() => navigate("/hackathons")} className="flex items-center gap-3 w-full p-3 rounded-lg border border-[var(--border)] hover:bg-[var(--surface-2)] transition-colors text-left">
              <span className="text-xl">🏗️</span>
              <div><div className="text-sm font-medium">Browse Hackathons</div><div className="text-xs text-[var(--muted)]">Find events to mentor</div></div>
            </button>
            <button onClick={() => navigate("/teams")} className="flex items-center gap-3 w-full p-3 rounded-lg border border-[var(--border)] hover:bg-[var(--surface-2)] transition-colors text-left">
              <span className="text-xl">👥</span>
              <div><div className="text-sm font-medium">View Teams</div><div className="text-xs text-[var(--muted)]">See team compositions</div></div>
            </button>
            <button onClick={() => navigate("/notifications")} className="flex items-center gap-3 w-full p-3 rounded-lg border border-[var(--border)] hover:bg-[var(--surface-2)] transition-colors text-left">
              <span className="text-xl">💬</span>
              <div><div className="text-sm font-medium">Messages</div><div className="text-xs text-[var(--muted)]">Check notifications</div></div>
            </button>
          </div>
        </div>

        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5">
          <h3 className="font-bold mb-3">📋 Active Hackathons</h3>
          {!hackathons || hackathons.length === 0 ? (
            <p className="text-sm text-[var(--muted)] py-4 text-center">No hackathons available.</p>
          ) : (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {hackathons.slice(0, 6).map((h) => (
                <div key={h.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-[var(--surface-2)] transition-colors">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="w-2 h-2 rounded-full bg-teal-500 shrink-0" />
                    <div className="min-w-0">
                      <div className="text-sm font-medium truncate">{h.title}</div>
                      <div className="text-xs text-[var(--muted)]">{h.organizer_name} · {h.status}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardShell>
  );
}