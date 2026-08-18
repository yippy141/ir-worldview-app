import Link from "next/link"
import type { Metadata } from "next"
import {
  exploreFamilies,
  exploreGaps,
  getExploreHubContent,
  type ExploreHubContent,
  type ExploreHubSectionId,
} from "@/lib/explore-content"
import {
  archetypes,
} from "@/lib/archetypes"
import {
  formatArchetypeCodeSpeech,
  formatArchetypeDisplayCode,
  publicLensLabel,
} from "@/lib/archetype-display"
import {
  getAtlasLitePatterns,
  getAtlasPatternHref,
} from "@/lib/atlas-lite"
import {
  getVisibleReferenceEntities,
  referenceEntityTypeLabel,
} from "@/lib/field/items"
import { dimensionLabels } from "@/lib/quiz-schema"
import { familySlug } from "@/lib/worldview-config"
import styles from "./explore.module.css"

export const metadata: Metadata = {
  title: "Explore — IR Worldview Inventory",
  description:
    "How Foundation archetypes, modifiers, traditions, Decision Patterns, public positions, and separate contextual records fit together.",
}

export default function ExplorePage() {
  const hub = getExploreHubContent()
  if (!hub) {
    return (
      <div className={`wide-container ${styles.page}`}>
        <section className={styles.unavailable} role="status">
          <h1>Explore</h1>
          <p>The worldview guide is temporarily unavailable while its content record is reviewed.</p>
          <Link href="/quiz">Take the Foundation →</Link>
        </section>
      </div>
    )
  }

  const patterns = getAtlasLitePatterns()
  const references = getVisibleReferenceEntities()

  return (
    <div className={`wide-container ${styles.page}`}>
      <header className={styles.hero}>
        <div className={styles.heroCopy}>
          <h1>{hub.hero.title}</h1>
          <div className={styles.payoff}>
            {hub.hero.payoff.map((sentence) => <p key={sentence}>{sentence}</p>)}
          </div>
          <p className={styles.boundary} role="note">{hub.hero.boundary}</p>
        </div>
        <div className={styles.heroActions} aria-label="Explore starting points">
          <Link href="/archetypes" className={styles.primaryAction}>
            Browse Foundation archetypes
          </Link>
          <Link href="/profile" className={styles.secondaryAction}>
            View your Profile
          </Link>
        </div>
      </header>

      <nav className={styles.jumpNav} aria-label="On this page">
        {hub.sections.map((section, index) => (
          <a key={section.id} href={`#${section.id}`}>
            <span aria-hidden="true">{index + 1}</span>
            {section.heading}
          </a>
        ))}
      </nav>

      <div className={styles.sections}>
        {hub.sections.map((section, index) => (
          <section
            key={section.id}
            id={section.id}
            data-explore-section={section.id}
            className={styles.section}
            aria-labelledby={`${section.id}-heading`}
          >
            <header className={styles.sectionHeader}>
              <p className={styles.sectionNumber} aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </p>
              <div>
                <h2 id={`${section.id}-heading`}>{section.heading}</h2>
                <p>{section.intro}</p>
              </div>
            </header>
            {renderSection(section.id, hub, patterns, references)}
          </section>
        ))}
      </div>
    </div>
  )
}

