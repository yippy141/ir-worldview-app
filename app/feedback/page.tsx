import Link from "next/link"
import type { Metadata } from "next"
import { siteConfig } from "@/lib/site-config"

export const metadata: Metadata = {
  title: "Corrections and Contact — IR Worldview Inventory",
  description: "How to report a factual, privacy, or security problem without submitting result data.",
}

export default function FeedbackPage() {
  const email = siteConfig.links.find(
    (link) => link.kind === "contact" && link.href.startsWith("mailto:"),
  )

  return (
    <div className="container stack-lg" style={{ paddingTop: "48px" }}>
      <section className="panel stack-md">
        <p className="eyebrow">Corrections and contact</p>
        <h1>Open-ended product submissions are paused for V19.</h1>
        <p style={{ lineHeight: "1.7", maxWidth: "650px" }}>
          The prior public form accepted free text and optional contact details. It has been
          removed from the product because V19 has no reviewed moderation, safety, retention, or
          deletion process for that material.
        </p>
        <p style={{ lineHeight: "1.7", maxWidth: "650px" }}>
          Do not send quiz answers, a result or Profile link, a respondent identifier, or details
          about your employer, school, or another person. No message is needed to delete research
          data because this release does not collect research responses.
        </p>
      </section>

      <section className="panel stack-md">
        <h2>Narrow operational contact</h2>
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
