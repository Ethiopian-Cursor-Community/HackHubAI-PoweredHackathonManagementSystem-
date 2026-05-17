import { DashboardShell } from "../../components/dashboard/DashboardShell";

export function ParticipantDashboardPage() {
  return (
    <DashboardShell title="Participant Dashboard">
      <div className="feature-grid">
        <article className="feature-card"><h4>AI Team Suggestions</h4><p>Find ideal teammates by skill matching.</p></article>
        <article className="feature-card"><h4>Deadlines</h4><p>Track upcoming milestones.</p></article>
        <article className="feature-card"><h4>Submissions</h4><p>Manage project drafts and final delivery.</p></article>
        <article className="feature-card"><h4>Invitations</h4><p>Respond to team invites quickly.</p></article>
        <article className="feature-card"><h4>Certificates</h4><p>Access verified certificates after results.</p></article>
      </div>
    </DashboardShell>
  );
}
