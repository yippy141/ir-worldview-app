import type { Metadata } from "next"
import Link from "next/link"
import { ArchetypeSigil } from "@/components/archetypes/archetype-sigil"
import {
  archetypes,
  getArchetypePath,
  type LensCode,
} from "@/lib/archetypes"
import { familyLabel } from "@/lib/worldview-config"
import styles from "@/components/archetypes/archetypes.module.css"

export const metadata: Metadata = {
  title: "Foundation archetypes — IR Worldview Inventory",
  description:
    "Browse the Foundation archetypes by explanatory lens and strategic posture.",
}

const lensBands: ReadonlyArray<{
  lens: LensCode
  title: string
  question: string
}> = [
  {
    lens: "P",
    title: "Power and timing",
    question: "When do leverage, position, and the timing of action decide what is possible?",
  },
  {
    lens: "R",
    title: "Rules and institutions",
    question: "What makes restraint, agreement, and common rules durable?",
  },
  {
    lens: "M",
    title: "Meaning and legitimacy",
    question: "How do public standards, identity, and consent change political possibility?",
  },
  {
    lens: "S",
    title: "Structure and dependence",
    question: "How do production, finance, and dependency shape practical autonomy?",
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
          const supportingTradition = familyLabel(entries[0].familyKey)

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
                  <h2 id={`lens-${band.lens}`}>{band.title}</h2>
                </div>
                <div className={styles.lensContext}>
                  <p>{band.question}</p>
                  <p>Closest modeled tradition: {supportingTradition}</p>
                </div>
              </header>

              <div className={styles.archetypeRows}>
                {entries.map((archetype) => (
                  <Link
                    className={styles.archetypeRow}
                    href={getArchetypePath(archetype.code)}
                    key={archetype.code}
                    data-archetype-code={archetype.code}
                  >
                    <span className={styles.rowSigil} aria-hidden="true">
                      <ArchetypeSigil code={archetype.code} size={48} />
                    </span>
                    <span className={styles.rowCode}>{archetype.code}</span>
                    <span className={styles.rowCopy}>
                      <strong>{archetype.name}</strong>
                      <span>{archetype.gloss}</span>
                    </span>
                    <span
                      className={styles.rowAction}
                      aria-hidden="true"
                      data-archetype-row-action
                    >
                      <span className={styles.rowActionLabel}>Read</span> →
                    </span>
                  </Link>
                ))}
              </div>
            </section>
          )
        })}
      </div>

      <footer className={styles.directoryFooter}>
        <p>
          Close Foundation results can resolve as a two-lens blend. Blends
          keep the same posture sign and do not receive a third sigil.
        </p>
        <nav className={styles.directoryFooterLinks} aria-label="Archetype directory resources">
          <Link href="/explore">See how the model fits together →</Link>
          <Link href="/method">Read the method and limits →</Link>
        </nav>
      </footer>
    </div>
  )
}
