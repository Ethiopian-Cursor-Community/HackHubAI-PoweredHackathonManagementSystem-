import { useState } from "react";
import { Navigate } from "react-router-dom";

import { useApp } from "../context/AppContext";

const initialForm = {
  username: "",
  first_name: "",
  last_name: "",
  email: "",
  role: "participant",
  password: "",
  skills: []
};

export function RegisterPage() {
  const { user, registerAction, loading } = useApp();
  const [form, setForm] = useState(initialForm);
  const [skillsInput, setSkillsInput] = useState("");

  if (user) return <Navigate to={`/dashboard/${user.role}`} replace />;

  return (
    <div className="auth-layout">
      <section className="card">
        <h2>Sign Up</h2>
        <form
          className="form-grid"
          onSubmit={(e) => {
            e.preventDefault();
            registerAction(form);
          }}
        >
          <input placeholder="Name / Username" value={form.username} onChange={(e) => setForm((s) => ({ ...s, username: e.target.value }))} required />
          <input placeholder="First Name" value={form.first_name} onChange={(e) => setForm((s) => ({ ...s, first_name: e.target.value }))} />
          <input placeholder="Last Name" value={form.last_name} onChange={(e) => setForm((s) => ({ ...s, last_name: e.target.value }))} />
          <input type="email" placeholder="Email" value={form.email} onChange={(e) => setForm((s) => ({ ...s, email: e.target.value }))} required />
          <select value={form.role} onChange={(e) => setForm((s) => ({ ...s, role: e.target.value }))}>
            <option value="participant">Participant</option>
            <option value="organizer">Organizer</option>
            <option value="judge">Judge</option>
            <option value="mentor">Mentor</option>
          </select>
          <input
            placeholder="Skills (comma separated)"
            value={skillsInput}
            onChange={(e) => setSkillsInput(e.target.value)}
            onBlur={() =>
              setForm((s) => ({
                ...s,
                skills: skillsInput
                  .split(",")
                  .map((v) => v.trim())
                  .filter(Boolean)
              }))
            }
          />
          <input type="password" placeholder="Password" value={form.password} onChange={(e) => setForm((s) => ({ ...s, password: e.target.value }))} required />
          <button className="btn" type="submit" disabled={loading}>Create Account</button>
        </form>
      </section>
      <section className="card auth-illustration">
        <h3>AI-powered onboarding</h3>
        <p>Choose your role and skills to unlock tailored recommendations and workflows.</p>
      </section>
    </div>
  );
}
