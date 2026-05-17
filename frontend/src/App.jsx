import { Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "./store/authStore";
import { useSocket } from "./hooks/useSocket";
import { ThemeToggle } from "./components/layout/ThemeToggle";
import { getDashboardRoute } from "./lib/dashboardRoutes";
import { DashboardShell } from "./components/dashboard/DashboardShell";

// Pages
import { LandingPage } from "./pages/LandingPage";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { HackathonsPage } from "./pages/HackathonsPage";
import { TeamsPage } from "./pages/TeamsPage";
import { SubmissionsPage } from "./pages/SubmissionsPage";
import { JudgingPage } from "./pages/JudgingPage";
import { NotificationsPage } from "./pages/NotificationsPage";
import { CertificatesPage } from "./pages/CertificatesPage";
import { SettingsPage } from "./pages/SettingsPage";
import { ExploreHackathonsPage } from "./pages/ExploreHackathonsPage";
import { AdminDashboardPage } from "./pages/dashboard/AdminDashboardPage";
import { OrganizerDashboardPage } from "./pages/dashboard/OrganizerDashboardPage";
import { ParticipantDashboardPage } from "./pages/dashboard/ParticipantDashboardPage";
import { JudgeDashboardPage } from "./pages/dashboard/JudgeDashboardPage";
import { MentorDashboardPage } from "./pages/dashboard/MentorDashboardPage";
import { AnalyticsPage } from "./pages/AnalyticsPage";
import { SubmissionFlowPage } from "./pages/SubmissionFlowPage";
import { LeaderboardPage } from "./pages/LeaderboardPage";
import { ProfilePage } from "./pages/ProfilePage";
import { VerifyCertificatePage } from "./pages/VerifyCertificatePage";

function ProtectedRoute({ children, allowedRoles }) {
  const { user, accessToken } = useAuthStore();
  if (!accessToken || !user) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role) && user.role !== "admin")
    return <Navigate to={getDashboardRoute(user)} replace />;
  return children;
}

function AlreadyAuthenticated({ children }) {
  const { user, accessToken } = useAuthStore();
  if (accessToken && user) {
    return <Navigate to={getDashboardRoute(user)} replace />;
  }
  return children;
}

function AppLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-40 border-b border-[var(--border)] bg-[var(--surface)]/95 backdrop-blur-md">
        <div className="w-full max-w-[1200px] mx-auto px-4 h-[72px] flex items-center justify-between gap-3">
          <a href="/" className="flex items-center gap-2.5 font-bold no-underline text-[var(--text)]">
            <span className="w-3 h-3 rounded-full bg-gradient-to-br from-[var(--primary)] to-[var(--primary-2)] shadow-[0_0_20px_var(--primary)]" />
            HackHub
          </a>
          <nav className="flex gap-1.5 flex-wrap">
            <a href="/hackathons" className="nav-link">Hackathons</a>
            <a href="/explore" className="nav-link">Explore</a>
            <a href="/teams" className="nav-link">Teams</a>
            <a href="/notifications" className="nav-link">Notifications</a>
            <a href="/certificates" className="nav-link">Certificates</a>
          </nav>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <a href="/login" className="btn">Sign In</a>
          </div>
        </div>
      </header>
      <main className="flex-1 w-full max-w-[1200px] mx-auto px-4 py-5">
        {children}
      </main>
      <footer className="border-t border-[var(--border)] bg-[var(--surface)] mt-5 py-6 px-4">
        <div className="max-w-[1200px] mx-auto text-center text-sm text-[var(--muted)]">
          © 2025 HackHub — AI-Powered Hackathon Management
        </div>
      </footer>
    </div>
  );
}

function DynamicLayout({ children, title }) {
  const { user } = useAuthStore();
  if (user) {
    return <DashboardShell title={title}>{children}</DashboardShell>;
  }
  return <AppLayout>{children}</AppLayout>;
}

