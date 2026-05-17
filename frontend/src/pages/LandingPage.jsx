import { Link } from "react-router-dom";

const features = [
  ["AI Team Matching", "Smart recommendations that create balanced teams based on skills and compatibility."],
  ["AI Project Evaluation", "Automatically analyze innovation, documentation, and project quality."],
  ["Real-Time Collaboration", "Instant notifications, announcements, and team updates."],
  ["Certificate Generation", "Automatically generate verified completion certificates."],
  ["Plagiarism Detection", "AI-assisted similarity analysis across projects."],
  ["Analytics Dashboard", "Real-time participation and engagement insights."]
];

const steps = [
  "Create or Join a Hackathon",
  "Build Teams with AI",
  "Submit Projects",
  "Get Evaluated and Ranked"
];

export function LandingPage() {
  return (
    <div className="marketing-page">
      <section className="hero-section">
        <div>
          <p className="eyebrow">Premium AI Hackathon Platform</p>
          <h1>AI-Powered Hackathon Management Platform</h1>
          <p>
            Build, manage, join, and evaluate hackathons with AI-driven team matching, project
            evaluation, analytics, and collaboration tools.
          </p>
          <div className="row-actions">
            <Link to="/dashboard/organizer" className="btn">
              Start Hosting
            </Link>
            <Link to="/explore" className="btn btn-ghost">
              Join Hackathon
            </Link>
            <button className="btn btn-ghost">Watch Demo</button>
          </div>
          <div className="stats-grid">
            <article className="stat-card">
              <strong>120K+</strong>
              <span>Participants</span>
            </article>
            <article className="stat-card">
              <strong>2,300+</strong>
              <span>Hackathons Hosted</span>
            </article>
            <article className="stat-card">
              <strong>45K+</strong>
              <span>Projects Submitted</span>
            </article>
            <article className="stat-card">
              <strong>4.9/5</strong>
              <span>User Rating</span>
            </article>
          </div>
        </div>
        <div className="hero-visual">
          <div className="floating-card">AI Analytics: Engagement +18%</div>
          <div className="floating-card">Team Match Score: 94</div>
          <div className="floating-card">Live Notifications: 12 new</div>
          <div className="floating-card">Active Events: 28</div>
        </div>
      </section>

      <section className="card">
        <h3>Trusted by organizers, innovators, and developers worldwide</h3>
        <div className="logo-strip">
          <span>University Alliance</span>
          <span>Tech Communities</span>
          <span>Startup Partners</span>
          <span>Sponsors Network</span>
          <span>Innovation Labs</span>
        </div>
      </section>

      <section className="card">
        <h2>Core Features</h2>
        <div className="feature-grid">
          {features.map(([title, text]) => (
            <article className="feature-card" key={title}>
              <h4>{title}</h4>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="card">
        <h2>How It Works</h2>
        <div className="steps-row">
          {steps.map((step, idx) => (
            <article key={step} className="step-card">
              <span className="step-index">{idx + 1}</span>
              <h4>{step}</h4>
            </article>
          ))}
        </div>
      </section>

      <section className="card">
        <h2>AI Showcase</h2>
        <div className="feature-grid">
          <article className="feature-card"><h4>AI Team Recommendations</h4><p>Skill vectors, compatibility scores, role balance.</p></article>
          <article className="feature-card"><h4>Project Insights</h4><p>Innovation, docs quality, complexity summaries.</p></article>
          <article className="feature-card"><h4>Evaluation Summaries</h4><p>Judge + AI comparative scoring.</p></article>
          <article className="feature-card"><h4>Analytics Widgets</h4><p>Realtime participation and engagement visualization.</p></article>
        </div>
      </section>

      <section className="card">
        <h2>Community Highlights</h2>
        <div className="feature-grid">
          <article className="feature-card"><h4>Top Participants</h4><p>Achievement badges, streaks, impact score.</p></article>
          <article className="feature-card"><h4>Active Teams</h4><p>Live team activity and submission velocity.</p></article>
          <article className="feature-card"><h4>Ongoing Hackathons</h4><p>Discover trending events by category.</p></article>
          <article className="feature-card"><h4>Testimonials</h4><p>Stories from organizers, mentors, and judges.</p></article>
        </div>
      </section>

      <section className="card">
        <h2>Testimonials</h2>
        <div className="feature-grid">
          <article className="feature-card"><h4>Organizer</h4><p>"Managing events became incredibly easy."</p></article>
          <article className="feature-card"><h4>Participant</h4><p>"AI team matching helped me find amazing teammates."</p></article>
          <article className="feature-card"><h4>Judge</h4><p>"Evaluation became much faster."</p></article>
          <article className="feature-card"><h4>Mentor</h4><p>"Mentoring workflow feels organized."</p></article>
        </div>
      </section>

      <section className="card">
        <h2>Leaderboard + Analytics Preview</h2>
        <div className="feature-grid">
          <article className="feature-card"><h4>Top Projects</h4><p>Rank cards, badges, and winning indicators.</p></article>
          <article className="feature-card"><h4>Registration Funnel</h4><p>Registration to submission conversion preview.</p></article>
          <article className="feature-card"><h4>Skill Heatmaps</h4><p>Visualized participant skill distribution.</p></article>
          <article className="feature-card"><h4>Score Distribution</h4><p>Judging consistency and score spread.</p></article>
        </div>
      </section>
    </div>
  );
}
