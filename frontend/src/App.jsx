import { Navigate, Route, Routes } from "react-router-dom";

import { SiteFooter } from "./components/layout/SiteFooter";
import { SiteHeader } from "./components/layout/SiteHeader";
import { RoleRoute } from "./components/routing/RoleRoute";
import { AppProvider, useApp } from "./context/AppContext";
import { AnalyticsPage } from "./pages/AnalyticsPage";
import { AboutPage } from "./pages/AboutPage";
import { CertificatesPage } from "./pages/CertificatesPage";
import { CommunityPage } from "./pages/CommunityPage";
import { ContactPage } from "./pages/ContactPage";
import { ExploreHackathonsPage } from "./pages/ExploreHackathonsPage";
import { FeaturesPage } from "./pages/FeaturesPage";
import { HackathonsPage } from "./pages/HackathonsPage";
import { HowItWorksPage } from "./pages/HowItWorksPage";
import { JudgingPage } from "./pages/JudgingPage";
import { LandingPage } from "./pages/LandingPage";
import { LoginPage } from "./pages/LoginPage";
import { NotificationsPage } from "./pages/NotificationsPage";
import { PricingPage } from "./pages/PricingPage";
import { RegisterPage } from "./pages/RegisterPage";
import { SettingsPage } from "./pages/SettingsPage";
import { SubmissionFlowPage } from "./pages/SubmissionFlowPage";
import { SubmissionsPage } from "./pages/SubmissionsPage";
import { TeamsPage } from "./pages/TeamsPage";
import { AdminDashboardPage } from "./pages/dashboard/AdminDashboardPage";
import { JudgeDashboardPage } from "./pages/dashboard/JudgeDashboardPage";
import { MentorDashboardPage } from "./pages/dashboard/MentorDashboardPage";
import { OrganizerDashboardPage } from "./pages/dashboard/OrganizerDashboardPage";
import { ParticipantDashboardPage } from "./pages/dashboard/ParticipantDashboardPage";

function AppRoutes() {
  const { user } = useApp();

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/explore" element={<ExploreHackathonsPage />} />
      <Route path="/features" element={<FeaturesPage />} />
      <Route path="/how-it-works" element={<HowItWorksPage />} />
      <Route path="/pricing" element={<PricingPage />} />
      <Route path="/community" element={<CommunityPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<RegisterPage />} />

      <Route path="/hackathons" element={<HackathonsPage />} />
      <Route
        path="/teams"
        element={
          user ? (
            <RoleRoute allowRoles={["participant", "organizer", "judge", "mentor"]}>
              <TeamsPage />
            </RoleRoute>
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      <Route
        path="/submissions"
        element={
          user ? (
            <RoleRoute allowRoles={["participant", "organizer", "judge"]}>
              <SubmissionsPage />
            </RoleRoute>
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      <Route
        path="/judging"
        element={
          user ? (
            <RoleRoute allowRoles={["judge", "organizer"]}>
              <JudgingPage />
            </RoleRoute>
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      <Route
        path="/notifications"
        element={user ? <NotificationsPage /> : <Navigate to="/login" replace />}
      />
      <Route
        path="/certificates"
        element={user ? <CertificatesPage /> : <Navigate to="/login" replace />}
      />
      <Route
        path="/analytics"
        element={
          user ? (
            <RoleRoute allowRoles={["organizer", "judge", "mentor", "participant"]}>
              <AnalyticsPage />
            </RoleRoute>
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      <Route
        path="/submission-flow"
        element={
          user ? (
            <RoleRoute allowRoles={["participant", "organizer"]}>
              <SubmissionFlowPage />
            </RoleRoute>
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      <Route
        path="/settings"
        element={user ? <SettingsPage /> : <Navigate to="/login" replace />}
      />

      <Route
        path="/dashboard/admin"
        element={
          user ? (
            <RoleRoute allowRoles={["admin"]}>
              <AdminDashboardPage />
            </RoleRoute>
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      <Route
        path="/dashboard/organizer"
        element={
          user ? (
            <RoleRoute allowRoles={["organizer"]}>
              <OrganizerDashboardPage />
            </RoleRoute>
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      <Route
        path="/dashboard/participant"
        element={
          user ? (
            <RoleRoute allowRoles={["participant"]}>
              <ParticipantDashboardPage />
            </RoleRoute>
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      <Route
        path="/dashboard/judge"
        element={
          user ? (
            <RoleRoute allowRoles={["judge"]}>
              <JudgeDashboardPage />
            </RoleRoute>
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      <Route
        path="/dashboard/mentor"
        element={
          user ? (
            <RoleRoute allowRoles={["mentor"]}>
              <MentorDashboardPage />
            </RoleRoute>
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function AppLayout() {
  const { error, success } = useApp();

  return (
    <div className="app-shell">
      <SiteHeader />
      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}
      <main className="page-main">
        <AppRoutes />
      </main>
      <SiteFooter />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppLayout />
    </AppProvider>
  );
}
