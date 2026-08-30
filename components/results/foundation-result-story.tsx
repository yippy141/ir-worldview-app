"use client"

import Link from "next/link"
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react"
import { FoundationMark } from "@/components/archetypes/archetype-mark"
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

export function FoundationResultStory(props: FoundationResultStoryProps) {
  const storyRef = useRef<HTMLElement>(null)
  const [activeChapter, setActiveChapter] = useState("nearest")
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

  useEffect(() => {
    const story = storyRef.current
    if (!story) return
    const chapters = Array.from(
      story.querySelectorAll<HTMLElement>("[data-foundation-story-chapter]"),
    )
    if (chapters.length === 0 || typeof IntersectionObserver === "undefined") {
      return
    }
    story.setAttribute("data-enhanced", "true")

    const observer = new IntersectionObserver(
      (entries) => {
        const current = entries
          .filter((entry) => entry.isIntersecting)
          .sort((left, right) => right.intersectionRatio - left.intersectionRatio)[0]
        const chapterId = current?.target.getAttribute("data-foundation-story-chapter")
        if (chapterId) setActiveChapter(chapterId)
      },
      {
        rootMargin: "-24% 0px -58% 0px",
        threshold: [0, 0.2, 0.45, 0.7],
      },
    )

    chapters.forEach((chapter) => observer.observe(chapter))
    return () => {
      observer.disconnect()
      story.removeAttribute("data-enhanced")
    }
  }, [])

  const chapters: StoryChapterDefinition[] = [
    {
      id: "nearest",
      number: "01",
      title: `Why ${props.primaryLabel} rather than ${props.runnerUpLabel}`,
      copy: (
        <>
          <p>
            {props.payoff.mainTension.rivalArgument} The comparison shows the
            authored expectations on the dimensions where these readings
            disagree most and your raw scale position on each dimension.
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
      title: "The exact terms in the family comparison",
      copy: (
        <>
          <p>
            Each row is one term in the live scorer&apos;s {props.primaryLabel}
            minus {props.runnerUpLabel} comparison. A positive term adds to
            the first reading&apos;s score relative to the second. A negative
            term subtracts from it.
          </p>
          <p>
            This calculation uses the calibration registered for the exact
            completed form. It does not treat distance from the raw scale
            midpoint as classification evidence.
          </p>
        </>
      ),
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
      title: "Where this reading sits in the registered matrix",
      copy: (
        <>
          <p>
            The Foundation registers eight reference readings across four
            modeled traditions and two restraint postures. The highlighted
            cells show the leading family and its nearest alternative at the
            posture resolved from this result.
          </p>
          <p>
            The matrix is a reference system. It does not rank people or
            assign a population category.
          </p>
        </>
      ),
      visualLabel: "Eight registered Foundation readings",
      renderVisual: () => (
        <ArchetypeMatrix primaryCode={primaryCode} runnerCode={runnerCode} />
      ),
    },
    {
      id: "evidence",
      number: "04",
      title: "The submitted choices that can be shown here",
      copy: (
        <>
          <p>
            A result generated in this browser can keep up to three derived
            evidence records from the exact submitted answer set. The result
            URL does not contain those records or the underlying answers.
          </p>
          <p>
            Shared, legacy, deleted, and tuple-mismatched records remain
            unavailable. The page does not reconstruct evidence from the
            dimension scores alone.
          </p>
        </>
      ),
      visualLabel: "Local decisive-choice evidence",
      renderVisual: () => <FoundationLocalEvidence payload={props.payload} />,
    },
    {
      id: "domains",
      number: "05",
      title: "Domain inventories remain separate records",
      copy: (
        <>
          <p>
            Security, Technology, and AI Governance ask narrower questions
            on their own scales. A similar label or number does not create a
            reviewed relationship with this Foundation result.
          </p>
          <p>
            The cards report only what is saved on this device. Profile keeps
            completed domain inventories beside the Foundation without
            averaging them into a master score.
          </p>
        </>
      ),
      visualLabel: "Records saved on this device",
      renderVisual: () => <FoundationDomainRecords />,
    },
    {
      id: "case",
      number: "06",
      title: "Test the reading against a reviewed case",
      copy: (
        <>
          <p>
            A case can reveal which consideration takes priority when the
            baseline leaves a tension unresolved. The evidence window and
            rival interpretation remain part of the case record.
          </p>
          <p>
            This is a pressure test for the reading. The case does not prove
            that the registered name is a lasting identity.
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
      title: "The limits stay attached to the result",
      copy: (
        <>
          <p>
            This inventory compares answers with four authored tradition
            profiles. It makes no reliability, validity, or population claim,
            and it does not establish a durable personal trait.
          </p>
          <p>
            The public method describes the Foundation robustness diagnostic,
            including its constructed inputs and greater sensitivity near
            family and blend boundaries. The repository carries the exact
            methods and diagnostic data.
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
      ref={storyRef}
      className={styles.story}
      data-foundation-result-story
    >
      <header className={styles.hero} aria-labelledby="foundation-result-heading">
        <div className={styles.heroCopy}>
          <p className={styles.sectionLabel}>{heading.eyebrow}</p>
          <h1 id="foundation-result-heading" className={styles.headline}>
            {heading.title}
          </h1>
          <p className={styles.lead}>{heading.lead}</p>

          <div className={styles.payoff} aria-label="Immediate result payoff">
            <p className={styles.payoffItem}>
              <strong>Your first read of a case</strong>
              {props.payoff.corePattern.noticeFirst}
            </p>
            <p className={styles.payoffItem}>
              <strong>The unresolved question</strong>
              {props.payoff.mainTension.body}
            </p>
          </div>

          {!props.legacy && props.lowDifferentiation && props.resultTier === "core" ? (
            <div className={`${styles.targetedAction} print-hidden`}>
              <Link href={props.nextAction.href} className="cta-primary">
                {props.nextAction.label}
              </Link>
              <p>{props.nextAction.reason}</p>
            </div>
          ) : null}
        </div>

        <aside className={styles.identity} aria-label="Registered reading">
          {markPrimaryCode ? (
            <FoundationMark
              code={props.archetype.code as BlendArchetype["code"]}
              primaryCode={markPrimaryCode}
              presentation="hero"
              className={styles.mark}
            />
          ) : (
            <FoundationMark
              code={props.archetype.code as PureArchetypeCode}
              presentation="hero"
              className={styles.mark}
            />
          )}
          <div className={styles.registered}>
            <p className={styles.registeredLabel}>Registered reading</p>
            <p className={styles.registeredName}>{props.archetype.name}</p>
            <p className={styles.registeredCode} aria-label={props.archetypeCodeSpeech}>
              {props.archetypeCode}
            </p>
            <p className={styles.registeredKey}>{props.archetypeCodeKey}</p>
          </div>
        </aside>
      </header>

      <div className={styles.storyBody}>
        <div className={styles.chapters}>
          {chapters.map((chapter) => (
            <StoryChapter key={chapter.id} {...chapter} />
          ))}
        </div>

        <aside
          className={styles.stickyRegion}
          data-foundation-sticky-region
          aria-label="Chapter visual"
        >
          {chapters.map((chapter) => (
            <div
              key={chapter.id}
              className={styles.stickyPanel}
              data-active={activeChapter === chapter.id ? "true" : "false"}
            >
              <p className={styles.visualLabel}>{chapter.visualLabel}</p>
              {chapter.renderVisual()}
            </div>
          ))}
        </aside>
      </div>

      <footer className={styles.footer}>
        <div>
          <p className={styles.sectionLabel}>Continue from this result</p>
          <h2>Open the next record or read the comparison more closely.</h2>
        </div>
        <div className={`${styles.actions} print-hidden`}>
          <Link href={props.nextAction.href} className="cta-primary">
            {props.nextAction.label}
          </Link>
          <Link href="/profile" className="cta-secondary">
            View Profile
          </Link>
          <Link href="/perspectives" className="cta-secondary">
            Open Perspective Runs
          </Link>
          <Link href="/modules" className="cta-secondary">
            Open domain inventories
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
      className={styles.chapter}
      aria-labelledby={headingId}
      data-foundation-story-chapter={id}
    >
      <div className={styles.chapterCopy}>
        <p className={styles.chapterNumber}>Chapter {number}</p>
        <h2 id={headingId} className={styles.chapterTitle}>{title}</h2>
        {copy}
      </div>
      <div className={styles.inlineVisual}>
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
        Exact contribution terms are unavailable for this issued legacy
        payload. Reconstructing them would require an exact completed-form
        tuple that the link does not carry.
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
