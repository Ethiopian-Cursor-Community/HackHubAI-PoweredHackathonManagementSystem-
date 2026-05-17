import { Link, NavLink } from "react-router-dom";

import { useApp } from "../../context/AppContext";

const navItems = [
  { to: "/", label: "Home" },
  { to: "/explore", label: "Explore Hackathons" },
  { to: "/features", label: "Features" },
  { to: "/how-it-works", label: "How It Works" },
  { to: "/pricing", label: "Pricing" },
  { to: "/community", label: "Community" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" }
];

export function SiteHeader() {
  const { user, logoutAction, theme, toggleTheme } = useApp();

  return (
    <header className="site-header sticky">
      <div className="site-header-inner">
        <Link to="/" className="brand">
          <span className="brand-dot" />
          HackHub
        </Link>

        <nav className="site-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                isActive ? "site-nav-link site-nav-link-active" : "site-nav-link"
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="site-actions">
          <button className="btn btn-ghost" onClick={toggleTheme}>
            {theme === "light" ? "Dark" : "Light"}
          </button>
          {user ? (
            <>
              <Link to={`/dashboard/${user.role}`} className="btn btn-ghost">
                Dashboard
              </Link>
              <button className="btn btn-danger" onClick={logoutAction}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-ghost">
                Login
              </Link>
              <Link to="/signup" className="btn">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
