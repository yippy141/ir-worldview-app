import Link from "next/link"
import type { Metadata } from "next"
import { createEnglishApprovedMetadata } from "@/i18n/metadata"
import { siteConfig } from "@/lib/site-config"

export const metadata: Metadata = createEnglishApprovedMetadata("/feedback", {
  title: "Corrections and Contact — IR Worldview Inventory",
  description: "How to report a factual, privacy, or security problem without submitting result data.",
})

export default function FeedbackPage() {
  const email = siteConfig.links.find(
    (link) => link.kind === "contact" && link.href.startsWith("mailto:"),
  )

  return (
    <div className="container stack-lg" style={{ paddingTop: "48px" }}>
      <section className="panel stack-md">
        <p className="eyebrow">Corrections and contact</p>
        <h1>Report a factual, privacy, or security problem.</h1>
        <p style={{ lineHeight: "1.7", maxWidth: "650px" }}>
          Use the project email for a factual correction, privacy question, or security report.
          The site does not accept general product submissions or research responses.
        </p>
        <p style={{ lineHeight: "1.7", maxWidth: "650px" }}>
          Do not send quiz answers, a result or Profile link, a respondent identifier, or details
          about your employer, school, or another person. No message is needed to delete research
          data because the site does not collect research responses.
        </p>
      </section>

      <section className="panel stack-md">
        <h2>What to include</h2>
        <p style={{ lineHeight: "1.7", maxWidth: "650px" }}>
          A factual correction, privacy question, or security report can be sent through the
          project email. Include only the public page title, the disputed public claim, and a source
          when relevant. These messages are ordinary correspondence and are not joined to product
          analytics or a research dataset.
        </p>
        <div className="row gap-sm wrap">
          {email ? (
            <a href={email.href} className="cta-primary">
              Email the project
            </a>
          ) : null}
          <Link href="/privacy" className="cta-secondary">
            Read privacy and data use
          </Link>
          <Link href="/" className="cta-secondary">
            Return home
          </Link>
        </div>
      </section>
    </div>
  )
}
