import type { ReactNode } from "react"
import { Link } from "@/i18n/navigation"
import type {
  LocaleAction,
  LocaleEditorialPage,
  LocaleSection,
} from "@/content/locales/types"

type LocaleEditorialPageViewProps = {
  content: LocaleEditorialPage
  className?: string
  renderAfterSection?: (section: LocaleSection) => ReactNode
  renderWithinSection?: (section: LocaleSection) => ReactNode
}

export function LocaleEditorialPageView({
  content,
  className = "",
  renderAfterSection,
  renderWithinSection,
}: LocaleEditorialPageViewProps) {
  return (
    <div className={`container stack-lg locale-editorial-page ${className}`.trim()}>
      <section className="panel stack-md locale-editorial-hero">
        <p className="eyebrow">{content.eyebrow}</p>
        <h1>{content.title}</h1>
        <p className="muted locale-editorial-intro">{content.intro}</p>
      </section>

      {content.sections.map((section) => (
        <section key={section.id} id={section.id} className="panel stack-md">
          <h2>{section.title}</h2>
          {section.paragraphs?.map((paragraph) => (
            <p key={paragraph} className="locale-editorial-paragraph">{paragraph}</p>
          ))}
          {section.bullets ? (
            <ul className="content-list">
              {section.bullets.map((item) => <li key={item}>{item}</li>)}
            </ul>
          ) : null}
          {section.items ? (
            <div className="locale-editorial-items">
              {section.items.map((item) => (
                <div key={item.heading} className="locale-editorial-item">
                  <h3>{item.heading}</h3>
                  <p className="muted locale-editorial-paragraph">{item.body}</p>
                </div>
              ))}
            </div>
          ) : null}
          {renderWithinSection?.(section)}
          {section.note ? <p className="callout">{section.note}</p> : null}
          {section.actions ? (
            <div className="row gap-sm wrap">
              {section.actions.map((action) => (
                <LocaleActionLink key={`${action.href}-${action.label}`} action={action} />
              ))}
            </div>
          ) : null}
          {renderAfterSection?.(section)}
        </section>
      ))}
    </div>
  )
}

function LocaleActionLink({ action }: { action: LocaleAction }) {
  const className = action.kind === "primary" ? "cta-primary" : "cta-secondary"

  if (action.href.startsWith("mailto:")) {
    return <a href={action.href} className={className}>{action.label}</a>
  }

  return <Link href={action.href} className={className}>{action.label}</Link>
}
