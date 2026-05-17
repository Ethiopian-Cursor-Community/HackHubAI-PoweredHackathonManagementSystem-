import { NavLink } from "react-router-dom";

import { useApp } from "../../context/AppContext";

function NavItem({ to, children }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) => (isActive ? "nav-link nav-link-active" : "nav-link")}
    >
      {children}
    </NavLink>
  );
}

export function AppNav() {
  const { user } = useApp();

  return (
    <nav className="nav">
      <NavItem to="/">Home</NavItem>
      {!user && <NavItem to="/auth">Auth</NavItem>}
      <NavItem to="/hackathons">Hackathons</NavItem>
      {user && (
        <>
          <NavItem to="/teams">Teams</NavItem>
          <NavItem to="/submissions">Submissions</NavItem>
          <NavItem to="/judging">Judging</NavItem>
          <NavItem to="/notifications">Notifications</NavItem>
          <NavItem to="/certificates">Certificates</NavItem>
          <NavItem to="/analytics">Analytics</NavItem>
        </>
      )}
    </nav>
  );
}
