"use client"

import { useEffect, useState } from "react"
import type { Locale } from "@/i18n/routing"
import {
  consumeFoundationEvidenceHandoff,
  foundationPayloadDigest,
  lookupFoundationLocalEvidence,
  type FoundationEvidenceHandoff,
  type FoundationLocalEvidenceLookup,
} from "@/lib/results/local-evidence"
import styles from "./foundation-local-evidence.module.css"

const HISTORY_STATE_KEY = "irFoundationEvidenceBindingV1"

type LoadState = FoundationLocalEvidenceLookup | { status: "checking" }

export function FoundationLocalEvidence({
  payload,
  locale = "en",
}: {
  payload: string
  locale?: Locale
}) {
  const [state, setState] = useState<LoadState>({ status: "checking" })

  useEffect(() => {
    let cancelled = false

    void foundationPayloadDigest(payload)
      .then((payloadDigest) => {
        if (cancelled) return
        if (!payloadDigest) {
          setState({ status: "unavailable", reason: "legacy" })
          return
        }

        const historyHandoff = readHistoryHandoff(payloadDigest)
        const handoff = historyHandoff ?? consumeFoundationEvidenceHandoff(
          window.sessionStorage,
          payloadDigest,
        )
        if (handoff && !historyHandoff) {
          window.history.replaceState(
            { ...window.history.state, [HISTORY_STATE_KEY]: handoff },
            "",
            window.location.href,
          )
        }
        setState(
          lookupFoundationLocalEvidence(
            window.localStorage,
            payload,
            payloadDigest,
            handoff,
            locale,
          ),
        )
      })
      .catch(() => {
        if (!cancelled) {
          setState({ status: "unavailable", reason: "no-local-binding" })
        }
      })

    return () => {
      cancelled = true
    }
  }, [locale, payload])

  const copy = locale === "zh-Hans" ? zhCopy : enCopy

  if (state.status === "checking") {
    return (
      <section className={styles.section} data-local-evidence-status="checking">
        <p className={styles.eyebrow}>{copy.eyebrow}</p>
        <h2>{copy.title}</h2>
        <p>{copy.checking}</p>
      </section>
    )
  }

  if (state.status === "unavailable") {
    return (
      <section className={styles.section} data-local-evidence-status={state.reason}>
        <p className={styles.eyebrow}>{copy.eyebrow}</p>
        <h2>{copy.unavailableTitle}</h2>
        <p>{copy.unavailable[state.reason]}</p>
      </section>
    )
  }

  return (
    <section className={styles.section} data-local-evidence-status="available">
      <p className={styles.eyebrow}>{copy.eyebrow}</p>
      <h2>{copy.title}</h2>
      <p>{copy.intro}</p>
      <ol className={styles.records}>
        {state.evidence.records.map((record) => (
          <li key={record.itemId} className={styles.record}>
            <h3>{record.prompt}</h3>
            <dl className={styles.comparison}>
              <div>
                <dt>{copy.yourChoice}</dt>
                <dd>
                  {record.selectedTitle ? <strong>{record.selectedTitle}. </strong> : null}
                  {record.selectedLabel}
                </dd>
              </div>
              <div>
                <dt>{copy.alternative[record.alternative.kind]}</dt>
                <dd>
                  {record.alternative.title ? <strong>{record.alternative.title}. </strong> : null}
                  {record.alternative.label}
                </dd>
              </div>
            </dl>
            <p className={styles.explanation}>{record.explanation}</p>
          </li>
        ))}
      </ol>
      <p className={styles.note}>{copy.note}</p>
    </section>
  )
}

function readHistoryHandoff(payloadDigest: string): FoundationEvidenceHandoff | null {
  const value = window.history.state?.[HISTORY_STATE_KEY] as unknown
  if (
    typeof value !== "object" ||
    value === null ||
    !("v" in value) ||
    value.v !== 1 ||
    !("localCompletionId" in value) ||
    typeof value.localCompletionId !== "string" ||
    !("payloadDigest" in value) ||
    value.payloadDigest !== payloadDigest ||
    !("mode" in value) ||
    (value.mode !== "standard" && value.mode !== "analyst")
  ) {
    return null
  }
  return value as FoundationEvidenceHandoff
}

const enCopy = {
  eyebrow: "Local result evidence",
  title: "Choices tied to this result",
  checking: "Checking this browser for an exact completion record.",
  intro:
    "These records were derived when this result was generated. Each comparison reruns the completed form through the same scorer while holding every other submitted answer fixed.",
  yourChoice: "Your choice",
  alternative: {
    "actual-second-choice": "Your recorded second choice",
    "model-selected-nearest-alternative": "Model-selected nearest alternative",
  },
  note:
    "The full answer set was not stored. These records stay on this device and are deleted with the associated local history.",
  unavailableTitle: "Exact local evidence is unavailable",
  unavailable: {
    legacy: "This result predates the current exact-form evidence contract, so item-level evidence cannot be reconstructed.",
    "no-local-binding": "This page has no local completion binding. Shared links carry the result, but they do not carry answers or evidence records.",
    deleted: "The local evidence associated with this completion is no longer available on this device.",
    "tuple-mismatch": "The saved record does not match this result's full scoring and form tuple, so it is not shown.",
    "locale-mismatch": "The local evidence was authored in a different completion language, so this page does not substitute or translate it.",
    "no-records": "No submitted item produced a positive exact counterfactual for the two current readings.",
  },
} as const

const zhCopy = {
  eyebrow: "本地结果依据",
  title: "与本次结果对应的选择",
  checking: "正在核对当前浏览器中是否有与本次完成记录完全一致的本地依据。",
  intro:
    "这些记录在生成结果时推导得出。每项比较都会固定其余已提交答案，并使用同一评分程序重新计算完整题组。",
  yourChoice: "你的选择",
  alternative: {
    "actual-second-choice": "你记录的第二顺位",
    "model-selected-nearest-alternative": "模型选出的最近替代项",
  },
  note: "完整答案不会保存。这些记录只留在当前设备上，并会随相关本地历史一并删除。",
  unavailableTitle: "无法显示精确的本地依据",
  unavailable: {
    legacy: "这份结果早于当前的精确题组依据协议，因此无法还原到具体题目。",
    "no-local-binding": "本页没有对应的本地完成记录。共享链接只包含结果，不包含答案或依据记录。",
    deleted: "当前设备上已没有与本次完成记录关联的本地依据。",
    "tuple-mismatch": "已保存记录与本结果的题组和评分元组不完全一致，因此不会显示。",
    "locale-mismatch": "这份本地依据来自另一种完成语言。本页不会擅自替换或翻译其中的题目与选项。",
    "no-records": "没有任何已提交题目为当前两个读法生成正向的精确反事实依据。",
  },
} as const
