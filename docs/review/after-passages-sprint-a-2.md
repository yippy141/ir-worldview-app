# After-passages, Sprint A pass 2

14 September 2026. Every changed public passage, before and after, grouped by rendered page. Read against "The owner's read" in `IR_EDITORIAL_STYLE_GUIDE.md`. Code and tests changed alongside; this file is the prose only. Pass 1 (`after-passages-sprint-a-1.md`) covers the hubs, result chapters, Profile, Library hub, About and root menu; this pass covers the Field Guide, the four theory pages, the ten Decision Patterns, the archetype pages, and the small gaps pass 1 left open.

Not changed, by design: administered questions, options, clarifications, scoring, bank versions, navigation labels and URL structure, the footer, Method, Chinese copy, the archetype content and evidence JSON, and every test-locked provenance sentence on the archetype pages (the owner-mandated beta disclosure, the "Provisional source" labels, the "About the mark" note).

Conditional result passages are marked **[condition]** with the runtime field they depend on. Source-based corrections are marked **[correction]**.

## AI Field Guide (`/ai/field-guide`; `app/ai/field-guide/page.tsx`, `lib/ai-governance-field-guide-content.ts`)

The page is rebuilt around six questions a reader has, in this order: why the six approaches disagree, who may inspect, release, restrict or stop a model, where nearby approaches part ways, the axes behind a result, what the questionnaire leaves out, where to read next, and Futures. The IR ↔ AI cross-read section, the "What it measures / what it does not fully cover" scope cards, the rail legend and the three future vignettes are removed. Section symbols (§1 to §7) are removed; the rail keeps its counter. The six worked readings are authored illustrations of the published decision exercise "Who gets access?" (Larch Research Institute), which the page links to; the "who holds each power" rows are summarized from each approach's atlas card. Nothing on the page is scored, and the page attaches no approach to the reader.

**Title.** Before: "Field Guide | AI Governance Compass" / "Reader's companion to the AI Atlas. Scope notes, eight axes, where archetypes part ways, IR ↔ AI cross-read, and under-modeled perspectives. Explainer only. No scoring or second assessment." After: "Field Guide | AI Governance | IR Worldview Inventory" / "Why six approaches to governing powerful AI disagree, who each would let inspect, release, restrict, or stop a model, and what the questionnaire leaves out."

**Hero.** Before: "AI Field Guide. Compare the institutions behind rival proposals: who can inspect, who can restrict access, and who has authority to set the rules. These are editorial comparisons, not inferred relationships between your Foundation and AI results." Buttons: saved-result link, "Open the AI Atlas", "Profile", "Take the AI questionnaire". After: "Field Guide. Six approaches to governing powerful AI answer the same question differently: who may inspect a model, release it, restrict it, or stop it. This guide works one decision through all six and sets out where each would put those powers. It ends with what the questionnaire cannot see." Buttons: saved-result link, "The six approaches", "Start AI Governance".

**Rail legend.** Before: "What this page is. An explainer. No score, no archetype produced. To get an archetype, take the AI Governance Compass." After: removed.

**Section list.** Before: Scope and limits · Governance dimensions · Where archetypes part ways · IR ↔ AI cross-read · Under-modeled perspectives · Where to start reading · Futures (optional). After: Why they disagree · Who holds each power · Where neighbors part ways · The axes behind a result · What is left out · Where to read next · Futures.

**§1 Scope (removed).** Before: heading "What this module measures, and what it does not"; deck "The Compass is a structured reader for AI governance instincts. It is not a technical exam, expertise credential, or full map of AI politics."; two cards, "What it measures" (Governance instincts under pressure / Tradeoffs across eight axes / How policy logics cluster) and "What it does not fully cover" (Technical expertise / Institutional feasibility / The whole politics of AI). After: the one limit a reader needs moves to the axes section as one sentence: "It says nothing about technical expertise, and nothing about whether the institutions you favor can be built in time." The rest is covered by "What the questionnaire leaves out".

**Why do the six approaches disagree? (new).** Deck: "Take the decision from the exercise Who gets access?. The fictional Larch Research Institute holds a model that improves software research and can assist offensive cyber work. Its own tests show useful assistance and no autonomous attacks. It must choose access for the next three months: publish the weights, admit qualified outside evaluators to a secure enclave with the weights kept inside, or run a monitored hosted service and keep evaluation in house. Each approach reaches for a different first question, and the first question does most of the deciding."

- Precautionary Steward, "What can the model do?": "The cyber-assistance finding puts the burden on release to prove itself. The enclave keeps outside testing possible and a pause available if the picture worsens. Published weights cannot be recalled, and for this approach that settles it."
- Strategic Competitor, "Who else gains?": "Published weights hand the capability to rivals and to anyone building on it. The hosted service or the enclave keeps the edge and the chokepoint. The enclave is acceptable only if screening keeps adversarial teams out, and the three-month window is a reason to decide fast, before the capability is matched elsewhere."
- Coordination Architect, "Which choice could other labs and states adopt as a rule?": "An enclave run under published criteria, with findings that travel, can be copied across borders. A lone decision to publish or withhold sets no standard. This approach wants the independent admission panel, because a rule the developer can veto is not a rule."
- Democratic Guardrailist, "Who can hold Larch to account?": "The enclave is worth having only if evaluators can publish criticism Larch cannot veto. The hosted service leaves the public dependent on the developer's word. The capability ceiling matters less here than whether an outside body has standing to say no."
- State Capacity Builder, "Who could run the enclave?": "Screening staff, budget, and wait times are fixed. A scheme the institute cannot staff will fail in practice whatever it promises on paper. If the evaluation capacity is missing, the hosted service is the honest option, and building that capacity is the real decision."
- Open Ecosystem Builder, "Who is shut out?": "The enclave and the hosted service both make Larch the gatekeeper of what can be studied. Publishing the weights lets researchers outside the screened circle reproduce and contest the findings. The misuse evidence is a reason for wider scrutiny, and this approach doubts that scrutiny can be delegated to a gatekeeper."

Foot: "These readings are authored illustrations. Nothing on this page is scored, and none of them is attached to you. To make the decision yourself, open the exercise."

**Who should be able to inspect, release, restrict, or stop a model? (new).** Deck: "The same four powers, and where each approach would put them." Table columns: Approach · Inspect and release · Restrict and stop.

- Precautionary Steward: "Outside evaluators test for dangerous capability before release. Release is staged and gated on those tests." / "The bodies that set the thresholds narrow access or pause when warning signs accumulate, even at commercial or geopolitical cost."
- Strategic Competitor: "National security agencies and the state's own technical staff. Release follows what keeps a capability edge under rivalry." / "Export controls and limits on diffusion to rivals. A stop counts only if it survives competitive pressure, so a unilateral pause is suspect."
- Coordination Architect: "Shared verification and evaluation frameworks that cross borders. Release under rules that travel between firms and states." / "Common standards and incident mechanisms agreed across rival blocs. A stop by one state or one lab sets no rule."
- Democratic Guardrailist: "Publicly answerable bodies with standing to audit. Release through a process the public can contest." / "Accountable institutions, with rights protections on deployment and monitoring. Labs, security agencies, and technical insiders do not get the last word."
- State Capacity Builder: "Staffed regulators with audit, reporting, and procurement powers. Release depends on whether the state can supervise what it approves." / "The same bodies, where they exist. Where the state cannot enforce, a paper restriction restricts no one."
- Open Ecosystem Builder: "Anyone with access. Broad release lets many parties examine and reproduce the work." / "Checks on gatekeepers and closed bottlenecks. A stop imposed by incumbents on safety grounds is a claim to be tested."

**Where nearby approaches part ways.** Before: deck "Pairs whose fingerprints overlap on most axes. The split on one or two axes is what tells them apart."; a Pair / What they share / Where they split table. After: deck "Four pairs agree on most of the questionnaire and split on one point. The split is the argument worth having."; four cards.

- Democratic Guardrailist and Precautionary Steward. Before: shared "Both insist that frontier-only safety claims are not enough; both want stronger checks before broad deployment." split "Guardrailist binds the check to public oversight and procedural legitimacy; Precautionary Steward binds it to threshold-based caution about the capability itself." After: shared ground "Both want a stronger check before broad deployment than a lab's own safety case." argument "They disagree about what the check answers to. The Steward binds it to the capability itself: cross a threshold and the burden of proof rises, whoever is in charge. The Guardrailist binds it to public oversight: a check the public cannot contest is a private arrangement, however cautious."
- Strategic Competitor and State Capacity Builder. Before: shared "Both treat AI governance as a state-level problem and accept that real instruments matter more than rhetoric." split "Strategic Competitor reads the system through capability edge under rivalry; State Capacity Builder reads it through who can actually supervise, procure, and verify in practice." After: shared ground "Both treat AI governance as a problem for states, and both distrust rules that exist only on paper." argument "The Competitor asks what keeps a capability edge under rivalry and reads institutions as instruments of that contest. The Capacity Builder asks who can supervise, procure, and verify in practice, and reads the edge as worthless to a state that has become a customer of the firms it should govern."
- Open Ecosystem Builder and Coordination Architect. Before: shared "Both worry that frontier capability is concentrating in a few labs and a few states." split "Open Ecosystem Builder treats wider access as the cure; Coordination Architect treats durable cross-border rules and standards as the cure." After: shared ground unchanged in substance; argument "The Ecosystem Builder answers with access: put models and tools in more hands, so no gatekeeper decides what can be studied or built. The Architect answers with rules: cross-border standards and verification that outlast any one lab's advantage. Each sees the other's cure as the disease. Open weights defeat verification; shared rules can become a club of the already powerful."
- Coordination Architect and Democratic Guardrailist. Before: shared "Both want enforceable rules and are skeptical of voluntary lab self-governance alone." split "Coordination Architect looks outward to multilateral standards and shared verification; Democratic Guardrailist looks inward to publicly answerable domestic institutions." After: shared ground "Both want enforceable rules and distrust voluntary self-governance by labs." argument "The Architect looks outward: legitimacy comes from standards and verification that rival states accept. The Guardrailist looks inward: legitimacy comes from domestic institutions the public can hold to account. When a multilateral body and a national legislature disagree about a model, the two take opposite sides."

**The axes behind a result.** Before: heading "Governance dimensions"; deck "The vocabulary the AI module uses. Names, one-line description, and opposing poles only. It assigns no positions or scores." After: deck "The questionnaire places you on these axes. Each runs between two poles, and either end is a position. Your result is the approach whose positions lie nearest yours. It says nothing about technical expertise, and nothing about whether the institutions you favor can be built in time." The eight axis names, explainers and pole labels are unchanged (they live in the atlas content); the em dash between the poles becomes a middle dot.

**IR ↔ AI cross-read (removed).** Before: three cells pairing an IR concept with an AI axis ("Identity and legitimacy" / "Security rivalry" / "Markets and dependence"), including the unsourced gloss "In IR, competition can be self-fulfilling. A security-dilemma reading turns defensive moves into offensive ones, and escalation follows." After: removed. The section inferred an equivalence between the Foundation and the AI questionnaire that neither is built to support; the security-dilemma sentence is now on the Realism page, where Jervis is cited.

**What the questionnaire leaves out.** Before: heading "Perspectives the current model only partly covers"; deck "These are not hidden scored archetypes. They are adjacent shelves to keep in view when the six modeled families feel too narrow."; cards labelled "labor / automation" etc. with "Current coverage:". After: deck "Six ways of arguing about AI that the six approaches touch without scoring. Each ends with a question to put to your own result."; the id label is dropped; "Current coverage:" becomes "In the questionnaire:".

- Labor, automation, and bargaining power. Before: "AI governance is also workplace governance: who captures productivity gains, who bears displacement, and whether workers have real leverage over deployment." / "The model touches present harms and human control, but it does not separately score labor politics, unions, or distributional conflict at work." / "Would your AI result change if worker voice, not frontier safety or state capacity, were the starting point?" After: "AI governance is also workplace governance. Who captures the productivity gains, who is displaced, and whether workers have any say over deployment are governance questions before they are economic ones." / "The questions touch present harms and human control. They do not ask about unions, labor law, or distributional conflict at work." / "Would your result change if worker voice, and neither frontier safety nor state capacity, were the starting point?"
- Surveillance and platform power. Before: "AI systems can deepen monitoring, prediction, and behavioral control by firms and states long before frontier-risk questions appear." / "The Compass tracks oversight and legitimacy, but it does not fully model surveillance capitalism, policing, or platform governance as their own traditions." / "Where does your result treat concentration as a safety problem, and where should it treat concentration as a political-power problem?" After: "AI systems deepen monitoring, prediction, and behavioral control by firms and states long before any frontier-risk question arises." / "The questions cover oversight and legitimacy. They do not treat surveillance, policing, or platform governance as traditions with their own answers." / "Where does your result treat concentration as a safety problem, and where should it treat concentration as a problem of political power?"
- Environmental and compute externalities. Before: "Compute, data centers, water, energy, minerals, and grid demand are material constraints, not background conditions." / "The current axes can register capacity and control instincts, but they do not directly score climate, energy, or extractive-infrastructure politics." / "Would your threshold for deployment change if compute externalities were visible on every capability decision?" After: "Compute, data centers, water, energy, minerals, and grid demand are material constraints on what can be built and where." / "The questions register capacity and control instincts. They do not ask about climate, energy, or the politics of extraction." / "Would your threshold for deployment move if the compute cost were visible on every capability decision?"
- Global South dependence and sovereignty. Before: "Many states will meet AI through imported cloud, foreign model access, compliance costs, and infrastructure dependence rather than frontier-lab choice." / "State Capacity Builder and Open Ecosystem Builder point toward this problem, but the Compass does not fully model development strategy or dependency theory." After: "Most states will meet advanced AI through imported cloud, foreign model access, compliance costs, and infrastructure they do not own. Few will ever choose a frontier lab's release policy." / "State Capacity Builder and Open Ecosystem Builder point at this problem. The questions do not ask about development strategy or dependency." Question unchanged.
- Chinese official framings. Before: "Chinese governance language combines sovereignty, development, safety, state capacity, and multilateralism in ways that do not map cleanly onto U.S. debate categories." / "The reading shelf includes China and global-governance lenses, but the scored archetypes are not built from Chinese official doctrine as a separate family." / "Which parts of your result are about AI governance itself, and which are about the political vocabulary you are used to reading?" After: "Chinese governance language combines sovereignty, development, safety, state capacity, and multilateralism in ways that do not map onto the categories of the U.S. debate." / "The reading lists include Chinese and global-governance sources. None of the six approaches is built from Chinese official doctrine." / "Which parts of your result are about governing AI, and which are about the political vocabulary you are used to reading?"
- Open-source and anti-incumbency politics. Before: "Open access can be a technical practice, a market strategy, a civil-liberties claim, or a challenge to state-lab concentration." / "Open Ecosystem Builder carries this concern, but the model does not split open-source governance into its security, industrial, and anti-monopoly strands." After: "Open access can be a technical practice, a market strategy, a civil-liberties claim, or a challenge to concentration in a few labs and states." / "Open Ecosystem Builder carries this concern as one position. The questions do not separate its security, industrial, and anti-monopoly strands." Question unchanged.

**Where to read next.** Before: three cells: "From the Compass / Read your nearest neighbor / Your archetype card already names a neighbor. The useful comparison is where two archetypes share most of the fingerprint but split on one axis. / Open the AI Atlas"; "From IR / Start with the cross-read / Three meeting points where IR vocabulary and AI governance vocabulary line up. The translation is uneven on purpose. / Open the cross-read"; "Browsing / Use the compact map / The Atlas maps governance patterns. The Field Guide explains each one without adding another assessment. / Open the AI Atlas". After: deck "Four readings that every approach page starts from. Each approach page adds its own first reading and its strongest critique."; the four shared start-here readings from the existing reading list (title, author, year, why it matters), then the six approach names as links.

**Futures.** Before: "§7 · Appendix · Futures / Optional · Non-scored. Three reading prompts used inside Field Guide entries to test how each archetype responds to a different shape of the next decade. They are not predictions and they do not enter any score on any page in this product. Browse the whole Futures catalogue or consider your preferred conditions. This separate exercise leaves your AI Governance result unchanged." plus three vignettes ("Concentration tightens", "Open weights hold", "Multilateral baseline holds"). After: "The six approaches argue about the next release. Futures asks about the world after many releases: nineteen possible futures, from continued human rule to authority passing to artificial systems, and the conditions you would want in each. Browse the whole Futures catalogue or say which conditions you would want. Futures is a separate exercise and starts empty; it does not change an AI Governance result." The vignettes are deleted; the catalogue link keeps its exact text.

## AI Governance hub (`/ai`; `app/ai/page.tsx`)

**Example result.** Before: "An example, from a synthetic set of answers. Precautionary Steward. 'The burden of proof rises…'" After: "Illustrative result explanation. Precautionary Steward, with Democratic Guardrailist as the nearest rival. 'The burden of proof rises with capability: you wanted thresholds and outside testing before broad deployment. The nearest alternative, Democratic Guardrailist, binds the same check to public oversight instead of to the capability itself.' Your own result names the approach, the rival, and the question your answers left open." **[correction]** The quoted explanation is authored, not generated by the result page, so it is labelled as an illustration. The pairing is one the questionnaire produces: the checked-in standard-mode fixture in `tests/fixtures/instrument-version-golden.json` (v22) scores Precautionary Steward first with Democratic Guardrailist nearest.

