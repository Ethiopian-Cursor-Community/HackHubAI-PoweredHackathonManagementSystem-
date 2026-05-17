import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { register as registerApi, login as loginApi, getMe } from "../services/authApi";
import { connectSocket } from "../services/socket";
import { getDashboardRoute } from "../lib/dashboardRoutes";
import toast from "react-hot-toast";

const ROLES = [
  { value: "participant", label: "🚀 Participant", desc: "Join hackathons, form teams, and submit projects" },
  { value: "organizer", label: "🏢 Organizer", desc: "Create and manage hackathon events" },
  { value: "judge", label: "⚖️ Judge", desc: "Evaluate submissions and score projects" },
  { value: "mentor", label: "🧠 Mentor", desc: "Guide participants and share expertise" },
];

export function RegisterPage() {
  const [form, setForm] = useState({
    email: "",
    username: "",
    password: "",
    first_name: "",
    last_name: "",
    role: "participant",
  });
  const [loading, setLoading] = useState(false);
  const { setAuth, setUser } = useAuthStore();
  const navigate = useNavigate();

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await registerApi(form);
      toast.success("Account created! Signing you in...");
      const data = await loginApi({ email: form.email, password: form.password });
      setAuth(data.user || { email: form.email }, data.access, data.refresh);
      try {
        const me = await getMe();
        setUser(me);
      } catch {}
      connectSocket();
      const route = getDashboardRoute({ role: form.role });
      navigate(route);
    } catch (err) {
      toast.error(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: "var(--bg)" }}>
      <div className="card max-w-lg w-full">
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="w-4 h-4 rounded-full bg-gradient-to-br from-[var(--primary)] to-[var(--primary-2)] shadow-lg" />
            <span className="text-xl font-bold">HackHub</span>
          </div>
          <h1 className="text-2xl font-bold m-0">Create Account</h1>
          <p className="text-[var(--muted)] text-sm mt-1">Choose your role and join the community</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1">First Name</label>
              <input name="first_name" value={form.first_name} onChange={handleChange} placeholder="John" className="w-full" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Last Name</label>
              <input name="last_name" value={form.last_name} onChange={handleChange} placeholder="Doe" className="w-full" />
            </div>
          </div>

          {/* Username + Email */}
          <div>
            <label className="block text-sm font-medium mb-1">Username *</label>
            <input name="username" value={form.username} onChange={handleChange} required placeholder="johndoe" className="w-full" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email *</label>
            <input type="email" name="email" value={form.email} onChange={handleChange} required placeholder="you@example.com" className="w-full" />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium mb-1">Password *</label>
            <input type="password" name="password" value={form.password} onChange={handleChange} required minLength={8} placeholder="Min 8 characters" className="w-full" />
          </div>

          {/* Role Selection */}
          <div>
            <label className="block text-sm font-medium mb-2">I want to join as... *</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {ROLES.map((r) => (
                <label
                  key={r.value}
                  className={`flex items-start gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                    form.role === r.value
                      ? "border-[var(--primary)] bg-[var(--primary)]/5"
                      : "border-[var(--border)] hover:border-[var(--primary)]/50"
                  }`}
                >
                  <input
                    type="radio"
                    name="role"
                    value={r.value}
                    checked={form.role === r.value}
                    onChange={handleChange}
                    className="mt-0.5 accent-[var(--primary)]"
                  />
                  <div>
                    <div className="text-sm font-medium">{r.label}</div>
                    <div className="text-xs text-[var(--muted)]">{r.desc}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn w-full py-3">
            {loading ? "Creating account..." : `Create Account & Go to ${form.role === "participant" ? "🚀 Dashboard" : form.role === "organizer" ? "🏢 Dashboard" : form.role === "judge" ? "⚖️ Dashboard" : "🧠 Dashboard"}`}
          </button>
        </form>

        <div className="text-center mt-5 text-sm">
          <span className="text-[var(--muted)]">Already have an account? </span>
          <Link to="/login" className="text-[var(--primary)] font-medium">Sign in</Link>
        </div>

        <div className="mt-4 p-3 rounded-lg bg-[var(--surface-2)] border border-[var(--border)] text-xs text-[var(--muted)]">
          <p>💡 By creating an account, you agree to our Terms of Service and Privacy Policy. You can change your role later in Settings.</p>
        </div>
      </div>
    </div>
  );
}