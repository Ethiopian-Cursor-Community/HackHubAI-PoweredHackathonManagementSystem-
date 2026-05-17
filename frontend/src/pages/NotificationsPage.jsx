import { useEffect, useState } from "react";

import { listNotifications, markNotificationRead } from "../services/api";
import { useApp } from "../context/AppContext";

export function NotificationsPage() {
  const { run, realtimeNotifications, clearRealtimeNotifications } = useApp();
  const [notifications, setNotifications] = useState([]);

  const load = async () => {
    const data = await listNotifications();
    setNotifications(data);
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <section className="card">
      <h2>Notifications</h2>
      {realtimeNotifications.length > 0 && (
        <div className="form-grid">
          <h3>Live Notifications</h3>
          <button className="btn btn-ghost" onClick={clearRealtimeNotifications}>
            Clear Live Feed
          </button>
          <div className="list">
            {realtimeNotifications.map((n) => (
              <article key={`live-${n.id}-${n.created_at}`} className="list-item">
                <div>
                  <strong>{n.title}</strong>
                  <p>{n.body}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      )}
      <div className="list">
        {notifications.map((n) => (
          <article key={n.id} className="list-item">
            <div>
              <strong>{n.title}</strong>
              <p>{n.body}</p>
            </div>
            {!n.is_read && (
              <button
                className="btn btn-ghost"
                onClick={() =>
                  run(async () => {
                    await markNotificationRead(n.id);
                    await load();
                  }, "Notification updated")
                }
              >
                Mark Read
              </button>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}
