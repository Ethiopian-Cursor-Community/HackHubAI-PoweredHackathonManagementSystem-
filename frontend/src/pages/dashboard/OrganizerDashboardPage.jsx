import { DashboardShell } from "../../components/dashboard/DashboardShell";

export function OrganizerDashboardPage() {
  return (
    <DashboardShell title="Organizer Dashboard">
      <div className="feature-grid">
        <article className="feature-card"><h4>Create Hackathon</h4><p>Launch new events in minutes.</p></article>
        <article className="feature-card"><h4>Registrations</h4><p>Track participant growth live.</p></article>
        <article className="feature-card"><h4>Judges</h4><p>Assign and manage judge access.</p></article>
        <article className="feature-card"><h4>Announcements</h4><p>Send updates instantly.</p></article>
        <article className="feature-card"><h4>Analytics</h4><p>Review engagement and outcomes.</p></article>
      </div>
    </DashboardShell>
  );
}
