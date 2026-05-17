import { Navigate, Route, Routes } from "react-router-dom";

import { AppHeader } from "./components/layout/AppHeader";
import { AppNav } from "./components/layout/AppNav";
import { RoleRoute } from "./components/routing/RoleRoute";
import { AppProvider, useApp } from "./context/AppContext";
import { AnalyticsPage } from "./pages/AnalyticsPage";
import { AuthPage } from "./pages/AuthPage";
import { CertificatesPage } from "./pages/CertificatesPage";
import { HackathonsPage } from "./pages/HackathonsPage";
import { HomePage } from "./pages/HomePage";
import { JudgingPage } from "./pages/JudgingPage";
import { NotificationsPage } from "./pages/NotificationsPage";
import { SubmissionsPage } from "./pages/SubmissionsPage";
import { TeamsPage } from "./pages/TeamsPage";

function AppRoutes() {
  const { user } = useApp();

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/hackathons" element={<HackathonsPage />} />
      <Route
        path="/teams"
        element={
          user ? (
            <RoleRoute allowRoles={["participant", "organizer", "judge", "mentor"]}>
              <TeamsPage />
            </RoleRoute>
          ) : (
            <Navigate to="/auth" replace />
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
            <Navigate to="/auth" replace />
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
            <Navigate to="/auth" replace />
          )
        }
      />
      <Route
        path="/notifications"
        element={user ? <NotificationsPage /> : <Navigate to="/auth" replace />}
      />
      <Route
        path="/certificates"
        element={user ? <CertificatesPage /> : <Navigate to="/auth" replace />}
      />
      <Route
        path="/analytics"
        element={
          user ? (
            <RoleRoute allowRoles={["organizer", "judge", "mentor"]}>
              <AnalyticsPage />
            </RoleRoute>
          ) : (
            <Navigate to="/auth" replace />
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
      <AppHeader />
      <AppNav />
      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}
      <main className="page-main">
        <AppRoutes />
      </main>
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
