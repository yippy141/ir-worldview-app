"use client"

import Link from "next/link"
import { useLocale } from "next-intl"
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type SyntheticEvent,
} from "react"
import { CurrentCaseResultSharing } from "@/components/current-case/current-case-result-sharing"
import { trackProductEvent } from "@/lib/analytics/adapter"
import { getAtlasLitePattern, getAtlasPatternHref } from "@/lib/atlas-lite"
import { compareCompletedCaseWithFoundation } from "@/lib/current-cases/profile-connection"
import {
  CURRENT_CASE_CONFIDENCE_LABELS,
  describeCurrentCaseMovement,
  getCurrentCaseOption,
  type CurrentCasePublicRecord,
} from "@/lib/current-cases/presentation"
import {
  getCurrentCaseDraft,
  getLatestCurrentCaseResponse,
  isDraftForCurrentCase,
  isResponseForCurrentCase,
  loadCurrentCaseResponseStore,
  recordCompletedCurrentCaseResponse,
  recordCurrentCaseDraft,
} from "@/lib/current-cases/response-store"
import type {
  CompletedCurrentCaseResponse,
  CurrentCaseConfidence,
  CurrentCaseDraft,
  CurrentCaseStepId,
} from "@/lib/current-cases/types"
import { loadProfileStore, type FoundationSnapshot } from "@/lib/profile-store"
import { completionProvenance } from "@/lib/locale-provenance"
import type { Locale } from "@/i18n/routing"
import styles from "./current-case.module.css"

const FLOW_STEPS: Array<{ id: CurrentCaseStepId; label: string }> = [
  { id: "brief", label: "Brief" },
  { id: "initial", label: "First judgment" },
  { id: "reasoning", label: "Reasoning" },
  { id: "readings", label: "Worldview readings" },
  { id: "challenge", label: "Assumption challenge" },
  { id: "final", label: "Final judgment" },
  { id: "result", label: "Movement" },
]

