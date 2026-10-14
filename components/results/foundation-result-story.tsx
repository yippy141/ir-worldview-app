"use client"

import { ResultReveal } from "@/components/results/result-reveal"

import Link from "next/link"
import { ProfileMethodCallout } from "@/components/results/profile-method-callout"
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
import { buildFoundationContributionCopy } from "@/lib/results/foundation-contribution-copy"
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
      title: `${props.primaryLabel} and ${props.runnerUpLabel}`,
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
        // per dimension, primary minus runner-up), on legacy, and on
        // lowDifferentiation. The builder asserts nothing those fields do not
        // contain; see lib/results/foundation-contribution-copy.ts.
        const copy = buildFoundationContributionCopy({
          rows: props.contributionRows,
          legacy: props.legacy,
          lowDifferentiation: props.lowDifferentiation,
          primaryLabel: props.primaryLabel,
          runnerUpLabel: props.runnerUpLabel,
          dimensionLabel: (dimension) => dimensionLabels[dimension],
        })
        if (copy.unavailableNote) {
          return (
            <>
              <p>{copy.lead}</p>
            </>
          )
        }
        return (
          <>
            <p>{copy.lead}</p>
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
          unavailable={props.legacy ? "legacy" : props.contributionRows.length === 0 ? "unavailable" : null}
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
              : `Compare the two below to see which readings a different posture would have produced.`}
          </p>
        </>
      ),
      visualLabel: "The Foundation readings",
      renderVisual: () => (
        <ArchetypeMatrix primaryCode={primaryCode} runnerCode={runnerCode} />
      ),
    },
    {
      id: "evidence",
      number: "04",
      title: "Your answers",
      copy: null,
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
      title: props.pressureCase ? "Test the reading against a reviewed case" : "Try a decision",
      copy: <p>{props.pressureCase ? "One reviewed case where two of these considerations collide. Work out which you would put first." : "Work through a concrete choice and consider which condition would change your response."}</p>,
      visualLabel: "Reviewed historical case",
      renderVisual: () => props.pressureCase ? (
        <CasePanel pressureCase={props.pressureCase} />
      ) : (
        <p className={styles.visualNote}>
          <Link href="/decisions">Explore a decision</Link>
        </p>
      ),
    },

  ]

  return (
    <article
      className={styles.story}
      data-foundation-result-story
    >
      <ResultReveal domain="foundation" payload={props.payload}><header className={styles.frontispiece} aria-labelledby="foundation-result-heading">
        {markPrimaryCode ? <FoundationHeroMark payload={props.payload} code={props.archetype.code as BlendArchetype["code"]} primaryCode={markPrimaryCode} />
          : <FoundationHeroMark payload={props.payload} code={props.archetype.code as PureArchetypeCode} />}
        <h1 id="foundation-result-heading">{props.archetype.name}</h1>
        <p className={styles.qualification}>{heading.title}</p>
        {props.payoff.interpretation.summary.split("\n\n").map(paragraph => <p key={paragraph} className={styles.frontispieceLead}>{paragraph}</p>)}
        <a href="#nearest" className="cta-primary print-hidden">Explore this reading</a>
        {!props.legacy && props.lowDifferentiation && props.resultTier === "core" ? <p><Link href={props.nextAction.href}>{props.nextAction.label}</Link></p> : null}
      </header></ResultReveal>
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

      <ProfileMethodCallout />
      <footer className={styles.footer}>
        <div>
          <p className={styles.sectionLabel}>Continue from this result</p>
          <h2>Read the rival argument, or take a question to a harder case</h2>
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
  if (id === "evidence") return <section id={id} className={styles.evidenceSection} data-foundation-story-chapter={id}>{renderVisual()}</section>

  return (
    <section
      id={id}
      className={styles.chapter}
      aria-labelledby={headingId}
      data-foundation-story-chapter={id}
    >
      <div className={styles.chapterCopy}>
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
  unavailable: "legacy" | "unavailable" | null
}) {
  if (unavailable === "legacy") {
    return (
      <p className={styles.visualNote} data-contribution-status="legacy-unavailable">
        The dimension-by-dimension terms cannot be shown for this link. The
        positions above still apply.
      </p>
    )
  }
  if (unavailable === "unavailable") {
    return (
      <p className={styles.visualNote} data-contribution-status="unavailable">
        The dimension-by-dimension terms are not available for this result.
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

function matrixCode(
  family: FamilyKey,
  archetype: Archetype | BlendArchetype,
): PureArchetypeCode {
  return `${lensFromFamily(family)}${archetype.posture}` as PureArchetypeCode
}
