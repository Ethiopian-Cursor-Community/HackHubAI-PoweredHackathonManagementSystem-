import { Link, useLocation } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { useNotificationStore } from "../../store/notificationStore";
import { ThemeToggle } from "../layout/ThemeToggle";

const sidebarConfig = {
  admin: [
    { to: "/dashboard/admin", label: "🏠 Overview", icon: "📊" },
    { to: "/hackathons", label: "🏗️ Events", icon: "🏗️" },
    { to: "/teams", label: "👥 Teams", icon: "👥" },
    { to: "/submissions", label: "📝 Submissions", icon: "📝" },
    { to: "/judging", label: "⚖️ Judging", icon: "⚖️" },
    { to: "/notifications", label: "🔔 Messages", icon: "🔔" },
    { to: "/analytics", label: "📈 Analytics", icon: "📈" },
    { to: "/certificates", label: "🏅 Certificates", icon: "🏅" },
    { to: "/settings", label: "⚙️ Settings", icon: "⚙️" },
  ],
  organizer: [
    { to: "/dashboard/organizer", label: "🏠 Overview", icon: "📊" },
    { to: "/hackathons", label: "🏗️ My Events", icon: "🏗️" },
    { to: "/teams", label: "👥 Teams", icon: "👥" },
    { to: "/submissions", label: "📝 Submissions", icon: "📝" },
    { to: "/judging", label: "⚖️ Judging", icon: "⚖️" },
    { to: "/notifications", label: "🔔 Messages", icon: "🔔" },
    { to: "/analytics", label: "📈 Analytics", icon: "📈" },
    { to: "/certificates", label: "🏅 Certificates", icon: "🏅" },
    { to: "/settings", label: "⚙️ Settings", icon: "⚙️" },
  ],
  judge: [
    { to: "/dashboard/judge", label: "🏠 Overview", icon: "📊" },
    { to: "/judging", label: "⚖️ Score Submissions", icon: "⚖️" },
    { to: "/submissions", label: "📝 View Projects", icon: "📝" },
    { to: "/hackathons", label: "🏗️ Hackathons", icon: "🏗️" },
    { to: "/notifications", label: "🔔 Messages", icon: "🔔" },
    { to: "/settings", label: "⚙️ Settings", icon: "⚙️" },
  ],
  mentor: [
    { to: "/dashboard/mentor", label: "🏠 Overview", icon: "📊" },
    { to: "/hackathons", label: "🏗️ Hackathons", icon: "🏗️" },
    { to: "/teams", label: "👥 Teams", icon: "👥" },
    { to: "/notifications", label: "🔔 Messages", icon: "🔔" },
    { to: "/settings", label: "⚙️ Settings", icon: "⚙️" },
  ],
  participant: [
    { to: "/dashboard/participant", label: "🏠 Overview", icon: "📊" },
    { to: "/hackathons", label: "🏗️ Explore Events", icon: "🏗️" },
    { to: "/teams", label: "👥 My Teams", icon: "👥" },
    { to: "/submissions", label: "📝 My Submissions", icon: "📝" },
    { to: "/submission-flow", label: "🚀 Submit Project", icon: "🚀" },
    { to: "/certificates", label: "🏅 Certificates", icon: "🏅" },
    { to: "/notifications", label: "🔔 Messages", icon: "🔔" },
    { to: "/settings", label: "⚙️ Settings", icon: "⚙️" },
  ],
};

export function DashboardShell({ title, children }) {
  const { user } = useAuthStore();
  const { unreadCount } = useNotificationStore();
  const location = useLocation();
  const role = user?.role || "participant";
  const links = sidebarConfig[role] || sidebarConfig.participant;

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Mobile Top Bar */}
      <div className="lg:hidden sticky top-0 z-40 border-b border-[var(--border)] bg-[var(--surface)]/95 backdrop-blur-md px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2.5 font-bold">
          <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-br from-[var(--primary)] to-[var(--primary-2)]" />
          <span className="text-sm">{title}</span>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link to="/notifications" className="relative p-2 rounded-lg hover:bg-[var(--surface-2)]">
            <span>🔔</span>
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 border-r border-[var(--border)] bg-[var(--surface)] h-screen sticky top-0">
        <div className="p-4 border-b border-[var(--border)]">
          <Link to="/" className="flex items-center gap-2.5 font-bold text-lg no-underline">
            <span className="w-3 h-3 rounded-full bg-gradient-to-br from-[var(--primary)] to-[var(--primary-2)] shadow-lg" />
            HackHub
          </Link>
        </div>

        {/* User info */}
        <div className="p-4 border-b border-[var(--border)]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[var(--primary)] to-[var(--primary-2)] flex items-center justify-center text-white text-sm font-bold shrink-0">
              {user?.username?.[0]?.toUpperCase() || "?"}
            </div>
            <div className="min-w-0">
              <div className="text-sm font-medium truncate">{user?.username}</div>
              <div className="text-xs capitalize text-[var(--muted)]">{user?.role}</div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-2 space-y-0.5">
          {links.map((link) => {
            const isActive = location.pathname === link.to;
            const isNotifs = link.to === "/notifications";
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  isActive
                    ? "bg-[var(--primary)]/10 text-[var(--primary)] font-medium"
                    : "text-[var(--muted)] hover:bg-[var(--surface-2)] hover:text-[var(--text)]"
                }`}
              >
                <span className="text-base">{link.icon}</span>
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

        {/* Bottom */}
        <div className="p-3 border-t border-[var(--border)]">
          <div className="flex items-center justify-between px-2">
            <ThemeToggle />
            <Link to="/profile" className="text-xs text-[var(--muted)] hover:text-[var(--text)]">Profile</Link>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-h-screen bg-[var(--bg)]">
        {/* Desktop Top Bar */}
        <div className="hidden lg:flex items-center justify-between px-6 h-16 border-b border-[var(--border)] bg-[var(--surface)]">
          <h1 className="text-lg font-bold">{title}</h1>
          <div className="flex items-center gap-3">
            <Link to="/notifications" className="relative p-2 rounded-lg hover:bg-[var(--surface-2)] transition-colors">
              <span className="text-lg">🔔</span>
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </Link>
            <div className="flex items-center gap-2 pl-3 border-l border-[var(--border)]">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--primary)] to-[var(--primary-2)] flex items-center justify-center text-white text-xs font-bold">
                {user?.username?.[0]?.toUpperCase() || "?"}
              </div>
              <div className="text-sm">
                <div className="font-medium text-sm">{user?.username}</div>
                <div className="text-xs capitalize text-[var(--muted)]">{user?.role}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 md:p-6 lg:p-6 max-w-7xl">
          {children}
        </div>
      </main>
    </div>
  );
}