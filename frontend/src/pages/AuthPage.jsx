import { useState } from "react";
import { Navigate } from "react-router-dom";

import { useApp } from "../context/AppContext";

export function AuthPage() {
  const { user, loading, loginAction, registerAction, initialRegisterForm } = useApp();
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [registerForm, setRegisterForm] = useState(initialRegisterForm);

  if (user) {
    return <Navigate to="/hackathons" replace />;
  }

  return (
    <div className="page-grid">
      <section className="card">
        <h2>Login</h2>
        <form
          className="form-grid"
          onSubmit={(e) => {
            e.preventDefault();
            loginAction(loginForm);
          }}
        >
          <input
            placeholder="Email"
            type="email"
            value={loginForm.email}
            onChange={(e) => setLoginForm((s) => ({ ...s, email: e.target.value }))}
            required
          />
          <input
            placeholder="Password"
            type="password"
            value={loginForm.password}
            onChange={(e) => setLoginForm((s) => ({ ...s, password: e.target.value }))}
            required
          />
          <button className="btn" type="submit" disabled={loading}>
            Sign In
          </button>
        </form>
      </section>

      <section className="card">
        <h2>Register</h2>
        <form
          className="form-grid"
          onSubmit={(e) => {
            e.preventDefault();
            registerAction(registerForm);
          }}
        >
          <input
            placeholder="Email"
            type="email"
            value={registerForm.email}
            onChange={(e) => setRegisterForm((s) => ({ ...s, email: e.target.value }))}
            required
          />
          <input
            placeholder="Username"
            value={registerForm.username}
            onChange={(e) => setRegisterForm((s) => ({ ...s, username: e.target.value }))}
            required
          />
          <input
            placeholder="First name"
            value={registerForm.first_name}
            onChange={(e) => setRegisterForm((s) => ({ ...s, first_name: e.target.value }))}
          />
          <input
            placeholder="Last name"
            value={registerForm.last_name}
            onChange={(e) => setRegisterForm((s) => ({ ...s, last_name: e.target.value }))}
          />
          <input
            placeholder="Password"
            type="password"
            value={registerForm.password}
            onChange={(e) => setRegisterForm((s) => ({ ...s, password: e.target.value }))}
            required
          />
          <select
            value={registerForm.role}
            onChange={(e) => setRegisterForm((s) => ({ ...s, role: e.target.value }))}
          >
            <option value="participant">participant</option>
            <option value="organizer">organizer</option>
            <option value="judge">judge</option>
            <option value="mentor">mentor</option>
          </select>
          <button className="btn" type="submit" disabled={loading}>
            Create Account
          </button>
        </form>
      </section>
    </div>
  );
}
