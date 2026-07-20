import { Link } from "@/i18n/navigation"
import { zhHansWorldviewProfileById, zhHansWorldviewProfilePageUi as ui } from "@/content/locales/zh-Hans/worldview-profiles"
import { getAtlasLiteNeighbors, type AtlasLitePattern } from "@/lib/atlas-lite"
import styles from "./worldview-profile.module.css"

export function ZhHansWorldviewProfilePage({ pattern }: { pattern: AtlasLitePattern }) {
  const copy = zhHansWorldviewProfileById[pattern.id]
  if (!copy) return null
  const neighbors = getAtlasLiteNeighbors(pattern)
    .map((neighbor) => zhHansWorldviewProfileById[neighbor.id])
    .filter((neighbor): neighbor is NonNullable<typeof neighbor> => Boolean(neighbor))

  return (
    <div className={`wide-container ${styles.page}`}>
      <header className={styles.hero}>
        <div className={styles.heroCopy}>
          <p className="eyebrow">{ui.eyebrow}</p>
          <h1 className={styles.publicName}>{copy.publicName}</h1>
          <p className={styles.descriptor} lang="en">{copy.originalTechnicalDescriptor}</p>
          <div className={styles.ruleLead}>
            <p className={styles.ruleLabel}>{ui.decisionRule}</p>
            <p className={styles.decisionRule}>{copy.decisionRule}</p>
          </div>
        </div>
        <aside className={styles.casePreview} aria-label={ui.readingAria}>
          <p className={styles.casePreviewStatus}>{ui.howToRead}</p>
          <h2>{ui.continuousTitle}</h2>
          <p>{ui.continuousBody}</p>
          <Link href="/method">{ui.methods} ↓</Link>
        </aside>
      </header>

      <article className={styles.article}>
        <section className={styles.section} aria-labelledby="zh-profile-reading">
          <h2 id="zh-profile-reading">{ui.decides}</h2>
          <p className={styles.leadBody}>{copy.detailSummary}</p>
          <p className={styles.supportingBody}>{copy.cardSummary}</p>
        </section>

        <section className={styles.section} aria-labelledby="zh-profile-neighbors">
          <div className={styles.sectionHeading}>
            <h2 id="zh-profile-neighbors">{ui.neighbors}</h2>
            <p>{ui.neighborsNote}</p>
          </div>
          <div className={styles.neighborList}>
            {neighbors.map((neighbor) => (
              <article key={neighbor.id} className={styles.neighbor}>
                <h3>{neighbor.publicName}</h3>
                <p className={styles.neighborDescriptor} lang="en">{neighbor.originalTechnicalDescriptor}</p>
                <p>{neighbor.decisionRule}</p>
                <Link href={`/explore/atlas/${neighbor.id}`}>{ui.compare(neighbor.publicName)} →</Link>
              </article>
            ))}
          </div>
        </section>

        <section className={`${styles.section} ${styles.method}`} aria-labelledby="zh-profile-method">
          <div className={styles.sectionHeading}>
            <h2 id="zh-profile-method">{ui.methodStatus}</h2>
          </div>
          <div className={styles.methodCopy}>
            {ui.methodBody.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          </div>
          <div className={styles.actions}>
            <Link href="/explore/atlas" className="cta-primary">{ui.openMap}</Link>
            <Link href="/method" className="cta-secondary">{ui.readMethods}</Link>
          </div>
        </section>
      </article>
    </div>
  )
}