## Foundation result (`/results/[payload]`; `components/results/foundation-result-story.tsx`)

**Chapter 02, "What did the work".** Before (always, when rows exist): "Your answers on {dimension} did most of the work: there you sided with the {primary} reading." then, only when a row is negative, "On {dimension 2} you leaned the other way; that is where {runner-up} gets its support[, and why it stayed close]." After, by state:

- **[condition: the largest signed contribution is positive and unique]** "Your answers on {dimension} did most of the work: there they counted for {primary} more than for {runner-up}." A positive term means the answers on that dimension counted for the primary reading more than for the runner-up; the old wording ("sided with the reading") implied endorsement of the tradition's beliefs.
- **[condition: two or more dimensions share the largest positive contribution, within 1e-6]** "Your answers on {dimension A} and {dimension B} did most of the work, in equal measure: there they counted for {primary} more than for {runner-up}."
- **[condition: no dimension has a positive contribution and at least one is negative; because the primary still leads, the two rounded family scores are level]** "No dimension counted for {primary} over {runner-up}; after rounding, the two readings are level and the name is the tie-break."
- **[condition: every contribution is zero]** "Your positions sat at the midpoint on every dimension where {primary} and {runner-up} differ, so nothing pulled toward either. Read them as a tie."
- **[condition: the most negative row is below zero; appended to any of the first three]** "On {dimension} they counted the other way; that is where {runner-up} gets its support" and, **[condition: lowDifferentiation]**, ", and why it stayed close."
- **[condition: legacy link or no contribution rows]** unchanged: "This link predates the dimension-by-dimension comparison, so those terms cannot be shown. The rows in chapter 01 still apply." The figure note for that state: Before: "Exact contribution terms are unavailable for this issued legacy payload. Reconstructing them would require an exact completed-form tuple that the link does not carry." After: "The dimension-by-dimension terms cannot be shown for this link. The rows in chapter 01 still apply."

**Chapter 03.** Title. Before: "Where this reading sits among the eight". After: "Where this reading sits". Copy. Before (always): "{interpretation summary, repeated from the hero} The highlighted readings pair that posture with {primary} and {runner-up}. Because they sit close, the rival argument is worth reading before the name settles." After: "The matrix highlights {primary} and {runner-up} under your posture, beside the readings that share it." then **[condition: lowDifferentiation, the gap between the two rounded family scores is under the calibrated threshold]** "In your result the two finished close, so the rival argument is worth reading before the name settles." otherwise "Open it to compare the two, and to see which readings a different posture would have produced." Matrix cells are a display grid; the closeness claim now follows the differentiation flag, not cell adjacency. Figure label. Before: "The eight Foundation readings". After: "The Foundation readings".

**Chapter 06.** Before: "A reviewed case shows which consideration you put first when the reading leaves two in tension. The case keeps its evidence window and its rival interpretation." After: "One reviewed case where two of these considerations collide. Work out which you would put first; the case keeps its evidence window and its rival interpretation."

## Library hub (`/explore`; `content/explore/hub.en.json`, content version 23.3.0)

**Hero.** Before: "Four traditions, eight Foundation readings, four thinkers, seven decision patterns." After: "What the Foundation scores against, and what to set your result beside." **[correction]** There are ten Decision Patterns, not seven; the count is dropped rather than fixed because it did no work.

**Section headings.** "The eight Foundation readings" → "Foundation readings"; "The four traditions" → "Traditions"; "The seven dimensions" → "Dimensions". Decision Patterns intro: "Seven authored ways of approaching a hard choice. Compare them; none is assigned to you." → "Authored ways of approaching a hard choice. Compare them; none is assigned to you." Directory disclosure: "All seven Decision Patterns" → "All Decision Patterns". Coverage disclosure: "What the four traditions leave out" → "What the traditions leave out". Kept: "Four thinkers, each read from cited work within a dated window" (the count is true and tells the reader how small the directory is) and "fourteen questions".

## Root menu (`/`; `content/root.ts`)

**Atlas.** Before: "Four traditions, eight Foundation readings, four thinkers, and dated public positions: reference points to compare your result against." After: "The traditions, readings, thinkers, and decision patterns to compare your result against." The directory has no dated public positions yet.

## Foundation archetypes (`/archetypes`; `app/archetypes/page.tsx`)

**Header.** Before: "A Foundation result combines an explanatory lens with a strategic posture. The name is a reading of a continuous profile, not a permanent type or a rank." After: "Each reading pairs a way of explaining world politics with a strategic posture: apply an advantage, or hold back. Two readings per lens, one for each posture."

**Orientation note.** Before: "Normative orientation does not rank the result. Order-first, Conditional, and Justice-first are equal-weight readings within any archetype." After: "Inside any reading, Order-first, Conditional, and Justice-first say how it weighs order against justice. None ranks above another."

**Lens question (R).** Before: "What turns an agreement into durable restraint?" After: "What turns an agreement into lasting restraint?"

**Foot.** Before: "Close Foundation results can resolve as a two-lens blend. Blends keep the same posture sign and use a combined code label." After: "A result that sits close between two lenses is shown as a blend: both codes, one posture."

## Foundation archetype detail (`/archetypes/[slug]`; `app/archetypes/[slug]/page.tsx`)

The provenance disclosure stays as the one page-level note (collapsed "Research and publication status", unchanged), the hero limit beside the tradition link stays, "About the mark" stays, and every source keeps its "Provisional source" label. What changed:

**"The case, the objection, and the test" intro.** Before: "Read the interpretation alongside the conditions that would make it less persuasive." After: "Read the argument for the reading beside the best argument against it."

**"Three equal-weight orientations" intro.** Before: "These variants change the normative emphasis inside the same archetype. Their order does not imply a moral ladder." After: "The same reading, weighing order against justice three ways. None ranks above another."

**"Historical comparison" intro.** Before: "This is a comparison, not an identity or endorsement. It anchors one part of the reading in a documented argument or practice." After: "One documented argument or practice that shares part of this reading's logic, and where the likeness stops."

**Provisional-evidence note.** Text unchanged ("This historical comparison uses provisional source metadata and remains pending research review."); it now sits at the head of "Sources and further reading", beside the sources it qualifies, instead of between the comparison and the name note.

**Footer.** Before: "Archetypes summarize a continuous, multidimensional profile. They do not change the underlying Foundation score or assign people, organizations, or traditions to a fixed type. Automated checks are pretesting, not editorial, expert, or methodological validation." After: "A reading names the part of a continuous profile that scored highest. It changes no score, and it assigns nobody to a type. Automated checks are pretesting, not editorial, expert, or methodological validation."

## Theory page template (`/explore/[slug]`; `app/explore/[slug]/page.tsx`)

**Back link.** "← All perspectives" → "← Library" (top and foot).

**Related Foundation archetypes.** Before: "The Foundation uses this tradition as evidence for one explanatory lens. It does not classify everyone who draws on the tradition, and it does not replace the archetype resolved from a full score." After: "Two Foundation readings draw on this tradition, one for each posture. Reading about the tradition does not replace the archetype resolved from a full score."

**Subtraditions intro.** Before: "This tradition is not monolithic. These are the main strands within it." After: "The main strands, and where they part."

**Issue readings intro.** Before: "Arguments this tradition tends to find persuasive, and how it interprets three recurring debates in contemporary foreign policy." After: "Three running debates, then the arguments it finds persuasive."

**Thinkers section.** Before: heading "Evidence-coded references"; "The reference directory presents dated, scoped public positions with source records. It is a comparison layer: a person or organization is never assigned to this tradition or to a Foundation archetype." After: heading "Thinkers"; "Thinkers read from cited work within a dated window, with the sources shown. No thinker is assigned to this tradition or to a Foundation reading." The link text "Browse the reference directory →" is unchanged.

**Modeling note label.** "What this page models (and what it does not)" → "Which strands the Foundation scores".

## Decision Pattern template (`/explore/atlas/[id]`; `components/worldview-profile/worldview-profile-page.tsx`)

**Empty-case aside.** Before: "The verified library does not currently use this pattern as a best-fit or strongest rival reading. The page keeps the gap visible instead of filling it with an inferred example." After: "Nothing in the reviewed library names this pattern as its best fit or its strongest rival yet. The gap stays visible until something does."

**Empty-case section.** Before: "No reviewed case currently names {pattern} in one of the two reviewed reading positions. Cases attached to other patterns stay off this page." After: "No reviewed case names {pattern} as its best fit or its strongest rival."

**Coverage line, one case.** Before: "Thin coverage: one reviewed case is available. Treat it as an example; it cannot provide comprehensive support for the pattern." After: "One reviewed case: an example of the logic, and no proof of it." No case: "No reviewed case currently names this pattern as a best fit or strongest rival." → "No reviewed case names this pattern as its best fit or strongest rival."

**Analogy intro.** Before: "Editorial teaching device · explanatory, not evidence" After: "A way to picture the pattern, and the point where the picture misleads."

**Domains intro.** Before: "Domain results are saved separately and do not change the Foundation." After: "The same logic, put to a case about force and to a case about technology."

**AI entry.** Before: "This pattern has no pattern-specific AI reading. The AI Governance Compass adds a separate AI result when you complete it." / "Open the AI Governance Compass" After: "AI Governance has no reading for this pattern. Its questionnaire gives a result of its own." / "Open AI Governance". Perspective entry. Before: "Perspective Runs compare role-based answers with the Foundation without changing it." After: "Perspective Runs put the same questions to you from another actor's seat."

**Method and status.** Before: three paragraphs ("Decision Patterns are authored editorial reading aids. They are not calculated from, matched to, or assigned to a user's answers, and they are not population types or fixed identities." / "Only cases that explicitly name this pattern as the best fit or strongest rival appear here. Other reviewed cases remain off this page." / "Historical case readings are teaching comparisons. They do not validate the scoring model, assign governments or public figures to patterns, or settle which interpretation of a case is correct."). After: "Decision Patterns are authored ways of reasoning, written for comparison. They are not calculated from, matched to, or assigned to a user's answers, and they describe no population type." / "A case appears here only when its reviewed reading names this pattern as the best fit or the strongest rival. The reading is a comparison: it does not settle what the case means, and it assigns no government or public figure to a pattern."

## Source-based corrections in the theory pages

- **[correction] Realism, overview.** The old text attributed the structural premise to realism as a whole ("The argument rests on the structure of the international system, not a claim that human nature is evil"). Classical realism rests on a drive for power in human nature (Morgenthau, *Politics Among Nations*, already in the reading list). The overview now says so and reserves the structural argument for structural realists.
- **[correction] Realism, great-power rivalry.** "Conflict risk is highest in the transitional period when power parity is closest" is a power-transition claim, not a realist consensus; balance-of-power theorists expect parity to restrain. The reading now names the disagreement and attributes the transition argument to Gilpin's account of hegemonic war (*War and Change in World Politics*, in the reading list).
- **[correction] Constructivism, overview.** The old example (the United States and Canada versus the United States and China, "even when capabilities in a given situation are similar") was a loose paraphrase with an inaccurate premise. It is replaced with Wendt's own example from *Social Theory of International Politics* (in the reading list): five hundred British nuclear weapons worry Washington less than five North Korean ones.
- **[correction] Constructivism, reading list.** *Rules for the World* is by Michael Barnett and Martha Finnemore, in that order; the author line read "Martha Finnemore & Michael Barnett".
- **[correction] Critical political economy, reading list.** Gilpin's *The Political Economy of International Relations* was described as "a more liberal framing". Gilpin was a realist; the note now calls it a realist's survey of the liberal, nationalist and Marxist approaches.
- **[correction] Institutionalism, great-power rivalry (issue comparison).** "The historical record of major-power peace among trading democracies" is now attributed to democratic-peace research, the finding that established democracies rarely fight one another, which is the tradition's own subtradition on the page.
- **[narrowed] Critical political economy, humanitarian intervention.** "Notes that intervention patterns correlate with economic stakes as much as with the severity of humanitarian crises" was stated as a fact; it is now stated as the tradition's argument.
- **[narrowed] Coverage notes.** The old notes said the Foundation's scenarios "probe" each tradition. The public default is the fourteen-question core, which has two Likert items per dimension and no scenarios; the notes now say which dimensions carry each tradition in the core and that longer forms add the cases.

## Theory pages (`/explore/[slug]`, `lib/explore-content.ts`)

Unchanged: slugs, family keys, names, section order, neighbor relationships, every book title, author (one author-order correction noted below), and thinker. Sentence-level changes below; the page template's own passages are listed after the four traditions.

### Realism

**Tagline.** Before: "World politics is shaped by the distribution of power and the absence of any authority above states." After: "No authority stands above states, so power and self-help decide more than rules or good intentions."

**Overview.** Before: "Realism begins with a blunt structural premise: there is no government above governments. In a world where no authority can reliably punish defection or guarantee protection, states have to look after themselves. The argument rests on the structure of the international system, not a claim that human nature is evil. Even states that want peace cannot be certain others feel the same, so they prepare for the worst. ¶ Realists argue that this structural logic, anarchy plus uncertainty, drives recurring patterns in world politics: arms races, balance-of-power dynamics, and the tendency for states to compete even when they would prefer not to. The security dilemma captures the tragic version of this: measures taken for defense often look offensive from outside, producing arms spirals that no one wanted. ¶ Realism is not a single view. Classical realists emphasize human nature and statecraft; structural realists emphasize the architecture of the system itself. Offensive realists argue that the structure pushes states toward maximizing power; defensive realists argue it often rewards restraint. What they share is the insistence that power and self-help are durable features of world politics, not temporary problems to be fixed by better institutions or warmer feelings." After: "Realism starts from a blunt fact: there is no government above governments. Nobody can reliably punish a state that cheats or protect a state that is attacked. So states look after themselves. Structural realists put the whole argument on that fact. Classical realists add a second one, a drive for power in human nature that statecraft has to manage. Both conclude that even a state that wants peace cannot be sure its neighbors do, and prepares for the worst. ¶ From that premise realists expect recurring patterns: arms races, balancing coalitions, and competition between states that would each prefer to cooperate. The security dilemma is the tragic version. Weapons bought for defense look like preparation for attack from across the border, and the reply looks the same from the other side. Nobody wanted the spiral, and nobody can safely step out of it. ¶ Realism is a family of arguments, and the family quarrels. Offensive realists hold that anarchy pushes great powers to seek as much power as they can, because there is no safe point to stop. Defensive realists reply that the system often rewards restraint and punishes expansion. What the family shares is the claim that power and self-help are permanent features of world politics, and that better institutions or warmer feelings will not remove them."

**Core claims.**

- Before: "Anarchy, the absence of a central authority above states, is the defining structural condition of world politics."
  After: "Anarchy, the absence of a central authority above states, is the condition everything else follows from."
- Before: "Under anarchy, states cannot be certain of others' intentions, so they must provide for their own security through self-help."
  After: "Because states cannot be sure of one another's intentions, each must provide for its own security."
- Before: "The distribution of power (polarity) shapes patterns of conflict and cooperation more than any other variable."
  After: "The distribution of power among states, whether one leads or several compete, shapes conflict and cooperation more than any other factor."
- Before: "Relative gains matter: a cooperative arrangement that advantages a rival more than oneself weakens one's long-run position."
  After: "Relative gains matter. A deal that strengthens a rival more than it strengthens you weakens your position over time."
- Before: "The security dilemma: defensive measures often appear threatening from outside, generating arms spirals that no party intended."
  After: "Defensive measures look threatening from outside. The security dilemma produces arms spirals that no party intended."

**Subtraditions.**

- Classical realism. Before: "Associated with Morgenthau and Niebuhr. Grounds the realist argument in a psychological drive for power, rather than structure alone. Emphasizes statecraft, the role of leaders, and the tragic character of international politics." After: "Morgenthau and Niebuhr ground the argument in a human drive for power, with the structure of the system as a second factor. The tradition concerns itself with statecraft, the judgment of leaders, and the tragic character of politics among nations."
- Structural realism (neorealism). Before: "Associated with Waltz. Shifts the explanation from human drives to the system's anarchic structure and the distribution of capabilities among states. Leaders matter less; the structure constrains and shapes behavior." After: "Waltz moves the explanation from human nature to the shape of the system: anarchy plus the distribution of capabilities. Leaders matter less. The structure rewards some behavior and punishes the rest, whoever is in office."
- Offensive realism. Before: "Associated with Mearsheimer. The structure of anarchy pushes states toward maximizing power because there is no safe stopping point. States can never know when they have enough security to stop competing." After: "Mearsheimer argues that anarchy pushes great powers to maximize their power, because a state can never know how much security is enough. The safest position is to be the strongest, so competition never settles."
- Defensive realism. Before: "Associated with Glaser, Van Evera, and Snyder. Argues that the structure often rewards restraint and that miscalculation, domestic pathologies, or offensive spirals cause most conflicts. Anarchy does not by itself require endless expansion." After: "Glaser, Van Evera, and Snyder argue that the system often rewards restraint. Most wars come from miscalculation, domestic pathologies, or spirals that both sides could have avoided. Anarchy by itself does not require endless expansion."

