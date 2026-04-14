import Link from "next/link"
import { QuizMenuCard } from "@/components/landing/resume-cta"
import { siteConfig } from "@/lib/site-config"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: siteConfig.publicTitle,
  description:
    "An editorial interactive that maps baseline assumptions about world politics, then layers in issue-specific focus-area reads.",
}

export default function LandingPage() {
  return (
    <div className="landing-page">
      <section className="landing-hero">
        <div className="hero-grid">
          {/* Left: intro copy */}
          <div className="stack-md">
            <div>
              <p className="eyebrow">Editorial interactive</p>
              <h1
                style={{
                  fontSize: "clamp(1.9rem, 4vw, 2.8rem)",
                  letterSpacing: "-0.03em",
                  marginTop: "10px",
                  lineHeight: "1.15",
                }}
              >
                Map how you think about world politics
              </h1>
            </div>
            <p style={{ fontSize: "1rem", lineHeight: "1.75", color: "var(--muted)", maxWidth: "480px" }}>
              Start with the Foundation to map your baseline assumptions about world politics
              across seven dimensions. Then use the Security and Technology modules to see how that
              baseline changes once the cases become more concrete, and bring the results together
              in your Profile.
            </p>
            <p style={{ fontSize: "0.875rem", lineHeight: "1.65", color: "var(--muted)", maxWidth: "480px" }}>
              <strong style={{ color: "var(--text)" }}>Not</strong> a political compass, a
              personality test, or a validated psychometric instrument. This is a public-facing
              interpretation tool: useful as a starting point, not a verdict.
            </p>
          </div>

          {/* Right: menu cards */}
          <div className="hero-cards">
            <QuizMenuCard />
            <Link href="/explore" className="menu-card">
              <p className="menu-card-title">Explore the perspectives</p>
              <p className="menu-card-desc">
                A field guide to the modeled traditions, nearby profile patterns, and coverage gaps.
              </p>
            </Link>
            <Link href="/profile" className="menu-card">
              <p className="menu-card-title">Profile</p>
              <p className="menu-card-desc">
                Bring your Foundation and completed focus-area modules into one integrated view.
              </p>
            </Link>
            <Link href="/modules" className="menu-card">
              <p className="menu-card-title">Focus-area modules</p>
              <p className="menu-card-desc">
                Stress-test your baseline in Security or Technology after the Foundation.
              </p>
            </Link>
            <Link href="/method" className="menu-card">
              <p className="menu-card-title">How it works</p>
              <p className="menu-card-desc">
                Foundation, focus-area modules, Profile architecture, scoring, and limitations.
              </p>
            </Link>
            <Link href="/references" className="menu-card">
              <p className="menu-card-title">References</p>
              <p className="menu-card-desc">
                Primary texts and further reading, organized by tradition.
              </p>
            </Link>
          </div>
        </div>
      </section>

      <hr className="divider" style={{ margin: "0" }} />

      {/* AI Governance Compass */}
      <section className="landing-section">
        <div style={{ maxWidth: "600px" }} className="stack-md">
          <div>
            <p className="eyebrow">Companion module</p>
            <h2
              style={{
                fontSize: "clamp(1.3rem, 2.5vw, 1.8rem)",
                letterSpacing: "-0.02em",
                marginTop: "8px",
                lineHeight: "1.2",
              }}
            >
              AI Governance Compass
            </h2>
          </div>
          <p style={{ fontSize: "0.975rem", lineHeight: "1.75", color: "var(--muted)" }}>
            A branching inventory of how you think about AI safety, governance, geopolitical
            rivalry, openness, military use, and the future of human agency.
          </p>
          <div>
            <Link href="/ai" className="cta-primary">
              Take the AI module →
            </Link>
          </div>
        </div>
      </section>

      <hr className="divider" style={{ margin: "0" }} />

      {/* About / byline */}
      <section className="landing-section">
        <div style={{ maxWidth: "560px" }} className="stack-sm">
          <p className="eyebrow">About this project</p>
          <p className="muted" style={{ lineHeight: "1.7", fontSize: "0.9rem" }}>
            The {siteConfig.publicTitle} is an editorial interactive built by {siteConfig.author},
            aimed at students, researchers, practitioners, and engaged readers curious about the
            theoretical priors behind their foreign policy instincts. For its limitations, see the{" "}
            <Link href="/method" style={{ color: "var(--accent)" }}>Methods</Link> page.
          </p>
          <p style={{ fontSize: "0.875rem" }}>
            <Link href="/feedback" style={{ color: "var(--accent)" }}>
              Feedback is welcome →
            </Link>
          </p>
        </div>
      </section>
    </div>
  )
}
