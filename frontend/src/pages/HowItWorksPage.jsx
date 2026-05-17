export function HowItWorksPage() {
  const steps = [
    "Create or Join a Hackathon",
    "Build Teams with AI",
    "Submit Projects",
    "Get Evaluated and Ranked"
  ];

  return (
    <section className="card">
      <h2>How It Works</h2>
      <div className="steps-row">
        {steps.map((step, idx) => (
          <article className="step-card" key={step}>
            <span className="step-index">{idx + 1}</span>
            <h4>{step}</h4>
            <p>Connected with workflow automations and AI insights.</p>
          </article>
        ))}
      </div>
    </section>
  );
}
