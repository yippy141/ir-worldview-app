import Link from "next/link"
import { ResumeCta } from "@/components/landing/resume-cta"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "IR Worldview Inventory",
  description:
    "A prototype classification tool that maps how you think about world politics across seven analytical dimensions drawn from International Relations theory.",
}

export default function LandingPage() {
  return (
    <div className="landing-page container">
      {/* Editorial hero */}
      <section className="landing-hero">
        <div className="stack-sm" style={{ maxWidth: "600px" }}>
          <p className="eyebrow">A prototype classification tool</p>
          <h1 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", letterSpacing: "-0.03em" }}>
            How do you think about world politics?
          </h1>
        </div>
        <div style={{ maxWidth: "560px" }} className="stack-md">
          <p style={{ fontSize: "1.1rem", lineHeight: "1.7", color: "var(--muted)" }}>
            The IR Worldview Inventory maps your theoretical assumptions across seven dimensions —
            from security competition and institutional efficacy to the balance between order and
            justice. The result is a classification of which traditions in International Relations
            theory most closely match your instincts.
          </p>
          <p style={{ fontSize: "0.9rem", lineHeight: "1.65", color: "var(--muted)" }}>
            <strong style={{ color: "var(--text)" }}>What it is not:</strong> a personality test, a
            political compass, or a validated psychometric instrument. This is a prototype designed
            to prompt reflection. It takes roughly 10–15 minutes to complete.
          </p>
          {/* Client component handles localStorage draft detection */}
          <ResumeCta />
        </div>
      </section>

      <hr className="divider" style={{ margin: "0" }} />

      {/* What the inventory measures */}
      <section className="landing-section">
        <div style={{ maxWidth: "600px" }} className="stack-md">
          <h2>What the inventory measures</h2>
          <p className="muted" style={{ lineHeight: "1.7" }}>
            Seven dimensions drawn from the main theoretical traditions in IR scholarship. Each
            dimension corresponds to a real debate about how world politics works — not a political
            opinion about what policy is best.
          </p>
          <div className="dimension-list">
            {[
              ["Security competition", "Do interstate rivalry and self-help pressures set the fundamental terms?"],
              ["Institutional efficacy", "Can international rules shape behavior independently of raw power?"],
              ["Domestic and transnational filters", "How much does internal politics vary outcomes across similar external pressures?"],
              ["Norms and identity", "Does the social meaning of threats — not just their material facts — matter causally?"],
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
            explains what each tradition emphasizes, what it tends to miss, and what kinds of
            arguments it finds most persuasive — useful whether or not you take the quiz.
          </p>
          <div>
            <Link href="/explore" className="cta-secondary">
              Explore the perspectives →
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
