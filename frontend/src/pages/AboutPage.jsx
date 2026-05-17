export function AboutPage() {
  return (
    <div className="marketing-page">
      <section className="hero-section compact">
        <div>
          <p className="eyebrow">About HackHub</p>
          <h1>Reinventing Hackathons Through AI</h1>
          <p>
            Our mission is to help organizers and creators run smarter hackathons using automation
            and AI.
          </p>
        </div>
      </section>

      <section className="card">
        <h2>Company Story</h2>
        <p>
          HackHub started as a response to fragmented event workflows. We built one connected
          platform for organizers, participants, judges, and mentors.
        </p>
      </section>

      <section className="card">
        <h2>Vision, Mission, Values</h2>
        <div className="feature-grid">
          <article className="feature-card"><h4>Vision</h4><p>Enable innovation communities to scale globally.</p></article>
          <article className="feature-card"><h4>Mission</h4><p>Automate and elevate hackathon management with AI.</p></article>
          <article className="feature-card"><h4>Core Values</h4><p>Community, fairness, velocity, transparency.</p></article>
        </div>
      </section>

      <section className="card">
        <h2>Platform Timeline</h2>
        <div className="steps-row">
          <article className="step-card"><span className="step-index">2023</span><h4>Concept</h4></article>
          <article className="step-card"><span className="step-index">2024</span><h4>MVP Launch</h4></article>
          <article className="step-card"><span className="step-index">2025</span><h4>AI Evaluation</h4></article>
          <article className="step-card"><span className="step-index">2026</span><h4>Global Expansion</h4></article>
        </div>
      </section>
    </div>
  );
}
