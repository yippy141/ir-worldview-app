import type { Decision, Episode, EpisodeId } from "./episodes"

// Authored for these two bounded exercises only. No scored construct or free-text inference.
// Every arrangement pair has its own institutional reading; reasons qualify that reading.
const arrangementReadings: Record<EpisodeId, Record<string, string>> = {
  verify: {
    "national>national": "You kept national inspection teams. In the revised draft, that authorizes Belvar to inspect Arden without giving Arden the same right in Belvar.",
    "national>custodian": "You retained an external check while abandoning asymmetric national inspection. The custodian can still visit both sides, but Arden now relies on its delayed summaries instead of inspecting the records itself.",
    "national>national-records": "You moved from foreign inspections to each government's own checks and exchanged declarations. That removes the one-sided national visit, while accepting that false declarations are harder to expose.",
    "custodian>national": "You replaced a custodian that could visit both sides with national rights that now admit only Belvar to Arden. Belvar gains direct access; Arden gives up the custodian's external check on Belvar.",
    "custodian>custodian": "The custodian's access remains reciprocal in both conditions. Keeping it preserves the same external check and delayed summaries; it does not accept one-sided national inspection rights.",
    "custodian>national-records": "You gave up the custodian's visits to both sides in favor of domestic checks and exchanged declarations. The custodian's own access had not changed; the new provision alone does not explain withdrawing that check.",
    "national-records>national": "You replaced domestic checks and exchanged declarations with national inspection rights that admit Belvar to Arden only. The revised arrangement exposes Arden's records without obtaining equivalent access to Belvar.",
    "national-records>custodian": "You added an external check through a custodian still admitted by both sides. Neither your original domestic checks nor the custodian's rights were directly changed by the national-access provision.",
    "national-records>national-records": "You kept domestic checks and exchanged declarations. Neither choice authorizes foreign national visits, so the altered national-access provision does not govern this arrangement. False declarations remain harder to expose.",
  },
  access: {
    "weights>weights": "You kept public weights, whose access does not depend on evaluator admissions. The new veto does not govern this arrangement, and downloaded copies remain beyond Larch's recall.",
    "weights>enclave": "You moved from downloadable weights to a controlled enclave whose admission decisions now belong to Larch. This is a choice between proposed release plans, not a recall of already released weights.",
    "weights>hosted": "You moved from proposed public weights to queries through Larch's service, retaining the model and deeper evaluation inside the institute. Neither arrangement is directly governed by enclave admissions; this is not a recall of released copies.",
    "enclave>weights": "You moved toward access outside the developer's admission control. Anyone could run and modify the released weights, accepting that Larch cannot recall copies or enforce downstream limits.",
    "enclave>enclave": "You kept qualified external evaluation while admission control moved from an independent panel to Larch. Admitted teams retain the same research and publication rights; equally qualified applicants can now be excluded by the developer.",
    "enclave>hosted": "You withdrew support for this form of outside access and retained hosted queries with internal evaluation. Outsiders can still criticize outputs, but lose access to the model's internals. That is not a blanket rejection of outside criticism.",
    "hosted>weights": "You moved from hosted queries to public weights that anyone could examine and modify. Neither plan is governed by enclave admissions. The wider access also accepts that downloaded copies cannot be recalled.",
    "hosted>enclave": "You added qualified access to the model's internals under Larch's admission control. Outsiders gain research and publication rights once admitted, while the developer can reject equally qualified applicants.",
    "hosted>hosted": "You kept hosted queries with internal evaluation. This arrangement never uses enclave admissions, so the new veto does not govern either choice. Outside examination of the model's internals remains unavailable.",
  },
}
const reasonMeanings: Record<EpisodeId, Record<string, string>> = {
  verify: { timely: "timely, first-hand evidence", equal: "reciprocal inspection rights", secrets: "protecting records from foreign governments", reach: "limiting concessions when hidden sites remain unknown" },
  access: { reproduce: "independent reproduction and modification", scrutiny: "criticism the developer cannot veto", contain: "retaining the ability to limit access", capacity: "keeping evaluation work within the institute's capacity" },
}

