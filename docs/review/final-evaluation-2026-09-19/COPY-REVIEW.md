# Copy review: exact passages, why they fail, and how to improve them

“AI-like” describes a reading experience here, not a forensic claim about authorship. Repetition, rhetorical overqualification and vague abstractions can be written by a person; a clear sentence can be written with AI. The goal is better writing and better-supported claims.

The most persistent problem is **explaining the model in the language of its implementation**. “Registered reading,” “form,” “position,” “aggregate,” “lane” and “interpretation rule” accumulate until the user is reading a specification. A second pattern is attributing a broad habit to the person from a small set of coded answers. A third is making every rival comparison sound structurally identical.

This is a two-level inventory. The table below contains deliberate editorial judgments; the [851-row ledger](copy-candidates.csv) retains all automated flags, including unconfirmed branches and false positives. The full extraction is in [source-copy-inventory.json](evidence/source-copy-inventory.json). Text presence in server HTML is not proof of visibility, and absent server text may be client-rendered. Neither condition proves an active call site. The scanner omits very short fragments, and its flags are not a complete definition of bad prose.

Rewrites below are proposals, not applied edits. Questionnaire wording, quoted sources, historical result copy and versioned instrument content need their own review. Do not run a blanket replace on “rather than,” negations, numerical precision or second person.

## Reviewed passages

### E01 · [components/results/foundation-result-story.tsx:511](https://github.com/yippy141/ir-worldview-app/blob/b49365f79bdd4306fbe62d9f8ee2e48f130f5008/components/results/foundation-result-story.tsx#L511)

> The registered restraint boundary is not a claim that the completed form is symmetrically centered around that raw value.

**Why:** Internal calibration language placed in the reader journey. Accurate intent, poor explanation.

**Edit direction:** The +/− sign uses the registered cut at 4. It does not mean the questionnaire has equally balanced outcomes on either side.

### E02 · [lib/results/foundation-result-heading.ts:42](https://github.com/yippy141/ir-worldview-app/blob/b49365f79bdd4306fbe62d9f8ee2e48f130f5008/lib/results/foundation-result-heading.ts#L42)

> Both readings remain live in the current item set. The registered reading summarizes the model output while targeted follow-up items test the boundary between them.

**Why:** The metaphor of a live reading and registration obscures uncertainty. It also understates four-way ties.

**Edit direction:** These answers do not clearly distinguish the approaches. A few more questions may help. In a four-way tie, name all tied approaches or withhold a two-family reading.

### E03 · [lib/results/foundation-interpretation.ts:11](https://github.com/yippy141/ir-worldview-app/blob/b49365f79bdd4306fbe62d9f8ee2e48f130f5008/lib/results/foundation-interpretation.ts#L11)

> The normative position leaves the threshold for overriding established order unresolved.

**Why:** Turns a middle aggregate into an assertion that a threshold is unresolved.

**Edit direction:** These scores alone do not show when you would put justice ahead of sovereignty.

### E04 · [lib/results/foundation-interpretation.ts:10](https://github.com/yippy141/ir-worldview-app/blob/b49365f79bdd4306fbe62d9f8ee2e48f130f5008/lib/results/foundation-interpretation.ts#L10)

> The strategic position leaves the boundary between applying pressure and setting limits unresolved.

**Why:** Heavy nouns and a claim about what the person has not resolved.

**Edit direction:** These scores alone do not show how far you would press an advantage.

### E05 · [lib/results/foundation-interpretation.ts:8](https://github.com/yippy141/ir-worldview-app/blob/b49365f79bdd4306fbe62d9f8ee2e48f130f5008/lib/results/foundation-interpretation.ts#L8)

> Your recorded position treats recognition and legitimacy as forces that can shape interests themselves.

**Why:** A technically intelligible but needlessly abstract lead.

**Edit direction:** Your answers suggest that recognition and legitimacy can change what states want.

### E06 · [lib/results/foundation-interpretation.ts:6](https://github.com/yippy141/ir-worldview-app/blob/b49365f79bdd4306fbe62d9f8ee2e48f130f5008/lib/results/foundation-interpretation.ts#L6)

> The institutional score does not establish how far rules can bind powerful actors.

**Why:** The score is made the grammatical subject of an explanation.

**Edit direction:** These answers leave open how far rules can constrain powerful states.

### E07 · [lib/results/foundation-interpretation.ts:9](https://github.com/yippy141/ir-worldview-app/blob/b49365f79bdd4306fbe62d9f8ee2e48f130f5008/lib/results/foundation-interpretation.ts#L9)

> The political-economy score does not settle whether economic structure or diplomatic choice does more explanatory work.

**Why:** A useful limit buried in several abstract nouns.

**Edit direction:** These answers do not show whether you would explain this case through economic dependence or diplomatic choices.

### E08 · [lib/results/foundation-interpretation.ts:29](https://github.com/yippy141/ir-worldview-app/blob/b49365f79bdd4306fbe62d9f8ee2e48f130f5008/lib/results/foundation-interpretation.ts#L29)