export default function App() {
  useSocket();
  return (
    <div className="app-shell" style={{ background: "var(--bg)", color: "var(--text)" }}>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<AlreadyAuthenticated><LoginPage /></AlreadyAuthenticated>} />
        <Route path="/register" element={<AlreadyAuthenticated><RegisterPage /></AlreadyAuthenticated>} />
        <Route path="/signup" element={<AlreadyAuthenticated><RegisterPage /></AlreadyAuthenticated>} />
        <Route path="/explore" element={<DynamicLayout title="Explore"><ExploreHackathonsPage /></DynamicLayout>} />
        <Route path="/certificates/verify/:verificationId" element={<VerifyCertificatePage />} />
        <Route path="/leaderboard/:hackathonId" element={<LeaderboardPage />} />

        {/* Role-Specific Dashboards */}
        <Route path="/dashboard" element={<DashboardRedirect />} />
        <Route path="/dashboard/admin" element={<ProtectedRoute allowedRoles={["admin"]}><AdminDashboardPage /></ProtectedRoute>} />
        <Route path="/dashboard/organizer" element={<ProtectedRoute allowedRoles={["organizer"]}><OrganizerDashboardPage /></ProtectedRoute>} />
        <Route path="/dashboard/participant" element={<ProtectedRoute allowedRoles={["participant"]}><ParticipantDashboardPage /></ProtectedRoute>} />
        <Route path="/dashboard/judge" element={<ProtectedRoute allowedRoles={["judge"]}><JudgeDashboardPage /></ProtectedRoute>} />
        <Route path="/dashboard/mentor" element={<ProtectedRoute allowedRoles={["mentor"]}><MentorDashboardPage /></ProtectedRoute>} />

        {/* Shared authenticated pages */}
        <Route path="/hackathons" element={<DynamicLayout title="Hackathons"><HackathonsPage /></DynamicLayout>} />
        <Route path="/teams" element={<DynamicLayout title="Teams"><ProtectedRoute allowedRoles={["participant", "organizer", "judge", "mentor"]}><TeamsPage /></ProtectedRoute></DynamicLayout>} />
        <Route path="/submissions" element={<DynamicLayout title="Submissions"><ProtectedRoute allowedRoles={["participant", "organizer", "judge"]}><SubmissionsPage /></ProtectedRoute></DynamicLayout>} />
        <Route path="/submission-flow" element={<DynamicLayout title="Submit Project"><ProtectedRoute allowedRoles={["participant", "organizer"]}><SubmissionFlowPage /></ProtectedRoute></DynamicLayout>} />
        <Route path="/judging" element={<DynamicLayout title="Judging"><ProtectedRoute allowedRoles={["judge", "organizer"]}><JudgingPage /></ProtectedRoute></DynamicLayout>} />
        <Route path="/notifications" element={<DynamicLayout title="Notifications"><ProtectedRoute><NotificationsPage /></ProtectedRoute></DynamicLayout>} />
        <Route path="/certificates" element={<DynamicLayout title="Certificates"><ProtectedRoute><CertificatesPage /></ProtectedRoute></DynamicLayout>} />
        <Route path="/analytics" element={<DynamicLayout title="Analytics"><ProtectedRoute><AnalyticsPage /></ProtectedRoute></DynamicLayout>} />
        <Route path="/settings" element={<DynamicLayout title="Settings"><ProtectedRoute><SettingsPage /></ProtectedRoute></DynamicLayout>} />
        <Route path="/profile/:userId" element={<DynamicLayout title="Profile"><ProtectedRoute><ProfilePage /></ProtectedRoute></DynamicLayout>} />
        <Route path="/profile" element={<DynamicLayout title="Profile"><ProtectedRoute><ProfilePage /></ProtectedRoute></DynamicLayout>} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

/** Redirects /dashboard to the user's role-specific dashboard */
function DashboardRedirect() {
  const { user, accessToken } = useAuthStore();
  if (!accessToken || !user) return <Navigate to="/login" replace />;
  return <Navigate to={getDashboardRoute(user)} replace />;
}