import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { ThemeToggle } from "../components/layout/ThemeToggle";

const features = [
  {
    icon: "🤖",
    title: "AI Team Matching",
    desc: "Smart recommendations that create balanced, high-performing teams based on skill vectors and compatibility.",
  },
  {
    icon: "📊",
    title: "AI Evaluation",
    desc: "GPT-4 powered analysis of code quality, documentation, innovation, and technical complexity.",
  },
  {
    icon: "🔍",
    title: "Plagiarism Detection",
    desc: "Cosine similarity checks across all submissions to flag potential plagiarism automatically.",
  },
  {
    icon: "⚡",
    title: "Real-Time Everything",
    desc: "Live notifications, instant team updates, and real-time collaboration via WebSockets.",
  },
  {
    icon: "🏆",
    title: "Certificates & Rankings",
    desc: "Auto-generated verified certificates with unique UUIDs and tamper-proof verification.",
  },
  {
    icon: "📈",
    title: "Analytics Dashboard",
    desc: "Participation funnels, skill heatmaps, and engagement insights for organizers.",
  },
];

const steps = [
  { num: "01", title: "Create or Join", desc: "Organizers set up hackathons in minutes. Participants find events and register." },
  { num: "02", title: "Build Teams with AI", desc: "Get AI-powered team suggestions based on skills and role balance." },
  { num: "03", title: "Build & Submit", desc: "Collaborate with your team, build your project, and submit before the deadline." },
  { num: "04", title: "Evaluate & Celebrate", desc: "Judges score with AI assistance. Results publish automatically. Certificates issued." },
];