export function CurrentCaseApp({ record }: { record: CurrentCasePublicRecord }) {
  const locale = useLocale() as Locale
  const [draft, setDraft] = useState<CurrentCaseDraft>(() => initialDraft(record))
  const [completed, setCompleted] = useState<CompletedCurrentCaseResponse | null>(null)
  const [foundation, setFoundation] = useState<FoundationSnapshot | null>(null)
  const [ready, setReady] = useState(false)
  const [resumed, setResumed] = useState(false)
  const [storageError, setStorageError] = useState(false)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const shouldFocusHeading = useRef(false)
  const viewedCaseId = useRef<string | null>(null)
  const startTracked = useRef(false)
  const challengeTracked = useRef(false)

  useEffect(() => {
    const store = loadCurrentCaseResponseStore()
    const savedDraft = getCurrentCaseDraft(store, record.id)
    const savedResponse = getLatestCurrentCaseResponse(store, record.id)
    const savedFoundation = loadProfileStore(locale).foundation
    let cancelled = false

    queueMicrotask(() => {
      if (cancelled) return
      if (savedDraft && isDraftForCurrentCase(savedDraft, record)) {
        setDraft(savedDraft)
        setResumed(savedDraft.step !== "brief")
      } else if (savedResponse && isResponseForCurrentCase(savedResponse, record)) {
        setCompleted(savedResponse)
        setDraft(draftFromResponse(record, savedResponse))
      }

      setFoundation(savedFoundation)
      setReady(true)
    })

    return () => {
      cancelled = true
    }
  }, [locale, record])

  useEffect(() => {
    if (!ready || draft.step === "result") return
    const saved = recordCurrentCaseDraft({
      ...draft,
      updatedAt: new Date().toISOString(),
    })
    if (!saved) window.setTimeout(() => setStorageError(true), 0)
  }, [draft, ready])

  useEffect(() => {
    if (!ready || viewedCaseId.current === record.id) return
    viewedCaseId.current = record.id
    trackProductEvent("current_case_viewed", { caseId: record.id })
  }, [ready, record.id])

  useEffect(() => {
    if (!shouldFocusHeading.current) return
    shouldFocusHeading.current = false
    headingRef.current?.focus()
  }, [draft.step])

  const stepIndex = FLOW_STEPS.findIndex((step) => step.id === draft.step)
  const movement = completed ? describeCurrentCaseMovement(record, completed) : null
  const foundationConnection = useMemo(
    () =>
      completed
        ? compareCompletedCaseWithFoundation(record, completed, foundation)
        : null,
    [completed, foundation, record],
  )

  function updateDraft(patch: Partial<CurrentCaseDraft>) {
    setDraft((current) => ({
      ...current,
      ...patch,
      updatedAt: new Date().toISOString(),
    }))
  }

  function goTo(step: CurrentCaseStepId) {
    shouldFocusHeading.current = true
    updateDraft({ step })
  }

  function openReading(profileId: string, event: SyntheticEvent<HTMLDetailsElement>) {
    if (!event.currentTarget.open) return
    trackProductEvent("reading_opened", { caseId: record.id })
    updateDraft({
      openedReadingProfileIds: Array.from(
        new Set([...draft.openedReadingProfileIds, profileId]),
      ),
    })
  }

  function completeCase() {
    if (
      !draft.initialOptionId ||
      !draft.initialConfidence ||
      !draft.finalOptionId ||
      !draft.finalConfidence ||
      !draft.challengeResponseId
    ) {
      return
    }

    const response: CompletedCurrentCaseResponse = {
      caseId: record.id,
      caseSlug: record.slug,
      caseVersion: record.version,
      initialOptionId: draft.initialOptionId,
      initialConfidence: draft.initialConfidence,
      selectedOptionId: draft.finalOptionId,
      confidence: draft.finalConfidence,
      reasoningTagIds: draft.reasoningTagIds,
      ...(draft.legacyReasoningTagLabels
        ? { legacyReasoningTagLabels: draft.legacyReasoningTagLabels }
        : {}),
      challengeResponseId: draft.challengeResponseId,
      openedReadingProfileIds: draft.openedReadingProfileIds,
      completedAt: new Date().toISOString(),
      ...completionProvenance("currentCase", locale),
    }

    if (!recordCompletedCurrentCaseResponse(response)) setStorageError(true)
    trackProductEvent("current_case_completed", { caseId: record.id })
    setCompleted(response)
    setResumed(false)
    shouldFocusHeading.current = true
    setDraft((current) => ({ ...current, step: "result" }))
  }

  function restartCase() {
    setCompleted(null)
    setResumed(false)
    startTracked.current = false
    challengeTracked.current = false
    shouldFocusHeading.current = true
    setDraft({ ...initialDraft(record), step: "brief", updatedAt: new Date().toISOString() })
  }

  function startCase() {
    if (!startTracked.current) {
      startTracked.current = true
      trackProductEvent("current_case_started", { caseId: record.id })
    }
    goTo("initial")
  }

  function openChallenge() {
    if (!challengeTracked.current) {
      challengeTracked.current = true
      trackProductEvent("challenge_opened", { caseId: record.id })
    }
    goTo("challenge")
  }

  if (!ready) {
    return (
      <section className={styles.loading} aria-busy="true" aria-live="polite">
        Checking this browser for saved progress…
      </section>
    )
  }

  return (
    <section className={styles.experience} aria-label="Current Case judgment flow">
      <div className={styles.progressHeader}>
        <p className={styles.progressText} aria-live="polite">
          Step {stepIndex + 1} of {FLOW_STEPS.length} · {FLOW_STEPS[stepIndex]?.label}
        </p>
        <progress
          className={styles.progress}
          value={stepIndex + 1}
          max={FLOW_STEPS.length}
          aria-label={`Current Case progress: step ${stepIndex + 1} of ${FLOW_STEPS.length}`}
        />
        {resumed ? (
          <p className={styles.resumeNote} role="status">
            Draft restored from this browser.
          </p>
        ) : null}
      </div>

      {draft.step === "brief" ? (
        <section className={styles.flowSection} aria-labelledby="case-brief-heading">
          <h2 ref={headingRef} tabIndex={-1} id="case-brief-heading">
            The case
          </h2>
          <div className={styles.briefing}>
            {record.briefing.split("\n\n").map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          <dl className={styles.caseFacts}>
            <div>
              <dt>Actors</dt>
              <dd>{record.actors.join(", ")}</dd>
            </div>
            <div>
              <dt>Evidence</dt>
              <dd>
                {record.factualClaims.length} factual claims · {record.sources.length} direct sources
              </dd>
            </div>
          </dl>
          <details className={styles.uncertainties}>
            <summary>Known uncertainties</summary>
            <ul>
              {record.knownUncertainties.map((uncertainty) => (
                <li key={uncertainty}>{uncertainty}</li>
              ))}
            </ul>
          </details>
          <p className={styles.sourceRoute}>
            <Link href={`/cases/${record.slug}/sources`}>Read the claim and source ledger</Link>
          </p>
          <FlowActions
            primaryLabel="Make your first judgment"
            onPrimary={startCase}
          />
        </section>
      ) : null}

      {draft.step === "initial" ? (
        <section className={styles.flowSection} aria-labelledby="initial-judgment-heading">
          <h2 ref={headingRef} tabIndex={-1} id="initial-judgment-heading">
            Your first judgment
          </h2>
          <p className={styles.sectionLead}>{record.decision.prompt}</p>
          <OptionField
            name="initial-option"
            legend="Choose one course"
            record={record}
            value={draft.initialOptionId}
            onChange={(initialOptionId) => updateDraft({ initialOptionId })}
          />
          <ConfidenceField
            name="initial-confidence"
            legend="How confident are you in this first judgment?"
            value={draft.initialConfidence}
            onChange={(initialConfidence) => updateDraft({ initialConfidence })}
          />
          <FlowActions
            backLabel="Back to brief"
            onBack={() => goTo("brief")}
            primaryLabel="Continue"
            primaryDisabled={!draft.initialOptionId || !draft.initialConfidence}
            onPrimary={() => goTo("reasoning")}
          />
        </section>
      ) : null}

      {draft.step === "reasoning" ? (
        <section className={styles.flowSection} aria-labelledby="reasoning-heading">
          <h2 ref={headingRef} tabIndex={-1} id="reasoning-heading">
            What is carrying your judgment?
          </h2>
          <p className={styles.sectionLead}>
            Add any reasons that mattered. This step is optional and does not change a score.
          </p>
          <fieldset className={styles.tagFieldset}>
            <legend className="sr-only">Optional reasoning tags</legend>
            <div className={styles.tags}>
              {record.reasoningTags.map((tag) => {
                const checked = draft.reasoningTagIds.includes(tag.id)
                return (
                  <label key={tag.id} className={styles.tag}>
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() =>
                        updateDraft({
                          reasoningTagIds: checked
                            ? draft.reasoningTagIds.filter(
                                (candidate) => candidate !== tag.id,
                              )
                            : [...draft.reasoningTagIds, tag.id],
                        })
                      }
                    />
                    <span>{tag.label}</span>
                  </label>
                )
              })}
            </div>
          </fieldset>
          <FlowActions
            backLabel="Back"
            onBack={() => goTo("initial")}
            primaryLabel="See the worldview readings"
            onPrimary={() => goTo("readings")}
          />
        </section>
      ) : null}

      {draft.step === "readings" ? (
        <section className={styles.flowSection} aria-labelledby="readings-heading">
          <h2 ref={headingRef} tabIndex={-1} id="readings-heading">
            Four ways to read the same case
          </h2>
          <p className={styles.sectionLead}>
            Each reading emphasizes a different cause and policy risk. Open any that challenge the
            reasons behind your first judgment.
          </p>
          <div className={styles.readingList}>
            {record.worldviewReadings.map((reading) => {
              const profile = getAtlasLitePattern(reading.profileId)
              return (
                <details
                  key={reading.profileId}
                  className={styles.reading}
                  onToggle={(event) => openReading(reading.profileId, event)}
                >
                  <summary>
                    <span className={styles.readingName}>
                      {profile?.publicName ?? reading.profileId}
                    </span>
                    <span className={styles.readingNotice}>{reading.noticesFirst}</span>
                  </summary>
                  <div className={styles.readingBody}>
                    {profile ? (
                      <p className={styles.readingDescriptor}>
                        {profile.technicalDescriptor} ·{" "}
                        <Link href={getAtlasPatternHref(profile.id)}>Open worldview profile</Link>
                      </p>
                    ) : null}
                    <dl>
                      <div>
                        <dt>How it reads the case</dt>
                        <dd>{reading.interpretation}</dd>
                      </div>
                      <div>
                        <dt>Likely move</dt>
                        <dd>{reading.recommendation}</dd>
                      </div>
                      <div>
                        <dt>Strongest objection</dt>
                        <dd>{reading.strongestObjection}</dd>
                      </div>
                      <div>
                        <dt>What would update it</dt>
                        <dd>{reading.updateCondition}</dd>
                      </div>
                    </dl>
                  </div>
                </details>
              )
            })}
          </div>
          <FlowActions
            backLabel="Back"
            onBack={() => goTo("reasoning")}
            primaryLabel="Test an assumption"
            onPrimary={openChallenge}
          />
        </section>
      ) : null}

      {draft.step === "challenge" ? (
        <section className={styles.flowSection} aria-labelledby="challenge-heading">
          <h2 ref={headingRef} tabIndex={-1} id="challenge-heading">
            One assumption changes
          </h2>
          <p className={styles.challenge}>{record.assumptionChallenge.newInformation}</p>
          <fieldset className={styles.challengeFieldset}>
            <legend>{record.assumptionChallenge.prompt}</legend>
            <div className={styles.compactOptions}>
              {record.assumptionChallenge.options.map((option) => (
                <label key={option.id}>
                  <input
                    type="radio"
                    name="assumption-challenge"
                    value={option.id}
                    checked={draft.challengeResponseId === option.id}
                    onChange={() => updateDraft({ challengeResponseId: option.id })}
                  />
                  <span>{option.label}</span>
                </label>
              ))}
            </div>
          </fieldset>
          <FlowActions
            backLabel="Back to readings"
            onBack={() => goTo("readings")}
            primaryLabel="Make your final judgment"
            primaryDisabled={!draft.challengeResponseId}
            onPrimary={() => {
              updateDraft({
                step: "final",
                finalOptionId: draft.finalOptionId ?? draft.initialOptionId,
                finalConfidence: draft.finalConfidence ?? draft.initialConfidence,
              })
              shouldFocusHeading.current = true
            }}
          />
        </section>
      ) : null}

      {draft.step === "final" ? (
        <section className={styles.flowSection} aria-labelledby="final-judgment-heading">
          <h2 ref={headingRef} tabIndex={-1} id="final-judgment-heading">
            Your final judgment
          </h2>
          <p className={styles.sectionLead}>{record.decision.prompt}</p>
          {draft.initialOptionId ? (
            <p className={styles.initialReminder}>
              First choice: {getCurrentCaseOption(record, draft.initialOptionId)?.label}
            </p>
          ) : null}
          <OptionField
            name="final-option"
            legend="Choose your final course"
            record={record}
            value={draft.finalOptionId}
            onChange={(finalOptionId) => updateDraft({ finalOptionId })}
          />
          <ConfidenceField
            name="final-confidence"
            legend="How confident are you now?"
            value={draft.finalConfidence}
            onChange={(finalConfidence) => updateDraft({ finalConfidence })}
          />
          <FlowActions
            backLabel="Back to challenge"
            onBack={() => goTo("challenge")}
            primaryLabel="See what moved"
            primaryDisabled={!draft.finalOptionId || !draft.finalConfidence}
            onPrimary={completeCase}
          />
        </section>
      ) : null}

      {draft.step === "result" && completed && movement ? (
        <section className={styles.flowSection} aria-labelledby="movement-heading">
          <h2 ref={headingRef} tabIndex={-1} id="movement-heading">
            What moved
          </h2>
          <p className={styles.movement}>{movement}</p>

          <div className={styles.resultRows}>
            <div>
              <h3>Assumption response</h3>
              <p>
                {
                  record.assumptionChallenge.options.find(
                    (option) => option.id === completed.challengeResponseId,
                  )?.label
                }
              </p>
            </div>
            <div>
              <h3>Reasons you marked</h3>
              {completed.reasoningTagIds.length > 0 ? (
                <ul className={styles.resultTags} aria-label="Saved reasoning tags">
                  {completed.reasoningTagIds.map((tagId) => (
                    <li key={tagId}>{reasoningTagLabel(record, completed, tagId)}</li>
                  ))}
                </ul>
              ) : (
                <p>No reasoning tags were added.</p>
              )}
            </div>
          </div>

          {foundationConnection ? (
            <section className={styles.foundationComparison} aria-labelledby="foundation-compare-heading">
              <p className={styles.comparisonLabel}>{connectionLabel(foundationConnection.kind)}</p>
              <h3 id="foundation-compare-heading">Compared with your Foundation</h3>
              <p>{foundationConnection.summary}</p>
              {foundationConnection.foundationPatternId ? (
                <Link href={getAtlasPatternHref(foundationConnection.foundationPatternId)}>
                  Read {foundationConnection.foundationPatternLabel}
                </Link>
              ) : (
                <Link href="/quiz">Take the Foundation</Link>
              )}
            </section>
          ) : null}

          {getCurrentCaseOption(record, completed.selectedOptionId) ? (
            <CurrentCaseResultSharing
              record={{ id: record.id, slug: record.slug, title: record.title }}
              response={completed}
              selectedOption={getCurrentCaseOption(record, completed.selectedOptionId)!}
            />
          ) : null}

          <nav className={styles.nextRoutes} aria-labelledby="next-routes-heading">
            <h3 id="next-routes-heading">Compare this judgment elsewhere</h3>
            <ul>
              {record.nextRoutes.map((route) => (
                <li key={route.href}>
                  <Link href={route.href}>{route.label}</Link>
                  <p>{route.reason}</p>
                </li>
              ))}
            </ul>
          </nav>

          <nav className={styles.documentLinks} aria-label="Case documentation">
            <Link href={`/cases/${record.slug}/sources`}>Sources and claim coverage</Link>
            <Link href={`/cases/${record.slug}/corrections`}>Corrections and updates</Link>
          </nav>

          <div className={styles.resultActions}>
            <button type="button" className={styles.secondaryButton} onClick={restartCase}>
              Revisit this judgment
            </button>
            <Link href="/profile" className={styles.primaryLink}>
              View current judgments in My Profile
            </Link>
          </div>
        </section>
      ) : null}

      <div className={styles.storageStatus} aria-live="polite">
        {storageError
          ? "This browser could not save progress. You can continue in this tab."
          : draft.step === "result"
            ? "Judgment saved on this device."
            : "Progress saves on this device as you move between steps."}
      </div>
    </section>
  )
}

