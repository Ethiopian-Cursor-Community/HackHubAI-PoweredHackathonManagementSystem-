import { useHackathons, useCreateHackathon, useRegisterHackathon, usePublishHackathon, usePublishResults } from "../hooks/useHackathon";
import { useState } from "react";
import { useAuthStore } from "../store/authStore";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export function HackathonsPage() {
  const { data: hackathons, isLoading } = useHackathons();
  const user = useAuthStore((s) => s.user);
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    registration_start: "",
    registration_end: "",
    start_date: "",
    end_date: "",
    submission_deadline: "",
  });

  const createMutation = useCreateHackathon();
  const registerMutation = useRegisterHackathon();
  const publishMutation = usePublishHackathon();
  const resultsMutation = usePublishResults();

  const handleCreate = (e) => {
    e.preventDefault();
    createMutation.mutate(form, {
      onSuccess: () => {
        setShowForm(false);
        setForm({ title: "", description: "", registration_start: "", registration_end: "", start_date: "", end_date: "", submission_deadline: "" });
      },
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      draft: "bg-gray-500",
      published: "bg-blue-500",
      registration_open: "bg-green-500",
      ongoing: "bg-purple-500",
      judging: "bg-orange-500",
      completed: "bg-green-700",
      cancelled: "bg-red-500",
    };
    return colors[status] || "bg-gray-400";
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Hackathons</h1>
        {user?.role === "organizer" && (
          <button className="btn" onClick={() => setShowForm(!showForm)}>
            {showForm ? "Cancel" : "+ New Hackathon"}
          </button>
        )}
      </div>

      {showForm && (
        <div className="card mb-4">
          <h3 className="font-bold mb-3">Create Hackathon</h3>
          <form onSubmit={handleCreate} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm">Title</label>
                <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
              </div>
              <div>
                <label className="block text-sm">Registration Start</label>
                <input type="datetime-local" value={form.registration_start} onChange={(e) => setForm({ ...form, registration_start: e.target.value })} required />
              </div>
              <div>
                <label className="block text-sm">Registration End</label>
                <input type="datetime-local" value={form.registration_end} onChange={(e) => setForm({ ...form, registration_end: e.target.value })} required />
              </div>
              <div>
                <label className="block text-sm">Start Date</label>
                <input type="datetime-local" value={form.start_date} onChange={(e) => setForm({ ...form, start_date: e.target.value })} required />
              </div>
              <div>
                <label className="block text-sm">End Date</label>
                <input type="datetime-local" value={form.end_date} onChange={(e) => setForm({ ...form, end_date: e.target.value })} required />
              </div>
              <div>
                <label className="block text-sm">Submission Deadline</label>
                <input type="datetime-local" value={form.submission_deadline} onChange={(e) => setForm({ ...form, submission_deadline: e.target.value })} required />
              </div>
            </div>
            <div>
              <label className="block text-sm">Description</label>
              <textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>
            <button type="submit" className="btn">Create</button>
          </form>
        </div>
      )}

      {isLoading ? (
        <p>Loading hackathons...</p>
      ) : (
        <div className="space-y-3">
          {hackathons?.length === 0 && <p className="text-[var(--muted)]">No hackathons found.</p>}
          {hackathons?.map((h) => (
            <div key={h.id} className="card">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`w-2.5 h-2.5 rounded-full ${getStatusColor(h.status)}`} />
                    <span className="text-xs capitalize text-[var(--muted)]">{h.status.replace("_", " ")}</span>
                  </div>
                  <h3 className="text-lg font-bold m-0">{h.title}</h3>
                  <p className="text-sm text-[var(--muted)] m-0">{h.description?.slice(0, 200)}</p>
                  <p className="text-xs text-[var(--muted)] mt-1">
                    {h.organizer_name} · {new Date(h.registration_start).toLocaleDateString()} - {new Date(h.registration_end).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex flex-col gap-1.5 shrink-0">
                  {user && h.status === "registration_open" && (
                    <button className="btn text-sm" onClick={() => registerMutation.mutate(h.id)}>Register</button>
                  )}
                  {user && ["draft", "published"].includes(h.status) && user.id === h.organizer && (
                    <button className="btn text-sm" onClick={() => publishMutation.mutate(h.id)}>Publish</button>
                  )}
                  {user && h.status === "judging" && user.id === h.organizer && (
                    <button className="btn text-sm" onClick={() => resultsMutation.mutate(h.id)}>Publish Results</button>
                  )}
                  <button className="btn btn-ghost text-sm" onClick={() => navigate(`/hackathons`)}>View</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}