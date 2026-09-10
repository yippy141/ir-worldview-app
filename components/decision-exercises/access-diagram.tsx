import { useState } from "react"
import type { Decision, Episode } from "@/lib/decision-exercises/content"
import { accessPresentation, enclaveRights } from "@/lib/decision-exercises/access-presentation"
import styles from "./access-experience.module.css"

export function AccessDiagram({ episode, optionId, replay, submitted = false }: { episode: Episode; optionId: string; replay: boolean; submitted?: boolean }) {
  const view = accessPresentation(episode, optionId, replay)
  return <figure className={styles.diagram} data-arrangement={view.arrangement} data-condition={replay ? "changed" : "original"}>
    <figcaption>{view.arrangement === "proposed" ? view.label : `${submitted ? "Submitted" : "Considering"}: ${view.label}`}</figcaption>
    {view.arrangement === "defer" ? <p className={styles.withheld}>More information or revised terms are needed. No access arrangement has been selected.</p> : view.enclave ? <>
      <div className={styles.authorities}>
        <div data-active={!replay}><strong>Independent panel</strong><span>{replay ? "No final admission decision" : "Final admission decision"}</span></div>
        <div data-active={replay}><strong>Larch</strong><span>Developer · model owner</span></div>
      </div>
      <svg className={styles.authorityLines} viewBox="0 0 400 52" aria-hidden="true">
        <path data-authority-edge="independent" data-active={!replay} d="M100 0 L100 22 L200 22 L200 48 M194 40 L200 48 L206 40" />
        <path data-authority-edge="developer" data-active={replay} d="M300 0 L300 22 L200 22 L200 48 M194 40 L200 48 L206 40" />
      </svg>
      <div className={styles.gate} data-admissions={view.authority}>
        <strong>{replay ? "Larch controls admission" : "Independent panel controls admission"}</strong>
        <span>{replay ? "Developer may veto a qualified applicant" : "No developer veto"}</span>
      </div>
      <div className={styles.route}><span>Qualified outside evaluators, once admitted</span><svg viewBox="0 0 24 34" aria-hidden="true"><path d="M12 0 L12 30 M5 23 L12 30 L19 23" /></svg></div>
      <div className={styles.boundary} data-fixed-rights>
        <strong>Secure research enclave</strong>
        <p>{enclaveRights.observation}</p>
        <span>Raw weights stay inside this boundary</span>
      </div>
      <div className={styles.route} data-publication-route><svg viewBox="0 0 24 34" aria-hidden="true"><path d="M12 0 L12 30 M5 23 L12 30 L19 23" /></svg><strong>Approved findings out · criticism may be published</strong></div>
      <p className={styles.fixed}>Fixed rights for admitted teams: research and publication stay the same in both decisions.</p>
      <p className={styles.fixed}>General access remains a monitored hosted service.</p>
    </> : <>
      <div className={styles.singleNode}><strong>Larch Research Institute</strong><span>Developer · model owner</span></div>
      <div className={styles.route}><span>{episode.options.find(option => option.id === optionId)!.diagram[1]}</span><svg viewBox="0 0 24 34" aria-hidden="true"><path d="M12 0 L12 30 M5 23 L12 30 L19 23" /></svg></div>
      <div className={styles.boundary}>
        <strong>{view.arrangement === "weights" ? "Anyone can run or modify" : "Hosted-service users"}</strong>
        <p>{view.arrangement === "weights" ? "Copies leave Larch and cannot be recalled." : "Queries and outputs only. Deeper evaluation stays inside Larch."}</p>
      </div>
      <p className={styles.fixed}>The enclave admission provision does not govern this arrangement. These rights stay the same in the replay.</p>
    </>}
    <p className={styles.caption}>{view.enclave && <>Solid line: final admission authority. Dashed line: no final admission authority.<br /></>}Fictional arrangement{view.arrangement === "proposed" ? " · No choice selected" : submitted ? " · Submitted choice" : " · Not yet submitted"}</p>
  </figure>
}

export function AccessSubmittedDiagram({ episode, first, second }: { episode: Episode; first: Decision; second: Decision }) {
  const [original, setOriginal] = useState(false)
  return <div>
    <div className={styles.inspectControls} role="group" aria-label="Inspect your submitted arrangements">
      <button type="button" aria-pressed={original} onClick={() => setOriginal(true)}>Original provision</button>
      <button type="button" aria-pressed={!original} onClick={() => setOriginal(false)}>Changed provision</button>
    </div>
    <p className={styles.inspectionNote}>Inspect either submission. These controls do not edit your decisions.</p>
    <p className={styles.inspectionNote} aria-live="polite">{original ? episode.condition.before : episode.condition.after}</p>
    <AccessDiagram episode={episode} optionId={original ? first.option : second.option} replay={!original} submitted />
  </div>
}
