import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { register as registerApi, login as loginApi, getMe } from "../services/authApi";
import { connectSocket } from "../services/socket";
import toast from "react-hot-toast";

export function RegisterPage() {
  const [form, setForm] = useState({
    email: "",
    username: "",
    password: "",
    first_name: "",
    last_name: "",
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
      navigate("/hackathons");
    } catch (err) {
      toast.error(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const roles = ["participant", "organizer", "judge", "mentor"];

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="card max-w-md w-full">
        <div className="text-center mb-6">
          <span className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--primary)] to-[var(--primary-2)] inline-block mb-2" />
          <h1 className="text-2xl font-bold m-0">Create Account</h1>
          <p className="text-[var(--muted)] text-sm">Join the HackHub community</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1">First Name</label>
              <input name="first_name" value={form.first_name} onChange={handleChange} className="w-full" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Last Name</label>
              <input name="last_name" value={form.last_name} onChange={handleChange} className="w-full" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Username *</label>
            <input name="username" value={form.username} onChange={handleChange} required className="w-full" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email *</label>
            <input type="email" name="email" value={form.email} onChange={handleChange} required className="w-full" placeholder="you@example.com" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Password *</label>
            <input type="password" name="password" value={form.password} onChange={handleChange} required minLength={8} className="w-full" placeholder="Min 8 characters" />
          </div>
          <button type="submit" disabled={loading} className="btn w-full">
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>
        <div className="text-center mt-4 text-sm">
          <span className="text-[var(--muted)]">Already have an account? </span>
          <Link to="/login" className="text-[var(--primary)]">Sign in</Link>
        </div>
      </div>
    </div>
  );
}