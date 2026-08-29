"use client"

import Link from "next/link"
import { useMemo, useSyncExternalStore } from "react"
import { formatLocalizedDate } from "@/i18n/format"
import {
  getLocalRecordsServerSnapshot,
  getLocalRecordsSnapshot,
  subscribeLocalRecords,
} from "@/lib/v23-6/local-records"
import {
  buildDecisiveChoiceTrace,
  type DecisiveChoiceTrace,
} from "@/lib/v23-6/decisive-choices"
import type { FamilyKey } from "@/lib/types"
import styles from "./result-scroll.module.css"

type Props = Readonly<{
  expectedArchetypeCode: string
  expectedFamilyKey: FamilyKey
  expectedRunnerUpKey: FamilyKey
}>

type DomainRow = Readonly<{
  key: string
  label: string
  record: string | null
  href: string | null
  savedAt: number | null
}>

/**
 * Two sections that can only be filled by this browser.
 *
 * A saved result link records seven dimension scores and the reading they
 * resolve to. It records no item answers, so the choices behind a shared or
 * legacy result cannot be recovered from it. The server therefore renders the
 * unavailable state, and script replaces it only when this browser holds an
 * unsent Foundation whose answers recompute to the same reading.
 */
export function ResultScrollLocalRecords({
  expectedArchetypeCode,
  expectedFamilyKey,
  expectedRunnerUpKey,
}: Props) {
  const records = useSyncExternalStore(
    subscribeLocalRecords,
    getLocalRecordsSnapshot,
    getLocalRecordsServerSnapshot,
  )
  const trace = useMemo<DecisiveChoiceTrace>(
    () =>
      buildDecisiveChoiceTrace({
        session: records.session,
        expectedArchetypeCode,
        expectedFamilyKey,
        expectedRunnerUpKey,
      }),
    [expectedArchetypeCode, expectedFamilyKey, expectedRunnerUpKey, records.session],
  )
  const store = records.store

  const security = store?.modules.security ?? null
  const technology = store?.modules.technology ?? null
  const ai = store?.aiGovernance ?? null
  const savedFoundation = store?.foundation ?? null

  const domains: DomainRow[] = [
    {
      key: "foundation",
      label: "Foundation",
      record: savedFoundation
        ? `Saved on this device as ${savedFoundation.familyLabel}.`
        : null,
      href: savedFoundation ? savedFoundation.resultPath : "/quiz",
      savedAt: savedFoundation?.timestamp ?? null,
    },
    {
      key: "security",
      label: "Security",
      record: security ? security.headline : null,
      href: security ? security.resultPath : "/modules/security",
      savedAt: security?.timestamp ?? null,
    },
    {
      key: "technology",
      label: "Technology",
      record: technology ? technology.headline : null,
      href: technology ? technology.resultPath : "/modules/technology",
      savedAt: technology?.timestamp ?? null,
    },
    {
      key: "ai-governance",
      label: "AI Governance",
      record: ai ? ai.archetypeLabel : null,
      href: ai ? ai.resultPath : "/ai",
      savedAt: ai?.timestamp ?? null,
    },
  ]

  return (
    <>
      <section
        className={styles.section}
        data-scroll-section="choices"
        data-trace-status={trace.status}
        aria-labelledby="scroll-choices"
      >
        <div className={styles.sectionHead}>
          <h2 id="scroll-choices">Decisive choices</h2>
          <p className={styles.sectionLead}>
            {trace.status === "available"
              ? "These are the scenario items in the Foundation draft stored on this device where the option you took pulled hardest toward this reading and away from its nearest alternative."
              : "This section needs the answers themselves, and a result link does not carry them."}
          </p>
        </div>

        <div className={styles.sectionBody}>
          {trace.status === "available" ? (
            <ol className={styles.choiceList}>
              {trace.choices.map((choice) => (
                <li className={styles.choice} key={choice.questionId}>
                  <p className={styles.choicePrompt}>{choice.prompt}</p>
                  <div className={styles.choiceGrid}>
                    <div data-role="selected">
                      <h3>{choice.selected.title}</h3>
                      <p>{choice.selected.label}</p>
                    </div>
                    <div data-role="rival">
                      <h3>{choice.rival.title}</h3>
                      <p>{choice.rival.label}</p>
                    </div>
                  </div>
                  <p className={styles.footnote}>
                    These two options disagree most on{" "}
                    {choice.reversalDimensionLabel.toLowerCase()}. The one you
                    took reads{" "}
                    {choice.selectedDimensionValue < choice.rivalDimensionValue
                      ? "lower"
                      : "higher"}{" "}
                    on it, so choosing the other would have moved that
                    dimension the other way.
                  </p>
                </li>
              ))}
            </ol>
          ) : null}

          {trace.status === "no-draft" ? (
            <p className={styles.unavailable}>
              A saved result link carries the seven dimension scores and the
              reading they resolve to. It carries no record of which option was
              taken on any item, so the choices behind this reading cannot be
              recovered from the link. Working through the Foundation in this
              browser leaves the answers on this device, and this section fills
              in from them.
            </p>
          ) : null}

          {trace.status === "no-scenario-answers" ? (
            <p className={styles.unavailable}>
              This browser holds Foundation answers, but none of them are on
              the scenario items that offer competing logics. Only those items
              can show one option taken against another.
            </p>
          ) : null}

          {trace.status === "different-reading" ? (
            <p className={styles.unavailable}>
              An unsent Foundation draft on this device resolves to{" "}
              {trace.draftArchetypeName}, closest to {trace.draftFamilyNoun}.
              Those answers did not produce the reading on this page, so using
              them here would attribute choices to a result they did not
              create.
            </p>
          ) : null}
        </div>
      </section>

      <section
        className={styles.section}
        data-scroll-section="domains"
        aria-labelledby="scroll-domains"
      >
        <div className={styles.sectionHead}>
          <h2 id="scroll-domains">Across the four domains</h2>
          <p className={styles.sectionLead}>
            Each domain has its own item bank, its own scoring, and its own
            record. Nothing here adds them together.
          </p>
        </div>

        <div className={styles.sectionBody}>
          <ul className={styles.domainList}>
            {domains.map((domain) => (
              <li className={styles.domainRow} key={domain.key} data-domain={domain.key}>
                <h3>{domain.label}</h3>
                {domain.record ? (
                  <p className={styles.domainRecord}>{domain.record}</p>
                ) : (
                  <p className={styles.domainEmpty}>No record on this device.</p>
                )}
                <p className={styles.domainMeta}>
                  {domain.savedAt ? (
                    <time dateTime={new Date(domain.savedAt).toISOString()}>
                      {formatLocalizedDate(domain.savedAt, "en", "medium")}
                    </time>
                  ) : null}
                  {domain.href ? (
                    <Link href={domain.href}>
                      {domain.record ? "Open the record" : `Open ${domain.label}`}
                    </Link>
                  ) : null}
                </p>
              </li>
            ))}
          </ul>

          <p className={styles.footnote}>
            No combined score is published across these four. No reviewed link
            between a domain axis and a Foundation dimension is published
            either, so a similar-looking pair of results is not evidence that
            the two measure the same thing.
          </p>
        </div>
      </section>
    </>
  )
}
