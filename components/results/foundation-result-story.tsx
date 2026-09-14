"use client"

import Link from "next/link"
import { WorkedApplication } from "@/components/results/worked-application"
import type { CSSProperties, ReactNode } from "react"
import { FoundationHeroMark } from "@/components/results/foundation-hero-mark"
import { FoundationDomainRecords } from "@/components/results/foundation-domain-records"
import { FoundationLocalEvidence } from "@/components/results/foundation-local-evidence"
import { NearestAlternative, type ComparisonRow } from "@/components/results/nearest-alternative"
import { ARCHETYPE_MATRIX_CELLS } from "@/lib/field/archetype-matrix"
import type { PureArchetypeCode } from "@/lib/archetype-marks"
import {
  lensFromFamily,
  type Archetype,
  type BlendArchetype,
} from "@/lib/archetypes"
import type { FoundationContributionRow } from "@/lib/results/foundation-contributions"
import type { FoundationPayoff } from "@/lib/results/foundation-payoff"
import { buildFoundationResultHeading } from "@/lib/results/foundation-result-heading"
import { dimensionLabels } from "@/lib/quiz-schema"
import type {
  FamilyKey,
  FoundationQuestionSet,
  FoundationTier,
} from "@/lib/types"
import styles from "./foundation-result-story.module.css"

type PressureCase = {
  title: string
  theme: string
  question: string
  reason: string
  href: string | null
}

type NextAction = {
  href: string
  label: string
  reason: string
}

export type FoundationResultStoryProps = {
  payload: string
  resultTier: FoundationTier
  questionSet: FoundationQuestionSet | null
  legacy: boolean
  lowDifferentiation: boolean
  primaryFamily: FamilyKey
  primaryLabel: string
  runnerUpFamily: FamilyKey
  runnerUpLabel: string
  archetype: Archetype | BlendArchetype
  archetypeCode: string
  archetypeCodeSpeech: string
  archetypeCodeKey: string
  comparisonRows: ComparisonRow[]
  contributionRows: FoundationContributionRow[]
  payoff: FoundationPayoff
  pressureCase: PressureCase | null
  nextAction: NextAction
  utility: ReactNode
}

/** Contribution terms closer than this are reported as equal. */
const CONTRIBUTION_TIE_EPSILON = 1e-6

function joinLabels(labels: string[]): string {
  if (labels.length <= 1) return labels[0] ?? ""
  return `${labels.slice(0, -1).join(", ")} and ${labels[labels.length - 1]}`
}