export function LandingPage() {
  const navigate = useNavigate();
  const { user, accessToken } = useAuthStore();

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)", color: "var(--text)" }}>
      {/* ─── Navigation ─── */}
      <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--surface)]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 font-bold text-lg no-underline">
            <span className="w-3 h-3 rounded-full bg-gradient-to-br from-[var(--primary)] to-[var(--primary-2)] shadow-lg" />
            HackHub
          </Link>
          <nav className="hidden md:flex items-center gap-1">
            <a href="#features" className="px-3 py-2 text-sm rounded-lg hover:bg-[var(--surface-2)] transition-colors">Features</a>
            <a href="#how-it-works" className="px-3 py-2 text-sm rounded-lg hover:bg-[var(--surface-2)] transition-colors">How It Works</a>
            <a href="#pricing" className="px-3 py-2 text-sm rounded-lg hover:bg-[var(--surface-2)] transition-colors">Pricing</a>
          </nav>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            {accessToken ? (
              <Link to="/hackathons" className="btn text-sm">Dashboard</Link>
            ) : (
              <>
                <Link to="/login" className="btn btn-ghost text-sm px-4 py-2 rounded-lg">Sign In</Link>
                <Link to="/register" className="btn text-sm px-4 py-2 rounded-lg">Get Started</Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* ─── Hero ─── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 md:pt-24 md:pb-28">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border border-[var(--border)] bg-[var(--surface-2)]">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              AI-Powered Platform
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight">
              Run Hackathons
              <br />
              <span className="bg-gradient-to-r from-[var(--primary)] to-[var(--primary-2)] bg-clip-text text-transparent">
                Smarter with AI
              </span>
            </h1>
            <p className="text-lg text-[var(--muted)] max-w-lg leading-relaxed">
              The all-in-one platform for organizing, participating in, and judging hackathons. 
              Powered by AI for team matching, project evaluation, and real-time analytics.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Link to={accessToken ? "/dashboard/organizer" : "/register"} className="btn px-6 py-3 rounded-xl text-sm font-semibold">
                Start Hosting Free
              </Link>
              <Link to="/explore" className="btn btn-ghost px-6 py-3 rounded-xl text-sm font-semibold">
                Explore Events
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6">
              {[
                ["120K+", "Participants"],
                ["2,300+", "Events Hosted"],
                ["45K+", "Projects"],
                ["4.9/5", "Rating"],
              ].map(([val, label]) => (
                <div key={label}>
                  <div className="text-2xl font-bold">{val}</div>
                  <div className="text-sm text-[var(--muted)]">{label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Hero Visual */}
          <div className="hidden lg:block relative">
            <div className="relative overflow-hidden rounded-2xl border border-[var(--border)] bg-gradient-to-br from-[var(--surface-2)] to-[var(--surface)] p-1">
              <div className="rounded-xl bg-[var(--surface)] p-4 space-y-3">
                <div className="flex items-center justify-between text-sm border-b border-[var(--border)] pb-3">
                  <span className="font-semibold">⚡ HackHub AI Dashboard</span>
                  <span className="flex items-center gap-1.5 text-green-500 text-xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                    Live
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    ["📈", "Engagement", "+18%", "#60a5fa"],
                    ["🤝", "Team Match", "94%", "#a78bfa"],
                    ["🔔", "Notifications", "12 new", "#f472b6"],
                    ["🏁", "Active Events", "28", "#34d399"],
                  ].map(([icon, label, value]) => (
                    <div key={label} className="rounded-xl border border-[var(--border)] p-3 space-y-1 hover:shadow-md transition-shadow">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{icon}</span>
                        <span className="text-xs text-[var(--muted)]">{label}</span>
                      </div>
                      <div className="text-lg font-bold">{value}</div>
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-2 text-xs text-[var(--muted)] pt-1">
                  <span className="w-2 h-2 rounded-full bg-green-500" />
                  2,847 active users right now
                </div>
              </div>
            </div>
            {/* Glow */}
            <div className="absolute -inset-4 bg-gradient-to-r from-[var(--primary)]/20 to-[var(--primary-2)]/20 blur-3xl -z-10 rounded-full" />
          </div>
        </div>
      </section>

      {/* ─── Trusted By ─── */}
      <section className="border-y border-[var(--border)] bg-[var(--surface-2)]/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-xs text-center uppercase tracking-widest text-[var(--muted)] mb-4">Trusted by leading organizations</p>
          <div className="flex flex-wrap justify-center gap-4 sm:gap-8 text-sm font-medium text-[var(--muted)]">
            {["University Alliance", "Tech Communities", "Startup Partners", "Sponsors Network", "Innovation Labs"].map((name) => (
              <span key={name} className="px-4 py-2 rounded-full border border-[var(--border)] bg-[var(--surface)]">
                {name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Features ─── */}
      <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-3">Everything You Need</h2>
          <p className="text-[var(--muted)] text-lg">
            From creation to certificates — HackHub automates the entire hackathon lifecycle with AI.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {features.map((f) => (
            <div
              key={f.title}
              className="group rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 md:p-6 hover:shadow-lg hover:-translate-y-0.5 transition-all"
            >
              <span className="text-2xl md:text-3xl">{f.icon}</span>
              <h3 className="text-base md:text-lg font-bold mt-3 mb-1.5">{f.title}</h3>
              <p className="text-sm text-[var(--muted)] leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── How It Works ─── */}
      <section id="how-it-works" className="border-y border-[var(--border)] bg-[var(--surface-2)]/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-3">How It Works</h2>
            <p className="text-[var(--muted)] text-lg">From registration to results in four simple steps.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {steps.map((step) => (
              <div key={step.num} className="relative rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 md:p-6">
                <span className="text-2xl font-black bg-gradient-to-r from-[var(--primary)] to-[var(--primary-2)] bg-clip-text text-transparent">
                  {step.num}
                </span>
                <h3 className="font-bold mt-2 mb-1">{step.title}</h3>
                <p className="text-sm text-[var(--muted)] leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section id="pricing" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[var(--primary)]/10 via-[var(--primary-2)]/5 to-transparent border border-[var(--border)] p-8 md:p-12 text-center">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-[var(--primary)]/10 to-transparent rounded-full blur-3xl" />
          <div className="relative">
            <h2 className="text-3xl md:text-4xl font-bold mb-3">Ready to Transform Your Hackathons?</h2>
            <p className="text-[var(--muted)] text-lg max-w-xl mx-auto mb-6">
              Join thousands of organizers and participants using AI-powered tools to create amazing hackathon experiences.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link to={accessToken ? "/dashboard/organizer" : "/register"} className="btn px-8 py-3 rounded-xl text-sm font-semibold">
                Get Started Free
              </Link>
              <Link to="/contact" className="btn btn-ghost px-8 py-3 rounded-xl text-sm font-semibold">
                Talk to Sales
              </Link>
            </div>
            <p className="text-xs text-[var(--muted)] mt-4">No credit card required · Free tier available · 99.9% uptime</p>
          </div>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="border-t border-[var(--border)] bg-[var(--surface)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="space-y-3">
              <div className="flex items-center gap-2 font-bold">
                <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-br from-[var(--primary)] to-[var(--primary-2)]" />
                HackHub
              </div>
              <p className="text-sm text-[var(--muted)] leading-relaxed">
                AI-powered platform for end-to-end hackathon management.
              </p>
            </div>
            {[
              ["Platform", ["Features", "Pricing", "How It Works", "Testimonials"]],
              ["Company", ["About", "Blog", "Careers", "Contact"]],
              ["Legal", ["Privacy", "Terms", "Security", "Cookies"]],
            ].map(([title, links]) => (
              <div key={title}>
                <h4 className="font-semibold text-sm mb-3">{title}</h4>
                <ul className="space-y-2">
                  {links.map((link) => (
                    <li key={link}>
                      <a href="#" className="text-sm text-[var(--muted)] hover:text-[var(--text)] transition-colors">{link}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 pt-6 border-t border-[var(--border)] text-sm text-[var(--muted)]">
            <span>© 2025 HackHub. All rights reserved.</span>
            <span>Made with ⚡ for the hackathon community</span>
          </div>
        </div>
      </footer>
    </div>
  );
}