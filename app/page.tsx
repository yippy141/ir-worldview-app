import Link from "next/link"
import { ResumeCta } from "@/components/landing/resume-cta"
import { siteConfig } from "@/lib/site-config"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: siteConfig.publicTitle,
  description:
    "A prototype classification tool that maps assumptions about world politics across seven analytical dimensions drawn from International Relations theory.",
}

// ─────────────────────────────────────────────────────────────────────────────
// EDITABLE: Hero introduction copy
// Edit the strings below to update the landing page intro without touching JSX.
// ─────────────────────────────────────────────────────────────────────────────
const HERO_HEADING = "How do you see the world?"

const HERO_PARA_1 =
  "Most people who follow world politics hold working assumptions about how it operates. When does power matter more than rules? What drives conflict? Can institutions hold under pressure? Those assumptions shape which arguments feel credible. They rarely get examined."

const HERO_PARA_2 =
  "This quiz maps your instincts across seven dimensions drawn from the main traditions in International Relations. The result is not a political label or a measure of expertise. It shows which tradition most closely matches how you already think — and gives you a way to test whether that fit actually holds."

const HERO_CAVEAT =
  "This is not a personality test, a political compass, or a validated psychometric instrument. It is a prototype, and the results are a starting point. It takes roughly 10–15 minutes."
// ─────────────────────────────────────────────────────────────────────────────

export default function LandingPage() {
  return (
    <div className="landing-page container">
      {/* Editorial hero */}
      <section className="landing-hero">
        <div className="stack-sm" style={{ maxWidth: "600px" }}>
          <p className="eyebrow">A prototype classification tool</p>
          <h1 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", letterSpacing: "-0.03em" }}>
            {HERO_HEADING}
          </h1>
        </div>
        <div style={{ maxWidth: "560px" }} className="stack-md">
          <p style={{ fontSize: "1.05rem", lineHeight: "1.75", color: "var(--muted)" }}>
            {HERO_PARA_1}
          </p>
          <p style={{ fontSize: "1.05rem", lineHeight: "1.75", color: "var(--muted)" }}>
            {HERO_PARA_2}
          </p>
          <p style={{ fontSize: "0.875rem", lineHeight: "1.65", color: "var(--muted)" }}>
            <strong style={{ color: "var(--text)" }}>{HERO_CAVEAT}</strong>
          </p>
          {/* Client component handles localStorage draft detection */}
          <ResumeCta />
        </div>
      </section>

      <hr className="divider" style={{ margin: "0" }} />

      {/* Purpose */}
      <section className="landing-section">
        <div style={{ maxWidth: "560px" }} className="stack-md">
          <h2>What this is for</h2>
          <p className="muted" style={{ lineHeight: "1.7" }}>
            This quiz shows which traditions in International Relations most closely match your
            instincts. It does not label your politics, rank your expertise, or sort you into a box.
          </p>
          <p className="muted" style={{ lineHeight: "1.7" }}>
            It works best as a starting point for reflection. The result surfaces assumptions you
            may hold without having examined them. It is not a verdict.
          </p>
          <p className="muted" style={{ lineHeight: "1.7" }}>
            It uses seven dimensions rather than a single axis because the major traditions in IR
            theory disagree across multiple independent questions. Two people can reach the same
            overall classification through very different dimension profiles. The scores often tell a
            more interesting story than the label.
          </p>
          <p style={{ fontSize: "0.875rem", lineHeight: "1.65", color: "var(--muted)" }}>
            <strong style={{ color: "var(--text)" }}>What it is not:</strong> a political compass, a
            personality test, or a validated psychometric instrument. Results can overlap. A
            different result on a second attempt can mean real change in thinking, or simply better
            self-knowledge.
          </p>
        </div>
      </section>

      <hr className="divider" style={{ margin: "0" }} />

      {/* What the inventory measures */}
      <section className="landing-section">
        <div style={{ maxWidth: "600px" }} className="stack-md">
          <h2>What the inventory measures</h2>
          <p className="muted" style={{ lineHeight: "1.7" }}>
            Seven dimensions drawn from the main theoretical traditions in IR scholarship. Each
            corresponds to a genuine debate about how world politics works, not a political opinion
            about what policy is best.
          </p>
          <div className="dimension-list">
            {[
              ["Security competition", "Do interstate rivalry and self-help pressures set the fundamental terms?"],
              ["Institutional efficacy", "Can international rules shape behavior independently of raw power?"],
              ["Domestic and transnational filters", "How much does internal politics vary outcomes across similar external pressures?"],
              ["Norms and identity", "Does the social meaning of a threat matter causally, beyond its material facts?"],
              ["Political economy", "Is global economic structure necessary to explain international outcomes?"],
              ["Restraint vs maximization", "Does a safer grand strategy mean limiting commitments or pressing advantages?"],
              ["Order vs justice", "When they conflict, should stability or universal moral obligations take priority?"],
            ].map(([label, desc]) => (
              <div key={label} className="dimension-row">
                <p style={{ fontWeight: 600, fontFamily: "Georgia, serif" }}>{label}</p>
                <p className="muted" style={{ fontSize: "0.875rem", lineHeight: "1.55" }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <hr className="divider" style={{ margin: "0" }} />

      {/* Explore section teaser */}
      <section className="landing-section">
        <div style={{ maxWidth: "560px" }} className="stack-md">
          <h2>Not ready to take the quiz?</h2>
          <p className="muted" style={{ lineHeight: "1.7" }}>
            The Explore section is a field guide to the worldview families the quiz draws on. It
            explains what each tradition emphasizes, where it tends to miss, and what arguments it
            finds most persuasive.
          </p>
          <div>
            <Link href="/explore" className="cta-secondary">
              Explore the perspectives →
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
            The {siteConfig.publicTitle} is a prototype built by {siteConfig.author}. It is aimed
            at students, researchers, practitioners, and engaged readers curious about the
            theoretical priors behind their foreign policy instincts. For its limitations, see
            the{" "}
            <Link href="/method" style={{ color: "var(--accent)" }}>Methods</Link>{" "}
            page.
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