> The strongest rival argument is that repeated inspection can itself make cooperation more durable, even when the initial political bargain is fragile.

**Why:** Redundant ranking language underneath a strongest-objection heading. The substantive argument is good.

**Edit direction:** Repeated inspections may make cooperation more durable even after the original bargain weakens.

### E09 · [lib/results/foundation-interpretation.ts:51](https://github.com/yippy141/ir-worldview-app/blob/b49365f79bdd4306fbe62d9f8ee2e48f130f5008/lib/results/foundation-interpretation.ts#L51)

> The argument changes if inspections reveal violations soon enough to matter, or if the concession materially changes one side's ability to coerce the other.

**Why:** Repeated meta-introduction. Name the evidence directly.

**Edit direction:** Look for timely detection of violations and whether the concession changes either side’s ability to coerce the other.

### E10 · [lib/results/foundation-interpretation.ts:49](https://github.com/yippy141/ir-worldview-app/blob/b49365f79bdd4306fbe62d9f8ee2e48f130f5008/lib/results/foundation-interpretation.ts#L49)

> `${middle ? "The scores do not establish a dominant explanation here. One live argument is that inspections change incentives; another is that they work only while the strategic bargain holds." : lenses[first].application} ${scores.restraint >= 5 ? "The restraint position adds a reason to preserve a limited bargain even if it leaves some advantage unused." : scores.restraint <= 3 ? "The advantage-oriented position adds a reason to demand stronger terms while bargaining power is available." : "The strategic score does not settle how hard to press for better terms."}`

**Why:** Self-narration before the competing ideas; flat input must not imply equal endorsement.

**Edit direction:** One argument is that inspections change incentives; another is that they depend on the strategic bargain. These scores do not tell us which you favor.

### E11 · [lib/perspectives/result-helpers.ts:171](https://github.com/yippy141/ir-worldview-app/blob/b49365f79bdd4306fbe62d9f8ee2e48f130f5008/lib/perspectives/result-helpers.ts#L171)

> `The role moved you toward ${lead.direction}. Shifts also appeared in ${supportingText}.`

**Why:** Causal interpretation of authored offsets. High-priority claim correction.

**Edit direction:** These role choices receive more weight on [dimension] in this model.

### E12 · [app/perspectives/[perspectiveId]/result/[payload]/page.tsx:222](https://github.com/yippy141/ir-worldview-app/blob/b49365f79bdd4306fbe62d9f8ee2e48f130f5008/app/perspectives/[perspectiveId]/result/[payload]/page.tsx#L222)

> Held dimensions carry as much information as moved ones. They mark judgments the role could not shake.

**Why:** An unjustified assertion of stability and equal information. Zero offsets and clipped scores cannot support it.

**Edit direction:** The model assigned little change to these dimensions. This does not establish that the role tested those judgments.

### E13 · [lib/perspectives/result-helpers.ts:157](https://github.com/yippy141/ir-worldview-app/blob/b49365f79bdd4306fbe62d9f8ee2e48f130f5008/lib/perspectives/result-helpers.ts#L157)

> `${roleLabel} kept your baseline steady`

**Why:** A model overlay is made into a statement about the user’s stability.

**Edit direction:** This run adds little modeled change to the saved baseline.

### E14 · [lib/decision-exercises/content.ts:72](https://github.com/yippy141/ir-worldview-app/blob/b49365f79bdd4306fbe62d9f8ee2e48f130f5008/lib/decision-exercises/content.ts#L72)

> Admit qualified teams to the secure research enclave under the admission rule below. Keep general access to a monitored hosted service.

**Why:** Directional reference is wrong in the live layout: admission authority appears above.

**Edit direction:** Admit qualified teams to the secure research enclave under the stated admission rule.

### E15 · [lib/decision-exercises/content.ts:100](https://github.com/yippy141/ir-worldview-app/blob/b49365f79bdd4306fbe62d9f8ee2e48f130f5008/lib/decision-exercises/content.ts#L100)

> Withhold a decision within this bounded choice set. This is not an additional policy arrangement.

**Why:** Implementation phrasing in an answer option.

**Edit direction:** I need more information or different terms before choosing.

### E16 · [lib/decision-exercises/readbacks.ts:64](https://github.com/yippy141/ir-worldview-app/blob/b49365f79bdd4306fbe62d9f8ee2e48f130f5008/lib/decision-exercises/readbacks.ts#L64)

> You withheld an arrangement decision in both conditions. This bounded choice set did not supply the information or terms you needed; it does not locate you between the three policies.

**Why:** The key point is refusal, not the architecture of the available choices.

**Edit direction:** You deferred both decisions. We would need to know what information or terms were missing before interpreting that choice.

### E17 · [lib/futures/departure.ts:147](https://github.com/yippy141/ir-worldview-app/blob/b49365f79bdd4306fbe62d9f8ee2e48f130f5008/lib/futures/departure.ts#L147)

> The choices below are your account of the offer, the evidence you would need and the powers you would authorize. This draft has no additional interpretation rule that applies to this combination.

**Why:** Exposes rule-engine coverage instead of helping the reader understand the outcome.

