import Link from "next/link"

export type ReadingPathEntry = {
  id: string
  title: string
  author?: string
  year?: string
  note: string
  url?: string
}

export type ReadingPathLink = {
  href: string
  label: string
  text: string
}

export type ReadingPath = {
  key: string
  heading: string
  subheading: string
  entries: ReadingPathEntry[]
  links?: ReadingPathLink[]
}

export function ReadingPathSection({
  title,
  intro,
  paths,
}: {
  title: string
  intro: string
  paths: ReadingPath[]
}) {
  const visiblePaths = paths.filter((path) => path.entries.length > 0)

  if (visiblePaths.length === 0) {
    return null
  }

  return (
    <section className="result-section stack-md">
      <div className="stack-xs">
        <h2>{title}</h2>
        <p className="muted" style={{ fontSize: "0.875rem", lineHeight: "1.65" }}>
          {intro}
        </p>
      </div>

      <div>
        {visiblePaths.map((path) => (
          <section key={path.key} className="reading-path-block stack-sm">
            <div className="reading-path-header">
              <div className="stack-xs">
                <p className="reading-path-label">{path.heading}</p>
                <p className="reading-path-subheading">{path.subheading}</p>
              </div>

              {path.links && path.links.length > 0 ? (
                <div className="reading-path-related">
                  <p className="reading-path-related-label">Use the product</p>
                  {path.links.map((link) => (
                    <p key={`${path.key}-${link.href}`} className="reading-path-related-item">
                      <Link href={link.href}>{link.label}</Link>
                      <span className="muted"> — {link.text}</span>
                    </p>
                  ))}
                </div>
              ) : null}
            </div>

            <div className="reading-entry-list">
              {path.entries.map((entry) => (
                <article key={entry.id} className="reading-entry">
                  {entry.url ? (
                    <a
                      href={entry.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="reading-entry-title reading-entry-title-link"
                    >
                      {entry.title}
                    </a>
                  ) : (
                    <p className="reading-entry-title">{entry.title}</p>
                  )}

                  {entry.author || entry.year ? (
                    <p className="reading-entry-meta">
                      {entry.author}
                      {entry.author && entry.year ? " · " : ""}
                      {entry.year}
                    </p>
                  ) : null}

                  <p className="reading-entry-note">{entry.note}</p>
                </article>
              ))}
            </div>
          </section>
        ))}
      </div>
    </section>
  )
}
