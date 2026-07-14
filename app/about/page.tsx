import type { Metadata } from "next"
import Link from "next/link"
import { siteConfig } from "@/lib/site-config"

export const metadata: Metadata = {
  title: `About — ${siteConfig.publicTitle}`,
  description:
    "An overview of the IR Worldview Inventory, its purpose, entry points, and editorial limits.",
}

export default function AboutPage() {
  return (
    <div className="container stack-lg">
      <section className="panel stack-md">
        <p className="eyebrow">About the project</p>
        <h1>A structured way to examine foreign-policy judgment.</h1>
        <p className="muted" style={{ lineHeight: "1.7", maxWidth: "720px" }}>
          The {siteConfig.publicTitle} is an editorial interactive for locating your judgments
          across recurring international-relations tradeoffs. It returns a multidimensional
          profile and nearby interpretive families, not a fixed identity or population ranking.
        </p>
      </section>

      <section className="panel stack-md">
        <h2>How to use it</h2>
        <p style={{ lineHeight: "1.7" }}>
          Start with the Foundation questionnaire, review every answer, and then use optional
          modules or Perspective Runs to see where context changes your baseline. The Explore and
          Methods pages explain the modeled traditions, source coverage, and limits.
        </p>
        <div className="row gap-sm wrap">
          <Link href="/quiz" className="cta-primary">Start the Foundation</Link>
          <Link href="/method" className="cta-secondary">Read Methods</Link>
          <Link href="/explore" className="cta-secondary">Explore the field</Link>
        </div>
      </section>

      <section className="panel stack-md">
        <h2>Editorial limits</h2>
        <ul className="content-list">
          <li>Scores are positions within this model, not population percentiles.</li>
          <li>Nationality, citizenship, and culture do not alter scoring.</li>
          <li>Named worldview families summarize nearby profiles; they are not natural kinds.</li>
          <li>Under-modeled traditions remain visible as context rather than new scored families.</li>
        </ul>
      </section>
    </div>
  )
}
