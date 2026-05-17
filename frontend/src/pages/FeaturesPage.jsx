export function FeaturesPage() {
  const features = [
    ["AI Team Matching", "Smart recommendations for balanced team composition."],
    ["AI Project Evaluation", "Innovation, documentation, and quality insights."],
    ["Real-Time Collaboration", "Instant notifications and announcements."],
    ["Certificate Generation", "Verified certificates with unique validation IDs."],
    ["Plagiarism Detection", "Similarity checks across submissions."],
    ["Analytics Dashboard", "Participation and engagement intelligence."]
  ];

  return (
    <section className="card">
      <h2>HackHub Features</h2>
      <div className="feature-grid">
        {features.map(([title, text]) => (
          <article className="feature-card" key={title}>
            <h4>{title}</h4>
            <p>{text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