**What it emphasizes.**

- Before: "The permanence of uncertainty about others' intentions"
  After: "Uncertainty about other states' intentions, which never goes away"
- Before: "Relative power: capabilities matter in relation to the position of other states"
  After: "Relative power: what a state can do compared with its rivals"
- Before: "The security dilemma: defensive moves often look offensive from outside"
  After: "The security dilemma: defensive moves read as offensive from across the border"
- Before: "The tendency of states to balance against, rather than bandwagon with, rising powers"
  After: "Balancing: states tend to line up against a rising power, not behind it"
- Before: "Skepticism that rules, norms, or institutions can reliably constrain powerful states under pressure"
  After: "Skepticism that rules, norms, or institutions can hold a powerful state when its interests are at stake"

**What it often underweights.**

- Before: "How domestic politics, regime type, and bureaucratic capacity produce variation across states with similar external constraints"
  After: "Why states under similar external pressure behave differently: regime type, domestic coalitions, bureaucratic capacity"
- Before: "The role of institutions in making cooperation more durable across lower-stakes issue areas"
  After: "How institutions make cooperation last in lower-stakes areas such as trade and standards"
- Before: "How identity, legitimacy, and social expectations shape what counts as a threat"
  After: "How identity, legitimacy, and expectation decide what counts as a threat in the first place"
- Before: "Structural economic factors: dependence, supply chain vulnerability, capital flows"
  After: "Economic structure: dependence, supply-chain exposure, and who controls credit"
- Before: "The possibility that norms diffuse and genuinely change state behavior over time"
  After: "The possibility that norms spread and change what states are willing to do"

**Arguments it finds persuasive.**

- Before: "Overextension erodes the power base that makes a state secure; empires typically collapse from excessive commitments"
  After: "Overextension eats the power base that makes a state secure; empires tend to collapse under commitments they cannot carry"
- Before: "Major-power peace depends on favorable power distributions, not transformations of political character"
  After: "Peace among major powers rests on a favorable distribution of power, not on a change in their political character"
- Before: "Attempts to build liberal order often serve the interests of the most powerful state that designed it"
  After: "A liberal order tends to serve the interests of the most powerful state that designed it"
- Before: "States with similar strategic positions tend to behave similarly, regardless of regime type or ideology"
  After: "States in similar strategic positions behave in similar ways, whatever their ideology"

**How it reads major issues.**

- Great-power rivalry. Before: "Reads rising-power competition as structurally driven. The same pattern recurs regardless of ideology, regime type, or declared intentions. The rising power expands its reach; the established power balances. Conflict risk is highest in the transitional period when power parity is closest." After: "The rivalry is built into the structure. A rising power extends its reach; the established power balances; declared intentions and regime type change little. Realists disagree about timing. Balance-of-power theorists expect rough parity to restrain both sides, while power-transition arguments, including Gilpin's account of hegemonic war, expect the danger to peak when a rising state finds the existing order no longer fits its interests."
- Trade and technology decoupling. Before: "Reads economic interdependence primarily as a vulnerability. Reliance on adversary supply chains creates leverage. Technology leadership translates directly into military advantage, making restrictions rational even at significant economic cost." After: "Interdependence with an adversary is a vulnerability first and a benefit second. Reliance on a rival's supply chains hands it leverage, and a lead in technology becomes a lead in arms. Restricting trade is rational even at real economic cost, because relative gains count."
- Humanitarian intervention. Before: "Deeply skeptical. States invoke humanitarian language to justify actions driven by strategic interests. The non-intervention norm protects weaker states as much as it shields bad actors. Realists prefer restraint unless core interests are directly engaged, and warn that intervention tends to create new instabilities." After: "Realists are deeply skeptical. Governments reach for humanitarian language to justify what strategic interest already recommends. The rule against intervention protects weak states as much as it shelters bad ones. Intervene only where core interests are engaged, and expect the intervention to create instabilities of its own."

**Neighboring traditions.**

- institutionalist. Before: "Both work within a state-centric frame and accept anarchy as the baseline. Institutionalists argue that repeated interaction and shared rules can make cooperation durable even without enforcement. Realists are skeptical that this holds under real pressure." After: "Both start from states under anarchy. Institutionalists argue that repeated dealings and shared rules can make cooperation last even without an enforcer. Realists doubt that any of it holds once a powerful state is under real pressure."
- criticalPoliticalEconomy. Before: "Both are skeptical of liberal optimism, but locate the driving logic differently. Realists focus on security competition and power distribution; critical PE focuses on economic structure, capital flows, and dependence as the real constraints on state autonomy." After: "Both distrust liberal optimism, and they locate the driving force in different places. Realists watch security competition and the distribution of military power. Critical political economy watches capital, production, and dependence as the limits on what a state can do."

**Reading list, starter.**

- Theory of International Politics. Before: "Kenneth Waltz: The foundational text of structural realism. It argues that the distribution of power, rather than human nature, explains recurring patterns of conflict." After: "Kenneth Waltz: The founding text of structural realism. The distribution of power among states, and neither human nature nor the character of governments, explains the recurring patterns of conflict."
- The Tragedy of Great Power Politics. Before: "John Mearsheimer: The clearest statement of offensive realism: why major powers can never be satisfied with the status quo." After: "John Mearsheimer: The clearest statement of offensive realism: why great powers cannot rest content with the status quo."
- Politics Among Nations. Before: "Hans Morgenthau: Classical realism's core text, focused on the statecraft required to manage power competition in a world without common authority." After: "Hans Morgenthau: The core text of classical realism, on the statecraft needed to manage power in a world with no common authority."

**Reading list, go deeper.**

- War and Change in World Politics. Before: "Robert Gilpin: A structural account of how hegemonic transitions produce conflict. Argues that wars of redistribution become more likely when rising powers find the existing order no longer reflects their interests. Directly relevant to US-China competition." After: "Robert Gilpin: A structural account of hegemonic transition. Wars of redistribution become likelier when a rising power finds that the existing order no longer reflects its interests. Bears directly on the United States and China."
- Perception and Misperception in International Politics. Before: "Robert Jervis: The essential treatment of the security dilemma and cognitive bias in strategic decision-making. Shows how defensive intentions can be read as offensive, producing spirals that no party wanted." After: "Robert Jervis: The essential treatment of the security dilemma and of bias in strategic judgment. Shows how defensive intentions get read as offensive, and how the spiral follows."
- The Origins of Alliances. Before: "Stephen Walt: Argues that states balance against threats, not just power, refining Waltz's structural realism to account for why states balance the way they do. A key text in defensive realist thinking." After: "Stephen Walt: States balance against threats, not against power alone. A refinement of Waltz that explains why alliances form the way they do, and a key text in defensive realism."

**Reading list, read the critique.**

- After Hegemony. Before: "Robert Keohane: The strongest institutionalist challenge to realism. Shows that international cooperation can be sustained without a dominant enforcer, directly challenging the realist expectation that order depends on hegemony." After: "Robert Keohane: The strongest institutionalist challenge. Cooperation can be sustained without a dominant enforcer, against the realist expectation that order depends on hegemony."
- Anarchy Is What States Make of It. Before: "Alexander Wendt: The constructivist challenge: anarchy does not have a fixed logic. The meaning of rivalry and self-help depends on identities and relationships that states construct through interaction, rather than structure alone." After: "Alexander Wendt: The constructivist challenge. Anarchy has no fixed logic; what rivalry and self-help mean depends on the identities and relationships states build through interaction."

**Associated thinkers (data retained; not rendered on the page).**

- Hans Morgenthau (1904–1980). Before: "The founding figure of classical realism. Grounded the realist argument in a concept of the national interest defined in terms of power, and insisted that statecraft is a discipline requiring tragic judgment, not rule-following." After: "The founding figure of classical realism. Defined the national interest in terms of power and treated statecraft as a discipline of tragic judgment that no set of rules can replace."
- Kenneth Waltz (1924–2013). Before: "Founded structural realism (neorealism). Shifted the causal argument from human nature to the architecture of the international system, defined by anarchy and the distribution of capabilities, and set the terms for theoretical debate across two generations of IR scholars." After: "Founded structural realism. Moved the cause of conflict from human nature to the architecture of the system, anarchy and the distribution of capabilities, and set the terms of debate for two generations."
- John Mearsheimer (b. 1947). Before: "The leading proponent of offensive realism. Argues that the structure of anarchy compels great powers to maximize relative power because there is no safe stopping point, making conflict recurrent regardless of ideology." After: "The leading offensive realist. Great powers must maximize relative power because there is no safe stopping point, so conflict recurs whatever the ideology of the day."
- Robert Jervis (1940–2021). Before: "The essential scholar of the security dilemma and strategic misperception. Showed how cognitive biases and the offense-defense balance interact to produce arms spirals and wars that no party intended." After: "The essential scholar of the security dilemma. Showed how cognitive bias and the balance between offense and defense combine to produce arms races and wars nobody chose."

**How the Foundation models it.** Before: "Realism is the most directly modeled tradition in the current Foundation. The security competition dimension (uncertainty, rivalry, self-help) captures its core logic, and the restraint-vs-maximization dimension captures the debate within realism about grand strategy. The strategic technology and ally trade scenarios also probe realist instincts about relative gains. The model treats offensive realism, defensive realism, and classical realism as variations within a shared structural frame rather than distinguishing among them." After: "Two dimensions carry the realist reading: security competition (uncertainty, rivalry, self-help) and restraint (whether to press an advantage or hold back). The fourteen core questions ask two per dimension. Longer forms add cases such as a rival gaining ground and a supplier catching up in semiconductors. Offensive, defensive, and classical realism are not separated: a high realist score fits all three."

### Institutionalism

**Tagline.** Before: "Shared rules, monitoring, and repeated interaction can make cooperation durable even without a world government." After: "Shared rules, monitoring, and repeated dealings can make cooperation last without a world government."

**Overview.** Before: "If realism treats anarchy as a trap, institutionalism treats it as a challenge that can be managed. The core argument is that states cooperate less than they could because they lack reliable information about each other's intentions and cannot verify compliance, rather than because they are inherently hostile. International institutions, including treaties, organizations, monitoring bodies, and dispute-resolution mechanisms, can solve those problems without requiring trust or a world government. ¶ The logic is about changing incentive structures over time. When violations are visible and reputations accumulate across many interactions, the short-term gains from defection become less attractive. States that invest in institutions gain access to cooperation they could not sustain through bilateral deal-making alone. ¶ Liberal institutionalism also takes domestic politics seriously. The "two-level game" insight holds that governments negotiate simultaneously with foreign counterparts and their own domestic constituencies. It helps explain why states with similar external environments sometimes reach very different outcomes. Regime type, parliamentary constraints, and interest-group politics all shape what states bring to the table." After: "Where realism sees anarchy as a trap, institutionalism sees a problem that can be managed. States cooperate less than they could, the argument runs, because they cannot see one another's intentions and cannot check whether the other side is keeping its word. Hostility is not the main obstacle; missing information is. Treaties, organizations, monitoring bodies, and dispute panels supply the information. They do not require trust, and they do not require a world government. ¶ The mechanism works on incentives over time. When violations are visible and reputations follow a state from one negotiation to the next, cheating today costs deals tomorrow. Governments that invest in institutions gain access to cooperation they could never sustain through one-off bargains. ¶ Liberal institutionalism also takes domestic politics seriously. A government negotiates with foreign counterparts and with its own constituencies at the same time, the two-level game. That is why states under similar external pressure can reach very different outcomes: regime type, parliaments, and interest groups decide what a government can bring to the table and what it can deliver afterward."

**Core claims.**

- Before: "Information problems limit cooperation because states cannot verify intentions or detect cheating, even when they are not inherently hostile."
  After: "Cooperation fails for want of information. States cannot verify intentions or detect cheating, even when nobody is hostile."
- Before: "International institutions reduce transaction costs: they make it easier to reach, implement, and enforce agreements."
  After: "Institutions lower the cost of reaching, carrying out, and enforcing agreements."
- Before: "Repeated interaction under rules lengthens time horizons and diminishes the attractiveness of short-term defection."
  After: "Repeated dealings under rules lengthen time horizons. The gain from cheating once shrinks beside the cost of being shut out later."
- Before: "States pursue absolute gains: both parties benefit from cooperation even if the gains are asymmetric."
  After: "States can pursue absolute gains: both sides benefit from a deal even when one benefits more."
- Before: "Domestic politics filters international bargaining: regime type, parliamentary constraints, and interest coalitions shape what governments can credibly commit to."
  After: "Domestic politics filters every bargain. Regime type, legislatures, and interest coalitions decide what a government can credibly promise."

**Subtraditions.**

- Liberal institutionalism (neoliberalism). Before: "The mainstream strand, associated with Keohane and Nye. Focuses on how international organizations and regimes lower the cost of verifying compliance and make cooperation self-sustaining across issue areas, even as power distributions shift." After: "The mainstream strand, built by Keohane and Nye. International organizations and regimes lower the cost of checking compliance, so cooperation can outlast shifts in the distribution of power."
- Two-level game / domestic politics. Before: "Associated with Putnam. States simultaneously negotiate internationally and manage domestic ratification constituencies. 'Win-sets,' the range of agreements that can survive domestic approval, shape what is achievable abroad." After: "Putnam's model: a government bargains abroad and manages ratification at home at the same time. The set of agreements that can survive domestic approval, the win-set, decides what is achievable abroad."
- Democratic peace theory. Before: "The empirical claim that democracies rarely fight each other, explained institutionally by the constraints legislatures, publics, and transparency norms impose on executive discretion over the use of force." After: "The finding that established democracies rarely fight one another, explained through the checks that legislatures, publics, and open debate place on a leader's freedom to use force."
- Global governance / regime complexity. Before: "A more recent strand examining how overlapping institutional arrangements, including trade regimes, climate agreements, and human rights law, interact. They can produce layered governance without a single hierarchy, sometimes reinforcing one another and sometimes conflicting." After: "A newer strand studies how overlapping arrangements, trade regimes, climate agreements, human rights law, interact. They govern in layers without a single hierarchy, and the layers sometimes reinforce and sometimes obstruct one another."

**What it emphasizes.**

- Before: "Absolute gains: both parties can benefit from cooperation even if one gains relatively more"
  After: "Absolute gains: both sides can win from a deal even when one wins more"
- Before: "How institutions lower the transaction costs of reaching and verifying agreements"
  After: "How institutions cut the cost of reaching and checking agreements"
- Before: "The role of monitoring and transparency in reducing cheating"
  After: "Monitoring and transparency as the cure for cheating"
- Before: "Domestic politics and regime type as filters on what states can credibly commit to"
  After: "Domestic politics and regime type as filters on what a state can credibly promise"
- Before: "Repeated interaction: longer time horizons reduce the pull of short-term defection"
  After: "Repeated dealings: longer time horizons weaken the pull of cheating now"

**What it often underweights.**

- Before: "How the most powerful states shape which institutions get built, and in whose interest"
  After: "How the most powerful states decide which institutions get built, and in whose interest"
- Before: "Structural economic power: who sets the rules, who pays the costs of adjustment"
  After: "Structural economic power: who writes the rules and who pays the cost of adjusting to them"
- Before: "The extent to which institutions can be bypassed or dismantled under acute security pressure"
  After: "How easily institutions are bypassed or dismantled once a state feels its security is at stake"
- Before: "Identity and legitimacy: why some institutions are seen as credible by some actors but not others"
  After: "Identity and legitimacy: why the same institution looks credible to some actors and rigged to others"
- Before: "The difficulty of building institutions for genuinely novel problems before the political will exists"
  After: "The difficulty of building institutions for a new problem before the political will exists"

**Arguments it finds persuasive.**

- Before: "Trade regimes create export constituencies that make future protectionism politically costly"
  After: "Trade regimes create export constituencies that make a later turn to protectionism politically costly"
- Before: "Transparency mechanisms in arms control reduce uncertainty without requiring prior trust"
  After: "Transparency in arms control reduces uncertainty without requiring prior trust"
- Before: "Alliance management benefits from institutional frameworks that prevent miscalculation"
  After: "Alliances run better inside institutions that prevent miscalculation"
- Before: "International courts and dispute-resolution bodies reduce the cost of peaceful conflict resolution"
  After: "Courts and dispute panels make settling a quarrel peacefully cheaper than escalating it"

**How it reads major issues.**