**Edit direction:** Your answers leave the offer, required evidence and governing powers open. Review them separately below.

### E18 · [lib/futures/departure.ts:137](https://github.com/yippy141/ir-worldview-app/blob/b49365f79bdd4306fbe62d9f8ee2e48f130f5008/lib/futures/departure.ts#L137)

> For the fictional adult, you

**Why:** Awkward pronoun splice in a conditional policy-framing branch. Source-confirmed; this specific branch was not generated live.

**Edit direction:** For each branch, use a full sentence such as “You advised the fictional adult to…”

### E19 · [lib/futures/interpretation.ts:48](https://github.com/yippy141/ir-worldview-app/blob/b49365f79bdd4306fbe62d9f8ee2e48f130f5008/lib/futures/interpretation.ts#L48)

> You favor a universal material guarantee and production without private ownership. Common control would still need workable allocation rules to turn collective resources into dependable provision, rather than leaving that benefit assumed.

**Why:** Noun-heavy but substantive; explain the institution directly.

**Edit direction:** A public or common owner would still need rules for deciding who receives resources.

### E20 · [lib/futures/interpretation.ts:59](https://github.com/yippy141/ir-worldview-app/blob/b49365f79bdd4306fbe62d9f8ee2e48f130f5008/lib/futures/interpretation.ts#L59)

> You want biological humanity to continue alongside institutional standing for hypothetical artificial persons. This is a preference for coexistence with recognition, rather than an inference that today’s AI systems are conscious or that all future citizens should have identical votes.

**Why:** The boundary about hypothetical persons is necessary, but the phrase is abstract.

**Edit direction:** You support continuing biological humanity and political standing for the artificial persons assumed in the question. This says nothing about whether present AI is conscious.

### E21 · [lib/futures/interpretation.ts:68](https://github.com/yippy141/ir-worldview-app/blob/b49365f79bdd4306fbe62d9f8ee2e48f130f5008/lib/futures/interpretation.ts#L68)

> You prefer irrevocable membership for a society you join. This is a positive preference for binding commitment, rather than merely declining to make exit indispensable.

**Why:** Overexplains the distinction in methodological language.

**Edit direction:** You explicitly preferred membership that cannot be ended. You did more than leave exit rights undecided.

### E22 · [lib/futures/interpretation.ts:77](https://github.com/yippy141/ir-worldview-app/blob/b49365f79bdd4306fbe62d9f8ee2e48f130f5008/lib/futures/interpretation.ts#L77)

> You prefer an arrangement built around an indispensable provider for its capabilities. Its usefulness would come with accepted dependency, rather than a continuing capacity to operate independently.

**Why:** Awkward nominalization after a concrete preference.

**Edit direction:** You accepted dependence on one provider in exchange for its capabilities.

### E23 · [lib/futures/interpretation.ts:115](https://github.com/yippy141/ir-worldview-app/blob/b49365f79bdd4306fbe62d9f8ee2e48f130f5008/lib/futures/interpretation.ts#L115)

> Enough scenario conditions are known to identify disagreement, but no remaining entry has both positive net agreement and support across enough of your active domains. This is a mismatch with the described worlds, rather than simply missing information. You can inspect the disagreements below without relaxing your preferences.

**Why:** Scoring terminology in a recommendation explanation.

**Edit direction:** None of the described worlds fits enough of your stated priorities to suggest a close comparison. The disagreements are listed below.

### E24 · [lib/results/module-interpretation.ts:19](https://github.com/yippy141/ir-worldview-app/blob/b49365f79bdd4306fbe62d9f8ee2e48f130f5008/lib/results/module-interpretation.ts#L19)

> `${context.bankVersion === 2 ? "On the 1–7 scale" : "Within this form’s model"}, this position leans toward ${(bands[axis.key] === "low" ? axis.lowLabel : axis.highLabel).toLowerCase()}.`

**Why:** Repeated hedge on every axis. It also conceals why a number right of 4 can be called low.

**Edit direction:** Explain the form’s reference bands once, then state each direction. Align the meter with that explanation.

### E25 · [lib/results/module-interpretation.ts:19](https://github.com/yippy141/ir-worldview-app/blob/b49365f79bdd4306fbe62d9f8ee2e48f130f5008/lib/results/module-interpretation.ts#L19)

> `This ${context.bankVersion === 2 ? "score on the 1–7 scale" : "form"} does not select a strong direction between ${axis.lowLabel.toLowerCase()} and ${axis.highLabel.toLowerCase()}. Opposing answers can also yield this value.`

**Why:** Necessary warning repeated mechanically.

**Edit direction:** Keep one nearby note explaining that similar averages can come from different choices; link to the actual answers.

### E26 · [lib/results/module-interpretation.ts:52](https://github.com/yippy141/ir-worldview-app/blob/b49365f79bdd4306fbe62d9f8ee2e48f130f5008/lib/results/module-interpretation.ts#L52)

> An interpretation of this module's recorded positions under its registered form. The scenario is illustrative and does not add an answer or alter any score.