// These are limits of the supplied arrangements, not judgments that a reader's reason is wrong.
function reasonLimit(id: EpisodeId, choice: Decision, replay: boolean): string | null {
  if (id === "verify") {
    if (choice.reason === "timely" && choice.option === "custodian") return "The custodian supplies delayed summaries, not Arden's own first-hand inspection evidence. What evidence would make this choice sufficient for your stated reason?"
    if (choice.reason === "timely" && choice.option === "national-records") return "Domestic monitoring gives Arden no first-hand inspection of Belvar. What could exchanged declarations establish that would satisfy your stated reason?"
    if (choice.reason === "timely" && choice.option === "national" && replay) return "The revised national rights exclude Arden's teams, so Arden cannot obtain its own first-hand evidence at Belvar's sites. Would you require revised terms?"
    if (choice.reason === "equal" && choice.option === "national" && replay) return "The revised national rights are one-sided, despite your stated interest in reciprocity. Would you require revised terms before accepting them?"
    if (choice.reason === "equal" && choice.option === "national-records") return "Domestic monitoring excludes outside visits on both sides, but grants no reciprocal right to inspect. Did you mean equal non-access or a right to visit?"
    if (choice.reason === "secrets" && choice.option === "national") return "National teams expose Arden's records to foreign officials, despite your stated interest in keeping those records from foreign governments. Which disclosure would you allow?"
  } else {
    if (choice.reason === "contain" && choice.option === "weights") return "Released weights cannot be recalled or access revoked, despite your stated interest in limiting access later. Which limit could you still accept losing?"
    if (choice.reason === "reproduce" && choice.option === "hosted") return "Hosted queries do not permit independent reproduction or modification of the model itself. Would testing outputs be enough for your stated purpose?"
  }
  return null
}
export type ReadbackRelation = "changed-arrangement-same-reason" | "changed-arrangement-changed-reason" | "same-arrangement-same-reason" | "same-arrangement-changed-reason" | "unexpressed-reason" | "reason-needs-clarification" | "decision-deferred"
export function readEpisode(episode: Episode, first: Decision, second: Decision) {
  const changed = first.option !== second.option
  const reasonChanged = first.reason !== second.reason
  const affectedOption = episode.id === "verify" ? "national" : "enclave"
  const affected = { original: first.option === affectedOption, revised: second.option === affectedOption }
  const deferred = first.option === "defer" || second.option === "defer"
  let relation: ReadbackRelation = changed
    ? reasonChanged ? "changed-arrangement-changed-reason" : "changed-arrangement-same-reason"
    : reasonChanged ? "same-arrangement-changed-reason" : "same-arrangement-same-reason"
  let text = arrangementReadings[episode.id][`${first.option}>${second.option}`]
  let caveat = "These are two choices and self-reported reasons in a fictional exercise, not established causes or lasting traits."
  if (deferred) {
    relation = "decision-deferred"
    text = first.option === "defer" && second.option === "defer"
      ? "You withheld an arrangement decision in both conditions. This bounded choice set did not supply the information or terms you needed; it does not locate you between the three policies."
      : second.option === "defer"
        ? "You selected an arrangement originally, then asked for more information or revised terms. The replay records a withheld decision, not a replacement policy."
        : "You withheld the original decision, then selected an arrangement in the replay. Without an original arrangement, there is no two-policy comparison to interpret."
    caveat = "A follow-up would need to identify the missing fact or unacceptable term before interpreting the withheld decision."
  }
  const names = reasonMeanings[episode.id]
  if (first.reason === "none" || second.reason === "none") {
    if (!deferred) relation = "unexpressed-reason"
    text += first.reason === "none" && second.reason === "none"
      ? " None of the offered reasons described your reasoning in either decision. The choices alone do not supply that missing rationale."
      : ` The ${first.reason === "none" ? "original" : "revised"} reason was not expressed by the offered choices. The other decision named ${names[first.reason === "none" ? second.reason : first.reason]}; that cannot fill the gap.`
    caveat = "A follow-up would need your reason in your own terms before attributing a priority to this comparison."
  } else {
    text += reasonChanged
      ? ` ${changed ? "Your stated rationale moved" : "The decision stayed the same, while your stated rationale moved"} from ${names[first.reason]} to ${names[second.reason]}.`
      : ` You named ${names[first.reason]} in both decisions.`
    if (!deferred) {
      const limits = [...new Set([reasonLimit(episode.id, first, false), reasonLimit(episode.id, second, true)].filter((v): v is string => v !== null))]
      if (limits.length) { relation = "reason-needs-clarification"; caveat = limits.join(" ") }
      else if (episode.id === "verify" && first.option === "national" && second.option === "custodian" && second.reason === "equal") caveat = "Your selected reason makes reciprocity worth discussing here; it does not establish a permanent egalitarian trait or prove why you switched."
      else if (episode.id === "access" && first.option === "enclave" && second.option === "weights") caveat = "The move and stated reasons concern this release decision. They do not establish an open-source personality or the safety of public release."
      else if (episode.id === "access" && first.option === "enclave" && second.option === "hosted" && second.reason === "contain") caveat = "The stated containment reason does not establish that hosted access is safe or that excluding external evaluators was necessary."
    }
  }
  return { ruleId: `${episode.id}/${first.option}>${second.option}/${relation}`, relation, affected, text, caveat }
}
