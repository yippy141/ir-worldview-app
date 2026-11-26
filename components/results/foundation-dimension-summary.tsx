import { dimensionLabels } from "@/lib/quiz-schema"
import { DIMENSION_POLES } from "@/lib/results/dimension-bands"
import { zhHansFoundationDimensionPoles, zhHansFoundationQuizUi } from "@/content/locales/zh-Hans/foundation-ui"
import type { DimensionKey, DimensionScores } from "@/lib/types"
import type { Locale } from "@/i18n/routing"
import styles from "./foundation-result-story.module.css"

export function FoundationDimensionSummary({ scores, locale = "en" }: { scores: DimensionScores; locale?: Locale }) {
  const zh = locale === "zh-Hans"
  return <section className="stack-md" data-foundation-dimensions>
    <h2>{zh ? "七个维度的位置" : "Your positions across seven dimensions"}</h2>
    <p>{zh ? "量尺为 1 至 7，4 为中点。每条量尺的两端含义如下；这些不是人口百分位。" : "Each scale runs from 1 to 7, with 4 at the midpoint. The endpoints name what each scale measures; these are not population percentiles."}</p>
    <ul className={styles.dimensionList}>
      {(Object.keys(dimensionLabels) as DimensionKey[]).map(key => {
        const label = zh ? zhHansFoundationQuizUi.dimensionLabels[key] : dimensionLabels[key]
        const poles = zh ? zhHansFoundationDimensionPoles[key] : DIMENSION_POLES[key]
        return <li key={key}>
          <p><strong>{label}</strong> · {scores[key].toFixed(2)}</p>
          <div className={styles.dimensionTrack} role="img" aria-label={`${label}: ${scores[key]}, 1 — ${poles.low}, 7 — ${poles.high}`}>
            <span className={styles.dimensionMark} style={{ left: `${((scores[key] - 1) / 6) * 100}%` }} />
          </div>
          <div className={styles.scaleEnds}><span>1 — {poles.low}</span><span>7 — {poles.high}</span></div>
        </li>
      })}
    </ul>
  </section>
}
