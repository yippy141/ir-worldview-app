export type GlossaryEntry = {
  id: string
  term: string
  definition: string
  seeAlso?: string[]
}

export const aiGlossary: GlossaryEntry[] = [
  {
    id: "alignment",
    term: "Alignment",
    definition:
      "The challenge of building AI systems that reliably pursue goals matching human values and intentions. An aligned model does what its designers and users actually want, even in novel situations. Alignment is difficult because specifying human goals precisely enough to prevent unintended behavior at scale is an unsolved problem.",
    seeAlso: ["evaluation", "interpretability"],
  },
  {
    id: "capability-threshold",
    term: "Capability threshold",
    definition:
      "A defined level of AI capability that triggers additional governance responses — such as mandatory evaluation, restricted deployment, or escalation to a regulatory body. Thresholds can be specified by benchmark performance, by particular dangerous capabilities such as autonomous cyberattack, or by the volume of compute used in training.",
    seeAlso: ["evaluation", "frontier-model"],
  },
  {
    id: "compute-governance",
    term: "Compute governance",
    definition:
      "Policy approaches that regulate access to the hardware — GPUs, TPUs, and the data centers that house them — used to train and run large AI models. Because advanced chips are produced by a small number of firms in limited locations, compute is treated as a potentially tractable chokepoint for governance. Proposals range from export controls to know-your-customer requirements on cloud providers.",
    seeAlso: ["frontier-model", "sovereignty"],
  },
  {
    id: "deployment-pace",
    term: "Deployment pace",
    definition:
      "How quickly an AI system moves from research or limited testing into widespread real-world use. Arguments for faster deployment emphasize social benefits and real-world learning. Arguments for slower deployment emphasize the need for evaluations and safeguards to catch up before exposure reaches scale.",
    seeAlso: ["evaluation", "capability-threshold"],
  },
  {
    id: "dual-use",
    term: "Dual use",
    definition:
      "AI capabilities that have both civilian and military or harmful applications. A model that accelerates biological research may also lower barriers to bioweapon design. Dual-use concerns complicate openness decisions: wide release may generate broad social value while also enabling misuse that is difficult to reverse.",
    seeAlso: ["openness", "capability-threshold"],
  },
  {
    id: "evaluation",
    term: "Evaluation",
    definition:
      "Structured testing of AI systems for specific capabilities, safety properties, or risks, run by labs internally, by independent third parties, or by government agencies. Evaluations are the primary mechanism for detecting dangerous capabilities before deployment, but current methods have significant gaps — particularly for emergent or deceptive behaviors.",
    seeAlso: ["capability-threshold", "verification"],
  },
  {
    id: "frontier-model",
    term: "Frontier model",
    definition:
      "A large AI system at or near the current limit of capability, typically trained using massive compute, data, and human feedback. The term refers to the leading edge of what is technically possible rather than a fixed capability level. Frontier governance decisions may need to anticipate capabilities that do not yet exist in deployed systems.",
    seeAlso: ["compute-governance", "capability-threshold"],
  },
  {
    id: "interpretability",
    term: "Interpretability",
    definition:
      "Research and methods aimed at understanding what an AI model has learned and why it produces particular outputs. At its strongest, interpretability would let auditors verify a model's internal representations and goals rather than relying on behavioral tests alone. Current interpretability tools remain limited for frontier systems.",
    seeAlso: ["alignment", "evaluation"],
  },
  {
    id: "model-weights",
    term: "Model weights",
    definition:
      "The numerical parameters learned during training that define an AI model's behavior. Releasing model weights allows anyone to run, fine-tune, or modify the model without the original developer's infrastructure. Open-weight release differs from open-source code: it shares the trained artifact, not just the training procedure.",
    seeAlso: ["openness"],
  },
  {
    id: "openness",
    term: "Openness",
    definition:
      "Whether AI model weights, training code, or data are made publicly accessible rather than kept proprietary or gated behind an API. Proponents argue openness enables broader innovation, reduces incumbency concentration, and allows independent safety research. Critics argue it makes dangerous capabilities difficult to contain once released.",
    seeAlso: ["model-weights", "sovereignty"],
  },
  {
    id: "sovereignty",
    term: "Sovereignty",
    definition:
      "A country's or institution's capacity to govern, develop, or constrain AI within its jurisdiction, independent of foreign providers. Sovereignty concerns arise when critical AI infrastructure — compute, models, data — is controlled by foreign entities or a small number of private firms. Policy responses include domestic compute investment, local data requirements, and limits on foreign AI procurement.",
    seeAlso: ["compute-governance", "openness"],
  },
  {
    id: "verification",
    term: "Verification",
    definition:
      "Technical or institutional methods for confirming that AI systems or governance commitments meet stated requirements. In arms-control contexts, verification involves inspection or monitoring that allows external parties to check compliance. AI verification is technically underdeveloped: it is currently difficult to verify what a model can do, what data it was trained on, or whether safety commitments have been honored.",
    seeAlso: ["evaluation", "compute-governance"],
  },
]

export const aiGlossaryById: Record<string, GlossaryEntry> = Object.fromEntries(
  aiGlossary.map((entry) => [entry.id, entry]),
)
