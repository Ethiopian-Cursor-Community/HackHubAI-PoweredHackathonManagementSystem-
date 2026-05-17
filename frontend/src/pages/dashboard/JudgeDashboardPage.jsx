import { DashboardShell } from "../../components/dashboard/DashboardShell";

export function JudgeDashboardPage() {
  return (
    <DashboardShell title="Judge Dashboard">
      <div className="feature-grid">
        <article className="feature-card"><h4>Scoring Workspace</h4><p>Review and score submissions rapidly.</p></article>
        <article className="feature-card"><h4>AI Comparison</h4><p>Compare human and AI evaluation summaries.</p></article>
        <article className="feature-card"><h4>Leaderboard Preview</h4><p>Monitor ranking shifts in real-time.</p></article>
      </div>
    </DashboardShell>
  );
}
