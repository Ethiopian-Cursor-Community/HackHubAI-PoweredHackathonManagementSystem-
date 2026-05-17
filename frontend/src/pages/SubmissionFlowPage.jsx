import { useMemo, useState } from "react";

const steps = [
  "Project details",
  "GitHub",
  "Demo links",
  "Screenshots",
  "Review",
  "Submit"
];

export function SubmissionFlowPage() {
  const [current, setCurrent] = useState(0);
  const progress = useMemo(() => Math.round(((current + 1) / steps.length) * 100), [current]);

  return (
    <section className="card">
      <h2>Submission Flow</h2>
      <p>Deadline countdown: 01d 05h 22m</p>
      <div className="progress-track">
        <div className="progress-fill" style={{ width: `${progress}%` }} />
      </div>
      <div className="steps-row">
        {steps.map((step, idx) => (
          <button
            key={step}
            className={`step-card ${idx === current ? "step-card-active" : ""}`}
            onClick={() => setCurrent(idx)}
          >
            <span className="step-index">{idx + 1}</span>
            <h4>{step}</h4>
          </button>
        ))}
      </div>
    </section>
  );
}
