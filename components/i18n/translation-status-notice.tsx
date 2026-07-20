import { LanguageSwitcher } from "@/components/language-switcher"

export function TranslationStatusNotice({ instrument = false }: { instrument?: boolean }) {
  if (instrument) {
    return (
      <div className="container stack-lg translation-status-page">
        <section className="panel stack-md translation-status-notice" role="status">
          <h1>中文版问卷正在校对。</h1>
          <p className="locale-editorial-paragraph" lang="en">
            You may continue to the English questionnaire.
          </p>
          <div>
            <LanguageSwitcher label="englishPage" className="cta-primary" />
          </div>
        </section>
      </div>
    )
  }

  return (
    <div className="container stack-lg translation-status-page">
      <section className="panel stack-md translation-status-notice" role="status">
        <p className="eyebrow">中文内容状态</p>
        <h1>此页面的简体中文内容尚未通过编辑审校。</h1>
        <p className="locale-editorial-paragraph">
          为避免把未经审校的英文内容静默显示为中文页面，本页暂不开放中文版本。
        </p>
        <div>
          <LanguageSwitcher label="englishPage" className="cta-primary" />
        </div>
      </section>
    </div>
  )
}
