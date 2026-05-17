export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-grid">
        <div>
          <h4>HackHub</h4>
          <p>AI-powered platform for hosting, joining, and evaluating hackathons at scale.</p>
        </div>
        <div>
          <h5>Platform</h5>
          <a href="/explore">Explore</a>
          <a href="/features">Features</a>
          <a href="/pricing">Pricing</a>
          <a href="/community">Events</a>
        </div>
        <div>
          <h5>Resources</h5>
          <a href="/">Blog</a>
          <a href="/">Documentation</a>
          <a href="/community">Community</a>
          <a href="/contact">Help Center</a>
        </div>
        <div>
          <h5>Company</h5>
          <a href="/about">About</a>
          <a href="/">Careers</a>
          <a href="/contact">Contact</a>
          <a href="/">Privacy Policy</a>
        </div>
      </div>
      <div className="footer-bottom">
        <span>Copyright 2026 HackHub</span>
        <span>Social: X / LinkedIn / GitHub</span>
        <span>Language: English</span>
      </div>
    </footer>
  );
}
