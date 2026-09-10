import type { Episode } from "./content"

/** Presentation of the registered fiction only. No additional policy choices or scoring. */
export const enclaveRights = {
  observation: "Examine and modify the model inside the enclave.",
  publication: "Export approved findings and publish criticism; raw weights stay inside.",
  revocation: "Weights remain inside. Procedures for ending an admitted team's access are not specified.",
} as const

export function accessPresentation(episode: Episode, optionId: string, replay: boolean) {
  const option = episode.options.find(item => item.id === optionId)
  const arrangement = option?.id ?? (optionId === "defer" ? "defer" : "proposed")
  const enclave = arrangement === "enclave" || arrangement === "proposed"
  return {
    arrangement, enclave,
    label: option?.label ?? (arrangement === "defer" ? "Decision withheld" : "Proposed evaluator admissions"),
    admission: enclave ? replay ? "Larch makes final admission decisions; it can veto a qualified applicant." : "An independent panel makes final admission decisions; Larch has no veto." : null,
    authority: enclave ? replay ? "developer" : "independent" : null,
  }
}

export function accessComparisonRows(episode: Episode) {
  return episode.options.map(option => ({
    id: option.id, label: option.label,
    admission: option.id === "weights" ? "Anyone may download; no evaluator admission gate." : option.id === "enclave" ? "Independent panel originally; Larch in the replay." : "Larch provides the monitored, rate-limited service.",
    observation: option.id === "weights" ? "Anyone can examine, modify and run the model." : option.id === "enclave" ? enclaveRights.observation : "Outsiders test outputs; deeper evaluation stays inside Larch.",
    publication: option.id === "enclave" ? enclaveRights.publication : option.id === "weights" ? "Independent work on downloaded weights; no enclave export boundary." : "Outsiders can criticize outputs; no access to model internals.",
    revocation: option.id === "weights" ? "Larch cannot recall released copies or enforce downstream limits." : option.id === "enclave" ? enclaveRights.revocation : "Larch retains the hosted model. Specific termination procedures are not supplied.",
  }))
}
