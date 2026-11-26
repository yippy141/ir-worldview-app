"use client"

import type { FoundationQuizSession as QuizSession } from "@/lib/foundation-draft-copy"
import type { Locale } from "@/i18n/routing"
import { publicPath } from "@/i18n/paths"
import { foundationDraftMatchesLocale } from "@/lib/foundation-draft-copy"

export function FoundationCopyNotice({ session, locale, onRestart }: { session: QuizSession; locale: Locale; onRestart: () => void }) {
  const binding = session.foundationCopy
  if (!binding || binding.status === "legacy-unknown") {
    if (!Object.keys(session.answers).length) return null
    return <aside><h2>{locale === "zh-Hans" ? "这份草稿没有语言版本记录" : "The wording version of this draft is unknown"}</h2>
      <p>{locale === "zh-Hans" ? "你仍可查看答案并生成结果。结果不会把某个版本的题目文字归于这些答案。" : "You can review the answers and generate a result. Its evidence will omit wording that cannot be verified."}</p></aside>
  }
  if (binding.status === "single-copy" && foundationDraftMatchesLocale(session, locale)) return null
  const zh = locale === "zh-Hans"
  const mismatch = binding?.status === "single-copy"
  const title = mismatch ? (zh ? "继续原语言的草稿" : "Keep the language of this draft") : (zh ? "无法识别草稿的文字版本" : "This draft's copy revision is unavailable")
  return <section className="panel stack-sm" aria-label={title}>
    <h2>{title}</h2>
    <p>{mismatch ? (zh ? "已有答案属于草稿开始时的语言与文字版本。你可以返回该语言继续；若要改用中文，请确认重新开始。" : "Existing answers belong to the language and copy this draft started with. Continue in that language, or confirm a fresh start in English.") : (zh ? "为避免显示错误的题目，暂不继续此草稿。重新开始只会清除当前草稿，不会删除已保存的结果。" : "The questions are withheld to avoid showing the wrong wording. Restarting clears this draft only; saved results remain.")}</p>
    {mismatch && <a href={publicPath(binding.locale, "/quiz")}>{zh ? "返回草稿原语言" : "Continue in the original language"}</a>}
    <button type="button" className="secondary-button" onClick={() => {
      if (window.confirm(zh ? "清除当前草稿的所有答案并重新开始？已保存的结果将保留。" : "Clear all answers in this draft and restart? Saved results will remain.")) onRestart()
    }}>{zh ? "清除草稿并重新开始" : "Clear draft and restart"}</button>
  </section>
}