**Why:** Three abstract labels before the example.

**Edit direction:** This result summarizes your answers to these cases. The next case illustrates the argument.

### E27 · [lib/results/module-interpretation.ts:51](https://github.com/yippy141/ir-worldview-app/blob/b49365f79bdd4306fbe62d9f8ee2e48f130f5008/lib/results/module-interpretation.ts#L51)

> `${contextual} The aggregates below combine these contextual choices; a moderate value does not establish indecision.`

**Why:** Useful limitation in unnecessarily technical language.

**Edit direction:** The scores combine different case choices. A middle score does not mean you were undecided.

### E28 · [lib/results/ai-interpretation.ts:29](https://github.com/yippy141/ir-worldview-app/blob/b49365f79bdd4306fbe62d9f8ee2e48f130f5008/lib/results/ai-interpretation.ts#L29)

> An interpretation of the recorded scores. This link does not contain an answer transcript; the example below is an application of the reasoning, not a forecast of your choice.

**Why:** Correct provenance note made cumbersome.

**Edit direction:** The example applies these ideas to a new case; it does not predict your choice.

### E29 · [lib/ai-governance-profile-copy.ts:41](https://github.com/yippy141/ir-worldview-app/blob/b49365f79bdd4306fbe62d9f8ee2e48f130f5008/lib/ai-governance-profile-copy.ts#L41)

> Treat frontier AI as a strategic technology whose governance has to survive rivalry, not wish rivalry away.

**Why:** Antithesis caricatures a rival view as wishing rivalry away.

**Edit direction:** Design AI safeguards that remain enforceable when states compete.

### E30 · [lib/ai-governance-profile-copy.ts:43](https://github.com/yippy141/ir-worldview-app/blob/b49365f79bdd4306fbe62d9f8ee2e48f130f5008/lib/ai-governance-profile-copy.ts#L43)

> Prioritize institutions that preserve national or alliance-level capability without ignoring safety.

**Why:** Virtue padding: few opposing views advocate ignoring safety.

**Edit direction:** State the specific safeguard and the competitive cost it is meant to preserve or accept.

### E31 · [lib/ai-governance-profile-copy.ts:30](https://github.com/yippy141/ir-worldview-app/blob/b49365f79bdd4306fbe62d9f8ee2e48f130f5008/lib/ai-governance-profile-copy.ts#L30)

> Robust evidence that controlled real-world deployment reduces risk faster than withholding systems.

**Why:** “Robust” does not identify what evidence would change the argument.

**Edit direction:** Evidence that a specified controlled release reduced a defined harm more than continued withholding, with a credible comparison.

### E32 · [lib/ai-governance-profile-copy.ts:28](https://github.com/yippy141/ir-worldview-app/blob/b49365f79bdd4306fbe62d9f8ee2e48f130f5008/lib/ai-governance-profile-copy.ts#L28)

> Your critics will say that precaution can become an incumbent-friendly politics of delay, especially if the institutions doing the slowing are not broadly trusted.

**Why:** Predicts a reader’s critics and attributes a broad position from a category.

**Edit direction:** A criticism of this approach is that precaution may protect incumbent firms or institutions.

### E33 · [lib/ai-governance-profile-copy.ts:37](https://github.com/yippy141/ir-worldview-app/blob/b49365f79bdd4306fbe62d9f8ee2e48f130f5008/lib/ai-governance-profile-copy.ts#L37)

> You would rather absorb real costs now than discover too late that capability outran control.

**Why:** Sweeping second-person archetype copy. Appropriate only as an explicitly authored summary, not a statement from direct answers.

**Edit direction:** This approach accepts near-term costs to retain control before a dangerous capability spreads.

### E34 · [lib/ai-governance-profile-copy.ts:137](https://github.com/yippy141/ir-worldview-app/blob/b49365f79bdd4306fbe62d9f8ee2e48f130f5008/lib/ai-governance-profile-copy.ts#L137)

> You think the real divide is between actors that can govern AI in practice and those that become dependent on those who can.

**Why:** “Real divide” supplies rhetorical certainty and infers a personal belief.

**Edit direction:** This approach emphasizes whether a state can build and govern AI itself or must depend on others.

### E35 · [lib/connected/relations.ts:48](https://github.com/yippy141/ir-worldview-app/blob/b49365f79bdd4306fbe62d9f8ee2e48f130f5008/lib/connected/relations.ts#L48)

> A different release choice, a different AI openness or risk position, or an exact AI release answer changes this text.

**Why:** Diagnostic dependency wording. Inspect its rendering context before editing; metadata need not become prose.

**Edit direction:** If exposed to readers, say which recorded choice supports the connection and invite them to change or reject that interpretation.

### E36 · [lib/connected/relations.ts:47](https://github.com/yippy141/ir-worldview-app/blob/b49365f79bdd4306fbe62d9f8ee2e48f130f5008/lib/connected/relations.ts#L47)

> Technology bank 3 release decision plus a resolved AI openness axis; exact AI release choice when supplied.

**Why:** Useful provenance metadata; jargon if shown as the user’s payoff.

