import { useEffect, useState } from "react";
import { Link, Route, Routes } from "react-router-dom";
import { getHealth } from "./services/api";

function HomePage() {
  const [status, setStatus] = useState("checking...");

  useEffect(() => {
    getHealth()
      .then(() => setStatus("backend connected"))
      .catch(() => setStatus("backend unavailable"));
  }, []);

  return (
    <main>
      <h1>HackHub</h1>
      <p>AI-Powered Hackathon Management System</p>
      <p>API status: {status}</p>
    </main>
  );
}

function DashboardPage() {
  return <h2>Dashboard (starter page)</h2>;
}

export default function App() {
  return (
    <div>
      <nav>
        <Link to="/">Home</Link> | <Link to="/dashboard">Dashboard</Link>
      </nav>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
      </Routes>
    </div>
  );
}
