import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { request } from "../../services/http";
import { DashboardShell } from "../../components/dashboard/DashboardShell";

export function AdminDashboardPage() {
  const { user } = useAuthStore();

  const { data: hackathons } = useQuery({
    queryKey: ["admin-hackathons"],
    queryFn: () => request("/hackathons/"),
  });

  const stats = [
    { label: "Total Users", value: "12,481", icon: "👥", change: "+12%", color: "from-blue-500 to-blue-600" },
    { label: "Active Events", value: hackathons?.filter(h => ["ongoing", "registration_open"].includes(h.status)).length || "0", icon: "🏁", change: "+3", color: "from-green-500 to-emerald-600" },
    { label: "AI Requests", value: "89,210", icon: "🤖", change: "+18%", color: "from-purple-500 to-violet-600" },
    { label: "Submissions", value: "34,902", icon: "📝", change: "+8%", color: "from-orange-500 to-amber-600" },
    { label: "System Health", value: "99.97%", icon: "💚", change: "Stable", color: "from-teal-500 to-cyan-600" },
    { label: "Reports", value: "42", icon: "📊", change: "2 new", color: "from-rose-500 to-pink-600" },
  ];

  return (
    <DashboardShell title="Admin Dashboard">
      {/* Welcome */}
      <div className="bg-gradient-to-br from-[var(--primary)]/10 via-[var(--primary-2)]/5 to-transparent rounded-xl border border-[var(--border)] p-5 md:p-6 mb-5">
        <h2 className="text-xl md:text-2xl font-bold mb-1">Welcome back, {user?.username || 'Admin'} 👋</h2>
        <p className="text-sm text-[var(--muted)]">Here's what's happening across your platform today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4 mb-5">
        {stats.map((s) => (
          <div key={s.label} className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 hover:shadow-md transition-shadow">
            <div className="text-2xl mb-2">{s.icon}</div>
            <div className="text-xl md:text-2xl font-bold">{s.value}</div>
            <div className="text-xs text-[var(--muted)]">{s.label}</div>
            <span className="text-xs text-green-500">{s.change}</span>
          </div>
        ))}
      </div>

      {/* Quick Actions + Recent */}
      <div className="grid lg:grid-cols-2 gap-4">
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5">
          <h3 className="font-bold mb-3">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-2">
            <Link to="/hackathons" className="flex items-center gap-2 p-3 rounded-lg border border-[var(--border)] hover:bg-[var(--surface-2)] transition-colors text-sm">
              <span>🏗️</span> Manage Events
            </Link>
            <Link to="/certificates" className="flex items-center gap-2 p-3 rounded-lg border border-[var(--border)] hover:bg-[var(--surface-2)] transition-colors text-sm">
              <span>🏅</span> Certificates
            </Link>
            <Link to="/analytics" className="flex items-center gap-2 p-3 rounded-lg border border-[var(--border)] hover:bg-[var(--surface-2)] transition-colors text-sm">
              <span>📊</span> Analytics
            </Link>
            <Link to="/settings" className="flex items-center gap-2 p-3 rounded-lg border border-[var(--border)] hover:bg-[var(--surface-2)] transition-colors text-sm">
              <span>⚙️</span> Settings
            </Link>
          </div>
        </div>

        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5">
          <h3 className="font-bold mb-3">Recent Hackathons</h3>
          <div className="space-y-2">
            {hackathons?.slice(0, 4).map((h) => (
              <div key={h.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-[var(--surface-2)] transition-colors">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${
                    h.status === 'completed' ? 'bg-green-500' :
                    h.status === 'ongoing' ? 'bg-blue-500' :
                    h.status === 'registration_open' ? 'bg-purple-500' :
                    h.status === 'judging' ? 'bg-orange-500' : 'bg-gray-400'
                  }`} />
                  <div>
                    <div className="text-sm font-medium">{h.title}</div>
                    <div className="text-xs text-[var(--muted)]">{h.status?.replace("_", " ")}</div>
                  </div>
                </div>
                <span className="text-xs text-[var(--muted)]">{h.stats?.participants || 0} participants</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}