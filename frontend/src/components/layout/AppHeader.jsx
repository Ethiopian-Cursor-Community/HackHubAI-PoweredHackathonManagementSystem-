import { useApp } from "../../context/AppContext";

export function AppHeader() {
  const { health, user, logoutAction, loading } = useApp();

  return (
    <header className="topbar">
      <div>
        <h1>HackHub Control Center</h1>
        <p>API status: {health}</p>
      </div>
      <div className="badge-row">
        <span className="badge">{user ? `${user.username} (${user.role})` : "Guest"}</span>
        {user && (
          <button className="btn btn-danger" onClick={logoutAction} disabled={loading}>
            Logout
          </button>
        )}
      </div>
    </header>
  );
}