**Edit direction:** Keep the exact bank version in the evidence disclosure, after the concrete answer.

### E37 · [components/quiz/ai-governance-review-screen.tsx:225](https://github.com/yippy141/ir-worldview-app/blob/b49365f79bdd4306fbe62d9f8ee2e48f130f5008/components/quiz/ai-governance-review-screen.tsx#L225)

> The profile is computed when you click &ldquo;Generate.&rdquo; No data leaves your browser.

**Why:** An absolute privacy claim contradicts navigation to a server-rendered URL containing derived result data. Raw answers and encoded results are different.

**Edit direction:** Your answers are scored in this browser. Opening the result sends its encoded scores in the page URL; the answer transcript stays here.

### E38 · [lib/atlas-lite.ts:90](https://github.com/yippy141/ir-worldview-app/blob/b49365f79bdd4306fbe62d9f8ee2e48f130f5008/lib/atlas-lite.ts#L90)

> It is easy to mistake for Coalitions First, because both resist maximalism, and for Different by Domain, because both can look unsettled. The difference: Several Lenses keeps the overlap between arguments intact, while Different by Domain shows a real split between domains or between diagnosis and decision.

**Why:** All ten sibling pages use the same comparison scaffold. The concepts differ; the prose should make the relevant decision differ too.

**Edit direction:** Use a two-row comparison: “Shared concern” and “Where the priorities diverge,” with one concrete case. Preserve the substantive distinctions.

### E39 · [lib/atlas-lite.ts:139](https://github.com/yippy141/ir-worldview-app/blob/b49365f79bdd4306fbe62d9f8ee2e48f130f5008/lib/atlas-lite.ts#L139)

> It is easy to mistake for Power and Leverage, because both start from rivalry, and for Coalitions First, because both accept limits. The difference: this pattern treats the strategic ceiling as the first question, and Power and Leverage treats it as a later correction.

**Why:** All ten sibling pages use the same comparison scaffold. The concepts differ; the prose should make the relevant decision differ too.

**Edit direction:** Use a two-row comparison: “Shared concern” and “Where the priorities diverge,” with one concrete case. Preserve the substantive distinctions.

### E40 · [lib/atlas-lite.ts:188](https://github.com/yippy141/ir-worldview-app/blob/b49365f79bdd4306fbe62d9f8ee2e48f130f5008/lib/atlas-lite.ts#L188)

> It is easy to mistake for Power with Limits, because both are plainly realist, and for Power Behind the Rules, because both pay close attention to leverage. The difference: this pattern sees leverage as a competitive tool, and Power Behind the Rules sees it as evidence of a deeper hierarchy.

**Why:** All ten sibling pages use the same comparison scaffold. The concepts differ; the prose should make the relevant decision differ too.

**Edit direction:** Use a two-row comparison: “Shared concern” and “Where the priorities diverge,” with one concrete case. Preserve the substantive distinctions.

### E41 · [lib/atlas-lite.ts:238](https://github.com/yippy141/ir-worldview-app/blob/b49365f79bdd4306fbe62d9f8ee2e48f130f5008/lib/atlas-lite.ts#L238)

> It is easy to mistake for Rules and Cooperation, because both value coordination, and for Power with Limits, because both resist overreach. The difference: Coalitions First starts with partner management and whether a policy can last, and neither with rules alone nor with strategic ceilings alone.

**Why:** All ten sibling pages use the same comparison scaffold. The concepts differ; the prose should make the relevant decision differ too.

**Edit direction:** Use a two-row comparison: “Shared concern” and “Where the priorities diverge,” with one concrete case. Preserve the substantive distinctions.

### E42 · [lib/atlas-lite.ts:288](https://github.com/yippy141/ir-worldview-app/blob/b49365f79bdd4306fbe62d9f8ee2e48f130f5008/lib/atlas-lite.ts#L288)

> It is easy to mistake for Coalitions First, because both trust coordinated action, and for Meaning and Legitimacy, because both can take institutions seriously. The difference: Rules and Cooperation puts its faith first in rule design, monitoring, and repeated cooperation.

**Why:** All ten sibling pages use the same comparison scaffold. The concepts differ; the prose should make the relevant decision differ too.

**Edit direction:** Use a two-row comparison: “Shared concern” and “Where the priorities diverge,” with one concrete case. Preserve the substantive distinctions.

### E43 · [lib/atlas-lite.ts:338](https://github.com/yippy141/ir-worldview-app/blob/b49365f79bdd4306fbe62d9f8ee2e48f130f5008/lib/atlas-lite.ts#L338)

> It is easy to mistake for Rules and Cooperation, because both can value rules, and for Justice and Protection, because both keep legitimacy in view. The difference: Meaning and Legitimacy is centered on meaning, recognition, and interpretation, and stops short of a moral argument for overriding sovereignty.

**Why:** All ten sibling pages use the same comparison scaffold. The concepts differ; the prose should make the relevant decision differ too.

**Edit direction:** Use a two-row comparison: “Shared concern” and “Where the priorities diverge,” with one concrete case. Preserve the substantive distinctions.