export function FoundationResultStory(props: FoundationResultStoryProps) {
  const heading = buildFoundationResultHeading(props)
  const primaryCode = matrixCode(
    props.primaryFamily,
    props.archetype,
  )
  const runnerCode = matrixCode(
    props.runnerUpFamily,
    props.archetype,
  )
  const markPrimaryCode = "archetypes" in props.archetype
    ? props.archetype.archetypes.find(
        ({ familyKey }) => familyKey === props.primaryFamily,
      )?.code
    : null

  const chapters: StoryChapterDefinition[] = [
    {
      id: "nearest",
      number: "01",
      title: `Why ${props.primaryLabel}, and not ${props.runnerUpLabel}`,
      copy: (
        <>
          <p>
            {`${props.payoff.mainTension.rivalArgument} The rows below put your positions beside what each reading expects.`}
          </p>
        </>
      ),
      visualLabel: "Nearest modeled alternative",
      renderVisual: () => (
        <NearestAlternative
          primaryLabel={props.primaryLabel}
          runnerUpLabel={props.runnerUpLabel}
          rows={props.comparisonRows}
        />
      ),
    },
    {
      id: "contribution",
      number: "02",
      title: "What did the work",
      copy: (() => {
        // Personalized sentences depend on contributionRows (signedContribution
        // per dimension, primary minus runner-up) and on lowDifferentiation.
        // Nothing is asserted that those fields do not contain. A positive
        // term means the answers on that dimension counted for the primary
        // reading more than for the runner-up; it does not mean the reader
        // endorsed every belief of that tradition.
        const rows = props.contributionRows
        if (props.legacy || rows.length === 0) {
          return (
            <>
              <p>
                This link predates the dimension-by-dimension comparison, so those
                terms cannot be shown. The rows in chapter 01 still apply.
              </p>
            </>
          )
        }
        const maxContribution = Math.max(...rows.map((row) => row.signedContribution))
        const minContribution = Math.min(...rows.map((row) => row.signedContribution))
        const leading = rows.filter(
          (row) => Math.abs(row.signedContribution - maxContribution) < CONTRIBUTION_TIE_EPSILON,
        )
        const low = rows.find((row) => row.signedContribution === minContribution) ?? rows[0]
        const opposing = low.signedContribution < 0
          ? ` On ${dimensionLabels[low.dimension]} they counted the other way; that is where ${props.runnerUpLabel} gets its support${props.lowDifferentiation ? ", and why it stayed close" : ""}.`
          : ""
        // No dimension counted for the primary reading. Since the primary
        // reading still leads, the two rounded family scores are level and
        // the order between them comes from the model's tie rule.
        const lead = maxContribution <= 0
          ? (minContribution < 0
              ? `No dimension counted for ${props.primaryLabel} over ${props.runnerUpLabel}; after rounding, the two readings are level and the name is the tie-break.${opposing}`
              : `Your positions sat at the midpoint on every dimension where ${props.primaryLabel} and ${props.runnerUpLabel} differ, so nothing pulled toward either. Read them as a tie.`)
          : leading.length > 1
            ? `Your answers on ${joinLabels(leading.map((row) => dimensionLabels[row.dimension]))} did most of the work, in equal measure: there they counted for ${props.primaryLabel} more than for ${props.runnerUpLabel}.${opposing}`
            : `Your answers on ${dimensionLabels[leading[0].dimension]} did most of the work: there they counted for ${props.primaryLabel} more than for ${props.runnerUpLabel}.${opposing}`
        return (
          <>
            <p>{lead}</p>
            <p>
              Each row shows how far one dimension pulled toward one reading or the other.
            </p>
            <details>
              <summary>How this is calculated</summary>
              <p>
                Each row is one term in the comparison of {props.primaryLabel} with {props.runnerUpLabel}: your position on that dimension, weighted by how differently the two traditions treat it. <Link href="/method">Method</Link> has the full calculation.
              </p>
            </details>
          </>
        )
      })(),
      visualLabel: `${props.primaryLabel} minus ${props.runnerUpLabel}`,
      renderVisual: () => (
        <ContributionView
          rows={props.contributionRows}
          primaryLabel={props.primaryLabel}
          runnerUpLabel={props.runnerUpLabel}
          unavailable={props.legacy}
        />
      ),
    },
    {
      id: "matrix",
      number: "03",
      title: "Where this reading sits",
      copy: (
        <>
          <p>
            {/* The closeness sentence depends on lowDifferentiation (the gap
                between the two rounded family scores is under the calibrated
                threshold). Matrix cells are a display grid, not a distance. */}
            {`The matrix highlights ${props.primaryLabel} and ${props.runnerUpLabel} under your posture, beside the readings that share it. `}
            {props.lowDifferentiation
              ? `In your result the two finished close, so the rival argument is worth reading before the name settles.`
              : `Open it to compare the two, and to see which readings a different posture would have produced.`}
          </p>
        </>
      ),
      visualLabel: "The Foundation readings",
      renderVisual: () => (
        <details className="profile-details"><summary>Open the orientation matrix</summary><ArchetypeMatrix primaryCode={primaryCode} runnerCode={runnerCode} /></details>
      ),
    },
    {
      id: "evidence",
      number: "04",
      title: "Choices behind your result",
      copy: (
        <>
          <p>
            Up to three of your own answers, each beside the alternative that
            would have moved the result. They come from the answers you
            submitted in this browser; a shared link cannot show them.
          </p>
        </>
      ),
      visualLabel: "Your answers and the alternatives",
      renderVisual: () => <FoundationLocalEvidence payload={props.payload} />,
    },
    {
      id: "domains",
      number: "05",
      title: "Your other results on this device",
      copy: (
        <>
          <p>
            Security, Technology, and AI Governance each give their own
            result. None of them changes this one.
          </p>
        </>
      ),
      visualLabel: "Saved on this device",
      renderVisual: () => <FoundationDomainRecords />,
    },
    {
      id: "case",
      number: "06",
      title: "Test the reading against a reviewed case",
      copy: (
        <>
          <p>
            One reviewed case where two of these considerations collide. Work
            out which you would put first; the case keeps its evidence window
            and its rival interpretation.
          </p>
        </>
      ),
      visualLabel: "Reviewed historical case",
      renderVisual: () => props.pressureCase ? (
        <CasePanel pressureCase={props.pressureCase} />
      ) : (
        <p className={styles.visualNote}>
          No reviewed case is linked to this result.
        </p>
      ),
    },
    {
      id: "limits",
      number: "07",
      title: "What this model can and cannot say",
      copy: (
        <>
          <p>
            Your answers were compared with four authored tradition profiles.
            It is a reading of those answers, not a measurement of proven
            accuracy, and not a personal trait. Readings near a boundary between traditions
            move more easily than others.
          </p>
          <p>
            <Link href="/method">Read the Foundation method and limits</Link>
          </p>
        </>
      ),
      visualLabel: "What this model covers",
      renderVisual: () => <LimitsPanel />,
    },
  ]

  return (
    <article
      className={styles.story}
      data-foundation-result-story
    >
      <header className={styles.frontispiece} aria-labelledby="foundation-result-heading">
        {markPrimaryCode ? <FoundationHeroMark payload={props.payload} code={props.archetype.code as BlendArchetype["code"]} primaryCode={markPrimaryCode} />
          : <FoundationHeroMark payload={props.payload} code={props.archetype.code as PureArchetypeCode} />}
        <h1 id="foundation-result-heading">{props.archetype.name}</h1>
        <p className={styles.qualification}>{heading.title}</p>
        <p className={styles.frontispieceLead}>{props.payoff.interpretation.summary}</p>
        <a href="#nearest" className="cta-primary print-hidden">Explore this reading</a>
        {!props.legacy && props.lowDifferentiation && props.resultTier === "core" ? <p><Link href={props.nextAction.href}>{props.nextAction.label}</Link></p> : null}
      </header>
      <section className={styles.openingPayoff} aria-label="Immediate result payoff">
        <p className="result-scope">{heading.lead}</p>
        <WorkedApplication example={props.payoff.interpretation.example} />
        <p><strong>The next question. </strong>{props.payoff.interpretation.followUp.question}</p>
        <details><summary>Reading code and form</summary><p aria-label={props.archetypeCodeSpeech}>{props.archetypeCode}</p><p>{props.archetypeCodeKey}</p><p>{heading.eyebrow}</p></details>
      </section>

      <div className={styles.storyBody}>
        <div
          className={styles.chapters}
          data-foundation-sticky-region
          role="group"
          aria-label="Scroll-led result chapters"
        >
          {chapters.map((chapter) => (
            <StoryChapter key={chapter.id} {...chapter} />
          ))}
        </div>
      </div>

      <footer className={styles.footer}>
        <div>
          <p className={styles.sectionLabel}>Continue from this result</p>
          <h2>Read the rival argument, or take a question to a harder case.</h2>
        </div>
        <div className={`${styles.actions} print-hidden`}>
          <Link href={props.nextAction.href} className="cta-primary">
            {props.nextAction.label}
          </Link>
          <Link href="/profile" className="cta-secondary">
            View Profile
          </Link>
          <Link href="/decisions/who-gets-to-verify" className="cta-secondary">Try a decision exercise</Link>
          <Link href="/perspectives" className="cta-secondary">
            Open Perspective Runs
          </Link>
          <Link href="/modules" className="cta-secondary">
            Security and Technology
          </Link>
        </div>
        <p className={styles.visualNote}>{props.nextAction.reason}</p>
        <div className={styles.utility}>{props.utility}</div>
      </footer>
    </article>
  )
}

