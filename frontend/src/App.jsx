import { Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "./store/authStore";
import { useSocket } from "./hooks/useSocket";
import { ThemeToggle } from "./components/layout/ThemeToggle";

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
    return <Navigate to="/" replace />;
  return children;
}

function AppLayout({ children }) {
  useSocket();
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

export default function App() {
  const { accessToken } = useAuthStore();

  return (
    <div className="app-shell" style={{ background: "var(--bg)", color: "var(--text)" }}>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={accessToken ? <Navigate to="/hackathons" /> : <LoginPage />} />
        <Route path="/register" element={accessToken ? <Navigate to="/hackathons" /> : <RegisterPage />} />
        <Route path="/signup" element={accessToken ? <Navigate to="/hackathons" /> : <RegisterPage />} />
        <Route path="/explore" element={<AppLayout><ExploreHackathonsPage /></AppLayout>} />

        {/* Public pages */}
        <Route path="/certificates/verify/:verificationId" element={<VerifyCertificatePage />} />
        <Route path="/leaderboard/:hackathonId" element={<LeaderboardPage />} />

        {/* Protected routes */}
        <Route path="/hackathons" element={<AppLayout><HackathonsPage /></AppLayout>} />
        <Route path="/teams" element={<AppLayout><ProtectedRoute allowedRoles={["participant", "organizer", "judge", "mentor"]}><TeamsPage /></ProtectedRoute></AppLayout>} />
        <Route path="/submissions" element={<AppLayout><ProtectedRoute allowedRoles={["participant", "organizer", "judge"]}><SubmissionsPage /></ProtectedRoute></AppLayout>} />
        <Route path="/submission-flow" element={<AppLayout><ProtectedRoute allowedRoles={["participant", "organizer"]}><SubmissionFlowPage /></ProtectedRoute></AppLayout>} />
        <Route path="/judging" element={<AppLayout><ProtectedRoute allowedRoles={["judge", "organizer"]}><JudgingPage /></ProtectedRoute></AppLayout>} />
        <Route path="/notifications" element={<AppLayout><ProtectedRoute><NotificationsPage /></ProtectedRoute></AppLayout>} />
        <Route path="/certificates" element={<AppLayout><ProtectedRoute><CertificatesPage /></ProtectedRoute></AppLayout>} />
        <Route path="/analytics" element={<AppLayout><ProtectedRoute><AnalyticsPage /></ProtectedRoute></AppLayout>} />
        <Route path="/settings" element={<AppLayout><ProtectedRoute><SettingsPage /></ProtectedRoute></AppLayout>} />
        <Route path="/profile/:userId" element={<AppLayout><ProtectedRoute><ProfilePage /></ProtectedRoute></AppLayout>} />

        {/* Dashboards */}
        <Route path="/dashboard/admin" element={<AppLayout><ProtectedRoute allowedRoles={["admin"]}><AdminDashboardPage /></ProtectedRoute></AppLayout>} />
        <Route path="/dashboard/organizer" element={<AppLayout><ProtectedRoute allowedRoles={["organizer"]}><OrganizerDashboardPage /></ProtectedRoute></AppLayout>} />
        <Route path="/dashboard/participant" element={<AppLayout><ProtectedRoute allowedRoles={["participant"]}><ParticipantDashboardPage /></ProtectedRoute></AppLayout>} />
        <Route path="/dashboard/judge" element={<AppLayout><ProtectedRoute allowedRoles={["judge"]}><JudgeDashboardPage /></ProtectedRoute></AppLayout>} />
        <Route path="/dashboard/mentor" element={<AppLayout><ProtectedRoute allowedRoles={["mentor"]}><MentorDashboardPage /></ProtectedRoute></AppLayout>} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}