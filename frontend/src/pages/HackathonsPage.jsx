import { useEffect, useState } from "react";

import {
  announceHackathon,
  createHackathon,
  listHackathons,
  publishResults,
  publishHackathon,
  registerHackathon
} from "../services/api";
import { useApp } from "../context/AppContext";

const initialHackathonForm = {
  title: "",
  description: "",
  registration_start: "",
  registration_end: "",
  start_date: "",
  end_date: "",
  submission_deadline: ""
};

export function HackathonsPage() {
  const { user, isOrganizer, isParticipant, run, loading } = useApp();
  const [hackathons, setHackathons] = useState([]);
  const [hackathonForm, setHackathonForm] = useState(initialHackathonForm);
  const [selectedHackathon, setSelectedHackathon] = useState("");
  const [announceMessage, setAnnounceMessage] = useState("");

  const loadHackathons = async () => {
    const data = await listHackathons();
    setHackathons(data);
  };

  useEffect(() => {
    loadHackathons();
  }, []);

  return (
    <section className="card">
      <h2>Hackathons</h2>
      <div className="list">
        {hackathons.map((h) => (
          <article key={h.id} className="list-item">
            <div>
              <strong>{h.title}</strong>
              <p>
                {h.status} • organizer: {h.organizer_name || h.organizer}
              </p>
            </div>
            {user && (
              <div className="row-actions">
                {isParticipant && (
                  <button className="btn btn-ghost" onClick={() => run(() => registerHackathon(h.id), "Registered")}>
                    Register
                  </button>
                )}
                {isOrganizer && (
                  <>
                    <button
                      className="btn btn-ghost"
                      onClick={() =>
                        run(async () => {
                          await publishHackathon(h.id);
                          await loadHackathons();
                        }, "Published")
                      }
                    >
                      Publish
                    </button>
                    <button
                      className="btn btn-ghost"
                      onClick={() =>
                        run(async () => {
                          await publishResults(h.id);
                          await loadHackathons();
                        }, "Results published")
                      }
                    >
                      Publish Results
                    </button>
                  </>
                )}
              </div>
            )}
          </article>
        ))}
      </div>

      {user && isOrganizer && (
        <form
          className="form-grid"
          onSubmit={(e) => {
            e.preventDefault();
            run(async () => {
              await createHackathon(hackathonForm);
              setHackathonForm(initialHackathonForm);
              await loadHackathons();
            }, "Hackathon created");
          }}
        >
          <h3>Create Hackathon</h3>
          <input
            placeholder="Title"
            value={hackathonForm.title}
            onChange={(e) => setHackathonForm((s) => ({ ...s, title: e.target.value }))}
            required
          />
          <textarea
            placeholder="Description"
            value={hackathonForm.description}
            onChange={(e) => setHackathonForm((s) => ({ ...s, description: e.target.value }))}
          />
          <label>Registration start</label>
          <input
            type="datetime-local"
            value={hackathonForm.registration_start}
            onChange={(e) => setHackathonForm((s) => ({ ...s, registration_start: e.target.value }))}
            required
          />
          <label>Registration end</label>
          <input
            type="datetime-local"
            value={hackathonForm.registration_end}
            onChange={(e) => setHackathonForm((s) => ({ ...s, registration_end: e.target.value }))}
            required
          />
          <label>Start date</label>
          <input
            type="datetime-local"
            value={hackathonForm.start_date}
            onChange={(e) => setHackathonForm((s) => ({ ...s, start_date: e.target.value }))}
            required
          />
          <label>End date</label>
          <input
            type="datetime-local"
            value={hackathonForm.end_date}
            onChange={(e) => setHackathonForm((s) => ({ ...s, end_date: e.target.value }))}
            required
          />
          <label>Submission deadline</label>
          <input
            type="datetime-local"
            value={hackathonForm.submission_deadline}
            onChange={(e) => setHackathonForm((s) => ({ ...s, submission_deadline: e.target.value }))}
            required
          />
          <button className="btn" type="submit" disabled={loading}>
            Save Hackathon
          </button>
        </form>
      )}

      {user && isOrganizer && (
        <div className="form-grid">
          <h3>Broadcast Announcement</h3>
          <select value={selectedHackathon} onChange={(e) => setSelectedHackathon(e.target.value)}>
            <option value="">Select hackathon</option>
            {hackathons.map((h) => (
              <option key={h.id} value={h.id}>
                {h.title}
              </option>
            ))}
          </select>
          <textarea
            value={announceMessage}
            onChange={(e) => setAnnounceMessage(e.target.value)}
            placeholder="Write announcement message"
          />
          <button
            className="btn"
            onClick={() =>
              run(() => announceHackathon(selectedHackathon, announceMessage), "Announcement sent")
            }
            disabled={!selectedHackathon || !announceMessage || loading}
          >
            Send
          </button>
        </div>
      )}
    </section>
  );
}
