import { LanguageSwitcher } from "@/components/language-switcher"
import { chineseShellContent } from "@/content/locales"

export function TranslationStatusNotice() {
  const content = chineseShellContent.unavailable

  return (
    <div className="container stack-lg translation-status-page">
      <section className="panel stack-md translation-status-notice" role="status">
        <p className="eyebrow">{content.eyebrow}</p>
        <h1>{content.title}</h1>
        <p className="locale-editorial-paragraph">{content.body}</p>
        <p className="muted locale-editorial-paragraph">{content.scope}</p>
        <div>
          <LanguageSwitcher label="englishPage" className="cta-primary" />
        </div>
      </section>
    </div>
  )
}
