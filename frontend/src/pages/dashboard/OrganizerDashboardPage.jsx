import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { request } from "../../services/http";
import { DashboardShell } from "../../components/dashboard/DashboardShell";

export function OrganizerDashboardPage() {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const { data: hackathons } = useQuery({
    queryKey: ["org-hackathons"],
    queryFn: () => request("/hackathons/"),
  });

  const myHackathons = hackathons?.filter(h => h.organizer === user?.id || h.organizer_name === user?.username) || [];
  const activeHackathons = myHackathons.filter(h => ["registration_open", "ongoing"].includes(h.status));
  const draftHackathons = myHackathons.filter(h => h.status === "draft");
  const completedHackathons = myHackathons.filter(h => h.status === "completed");

  return (
    <DashboardShell title="Organizer Dashboard">
      {/* Welcome */}
      <div className="bg-gradient-to-br from-[var(--primary)]/10 via-purple-500/5 to-transparent rounded-xl border border-[var(--border)] p-5 md:p-6 mb-5">
        <h2 className="text-xl md:text-2xl font-bold mb-1">Welcome, {user?.first_name || 'Organizer'} 🏢</h2>
        <p className="text-sm text-[var(--muted)]">Manage your hackathons, review submissions, and publish results.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
        {[
          { label: "Total Events", value: myHackathons.length, icon: "🏗️", color: "from-blue-500 to-blue-600" },
          { label: "Active", value: activeHackathons.length, icon: "⚡", color: "from-green-500 to-emerald-600" },
          { label: "Drafts", value: draftHackathons.length, icon: "📝", color: "from-amber-500 to-orange-600" },
          { label: "Completed", value: completedHackathons.length, icon: "✅", color: "from-purple-500 to-violet-600" },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 hover:shadow-md transition-shadow">
            <div className="text-2xl mb-1">{s.icon}</div>
            <div className="text-2xl font-bold">{s.value}</div>
            <div className="text-xs text-[var(--muted)]">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Actions + Events */}
      <div className="grid lg:grid-cols-2 gap-4 mb-5">
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5">
          <h3 className="font-bold mb-3">⚡ Quick Actions</h3>
          <div className="grid grid-cols-2 gap-2">
            <button onClick={() => navigate("/hackathons")} className="flex items-center gap-2 p-3 rounded-lg border border-[var(--border)] hover:bg-[var(--surface-2)] transition-colors text-sm text-left">
              <span>➕</span> New Hackathon
            </button>
            <button onClick={() => navigate("/hackathons")} className="flex items-center gap-2 p-3 rounded-lg border border-[var(--border)] hover:bg-[var(--surface-2)] transition-colors text-sm text-left">
              <span>📢</span> Send Announcement
            </button>
            <button onClick={() => navigate("/submissions")} className="flex items-center gap-2 p-3 rounded-lg border border-[var(--border)] hover:bg-[var(--surface-2)] transition-colors text-sm text-left">
              <span>📝</span> Review Submissions
            </button>
            <button onClick={() => navigate("/certificates")} className="flex items-center gap-2 p-3 rounded-lg border border-[var(--border)] hover:bg-[var(--surface-2)] transition-colors text-sm text-left">
              <span>🏅</span> Issue Certificates
            </button>
          </div>
        </div>

        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5">
          <h3 className="font-bold mb-3">📋 My Events</h3>
          {myHackathons.length === 0 ? (
            <p className="text-sm text-[var(--muted)]">No events yet. Create your first hackathon!</p>
          ) : (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {myHackathons.slice(0, 5).map((h) => (
                <div key={h.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-[var(--surface-2)] transition-colors">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className={`w-2 h-2 rounded-full shrink-0 ${
                      h.status === 'completed' ? 'bg-green-500' :
                      h.status === 'ongoing' ? 'bg-blue-500' :
                      h.status === 'registration_open' ? 'bg-purple-500' :
                      h.status === 'judging' ? 'bg-orange-500' :
                      h.status === 'draft' ? 'bg-gray-400' : 'bg-green-500'
                    }`} />
                    <div className="min-w-0">
                      <div className="text-sm font-medium truncate">{h.title}</div>
                      <div className="text-xs text-[var(--muted)] capitalize">{h.status.replace("_", " ")}</div>
                    </div>
                  </div>
                  <span className="text-xs text-[var(--muted)] shrink-0">{h.stats?.participants || 0} participants</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* AI Actions */}
      <div className="rounded-xl border border-[var(--border)] bg-gradient-to-br from-[var(--primary)]/5 to-transparent p-5">
        <h3 className="font-bold mb-3">🤖 AI Tools</h3>
        <div className="grid sm:grid-cols-3 gap-3">
          {[
            { icon: "📊", title: "AI Evaluation", desc: "Auto-score submissions", action: "/submissions" },
            { icon: "🔍", title: "Plagiarism Check", desc: "Cross-submission analysis", action: "/submissions" },
            { icon: "📈", title: "Analytics", desc: "View engagement insights", action: "/analytics" },
          ].map((tool) => (
            <button key={tool.title} onClick={() => navigate(tool.action)} className="flex items-start gap-3 p-3 rounded-lg border border-[var(--border)] bg-[var(--surface)] hover:shadow-md transition-all text-left">
              <span className="text-xl">{tool.icon}</span>
              <div>
                <div className="text-sm font-medium">{tool.title}</div>
                <div className="text-xs text-[var(--muted)]">{tool.desc}</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </DashboardShell>
  );
}