- Great-power rivalry. Before: "Argues rivalry can be managed through sustained institutional engagement. Trade and investment ties create domestic constituencies for stability. Military confidence-building measures and arms-control regimes reduce miscalculation risk. The framework points to economic interdependence as a structural brake on conflict escalation." After: "Rivalry can be managed through sustained engagement. Trade and investment create domestic constituencies for stability on both sides. Confidence-building measures and arms control cut the risk of miscalculation. Interdependence is read as a brake on escalation, though a brake that can fail."
- Trade and technology decoupling. Before: "Warns that broad decoupling is costly to all parties and erodes the trading rules that have underpinned growth since 1945. Prefers targeted measures, such as export controls narrowly scoped to genuinely dual-use items, embedded in multilateral frameworks rather than unilateral broad-spectrum restrictions." After: "Broad decoupling costs every party and erodes the postwar trading rules that made growth possible. The better course is targeted: export controls scoped to items with real military use, embedded in multilateral arrangements, instead of unilateral restrictions across whole sectors."
- Humanitarian intervention. Before: "More permissive than realism when institutional authorization exists. R2P and UN Security Council authorization make intervention more legitimate and sustainable. Skeptical of unilateral action, but supports multilateral intervention with clear objectives, exit criteria, and post-conflict institution-building." After: "More permissive than realism when an institution authorizes the action. The responsibility to protect and a Security Council mandate make intervention more legitimate and easier to sustain. Unilateral action is suspect. Collective action with clear objectives, an exit plan, and institution-building afterward is defensible."

**Neighboring traditions.**

- realist. Before: "Both are state-centric and accept anarchy as the baseline. They disagree over whether institutions can shift behavior independently of the underlying power distribution. Institutionalists say yes; realists are skeptical." After: "Both start from states under anarchy. The dispute is whether institutions can change behavior independently of the distribution of power. Institutionalists say yes. Realists say only until it matters."
- constructivist. Before: "Both look beyond raw power. The key difference is the causal variable: institutionalists emphasize rules and repeated interaction; constructivists emphasize shared identity and the social meaning of cooperation." After: "Both look past raw power. They differ on the cause. Institutionalists point to rules and repeated dealings; constructivists point to the shared identities that give the rules their meaning."

**Reading list, starter.**

- After Hegemony. Before: "Robert Keohane: The core argument for why international institutions can sustain cooperation even after the dominant power that created them declines." After: "Robert Keohane: The core argument for why institutions can sustain cooperation after the dominant power that built them has declined."
- Diplomacy and Domestic Politics. Before: "Robert Putnam: The two-level game paper on how domestic politics constrains and shapes international bargaining." After: "Robert Putnam: The two-level game paper: how domestic politics constrains and shapes what can be agreed abroad."
- Power and Governance in a Partially Globalized World. Before: "Robert Keohane: A more recent reflection on the limits and possibilities of global governance." After: "Robert Keohane: A later reflection on what global governance can and cannot do."

**Reading list, go deeper.**

- After Victory: Institutions, Strategic Restraint, and the Rebuilding of Order After Major Wars. Before: "G. John Ikenberry: Explains why post-war hegemons sometimes bind themselves through institutions rather than simply imposing order. Argues that constitutional settlements lower the costs of running a liberal order, which bears on whether US-led institutions are durable." After: "G. John Ikenberry: Why a victorious power sometimes binds itself through institutions instead of simply imposing order. A constitutional settlement lowers the cost of running a liberal order, which bears on whether the US-led institutions can outlast US primacy."
- The Evolution of Cooperation. Before: "Robert Axelrod: Shows through iterated prisoner's dilemma experiments how cooperation can emerge among self-interested actors without central authority. The game-theoretic foundation for much institutionalist reasoning about what makes agreements self-sustaining." After: "Robert Axelrod: Repeated prisoner's dilemma experiments show how cooperation can emerge among self-interested players with no central authority. The game-theoretic ground under much institutionalist reasoning."
- A New World Order. Before: "Anne-Marie Slaughter: Argues that global governance operates primarily through transgovernmental networks of regulators, judges, and legislators building connections across borders, rather than through formal international organizations alone." After: "Anne-Marie Slaughter: Global governance runs largely through networks of regulators, judges, and legislators working across borders, with formal international organizations as only part of the picture."

**Reading list, read the critique.**

- The False Promise of International Institutions. Before: "John Mearsheimer: A sharp realist challenge. Argues that institutions reflect the preferences of powerful states and cannot independently constrain behavior when core interests are at stake. The most direct engagement with institutionalist claims." After: "John Mearsheimer: The sharpest realist challenge. Institutions reflect what powerful states already want and cannot constrain them when core interests are at stake. The most direct engagement with institutionalist claims."
- War and Change in World Politics. Before: "Robert Gilpin: Argues that international order is underwritten by hegemony, not institutions. When the hegemonic power declines, the order it created does not sustain itself through institutional momentum. It collapses or is renegotiated by force." After: "Robert Gilpin: International order rests on hegemony. When the hegemon declines, the order it built does not carry on under its own momentum; it collapses or is renegotiated by force."

**Associated thinkers (data retained; not rendered on the page).**

- Robert Keohane (b. 1941). Before: "The central figure of liberal institutionalism. Developed the theoretical case that international institutions can sustain cooperation among self-interested states even after the dominant power that created them declines." After: "The central figure of liberal institutionalism. Made the theoretical case that institutions can sustain cooperation among self-interested states after the power that created them has declined."
- Joseph Nye (b. 1937). Before: "Co-developed complex interdependence with Keohane and introduced the concept of soft power, the ability to shape others' preferences through attraction rather than coercion. Influential across both academic and policy communities." After: "Developed complex interdependence with Keohane and introduced soft power, the ability to shape what others want through attraction instead of coercion. Read in both academic and policy circles."
- G. John Ikenberry (b. 1954). Before: "Argues that the post-war US-led liberal order succeeded partly because the United States bound itself through institutions, making the order legitimate to other states. Central to debates about whether liberal order can survive US retrenchment." After: "Argues that the postwar US-led order succeeded partly because the United States bound itself through institutions, which made the order acceptable to others. Central to the debate over whether that order survives US retrenchment."
- Robert Putnam (b. 1941). Before: "Developed the two-level game framework: international negotiations are simultaneously domestic political contests. Governments negotiate abroad while managing ratification constraints at home, and this domestic politics shapes what is achievable internationally." After: "Built the two-level game: an international negotiation is also a domestic political contest, and what a government can ratify at home sets what it can agree abroad."

**How the Foundation models it.** Before: "Institutionalism is one of the most directly modeled traditions. The institutions dimension captures the core question: do rules shape outcomes independently? The domestic filters dimension captures liberal arguments about how internal politics shape foreign policy. The scenarios on institutional capture and sanctions-monitoring probe institutionalist instincts about when rules fail. This tradition is modeled with reasonable depth." After: "Two dimensions carry the institutionalist reading: institutions (can rules change behavior on their own?) and domestic filters (how internal politics shapes what a government can promise). The fourteen core questions ask two per dimension. Longer forms add cases on what holds an alliance together and on an institution that rising powers reject."

**Which strands the Foundation scores.** Before: "This page models liberal institutionalism, the tradition associated with Keohane, Nye, and the study of international regimes and cooperation under anarchy. It does not model the full liberal tradition in IR. Other liberal strands include commercial liberalism (trade reduces the incentive for conflict), republican liberalism (democratic institutions shape foreign policy), and sociological liberalism (transnational actors and networks matter). They share a general optimism about cooperation but differ substantially in their explanatory emphasis. The Foundation primarily tests institutionalist instincts." After: "This page covers liberal institutionalism, the tradition of Keohane, Nye, and the study of regimes and cooperation under anarchy. Liberalism in International Relations is wider. Commercial liberalism holds that trade reduces the incentive for war; republican liberalism that democratic institutions shape foreign policy; sociological liberalism that transnational actors and networks matter. They share an optimism about cooperation and differ on what explains it. The Foundation tests institutionalist instincts and does not score the other strands separately."

### Constructivism

**Tagline.** Before: "The meaning of threats, alliances, and interests is partly constituted by identity, norms, and shared social expectations." After: "What counts as a threat, an ally, or an interest depends on identity, norms, and shared expectation."

**Overview.** Before: "Constructivism asks a different kind of question: where do interests come from? Realists and institutionalists largely treat state interests as given: states want security, growth, and survival. Constructivists argue that what counts as a threat, what counts as a win, and what kinds of cooperation are imaginable all depend on shared identities, social expectations, and the historical context that shapes how states understand themselves and each other. ¶ The same military move can be threatening or reassuring, depending entirely on the relationship between the states involved. The United States and Canada do not experience each other's armed forces as threatening; the United States and China do, even when capabilities in a given situation are similar. Military math alone cannot explain that difference. It requires understanding how identities and historical relationships shape what actors mean by their actions. ¶ Constructivism also takes norms seriously as causal factors, not just as rhetorical cover for power. The post-1945 spread of human rights norms, the rise of anti-colonial international law, and changing standards around the use of chemical weapons all represent genuine shifts in what states consider legitimate. Those shifts have had real policy consequences." After: "Constructivism asks a prior question: where do interests come from? Realists and institutionalists mostly take them as given. States want security, growth, and survival, and the argument starts there. Constructivists reply that what counts as a threat, what counts as a win, and which kinds of cooperation are even imaginable depend on shared identities, social expectations, and the history through which states came to understand one another. ¶ Wendt's example makes the point. Five hundred British nuclear weapons worry Washington less than five North Korean ones. The arithmetic of capability cannot explain that difference. Britain is a friend and North Korea an enemy, and those identities decide what a weapon means. The same military move reassures one neighbor and alarms another, depending on the relationship between them. ¶ Norms, on this view, do causal work of their own. The spread of human rights norms after 1945, the growth of anti-colonial international law, and the taboo on chemical weapons changed what states treat as legitimate. Governments that break those norms pay a price even when nobody can enforce them."

**Core claims.**

- Before: "Interests emerge through processes of identity formation, norm diffusion, and shared expectations; they are not given."
  After: "Interests are made, through identity formation, the spread of norms, and shared expectation. They are not given by the structure alone."
- Before: "Anarchy does not have a single fixed logic; its consequences depend on the identities and relationships states construct within it."
  After: "Anarchy has no single logic. What it produces depends on the identities and relationships states build within it."
- Before: "Norms are causal, not merely rhetorical. Internalized norms shape what actors consider legitimate even in the absence of coercive enforcement."
  After: "Norms cause behavior. Once internalized, they decide what actors consider legitimate, with or without enforcement."
- Before: "Recognition, status, and social belonging motivate state behavior in ways that material calculation alone cannot explain."
  After: "Recognition, status, and belonging move states in ways that material calculation cannot explain on its own."
- Before: "Change in world politics happens through socialization, persuasion, and the gradual redefinition of what is considered a legitimate interest."
  After: "Change comes through socialization, persuasion, and the gradual redefinition of what a legitimate interest is."

**Subtraditions.**

- Conventional constructivism. Before: "The mainstream strand, associated with Wendt, Finnemore, Katzenstein, and Checkel. Takes a broadly scientific approach, arguing that norms and identities are empirically important variables that can be studied systematically alongside material factors." After: "The mainstream strand of Wendt, Finnemore, Katzenstein, and Checkel. Norms and identities are treated as variables that can be studied systematically alongside material factors, with the ordinary tools of social science."
- Critical constructivism. Before: "More skeptical of the mainstream's positivist leanings. Draws on Frankfurt School critical theory to examine how norms work, whose interests they serve, and how they can be contested and changed." After: "Distrusts the mainstream's scientific ambitions. Drawing on Frankfurt School critical theory, it asks how norms work, whose interests they serve, and how they can be contested and changed."
- Poststructuralism. Before: "Associated with Der Derian, Campbell, and Ashley. More radical in questioning the stable identities and fixed interests that even conventional constructivism tends to assume. Focuses on discourse, representation, and the politics of security as a speech act." After: "Der Derian, Campbell, and Ashley go further, questioning the stable identities and fixed interests that even conventional constructivism assumes. The focus is discourse, representation, and security as something that is spoken into being."

**What it emphasizes.**

- Before: "The social construction of threats: who is doing something matters as much as what they are doing"
  After: "The making of threats: who is acting matters as much as what they are doing"
- Before: "How identities and norms shape the menu of legitimate options for state behavior"
  After: "How identities and norms set the menu of options a state can legitimately choose from"
- Before: "Legitimacy as a real causal variable, not just rhetorical packaging for power"
  After: "Legitimacy as a cause in its own right"
- Before: "The possibility of norm diffusion: how standards spread and become internalized across the international system"
  After: "The spread of norms: how a standard travels and becomes internalized across the system"
- Before: "The role of recognition, status, and social expectations in driving state behavior beyond narrow calculation"
  After: "Recognition, status, and expectation as motives that narrow calculation misses"

**What it often underweights.**

- Before: "Material power and structural constraints: hard limits on what norms can achieve against determined resistance"
  After: "Material power and structural limits: what norms cannot achieve against determined resistance"
- Before: "The difficulty of changing norms against the resistance of powerful actors who benefit from the status quo"
  After: "How hard it is to change a norm when powerful actors profit from the old one"
- Before: "Economic structural power and its role in shaping which ideas gain traction internationally"
  After: "Economic structure and its part in deciding which ideas gain a hearing"
- Before: "Crisis behavior: norms tend to be most contested precisely when they are most needed"
  After: "Crisis behavior: norms are most contested at the moment they are most needed"

**Arguments it finds persuasive.**

- Before: "Longstanding enemies can genuinely become friends through sustained interaction and identity change, with Franco-German relations after 1945 as the clearest example"
  After: "Old enemies can become friends through sustained interaction and a change of identity; France and Germany after 1945 are the clearest case"
- Before: "International law works partly because states internalize its obligations, not just because they fear punishment"
  After: "International law works partly because states internalize its obligations; fear of punishment is only part of the story"
- Before: "The spread of human rights norms since 1945 represents a genuine transformation, not just rhetorical window-dressing"
  After: "The spread of human rights norms since 1945 is a real transformation, whatever its gaps"

**How it reads major issues.**

- Great-power rivalry. Before: "Examines how threat perceptions are constructed through historical relationships, identity narratives, and strategic culture. The same military capability can be read as defensive or offensive depending on shared understandings. Constructivists point to mutual misrecognition, or failures of acknowledgment, as a driver of conflict spirals beyond what material factors alone predict." After: "Threat perception is built from history, identity narratives, and strategic culture. The same capability reads as defensive or offensive depending on the shared understanding between the two states. Failures of recognition, each side denying the other's standing, can drive a spiral further than the material facts alone would predict."
- Trade and technology decoupling. Before: "Focuses on the framing: 'decoupling' and 'supply-chain security' are not neutral technical descriptions but constructions that activate particular identities (economic nationalism, existential competition) and foreclose others (mutual dependence, shared governance). The narrative shapes the policy as much as the underlying material reality." After: "The framing is the policy. 'Decoupling' and 'supply-chain security' are not neutral descriptions. They summon certain identities, economic nationalism, existential competition, and push others out of view, mutual dependence, shared governance. Once the frame is set, the frame can fulfill itself."
- Humanitarian intervention. Before: "The tradition that best explains why the post-1990s norm of humanitarian intervention emerged when it did. Norm entrepreneur networks, the evolving meaning of sovereignty as responsibility, and the diffusion of R2P are prime constructivist cases. The tradition also raises critical questions about whose suffering activates the norm and whose does not." After: "The tradition best placed to explain why the norm of humanitarian intervention appeared when it did. Networks of norm entrepreneurs, sovereignty redefined as responsibility, and the spread of the responsibility to protect are its prime cases. It also asks the uncomfortable question: whose suffering activates the norm, and whose does not."

**Neighboring traditions.**

- institutionalist. Before: "Both look beyond raw power. The key difference is the causal variable: institutionalists emphasize rules and monitoring; constructivists emphasize the shared identities and social expectations that give rules meaning in the first place." After: "Both look past raw power. Institutionalists point to rules and monitoring. Constructivists point to the shared identities and expectations that give the rules their meaning in the first place."
- criticalPoliticalEconomy. Before: "Both are critical of the positivist mainstream in IR. Constructivism focuses on ideas and norms; critical PE focuses on economic structures and class. The two traditions sometimes converge in asking whose interests a given set of norms actually serves." After: "Both criticize the positivist mainstream. Constructivism works on ideas and norms; critical political economy on economic structure and class. They meet when either asks whose interests a given set of norms serves."

**Reading list, starter.**

- Anarchy Is What States Make of It. Before: "Alexander Wendt: The seminal article arguing that anarchy does not have a fixed meaning; its consequences depend on the identities and relationships that states construct." After: "Alexander Wendt: The article that made the argument: anarchy has no fixed meaning, and what it produces depends on the identities and relationships states construct."
- The Culture of National Security. Before: "ed. Peter Katzenstein: A set of empirical applications showing how constructivist ideas about norms and identity shape concrete security-policy decisions." After: "ed. Peter Katzenstein: Empirical studies of how norms and identity shaped concrete security decisions."
- Rules for the World. Before: "Martha Finnemore & Michael Barnett: An examination of how international organizations develop their own institutional logics and shape state behavior beyond what their member states originally intended." After: "Michael Barnett & Martha Finnemore: How international organizations develop logics of their own and shape state behavior beyond what their founders intended."

**Reading list, go deeper.**