function renderSection(
  id: ExploreHubSectionId,
  hub: ExploreHubContent,
  patterns: ReturnType<typeof getAtlasLitePatterns>,
  references: ReturnType<typeof getVisibleReferenceEntities>,
) {
  switch (id) {
    case "how-labels-fit":
      return (
        <div className={styles.sectionBody}>
          <ol className={styles.hierarchy}>
            {hub.hierarchy.map((item) => (
              <li key={item.id}>
                <h3>{item.label}</h3>
                <p>{item.description}</p>
              </li>
            ))}
          </ol>
          <details className={styles.disclosure}>
            <summary>{hub.scoringEvidence.summary}</summary>
            <div className={styles.disclosureBody}>
              <p>{hub.scoringEvidence.body}</p>
              <Link href={hub.scoringEvidence.href}>
                {hub.scoringEvidence.linkLabel} →
              </Link>
            </div>
          </details>
        </div>
      )

    case "foundation-archetypes":
      return (
        <div className={styles.sectionBody} data-explore-archetypes>
          <div className={styles.lensDirectory}>
            {hub.lensBands.map((band) => {
              const records = archetypes
                .filter((archetype) => archetype.lens === band.lens)
                .sort((left, right) => left.posture === right.posture
                  ? 0
                  : left.posture === "+" ? -1 : 1)
              return (
                <section
                  key={band.lens}
                  className={styles.lensBand}
                  aria-labelledby={`explore-lens-${band.lens}`}
                >
                  <header className={styles.lensHeader}>
                    <p>{band.lens}</p>
                    <div>
                      <h3 id={`explore-lens-${band.lens}`}>
                        {publicLensLabel(band.lens)}
                      </h3>
                      <p>{band.description}</p>
                    </div>
                  </header>
                  <ul className={styles.archetypePairs}>
                    {records.map((archetype) => (
                      <li
                        key={archetype.code}
                        className={styles.archetypePair}
                        data-archetype-code={archetype.code}
                        data-explore-archetype-pair
                      >
                        <span className={styles.code} data-archetype-code-label>
                          <span aria-hidden="true">
                            {formatArchetypeDisplayCode(archetype.code)}
                          </span>
                          <span className="sr-only">
                            {formatArchetypeCodeSpeech(archetype.code)}
                          </span>
                        </span>
                        <strong>{archetype.name}</strong>
                      </li>
                    ))}
                  </ul>
                </section>
              )
            })}
          </div>
          <p className={styles.continueLink}>
            <Link href="/archetypes">Open the full archetype directory →</Link>
          </p>
        </div>
      )

    case "variants-blends":
      return (
        <div className={styles.sectionBody}>
          <dl className={styles.variantGrid}>
            {hub.normativeAliases.map((variant) => (
              <div key={variant.state}>
                <dt>{variant.label}</dt>
                <dd>{variant.description}</dd>
              </div>
            ))}
          </dl>
          <p className={styles.boundedNote}>{hub.blendExplanation}</p>
        </div>
      )

    case "modeled-traditions":
      return (
        <div className={styles.sectionBody}>
          <div className={styles.editorialIndex}>
            {exploreFamilies.map((family) => (
              <Link
                key={family.familyKey}
                href={`/explore/${familySlug(family.familyKey)}`}
                className={styles.editorialRow}
              >
                <span className={styles.objectType} data-explore-object-type>
                  Supporting tradition
                </span>
                <strong>{family.name}</strong>
                <span className={styles.rowDescription}>{family.tagline}</span>
                <span className={styles.rowArrow} aria-hidden="true">→</span>
              </Link>
            ))}
          </div>
        </div>
      )

    case "foundation-dimensions":
      return (
        <div className={styles.sectionBody}>
          <dl className={styles.definitionList}>
            {hub.dimensions.map((dimension) => (
              <div key={dimension.key}>
                <dt>{dimensionLabels[dimension.key]}</dt>
                <dd>{dimension.description}</dd>
              </div>
            ))}
          </dl>
          <p className={styles.continueLink}>
            <Link href="/method">How the dimensions are scored →</Link>
          </p>
        </div>
      )

    case "decision-patterns":
      return (
        <div className={styles.sectionBody}>
          <p className={styles.continueLink}>
            <Link href={hub.decisionPatternDirectory.mapHref}>
              {hub.decisionPatternDirectory.mapLinkLabel} →
            </Link>
          </p>
          <details className={styles.disclosure}>
            <summary>{hub.decisionPatternDirectory.summary}</summary>
            <ol className={styles.patternDirectory}>
              {patterns.map((pattern) => (
                <li key={pattern.id}>
                  <Link href={getAtlasPatternHref(pattern.id)}>
                    <span>{pattern.publicName}</span>
                    <small>{pattern.decisionRule}</small>
                  </Link>
                </li>
              ))}
            </ol>
          </details>
        </div>
      )

    case "reference-positions":
      return (
        <div className={styles.sectionBody}>
          <p className={styles.derivedCount}>
            {hub.referenceDirectory.countLabel}: <strong>{references.length}</strong>
          </p>
          {references.length > 0 ? (
            <div className={styles.referenceRows}>
              {references.map((reference) => (
                <Link
                  key={reference.id}
                  href={`/explore/reference/${reference.id}`}
                  className={styles.referenceRow}
                >
                  <span className={styles.objectType} data-explore-object-type>
                    {referenceEntityTypeLabel(reference.entityType)}
                  </span>
                  <strong>{reference.name}</strong>
                  <span className={styles.referenceMeta}>
                    Published · reviewed <time dateTime={reference.reviewedAt}>{reference.reviewedAt}</time>
                  </span>
                  <span className={styles.rowArrow} aria-hidden="true">→</span>
                </Link>
              ))}
            </div>
          ) : null}
          <p className={styles.continueLink}>
            <Link href={hub.referenceDirectory.href}>
              {hub.referenceDirectory.linkLabel} →
            </Link>
          </p>
        </div>
      )

    case "focus-context":
      return (
        <div className={styles.sectionBody}>
          <p className={styles.contextBoundary} role="note">
            {hub.contextBoundary}
          </p>
          <div className={styles.contextRows}>
            {hub.contextRecords.map((record) => (
              <Link key={record.id} href={record.href} className={styles.contextRow}>
                <strong>{record.title}</strong>
                <span className={styles.rowDescription}>{record.description}</span>
                <span className={styles.rowArrow} aria-hidden="true">→</span>
              </Link>
            ))}
          </div>
        </div>
      )

    case "coverage-methods":
      return (
        <div className={styles.sectionBody}>
          <p className={styles.canonNote}>{hub.coverage.canonNote}</p>
          <details className={styles.disclosure}>
            <summary>{hub.coverage.detailsSummary}</summary>
            <div className={styles.gapList}>
              {exploreGaps.map((gap) => (
                <article key={gap.slug}>
                  <h3>{gap.name}</h3>
                  <p>{gap.summary}</p>
                  <p><strong>Why it is not yet modeled:</strong> {gap.whyNotYetModeled}</p>
                </article>
              ))}
            </div>
          </details>
          <p className={styles.continueLink}>
            <Link href={hub.coverage.methodHref}>
              {hub.coverage.methodLinkLabel} →
            </Link>
          </p>
        </div>
      )
  }
}