### E44 · [lib/atlas-lite.ts:388](https://github.com/yippy141/ir-worldview-app/blob/b49365f79bdd4306fbe62d9f8ee2e48f130f5008/lib/atlas-lite.ts#L388)

> It is easy to mistake for Meaning and Legitimacy, because both take legitimacy seriously, and for Several Lenses, because both resist a sovereignty-first conclusion. The difference: this pattern is readier to say that extreme moral stakes should change the threshold for action.

**Why:** All ten sibling pages use the same comparison scaffold. The concepts differ; the prose should make the relevant decision differ too.

**Edit direction:** Use a two-row comparison: “Shared concern” and “Where the priorities diverge,” with one concrete case. Preserve the substantive distinctions.

### E45 · [lib/atlas-lite.ts:437](https://github.com/yippy141/ir-worldview-app/blob/b49365f79bdd4306fbe62d9f8ee2e48f130f5008/lib/atlas-lite.ts#L437)

> It is easy to mistake for Power and Leverage, because both take leverage seriously, and for Capacity and Autonomy, because both focus on dependence. The difference: Power Behind the Rules treats the hierarchy itself as the story, where the others see state strategy or policy room.

**Why:** All ten sibling pages use the same comparison scaffold. The concepts differ; the prose should make the relevant decision differ too.

**Edit direction:** Use a two-row comparison: “Shared concern” and “Where the priorities diverge,” with one concrete case. Preserve the substantive distinctions.

### E46 · [lib/atlas-lite.ts:487](https://github.com/yippy141/ir-worldview-app/blob/b49365f79bdd4306fbe62d9f8ee2e48f130f5008/lib/atlas-lite.ts#L487)

> It is easy to mistake for Power Behind the Rules, because both focus on dependence, and for Coalitions First, because both can value coordination. The difference: Capacity and Autonomy is centered on state capacity and future bargaining room.

**Why:** All ten sibling pages use the same comparison scaffold. The concepts differ; the prose should make the relevant decision differ too.

**Edit direction:** Use a two-row comparison: “Shared concern” and “Where the priorities diverge,” with one concrete case. Preserve the substantive distinctions.

### E47 · [lib/atlas-lite.ts:537](https://github.com/yippy141/ir-worldview-app/blob/b49365f79bdd4306fbe62d9f8ee2e48f130f5008/lib/atlas-lite.ts#L537)

> It is easy to mistake for Several Lenses, because both resist a single hard label. The difference: Several Lenses holds several arguments open at once, while Different by Domain shows a real split between domains, or between diagnosis and choice.

**Why:** All ten sibling pages use the same comparison scaffold. The concepts differ; the prose should make the relevant decision differ too.

**Edit direction:** Use a two-row comparison: “Shared concern” and “Where the priorities diverge,” with one concrete case. Preserve the substantive distinctions.

### E48 · [content/archetypes.json:19](https://github.com/yippy141/ir-worldview-app/blob/b49365f79bdd4306fbe62d9f8ee2e48f130f5008/content/archetypes.json#L19)

> Your answers put power and timing first: a strategic opening is an opportunity to act.

**Why:** Browse-page second person addresses an untested visitor as if they submitted answers.

**Edit direction:** This reading treats a strategic opening as a reason to act.

### E49 · [content/archetypes.json:693](https://github.com/yippy141/ir-worldview-app/blob/b49365f79bdd4306fbe62d9f8ee2e48f130f5008/content/archetypes.json#L693)

> Your answers give rules force only when they are backed by credible enforcement.

**Why:** Browse-page second person addresses an untested visitor as if they submitted answers.

**Edit direction:** This reading emphasizes the enforcement that gives rules practical force.

### E50 · [content/archetypes.json:1365](https://github.com/yippy141/ir-worldview-app/blob/b49365f79bdd4306fbe62d9f8ee2e48f130f5008/content/archetypes.json#L1365)

> Your answers treat shared beliefs as politically decisive: changing the public narrative can change what power achieves.

**Why:** Browse-page second person addresses an untested visitor as if they submitted answers.

**Edit direction:** This reading treats shared beliefs and public narratives as sources of political change.

### E51 · [content/archetypes.json:2027](https://github.com/yippy141/ir-worldview-app/blob/b49365f79bdd4306fbe62d9f8ee2e48f130f5008/content/archetypes.json#L2027)

> Your answers give production and finance a leading role, with the state actively shaping the dependencies they create.

**Why:** Browse-page second person addresses an untested visitor as if they submitted answers.

**Edit direction:** This reading emphasizes how states shape production, finance and dependence.

### E52 · [lib/profile-helpers.ts:142](https://github.com/yippy141/ir-worldview-app/blob/b49365f79bdd4306fbe62d9f8ee2e48f130f5008/lib/profile-helpers.ts#L142)

> Across the saved layers, you keep coming back to power, leverage, and whether commitments hold under pressure.

**Why:** Source candidate in a mixed legacy/helper file. Current live exposure of this exact branch is NOT established. If active, it over-infers habits or uses abstract product metaphors.

