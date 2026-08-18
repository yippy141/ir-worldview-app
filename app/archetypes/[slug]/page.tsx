import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { FoundationMark } from "@/components/archetypes/archetype-mark"
import styles from "@/components/archetypes/archetypes.module.css"
import {
  archetypeContentVersion,
  archetypeEvidenceCatalogVersion,
  getPublishedArchetypeStatus,
  getPublishedArchetypeContent,
  type Claim,
  type FieldState,
} from "@/lib/archetype-content"
import {
  archetypeEvidence,
  archetypeEvidenceSlug,
  getArchetypeEvidenceBySlug,
  parseArchetypeEvidenceReturnPath,
} from "@/lib/archetype-evidence"
import {
  formatArchetypeCodeSpeech,
  formatArchetypeDisplayCode,
  publicLensLabel,
} from "@/lib/archetype-display"
import { getArchetypeBySlug } from "@/lib/archetypes"
import { familySlug, traditionNounLabel } from "@/lib/worldview-config"

interface Props {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ from?: string | string[] }>
}

export function generateStaticParams() {
  return archetypeEvidence.map(({ code }) => ({
    slug: archetypeEvidenceSlug(code),
  }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const archetype = getArchetypeBySlug(slug)
  if (!archetype) {
    return { title: "Foundation archetype — IR Worldview Inventory" }
  }

  return {
    title: `${archetype.name} (${formatArchetypeDisplayCode(archetype.code)}) — IR Worldview Inventory`,
    description: archetype.gloss,
  }
}

function claimText(claim: Claim): string | null {
  return claim.value?.text ?? null
}

function claimList(field: FieldState<Claim[]>): string[] {
  if (!field.value) return []
  return field.value.flatMap((claim) => {
    const text = claimText(claim)
    return text ? [text] : []
  })
}

export default async function ArchetypeDetailPage({
  params,
  searchParams,
}: Props) {
  const [{ slug }, { from }] = await Promise.all([params, searchParams])
  const identity = getArchetypeBySlug(slug)
  if (!identity) notFound()

  const contentRecord = getPublishedArchetypeContent(identity.code)
  const publicationStatus = getPublishedArchetypeStatus(identity.code)
  const resolved = getArchetypeEvidenceBySlug(slug)
  const evidence = resolved?.evidence
  const returnPath = parseArchetypeEvidenceReturnPath(from)
  const tradition = traditionNounLabel(identity.familyKey)
  const postureLabel = identity.posture === "+" ? "Applying advantage" : "Restraint"

  return (
    <article
      className={`wide-container ${styles.detail}`}
      data-archetype-code={identity.code}
      data-archetype-detail
    >
      <Link
        href={returnPath ?? "/quiz"}
        className={styles.backLink}
      >
        {returnPath ? "← Back to your result" : "← Take the Foundation"}
      </Link>

      <header className={styles.detailHero}>
        <div className={styles.heroIdentity}>
          <FoundationMark
            code={identity.code}
            presentation="hero"
            className={styles.heroMark}
          />
          <div className={styles.heroCopy}>
            <p
              className={styles.detailCode}
              data-archetype-code-label
              aria-label={formatArchetypeCodeSpeech(identity.code)}
            >
              {formatArchetypeDisplayCode(identity.code)}
            </p>
            <h1>{identity.name}</h1>
            <p className={styles.detailGloss}>{identity.gloss}</p>
          </div>
        </div>
        <dl className={styles.identityRegister}>
          <div>
            <dt>Lens</dt>
            <dd>{publicLensLabel(identity.lens)}</dd>
          </div>
          <div>
            <dt>Strategic posture</dt>
            <dd>{postureLabel}</dd>
          </div>
          <div>
            <dt>Closest modeled tradition</dt>
            <dd>
              <Link href={`/explore/${familySlug(identity.familyKey)}`}>
                {tradition}
              </Link>
              <span>
                Supporting evidence for the Foundation result, not another
                Foundation result.
              </span>
            </dd>
          </div>
        </dl>
      </header>

      <aside className={styles.markNote} aria-labelledby="about-mark-heading">
        <h2 id="about-mark-heading">About the mark</h2>
        <p>
          This contemporary mark is editorial artwork created for the inventory.
          It is not an authentic historical emblem, a cultural classification,
          or an endorsement. The visible code and name carry the meaning.
        </p>
      </aside>

      {contentRecord ? (
        <div className={styles.detailBody}>
          <section
            className={styles.readingSection}
            id="reading"
            aria-labelledby="reading-heading"
          >
            <div className={styles.sectionHeading}>
              <h2 id="reading-heading">What this reading notices first</h2>
              <p>{claimList(contentRecord.content.noticesFirst)[0]}</p>
            </div>
            <div className={styles.instinctGrid}>
              <div>
                <h3>Likely policy instincts</h3>
                <ol>
                  {claimList(contentRecord.content.likelyPolicyInstincts).map((text) => (
                    <li key={text}>{text}</li>
                  ))}
                </ol>
              </div>
              <div>
                <h3>Accepted tradeoff</h3>
                <p>{claimText(contentRecord.content.acceptedTradeoff)}</p>
              </div>
            </div>
          </section>

          <section
            className={styles.readingSection}
            id="case-and-objection"
            aria-labelledby="case-heading"
          >
            <div className={styles.sectionHeading}>
              <h2 id="case-heading">The case, the objection, and the test</h2>
              <p>
                Read the interpretation alongside the conditions that would make
                it less persuasive.
              </p>
            </div>
            <dl className={styles.argumentLedger}>
              <div>
                <dt>Strongest case for this reading</dt>
                <dd>{claimText(contentRecord.content.strongestCaseForReading)}</dd>
              </div>
              <div>
                <dt>Strongest objection</dt>
                <dd>{claimText(contentRecord.content.strongestObjection)}</dd>
              </div>
              <div>
                <dt>Common failure mode</dt>
                <dd>{claimText(contentRecord.content.commonFailureMode)}</dd>
              </div>
              <div>
                <dt>Evidence that would weaken the fit</dt>
                <dd>
                  <ul>
                    {claimList(contentRecord.content.evidenceThatWouldWeakenFit).map((text) => (
                      <li key={text}>{text}</li>
                    ))}
                  </ul>
                </dd>
              </div>
            </dl>
          </section>

          <section
            className={styles.readingSection}
            id="variants"
            aria-labelledby="variants-heading"
          >
            <div className={styles.sectionHeading}>
              <h2 id="variants-heading">Three equal-weight orientations</h2>
              <p>
                These variants change the normative emphasis inside the same
                archetype. Their order does not imply a moral ladder.
              </p>
            </div>
            <div className={styles.variantRows}>
              {contentRecord.content.normativeVariants.map((variant) => (
                <div key={variant.state}>
                  <p>{variant.publicLabel}</p>
                  <p>{claimText(variant.interpretation)}</p>
                </div>
              ))}
            </div>
          </section>

        </div>
      ) : (
        <section className={styles.statusNotice} role="status">
          <h2>Interpretation under review</h2>
          <p>
            The expanded interpretation for this archetype is temporarily
            unavailable while its content record is reviewed.
          </p>
        </section>
      )}

      {resolved && evidence ? (
        <section
          className={`${styles.readingSection} ${styles.historySection}`}
          id="historical-comparison"
          aria-labelledby="historical-heading"
        >
          <div className={styles.sectionHeading}>
            <h2 id="historical-heading">Historical comparison</h2>
            <p>
              This is a comparison, not an identity or endorsement. It anchors
              one part of the reading in a documented argument or practice.
            </p>
          </div>
          <div className={styles.analogueHeading}>
            <h3>{resolved.analogue.label}</h3>
            <p>{resolved.analogue.year}</p>
          </div>
          <div className={styles.historyGrid}>
            <div>
              <h3>Why this comparison fits</h3>
              <p>{evidence.whyItFits}</p>
            </div>
            <div>
              <h3>Where the comparison breaks</h3>
              <p>{evidence.whereItBreaks}</p>
            </div>
          </div>
          <p className={styles.qualification} role="note">
            {evidence.qualification}
          </p>

          {evidence.nameNote ? (
            <div className={styles.nameNote}>
              <h3>A note on the name</h3>
              <p>{evidence.nameNote}</p>
            </div>
          ) : null}

          <div className={styles.sourceLedger} data-archetype-source-ledger>
            <h3>Sources and further reading</h3>
            <ul>
              <li>
                <a href={resolved.analogue.href} target="_blank" rel="noreferrer">
                  {resolved.analogue.label}
                </a>
                <span>Analogue overview</span>
              </li>
              {evidence.sources.map((source) => (
                <li key={source.href}>
                  <a href={source.href} target="_blank" rel="noreferrer">
                    {source.label}
                  </a>
                  <span>Provisional source</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : (
        <section className={styles.statusNotice} role="status">
          <h2>Historical comparison under review</h2>
          <p>
            The historical comparison for this archetype is temporarily
            unavailable while its evidence record is reviewed.
          </p>
        </section>
      )}

      {contentRecord ? (
        <details
          className={styles.researchStatus}
          data-archetype-research-status
          data-content-publication-status={publicationStatus?.publicationStatus}
          data-content-review-status={publicationStatus?.reviewStatus}
        >
          <summary>Research and publication status</summary>
          <div className={styles.researchStatusBody}>
            <p>
              Owner-authorized AI-assisted English beta copy; pending human
              editorial review. No external expert review or validation has been
              completed.
            </p>
            <p>
              Content version {archetypeContentVersion}; evidence version{" "}
              {archetypeEvidenceCatalogVersion}. Historical evidence remains a
              provisional legacy comparison.
            </p>
            <p>
              Neighbor analysis still requires research; blend and domain
              sections are withheld; no reviewed related Current Case or Decision
              Pattern records are published, so those empty sections are omitted.
            </p>
          </div>
        </details>
      ) : null}

      <footer className={styles.methodFooter}>
        <div>
          <h2>Method and status</h2>
          <p>
            Archetypes summarize a continuous, multidimensional profile. They
            do not change the underlying Foundation score or assign people,
            organizations, or traditions to a fixed type. Automated checks are
            pretesting, not editorial, expert, or methodological validation.
          </p>
        </div>
        <Link href="/method">Read the method →</Link>
      </footer>
    </article>
  )
}