function StoryChapter({
  id,
  number,
  title,
  copy,
  visualLabel,
  renderVisual,
}: StoryChapterDefinition) {
  const headingId = `foundation-story-chapter-${number}`

  return (
    <section
      id={id}
      className={styles.chapter}
      aria-labelledby={headingId}
      data-foundation-story-chapter={id}
    >
      <div className={styles.chapterCopy}>
        <p className={styles.chapterNumber}>Chapter {number}</p>
        <h2 id={headingId} className={styles.chapterTitle}>{title}</h2>
        {copy}
      </div>
      <div className={styles.inlineVisual} data-foundation-chapter-visual>
        <p className={styles.visualLabel}>{visualLabel}</p>
        {renderVisual()}
      </div>
    </section>
  )
}

type StoryChapterDefinition = {
  id: string
  number: string
  title: string
  copy: ReactNode
  visualLabel: string
  renderVisual: () => ReactNode
}

function ContributionView({
  rows,
  primaryLabel,
  runnerUpLabel,
  unavailable,
}: {
  rows: FoundationContributionRow[]
  primaryLabel: string
  runnerUpLabel: string
  unavailable: boolean
}) {
  if (unavailable) {
    return (
      <p className={styles.visualNote} data-contribution-status="legacy-unavailable">
        The dimension-by-dimension terms cannot be shown for this link. The
        rows in chapter 01 still apply.
      </p>
    )
  }

  const maxMagnitude = Math.max(
    ...rows.map((row) => Math.abs(row.signedContribution)),
    Number.EPSILON,
  )

  return (
    <>
      <ol className={styles.contributionList}>
        {rows.map((row) => {
          const magnitude = Math.abs(row.signedContribution) / maxMagnitude
          const signedValue = `${row.signedContribution >= 0 ? "+" : ""}${row.signedContribution.toFixed(3)}`
          const sign = row.signedContribution >= 0 ? "positive" : "negative"
          const contributionStyle = {
            "--contribution-size": magnitude,
          } as CSSProperties

          return (
            <li key={row.dimension} className={styles.contributionRow}>
              <span className={styles.contributionLabel}>
                {dimensionLabels[row.dimension]}
              </span>
              <span className={styles.contributionTrack} aria-hidden="true">
                <span
                  className={styles.contributionFill}
                  data-sign={sign}
                  style={contributionStyle}
                />
              </span>
              <span
                className={styles.contributionValue}
                aria-label={`${dimensionLabels[row.dimension]} contribution ${signedValue}`}
              >
                {signedValue}
              </span>
            </li>
          )
        })}
      </ol>
      <p className={styles.visualNote}>
        Positive terms count toward {primaryLabel}; negative terms count toward {runnerUpLabel}.
        Values are shown to three decimal places. The deterministic test also
        reconciles the scorer&apos;s final two-decimal rounding step.
      </p>
    </>
  )
}

