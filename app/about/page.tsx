import type { Metadata } from "next"
import Link from "next/link"
import { createEnglishApprovedMetadata } from "@/i18n/metadata"
import { siteConfig } from "@/lib/site-config"

export const metadata: Metadata = createEnglishApprovedMetadata("/about", {
  title: `About | ${siteConfig.publicTitle}`,
  description:
    "Who made the IR Worldview Inventory, how it was built, and how to reach the project.",
})

export default function AboutPage() {
  const email = siteConfig.links.find(
    (link) => link.kind === "contact" && link.href.startsWith("mailto:"),
  )

  return (
    <div className="container stack-lg reading-page info-page">
      <section className="panel stack-md">
        <p className="eyebrow">About</p>
        <h1>It asks how you read world politics, and shows you the logic you used.</h1>
        <p className="muted" style={{ lineHeight: "1.7", maxWidth: "720px" }}>
          The Foundation puts fourteen questions to you about the arguments people reach for when
          world politics gets hard. Security, Technology, and AI Governance put the same kind of
          question to you inside one policy field. Cases and Perspective Runs ask you to decide
          from a named seat. Each result is a reading of your answers: which explanation you
          trusted, which cost you accepted, and which rival argument came closest.
        </p>
        <div className="row gap-sm wrap">
          <Link href="/quiz" className="cta-primary">Start the Foundation</Link>
          <Link href="/method" className="cta-secondary">How the scoring works</Link>
        </div>
      </section>

      <section className="panel stack-md">
        <h2>Who made it</h2>
        <p style={{ lineHeight: "1.7", maxWidth: "720px" }}>
          {siteConfig.author} built and edits it. He trained at Johns Hopkins SAIS in technology,
          security, and governance, and writes about frontier technology and great-power
          competition. The questions, cases, and readings are authored; the scoring is a set of
          authored weights, described in full in Method, and not a validated test. AI tools were
          used in drafting and checking; the sources cited on each page are the record of what
          was checked.
        </p>
      </section>

      <section className="panel stack-md">
        <h2>What the scores are and are not</h2>
        <ul className="content-list">
          <li>A score is a position on this model&apos;s scale. It is not a percentile, and nobody is being ranked.</li>
          <li>Nationality, citizenship, and culture never change a score.</li>
          <li>A named reading summarizes nearby profiles. It is not a type you belong to.</li>
          <li>Four traditions are scored. Feminist, postcolonial, and green approaches are described in the Library and not scored.</li>
        </ul>
      </section>

      <section className="panel stack-md">
        <h2>Corrections and contact</h2>
        <p style={{ lineHeight: "1.7", maxWidth: "720px" }}>
          Factual corrections, privacy questions, and security reports go to the project email.
          Nothing you have answered travels with that message.
        </p>
        <div className="row gap-sm wrap">
          {email ? (
            <a href={email.href} className="cta-primary">Email the project</a>
          ) : null}
          <Link href="/privacy" className="cta-secondary">Privacy</Link>
        </div>
      </section>
    </div>
  )
}
