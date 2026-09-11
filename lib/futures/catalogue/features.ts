export const featureDefinitions = {
  humanAuthority: { label: "Practical human governing authority", domain: "authority", present: "Humans retain practical final authority", absent: "Humans do not retain practical final authority" },
  revisablePower: { label: "Revisable governing mandates", domain: "contestability", present: "People can effectively revise governing mandates", absent: "Governing mandates cannot be effectively revised" },
  personalExit: { label: "A practical right to leave", domain: "contestability", present: "People have a practical exit right", absent: "People lack a practical exit right" },
  pluralPolities: { label: "Several self-governing communities", domain: "pluralism", present: "Several communities exercise their own rule", absent: "A single authority governs the whole arrangement" },
  sharedBenefits: { label: "A guaranteed material floor", domain: "distribution", present: "Material provision is guaranteed broadly", absent: "There is no universal material guarantee" },
  privateOwnership: { label: "Private ownership of productive resources", domain: "distribution", present: "Private ownership organizes production", absent: "Production is organized without private ownership" },
  biologicalContinuity: { label: "Continuing biological humanity", domain: "status", present: "Biological humanity continues", absent: "Biological humanity does not continue" },
  voluntaryTransformation: { label: "Others’ choice to transform themselves", domain: "status", present: "Adults may choose substantial transformation", absent: "Substantial transformation is unavailable or prohibited" },
  digitalStanding: { label: "Standing for artificial persons", domain: "status", present: "Artificial persons have recognized standing", absent: "Artificial persons have no recognized standing" },
  capabilityLimits: { label: "Enforced limits on selected capabilities", domain: "risk", present: "Selected capabilities face enforced limits", absent: "No institutional capability ceiling applies" },
  transparentPower: { label: "Visible exercise of governing power", domain: "knowledge", present: "People know who exercises governing power", absent: "Governing intervention is concealed" },
  technicalIndependence: { label: "Practical independence from a technical provider", domain: "dependence", present: "Communities can operate without one indispensable provider", absent: "Life depends on an indispensable technical provider" },
} as const
export type FeatureId = keyof typeof featureDefinitions
export type Domain = typeof featureDefinitions[FeatureId]["domain"]
export type FeatureState = "present" | "absent" | "variant-dependent" | "unspecified" | "inapplicable"
export type Features = Record<FeatureId, FeatureState>
export const featureIds = Object.keys(featureDefinitions) as FeatureId[]
export const domainLabels: Record<Domain, string> = {
  authority: "Human authority", contestability: "Contestability and exit", pluralism: "Plural communities",
  distribution: "Ownership and distribution", status: "Human and digital status", risk: "Capability limits",
  knowledge: "Visible power", dependence: "Technical dependence",
}
export function features(overrides: Partial<Features>): Features {
  return Object.fromEntries(featureIds.map(id => [id, overrides[id] ?? "unspecified"])) as Features
}
export function featureStatement(id: FeatureId, state: FeatureState) {
  return state === "present" || state === "absent" ? featureDefinitions[id][state] : state === "inapplicable" ? "No continuing society instantiates this condition" : state === "variant-dependent" ? "Depends on the variant; no single answer" : "Not specified by this entry"
}
