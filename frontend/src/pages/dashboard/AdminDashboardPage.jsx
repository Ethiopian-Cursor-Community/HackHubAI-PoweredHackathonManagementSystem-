import { DashboardShell } from "../../components/dashboard/DashboardShell";

export function AdminDashboardPage() {
  return (
    <DashboardShell title="Admin Dashboard">
      <div className="feature-grid">
        <article className="feature-card"><h4>Total Users</h4><strong>12,481</strong></article>
        <article className="feature-card"><h4>Active Events</h4><strong>128</strong></article>
        <article className="feature-card"><h4>AI Requests</h4><strong>89,210</strong></article>
        <article className="feature-card"><h4>Submissions</h4><strong>34,902</strong></article>
        <article className="feature-card"><h4>Reports</h4><strong>42</strong></article>
        <article className="feature-card"><h4>System Health</h4><strong>99.97%</strong></article>
      </div>
    </DashboardShell>
  );
}