- Social Theory of International Politics. Before: "Alexander Wendt: The full theoretical treatment of constructivism. Distinguishes three cultures of anarchy, Hobbesian, Lockean, and Kantian, and argues that state identities are both constructed and capable of change. More demanding than the 1992 article but the definitive statement." After: "Alexander Wendt: The full statement. Distinguishes three cultures of anarchy, Hobbesian, Lockean, and Kantian, and argues that state identities are constructed and can change. Harder going than the 1992 article, and definitive."
- International Norm Dynamics and Political Change. Before: "Martha Finnemore and Kathryn Sikkink: Introduces the norm life cycle of emergence, cascade, and internalization, then explains how norms spread and gain causal force without being enforced by a central authority. One of the most cited articles in constructivist IR." After: "Martha Finnemore and Kathryn Sikkink: The norm life cycle: emergence, cascade, internalization. Explains how a norm spreads and gains force without a central enforcer. Among the most cited articles in constructivist IR."
- The Chemical Weapons Taboo. Before: "Richard Price: An empirical case study of how a norm became robust and nearly universal despite the strategic advantages chemical weapons can offer. Shows constructivist arguments at work on a hard case." After: "Richard Price: How a norm became nearly universal despite the battlefield advantages chemical weapons can offer. The constructivist argument tested on a hard case."

**Reading list, read the critique.**

- Rationalist Explanations for War. Before: "James Fearon: A rationalist challenge to explanations that rely on misperception, identity, or social construction. Argues that bargaining failure is the fundamental puzzle in explaining why wars happen when they are costly to both sides, rather than cultural or ideational factors." After: "James Fearon: A rationalist challenge to explanations built on misperception, identity, or construction. The puzzle is why wars happen at all when they cost both sides, and the answer lies in bargaining failure."
- The Great Delusion: Liberal Dreams and International Realities. Before: "John Mearsheimer: A realist attack on liberal internationalism that also challenges the constructivist claim that norms can transform international politics. Argues that nationalism and realist logic reliably defeat attempts to spread liberal order through socialization." After: "John Mearsheimer: A realist attack on liberal internationalism that also disputes the claim that norms can transform world politics. Nationalism and realist logic, it argues, reliably defeat attempts to spread liberal order through socialization."

**Associated thinkers (data retained; not rendered on the page).**

- Alexander Wendt (b. 1958). Before: "The central theorist of conventional constructivism. His 1992 article 'Anarchy Is What States Make of It' established constructivism as a mainstream approach, arguing that anarchy has no fixed logic. Its consequences depend on the identities and relationships states construct." After: "The central theorist of conventional constructivism. His 1992 article 'Anarchy Is What States Make of It' brought the approach into the mainstream: anarchy has no fixed logic, and its consequences depend on the identities states construct."
- Martha Finnemore (b. 1959). Before: "Demonstrated empirically that international organizations actively shape state interests rather than just serving them. With Kathryn Sikkink, developed the norm life cycle of emergence, cascade, and internalization as a framework for understanding how norms spread." After: "Showed that international organizations shape what states want, and do not merely serve it. With Kathryn Sikkink, set out the norm life cycle of emergence, cascade, and internalization."
- Peter Katzenstein (b. 1945). Before: "Helped establish constructivism's empirical footing in security studies through The Culture of National Security. Edited and contributed to foundational work showing how norms and identity shaped German, Japanese, and US security policy." After: "Gave constructivism its empirical footing in security studies through The Culture of National Security, showing how norms and identity shaped German, Japanese, and US policy."
- Nicholas Onuf (b. 1941). Before: "Coined the term 'constructivism' in an IR context. Developed a rules-based framework arguing that social reality, including the rules governing international life, is constructed through speech acts and shared practices." After: "Coined 'constructivism' for International Relations. Argued that social reality, including the rules of international life, is built through speech acts and shared practice."

**How the Foundation models it.** Before: "Constructivism is modeled through the norms-and-identity dimension, which captures questions about whether identity shapes interests and whether legitimacy matters independently of power. The scenario on former rivals transforming also probes constructivist instincts about identity change. The current question bank does not fully capture the constructivist debate about norm diffusion, socialization, and the conditions under which identity change is possible. These are areas for future expansion." After: "One dimension carries the constructivist reading, norms and identity: whether recognition and legitimacy shape what states want. The fourteen core questions ask two on it. Longer forms add a case on a rival that democratizes and turns cooperative. Nothing asks how norms spread or when identities change, so the reading is broader than the questions behind it."

### Critical political economy

**Overview.** Before: "Critical political economy starts from a different set of puzzles. It is less interested in who won the last great-power competition than in asking who sets the rules of the international economy, who benefits from them, and why some states have far less room to maneuver than their formal sovereignty might imply. The tradition draws on Marxist economics, dependency theory, and economic sociology to argue that the structure of global capitalism shapes world politics in ways that conventional security analysis misses. ¶ Formal sovereignty does not equal actual independence. A state that must roll over its external debt every six months, whose exports consist of a single commodity, and whose currency is pegged to that of a much larger economy faces real constraints that do not show up in its formal legal status. Critical PE scholars argue that these structural conditions explain patterns of alignment, crisis, and development outcomes alongside military power and institutional design. ¶ The tradition also attends to who builds the rules. The institutions that govern international trade, investment, and finance were designed mostly by wealthy states in periods of their own dominance. Whether those institutions serve broad interests or narrow ones, and whether reform from within is possible, remain running debates within and around this tradition." After: "Critical political economy starts from a different puzzle. It cares less about who won the last great-power contest than about who writes the rules of the world economy, who profits from them, and why some states have far less room to move than their sovereignty on paper suggests. It draws on Marxist economics, dependency theory, and economic sociology to argue that the structure of global capitalism shapes world politics in ways that security analysis does not see. ¶ Formal sovereignty is one thing; independence is another. A state that must roll over its debt every six months, sells one commodity, and pegs its currency to a much larger economy faces limits that appear nowhere in its legal status. Those limits, the tradition argues, explain alignment, crisis, and development as much as armies and institutions do. ¶ The tradition also asks who built the rules. The institutions that govern trade, investment, and finance were designed mostly by wealthy states at the height of their dominance. Whether they serve broad interests or narrow ones, and whether they can be reformed from inside, are open arguments within the tradition and around it."

**Core claims.**

- Before: "The structure of the world economy, including who controls production, finance, and access to markets, shapes state autonomy independent of military power."
  After: "The structure of the world economy, who controls production, finance, and access to markets, limits what states can do, independently of military power."
- Before: "Formal sovereignty does not equal actual autonomy: debt structures, currency dependence, and commodity specialization impose real constraints on developing states."
  After: "Sovereignty on paper is not autonomy. Debt, currency dependence, and reliance on one export impose real limits on developing states."
- Before: "The international institutions governing trade and finance were designed in periods of Western dominance and structurally reflect those interests."
  After: "The institutions that govern trade and finance were built during Western dominance and carry those interests in their design."
- Before: "Class interests and the imperatives of capital accumulation drive foreign economic policy alongside state interests."
  After: "Class interests and the demands of capital accumulation drive foreign economic policy alongside the interests of the state."
- Before: "Economic crises are not random shocks but reflect structural contradictions in how global capitalism is organized and reproduced."
  After: "Economic crises are not random shocks. They express contradictions in how global capitalism is organized."

**Subtraditions.**

- Marxist political economy. Before: "Grounds analysis in the dynamics of capital accumulation, class struggle, and the state as an instrument of class interest. Imperialism, the extension of capitalist accumulation abroad, is a structural tendency rather than a mere policy choice. Associated with Lenin, Gramsci, and in contemporary IR with Robert Cox and Stephen Gill." After: "Grounds the analysis in capital accumulation, class struggle, and the state as an instrument of class interest. Imperialism, the extension of accumulation abroad, is a structural tendency, whatever any one government intends. Lenin and Gramsci are the roots; in IR, Robert Cox and Stephen Gill."
- Dependency theory. Before: "Developed by Prebisch, Cardoso, and the ECLAC school in Latin America. Argues that core-periphery relations in the world economy systematically disadvantage developing states: terms of trade deteriorate over time, capital flows upward, and industrialization in the periphery is distorted by the requirements of the core." After: "Grew out of Prebisch and the ECLAC school in Latin America and was developed by Cardoso, Faletto, and Frank. Core-periphery relations work against developing states: terms of trade worsen over time, capital flows upward, and industry in the periphery grows in the shape the core requires."
- World-systems theory. Before: "Associated with Wallerstein. Extends dependency theory into a historical sociology of capitalism as a single world-system, with core, semi-periphery, and periphery zones whose relative positions are structurally reproduced across cycles of accumulation." After: "Wallerstein extends dependency into a historical sociology of capitalism as one world-system. Core, semi-periphery, and periphery are positions that the system reproduces across long cycles of accumulation."
- Structural power and IPE. Before: "Associated with Susan Strange. Focuses on structural power in international finance: who provides liquidity in a crisis, who sets interest rates, and who controls access to credit. This power provides political leverage independent of formal authority or military capability." After: "Susan Strange's contribution: power in international finance belongs to whoever supplies liquidity in a crisis, sets interest rates, and controls access to credit. That power works without formal authority or military force."

**What it emphasizes.**

- Before: "The international division of production: who makes what, and under whose terms"
  After: "The international division of production: who makes what, and on whose terms"
- Before: "Structural power in finance: who sets interest rates, who provides liquidity, who imposes conditionality"
  After: "Structural power in finance: who sets interest rates, who provides liquidity, who attaches conditions"
- Before: "Economic dependence as a form of political constraint: formal sovereignty does not equal actual independence"
  After: "Economic dependence as a political limit: sovereignty on paper and independence in practice are different things"
- Before: "Capital flows and their relationship to crisis, vulnerability, and leverage"
  After: "Capital flows and their link to crisis, vulnerability, and leverage"
- Before: "How economic hierarchies reproduce themselves through the design of international institutions"
  After: "How economic hierarchy reproduces itself through the design of international institutions"

**What it often underweights.**

- Before: "Security competition that is not straightforwardly reducible to economic interests"
  After: "Security competition that does not reduce to economic interest"
- Before: "Domestic politics variation: why do similarly positioned states respond differently to structural constraints?"
  After: "Variation in domestic politics: why similarly placed states respond differently to the same structural pressure"
- Before: "Military and security crises driven primarily by strategic logic rather than economic position"
  After: "Military crises driven by strategic logic more than by economic position"

**Arguments it finds persuasive.**

- Before: "IMF conditionality historically reflects the interests of creditor states more than the development needs of debtor states"
  After: "IMF conditionality has served creditor states' interests more than debtor states' development"
- Before: "The dollar's reserve-currency status gives the United States structural leverage that is independent of military power"
  After: "The dollar's reserve-currency status gives the United States leverage that owes nothing to its military"
- Before: "Financial crises in developing economies are partly produced by the structure of global finance, not just domestic mismanagement"
  After: "Financial crises in developing economies are produced by the structure of global finance as well as by domestic mismanagement"
- Before: "Trade and investment agreements systematically tilt bargaining power toward capital over labor and governments"
  After: "Trade and investment agreements tilt bargaining power toward capital and away from labor and governments"

**How it reads major issues.**

- Great-power rivalry. Before: "Interprets US-China rivalry partly as a struggle over who controls the rules of the global economy: currency dominance, technology standards, supply-chain geography, and the institutions that set the terms of international investment and trade. Military competition is real, but the deeper contest is over whose production and financial structures anchor the next phase of global capitalism." After: "US-China rivalry is partly a contest over the rules of the world economy: whose currency dominates, whose technical standards spread, where supply chains run, and who controls the institutions that set the terms of investment and trade. Military competition is real, and a second contest runs alongside it: whose production and financial structures anchor the next phase of global capitalism."
- Trade and technology decoupling. Before: "Reads decoupling as both a symptom of structural rivalry and a restructuring of global production hierarchies. Asks who bears the adjustment costs, typically workers and consumers in both countries, and who benefits from the restructuring, including capital owners who relocate production, state contractors, and defense industries. Skeptical of framing that treats decoupling as a cost-free national security necessity." After: "Decoupling is a symptom of structural rivalry and a rearrangement of the global hierarchy of production. Ask who pays for the adjustment, usually workers and consumers in both countries, and who gains, capital that relocates, state contractors, defense industries. The claim that decoupling is a cost-free security necessity deserves suspicion."
- Humanitarian intervention. Before: "Skeptical. Examines the material interests behind humanitarian rhetoric: strategic resources, access to markets, the interests of defense industries. Notes that intervention patterns correlate with economic stakes as much as with the severity of humanitarian crises, and that post-intervention economic arrangements tend to favor the intervening powers and their investors." After: "Skeptical. The tradition looks for the material interests behind humanitarian language: resources, market access, defense industries. It argues that where intervention happens tracks economic stakes as closely as the scale of suffering, and that the economic settlement afterward tends to favor the intervening powers and their investors."

**Neighboring traditions.**

- realist. Before: "Both are skeptical of liberal optimism. The difference is the driving logic: realists focus on security competition and the distribution of military power; critical PE focuses on economic structure, class, and the politics of production and finance." After: "Both distrust liberal optimism. Realists watch security competition and the distribution of military power. Critical political economy watches economic structure, class, and the politics of production and finance."
- constructivist. Before: "Both are critical of the positivist mainstream. Critical PE emphasizes material structures, including who controls capital and supply chains; constructivism emphasizes ideas and norms. The two traditions sometimes converge in asking whose interests prevailing arrangements serve." After: "Both criticize the positivist mainstream. Critical political economy works on material structure, who controls capital and supply chains; constructivism works on ideas and norms. They meet when either asks whose interests the prevailing arrangements serve."

**Reading list, starter.**

- States and Markets. Before: "Susan Strange: The argument that financial structures create power independent of formal authority. It remains the sharpest introduction to structural power in the international economy." After: "Susan Strange: Financial structures create power independent of formal authority. Still the clearest introduction to structural power in the world economy."
- The Political Economy of International Relations. Before: "Robert Gilpin: A more liberal framing that maps the three main approaches (realist, liberal, Marxist) to international economic order, useful as an orientation." After: "Robert Gilpin: A realist's survey of the three main approaches to the international economy, liberal, nationalist, and Marxist. Useful for orientation."
- Social Forces, States and World Orders. Before: "Robert Cox: The critical IR theory argument that theory always serves someone's interests. A key text in critical PE and IPE." After: "Robert Cox: The critical-theory argument that theory always serves someone's interests. A key text in critical political economy."

**Reading list, go deeper.**

- Dependency and Development in Latin America. Before: "Fernando Henrique Cardoso and Enzo Faletto: The most rigorous dependency theory text. Avoids mechanical determinism by examining how domestic class alliances mediate dependency relations, showing why similarly positioned states respond differently to external structural constraints." After: "Fernando Henrique Cardoso and Enzo Faletto: The most careful dependency text. Avoids mechanical determinism by showing how domestic class alliances mediate dependence, which explains why similarly placed states respond differently to the same external constraint."
- States and the Reemergence of Global Finance. Before: "Eric Helleiner: Shows that financial globalization was a political choice, not an inevitable market outcome. States actively dismantled capital controls. Essential for understanding why structural financial power is a political variable, not a natural fact." After: "Eric Helleiner: Financial globalization was a political choice. States dismantled capital controls; the market did not do it for them. Essential for seeing structural financial power as a political variable."
- Production, Power, and World Order: Social Forces in the Making of History. Before: "Robert Cox: The book-length development of Cox's neo-Gramscian framework. Examines how hegemony is reproduced through a combination of material power, institutional forms, and prevailing ideas across different historical phases of world order." After: "Robert Cox: The book-length development of Cox's neo-Gramscian framework. Hegemony is reproduced through material power, institutions, and prevailing ideas together, across successive phases of world order."

**Reading list, read the critique.**

- In Defense of Globalization. Before: "Jagdish Bhagwati: A direct liberal-economic challenge to dependency and critical PE arguments. Argues that trade and investment liberalization, when well-managed, reduce poverty and expand opportunities in developing countries. A sharp counterpoint to the structural exploitation argument." After: "Jagdish Bhagwati: A liberal-economic challenge to dependency and critical political economy. Trade and investment liberalization, when managed well, reduce poverty and widen opportunity in developing countries."
- Defending the National Interest: Raw Materials Investments and U.S. Foreign Policy. Before: "Stephen Krasner: A state-centric realist challenge to Marxist IPE. Argues that state interests drive foreign economic policy rather than class interests, and that states sometimes act against the preferences of their dominant economic actors." After: "Stephen Krasner: A state-centric realist challenge to Marxist IPE. State interests drive foreign economic policy, and states sometimes act against the wishes of their own dominant economic actors."

**Associated thinkers (data retained; not rendered on the page).**