**Edit direction:** These recorded answers emphasize power and the credibility of commitments.

### E53 · [lib/profile-helpers.ts:144](https://github.com/yippy141/ir-worldview-app/blob/b49365f79bdd4306fbe62d9f8ee2e48f130f5008/lib/profile-helpers.ts#L144)

> Across the saved layers, you keep coming back to rules, coordination, and whether institutions can change behavior.

**Why:** Source candidate in a mixed legacy/helper file. Current live exposure of this exact branch is NOT established. If active, it over-infers habits or uses abstract product metaphors.

**Edit direction:** These recorded answers emphasize rules and how institutions change behavior.

### E54 · [lib/profile-helpers.ts:146](https://github.com/yippy141/ir-worldview-app/blob/b49365f79bdd4306fbe62d9f8ee2e48f130f5008/lib/profile-helpers.ts#L146)

> Across the saved layers, you keep coming back to legitimacy, framing, and how actors interpret the situation.

**Why:** Source candidate in a mixed legacy/helper file. Current live exposure of this exact branch is NOT established. If active, it over-infers habits or uses abstract product metaphors.

**Edit direction:** These recorded answers emphasize legitimacy and how actors interpret a situation.

### E55 · [lib/profile-helpers.ts:148](https://github.com/yippy141/ir-worldview-app/blob/b49365f79bdd4306fbe62d9f8ee2e48f130f5008/lib/profile-helpers.ts#L148)

> Across the saved layers, you keep coming back to dependence, concentration, and who gets to set the terms.

**Why:** Source candidate in a mixed legacy/helper file. Current live exposure of this exact branch is NOT established. If active, it over-infers habits or uses abstract product metaphors.

**Edit direction:** These recorded answers emphasize dependence and who sets its terms.

### E56 · [lib/profile-helpers.ts:304](https://github.com/yippy141/ir-worldview-app/blob/b49365f79bdd4306fbe62d9f8ee2e48f130f5008/lib/profile-helpers.ts#L304)

> The saved overlays move the baseline more in texture than in direction.

**Why:** Source candidate in a mixed legacy/helper file. Current live exposure of this exact branch is NOT established. If active, it over-infers habits or uses abstract product metaphors.

**Edit direction:** The results differ on specific issues while sharing [named, evidenced emphasis].

### E57 · [lib/profile-helpers.ts:378](https://github.com/yippy141/ir-worldview-app/blob/b49365f79bdd4306fbe62d9f8ee2e48f130f5008/lib/profile-helpers.ts#L378)

> The important point here is not that the model found a total theory of everything. It is that the Foundation is already doing substantial interpretive work before any module pressure is added.

**Why:** Source candidate in a mixed legacy/helper file. Current live exposure of this exact branch is NOT established. If active, it over-infers habits or uses abstract product metaphors.

**Edit direction:** State the concrete relation supported by the available answers; remove the announcement of importance.

### E58 · [lib/profile-helpers.ts:417](https://github.com/yippy141/ir-worldview-app/blob/b49365f79bdd4306fbe62d9f8ee2e48f130f5008/lib/profile-helpers.ts#L417)

> The value here is not that the model has found a cleaner type. It is that it can name where your profile genuinely pulls in different directions.

**Why:** Source candidate in a mixed legacy/helper file. Current live exposure of this exact branch is NOT established. If active, it over-infers habits or uses abstract product metaphors.

**Edit direction:** Describe the disagreement between the actual answers; do not praise the system for finding it.

### E59 · [lib/profile-helpers.ts:481](https://github.com/yippy141/ir-worldview-app/blob/b49365f79bdd4306fbe62d9f8ee2e48f130f5008/lib/profile-helpers.ts#L481)

> The stable payoff is not that nothing changes. It is that the same broad profile still holds once the issue domains get harder.

**Why:** Source candidate in a mixed legacy/helper file. Current live exposure of this exact branch is NOT established. If active, it over-infers habits or uses abstract product metaphors.

**Edit direction:** State exactly which recorded positions agree; avoid claiming personal stability.

### E60 · [lib/profile-helpers.ts:153](https://github.com/yippy141/ir-worldview-app/blob/b49365f79bdd4306fbe62d9f8ee2e48f130f5008/lib/profile-helpers.ts#L153)

> You usually start with leverage, constraint, and whether commitments survive real pressure.

**Why:** Source candidate in a mixed legacy/helper file. Current live exposure of this exact branch is NOT established. If active, it over-infers habits or uses abstract product metaphors.

**Edit direction:** These answers give weight to [specific consideration].

### E61 · [lib/profile-helpers.ts:271](https://github.com/yippy141/ir-worldview-app/blob/b49365f79bdd4306fbe62d9f8ee2e48f130f5008/lib/profile-helpers.ts#L271)

> The AI layer is not saved yet, so the governance side of the mosaic is still open.

**Why:** Source candidate in a mixed legacy/helper file. Current live exposure of this exact branch is NOT established. If active, it over-infers habits or uses abstract product metaphors.

**Edit direction:** No AI Governance result is saved here.

## Additional live-page edits

