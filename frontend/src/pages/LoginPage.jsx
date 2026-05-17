import { useState } from "react";
import { Navigate } from "react-router-dom";

import { useApp } from "../context/AppContext";

export function LoginPage() {
  const { user, loginAction, loading } = useApp();
  const [form, setForm] = useState({ email: "", password: "" });

  if (user) return <Navigate to={`/dashboard/${user.role}`} replace />;

  return (
    <div className="auth-layout">
      <section className="card">
        <h2>Login</h2>
        <form
          className="form-grid"
          onSubmit={(e) => {
            e.preventDefault();
            loginAction(form);
          }}
        >
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm((s) => ({ ...s, email: e.target.value }))}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm((s) => ({ ...s, password: e.target.value }))}
            required
          />
          <button className="btn" type="submit" disabled={loading}>
            Login
          </button>
          <button className="btn btn-ghost" type="button">
            Continue with Social Login
          </button>
          <a href="/" className="site-nav-link">Forgot password?</a>
        </form>
      </section>
      <section className="card auth-illustration">
        <h3>AI Workflow Visual</h3>
        <p>Secure access to your hackathon workspace, AI assistant, and role dashboards.</p>
      </section>
    </div>
  );
}
