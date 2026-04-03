import Link from "next/link"
import { QuizMenuCard } from "@/components/landing/resume-cta"
import { siteConfig } from "@/lib/site-config"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: siteConfig.publicTitle,
  description:
    "A prototype classification tool that maps assumptions about world politics across seven analytical dimensions drawn from International Relations theory.",
}

export default function LandingPage() {
  return (
    <div className="landing-page">
      <section className="landing-hero">
        <div className="hero-grid">
          {/* Left: intro copy */}
          <div className="stack-md">
            <div>
              <p className="eyebrow">A prototype classification tool</p>
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
              Most people who think seriously about foreign policy hold strong working assumptions
              about how international politics operates. The foundation surfaces those assumptions
              across seven dimensions drawn from the main traditions in IR theory, and the flagship
              modules let you test how they travel in specific issue areas.
            </p>
            <p style={{ fontSize: "0.875rem", lineHeight: "1.65", color: "var(--muted)", maxWidth: "480px" }}>
              <strong style={{ color: "var(--text)" }}>Not</strong> a political compass, a
              personality test, or a validated psychometric instrument. A prototype. Results are a
              starting point, not a verdict.
            </p>
          </div>

          {/* Right: menu cards */}
          <div className="hero-cards">
            <QuizMenuCard />
            <Link href="/explore" className="menu-card">
              <p className="menu-card-title">Explore the perspectives</p>
              <p className="menu-card-desc">
                A field guide to the four worldview families the quiz draws on.
              </p>
            </Link>
            <Link href="/modules" className="menu-card">
              <p className="menu-card-title">Flagship modules</p>
              <p className="menu-card-desc">
                Go deeper on Security or Technology after the shared foundation.
              </p>
            </Link>
            <Link href="/method" className="menu-card">
              <p className="menu-card-title">How it works</p>
              <p className="menu-card-desc">
                Methodology, scoring, dimensions, and important limitations.
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

      {/* About / byline */}
      <section className="landing-section">
        <div style={{ maxWidth: "560px" }} className="stack-sm">
          <p className="eyebrow">About this project</p>
          <p className="muted" style={{ lineHeight: "1.7", fontSize: "0.9rem" }}>
            The {siteConfig.publicTitle} is a prototype built by {siteConfig.author}, aimed at
            students, researchers, practitioners, and engaged readers curious about the theoretical
            priors behind their foreign policy instincts. For its limitations, see the{" "}
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
