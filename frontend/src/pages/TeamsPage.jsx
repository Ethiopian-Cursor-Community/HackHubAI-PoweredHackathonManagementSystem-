import { useTeams, useCreateTeam, useRequestJoin, useLeaveTeam } from "../hooks/useTeam";
import { useAuthStore } from "../store/authStore";
import { useState } from "react";
import toast from "react-hot-toast";

export function TeamsPage() {
  const { data: teams, isLoading } = useTeams();
  const user = useAuthStore((s) => s.user);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", hackathon: "" });

  const createMutation = useCreateTeam();
  const requestJoinMutation = useRequestJoin();
  const leaveMutation = useLeaveTeam();

  const handleCreate = (e) => {
    e.preventDefault();
    createMutation.mutate(form, { onSuccess: () => setShowForm(false) });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Teams</h1>
        {user?.role === "participant" && (
          <button className="btn" onClick={() => setShowForm(!showForm)}>
            {showForm ? "Cancel" : "+ New Team"}
          </button>
        )}
      </div>

      {showForm && (
        <div className="card mb-4">
          <h3 className="font-bold mb-3">Create Team</h3>
          <form onSubmit={handleCreate} className="space-y-3">
            <div>
              <label className="block text-sm">Team Name</label>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div>
              <label className="block text-sm">Hackathon ID</label>
              <input value={form.hackathon} onChange={(e) => setForm({ ...form, hackathon: e.target.value })} required placeholder="Enter hackathon ID" />
            </div>
            <button type="submit" className="btn">Create</button>
          </form>
        </div>
      )}

      {isLoading ? (
        <p>Loading teams...</p>
      ) : (
        <div className="space-y-3">
          {teams?.length === 0 && <p className="text-[var(--muted)]">No teams found.</p>}
          {teams?.map((team) => (
            <div key={team.id} className="card">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-bold m-0">{team.name}</h3>
                  <p className="text-sm text-[var(--muted)] m-0">
                    Leader: {team.leader} · Score: {team.final_score ?? "—"} · Rank: {team.rank ?? "—"}
                  </p>
                  <p className="text-xs text-[var(--muted)] mt-1">
                    Status: {team.status} · Members: {team.memberships?.length ?? 0}
                  </p>
                  {team.memberships?.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {team.memberships.map((m) => (
                        <span key={m.id} className="text-xs bg-[var(--surface-2)] px-2 py-0.5 rounded">
                          {m.username} ({m.role})
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-1.5 shrink-0">
                  {user?.role === "participant" && (
                    <button className="btn btn-ghost text-sm" onClick={() => requestJoinMutation.mutate(team.id)}>
                      Request Join
                    </button>
                  )}
                  {team.memberships?.some((m) => m.user === user?.id && m.role !== "leader") && (
                    <button className="btn btn-danger text-sm" onClick={() => leaveMutation.mutate(team.id)}>
                      Leave
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}