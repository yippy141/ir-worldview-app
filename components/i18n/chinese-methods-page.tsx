import { LocaleEditorialPageView } from "@/components/i18n/locale-editorial-page"
import { chineseShellContent } from "@/content/locales"

export function ChineseMethodsPage() {
  const content = chineseShellContent.methods

  return (
    <LocaleEditorialPageView
      content={content}
      renderWithinSection={(section) => section.id === "dimensions" ? (
        <div className="locale-editorial-items">
          {Object.entries(content.dimensions).map(([key, dimension]) => (
            <div key={key} className="locale-editorial-item">
              <h3>{dimension.heading}</h3>
              <p className="muted locale-editorial-paragraph">{dimension.body}</p>
            </div>
          ))}
        </div>
      ) : null}
    />
  )
}
