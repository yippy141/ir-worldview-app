import Link from "next/link"
import { AtlasFingerprint } from "@/components/atlas/atlas-fingerprint"
import { AtlasPatternFamily } from "@/components/atlas/atlas-pattern-family"
import {
  getAtlasLiteNeighbors,
  getAtlasPatternHref,
  getAtlasLitePattern,
  type AtlasLitePattern,
} from "@/lib/atlas-lite"
import {
  caseLibraryMeta,
  getCaseReadingsForPattern,
  type PatternCaseReading,
} from "@/lib/content/case-library"
import { getProfileMentalModel } from "@/lib/content/profile-mental-models"
import styles from "./worldview-profile.module.css"

type WorldviewProfilePageProps = {
  pattern: AtlasLitePattern
}

function caseAnchorId(caseId: string) {
  return `case-${caseId.replaceAll("_", "-")}`
}

export function WorldviewProfilePage({ pattern }: WorldviewProfilePageProps) {
  const neighbors = getAtlasLiteNeighbors(pattern)
  const caseReadings = getCaseReadingsForPattern(pattern.id)
  const [primaryCase, ...moreCases] = caseReadings
  const mentalModel = getProfileMentalModel(pattern.id)

  return (
    <div className="wide-container">
      {/* ── Above the fold: name, rule, three signals, case strip ── */}
      <header className={styles.hero}>
        <div className={styles.heroCopy}>
          <p className="eyebrow">Worldview profile</p>
          <h1 className={styles.publicName}>{pattern.publicName}</h1>
          <p className={styles.descriptor}>{pattern.technicalDescriptor}</p>
          <AtlasPatternFamily pattern={pattern} compact />

          <p className={styles.decisionRule}>{pattern.decisionRule}</p>

          <dl className={styles.signals}>
            <div className={styles.signal}>
              <dt className={styles.signalLabel}>Notices first</dt>
              <dd className={styles.signalText}>{pattern.detailDrivers[0]}</dd>
            </div>
            <div className={styles.signal}>
              <dt className={styles.signalLabel}>Likely move</dt>
              <dd className={styles.signalText}>{pattern.soWhat}</dd>
            </div>
            <div className={styles.signal}>
              <dt className={styles.signalLabel}>Main risk</dt>
              <dd className={styles.signalText}>{pattern.underestimates[0]}</dd>
            </div>
          </dl>

          {caseReadings.length > 0 ? (
            <p className={styles.caseStrip}>
              <span className={styles.caseStripLabel}>In the case library</span>
              {caseReadings.map(({ caseStudy }) => (
                <a
                  key={caseStudy.id}
                  href={`#${caseAnchorId(caseStudy.id)}`}
                  className={styles.caseStripLink}
                >
                  {caseStudy.title}
                </a>
              ))}
            </p>
          ) : null}
        </div>

        <aside className={styles.heroAside}>
          <div className={`callout stack-sm ${styles.fingerprintCard}`}>
            <div className="stack-xs">
              <p className="eyebrow">Visual fingerprint</p>
              <div className="atlas-tag-list" aria-label={`${pattern.publicName} drivers`}>
                {pattern.cardDrivers.map((driver) => (
                  <span key={driver} className="atlas-tag">
                    {driver}
                  </span>
                ))}
              </div>
            </div>
            <AtlasFingerprint fingerprint={pattern.fingerprint} />
            <p className={`muted atlas-pressure-note ${styles.flush}`}>
              <strong>Under pressure:</strong> {pattern.cardPressureNote}
            </p>
          </div>
        </aside>
      </header>

      {/* ── The decision rule, expanded ── */}
      <section className={styles.section} aria-labelledby="profile-decision-rule">
        <div className="stack-sm">
          <h2 id="profile-decision-rule">How this profile decides</h2>
          <p className={styles.sectionBody}>{pattern.detailSummary}</p>
        </div>
      </section>

      {/* ── See it in a case ── */}
      {primaryCase ? (
        <section className={styles.section} aria-labelledby="profile-case-heading">
          <div className="stack-md">
            <h2 id="profile-case-heading">See it in a case</h2>
            <CasePanel patternCase={primaryCase} currentPatternId={pattern.id} />
            {moreCases.length > 0 ? (
              <dl className={styles.moreCases}>
                {moreCases.map(({ caseStudy, reading }) => (
                  <div
                    key={caseStudy.id}
                    id={caseAnchorId(caseStudy.id)}
                    className={styles.moreCase}
                  >
                    <dt className={styles.moreCaseTitle}>{caseStudy.title}</dt>
                    <dd className={styles.moreCaseText}>{reading.noticesFirst}</dd>
                  </div>
                ))}
              </dl>
            ) : null}
          </div>
        </section>
      ) : null}

      {/* ── Mental model ── */}
      {mentalModel ? (
        <section className={styles.section} aria-labelledby="profile-mental-model">
          <div className="stack-sm">
            <h2 id="profile-mental-model">One analogy, with its limit</h2>
            <div className={styles.mentalModel}>
              <p className={styles.mentalModelAnalogy}>{mentalModel.analogy}</p>
              <p className={styles.mentalModelBody}>{mentalModel.body}</p>
              <p className={styles.mentalModelCaveat}>
                <strong>Where it breaks:</strong> {mentalModel.caveat}
              </p>
            </div>
          </div>
        </section>
      ) : null}

      {/* ── Sees clearly / may miss ── */}
      <section className={styles.section} aria-labelledby="profile-sees-misses">
        <div className="stack-md">
          <h2 id="profile-sees-misses">What it sees clearly, and what it may miss</h2>
          <div className={styles.columns}>
            <div className="stack-sm">
              <h3>Sees clearly</h3>
              <ul className={`content-list ${styles.flushList}`}>
                {pattern.detailDrivers.map((driver) => (
                  <li key={driver}>{driver}</li>
                ))}
              </ul>
            </div>
            <div className="stack-sm">
              <h3>May miss</h3>
              <ul className={`content-list ${styles.flushList}`}>
                {pattern.underestimates.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── Domain shifts ── */}
      <section className={styles.section} aria-labelledby="profile-domain-shifts">
        <div className="stack-md">
          <h2 id="profile-domain-shifts">Where it changes by domain</h2>
          <div className={styles.columns}>
            <div className="stack-xs">
              <h3>In Security</h3>
              <p className={styles.domainText}>{pattern.securitySummary}</p>
            </div>
            <div className="stack-xs">
              <h3>In Technology</h3>
              <p className={styles.domainText}>{pattern.technologySummary}</p>
            </div>
          </div>
          <p className={`muted ${styles.crossNote}`}>
            Your own domain shifts appear on your{" "}
            <Link href="/profile" className={styles.inlineLink}>
              Profile
            </Link>{" "}
            once you save a Focus Area or Perspective Run beside the baseline, and on the{" "}
            <Link href="/explore/atlas" className={styles.inlineLink}>
              Worldview Map
            </Link>
            , where saved layers plot on one projection.
          </p>
        </div>
      </section>

      {/* ── Nearby profiles ── */}
      <section className={styles.section} aria-labelledby="profile-neighbors">
        <div className="stack-md">
          <div className="stack-xs">
            <h2 id="profile-neighbors">Nearby profiles</h2>
            <p className={`muted ${styles.crossNote}`}>{pattern.confusionNote}</p>
          </div>
          <div>
            {neighbors.map((neighbor) => (
              <article key={neighbor.id} className={styles.neighbor}>
                <h3 className={styles.neighborName}>{neighbor.publicName}</h3>
                <p className={styles.neighborDescriptor}>{neighbor.technicalDescriptor}</p>
                <p className={styles.neighborText}>{neighbor.cardSummary}</p>
                <Link href={getAtlasPatternHref(neighbor.id)} className={styles.inlineLink}>
                  Open {neighbor.publicName} →
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pressure test ── */}
      <section className={styles.section} aria-labelledby="profile-pressure-test">
        <div className="stack-sm">
          <h2 id="profile-pressure-test">Questions that test whether this is really you</h2>
          <ul className={`content-list ${styles.pressureList}`}>
            {pattern.pressureTestQuestions.map((question) => (
              <li key={question}>{question}</li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Method and evidence, kept visible ── */}
      <section className={styles.methodBand} aria-labelledby="profile-method">
        <div className="stack-sm">
          <h2 id="profile-method">Method and evidence</h2>
          <p className={styles.methodText}>
            Worldview profiles are authored reading aids, not population types or fixed identities.
            Case readings say a profile <em>resembles the logic of</em> a position; they never
            assign a public figure, government, or movement to a profile without dated evidence.
            Case files are {caseLibraryMeta.editorialStatus} material with named sources.
          </p>
          <div className="row gap-sm wrap">
            <Link href="/quiz" className="cta-primary">Take the Foundation</Link>
            <Link href="/explore/atlas" className="cta-secondary">Open Worldview Map</Link>
            <Link href="/method" className="cta-secondary">Read methods</Link>
            <Link href="/references" className="cta-secondary">Browse references</Link>
          </div>
        </div>
      </section>
    </div>
  )
}

function CasePanel({
  patternCase,
  currentPatternId,
}: {
  patternCase: PatternCaseReading
  currentPatternId: string
}) {
  const { caseStudy, reading } = patternCase
  const otherReadings = caseStudy.readings.filter(
    (entry) => entry.patternId !== currentPatternId,
  )

  return (
    <article className={styles.casePanel} id={caseAnchorId(caseStudy.id)}>
      <h3 className={styles.caseTitle}>{caseStudy.title}</h3>
      <p className={styles.caseMeta}>
        Case file · {caseStudy.sources.length} sources · resembles-the-logic-of coding
      </p>
      <p className={styles.caseContext}>{caseStudy.context}</p>

      <dl className={styles.caseReading}>
        <div>
          <dt>Notices first</dt>
          <dd>{reading.noticesFirst}</dd>
        </div>
        <div>
          <dt>Likely recommendation</dt>
          <dd>{reading.likelyRecommendation}</dd>
        </div>
        <div>
          <dt>Strongest objection</dt>
          <dd>{reading.strongestObjection}</dd>
        </div>
      </dl>

      <div className={styles.caseBreaks}>
        <p className={styles.caseBreaksLabel}>Where the analogy breaks</p>
        <ul>
          {caseStudy.whereTheAnalogyBreaks.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>

      {otherReadings.length > 0 ? (
        <div className={styles.otherReadings}>
          <p className={styles.otherReadingsLabel}>The same case, other readings</p>
          <p className={styles.otherReadingsNote}>
            The case does not settle which reading is right. That disagreement is the point.
          </p>
          {otherReadings.map((entry) => {
            const otherPattern = getAtlasLitePattern(entry.patternId)

            return (
              <div key={entry.patternId} className={styles.otherReading}>
                <p className={styles.otherReadingName}>
                  {otherPattern ? (
                    <Link href={getAtlasPatternHref(otherPattern.id)}>{entry.profileName}</Link>
                  ) : (
                    entry.profileName
                  )}
                </p>
                <p className={styles.otherReadingText}>{entry.likelyRecommendation}</p>
              </div>
            )
          })}
        </div>
      ) : null}

      <div className={styles.caseSources}>
        <p className={styles.caseSourcesLabel}>Sources</p>
        <ul>
          {caseStudy.sources.map((source) => (
            <li key={source}>{source}</li>
          ))}
        </ul>
      </div>
    </article>
  )
}
