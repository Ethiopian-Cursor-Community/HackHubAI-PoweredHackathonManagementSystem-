import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuthStore } from "../../store/authStore";
import { useNotificationStore } from "../../store/notificationStore";
import { ThemeToggle } from "../layout/ThemeToggle";
import { logout as apiLogout } from "../../services/authApi";

const sidebarConfig = {
  admin: [
    { to: "/dashboard/admin", label: "Overview", icon: "📊" },
    { to: "/hackathons", label: "Events", icon: "🏗️" },
    { to: "/teams", label: "Teams", icon: "👥" },
    { to: "/submissions", label: "Submissions", icon: "📝" },
    { to: "/judging", label: "Judging", icon: "⚖️" },
    { to: "/notifications", label: "Messages", icon: "🔔" },
    { to: "/analytics", label: "Analytics", icon: "📈" },
    { to: "/certificates", label: "Certificates", icon: "🏅" },
    { to: "/settings", label: "Settings", icon: "⚙️" },
  ],
  organizer: [
    { to: "/dashboard/organizer", label: "Overview", icon: "📊" },
    { to: "/hackathons", label: "My Events", icon: "🏗️" },
    { to: "/teams", label: "Teams", icon: "👥" },
    { to: "/submissions", label: "Submissions", icon: "📝" },
    { to: "/judging", label: "Judging", icon: "⚖️" },
    { to: "/notifications", label: "Messages", icon: "🔔" },
    { to: "/analytics", label: "Analytics", icon: "📈" },
    { to: "/certificates", label: "Certificates", icon: "🏅" },
    { to: "/settings", label: "Settings", icon: "⚙️" },
  ],
  judge: [
    { to: "/dashboard/judge", label: "Overview", icon: "📊" },
    { to: "/judging", label: "Score Submissions", icon: "⚖️" },
    { to: "/submissions", label: "View Projects", icon: "📝" },
    { to: "/hackathons", label: "Hackathons", icon: "🏗️" },
    { to: "/notifications", label: "Messages", icon: "🔔" },
    { to: "/settings", label: "Settings", icon: "⚙️" },
  ],
  mentor: [
    { to: "/dashboard/mentor", label: "Overview", icon: "📊" },
    { to: "/hackathons", label: "Hackathons", icon: "🏗️" },
    { to: "/teams", label: "Teams", icon: "👥" },
    { to: "/notifications", label: "Messages", icon: "🔔" },
    { to: "/settings", label: "Settings", icon: "⚙️" },
  ],
  participant: [
    { to: "/dashboard/participant", label: "Overview", icon: "📊" },
    { to: "/hackathons", label: "Explore Events", icon: "🏗️" },
    { to: "/teams", label: "My Teams", icon: "👥" },
    { to: "/submissions", label: "My Submissions", icon: "📝" },
    { to: "/submission-flow", label: "Submit Project", icon: "🚀" },
    { to: "/certificates", label: "Certificates", icon: "🏅" },
    { to: "/notifications", label: "Messages", icon: "🔔" },
    { to: "/settings", label: "Settings", icon: "⚙️" },
  ],
};

/**
 * DashboardShell — Persistent sidebar layout.
 * - Sidebar always visible and stays fixed on click navigation.
 * - Mobile: hamburger toggle that slides sidebar in/out.
 * - Desktop: always-visible sidebar.
 * - Menu items are role-sensitive (determined from user.role).
 */
