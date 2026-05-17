import { Link } from "react-router-dom";

import { useApp } from "../../context/AppContext";

const sidebarItems = [
  { to: "/dashboard/admin", label: "Dashboard" },
  { to: "/hackathons", label: "Hackathons" },
  { to: "/teams", label: "Teams" },
  { to: "/notifications", label: "Messages" },
  { to: "/analytics", label: "Analytics" },
  { to: "/settings", label: "Settings" }
];

export function DashboardShell({ title, children }) {
  const { user } = useApp();

  return (
    <div className="dashboard-shell">
      <aside className="dashboard-sidebar">
        <h3>HackHub</h3>
        {sidebarItems.map((item) => (
          <Link key={item.to} to={item.to} className="dashboard-link">
            {item.label}
          </Link>
        ))}
      </aside>

      <section className="dashboard-main">
        <header className="dashboard-topbar">
          <input placeholder="Search..." />
          <div className="badge-row">
            <span className="badge">Notifications</span>
            <span className="badge">AI Assistant</span>
            <span className="badge">{user?.username || "Profile"}</span>
          </div>
        </header>
        <h2>{title}</h2>
        <div className="dashboard-content">{children}</div>
      </section>
    </div>
  );
}
