import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "react-router-dom";
import { request } from "../services/http";
import toast from "react-hot-toast";

export function LeaderboardPage() {
  const { hackathonId } = useParams();

  const { data: leaderboard, isLoading } = useQuery({
    queryKey: ["leaderboard", hackathonId],
    queryFn: () => request(`/judging/leaderboard/${hackathonId}/`),
    enabled: !!hackathonId,
    refetchInterval: 30000,
  });

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold m-0">🏆 Leaderboard</h2>
        <Link to={`/hackathons`} className="btn btn-ghost">Back</Link>
      </div>
      {isLoading ? (
        <p>Loading leaderboard...</p>
      ) : leaderboard?.length === 0 ? (
        <p className="text-[var(--muted)]">No results published yet.</p>
      ) : (
        <div className="list">
          {leaderboard?.map((entry, idx) => (
            <div key={entry.id} className="list-item">
              <div className="flex items-center gap-3">
                <span className={`text-2xl font-bold ${idx === 0 ? "text-yellow-500" : idx === 1 ? "text-gray-400" : idx === 2 ? "text-amber-600" : "text-[var(--muted)]"}`}>
                  {idx === 0 ? "🥇" : idx === 1 ? "🥈" : idx === 2 ? "🥉" : `#${idx + 1}`}
                </span>
                <div>
                  <strong>{entry.project_title}</strong>
                  <p className="text-sm text-[var(--muted)] m-0">Team: {entry.team__name}</p>
                </div>
              </div>
              <span className="text-lg font-bold">{entry.final_score?.toFixed(1) ?? "—"}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}