- Susan Strange (1923–1998). Before: "Developed the concept of structural power in international political economy, the ability to shape the rules and structures within which others must operate. Argued that the United States exercises power through control of global finance and knowledge structures, independent of formal authority." After: "Developed structural power: the ability to shape the rules and structures within which everyone else must operate. Argued that the United States rules through finance and knowledge as much as through formal authority."
- Robert Cox (1926–2018). Before: "The founding figure of neo-Gramscian IPE. Argued that theory is always 'theory for someone and for some purpose,' and that hegemony is reproduced through a combination of material power, institutions, and prevailing ideas. 'Problem-solving theory versus critical theory' is his central distinction." After: "The founder of neo-Gramscian IPE. 'Theory is always for someone and for some purpose.' Hegemony is reproduced through material power, institutions, and prevailing ideas together; problem-solving theory and critical theory are his central distinction."
- Immanuel Wallerstein (1930–2019). Before: "Developed world-systems theory: a historical sociology of capitalism as a single world-system with structurally reproduced core, semi-periphery, and periphery zones. Argued that underdevelopment is produced by integration into the world economy, not by isolation from it." After: "Built world-systems theory: capitalism as one historical system with core, semi-periphery, and periphery. Underdevelopment, he argued, is produced by integration into the world economy, not by isolation from it."
- Raúl Prebisch (1901–1986). Before: "Developed the Prebisch-Singer thesis on deteriorating terms of trade: commodity-exporting periphery countries face a long-run structural disadvantage relative to industrialized core countries. Foundational for dependency theory and structuralist development economics." After: "Author of the Prebisch-Singer thesis on deteriorating terms of trade: commodity exporters in the periphery face a lasting structural disadvantage against the industrial core. The foundation of dependency theory and structuralist development economics."

**How the Foundation models it.** Before: "Critical political economy is modeled through the political economy dimension, which captures instincts about whether global economics is necessary to explain international outcomes. The scenarios on financial crisis and capital controls also probe these instincts. The model is thinner here than for realism or institutionalism. It captures the core orientation but does not have dedicated dimensions for questions about class, production hierarchies, or the granular politics of global finance. This is the most underrepresented scored tradition and an area for future expansion." After: "One dimension carries this reading, political economy: whether control of credit, production, and market access explains outcomes. The fourteen core questions ask two on it. Longer forms add a currency-peg crisis and a green-finance offer with conditions attached. Class, production hierarchies, and the politics of finance have no questions of their own, so this is the thinnest of the four readings."

**Which strands the Foundation scores.** Before: "Critical political economy is an umbrella for several distinct but related strands. Marxist political economy foregrounds class and capital accumulation as the drivers of foreign economic policy. Dependency theory (Prebisch, Cardoso, Frank) emphasizes how core-periphery relations structurally reproduce underdevelopment. World-systems theory (Wallerstein) extends this to a long-run analysis of capitalism as a single historical system. Neo-Gramscian IPE (Cox, Gill) examines how hegemony and ideology reproduce international economic order. Structural power analysis (Strange) focuses on how control over production, finance, security, and knowledge structures creates power independent of formal authority. The Foundation scores these strands together as a single orientation and does not yet disaggregate them." After: "Critical political economy is an umbrella. Marxist political economy puts class and capital accumulation first. Dependency theory (Prebisch, Cardoso, Frank) shows how core-periphery relations reproduce underdevelopment. World-systems theory (Wallerstein) extends that into a long history of capitalism as one system. Neo-Gramscian IPE (Cox, Gill) studies how hegemony and ideology hold an economic order together. Structural power analysis (Strange) follows control of production, finance, security, and knowledge. The Foundation scores them as one orientation and does not tell them apart."

### Issue comparisons (`issueCompares`, rendered on the Library hub)

#### Great-power rivalry

**Summary.** Before: "How does each tradition explain the causes and dynamics of major-power competition, and what, if anything, can constrain it?" After: "What causes competition between major powers, what drives it, and what, if anything, can hold it back?"

**Readings.**

- realist. Before: "Reads rising-power competition as structurally determined. When a state grows strong enough to challenge the dominant power, conflict risk rises regardless of the challenger's ideology or intentions. Self-help under anarchy supplies the mechanism: both sides must assume the worst. Balancing through alliances, arms investment, and forward positioning is the expected response." After: "The structure does the work. When a state grows strong enough to challenge the leading power, the risk of conflict rises whatever the challenger says it wants. Under anarchy both sides must assume the worst. The expected response is balancing: alliances, arms, and forward positions."
- institutionalist. Before: "Argues that rivalry can be managed through sustained institutional engagement. Economic interdependence creates domestic stakeholders for stability on both sides. Military transparency and arms-control frameworks reduce the miscalculation risk that turns competition into crisis. The historical record of major-power peace among trading democracies is taken as evidence that structure alone does not determine outcomes." After: "Rivalry can be managed through sustained engagement. Interdependence creates domestic stakeholders for stability on both sides. Military transparency and arms control reduce the miscalculation that turns competition into crisis. Democratic-peace research, the finding that established democracies rarely fight one another, is read as evidence that structure alone does not decide the outcome."
- constructivist. Before: "Emphasizes that historical memories, mutual recognition failures, and identity narratives socially construct the intensity and character of rivalry, making adversarial relationships feel inevitable. Points to cases of successful enmity transformation (Franco-German, US-Japanese) as evidence that structure is not destiny. Rival identity constructions can be disrupted through sustained diplomacy, socialization, and domestic political change." After: "Historical memory, failures of recognition, and identity narratives build the rivalry and make it feel inevitable. Enemies have become partners before, France and Germany, the United States and Japan, which shows that structure is not destiny. Sustained diplomacy, socialization, and domestic political change can loosen a rival identity."
- criticalPoliticalEconomy. Before: "Interprets great-power competition partly as a contest over economic governance: currency dominance, technology standards, supply-chain geography, and control of the institutions that set the rules of international trade and investment. Military rivalry is real, but the deeper contest is over whose production and financial structures define the next phase of the world economy." After: "The rivalry is partly a contest over economic governance: currency dominance, technology standards, the geography of supply chains, and control of the institutions that set the rules of trade and investment. Military competition is real, and a second contest runs alongside it: whose production and financial structures define the next phase of the world economy."

#### Trade and technology decoupling

**Summary.** Before: "How does each tradition interpret the drive to restrict trade and technology flows in the name of national security, and at what cost?" After: "How does each tradition read the push to cut trade and technology ties in the name of security, and who pays for it?"

**Readings.**

- realist. Before: "Treats economic interdependence primarily as a vulnerability when a partner is also an adversary. Technology leadership translates into military advantage, making controls on dual-use exports rational even at economic cost. Relative gains logic applies: a trade arrangement that develops the adversary's industrial base is strategically harmful even if it produces net economic growth." After: "Interdependence with an adversary is a vulnerability. A lead in technology becomes a lead in arms, so controls on dual-use exports are rational even at economic cost. Relative gains apply: a trade arrangement that builds the adversary's industrial base is harmful even if both economies grow."
- institutionalist. Before: "Warns that broad decoupling is costly to both parties, undermines the multilateral trading rules that have underpinned global growth, and is likely to be self-defeating as third parties hedge rather than align. Prefers targeted, narrowly scoped controls embedded in multilateral frameworks, such as export controls on genuinely dual-use items and investment screening for critical sectors, over wholesale economic separation." After: "Broad decoupling costs both parties, undermines the multilateral trading rules that made growth possible, and is likely to fail as third countries hedge instead of choosing sides. The alternative is targeted controls inside multilateral arrangements: export limits on items with real military use, investment screening in critical sectors, and no wholesale separation."
- constructivist. Before: "Focuses on the framing: 'decoupling' and 'supply-chain security' are not neutral technical descriptions but constructions that activate adversarial identities and foreclose alternative framings (mutual dependence, shared governance, managed competition). The political narrative shapes the policy as much as the underlying material reality, and the framing can become self-fulfilling." After: "The framing decides the policy. 'Decoupling' and 'supply-chain security' are not neutral descriptions. They summon adversarial identities and crowd out other framings, mutual dependence, shared governance, managed competition. Once adopted, the frame can fulfill itself."
- criticalPoliticalEconomy. Before: "Reads decoupling as a restructuring of global production hierarchies, shaped by a contest over which state's firms control key nodes in the technology supply chain. Asks who bears the adjustment costs (workers, consumers, smaller trading partners) and who benefits (domestic contractors, capital that relocates). Skeptical of framing that treats decoupling as a cost-free national security necessity rather than a political choice with distributional consequences." After: "Decoupling rearranges the global hierarchy of production, shaped by a contest over which state's firms control the key nodes of the technology supply chain. Ask who pays, workers, consumers, smaller trading partners, and who gains, domestic contractors, capital that relocates. The claim that this is a cost-free security necessity conceals a political choice with winners and losers."

#### Humanitarian intervention

**Summary.** Before: "When, if ever, does mass atrocity justify overriding sovereignty, and what explains the pattern of when interventions happen and when they do not?" After: "When, if ever, does mass atrocity justify overriding sovereignty, and why do some crises bring intervention while others do not?"

**Readings.**

- realist. Before: "Deeply skeptical. States invoke humanitarian language to justify actions driven by strategic interests; the correlation between intervention and material stakes is too consistent to ignore. The non-intervention norm protects weaker states as much as it shields bad actors. Realists prefer restraint except where core interests are directly engaged, and warn that intervention tends to create new instabilities it cannot manage." After: "Deeply skeptical. Governments reach for humanitarian language to justify what strategic interest already recommends, and the match between intervention and material stakes is too regular to dismiss. The rule against intervention protects weak states as much as it shelters bad ones. Intervene only where core interests are engaged, and expect the intervention to breed instabilities it cannot manage."
- institutionalist. Before: "More permissive when institutional authorization exists. R2P and UN Security Council authorization transform the legitimacy calculus. Multilateral intervention with clear objectives and exit criteria is preferable to both unilateral action and inaction. Skeptical of unauthorized intervention on precedent grounds, but supports the institutional framework for managed, collective response to mass atrocity." After: "More permissive when an institution authorizes the action. The responsibility to protect and a Security Council mandate change the legitimacy of the decision. Collective action with clear objectives and an exit plan beats both unilateral action and doing nothing. Unauthorized intervention sets a bad precedent, but the institutional route to a managed, collective response deserves support."
- constructivist. Before: "The tradition that best explains why the humanitarian intervention norm emerged when it did. Norm entrepreneur networks, the evolution of sovereignty as responsibility, and the diffusion of R2P are prime constructivist cases. The tradition also raises critical questions: whose suffering activates the norm, whose does not, and whether the norm has been selectively applied in ways that reflect power rather than principle." After: "The tradition best placed to explain why the norm of humanitarian intervention appeared when it did. Norm entrepreneurs, sovereignty redefined as responsibility, and the spread of the responsibility to protect are its prime cases. It also asks whose suffering activates the norm and whose does not, and whether selective application reflects power more than principle."
- criticalPoliticalEconomy. Before: "Skeptical and critical. Examines the material interests behind humanitarian rhetoric: strategic resources, market access, defense industry interests. Notes that intervention patterns correlate with economic stakes as much as with the severity of crises, and that post-intervention economic arrangements tend to favor the intervening powers and their investors. Humanitarian framing is analyzed as ideology that obscures material motivations." After: "Skeptical and critical. Look for the material interests behind humanitarian language: resources, market access, defense industries. The tradition argues that where intervention happens tracks economic stakes as closely as the scale of the crisis, and that the economic settlement afterward favors the intervening powers and their investors. Humanitarian framing is read as ideology that hides the motive."

### Traditions not scored (`exploreGaps`)

#### Feminist IR

**Summary.** Before: "Feminist IR asks who is made invisible by mainstream IR's focus on states, power, and security. It argues that the discipline's core concepts, including security, sovereignty, and power, are shaped by assumptions about gender that are rarely examined. Feminist scholars have examined how war affects women differently from men, how militarism is connected to masculine norms, and what a security agenda centered on human vulnerability rather than state survival would look like. The tradition spans liberal feminism (getting more women into existing institutions) and more radical critiques of militarism and the gendered foundations of the state." After: "Feminist IR asks who disappears when the discipline looks only at states, power, and security. Its core concepts, security, sovereignty, power, rest on assumptions about gender that are rarely examined. Feminist scholars have studied how war falls differently on women and men, how militarism draws on ideas of masculinity, and what security would mean if it started from human vulnerability instead of state survival. The tradition runs from liberal feminism, which wants more women inside existing institutions, to critiques of militarism and of the gendered foundations of the state itself."

**Why it is not scored.** Before: "Adding feminist IR as a scored family would require new dimensions on human security, gender analysis, and the critique of militarism that the current item bank does not support. Doing it with the current questions would produce spurious classifications." After: "Scoring feminist IR would need questions on human security, gender, and the critique of militarism that the bank does not contain. Scoring it with the current questions would produce readings the answers cannot support."

#### Postcolonial and Decolonial IR

**Summary.** Before: "Postcolonial and decolonial IR scholars argue that the mainstream discipline was built on and for a world organized by European colonial power, and that this origin shapes what questions get asked and which actors get treated as agents rather than objects. They emphasize the colonial legacies that structure contemporary international inequality, the silenced perspectives of the global South, and the need to decolonize both the canon and the practice of IR. They also challenge the universality of Western IR concepts by asking whether 'sovereignty,' 'anarchy,' and 'security' mean the same things to states whose borders were drawn by colonial powers." After: "Postcolonial and decolonial scholars argue that the discipline was built by and for a world organized by European colonial power, and that this origin decides which questions get asked and which actors count as agents. They trace how colonial legacies structure inequality today, recover perspectives from the global South that the canon left out, and ask whether 'sovereignty', 'anarchy', and 'security' mean the same thing to states whose borders were drawn by colonial powers."

**Why it is not scored.** Before: "Its inclusion would require dimensions on colonial legacies, Eurocentrism, and the politics of knowledge production in IR that would require substantial new question design and validation. The current instrument is likely to misclassify people whose primary orientation is postcolonial, which may place them in critical PE or constructivism as the closest available buckets." After: "Scoring it would need questions on colonial legacies, Eurocentrism, and the politics of knowledge that would have to be written and tested from scratch. Someone whose first orientation is postcolonial is likely to land in critical political economy or constructivism, the nearest readings the questions can reach."

#### Green IR and Ecological Security

**Summary.** Before: "Green IR asks what the international system looks like when ecological limits are taken seriously. Climate change, resource scarcity, and biodiversity loss are environmental problems that also reshape security calculations, economic structures, and the legitimacy of governance in ways the traditional paradigms were not designed to address. Green IR scholars argue that the state-centric security frame systematically misses the most consequential long-run threats to human welfare, and that a meaningful international order must grapple with planetary boundaries rather than treating nature as a backdrop to great-power politics." After: "Green IR asks what the international system looks like once ecological limits are taken seriously. Climate change, resource scarcity, and biodiversity loss reshape security calculations, economic structures, and the legitimacy of governments in ways the older paradigms were not built to handle. The state-centered security frame, green scholars argue, misses the largest long-run threats to human welfare, and an international order worth the name has to reckon with planetary boundaries instead of treating nature as scenery behind great-power politics."

**Why it is not scored.** Before: "Adding green IR would require new dimensions on ecological security, the relationship between development and environmental constraint, and the governance of global commons. These are distinct theoretical commitments that cannot be captured by the current seven dimensions without stretching their meaning." After: "Scoring green IR would need questions on ecological security, the relation between development and environmental limits, and the governance of the global commons. Those are commitments of their own, and the seven dimensions cannot carry them without changing what the dimensions mean."

#### English School / International Society

**Summary.** Before: "The English School occupies a middle ground between realism and liberalism. It argues that states form something like an international society, a community with shared norms, rules, and institutions that constrain behavior even in the absence of world government. It is distinctive for taking international law and diplomacy seriously as social practices rather than mere instruments of power. The pluralism-solidarism debate within the English School asks whether international society is primarily organized around state sovereignty or broader humanitarian norms. This debate maps onto the Foundation's order-justice dimension, making the English School the tradition most partially captured by the current instrument." After: "The English School stands between realism and liberalism. States, it argues, form an international society: a community with shared norms, rules, and institutions that constrain behavior even without a world government. It takes international law and diplomacy seriously as social practices in their own right. Its pluralism-solidarism debate asks whether that society is organized around state sovereignty or around wider humanitarian norms. That debate maps onto the Foundation's order-justice dimension, which makes the English School the tradition the questions come closest to reaching without scoring."

**Why it is not scored.** Before: "The English School's full theoretical depth is not yet modeled, including its account of international society, the role of diplomacy as a social institution, and the historical sociology of international order. The order-justice dimension captures one important debate within the tradition, but the broader framework deserves dedicated dimensions and item coverage." After: "The order-justice dimension captures one debate inside the tradition. Its account of international society, of diplomacy as an institution, and of how international orders form historically has no questions of its own."

## Decision Patterns (`/explore/atlas/[id]`, `lib/atlas-lite.ts`)

Unchanged: ids, names, public names, technical descriptors, primary and secondary families, fingerprints, and neighbor links. Where a field is rendered: decision rule and card summary appear on the Worldview Map cards and in the page hero; "Notices first" is the first driver, "Likely move" is the so-what line, "Main risk" is the first underestimate; the pressure note follows the detail summary under "How this pattern decides".

### Several Lenses (Bridge Builder)

**Decision rule.** Before: "Keep several explanations in play until the case clearly favors one." After: "Hold several explanations open until the case clearly favors one."