function OptionField({
  name,
  legend,
  record,
  value,
  onChange,
}: {
  name: string
  legend: string
  record: CurrentCasePublicRecord
  value?: string
  onChange: (optionId: string) => void
}) {
  return (
    <fieldset className={styles.optionFieldset}>
      <legend>{legend}</legend>
      <div className={styles.optionList}>
        {record.decision.options.map((option) => (
          <label key={option.id} className={styles.option}>
            <input
              type="radio"
              name={name}
              value={option.id}
              checked={value === option.id}
              onChange={() => onChange(option.id)}
            />
            <span className={styles.optionCopy}>
              <strong>{option.label}</strong>
              <span>{option.logic}</span>
              <small>Tradeoff: {option.acceptedTradeoff}</small>
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  )
}

function ConfidenceField({
  name,
  legend,
  value,
  onChange,
}: {
  name: string
  legend: string
  value?: CurrentCaseConfidence
  onChange: (confidence: CurrentCaseConfidence) => void
}) {
  const values = [1, 2, 3, 4, 5] as const
  return (
    <fieldset className={styles.confidenceFieldset}>
      <legend>{legend}</legend>
      <div className={styles.confidenceScale}>
        {values.map((confidence) => (
          <label key={confidence}>
            <input
              type="radio"
              name={name}
              value={confidence}
              checked={value === confidence}
              onChange={() => onChange(confidence)}
            />
            <span aria-hidden="true">{confidence}</span>
            <small>{CURRENT_CASE_CONFIDENCE_LABELS[confidence]}</small>
          </label>
        ))}
      </div>
    </fieldset>
  )
}

function FlowActions({
  backLabel,
  onBack,
  primaryLabel,
  primaryDisabled = false,
  onPrimary,
}: {
  backLabel?: string
  onBack?: () => void
  primaryLabel: string
  primaryDisabled?: boolean
  onPrimary: () => void
}) {
  return (
    <div className={styles.flowActions}>
      {backLabel && onBack ? (
        <button type="button" className={styles.backButton} onClick={onBack}>
          {backLabel}
        </button>
      ) : (
        <span />
      )}
      <button
        type="button"
        className={styles.primaryButton}
        disabled={primaryDisabled}
        onClick={onPrimary}
      >
        {primaryLabel}
      </button>
    </div>
  )
}

function initialDraft(record: CurrentCasePublicRecord): CurrentCaseDraft {
  return {
    caseId: record.id,
    caseSlug: record.slug,
    caseVersion: record.version,
    step: "brief",
    reasoningTagIds: [],
    openedReadingProfileIds: [],
    updatedAt: "1970-01-01T00:00:00.000Z",
  }
}

function draftFromResponse(
  record: CurrentCasePublicRecord,
  response: CompletedCurrentCaseResponse,
): CurrentCaseDraft {
  return {
    caseId: record.id,
    caseSlug: record.slug,
    caseVersion: record.version,
    step: "result",
    initialOptionId: response.initialOptionId,
    initialConfidence: response.initialConfidence,
    reasoningTagIds: response.reasoningTagIds,
    ...(response.legacyReasoningTagLabels
      ? { legacyReasoningTagLabels: response.legacyReasoningTagLabels }
      : {}),
    challengeResponseId: response.challengeResponseId,
    openedReadingProfileIds: response.openedReadingProfileIds,
    finalOptionId: response.selectedOptionId,
    finalConfidence: response.confidence,
    updatedAt: response.completedAt,
  }
}

function reasoningTagLabel(
  record: CurrentCasePublicRecord,
  response: CompletedCurrentCaseResponse,
  tagId: string,
) {
  return record.reasoningTags.find((tag) => tag.id === tagId)?.label ??
    response.legacyReasoningTagLabels?.[tagId] ??
    tagId
}

function connectionLabel(kind: "consistent" | "tension" | "not-covered" | "unavailable") {
  if (kind === "consistent") return "Baseline echo"
  if (kind === "tension") return "Contextual tension"
  if (kind === "not-covered") return "Coverage limit"
  return "Foundation comparison"
}
