export function PricingPage() {
  return (
    <section className="card">
      <h2>Pricing</h2>
      <div className="feature-grid">
        <article className="feature-card">
          <h4>Starter</h4>
          <p>For small communities</p>
          <strong>$0 / month</strong>
        </article>
        <article className="feature-card">
          <h4>Growth</h4>
          <p>For recurring hackathon programs</p>
          <strong>$99 / month</strong>
        </article>
        <article className="feature-card">
          <h4>Enterprise</h4>
          <p>Advanced AI + custom workflows</p>
          <strong>Custom</strong>
        </article>
      </div>
    </section>
  );
}