**Card summary.** Before: "This pattern keeps several neighboring arguments in play and looks for workable overlap before it reaches for a harder camp." After: "This pattern holds several neighboring arguments open at once and looks for the overlap between them before it commits to a harder camp."

**Card drivers.**

- Before: "No clean break between the top traditions"
  After: "No clean break between the leading traditions"

**Detail summary (How this pattern decides).** Before: "This pattern is less about indecision than about holding several lines of argument open at once. Its logic asks for more evidence before treating a single school as the default lens." After: "This pattern is slow to crown one explanation. Faced with a case, it asks what rivalry explains, what rules explain, and what legitimacy explains, and it waits for the evidence to separate them before it treats a single school as the default."

**Pressure note.** Before: "Security often forces a clearer choice on deterrence, while Technology usually sorts views on openness and dependence faster than the baseline does." After: "A deterrence question forces this pattern to pick a side sooner than it would like. A question about dependence sorts its views on openness and control faster than the broad questions did."

**Likely move.** Before: "In practice, this pattern is slower to accept one master explanation and more likely to ask which argument still survives contact with the case." After: "Given a hard case, this pattern asks which argument still survives contact with the facts, and treats an early verdict as a cost."

**Sees clearly.**

- Before: "The strongest signals sit close together rather than stacking into one firm worldview."
  After: "The strongest signals sit close together instead of stacking into one firm worldview."
- Before: "Rivalry, institutions, legitimacy, and political economy all retain some pull."
  After: "Rivalry, institutions, legitimacy, and political economy all keep some pull."
- Before: "The pattern often calls for a harder issue case before accepting a sharper conclusion."
  After: "A harder case is the usual way this pattern reaches a sharper conclusion."

**May miss.**

- Before: "Moments when a choice really does need to be made quickly."
  After: "Moments when a choice has to be made before the evidence separates the arguments."
- Before: "How costly prolonged ambiguity can become when a rival is already testing the boundary."
  After: "How expensive open questions become once a rival is already testing the boundary."

**Security.** Before: "In Security, this pattern often separates into two paths: one side moves toward coalition management and restraint, while the other hardens around deterrence and visible commitment." After: "If an exposed ally asks for troops on its border, this pattern separates into two paths. One weighs coalition strain and escalation risk and favors restraint; the other reads the request as a test of commitment and hardens around deterrence. Which path it takes depends on which cost the case makes visible first."

**Technology.** Before: "In Technology, this pattern often sharpens around dependence, industrial policy, and the line between open exchange and strategic control." After: "If a ministry must choose between a cheap foreign digital stack and a costlier allied one, this pattern stops hedging. Dependence on a rival's infrastructure is the kind of fact that makes it choose control over open exchange."

**Nearby patterns.** Before: "It is often confused with Coalition Pragmatist because both resist maximalism, and with Cross-Pressured Synthesizer because both can look unsettled at first glance. The difference is that Bridge Builder keeps overlap intact, while Cross-Pressured Synthesizer shows a real split between domains or question types." After: "It is easy to mistake for Coalition Pragmatist, because both resist maximalism, and for Cross-Pressured Synthesizer, because both can look unsettled. The difference: Bridge Builder keeps the overlap between arguments intact, while Cross-Pressured Synthesizer shows a real split between domains or between diagnosis and decision."

**Questions that test this pattern.**

- Before: "When the case hardens, do you still keep several lenses open or do you settle quickly on one?"
  After: "When the case hardens, do you still hold several explanations open, or do you settle quickly on one?"
- Before: "Do alliance strain and escalation risk usually outrank the push for immediate advantage?"
  After: "Do alliance strain and escalation risk usually outrank the chance of immediate advantage?"
- Before: "Does technology policy push you toward firmer control than the baseline suggests?"
  After: "Does technology policy push you toward firmer control than your general reading suggests?"

### Power with Limits (Constraint-First Realist)

**Card summary.** Before: "This pattern starts from rivalry and constraint, but it stays wary of overreach and looks for ceilings before it reaches for a harder line." After: "This pattern starts from rivalry and constraint. It stays wary of overreach and looks for the ceiling on a commitment before it decides how hard to press."

**Card drivers.**

- Before: "Order usually outranks moral ambition"
  After: "Order outranks moral ambition"

**Detail summary (How this pattern decides).** Before: "This realist pattern treats competition as durable, but it does not treat every contest as a reason to press harder. The first instinct is to preserve position without drifting into commitments that are expensive to hold or hard to reverse." After: "This realist pattern treats competition as lasting and treats every contest as a place where a state can overreach. Its first move is to hold position without taking on commitments that are expensive to keep or hard to reverse."

**Pressure note.** Before: "Security usually reinforces bounded deterrence, while Technology can still push this pattern toward tighter controls when chokepoints look exposed." After: "Ask it about deterrence and this pattern reinforces bounded deterrence. Ask it about an exposed chokepoint and it accepts tighter controls than its caution elsewhere would predict."

**Likely move.** Before: "In practice, this pattern is likely to back deterrence and limits together: hold position, but stay alert to escalation traps and strategic drift." After: "Given a rival probing the boundary, this pattern backs deterrence and a ceiling together: hold the line, name the limit, and watch for the escalation trap."

**Sees clearly.**

- Before: "Security competition remains the starting point for reading most major-power cases."
  After: "Security competition is the starting point for reading most major-power cases."
- Before: "Restraint is not softness here; it is a way to protect position and avoid strategic drift."
  After: "Restraint here is a way to protect position and avoid strategic drift, and no sign of softness."
- Before: "Order and precedent usually carry more weight than expansive moral ambition."
  After: "Order and precedent carry more weight than expansive moral ambition."

**May miss.**

- Before: "Openings where sustained pressure could improve the strategic balance."
  After: "Openings where sustained pressure would improve the strategic balance."
- Before: "How often cautious ceilings can look like passivity to allies or rivals."
  After: "How a cautious ceiling can look like passivity to allies and to rivals."

**Security.** Before: "In Security, this pattern usually favors reinforcement, deterrence, and visible resolve, but with clear ceilings and a strong preference against open-ended escalation." After: "If a NATO ministerial is choosing an eastern-flank posture, this pattern favors reinforcement, visible resolve, and a stated ceiling. It reads open-ended escalation as the risk to plan against, so it prefers a posture allies can hold for years to one that signals most in the first month."

**Technology.** Before: "In Technology, this pattern often supports targeted controls and chokepoint protection, especially when dependence looks strategically dangerous." After: "If a supplier that is also a rival controls a chokepoint, this pattern supports targeted export controls and protection of the chokepoint. It applies the same test it applies to force: is the control worth the dependence it creates elsewhere, and can it be held?"

**Nearby patterns.** Before: "It is often confused with Competitive Balancer because both start with rivalry, and with Coalition Pragmatist because both can accept limits. The difference is that this pattern treats strategic ceilings as a first-order concern, not as a later correction." After: "It is easy to mistake for Competitive Balancer, because both start from rivalry, and for Coalition Pragmatist, because both accept limits. The difference: this pattern treats the strategic ceiling as the first question, and Competitive Balancer treats it as a later correction."

**Questions that test this pattern.**

- Before: "When a rival probes the boundary, do you look first for a firm ceiling or for a chance to push advantage?"
  After: "When a rival probes the boundary, do you look first for a firm ceiling or for a chance to press advantage?"
- Before: "How much risk of overextension are you willing to absorb for a cleaner strategic signal?"
  After: "How much risk of overextension would you absorb for a cleaner strategic signal?"
- Before: "Do new technology chokepoints make you more comfortable with tighter controls than you are in other domains?"
  After: "Do technology chokepoints make you readier to accept tight controls than you are in other domains?"

### Power and Leverage (Competitive Balancer)

**Decision rule.** Before: "Use credible pressure when it can convert advantage into durable position." After: "Use credible pressure when it can convert advantage into lasting position."

**Card summary.** Before: "This pattern returns quickly to rivalry, leverage, and credible positioning, with more willingness to press advantage when the opening looks real." After: "This pattern returns quickly to rivalry, leverage, and credible positioning, and it presses an advantage when the opening looks real."

**Detail summary (How this pattern decides).** Before: "This pattern sees competition as the baseline condition of major-power politics. It is more willing than the constraint-first version to test openings, raise costs, and convert advantage into position." After: "This pattern sees competition as the ground condition of major-power politics. Where the constraint-first version looks for the ceiling, this one tests openings, raises costs for the rival, and converts advantage into position while it can."

**Pressure note.** Before: "Security usually strengthens visible pressure, and Technology often sharpens support for control over key chokepoints and dependencies." After: "On deterrence, this pattern strengthens visible pressure. On chokepoints and dependence, it supports control over them."

**Likely move.** Before: "In practice, this pattern is readier to use leverage early and to accept friction if it improves long-run position." After: "Given a real opening, this pattern uses leverage early and accepts friction, on the argument that a better long-run position pays for the trouble now."

**Sees clearly.**

- Before: "Security competition is usually the strongest explanatory signal in the pattern."
  After: "Security competition is the strongest explanatory signal in the pattern."
- Before: "Institutions are judged mainly by whether they help or hinder power management."
  After: "Institutions are judged by whether they help or hinder the management of power."
- Before: "The pattern is readier to accept friction when the strategic payoff appears durable."
  After: "Friction is acceptable when the strategic payoff looks likely to last."

**May miss.**

- Before: "Ways institutional friction can sometimes protect a policy from strategic overreach."
  After: "Ways institutional friction can protect a policy from its own overreach."

**Security.** Before: "In Security, this pattern often backs earlier pressure, stronger deterrent signaling, and less patience with ambiguity or delay." After: "If a monitoring team watches a ceasefire fray, this pattern reads delay as an invitation to the other side. It backs earlier pressure and a stronger deterrent signal, and it has little patience with ambiguity once the violations start to accumulate."

**Technology.** Before: "In Technology, this pattern often favors export controls, chokepoint defense, and tighter screening of strategic dependence." After: "If a rival is catching up in advanced semiconductors, this pattern favors export controls, defense of the chokepoint, and tighter screening of strategic dependence. Control of the technology is leverage, and leverage unused is leverage wasted."

**Nearby patterns.** Before: "It is often confused with Constraint-First Realist because both are clearly realist, and with Structural Inequality Critic because both pay close attention to leverage. The difference is that this pattern sees leverage primarily as a competitive tool, not as evidence of deeper hierarchy." After: "It is easy to mistake for Constraint-First Realist, because both are plainly realist, and for Structural Inequality Critic, because both pay close attention to leverage. The difference: this pattern sees leverage as a competitive tool, and Structural Inequality Critic sees it as evidence of a deeper hierarchy."

**Questions that test this pattern.**

- Before: "When does caution start to look like strategic drift rather than prudence?"
  After: "When does caution start to look like strategic drift instead of prudence?"
- Before: "How much alliance friction would you accept if a harder line improved position?"
  After: "How much alliance friction would you accept if a harder line improved your position?"
- Before: "Do institutions still deserve support when they slow down a move you judge strategically sound?"
  After: "Do institutions still deserve support when they slow a move you judge strategically sound?"

### Coalitions First (Coalition Pragmatist)

**Card summary.** Before: "This pattern prefers workable coordination and durable partner alignment over either rigid bloc discipline or go-it-alone autonomy." After: "This pattern prefers coordination that works and partner alignment that lasts. It distrusts rigid bloc discipline and go-it-alone autonomy in equal measure."

**Card drivers.**

- Before: "Pressure is weighed against coalition durability"
  After: "Pressure is weighed against what the coalition can bear"

**Detail summary (How this pattern decides).** Before: "This pattern is not idealistic about institutions. It trusts them most when they can hold a coalition together and keep policy usable over time." After: "This pattern has no illusions about institutions. It trusts them when they hold a coalition together and keep a policy usable over time, and it judges every course by whether the partners can still be carrying it in two years."

**Pressure note.** Before: "Security usually turns this pattern toward alliance endurance, while Technology usually turns it toward coordinated controls and shared standards." After: "Faced with a deterrence question, this pattern turns toward what the alliance can endure. Faced with technology controls, it turns toward coordination and shared standards."

**Likely move.** Before: "In practice, this pattern asks first whether partners can sustain a policy. Strategic neatness on day one carries less weight." After: "Given a proposal, this pattern asks first whether partners can sustain it. A course that looks neat on day one and splits the coalition by month six fails the test."

**Sees clearly.**

- Before: "Institutional tools are valued for coordination, signaling, and burden-sharing."
  After: "Institutions are valued for coordination, signaling, and sharing the burden."
- Before: "Restraint is often preferred to dramatic moves that partners cannot sustain."
  After: "Restraint is preferred to dramatic moves that partners cannot sustain."
- Before: "Power and pressure remain in view, which keeps the realist family nearby."
  After: "Power and pressure stay in view, which keeps the realist family nearby."

**May miss.**

- Before: "Moments when speed and coercive clarity outrun coalition process."
  After: "Moments when speed and coercive clarity outrun the coalition process."
- Before: "How quickly partner alignment can crack once burden-sharing turns politically costly."
  After: "How fast partner alignment cracks once burden-sharing turns politically costly at home."

**Security.** Before: "In Security, this pattern treats alliance endurance as part of deterrence itself and pays close attention to what exposed partners can realistically bear." After: "If a coastal state must decide whose help to accept, this pattern asks which partners can carry the commitment for years, and treats alliance endurance as part of deterrence itself. A guarantee the guarantor's public will not fund is read as no guarantee."

**Technology.** Before: "In Technology, this pattern usually favors trusted production networks, coordinated controls, and shared governance over unilateral closure." After: "If a coalition is debating export controls and shared standards, this pattern favors trusted production networks, coordinated controls, and shared governance over unilateral closure, because a control only one partner enforces leaks."

**Nearby patterns.** Before: "It is often confused with Institution Builder because both value coordination, and with Constraint-First Realist because both can resist overreach. The difference is that Coalition Pragmatist starts with partner management and policy durability, not with rules alone or strategic ceilings alone." After: "It is easy to mistake for Institution Builder, because both value coordination, and for Constraint-First Realist, because both resist overreach. The difference: Coalition Pragmatist starts with partner management and whether a policy can last, and neither with rules alone nor with strategic ceilings alone."

**Questions that test this pattern.**

- Before: "When coalition unity and strategic speed collide, which side usually wins?"
  After: "When coalition unity and strategic speed collide, which usually wins?"
- Before: "How much unilateral freedom are you willing to give up for a more durable common line?"
  After: "How much unilateral freedom would you give up for a common line that lasts?"

### Rules and Cooperation (Institution Builder)

**Card summary.** Before: "This pattern starts with rules, monitoring, and repeated cooperation as the best way to hold order together over time." After: "This pattern starts with rules, monitoring, and repeated cooperation as the best way to hold an order together over time."

**Card drivers.**

- Before: "Hard rivalry is not the default lens"
  After: "Hard rivalry is no default explanation"

**Detail summary (How this pattern decides).** Before: "This pattern believes well-built institutions can do real work. It assigns rules and monitoring independent stabilizing force. Coalition management remains important." After: "This pattern believes well-built institutions do real work. It credits rules and monitoring with a stabilizing force of their own, while keeping coalition management in view because rules without partners do not hold."

**Pressure note.** Before: "Security makes authorization and reassurance harder, while Technology usually strengthens support for shared governance and narrow controls." After: "Where force is at issue, this pattern finds authorization and reassurance harder to arrange. Where technology governance is at issue, it finds shared standards and narrow controls easier to defend."

**Likely move.** Before: "In practice, this pattern is likely to ask whether better rules, monitoring, and coordination can still carry the case before it gives up on the institutional route." After: "Given a case where cooperation is failing, this pattern asks whether better rules, monitoring, and coordination could still carry it before it gives up on the institutional route."

**Sees clearly.**

- Before: "Institutional design is treated as a real source of order, not just a mirror of power."
  After: "Institutional design is treated as a source of order in its own right, and no mere mirror of power."
- Before: "Domestic politics stays in view because commitments are only credible if states can actually keep them."
  After: "Domestic politics stays in view because a commitment is credible only if the state can keep it."
- Before: "The pattern can explain a case without defaulting to a hard rivalry frame."
  After: "The pattern can explain a case without reaching for a hard rivalry frame."

**May miss.**

- Before: "How quickly hard rivalry can hollow out rules and monitoring arrangements."
  After: "How fast hard rivalry hollows out rules and monitoring arrangements."

**Security.** Before: "In Security, this pattern usually looks for authorization, reassurance, and credible monitoring before it accepts that the only answer is a harder line." After: "If a monitoring team watches a ceasefire fray, this pattern asks whether the monitoring can be repaired: more access, a clearer authorization, a credible reporting line. It accepts that only a harder line remains when those repairs have failed, and it wants that failure shown."

**Technology.** Before: "In Technology, this pattern often favors standards-setting, narrow controls, and shared infrastructure over national duplication." After: "If a research board must decide how far to open a capable model, this pattern favors standards-setting, narrow controls, and shared infrastructure over each state duplicating the work, because a shared rule can be verified and a national one can only be asserted."

