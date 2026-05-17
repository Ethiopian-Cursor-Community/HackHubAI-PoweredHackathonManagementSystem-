import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { login as loginApi, getMe } from "../services/authApi";
import { connectSocket } from "../services/socket";
import toast from "react-hot-toast";

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { setAuth, setUser } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await loginApi({ email, password });
      setAuth(data.user || { email }, data.access, data.refresh);
      try {
        const me = await getMe();
        setUser(me);
      } catch {}
      connectSocket();
      toast.success("Logged in successfully");
      navigate("/hackathons");
    } catch (err) {
      toast.error(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="card max-w-md w-full">
        <div className="text-center mb-6">
          <span className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--primary)] to-[var(--primary-2)] inline-block mb-2" />
          <h1 className="text-2xl font-bold m-0">Welcome Back</h1>
          <p className="text-[var(--muted)] text-sm">Sign in to your HackHub account</p>
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
          <button type="submit" disabled={loading} className="btn w-full">
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
        <div className="text-center mt-4 text-sm">
          <span className="text-[var(--muted)]">Don't have an account? </span>
          <Link to="/register" className="text-[var(--primary)]">Create one</Link>
        </div>
      </div>
    </div>
  );
}