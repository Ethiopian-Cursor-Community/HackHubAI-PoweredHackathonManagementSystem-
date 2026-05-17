/**
 * Returns the dashboard route for a given user role.
 */
export function getDashboardRoute(user) {
  if (!user) return "/login";
  const roleMap = {
    admin: "/dashboard/admin",
    organizer: "/dashboard/organizer",
    judge: "/dashboard/judge",
    mentor: "/dashboard/mentor",
    participant: "/dashboard/participant",
  };
  const role = user?.role?.toLowerCase() || "participant";
  return roleMap[role] || "/dashboard/participant";
}