**Nearby patterns.** Before: "It is often confused with Coalition Pragmatist because both trust coordinated action, and with Legitimacy Reader because both can take institutions seriously. The difference is that Institution Builder puts its faith first in rule design, monitoring, and repeated cooperation." After: "It is easy to mistake for Coalition Pragmatist, because both trust coordinated action, and for Legitimacy Reader, because both can take institutions seriously. The difference: Institution Builder puts its faith first in rule design, monitoring, and repeated cooperation."

**Questions that test this pattern.**

- Before: "When do broken rules mean institutions need repair rather than abandonment?"
  After: "When do broken rules mean the institution needs repair, and when do they mean it should be abandoned?"
- Before: "How much rivalry can a rule-based framework absorb before you stop trusting it?"
  After: "How much rivalry can a rule-based arrangement absorb before you stop trusting it?"
- Before: "What evidence would convince you that coordination is no longer strong enough to carry the case?"
  After: "What evidence would convince you that coordination can no longer carry the case?"

### Meaning and Legitimacy (Legitimacy Reader)

**Card summary.** Before: "This pattern keeps asking how identity, recognition, and legitimacy shape the meaning of power, threat, and cooperation." After: "This pattern keeps asking how identity, recognition, and legitimacy decide what a show of power, a threat, or an offer of cooperation means to the people receiving it."

**Detail summary (How this pattern decides).** Before: "This pattern does not treat material facts as self-explanatory. It keeps asking how actors read one another, which claims look legitimate, and how historical relationships shape the same move." After: "This pattern refuses to treat material facts as self-explanatory. Given the same deployment, it asks how each audience reads it, which claims about it look legitimate, and how the history between the parties changes what the move means."

**Pressure note.** Before: "Security often raises the legitimacy of force and the meaning of reassurance, while Technology sharpens who gets to set rules and safety baselines." After: "When force is proposed, this pattern asks whether it will be seen as legitimate and whether reassurance will be believed. When a technology rule is proposed, it asks who gets to set the rule and the safety threshold."

**Likely move.** Before: "In practice, this pattern is likely to ask who is interpreting the move, how it is framed, and what claims look legitimate before jumping to raw capability alone." After: "Given a move by another state, this pattern asks who is interpreting it, how it is framed, and which claims about it look legitimate before it judges the raw capability behind it."

**Sees clearly.**

- Before: "Norms and identity remain active explanatory signals rather than rhetorical decoration."
  After: "Norms and identity are treated as explanatory signals in their own right, and no mere decoration."
- Before: "The pattern asks how the same policy looks from different historical and regional vantage points."
  After: "The same policy is read from more than one historical and regional vantage point."
- Before: "Order and justice stay open questions rather than a settled ranking."
  After: "Order and justice stay open questions instead of a settled ranking."

**May miss.**

- Before: "Cases where brute capability dominates before interpretation can do much work."
  After: "Cases where brute capability decides the outcome before interpretation can do any work."
- Before: "How long threshold choices can stay open before a policy still has to be chosen."
  After: "How long a threshold can stay open before a policy still has to be chosen."

**Security.** Before: "In Security, this pattern usually asks how allies, rivals, and regional actors interpret the move, not only whether the move changes raw capability." After: "If an ally asks for public backing after staging risky probes in disputed waters, this pattern asks how the ally, the rival, and the region will read the backing before it asks what the backing adds to capability. Support that the region reads as provocation may cost more than it deters."

**Technology.** Before: "In Technology, this pattern often focuses on governance legitimacy, access, and who gets to define acceptable risk." After: "If a research board must decide how far to open a capable model, this pattern asks who is entitled to define acceptable risk and whether the outside world will treat that definition as legitimate, and it weighs access as a question of standing as much as of safety."

**Nearby patterns.** Before: "It is often confused with Institution Builder because both can value rules, and with Justice-Forward Solidarist because both keep legitimacy in view. The difference is that Legitimacy Reader is centered on meaning, recognition, and interpretation before it becomes a moral argument about override." After: "It is easy to mistake for Institution Builder, because both can value rules, and for Justice-Forward Solidarist, because both keep legitimacy in view. The difference: Legitimacy Reader is centered on meaning, recognition, and interpretation, and stops short of a moral argument for overriding sovereignty."

**Questions that test this pattern.**

- Before: "When does legitimacy change the outcome rather than simply color the story?"
  After: "When does legitimacy change the outcome, and when does it only color the story?"

### Justice and Protection (Justice-Forward Solidarist)

**Card summary.** Before: "This pattern keeps open the possibility that severe moral stakes can outweigh strict non-intervention, especially when legitimacy and protection pull together." After: "This pattern keeps open the possibility that severe moral stakes can outweigh strict non-intervention, above all when legitimacy and protection point the same way."

**Card drivers.**

- Before: "Sovereignty is important but not absolute"
  After: "Sovereignty counts, but it is not absolute"

**Detail summary (How this pattern decides).** Before: "This pattern gives real weight to humanitarian protection and wider moral claims. It still pays attention to authority and precedent, but it is more willing to say those guardrails should bend in extreme cases." After: "This pattern gives humanitarian protection and wider moral claims serious weight. It still attends to authority and precedent, and it is willing to say that those guardrails should bend in an extreme case, provided the action has legitimacy and a limit."

**Pressure note.** Before: "Security raises the hardest questions about bounded force, while Technology brings harms, access, and unequal protection into sharper view." After: "Force is this pattern's hardest test: whether bounded action can stay bounded. Technology brings harms, access, and unequal protection into view."

**Likely move.** Before: "In practice, this pattern is likelier to ask who is left exposed if rules are applied too rigidly, especially in severe-harm cases." After: "Given a severe-harm case, this pattern asks who is left exposed if the rules are applied to the letter, and whether an authorized and limited action could protect them."

**Sees clearly.**

- Before: "Justice-sensitive answers remain visible even when order and precedent are kept in view."
  After: "Justice-sensitive answers stay visible even when order and precedent are kept in view."
- Before: "Legitimacy is treated as part of the case for action, not only as a constraint on action."
  After: "Legitimacy is treated as part of the case for action, and as more than a constraint on it."
- Before: "The pattern is especially attentive to who is left exposed when rules are applied too rigidly."
  After: "The pattern watches for who is left exposed when rules are applied too rigidly."

**May miss.**

- Before: "Precedent costs and the difficulty of keeping limited action limited."
  After: "The cost in precedent, and the difficulty of keeping a limited action limited."

**Security.** Before: "In Security, this pattern often centers the tension between civilian protection, legal grounding, and the risk that bounded action turns into open-ended intervention." After: "If mass killing is under way and a veto blocks authorization, this pattern weighs civilian protection, the legal grounding available, and the risk that a bounded action becomes an open-ended intervention. It will act without full authorization only when the limit can be shown as well as the need."

**Technology.** Before: "In Technology, this pattern often focuses on access, safety, and the distribution of harms rather than capability alone." After: "If a government must decide how far to open a capable model, this pattern asks who is harmed, who gets access, and who is protected, and treats capability as the smaller part of the question."

**Nearby patterns.** Before: "It is often confused with Legitimacy Reader because both take legitimacy seriously, and with Bridge Builder because both can resist hard sovereignty-first conclusions. The difference is that this pattern is readier to say extreme moral stakes should alter the policy threshold." After: "It is easy to mistake for Legitimacy Reader, because both take legitimacy seriously, and for Bridge Builder, because both resist a sovereignty-first conclusion. The difference: this pattern is readier to say that extreme moral stakes should change the threshold for action."

### Power Behind the Rules (Structural Inequality Critic)

**Card summary.** Before: "This pattern reads world politics through leverage, dependence, and unequal control over finance, production, and rule-setting." After: "This pattern reads world politics through leverage, dependence, and unequal control over finance, production, and the writing of rules."

**Card drivers.**

- Before: "Adjustment costs usually fall unevenly"
  After: "Adjustment costs fall unevenly"

**Detail summary (How this pattern decides).** Before: "This pattern is skeptical of neutral-sounding accounts of order. It looks first at who controls the terms of exchange, who absorbs the shocks, and whose dependence is being managed for someone else." After: "This pattern distrusts neutral-sounding accounts of order. Given an arrangement described as fair, it looks first at who controls the terms of exchange, who absorbs the shocks, and whose dependence is being managed for someone else's benefit."

**Pressure note.** Before: "Security often raises suspicion about who bears the burden, while Technology sharpens concern about chokepoints, exclusion, and industrial lockout." After: "Sanctions and coalition discipline make this pattern ask who bears the burden. Technology makes it ask who is shut out by chokepoints, exclusion, and industrial lockout."

**Likely move.** Before: "In practice, this pattern is likely to ask who sets the terms, who carries the cost, and whether clean institutional language is hiding hierarchy." After: "Given a proposal in the language of shared rules, this pattern asks who set the terms, who carries the cost, and whether the clean institutional language is covering a hierarchy."

**Sees clearly.**

- Before: "Political economy is treated as a primary driver rather than a background condition."
  After: "Political economy is treated as a primary driver, and as more than a background condition."
- Before: "Institutions are often read as structured by hierarchy rather than as neutral problem-solvers."
  After: "Institutions are read as structured by hierarchy before they are read as neutral problem-solvers."

**May miss.**

- Before: "Immediate coercive threats that do not fit neatly into the deeper hierarchy story."
  After: "Immediate coercive threats that do not fit the deeper hierarchy story."
- Before: "How much variation can still exist across different forms of coordination with stronger states."
  After: "How much variation remains across the ways a weaker state can coordinate with a stronger one."

**Security.** Before: "In Security, this pattern often questions sanctions, improvised hierarchy, and coalition discipline when weaker states are asked to carry the adjustment cost." After: "If a nonaligned state that depends on the aggressor for energy is pressed to join sanctions, this pattern asks who is being asked to carry the adjustment cost, and reads coalition discipline that falls hardest on the weakest member as hierarchy under another name."

**Technology.** Before: "In Technology, this pattern focuses on chokepoints, unequal access, and who gets shut out of industrial depth and rule-setting capacity." After: "If a ministry is signing for data-centre capacity it cannot build itself, this pattern asks who controls the chokepoints, who is excluded from industrial depth, and who will write the rules once the dependence is locked in."

**Nearby patterns.** Before: "It is often confused with Competitive Balancer because both take leverage seriously, and with Development-Sovereignty Builder because both focus on dependence. The difference is that Structural Inequality Critic treats hierarchy itself as the core story, not only state strategy or policy room." After: "It is easy to mistake for Competitive Balancer, because both take leverage seriously, and for Development-Sovereignty Builder, because both focus on dependence. The difference: Structural Inequality Critic treats the hierarchy itself as the story, where the others see state strategy or policy room."

### Capacity and Autonomy (Development-Sovereignty Builder)

**Card summary.** Before: "This pattern starts with policy room, productive depth, and the need to avoid forms of dependence that close off future choice." After: "This pattern starts with policy room, productive depth, and the need to avoid the kinds of dependence that close off future choice."

**Detail summary (How this pattern decides).** Before: "This pattern worries less about immediate prestige than about whether a state can keep room to maneuver over time. It treats industrial depth, financing conditions, and strategic dependence as part of sovereignty itself." After: "This pattern worries less about prestige today than about whether a state can still choose tomorrow. It treats industrial depth, financing terms, and strategic dependence as parts of sovereignty itself, and judges an offer by what it leaves open."

**Pressure note.** Before: "Security often pushes this pattern toward hedging, while Technology usually strengthens support for public capacity, trusted infrastructure, and diversified dependence." After: "Pressed to align, this pattern hedges. Asked about infrastructure, it backs public capacity, trusted suppliers, and diversified dependence."

**Likely move.** Before: "In practice, this pattern is likely to judge policy by whether it preserves room to maneuver, build capacity, and avoid lock-in later." After: "Given an offer of help, this pattern asks whether it widens the state's room to maneuver later or buys relief now at the price of dependence, and whether it builds capacity the state keeps."

**Sees clearly.**

- Before: "The closest neighbor is often institutionalist or critical political economy rather than pure realism."
  After: "The nearest neighbor is an institutionalist or a critical political economy reading, and only rarely pure realism."

**May miss.**

- Before: "How often urgent exposure can force a less autonomy-preserving choice in the near term."
  After: "How an urgent exposure can force a choice that costs autonomy in the near term."

**Security.** Before: "In Security, this pattern often prefers autonomy-sensitive partnerships, middle-power hedging, and deals that protect room for maneuver." After: "If a middle power relies on one bloc for security and the other for trade, this pattern prefers partnerships that respect its autonomy, hedging between the blocs, and deals that keep room to maneuver, and it reads a demand to choose sides as a cost in itself."

**Technology.** Before: "In Technology, this pattern often backs public capacity, trusted infrastructure, and diversified dependence over either full autarky or pure openness." After: "If a cabinet is deciding whether to build a sovereign cloud, this pattern backs public capacity, trusted infrastructure, and diversified suppliers, and it rejects both full self-sufficiency and pure openness on the same ground: each narrows future choice."

**Nearby patterns.** Before: "It is often confused with Structural Inequality Critic because both focus on dependence, and with Coalition Pragmatist because both can value coordination. The difference is that Development-Sovereignty Builder is centered on state capacity and future bargaining room." After: "It is easy to mistake for Structural Inequality Critic, because both focus on dependence, and for Coalition Pragmatist, because both can value coordination. The difference: Development-Sovereignty Builder is centered on state capacity and future bargaining room."

**Questions that test this pattern.**

- Before: "Does the policy expand room to maneuver later, or does it buy short-term relief at the cost of future dependence?"
  After: "Does the policy expand room to maneuver later, or does it buy short-term relief at the price of future dependence?"
- Before: "Which outside commitments strengthen domestic capacity, and which ones hollow it out?"
  After: "Which outside commitments strengthen domestic capacity, and which hollow it out?"

### Different by Domain (Cross-Pressured Synthesizer)

**Card summary.** Before: "This pattern does not settle into one clean doctrine: different domains or question types pull its logic in materially different directions." After: "This pattern never settles into one doctrine. Different domains, or different kinds of question, pull its logic in different directions, and it lets them."

**Detail summary (How this pattern decides).** Before: "This pattern is not simple overlap. Its logic sorts in one direction under some conditions, then changes emphasis under others. The pattern is better read as a structured tension than as a fuzzy center." After: "This pattern is no simple overlap. Its logic sorts one way under some conditions and changes emphasis under others. Read it as a structured tension between domains, or between diagnosis and decision, and it makes sense; read it as a fuzzy center and it does not."

**Pressure note.** Before: "Security often hardens the diagnosis faster than the endorsement, while Technology can reveal a different balance between control, governance, and access." After: "In a crisis, this pattern hardens its diagnosis faster than its endorsement. In a technology case, it can show a different balance between control, governance, and access."

**Likely move.** Before: "In practice, this pattern does not supply one all-purpose reflex. It shows how reasoning can change by domain or by the shift from diagnosis to decision." After: "Given two cases from different domains, this pattern applies different logics on purpose, and given one case, it may explain the crisis in harder terms than the policy it is willing to endorse."

**Sees clearly.**

- Before: "Domain comparisons create a real shift or cross-domain tension."
  After: "Domain comparisons show a real shift or a cross-domain tension."
- Before: "Explanation and decision logics do not collapse neatly into one line."
  After: "Explanation and decision follow different logics that do not collapse into one line."
- Before: "No single baseline is treated as an all-purpose reflex."
  After: "No single reflex is treated as an all-purpose answer."

**May miss.**

- Before: "How easily outsiders can misread a real cross-domain split as inconsistency or indecision."
  After: "How easily outsiders misread a real cross-domain split as inconsistency or indecision."

**Security.** Before: "In Security, this pattern often explains crises in harder terms than it is willing to endorse once legitimacy and escalation costs come fully into view." After: "If a crisis is escalating, this pattern explains it in harder terms than it is willing to endorse once legitimacy and escalation costs come into view: a realist diagnosis, an institutionalist prescription."

**Technology.** Before: "In Technology, this pattern often diagnoses rivalry and dependence clearly, yet still ends in coordination, safety, or access-oriented policy choices." After: "If a rival is racing ahead in a strategic technology, this pattern diagnoses the rivalry and the dependence clearly, and still ends in a policy built on coordination, safety, or access, because the domain rewards different instincts than force does."

**Nearby patterns.** Before: "It is often confused with Bridge Builder because both resist a single hard label. The difference is that Bridge Builder holds several arguments open at once, while Cross-Pressured Synthesizer shows a genuine split between domains or between diagnosis and policy choice." After: "It is easy to mistake for Bridge Builder, because both resist a single hard label. The difference: Bridge Builder holds several arguments open at once, while Cross-Pressured Synthesizer shows a real split between domains, or between diagnosis and choice."

**Questions that test this pattern.**

- Before: "Which domain should carry more weight when issue readings point in different directions?"
  After: "Which domain should carry more weight when the readings point in different directions?"
- Before: "Does the diagnosis read harder than the policy endorsement?"
  After: "Does your diagnosis read harder than the policy you would endorse?"
- Before: "Is the tension stable enough to treat as part of the pattern rather than as noise?"
  After: "Is the tension stable enough to count as part of the pattern, or is it noise?"
