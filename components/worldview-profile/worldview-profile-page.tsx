import { DestinationLink } from "@/components/layout/destination-link"
import Link from "next/link"
import { AtlasPatternFamily } from "@/components/atlas/atlas-pattern-family"
import {
  getAtlasLiteNeighbors,
  getAtlasLitePattern,
  getAtlasPatternHref,
  type AtlasLitePattern,
} from "@/lib/atlas-lite"
import { getProfileMentalModel } from "@/lib/content/profile-mental-models"
import {
  getReviewedCaseCoverage,
  getReviewedCasesForPattern,
  getSourceCoveredClaims,
  verifiedCaseLibraryMeta,
  type ReviewedPatternCase,
  type VerifiedCaseClaim,
} from "@/lib/content/verified-case-library"
import styles from "./worldview-profile.module.css"

type WorldviewProfilePageProps = {
  pattern: AtlasLitePattern
}

type ContentsLink = {
  href: string
  label: string
}

const contentsLinks: ContentsLink[] = [
  { href: "#decision-rule", label: "Decision rule" },
  { href: "#reviewed-cases", label: "Reviewed cases" },
  { href: "#analogy", label: "Analogy and limit" },
  { href: "#strengths-and-blind-spots", label: "Strengths and blind spots" },
  { href: "#domain-shifts", label: "Domain shifts" },
  { href: "#nearby-profiles", label: "Nearby Decision Patterns" },
  { href: "#pressure-test", label: "Pressure test" },
  { href: "#method-and-status", label: "Method and status" },
]

