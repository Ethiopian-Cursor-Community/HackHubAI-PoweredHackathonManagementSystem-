import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { request } from "../services/http";

export function ProfilePage() {
  const { userId } = useParams();
  const currentUser = useAuthStore((s) => s.user);
  const isOwnProfile = !userId || String(currentUser?.id) === String(userId);

  const { data: profile } = useQuery({
    queryKey: ["profile", userId || "me"],
    queryFn: () => request(isOwnProfile ? "/auth/me/" : `/users/${userId}/`),
  });

  const user = profile || currentUser;

  if (!user) return <p>Loading...</p>;

  return (
    <div className="card max-w-lg mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[var(--primary)] to-[var(--primary-2)] flex items-center justify-center text-white text-xl font-bold">
          {user.username?.[0]?.toUpperCase() || "?"}
        </div>
        <div>
          <h2 className="text-xl font-bold m-0">{user.username}</h2>
          <p className="text-[var(--muted)] text-sm m-0">{user.email}</p>
          <span className="badge">{user.role}</span>
        </div>
      </div>

      <div className="space-y-3">
        <div>
          <strong>Name:</strong> {user.first_name} {user.last_name}
        </div>
        <div>
          <strong>Skills:</strong>
          <div className="flex flex-wrap gap-1 mt-1">
            {user.skills?.length > 0
              ? user.skills.map((s, i) => <span key={i} className="badge">{s}</span>)
              : <span className="text-[var(--muted)]">Not specified</span>}
          </div>
        </div>
        <div>
          <strong>Email Verified:</strong> {user.is_email_verified ? "✅ Yes" : "❌ No"}
        </div>
        <div>
          <strong>Member since:</strong> {new Date(user.created_at || user.date_joined).toLocaleDateString()}
        </div>
      </div>
    </div>
  );
}