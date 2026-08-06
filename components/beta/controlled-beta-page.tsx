import { Link } from "@/i18n/navigation"
import type { BetaPageContent } from "@/content/locales/beta-types"

export function ControlledBetaPage({
  content,
  participationUrl,
}: {
  content: BetaPageContent
  participationUrl: string | null
}) {
  return (
    <div className="container stack-lg">
      <header className="panel stack-md">
        <p className="eyebrow">{content.eyebrow}</p>
        <h1>{content.title}</h1>
        <p className="muted" style={{ lineHeight: "1.7", maxWidth: "720px" }}>
          {content.intro}
        </p>
      </header>

      <section className="panel stack-md" aria-labelledby="beta-testing-heading">
        <h2 id="beta-testing-heading">{content.testingTitle}</h2>
        <ul className="content-list">
          {content.testingItems.map((item) => <li key={item}>{item}</li>)}
        </ul>
      </section>

      <section className="panel stack-md" aria-labelledby="beta-participation-heading">
        <h2 id="beta-participation-heading">{content.participationTitle}</h2>
        <p style={{ lineHeight: "1.7", maxWidth: "720px" }}>
          {content.participationBody}
        </p>
        <p style={{ lineHeight: "1.7", maxWidth: "720px" }}>
          {content.optionalNote}
        </p>
        {participationUrl ? (
          <p style={{ margin: 0 }}>
            <a
              href={participationUrl}
              className="cta-primary"
              target="_blank"
              rel="noopener noreferrer"
              aria-describedby="beta-external-service-note"
            >
              {content.participationLink}
              <span className="sr-only"> {content.opensNewTab}</span>
            </a>
          </p>
        ) : (
          <p className="muted" style={{ lineHeight: "1.7", maxWidth: "720px" }}>
            {content.linkUnavailable}
          </p>
        )}
      </section>

      <section className="panel stack-md" aria-labelledby="beta-boundaries-heading">
        <h2 id="beta-boundaries-heading">{content.boundariesTitle}</h2>
        <p style={{ lineHeight: "1.7", maxWidth: "720px" }}>
          {content.boundariesIntro}
        </p>
        <ul className="content-list">
          {content.prohibitedItems.map((item) => <li key={item}>{item}</li>)}
        </ul>
      </section>

      <section className="panel stack-md" aria-labelledby="beta-data-heading">
        <h2 id="beta-data-heading">{content.dataTitle}</h2>
        <p style={{ lineHeight: "1.7", maxWidth: "720px" }}>
          {content.productFeedbackBody}
        </p>
        <p style={{ lineHeight: "1.7", maxWidth: "720px" }}>
          {content.tier1Body}
        </p>
        <p
          id="beta-external-service-note"
          style={{ lineHeight: "1.7", maxWidth: "720px" }}
        >
          {content.externalDataBody}
        </p>
      </section>

      <section className="panel stack-md" aria-labelledby="beta-other-routes-heading">
        <h2 id="beta-other-routes-heading">{content.otherRoutesTitle}</h2>
        <p style={{ lineHeight: "1.7", maxWidth: "720px" }}>
          {content.correctionsBody}
        </p>
        <div className="row gap-sm wrap">
          <Link href="/feedback" className="cta-secondary">
            {content.correctionsLink}
          </Link>
          <Link href="/privacy" className="cta-secondary">
            {content.privacyLink}
          </Link>
          <Link href="/" className="cta-secondary">
            {content.homeLink}
          </Link>
        </div>
      </section>
    </div>
  )
}