export function DashboardShell({ title, children }) {
  const { user } = useAuthStore();
  const { unreadCount } = useNotificationStore();
  const location = useLocation();
  const navigate = useNavigate();
  const role = user?.role?.toLowerCase() || "participant";
  const links = sidebarConfig[role] || sidebarConfig.participant;
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const closeSidebar = () => setSidebarOpen(false);

  const handleLogout = async () => {
    closeSidebar();
    await apiLogout();
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen flex" style={{ background: "var(--bg)" }}>
      {/* ─── Mobile overlay ─── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* ─── Sidebar (always rendered, toggled on mobile) ─── */}
      <aside
        className={`
          fixed lg:sticky top-0 left-0 z-40 h-screen w-64
          border-r border-[var(--border)] bg-[var(--surface)]
          transform transition-transform duration-200 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 lg:block
          flex flex-col
        `}
      >
        {/* Logo */}
        <div className="p-4 border-b border-[var(--border)] flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 font-bold text-lg no-underline" onClick={closeSidebar}>
            <span className="w-3 h-3 rounded-full bg-gradient-to-br from-[var(--primary)] to-[var(--primary-2)] shadow-lg" />
            HackHub
          </Link>
          <button
            className="lg:hidden p-1 rounded hover:bg-[var(--surface-2)] transition-colors"
            onClick={closeSidebar}
          >
            <span className="text-lg">✕</span>
          </button>
        </div>

        {/* User info */}
        <div className="p-4 border-b border-[var(--border)]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[var(--primary)] to-[var(--primary-2)] flex items-center justify-center text-white text-sm font-bold shrink-0">
              {user?.username?.[0]?.toUpperCase() || "?"}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-sm font-medium truncate">{user?.username || "User"}</div>
              <div className="text-xs capitalize text-[var(--muted)]">{user?.role || "—"}</div>
            </div>
          </div>
        </div>

        {/* Navigation — role-based, stays constant */}
        <nav className="flex-1 overflow-y-auto p-2 space-y-0.5">
          {links.map((link) => {
            const isActive = location.pathname === link.to;
            const isNotifs = link.to === "/notifications";
            return (
              <Link
                key={link.to}
                to={link.to}
                onClick={closeSidebar}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  isActive
                    ? "bg-[var(--primary)]/10 text-[var(--primary)] font-semibold"
                    : "text-[var(--muted)] hover:bg-[var(--surface-2)] hover:text-[var(--text)]"
                }`}
              >
                <span className="text-base w-5 text-center">{link.icon}</span>
                <span>{link.label}</span>
                {isNotifs && unreadCount > 0 && (
                  <span className="ml-auto bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                    {unreadCount}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom actions */}
        <div className="p-3 border-t border-[var(--border)]">
          <div className="flex items-center justify-between px-2">
            <ThemeToggle />
            <Link
              to="/profile"
              onClick={closeSidebar}
              className="text-xs text-[var(--muted)] hover:text-[var(--text)] transition-colors"
            >
              Profile
            </Link>
            <button
              onClick={handleLogout}
              className="text-xs text-[var(--muted)] hover:text-red-500 transition-colors bg-transparent border-none cursor-pointer"
            >
              Exit
            </button>
          </div>
        </div>
      </aside>

      {/* ─── Main Content Area ─── */}
      <main className="flex-1 flex flex-col min-h-screen w-full lg:w-[calc(100%-16rem)]">
        {/* Top bar */}
        <header className="sticky top-0 z-20 border-b border-[var(--border)] bg-[var(--surface)]/95 backdrop-blur-md">
          <div className="flex items-center justify-between px-4 h-14 lg:px-6 lg:h-16">
            {/* Left: hamburger + title */}
            <div className="flex items-center gap-3">
              {/* Hamburger — only on mobile */}
              <button
                className="lg:hidden p-2 rounded-lg hover:bg-[var(--surface-2)] transition-colors"
                onClick={() => setSidebarOpen(true)}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <h1 className="text-base lg:text-lg font-bold truncate">{title}</h1>
            </div>

            {/* Right: actions */}
            <div className="flex items-center gap-2 lg:gap-3">
              <Link to="/notifications" className="relative p-2 rounded-lg hover:bg-[var(--surface-2)] transition-colors">
                <span className="text-lg">🔔</span>
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </Link>
              <div className="hidden sm:flex items-center gap-2 pl-3 border-l border-[var(--border)]">
                <div className="w-7 h-7 lg:w-8 lg:h-8 rounded-full bg-gradient-to-br from-[var(--primary)] to-[var(--primary-2)] flex items-center justify-center text-white text-xs font-bold shrink-0">
                  {user?.username?.[0]?.toUpperCase() || "?"}
                </div>
                <div className="hidden md:block text-sm">
                  <div className="font-medium text-sm leading-tight">{user?.username}</div>
                  <div className="text-xs capitalize text-[var(--muted)] leading-tight">{user?.role}</div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 p-4 md:p-6 lg:p-6 max-w-7xl w-full">
          {children}
        </div>

        {/* Footer */}
        <footer className="border-t border-[var(--border)] bg-[var(--surface)] px-4 lg:px-6 py-4">
          <div className="text-center text-xs text-[var(--muted)]">
            © 2025 HackHub — AI-Powered Hackathon Management
          </div>
        </footer>
      </main>
    </div>
  );
}