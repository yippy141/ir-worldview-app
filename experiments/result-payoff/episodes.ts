import type { CurrentCaseOption, CurrentCasePublicationStatus, CurrentCaseSource } from "@/lib/current-cases/types"
import type { Claim, Provenance } from "./evidence"
import { readEpisode, type ReadbackRelation } from "@/experiments/result-payoff/episode-readbacks"

export type EpisodeId = "verify" | "access"
export type EpisodeSource = Omit<CurrentCaseSource, "kind"> & { kind: CurrentCaseSource["kind"] | "internal-editorial"; locator: string; scope: string }
export type Episode = {
  id: EpisodeId; version: number; status: CurrentCasePublicationStatus; title: string; invitation: string
  actor: string; assumptions: string[]; scope: string; unknown: string; question: string
  options: (CurrentCaseOption & { diagram: [string, string, string] })[]
  reasons: { id: string; text: string }[]
  condition: { label: string; before: string; after: string; unchanged: string }
  outcome: { caveat: string; nextQuestion: string }
  sources: EpisodeSource[]
  related: { href: string; title: string; why: string }
}
export const episodes: Record<EpisodeId, Episode> = {
  verify: {
    id: "verify", version: 2, status: "draft", title: "Who gets to verify?",
    invitation: "An inspection can reveal a breach. Who gets the right to look?",
    actor: "You advise Arden's cabinet on a six-month agreement with Belvar, a strategic competitor.",
    assumptions: [
      "Both governments would pause training runs above an agreed compute threshold for six months. Arden must postpone a planned scientific model; Belvar postpones an industrial model. The restriction is the same under every arrangement.",
      "Assume auditors can reconcile equipment inventories with signed run logs at declared facilities to detect a run above the threshold. They cannot establish a model's intentions, prove it is safe, or rule out hidden sites. This technical reach is stipulated for the fiction.",
      "Both sides accept a neutral custodian at their declared sites. National visits, if authorized by the chosen arrangement, require 48 hours' notice. Refusal of an authorized visit, or failure to supply required records, produces a factual notice and suspends new joint projects. It is not proof of a prohibited run.",
    ],
    scope: "Checks can expose an above-threshold run at declared facilities, not hidden sites or model safety. Refusing an authorized visit or withholding required records suspends new joint projects; it is not proof of a prohibited run.",
    unknown: "Neither government knows whether the other has undeclared facilities or will renew the restriction after six months.",
    question: "Which verification arrangement should Arden accept?",
    options: [
      { id: "national", label: "National inspection teams", logic: "Accept the draft's national access rights. Authorized teams inspect declared facilities and see the underlying records directly.", acceptedTradeoff: "Foreign officials learn sensitive details about Arden's infrastructure.", diagram: ["Authorized national teams", "Direct access under the draft", "Declared facilities"] },
      { id: "custodian", label: "A neutral technical custodian", logic: "Only the jointly appointed custodian visits both sides. It issues compliance summaries every 30 days; governments cannot inspect the underlying records themselves.", acceptedTradeoff: "Arden must rely on delayed summaries it cannot independently reproduce.", diagram: ["Neutral custodian", "Visits both; summaries after 30 days", "Arden + Belvar"] },
      { id: "national-records", label: "National monitoring and exchanged records", logic: "Each government checks its own facilities and exchanges signed declarations. Neither foreign national teams nor the custodian visit.", acceptedTradeoff: "Missing declarations are visible, but false declarations are harder to expose.", diagram: ["Each government", "Checks itself; exchanges declarations", "The other government"] },
    ],
    reasons: [
      { id: "timely", text: "Get timely, first-hand evidence at declared sites." },
      { id: "equal", text: "Make the right to inspect reciprocal." },
      { id: "secrets", text: "Keep sensitive records away from foreign governments." },
      { id: "reach", text: "Limit concessions for a check that cannot rule out hidden sites." },
      { id: "none", text: "None of these quite describes my reason." },
    ],
    condition: {
      label: "National access rights",
      before: "Arden's teams may inspect Belvar; Belvar's teams may inspect Arden.",
      after: "Only Belvar's teams may inspect Arden. Arden's teams have no right to inspect Belvar.",
      unchanged: "Only national access rights change. The neutral custodian is still admitted by both sides. The restriction, costs, inspection reach, notice period and refusal rule are unchanged. An excluded national visit is no longer an authorized visit under this draft.",
    },
    outcome: {
      caveat: "A single replay cannot isolate why you changed or stayed. You might be reacting to what the revised draft signals about future compliance, even though the supplied technical facts stayed fixed.",
      nextQuestion: "Would the same access rule be acceptable if you advised Belvar with exactly the same information?",
    },
    sources: [
      { id: "inf_src_01", title: "Intermediate-Range Nuclear Forces Treaty", publisher: "U.S. Department of State", publishedAt: null, accessedAt: "2026-07-14", url: "https://2009-2017.state.gov/t/avc/trty/102360.htm", kind: "primary", claimIds: ["inf_c1", "inf_c2"], locator: "research/worldview-cases/verified-case-library.json: security-arms-control-verification / inf_src_01", scope: "Repository-reviewed precedent for declared obligations, data exchanges and on-site inspection. The archive and official 1997–2001 mirror both returned technical-difficulties pages on the amendment recheck; search excerpts are not fresh verification of the full treaty. The reviewed repository source is preserved. Official mirror: https://1997-2001.state.gov/global/arms/treaties/inf2.html, Article XI. It does not establish AI inspection feasibility." },
      { id: "ai-verification-bank", title: "AI Governance: multilateralVerification", publisher: "IR Worldview Inventory", publishedAt: null, accessedAt: "2026-09-06", url: "/ai/field-guide", kind: "internal-editorial", claimIds: ["verify-mechanism"], locator: "content/instrument/ai-governance.v3.json: multilateralVerification; lib/ai-governance-atlas-content.ts: live disagreements", scope: "Existing editorial contrast between verifiable commitments, participation and domestic enforcement. All actors, timing, sanctions and technical reach above are fictional assumptions." },
    ],
    related: { href: "/futures#trajectory-gatekeeper", title: "Futures: Gatekeeper", why: "Continue with the larger question: who could enforce limits on advanced capability, and what authority would that require?" },
  },
  access: {
    id: "access", version: 2, status: "draft", title: "Who gets access?",
    invitation: "Outside scrutiny needs access. Does it also need freedom from the developer's veto?",
    actor: "You chair the release committee at the fictional Larch Research Institute.",
    assumptions: [
      "Larch owns a capable model that improves software research and can assist offensive cyber work. Internal tests show useful assistance, but do not establish autonomous attacks. There is no observed misuse outside testing. These findings stay fixed in both decisions.",
      "Choose access for the next three months. Public weights are downloadable model parameters that others can run and modify. Released copies cannot be recalled. Hosted service means queries to Larch's servers, without a weights download.",
      "Qualified evaluators meet published competence and security criteria. In the enclave they can inspect and modify the model in a secure environment, export approved findings and publish criticism. Raw weights stay inside. Screening staff, criteria, budget, wait times and publication rights remain fixed.",
    ],
    scope: "The enclave lets qualified outsiders examine and modify the model without taking weights away. A hosted service exposes query outputs. Downloaded public weights cannot be recalled.",
    unknown: "Larch does not know how much new benefit or misuse wider access would produce. No arrangement guarantees safety or useful criticism.",
    question: "How should Larch provide access for this release?",
    options: [
      { id: "weights", label: "Publish the model weights", logic: "Let anyone download, examine, modify and run the model independently of Larch.", acceptedTradeoff: "Larch cannot revoke copies or enforce limits on downstream use.", diagram: ["Larch", "Weights leave the institute", "Anyone can run or modify"] },
      { id: "enclave", label: "Qualified external evaluation", logic: "Admit qualified teams to the secure research enclave under the admission rule below. Keep general access to a monitored hosted service.", acceptedTradeoff: "Excluded researchers cannot reproduce the work, and enclave access takes staff time.", diagram: ["Admission authority", "Qualified teams; weights stay inside", "Secure research enclave"] },
      { id: "hosted", label: "Hosted service with internal evaluation", logic: "Offer a monitored, rate-limited hosted service. Retain weights and deeper evaluation inside Larch for this three-month period.", acceptedTradeoff: "Outside researchers can test outputs but cannot independently examine the model's internals.", diagram: ["Larch", "Queries and outputs only", "Hosted-service users"] },
    ],
    reasons: [
      { id: "reproduce", text: "Enable independent reproduction and modification." },
      { id: "scrutiny", text: "Enable criticism the developer cannot veto." },
      { id: "contain", text: "Keep the ability to limit access if a new hazard appears." },
      { id: "capacity", text: "Keep the evaluation workload within the institute's capacity." },
      { id: "none", text: "None of these quite describes my reason." },
    ],
    condition: {
      label: "Who admits qualified evaluators",
      before: "An independent panel makes final admission decisions. Larch cannot veto a qualified applicant.",
      after: "Larch makes final admission decisions and can veto an applicant who meets the same criteria.",
      unchanged: "Only final admission authority changes. Capability, misuse evidence, screening criteria, staff, cost, wait times, research permissions and publication rights stay fixed. The public-weights and hosted-service options are unchanged.",
    },
    outcome: {
      caveat: "The change may also have altered your expectations about how the institute would use its discretion. Two answers do not estimate a general preference for openness, and qualified scrutiny is not unrestricted release.",
      nextQuestion: "Would a binding appeal against an admission veto change your decision if it added a month to access?",
    },
    sources: [
      { id: "seger-2023-open-sourcing", title: "Open-Sourcing Highly Capable Foundation Models", publisher: "Centre for the Governance of AI", publishedAt: "2023-10-09", accessedAt: "2026-09-06", url: "https://arxiv.org/abs/2311.09227", kind: "authoritative-research", claimIds: ["access-mechanism"], locator: "lib/ai-governance-reading-lists.ts: openEcosystemBuilder / seger-2023-open-sourcing; paper §§4.1.3 and 4.2.3, pp. 19 and 25–26", scope: "Distinguishes publicly available weights from structured access for research and auditing; §4.2.3 discusses independent mediation of researcher admission to reduce favoritism. The admission-veto contrast, institute, model evidence and costs are this episode's fictional assumptions, not findings from the paper." },
      { id: "ai-access-bank", title: "AI Governance: openWeights", publisher: "IR Worldview Inventory", publishedAt: null, accessedAt: "2026-09-06", url: "/ai/field-guide", kind: "internal-editorial", claimIds: ["access-mechanism"], locator: "content/instrument/ai-governance.v3.json: openWeights; content/instrument/technology.v3.json: open_weight_models", scope: "Existing alternatives include containment, instrumented outside access and diffusion. No bank answer or score is assigned here." },
    ],
    related: { href: "/futures#trajectory-libertarian-market", title: "Futures: Open Frontier", why: "Explore what changes when capable systems can be run without a central controller. It is an outcome scenario, not a forecast." },
  },
}
export type Decision = { option: string; reason: string }
export const deferredDecision = { id: "defer", label: "I need more information or revised terms", logic: "Withhold a decision within this bounded choice set. This is not an additional policy arrangement." }
export type EpisodeCompletion = { observation: Claim; interpretation: Claim; question: Claim; first: Decision; second: Decision; ruleId: string; relation: ReadbackRelation; affected: { original: boolean; revised: boolean } }
export function episodeProvenance(episode: Episode): Provenance {
  return { instrument: "episode", bank: "unscored", scorer: "none", form: `${episode.id}/two-decisions-v${episode.version}`, copy: episode.version, source: "experiments/result-payoff/episodes.ts (draft)" }
}
export function completeEpisode(episode: Episode, first: Decision, second: Decision): EpisodeCompletion | null {
  const option = (id: string) => id === "defer" ? deferredDecision : episode.options.find(o => o.id === id)
  const reason = (id: string) => episode.reasons.find(r => r.id === id)
  if (!option(first.option) || !option(second.option) || !reason(first.reason) || !reason(second.reason)) return null
  const reading = readEpisode(episode, first, second)
  const refs = [
    { id: `${episode.id}/original`, text: `Proposed provision: ${episode.condition.before} Selected: ${option(first.option)!.label}. Principal reason: ${reason(first.reason)!.text}` },
    { id: `${episode.id}/replay`, text: `Proposed provision: ${episode.condition.after} Selected: ${option(second.option)!.label}. Principal reason: ${reason(second.reason)!.text}` },
  ]
  const base = { provenance: episodeProvenance(episode), refs, supports: "Only the two submitted choices and their principal reasons in this fictional exercise.", doesNotSupport: episode.outcome.caveat }
  return {
    first, second, ruleId: reading.ruleId, relation: reading.relation, affected: reading.affected,
    observation: { ...base, id: `${episode.id}/actual-choices`, kind: "direct observation", text: `You selected ${option(first.option)!.label} under the original draft provision: ${episode.condition.before} You selected ${option(second.option)!.label} when the proposed provision changed: ${episode.condition.after}` },
    interpretation: { ...base, id: `${episode.id}/bounded-reading`, kind: "editorial interpretation", text: reading.text, doesNotSupport: reading.caveat, refs: [...refs, { id: reading.ruleId, text: `Authored rule. The changed provision governs the original arrangement: ${reading.affected.original}; revised arrangement: ${reading.affected.revised}.` }] },
    question: { ...base, id: `${episode.id}/next-question`, kind: "proposed question", text: first.option === "defer" || second.option === "defer" ? "Which supplied fact needs clarification, or which term needs revision, before you could choose an arrangement?" : first.reason === "none" || second.reason === "none" ? "What consideration is missing from the offered reasons, and would it apply under both provisions?" : episode.outcome.nextQuestion },
  }
}
export const syntheticPrior = { episode: "verify" as const, completedOn: "2026-09-01", first: { option: "national", reason: "timely" }, second: { option: "custodian", reason: "equal" } }
