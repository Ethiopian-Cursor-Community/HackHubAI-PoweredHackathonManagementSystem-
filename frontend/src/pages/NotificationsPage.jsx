import { useNotifications } from "../hooks/useNotifications";

export function NotificationsPage() {
  const { notifications, unreadCount, markRead, markAllRead, isLoading } = useNotifications();

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Notifications {unreadCount > 0 && <span className="text-sm text-[var(--primary)]">({unreadCount} unread)</span>}</h1>
        {unreadCount > 0 && <button className="btn btn-ghost text-sm" onClick={markAllRead}>Mark All Read</button>}
      </div>

      {isLoading ? <p>Loading notifications...</p> : (
        <div className="space-y-2">
          {notifications?.length === 0 && <p className="text-[var(--muted)]">No notifications yet.</p>}
          {notifications?.map((n) => (
            <div
              key={n.id}
              className={`card cursor-pointer ${!n.is_read ? "border-[var(--primary)]" : ""}`}
              onClick={() => !n.is_read && markRead(n.id)}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    {!n.is_read && <span className="w-2 h-2 rounded-full bg-[var(--primary)]" />}
                    <h4 className="font-bold m-0 text-sm">{n.title}</h4>
                  </div>
                  <p className="text-sm text-[var(--muted)] m-0 mt-1">{n.body}</p>
                  <span className="text-xs text-[var(--muted)]">{new Date(n.created_at).toLocaleString()}</span>
                </div>
                <span className="text-xs bg-[var(--surface-2)] px-2 py-1 rounded">{n.event_type}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}