import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { login as loginApi, getMe } from "../services/authApi";
import { connectSocket } from "../services/socket";
import { getDashboardRoute } from "../lib/dashboardRoutes";
import toast from "react-hot-toast";

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const setUser = useAuthStore((s) => s.setUser);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Step 1: Login — stores tokens in Zustand automatically (see authApi.js)
      const data = await loginApi({ email, password });
      
      // Step 2: Immediately fetch user profile (tokens already saved, so getMe works)
      const me = await getMe();
      
      // Step 3: Set user in store (getMe already did this, but be explicit)
      setUser(me);
      
      // Step 4: Connect WebSocket
      connectSocket();
      
      // Step 5: Get the correct dashboard route for this user's role
      const dashboardRoute = getDashboardRoute(me);
      
      // Step 6: Show welcome toast
      const displayName = me.first_name || me.username || email;
      toast.success(`Welcome back, ${displayName}!`);
      
      // Step 7: Hard redirect to dashboard using window.location to avoid race conditions
      window.location.href = dashboardRoute;
    } catch (err) {
      toast.error(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  // Quick-fill demo credentials
  const fillDemo = (demoEmail) => {
    setEmail(demoEmail);
    setPassword("password123");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: "var(--bg)" }}>
      <div className="card max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="w-4 h-4 rounded-full bg-gradient-to-br from-[var(--primary)] to-[var(--primary-2)] shadow-lg" />
            <span className="text-xl font-bold">HackHub</span>
          </div>
          <h1 className="text-2xl font-bold m-0">Welcome Back</h1>
          <p className="text-[var(--muted)] text-sm mt-1">Sign in to your dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              minLength={8}
              className="w-full"
            />
          </div>
          <button type="submit" disabled={loading} className="btn w-full py-3">
            {loading ? "Signing in..." : "Sign In → Dashboard"}
          </button>
        </form>

        <div className="text-center mt-5 text-sm">
          <span className="text-[var(--muted)]">Don't have an account? </span>
          <Link to="/register" className="text-[var(--primary)] font-medium">Create one</Link>
        </div>

        {/* Demo Accounts — click to auto-fill */}
        <div className="mt-6 p-3 rounded-lg bg-[var(--surface-2)] border border-[var(--border)]">
          <p className="text-xs font-medium text-[var(--muted)] mb-2">⚡ Click to fill demo credentials</p>
          <div className="space-y-1 text-xs">
            <button type="button" className="block w-full text-left text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--surface)] px-2 py-1 rounded transition-colors" onClick={() => fillDemo("admin@hackhub.io")}>
              👑 <strong>Admin</strong> → admin@hackhub.io
            </button>
            <button type="button" className="block w-full text-left text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--surface)] px-2 py-1 rounded transition-colors" onClick={() => fillDemo("organizer@hackhub.io")}>
              🏢 <strong>Organizer</strong> → organizer@hackhub.io
            </button>
            <button type="button" className="block w-full text-left text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--surface)] px-2 py-1 rounded transition-colors" onClick={() => fillDemo("judge@hackhub.io")}>
              ⚖️ <strong>Judge</strong> → judge@hackhub.io
            </button>
            <button type="button" className="block w-full text-left text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--surface)] px-2 py-1 rounded transition-colors" onClick={() => fillDemo("mentor@hackhub.io")}>
              🧠 <strong>Mentor</strong> → mentor@hackhub.io
            </button>
            <button type="button" className="block w-full text-left text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--surface)] px-2 py-1 rounded transition-colors" onClick={() => fillDemo("participant@hackhub.io")}>
              🚀 <strong>Participant</strong> → participant@hackhub.io
            </button>
          </div>
          <p className="text-xs text-[var(--muted)] mt-2">All passwords: <code className="bg-[var(--surface)] px-1 rounded">password123</code></p>
        </div>
      </div>
    </div>
  );
}