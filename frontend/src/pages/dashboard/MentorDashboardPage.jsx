import { DashboardShell } from "../../components/dashboard/DashboardShell";

export function MentorDashboardPage() {
  return (
    <DashboardShell title="Mentor Dashboard">
      <div className="feature-grid">
        <article className="feature-card"><h4>Sessions</h4><p>Manage mentoring schedules.</p></article>
        <article className="feature-card"><h4>Assigned Teams</h4><p>Track mentee progress and goals.</p></article>
        <article className="feature-card"><h4>Feedback Notes</h4><p>Leave structured guidance.</p></article>
      </div>
    </DashboardShell>
  );
}