export function WorldviewProfilePage({ pattern }: WorldviewProfilePageProps) {
  const caseReadings = getReviewedCasesForPattern(pattern.id)
  const coverage = getReviewedCaseCoverage(pattern.id)
  const primaryCase = caseReadings[0] ?? null
  const mentalModel = getProfileMentalModel(pattern.id)
  const neighbors = getAtlasLiteNeighbors(pattern)

  return (
    <div className={`wide-container reading-page ${styles.page}`}>
      <DestinationLink destination="worldviewMap" />
      <header className={styles.hero}>
        <div className={styles.heroCopy}>
          <p className="eyebrow">Decision Pattern</p>
          <h1 className={styles.publicName}>{pattern.publicName}</h1>

          <div className={styles.ruleLead}>
            <p className={styles.decisionRule}>{pattern.decisionRule}</p>
          </div>

          <AtlasPatternFamily pattern={pattern} compact />

          <div className={styles.application}>
            <h2>Put the rule to work</h2>
            <p>{pattern.securitySummary}</p>
            <small>Illustrative reasoning, not observed behavior.</small>
            <h3>The objection</h3>
            <p>{pattern.underestimates[0]}</p>
          </div>

        </div>

        <aside className={styles.casePreview} aria-label="Reviewed case coverage">
          <p className={styles.casePreviewStatus}>
            {primaryCase ? "A case to examine" : "Reviewed case coverage"}
          </p>
          {primaryCase ? (
            <>
              <h2>{primaryCase.caseStudy.title}</h2>
              <p className={styles.casePreviewRole}>
                {roleLabel(primaryCase.currentReading.role)} · reviewed case
              </p>
              <p>{primaryCase.caseStudy.neutralContext}</p>
              <a href={`#${caseAnchorId(primaryCase.caseStudy.caseId)}`}>
                Read this case and its rival reading ↓
              </a>
            </>
          ) : (
            <>
              <h2>No reviewed case is attached yet</h2>
              <p>
                Nothing in the reviewed library names this pattern as its best fit or its
                strongest rival yet. The gap stays visible until something does.
              </p>
              <a href="#method-and-status">See the coverage rule ↓</a>
            </>
          )}
        </aside>
      </header>

      <MobileJumpMenu links={contentsLinks} />

      <div className={styles.contentLayout}>
        <ContentsRail links={contentsLinks} />

        <article className={styles.article}>
          <section id="decision-rule" className={styles.section} aria-labelledby="decision-heading">
            <h2 id="decision-heading">How this pattern decides</h2>
            <p className={styles.leadBody}>{pattern.detailSummary}</p>
            <p className={styles.supportingBody}>{pattern.cardPressureNote}</p>
          </section>

          <section id="reviewed-cases" className={styles.section} aria-labelledby="cases-heading">
            <div className={styles.sectionHeading}>
              <h2 id="cases-heading">See the logic in a reviewed case</h2>
              <p>{coverageCopy(coverage.level, coverage.renderedRecordCount)}</p>
            </div>

            {caseReadings.length > 0 ? (
              <div className={styles.caseList}>
                {caseReadings.map((patternCase) => (
                  <CaseRecord
                    key={patternCase.caseStudy.caseId}
                    patternCase={patternCase}
                    currentPattern={pattern}
                  />
                ))}
              </div>
            ) : (
              <div className={styles.emptyCase}>
                <h3>Case coverage remains open</h3>
                <p>
                  No reviewed case names {pattern.publicName} as its best fit or its strongest
                  rival.
                </p>
              </div>
            )}
          </section>

          <section id="analogy" className={styles.section} aria-labelledby="analogy-heading">
            <div className={styles.sectionHeading}>
              <h2 id="analogy-heading">One analogy, with its limit</h2>
              <p>A way to picture the pattern, and the point where the picture misleads.</p>
            </div>
            {mentalModel ? (
              <div className={styles.analogy}>
                <h3>{mentalModel.analogy}</h3>
                <p>{mentalModel.explanation}</p>
                <p className={styles.analogyLimit}>
                  <strong>Where it breaks:</strong> {mentalModel.whereItBreaks}
                </p>
              </div>
            ) : (
              <p className={styles.supportingBody}>No editorial analogy has been reviewed for this pattern.</p>
            )}
          </section>

          <section
            id="strengths-and-blind-spots"
            className={styles.section}
            aria-labelledby="strengths-heading"
          >
            <h2 id="strengths-heading">What it sees clearly, and what it may miss</h2>
            <div className={styles.twoColumns}>
              <div>
                <h3>Sees clearly</h3>
                <ul>
                  {pattern.detailDrivers.map((driver) => (
                    <li key={driver}>{driver}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3>May miss</h3>
                <ul>
                  {pattern.underestimates.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          <section id="domain-shifts" className={styles.section} aria-labelledby="domains-heading">
            <div className={styles.sectionHeading}>
              <h2 id="domains-heading">How the pattern reads different domains</h2>
              <p>The same logic, put to a case about force and to a case about technology.</p>
            </div>
            <div className={styles.domainList}>
              <p><Link href="/modules/security">Try Security</Link> to decide cases such as the one above.</p>
              <DomainEntry
                title="Technology"
                body={pattern.technologySummary}
                href="/modules/technology"
                linkLabel="Open Technology"
              />
              <DomainEntry
                title="AI"
                body="AI Governance has no reading for this pattern. Its questionnaire gives a result of its own."
                href="/ai"
                linkLabel="Open AI Governance"
              />
              <DomainEntry
                title="Perspective"
                body="Perspective Runs put the same questions to you from another actor's seat."
                href="/perspectives"
                linkLabel="Browse Perspective Runs"
              />
            </div>
          </section>

          <section
            id="nearby-profiles"
            className={styles.section}
            aria-labelledby="neighbors-heading"
          >
            <div className={styles.sectionHeading}>
              <h2 id="neighbors-heading">Nearby Decision Patterns</h2>
              <p>{pattern.confusionNote}</p>
            </div>
            <div className={styles.neighborList}>
              {neighbors.map((neighbor) => (
                <article key={neighbor.id} className={styles.neighbor}>
                  <h3>{neighbor.publicName}</h3>
                  <p className={styles.neighborDescriptor}>{neighbor.technicalDescriptor}</p>
                  <p>{neighbor.decisionRule}</p>
                  <Link href={getAtlasPatternHref(neighbor.id)}>
                    Compare with {neighbor.publicName} →
                  </Link>
                </article>
              ))}
            </div>
          </section>

          <section id="pressure-test" className={styles.section} aria-labelledby="pressure-heading">
            <h2 id="pressure-heading">Questions that test this pattern</h2>
            <ol className={styles.pressureList}>
              {pattern.pressureTestQuestions.map((question) => (
                <li key={question}>{question}</li>
              ))}
            </ol>
          </section>

          <section
            id="method-and-status"
            className={`${styles.section} ${styles.method}`}
            aria-labelledby="method-heading"
          >
            <div className={styles.sectionHeading}>
              <h2 id="method-heading">Method and editorial status</h2>
              <p className={styles.descriptor}>{pattern.technicalDescriptor}</p>
              <p>
                {verifiedCaseLibraryMeta.researchStatus} · {verifiedCaseLibraryMeta.editorialStatus}
                {" · "}reviewed through {formatReviewDate(verifiedCaseLibraryMeta.asOfDate)}
              </p>
            </div>
            <div className={styles.methodCopy}>
              <p>
                Decision Patterns are authored ways of reasoning, written for comparison. They are
                not calculated from, matched to, or assigned to a user’s answers, and they describe
                no population type.
              </p>
              <p>
                A case appears here only when its reviewed reading names this pattern as the best
                fit or the strongest rival. The reading is a comparison: it does not settle what the
                case means, and it assigns no government or public figure to a pattern.
              </p>
            </div>
            <div className={styles.actions}>
              <Link href="/quiz" className="cta-primary">Take the Foundation</Link>
              <Link href="/profile" className="cta-secondary">View your Profile</Link>
              <Link href="/method" className="cta-secondary">Read methods</Link>
            </div>
          </section>
        </article>
      </div>
    </div>
  )
}

function ContentsRail({ links }: { links: ContentsLink[] }) {
  return (
    <aside className={styles.rail}>
      <nav aria-label="On this page">
        <p>On this page</p>
        {links.map((link) => (
          <a key={link.href} href={link.href}>{link.label}</a>
        ))}
      </nav>
    </aside>
  )
}

function MobileJumpMenu({ links }: { links: ContentsLink[] }) {
  return (
    <details className={styles.jumpMenu}>
      <summary>On this page</summary>
      <nav aria-label="Jump to a section">
        {links.map((link) => (
          <a key={link.href} href={link.href}>{link.label}</a>
        ))}
      </nav>
    </details>
  )
}

function CaseRecord({
  patternCase,
  currentPattern,
}: {
  patternCase: ReviewedPatternCase
  currentPattern: AtlasLitePattern
}) {
  const { caseStudy, currentReading, otherReading } = patternCase
  const otherPattern = getAtlasLitePattern(otherReading.patternId)
  const sourceCoveredClaims = getSourceCoveredClaims(caseStudy)
  const withheldClaimCount = caseStudy.claimLedger.length - sourceCoveredClaims.length
  const claimLabels = buildClaimLabels(sourceCoveredClaims)

  return (
    <article
      id={caseAnchorId(caseStudy.caseId)}
      className={styles.caseRecord}
      aria-labelledby={`${caseAnchorId(caseStudy.caseId)}-heading`}
    >
      <div className={styles.caseRecordHeader}>
        <div>
          <h3 id={`${caseAnchorId(caseStudy.caseId)}-heading`}>{caseStudy.title}</h3>
          <p>{caseStudy.theme}</p>
        </div>
        <p className={styles.caseStatus}>
          {roleLabel(currentReading.role)} · {caseStudy.verifiedProfileReading.confidence} confidence
        </p>
      </div>

      <p className={styles.caseContext}>{caseStudy.neutralContext}</p>

      <div className={styles.currentReading}>
        <h4>Why it resembles {currentPattern.publicName}</h4>
        <p>{currentReading.rationale}</p>
      </div>

      <div className={styles.otherReading}>
        <h4>See the same case through other readings.</h4>
        {otherPattern ? (
          <>
            <p className={styles.otherReadingName}>
              <Link href={getAtlasPatternHref(otherPattern.id)}>{otherPattern.publicName}</Link>
              <span>{otherPattern.technicalDescriptor}</span>
            </p>
            <p>{otherReading.rationale}</p>
          </>
        ) : (
          <p>{otherReading.rationale}</p>
        )}
      </div>

      <div className={styles.caseLimits}>
        <h4>Where the analogy breaks</h4>
        <ul>
          {caseStudy.verifiedProfileReading.whereAnalogyBreaks.map((limit) => (
            <li key={limit}>{limit}</li>
          ))}
        </ul>
      </div>

      {sourceCoveredClaims[0] ? <p className={styles.supportingBody}><strong>Supporting evidence:</strong> {sourceCoveredClaims[0].text}</p> : null}
      <details className={styles.evidence}>
        <summary>
          Claims and direct sources ({sourceCoveredClaims.length} source-covered claims, {caseStudy.sourceRecords.length} sources)
        </summary>
        <div className={styles.evidenceBody}>
          <div>
            <h4>Source-covered claim ledger</h4>
            <ol className={styles.claimList}>
              {sourceCoveredClaims.map((claim) => (
                <li key={claim.claimId} id={claimAnchorId(caseStudy.caseId, claim.claimId)}>
                  <span>{claimTypeLabel(claim.claimType)}</span>
                  {claim.text}
                </li>
              ))}
            </ol>
            {withheldClaimCount > 0 ? (
              <p className={styles.withheldClaimNote}>
                {withheldClaimCount} additional claim-ledger entry is withheld because no source
                record explicitly names it in claim coverage.
              </p>
            ) : null}
          </div>
          <div>
            <h4>Source records and claim coverage</h4>
            <ol className={styles.sourceList}>
              {caseStudy.sourceRecords.map((source) => (
                <li key={source.sourceId}>
                  <a href={source.url} target="_blank" rel="noreferrer" className={styles.externalLink}>
                    {source.title}
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                  <span>{source.authorInstitution}{source.publicationDate ? ` · ${source.publicationDate}` : ""}</span>
                  <small>
                    Covers {source.claimsSupported.map((claimId, index) => (
                      <span key={claimId}>
                        {index > 0 ? ", " : ""}
                        <a href={`#${claimAnchorId(caseStudy.caseId, claimId)}`}>
                          {claimLabels.get(claimId) ?? claimId}
                        </a>
                      </span>
                    ))}
                  </small>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </details>
    </article>
  )
}

function DomainEntry({
  title,
  body,
  href,
  linkLabel,
}: {
  title: string
  body: string
  href: string
  linkLabel: string
}) {
  return (
    <article className={styles.domainEntry}>
      <h3>{title}</h3>
      <p>{body}</p>
      <Link href={href}>{linkLabel} →</Link>
    </article>
  )
}

function buildClaimLabels(claims: VerifiedCaseClaim[]) {
  const counts = new Map<VerifiedCaseClaim["claimType"], number>()

  return new Map(
    claims.map((claim) => {
      const count = (counts.get(claim.claimType) ?? 0) + 1
      counts.set(claim.claimType, count)
      return [claim.claimId, `${claimTypeLabel(claim.claimType)} ${count}`]
    }),
  )
}

function coverageCopy(level: "several" | "thin" | "none", count: number) {
  if (level === "several") {
    return `${count} reviewed cases test this pattern’s logic from more than one setting.`
  }

  if (level === "thin") {
    return "One reviewed case: an example of the logic, and no proof of it."
  }

  return "No reviewed case names this pattern as its best fit or strongest rival."
}

function roleLabel(role: ReviewedPatternCase["currentReading"]["role"]) {
  return role === "best-fit" ? "Primary reviewed fit" : "Strongest rival reading"
}

function claimTypeLabel(claimType: VerifiedCaseClaim["claimType"]) {
  switch (claimType) {
    case "historical_fact":
      return "Historical fact"
    case "interpretation":
      return "Interpretation"
    case "current_policy_claim":
      return "Current-policy claim"
  }
}

function caseAnchorId(caseId: string) {
  return `case-${caseId}`
}

function claimAnchorId(caseId: string, claimId: string) {
  return `${caseAnchorId(caseId)}-claim-${claimId}`
}

function formatReviewDate(date: string) {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "long",
    timeZone: "UTC",
  }).format(new Date(`${date}T00:00:00Z`))
}