function ArchetypeMatrix({
  primaryCode,
  runnerCode,
}: {
  primaryCode: PureArchetypeCode
  runnerCode: PureArchetypeCode
}) {
  const rows = ["+", "-"] as const

  return (
    <div
      className={styles.matrixScroll}
      role="region"
      aria-label="Registered Foundation reading matrix"
      tabIndex={0}
    >
      <table className={styles.matrix}>
        <caption className="sr-only">
          Eight registered readings by modeled tradition and restraint posture
        </caption>
        <thead>
          <tr>
            <th scope="col">Posture</th>
            <th scope="col">Power</th>
            <th scope="col">Rules</th>
            <th scope="col">Meaning</th>
            <th scope="col">Structure</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((posture) => (
            <tr key={posture}>
              <th scope="row">
                {posture === "+" ? "Applying advantage" : "Restraint"}
              </th>
              {ARCHETYPE_MATRIX_CELLS
                .filter((cell) => cell.posture === posture)
                .map((cell) => {
                  const active = cell.archetypeCode === primaryCode
                    ? "primary"
                    : cell.archetypeCode === runnerCode
                      ? "runner"
                      : undefined

                  return (
                    <td key={cell.archetypeCode} data-active={active}>
                      <span className={styles.matrixCode}>{cell.archetypeCode}</span>
                      <span className={styles.matrixName}>{cell.archetype.name}</span>
                    </td>
                  )
                })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function CasePanel({ pressureCase }: { pressureCase: PressureCase }) {
  return (
    <article className={styles.casePanel}>
      <div>
        <p className={styles.caseMeta}>{pressureCase.theme}</p>
        <h3>{pressureCase.title}</h3>
      </div>
      <p className={styles.caseQuestion}>{pressureCase.question}</p>
      <p className={styles.caseReason}>{pressureCase.reason}</p>
      {pressureCase.href ? (
        <Link href={pressureCase.href} className="cta-secondary">
          Read the case record
        </Link>
      ) : null}
    </article>
  )
}

function LimitsPanel() {
  return (
    <dl className={styles.limits}>
      <div>
        <dt>Modeled here</dt>
        <dd>
          Realist, institutionalist, constructivist, and critical political
          economy reference profiles.
        </dd>
      </div>
      <div>
        <dt>Under-modeled</dt>
        <dd>
          Feminist, postcolonial and decolonial, green, and English School
          approaches are not named as scored families.
        </dd>
      </div>
      <div>
        <dt>Diagnostic status</dt>
        <dd>
          Structural sensitivity was tested with constructed inputs. No human
          participant or population inference follows from that diagnostic.
        </dd>
      </div>
      <div>
        <dt>Raw posture scale</dt>
        <dd>
          The registered restraint boundary is not a claim that the completed
          form is symmetrically centered around that raw value.
        </dd>
      </div>
    </dl>
  )
}

function matrixCode(
  family: FamilyKey,
  archetype: Archetype | BlendArchetype,
): PureArchetypeCode {
  return `${lensFromFamily(family)}${archetype.posture}` as PureArchetypeCode
}
