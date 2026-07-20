import { Link } from "@/i18n/navigation"
import type {
  ZhHansAction,
  ZhHansEditorialPage,
} from "@/content/locales/zh-Hans/types"

type Props = {
  content: ZhHansEditorialPage
  renderWithinSection?: (sectionId: string) => React.ReactNode
}

export function ZhHansEditorialPage({ content, renderWithinSection }: Props) {
  return (
    <div className="container stack-lg locale-editorial-page zh-hans-editorial-page">
      <header className="panel stack-md locale-editorial-hero">
        <p className="eyebrow">{content.eyebrow}</p>
        <h1>{content.title}</h1>
        <p className="muted locale-editorial-intro">{content.intro}</p>
      </header>

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
                <article key={item.heading} className="locale-editorial-item">
                  <h3>{item.heading}</h3>
                  <p className="muted locale-editorial-paragraph">{item.body}</p>
                </article>
              ))}
            </div>
          ) : null}
          {renderWithinSection?.(section.id)}
          {section.actions ? (
            <div className="row gap-sm wrap">
              {section.actions.map((action, index) => (
                <ZhHansActionLink
                  key={`${action.href}-${action.label}`}
                  action={action}
                  primary={index === 0}
                />
              ))}
            </div>
          ) : null}
        </section>
      ))}
    </div>
  )
}

function ZhHansActionLink({
  action,
  primary,
}: {
  action: ZhHansAction
  primary: boolean
}) {
  const className = primary ? "cta-primary" : "cta-secondary"

  if (action.href.startsWith("mailto:")) {
    return <a href={action.href} className={className}>{action.label}</a>
  }

  return <Link href={action.href} className={className}>{action.label}</Link>
}