These were observed in rendered pages. Their nearby context matters more than counting keyword matches.

| Passage | Problem | Suggested direction |
|---|---|---|
| “The lead is clearer within the current item set.” | Comparative adjective without an obvious comparison. | “This question set favors Constructivism over the nearest alternative.” Make clear that this is an authored comparison, not certainty about a person. |
| “What did the work” / “largest positive contribution” | Colloquial heading followed by technical attribution. | “Why these answers favored this reading,” then name the dimension and contrasting argument. |
| “With every other submitted answer held fixed…” repeated in counterfactual cards | Each card repeats a methodological preamble. | Put the fixed-answer condition once above the cards. State the changed answer and resulting change on each card. |
| “Not inferred” on the Current Case result | An unexplained fragment placed after selected reasons. | Label the list “Reasons you selected.” State any limitation in a complete sentence only if needed. |
| “This case does not yet include a reviewed, versioned mapping…” | An unavailable feature becomes a prominent paragraph. | “This case is separate from your Foundation result.” Keep future mapping plans out of the payoff. |
| “An interpretation of the recorded scores…” | Opens with the status of the output rather than its meaning. | Move this scope sentence after the first concrete insight. |
| “Exact English wording from bank 3, scorer 2, standard form.” | Valuable provenance interrupts a reader's question. | Place under “Question wording and version.” Keep the short statement that exact answers disappear on reload close to the transcript. |
| “Different or incomplete terms,” “Unspecified,” “The scenario leaves this condition unspecified,” “Unresolved.” | Up to four markers describe the same missing information in Futures comparison. | One visible “Not specified,” with source reasoning available on expansion. Never recode unknown as absent. |
| “For the fictional adult, you…” | Policy framing is assembled through a pronoun patch. | “You advised the fictional adult to…” with separately written complete sentences. |
| “AThe invitation,” “BThe return,” “CThe authority” in accessible text | Visual spacing does not supply a spoken separator. | Accessible names “A: The invitation,” and so on. Check the rendered controls. |
| “Guardian in the Background” and “AI Futures: Open Frontier” | Retained editorial aliases differ from current catalogue titles. | Use the current public title with the alias explained once, while preserving existing links. |
| “No single tool dominates” | In Technology, “tool” could mean an actual technology. | “Your technology choices favor different policies in different cases.” Keep the heading brief if followed by this explanation. |
| “Meaningful changes” in old history | A numeric display rule sounds like a substantive or statistical judgment. | Describe the difference directly and its provenance; never call it meaningful without a defined basis. |
| “6 factual claims · 5 direct sources” | Counts can look like quality ratings. | Keep them as ledger navigation, not a trust score. The country-count error shows why totals are not validation. |

## Chinese review: targeted improvements, not a claim of equivalence

The Chinese Foundation and supported reading/recovery pages were included in route and browser-suite coverage. No bilingual participant study was performed. A native subject-matter editor should check naturalness and conceptual equivalence separately.

- “情境推演” is intelligible, but does not by itself convey advising from a different actor's seat. Add a short definition when introducing Perspective Runs.
- “想象中的阵营” may be less precise than “虚构阵营” for the home globe. The important thing is that readers understand it is fictional, not live geopolitical data.
- Repeated “画像／维度／立场／解读／记录” can reproduce the English product vocabulary problem. Prefer an explicit action or question where possible.
- Do not label short keyboard instructions or the measure word “份” as AI errors just because they are repetitive. DeepSeek suggested this; the evidence does not justify a blanket rewrite.
- Preserve proper names and explain their role. A translated name or an exotic borrowed term is not a substitute for a functional description.

## What should stay

1. “Selection does not advance” is useful operational information. Keep it where behavior could surprise a respondent.
2. “Matching scores do not establish identical answers or reasoning” is a precise comparison limit. Compress repetition around it; do not remove it.
3. “No preference,” “Not sure,” and “Neither describes my view” are different response states. Keep that distinction.
4. “Independent inspection,” “reciprocity,” “sovereignty” and “legitimacy” can be necessary terms. Define them and use them consistently rather than banning policy vocabulary.
5. A strongest-objection section is good. The repeated phrase “The strongest objection is…” underneath the heading is usually unnecessary.
6. Source titles, quoted material, and frozen scorer coefficients should not be rewritten to satisfy a detector.
7. A limitation belongs near a claim when it changes the interpretation. Moving every limitation to Method would make several current headlines more misleading.
8. Source/assumption/inference distinctions in Futures and Current Cases are substantive. Simplify their display without erasing them.

## Editing sequence

Fix incorrect context and unsupported personal claims first: shared-result ownership, browse-page “your answers,” Perspective movement and stability, and the neutral tie. Next simplify result heroes and fold complete transcripts. Then revise the ten repetitive Decision Pattern comparisons and legacy aliases. Finally use the CSV to inspect conditional branches and long-tail language.

The result should sound like an editor explaining a political argument to an intelligent reader. It need not sound informal. It should make the actor, action, tradeoff and evidence visible before describing the machinery that assembled the paragraph.
