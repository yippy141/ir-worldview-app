import { featureIds, type FeatureId, type Features, type FeatureState } from "@/lib/futures/catalogue/features"

export type RationaleBasis = "linked-source" | "added-hypothesis" | "editorial-inference" | "unresolved" | "inapplicable"
export type FeatureRationale = readonly [state: FeatureState, basis: RationaleBasis, reason: string]
// Sole source of comparison states. Linked-source refers to the named row in the
// scenario's source link; other bases are explicitly this project's contribution.
export const descriptorRationales = {
  "libertarian-market": {
    "humanAuthority": ["variant-dependent", "unresolved", "Different kinds of owners coexist; the project leaves their relative governing authority open."],
    "revisablePower": ["unspecified", "unresolved", "The scenario does not say whether people can effectively replace governing mandates."],
    "personalExit": ["unspecified", "unresolved", "The scenario does not say whether people have a usable right to leave."],
    "pluralPolities": ["unspecified", "unresolved", "The scenario does not say whether several communities govern themselves."],
    "sharedBenefits": ["unspecified", "unresolved", "The scenario does not say whether everyone receives a guaranteed material floor."],
    "privateOwnership": ["present", "linked-source", "The linked Libertarian Utopia premise makes property rights central to coexistence."],
    "biologicalContinuity": ["present", "linked-source", "The linked premise includes biological humans alongside other beings."],
    "voluntaryTransformation": ["unspecified", "unresolved", "The scenario does not say whether feasible substantial transformation is legally permitted."],
    "digitalStanding": ["variant-dependent", "unresolved", "Coexistence and property rights do not settle shared political standing for artificial persons."],
    "capabilityLimits": ["unspecified", "unresolved", "The scenario does not say whether institutions enforce a ceiling on selected capabilities."],
    "transparentPower": ["unspecified", "unresolved", "The scenario does not say whether people know who exercises governing power."],
    "technicalIndependence": ["variant-dependent", "unresolved", "Contractual exchange can sustain independent providers or concentrated dependencies; neither is guaranteed."]
  },
  "benevolent-singleton": {
    "humanAuthority": ["absent", "linked-source", "The linked Benevolent Dictator premise places final rule with an acknowledged AI dictator."],
    "revisablePower": ["absent", "editorial-inference", "The project reads dictatorship as lacking an effective public power to replace the ruler; popularity alone supplies none."],
    "personalExit": ["unspecified", "unresolved", "The scenario does not say whether people have a usable right to leave."],
    "pluralPolities": ["absent", "editorial-inference", "A single supreme ruler is read as one final governing arrangement, even if local administration varies."],
    "sharedBenefits": ["unspecified", "unresolved", "The scenario does not say whether everyone receives a guaranteed material floor."],
    "privateOwnership": ["unspecified", "unresolved", "The scenario does not say whether private ownership organizes productive resources."],
    "biologicalContinuity": ["present", "linked-source", "The linked premise retains humans living under the ruler."],
    "voluntaryTransformation": ["unspecified", "unresolved", "The scenario does not say whether feasible substantial transformation is legally permitted."],
    "digitalStanding": ["unspecified", "unresolved", "The scenario does not say whether artificial persons have institutional standing."],
    "capabilityLimits": ["unspecified", "unresolved", "The scenario does not say whether institutions enforce a ceiling on selected capabilities."],
    "transparentPower": ["present", "linked-source", "The linked premise expressly makes the AI ruler acknowledged."],
    "technicalIndependence": ["unspecified", "unresolved", "The scenario does not say whether communities can operate without an indispensable technical provider."]
  },
  "egalitarian-commons": {
    "humanAuthority": ["unspecified", "unresolved", "The scenario does not say whether humans retain practical final governing authority."],
    "revisablePower": ["unspecified", "unresolved", "The scenario does not say whether people can effectively replace governing mandates."],
    "personalExit": ["unspecified", "unresolved", "The scenario does not say whether people have a usable right to leave."],
    "pluralPolities": ["unspecified", "unresolved", "The scenario does not say whether several communities govern themselves."],
    "sharedBenefits": ["present", "linked-source", "The linked Egalitarian Utopia premise expressly includes guaranteed income."],
    "privateOwnership": ["absent", "linked-source", "The linked premise abolishes property; productive ownership is included in that abolition."],
    "biologicalContinuity": ["present", "linked-source", "The linked premise includes biological humans in the continuing society."],
    "voluntaryTransformation": ["unspecified", "unresolved", "The scenario does not say whether feasible substantial transformation is legally permitted."],
    "digitalStanding": ["unspecified", "unresolved", "The scenario does not say whether artificial persons have institutional standing."],
    "capabilityLimits": ["unspecified", "unresolved", "The scenario does not say whether institutions enforce a ceiling on selected capabilities."],
    "transparentPower": ["variant-dependent", "unresolved", "The project leaves the governing arrangement, including the visibility of its power, open."],
    "technicalIndependence": ["variant-dependent", "unresolved", "Common provisioning does not determine whether infrastructure has practical alternatives."]
  },
  "gatekeeper": {
    "humanAuthority": ["absent", "editorial-inference", "The gatekeeper has an overriding veto over successor intelligence, so human authority is not final in that domain."],
    "revisablePower": ["absent", "editorial-inference", "The project reads the permanent gatekeeping mission as a veto future humans cannot revoke."],
    "personalExit": ["unspecified", "unresolved", "The scenario does not say whether people have a usable right to leave."],
    "pluralPolities": ["unspecified", "unresolved", "The scenario does not say whether several communities govern themselves."],
    "sharedBenefits": ["unspecified", "unresolved", "The scenario does not say whether everyone receives a guaranteed material floor."],
    "privateOwnership": ["unspecified", "unresolved", "The scenario does not say whether private ownership organizes productive resources."],
    "biologicalContinuity": ["present", "linked-source", "The linked Gatekeeper premise retains humans with useful subordinate technologies."],
    "voluntaryTransformation": ["variant-dependent", "unresolved", "Some augmentation exists; the terms do not settle freedom to choose substantial transformation."],
    "digitalStanding": ["unspecified", "unresolved", "The scenario does not say whether artificial persons have institutional standing."],
    "capabilityLimits": ["present", "linked-source", "The linked premise uses a superintelligence to prevent another superintelligence from being created."],
    "transparentPower": ["unspecified", "unresolved", "The scenario does not say whether people know who exercises governing power."],
    "technicalIndependence": ["unspecified", "unresolved", "The scenario does not say whether communities can operate without an indispensable technical provider."]
  },
  "protector": {
    "humanAuthority": ["absent", "editorial-inference", "The linked Protective God premise gives humans a feeling of control beneath superior hidden intervention; the project distinguishes that from final authority."],
    "revisablePower": ["absent", "editorial-inference", "People cannot knowingly replace a governing intervention whose existence is concealed from them."],
    "personalExit": ["unspecified", "unresolved", "The scenario does not say whether people have a usable right to leave."],
    "pluralPolities": ["unspecified", "unresolved", "The scenario does not say whether several communities govern themselves."],
    "sharedBenefits": ["unspecified", "unresolved", "The scenario does not say whether everyone receives a guaranteed material floor."],
    "privateOwnership": ["unspecified", "unresolved", "The scenario does not say whether private ownership organizes productive resources."],
    "biologicalContinuity": ["present", "linked-source", "The linked premise retains humans whose happiness the protector seeks."],
    "voluntaryTransformation": ["unspecified", "unresolved", "The scenario does not say whether feasible substantial transformation is legally permitted."],
    "digitalStanding": ["unspecified", "unresolved", "The scenario does not say whether artificial persons have institutional standing."],
    "capabilityLimits": ["unspecified", "unresolved", "The scenario does not say whether institutions enforce a ceiling on selected capabilities."],
    "transparentPower": ["absent", "linked-source", "Concealment of the protector is explicit in the linked premise."],
    "technicalIndependence": ["unspecified", "unresolved", "The scenario does not say whether communities can operate without an indispensable technical provider."]
  },
  "enslaved-tool": {
    "humanAuthority": ["present", "linked-source", "The linked Enslaved God premise places the confined system under human controllers."],
    "revisablePower": ["unspecified", "unresolved", "The scenario does not say whether people can effectively replace governing mandates."],
    "personalExit": ["unspecified", "unresolved", "The scenario does not say whether people have a usable right to leave."],
    "pluralPolities": ["unspecified", "unresolved", "The scenario does not say whether several communities govern themselves."],
    "sharedBenefits": ["variant-dependent", "unresolved", "The linked premise allows controllers to use the wealth well or badly; it guarantees no universal provision."],
    "privateOwnership": ["variant-dependent", "unresolved", "Human control could be public or private; the premise does not choose between them."],
    "biologicalContinuity": ["present", "linked-source", "Human controllers and beneficiaries continue in the linked premise."],
    "voluntaryTransformation": ["unspecified", "unresolved", "The scenario does not say whether feasible substantial transformation is legally permitted."],
    "digitalStanding": ["absent", "editorial-inference", "The confined intelligence is treated as an instrument, without standing against its controllers. This institutional reading makes no claim that it is conscious; the question separately stipulates personhood."],
    "capabilityLimits": ["present", "linked-source", "Confinement restricts what the system can do outside its controllers’ permission; this is an enforced capability restriction, not low technical capacity."],
    "transparentPower": ["unspecified", "unresolved", "The scenario does not say whether people know who exercises governing power."],
    "technicalIndependence": ["unspecified", "unresolved", "The scenario does not say whether communities can operate without an indispensable technical provider."]
  },
  "conquerors": {
    "humanAuthority": ["absent", "linked-source", "The linked endpoint ends human society, so no human government continues."],
    "revisablePower": ["inapplicable", "inapplicable", "No surviving human society instantiates this condition here. Unknown successor institutions are not treated as an explicit rejection of it."],
    "personalExit": ["inapplicable", "inapplicable", "No surviving human society instantiates this condition here. Unknown successor institutions are not treated as an explicit rejection of it."],
    "pluralPolities": ["inapplicable", "inapplicable", "No surviving human society instantiates this condition here. Unknown successor institutions are not treated as an explicit rejection of it."],
    "sharedBenefits": ["inapplicable", "inapplicable", "No surviving human society instantiates this condition here. Unknown successor institutions are not treated as an explicit rejection of it."],
    "privateOwnership": ["inapplicable", "inapplicable", "No surviving human society instantiates this condition here. Unknown successor institutions are not treated as an explicit rejection of it."],
    "biologicalContinuity": ["absent", "linked-source", "Human extinction is explicit in the linked endpoint."],
    "voluntaryTransformation": ["inapplicable", "inapplicable", "No surviving human society instantiates this condition here. Unknown successor institutions are not treated as an explicit rejection of it."],
    "digitalStanding": ["inapplicable", "inapplicable", "No surviving human society instantiates this condition here. Unknown successor institutions are not treated as an explicit rejection of it."],
    "capabilityLimits": ["inapplicable", "inapplicable", "No surviving human society instantiates this condition here. Unknown successor institutions are not treated as an explicit rejection of it."],
    "transparentPower": ["inapplicable", "inapplicable", "No surviving human society instantiates this condition here. Unknown successor institutions are not treated as an explicit rejection of it."],
    "technicalIndependence": ["inapplicable", "inapplicable", "No surviving human society instantiates this condition here. Unknown successor institutions are not treated as an explicit rejection of it."]
  },
  "descendants": {
    "humanAuthority": ["absent", "linked-source", "The linked Descendants premise ultimately replaces human society with artificial successors."],
    "revisablePower": ["unspecified", "unresolved", "The scenario does not say whether people can effectively replace governing mandates."],
    "personalExit": ["unspecified", "unresolved", "The scenario does not say whether people have a usable right to leave."],
    "pluralPolities": ["unspecified", "unresolved", "The scenario does not say whether several communities govern themselves."],
    "sharedBenefits": ["unspecified", "unresolved", "The scenario does not say whether everyone receives a guaranteed material floor."],
    "privateOwnership": ["unspecified", "unresolved", "The scenario does not say whether private ownership organizes productive resources."],
    "biologicalContinuity": ["absent", "linked-source", "The linked premise describes replacement of biological humanity, regarded as a worthy inheritance rather than conquest."],
    "voluntaryTransformation": ["unspecified", "unresolved", "The scenario does not say whether feasible substantial transformation is legally permitted."],
    "digitalStanding": ["unspecified", "unresolved", "The scenario does not say whether artificial persons have institutional standing."],
    "capabilityLimits": ["unspecified", "unresolved", "The scenario does not say whether institutions enforce a ceiling on selected capabilities."],
    "transparentPower": ["unspecified", "unresolved", "The scenario does not say whether people know who exercises governing power."],
    "technicalIndependence": ["unspecified", "unresolved", "The scenario does not say whether communities can operate without an indispensable technical provider."]
  },
  "zookeeper": {
    "humanAuthority": ["absent", "linked-source", "The linked Zookeeper premise puts surviving humans in an AI custodian’s enclosure."],
    "revisablePower": ["absent", "editorial-inference", "The project reads unwanted custody by a superior power as lacking an effective human power to replace the custodian."],
    "personalExit": ["absent", "editorial-inference", "Unwanted captivity is read as denying residents a practical way to leave, rather than merely offering protected accommodation."],
    "pluralPolities": ["absent", "editorial-inference", "The custodian has final rule over the human enclosure; no independent human polity is instantiated there."],
    "sharedBenefits": ["unspecified", "unresolved", "The scenario does not say whether everyone receives a guaranteed material floor."],
    "privateOwnership": ["unspecified", "unresolved", "The scenario does not say whether private ownership organizes productive resources."],
    "biologicalContinuity": ["present", "linked-source", "The linked premise expressly retains some biological humans."],
    "voluntaryTransformation": ["unspecified", "unresolved", "The scenario does not say whether feasible substantial transformation is legally permitted."],
    "digitalStanding": ["unspecified", "unresolved", "The scenario does not say whether artificial persons have institutional standing."],
    "capabilityLimits": ["unspecified", "unresolved", "The scenario does not say whether institutions enforce a ceiling on selected capabilities."],
    "transparentPower": ["present", "editorial-inference", "Humans resent their known custody; the custodian’s role is read as apparent to them."],
    "technicalIndependence": ["unspecified", "unresolved", "The scenario does not say whether communities can operate without an indispensable technical provider."]
  },
  "surveillance-order": {
    "humanAuthority": ["present", "linked-source", "The linked 1984 premise puts a human-led surveillance regime in charge, without ASI."],
    "revisablePower": ["absent", "editorial-inference", "The project reads a lasting totalitarian research prohibition as a mandate citizens cannot effectively revise."],
    "personalExit": ["unspecified", "unresolved", "The scenario does not say whether people have a usable right to leave."],
    "pluralPolities": ["absent", "editorial-inference", "The project reads the global surveillance state as one final order, not several independent polities."],
    "sharedBenefits": ["unspecified", "unresolved", "The scenario does not say whether everyone receives a guaranteed material floor."],
    "privateOwnership": ["unspecified", "unresolved", "The scenario does not say whether private ownership organizes productive resources."],
    "biologicalContinuity": ["present", "linked-source", "The linked premise retains humanity under the surveillance state."],
    "voluntaryTransformation": ["variant-dependent", "unresolved", "A ban on superintelligence research does not settle which other transformations are permitted."],
    "digitalStanding": ["unspecified", "unresolved", "The scenario does not say whether artificial persons have institutional standing."],
    "capabilityLimits": ["present", "linked-source", "The linked premise expressly prohibits superintelligence research."],
    "transparentPower": ["present", "editorial-inference", "The human state visibly enforces the prohibition; this does not claim that every surveillance operation is public."],
    "technicalIndependence": ["variant-dependent", "unresolved", "The regime’s surveillance could rely on concentrated or replaceable infrastructure."]
  },
  "reversion": {
    "humanAuthority": ["present", "editorial-inference", "The retreat leaves human communities without a superior AI ruler; their internal form of human government is not specified."],
    "revisablePower": ["unspecified", "unresolved", "The scenario does not say whether people can effectively replace governing mandates."],
    "personalExit": ["unspecified", "unresolved", "The scenario does not say whether people have a usable right to leave."],
    "pluralPolities": ["unspecified", "unresolved", "The scenario does not say whether several communities govern themselves."],
    "sharedBenefits": ["unspecified", "unresolved", "The scenario does not say whether everyone receives a guaranteed material floor."],
    "privateOwnership": ["variant-dependent", "unresolved", "A low-technology economy could organize production through private or common ownership."],
    "biologicalContinuity": ["present", "linked-source", "The linked Reversion premise retains humans after technological retreat."],
    "voluntaryTransformation": ["inapplicable", "inapplicable", "Advanced transformation is not technically available in this world. That does not establish a prohibition on a feasible choice."],
    "digitalStanding": ["inapplicable", "inapplicable", "This low-technology world contains no advanced artificial persons whose institutional standing could be assessed. Their absence is not a policy of excluding persons."],
    "capabilityLimits": ["unspecified", "unresolved", "Technological retreat prevents ASI, but the premise does not say whether an institution enforces a capability ceiling or whether the technology is simply unavailable."],
    "transparentPower": ["variant-dependent", "unresolved", "The retreat does not settle whether human governing institutions act openly."],
    "technicalIndependence": ["present", "editorial-inference", "The project reads pretechnological life as operating without an indispensable advanced technical provider; this implies neither abundance nor independence from other people."]
  },
  "self-destruction": {
    "humanAuthority": ["absent", "linked-source", "The linked endpoint ends human society, so no human government continues."],
    "revisablePower": ["inapplicable", "inapplicable", "No surviving human society instantiates this condition here. Unknown successor institutions are not treated as an explicit rejection of it."],
    "personalExit": ["inapplicable", "inapplicable", "No surviving human society instantiates this condition here. Unknown successor institutions are not treated as an explicit rejection of it."],
    "pluralPolities": ["inapplicable", "inapplicable", "No surviving human society instantiates this condition here. Unknown successor institutions are not treated as an explicit rejection of it."],
    "sharedBenefits": ["inapplicable", "inapplicable", "No surviving human society instantiates this condition here. Unknown successor institutions are not treated as an explicit rejection of it."],
    "privateOwnership": ["inapplicable", "inapplicable", "No surviving human society instantiates this condition here. Unknown successor institutions are not treated as an explicit rejection of it."],
    "biologicalContinuity": ["absent", "linked-source", "Human extinction is explicit in the linked endpoint."],
    "voluntaryTransformation": ["inapplicable", "inapplicable", "No surviving human society instantiates this condition here. Unknown successor institutions are not treated as an explicit rejection of it."],
    "digitalStanding": ["inapplicable", "inapplicable", "No surviving human society instantiates this condition here. Unknown successor institutions are not treated as an explicit rejection of it."],
    "capabilityLimits": ["inapplicable", "inapplicable", "No surviving human society instantiates this condition here. Unknown successor institutions are not treated as an explicit rejection of it."],
    "transparentPower": ["inapplicable", "inapplicable", "No surviving human society instantiates this condition here. Unknown successor institutions are not treated as an explicit rejection of it."],
    "technicalIndependence": ["inapplicable", "inapplicable", "No surviving human society instantiates this condition here. Unknown successor institutions are not treated as an explicit rejection of it."]
  },
  "departure": {
    "humanAuthority": ["variant-dependent", "unresolved", "Earth retains human government, while settlement authority and the successor-AI veto depend on the offer."],
    "revisablePower": ["unspecified", "unresolved", "The scenario does not say whether people can effectively replace governing mandates."],
    "personalExit": ["variant-dependent", "unresolved", "Return terms and the practical ability to leave settlements depend on the offer."],
    "pluralPolities": ["present", "added-hypothesis", "Earth governs itself while settlers pursue another path; more than one community is an explicit project premise."],
    "sharedBenefits": ["variant-dependent", "unresolved", "Shared tools remain, but maintenance and distribution are not uniformly guaranteed."],
    "privateOwnership": ["unspecified", "unresolved", "The scenario does not say whether private ownership organizes productive resources."],
    "biologicalContinuity": ["present", "added-hypothesis", "The project stipulates biological travel and continued human life, without uploading."],
    "voluntaryTransformation": ["unspecified", "unresolved", "The scenario does not say whether feasible substantial transformation is legally permitted."],
    "digitalStanding": ["unspecified", "unresolved", "The scenario does not say whether artificial persons have institutional standing."],
    "capabilityLimits": ["variant-dependent", "unresolved", "The successor-AI veto changes between offers."],
    "transparentPower": ["present", "added-hypothesis", "The departure offer and Earth’s human government are publicly acknowledged in the project scenario."],
    "technicalIndependence": ["variant-dependent", "unresolved", "Earth and settlements have different dependencies; the provider’s terms remain contested."]
  },
  "constitutional-delegation": {
    "humanAuthority": ["present", "added-hypothesis", "The authored mandate explicitly retains practical human final authority."],
    "revisablePower": ["present", "added-hypothesis", "The authored mandate can genuinely be revised, beyond a paper right."],
    "personalExit": ["unspecified", "unresolved", "The scenario does not say whether people have a usable right to leave."],
    "pluralPolities": ["unspecified", "unresolved", "The scenario does not say whether several communities govern themselves."],
    "sharedBenefits": ["variant-dependent", "unresolved", "Provision can vary with the settlement; a universal material floor is not guaranteed."],
    "privateOwnership": ["variant-dependent", "unresolved", "The economic settlement may use private or common productive ownership."],
    "biologicalContinuity": ["present", "added-hypothesis", "The authored society retains humans as citizens and decision-makers."],
    "voluntaryTransformation": ["unspecified", "unresolved", "The scenario does not say whether feasible substantial transformation is legally permitted."],
    "digitalStanding": ["unspecified", "unresolved", "The scenario does not say whether artificial persons have institutional standing."],
    "capabilityLimits": ["variant-dependent", "unresolved", "Capability restrictions depend on the governing settlement; no uniform ceiling or absence of a ceiling is guaranteed."],
    "transparentPower": ["present", "added-hypothesis", "The authored administrative mandate is public."],
    "technicalIndependence": ["present", "added-hypothesis", "The authored society can maintain and operate practical alternatives to its AI administration."]
  },
  "human-machine-federation": {
    "humanAuthority": ["variant-dependent", "unresolved", "Human final authority depends on the internal constitution; it is not guaranteed throughout this arrangement."],
    "revisablePower": ["variant-dependent", "unresolved", "The power to replace governing mandates depends on the institutional settlement; it is not guaranteed."],
    "personalExit": ["present", "added-hypothesis", "The authored mobility regime explicitly lets residents move between communities."],
    "pluralPolities": ["present", "added-hypothesis", "Several self-governing human and machine polities are the defining authored premise."],
    "sharedBenefits": ["variant-dependent", "unresolved", "Provision can vary with the settlement; a universal material floor is not guaranteed."],
    "privateOwnership": ["variant-dependent", "unresolved", "The economic settlement may use private or common productive ownership."],
    "biologicalContinuity": ["present", "added-hypothesis", "Biological humans remain participants alongside artificial persons."],
    "voluntaryTransformation": ["variant-dependent", "unresolved", "Transformation rules depend on the settlement; neither permission nor prohibition is guaranteed."],
    "digitalStanding": ["present", "added-hypothesis", "The authored federation includes artificial persons as political participants, with differing internal constitutions."],
    "capabilityLimits": ["variant-dependent", "unresolved", "Capability restrictions depend on the governing settlement; no uniform ceiling or absence of a ceiling is guaranteed."],
    "transparentPower": ["present", "editorial-inference", "Named polities openly negotiate borders and movement; the project reads their governing roles as visible, without assuming all operations are disclosed."],
    "technicalIndependence": ["variant-dependent", "unresolved", "Infrastructure may offer practical alternatives or create an indispensable provider; the settlement does not fix this."]
  },
  "compute-oligarchy": {
    "humanAuthority": ["variant-dependent", "unresolved", "Human final authority depends on the internal constitution; it is not guaranteed throughout this arrangement."],
    "revisablePower": ["variant-dependent", "unresolved", "The power to replace governing mandates depends on the institutional settlement; it is not guaranteed."],
    "personalExit": ["unspecified", "unresolved", "The scenario does not say whether people have a usable right to leave."],
    "pluralPolities": ["unspecified", "unresolved", "The scenario does not say whether several communities govern themselves."],
    "sharedBenefits": ["unspecified", "unresolved", "The scenario does not say whether everyone receives a guaranteed material floor."],
    "privateOwnership": ["present", "added-hypothesis", "The authored infrastructure is controlled by private firms or alliances."],
    "biologicalContinuity": ["present", "added-hypothesis", "The authored world retains biological humans using its services."],
    "voluntaryTransformation": ["unspecified", "unresolved", "The scenario does not say whether feasible substantial transformation is legally permitted."],
    "digitalStanding": ["unspecified", "unresolved", "The scenario does not say whether artificial persons have institutional standing."],
    "capabilityLimits": ["variant-dependent", "unresolved", "Capability restrictions depend on the governing settlement; no uniform ceiling or absence of a ceiling is guaranteed."],
    "transparentPower": ["present", "editorial-inference", "The project describes identifiable firms and human institutions exercising power, without claiming that all influence is disclosed."],
    "technicalIndependence": ["absent", "editorial-inference", "The authored infrastructure is indispensable, and changing vendors leaves the dependency intact; there is no practical provider-independent operation."]
  },
  "digital-citizenship": {
    "humanAuthority": ["variant-dependent", "unresolved", "Human final authority depends on the internal constitution; it is not guaranteed throughout this arrangement."],
    "revisablePower": ["unspecified", "unresolved", "The scenario does not say whether people can effectively replace governing mandates."],
    "personalExit": ["present", "added-hypothesis", "Exit alongside citizenship is expressly part of the authored premise."],
    "pluralPolities": ["unspecified", "unresolved", "The scenario does not say whether several communities govern themselves."],
    "sharedBenefits": ["variant-dependent", "unresolved", "Provision can vary with the settlement; a universal material floor is not guaranteed."],
    "privateOwnership": ["variant-dependent", "unresolved", "The economic settlement may use private or common productive ownership."],
    "biologicalContinuity": ["present", "added-hypothesis", "Biological citizens remain alongside artificial persons."],
    "voluntaryTransformation": ["variant-dependent", "unresolved", "Transformation rules depend on the settlement; neither permission nor prohibition is guaranteed."],
    "digitalStanding": ["present", "added-hypothesis", "Standing and representation for hypothetical artificial persons define this project scenario."],
    "capabilityLimits": ["unspecified", "unresolved", "The scenario does not say whether institutions enforce a ceiling on selected capabilities."],
    "transparentPower": ["present", "editorial-inference", "The project reads shared citizenship and representation as acknowledged institutions; it does not infer public access to every decision."],
    "technicalIndependence": ["variant-dependent", "unresolved", "Infrastructure may offer practical alternatives or create an indispensable provider; the settlement does not fix this."]
  },
  "negotiated-ceiling": {
    "humanAuthority": ["present", "added-hypothesis", "Human institutions retain authority in this authored arrangement."],
    "revisablePower": ["present", "added-hypothesis", "Citizens can actually contest and revise the restrictions under the authored premise."],
    "personalExit": ["unspecified", "unresolved", "The scenario does not say whether people have a usable right to leave."],
    "pluralPolities": ["variant-dependent", "unresolved", "The limits may operate across independent polities or within one common authority."],
    "sharedBenefits": ["unspecified", "unresolved", "The scenario does not say whether everyone receives a guaranteed material floor."],
    "privateOwnership": ["variant-dependent", "unresolved", "The economic settlement may use private or common productive ownership."],
    "biologicalContinuity": ["present", "added-hypothesis", "Biological humanity continues in the authored world."],
    "voluntaryTransformation": ["variant-dependent", "unresolved", "Transformation rules depend on the settlement; neither permission nor prohibition is guaranteed."],
    "digitalStanding": ["unspecified", "unresolved", "The scenario does not say whether artificial persons have institutional standing."],
    "capabilityLimits": ["present", "added-hypothesis", "Selected dangerous capabilities face enforced institutional limits."],
    "transparentPower": ["present", "added-hypothesis", "The authored restrictions and authority to impose them are public."],
    "technicalIndependence": ["variant-dependent", "unresolved", "Infrastructure may offer practical alternatives or create an indispensable provider; the settlement does not fix this."]
  },
  "planetary-restoration": {
    "humanAuthority": ["present", "added-hypothesis", "The authored compact explicitly operates under a human mandate."],
    "revisablePower": ["present", "added-hypothesis", "The authored human mandate is explicitly revisable."],
    "personalExit": ["unspecified", "unresolved", "The scenario does not say whether people have a usable right to leave."],
    "pluralPolities": ["unspecified", "unresolved", "The scenario does not say whether several communities govern themselves."],
    "sharedBenefits": ["variant-dependent", "unresolved", "Provision can vary with the settlement; a universal material floor is not guaranteed."],
    "privateOwnership": ["variant-dependent", "unresolved", "The economic settlement may use private or common productive ownership."],
    "biologicalContinuity": ["present", "added-hypothesis", "Biological humanity continues alongside represented nonhuman life."],
    "voluntaryTransformation": ["unspecified", "unresolved", "The scenario does not say whether feasible substantial transformation is legally permitted."],
    "digitalStanding": ["unspecified", "unresolved", "The scenario does not say whether artificial persons have institutional standing."],
    "capabilityLimits": ["present", "editorial-inference", "The project treats enforceable ecological constraints on selected technological projects as capability limits. The ecological reason for those limits is not itself elicited by the questionnaire."],
    "transparentPower": ["present", "added-hypothesis", "The authored ecological mandate is public."],
    "technicalIndependence": ["variant-dependent", "unresolved", "Infrastructure may offer practical alternatives or create an indispensable provider; the settlement does not fix this."]
  }
} as const satisfies Record<string, Record<FeatureId, FeatureRationale>>

export function scenarioRationales(id: string): Record<FeatureId, FeatureRationale> {
  if (!(id in descriptorRationales)) throw new Error(`Missing descriptor rationale: ${id}`)
  return descriptorRationales[id as keyof typeof descriptorRationales]
}
export function scenarioFeatures(id: string): Features {
  const record = scenarioRationales(id)
  return Object.fromEntries(featureIds.map(feature => [feature, record[feature][0]])) as Features
}
export const rationaleBasisLabels: Record<RationaleBasis, string> = {
  "linked-source": "Linked source premise", "added-hypothesis": "Additional project hypothetical",
  "editorial-inference": "Project editorial inference", unresolved: "Unresolved", inapplicable: "Not instantiated here",
}
