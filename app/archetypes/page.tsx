import type { Metadata } from "next"
import Link from "next/link"
import { ArchetypeMark } from "@/components/archetypes/archetype-mark"
import styles from "@/components/archetypes/archetypes.module.css"
import {
  archetypes,
  getArchetypePath,
  type LensCode,
} from "@/lib/archetypes"
import {
  formatArchetypeCodeSpeech,
  formatArchetypeDisplayCode,
  publicLensLabel,
} from "@/lib/archetype-display"
import { traditionNounLabel } from "@/lib/worldview-config"

export const metadata: Metadata = {
  title: "Foundation archetypes — IR Worldview Inventory",
  description:
    "Browse the Foundation archetypes by explanatory lens and strategic posture.",
}

const lensBands: ReadonlyArray<{
  lens: LensCode
  question: string
}> = [
  {
    lens: "P",
    question: "When can leverage and timing decide what remains possible?",
  },
  {
    lens: "R",
    question: "What turns an agreement into durable restraint?",
  },
  {
    lens: "M",
    question: "How can legitimacy reshape the limits of political action?",
  },
  {
    lens: "S",
    question: "Where do production and finance narrow practical autonomy?",
  },
]

export default function ArchetypesPage() {
  return (
    <div
      className={`wide-container ${styles.directory}`}
      data-archetype-directory
    >
      <header className={styles.directoryHeader}>
        <h1>Foundation archetypes</h1>
        <p>
          A Foundation result combines an explanatory lens with a strategic
          posture. The name is a reading of a continuous profile, not a
          permanent type or a rank.
        </p>
        <dl className={styles.postureKey} aria-label="Strategic posture key">
          <div>
            <dt>+</dt>
            <dd><strong>Applying advantage</strong> — acting when position or opportunity supports it.</dd>
          </div>
          <div>
            <dt>−</dt>
            <dd><strong>Restraint</strong> — containing pressure, preserving consent, or improving position first.</dd>
          </div>
        </dl>
        <p className={styles.orientationNote}>
          Normative orientation does not rank the result. <strong>Order-first</strong>,{" "}
          <strong>Conditional</strong>, and <strong>Justice-first</strong> are equal-weight
          readings within any archetype.
        </p>
      </header>

      <div className={styles.lensBands}>
        {lensBands.map((band) => {
          const entries = archetypes.filter(({ lens }) => lens === band.lens)
          const supportingTradition = traditionNounLabel(entries[0].familyKey)

          return (
            <section
              className={styles.lensBand}
              key={band.lens}
              aria-labelledby={`lens-${band.lens}`}
              data-lens={band.lens}
            >
              <header className={styles.lensHeader}>
                <div>
                  <p className={styles.lensCode}>{band.lens}</p>
                  <h2 id={`lens-${band.lens}`}>{publicLensLabel(band.lens)}</h2>
                </div>
                <div className={styles.lensContext}>
                  <p>{band.question}</p>
                  <p>Closest modeled tradition: {supportingTradition}</p>
                </div>
              </header>

              <div className={styles.archetypeRows}>
                {entries.map((archetype) => {
                  const glossId = `archetype-${archetype.slug}-gloss`

                  return (
                    <Link
                      className={styles.archetypeRow}
                      href={getArchetypePath(archetype.code)}
                      key={archetype.code}
                      data-archetype-code={archetype.code}
                      aria-label={`Open ${archetype.name}, ${formatArchetypeCodeSpeech(archetype.code)}`}
                      aria-describedby={glossId}
                    >
                      <span className={styles.rowIdentity}>
                        <ArchetypeMark
                          code={archetype.code}
                          size={48}
                          className={styles.directoryMark}
                        />
                        <span className={styles.rowCode} data-archetype-code-label>
                          {formatArchetypeDisplayCode(archetype.code)}
                        </span>
                      </span>
                      <span className={styles.rowCopy}>
                        <strong>{archetype.name}</strong>
                        <span id={glossId}>{archetype.gloss}</span>
                      </span>
                      <span
                        className={styles.rowAction}
                        aria-hidden="true"
                        data-archetype-row-action
                      >
                        <span className={styles.rowActionLabel}>Read</span> →
                      </span>
                    </Link>
                  )
                })}
              </div>
            </section>
          )
        })}
      </div>

      <footer className={styles.directoryFooter}>
        <p>
          Close Foundation results can resolve as a two-lens blend. Blends
          keep the same posture sign and use a combined code label.
        </p>
        <nav className={styles.directoryFooterLinks} aria-label="Archetype directory resources">
          <Link href="/explore">See how the model fits together →</Link>
          <Link href="/method">Read the method and limits →</Link>
        </nav>
      </footer>
    </div>
  )
}
