import { DestinationLink } from "@/components/layout/destination-link"
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
  title: "Foundation archetypes | IR Worldview Inventory",
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
    question: "What turns an agreement into lasting restraint?",
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
      <DestinationLink destination="library" />
      <header className={styles.directoryHeader}>
        <h1>Foundation archetypes</h1>
        <p>
          Each reading pairs a way of explaining world politics with a
          strategic posture: apply an advantage, or hold back. Two readings
          per lens, one for each posture.
        </p>
        <dl className={styles.postureKey} aria-label="Strategic posture key">
          <div>
            <dt>+</dt>
            <dd><strong>Applying advantage:</strong> acting when position or opportunity supports it.</dd>
          </div>
          <div>
            <dt>−</dt>
            <dd><strong>Restraint:</strong> containing pressure, preserving consent, or improving position first.</dd>
          </div>
        </dl>
        <p className={styles.orientationNote}>
          Inside any reading, <strong>Order-first</strong>, <strong>Conditional</strong>, and{" "}
          <strong>Justice-first</strong> say how it weighs order against justice. None ranks
          above another.
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
          A result that sits close between two lenses is shown as a blend:
          both codes, one posture.
        </p>
        <nav className={styles.directoryFooterLinks} aria-label="Archetype directory resources">
          <Link href="/method">Read the method and limits →</Link>
        </nav>
      </footer>
    </div>
  )
}
