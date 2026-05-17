import { Navigate } from "react-router-dom";

import { useApp } from "../../context/AppContext";

export function RoleRoute({ children, allowRoles = [] }) {
  const { user } = useApp();
  if (!user) {
    return <Navigate to="/auth" replace />;
  }
  if (!allowRoles.length || allowRoles.includes(user.role) || user.role === "admin") {
    return children;
  }
  return <Navigate to="/" replace />;
}
