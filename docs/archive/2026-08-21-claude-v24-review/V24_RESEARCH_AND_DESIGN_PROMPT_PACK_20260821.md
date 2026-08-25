> **HISTORICAL, SUPERSEDED, NON-EXECUTABLE.** Preserved only for provenance. Verify every claim against the current roadmap, Git state, and runtime before reuse.

# Deep Research and Claude Design Prompt Pack

> **HISTORICAL, SUPERSEDED, NON-EXECUTABLE. DO NOT RUN THESE PROMPTS.** Current research starts only at its named evidence gate.

**Date:** 21 August 2026
**Purpose:** the work that a coding agent cannot do. Seven Deep Research prompts and five Claude Design prompts, paste-ready.

Run the research prompts in parallel with the Codex sprint. They cost nothing but time and they produce the inputs V24 and V25 need.

---

# PART ONE — DEEP RESEARCH PROMPTS

Each prompt assumes ChatGPT Deep Research or an equivalent long-horizon research mode. Where a Claude conversation is better suited, it says so.

## Universal research contract

**Paste at the top of every research prompt below.**

> You are producing a non-shipping research pack for an editorial measurement instrument. It will be reviewed by the owner before any of it enters a question bank.
>
> Rules:
> - **Every factual claim carries a source with publisher, date, and a durable link.** Where a primary document exists — a statute, a regulation, an official communiqué, a filing — cite the primary document, not coverage of it.
> - **Wikipedia is not substantive evidence.** It may appear as an orientation pointer and nowhere else.
> - **You may say "insufficient evidence."** Do not fill a required field with a plausible sentence. An empty cell with a note is correct; a fabricated citation ends the exercise.
> - **Distinguish sharply** between (a) what a source establishes, (b) what is contested among informed observers, and (c) your own inference. Label each.
> - **Non-English sources are required** where the topic has a significant non-English policy literature. Note the language and provide the original title.
> - **Do not propose final scored axes, signals, weights, result labels, or headlines.** Everything you produce is a candidate for review.
> - **Flag social-desirability risk explicitly.** For any candidate dimension, state which pole a respondent would choose to look decent, sophisticated, moderate, or humane.
> - Output as structured Markdown with tables. Where a ledger is requested, produce a table that could be exported to CSV without restructuring.

---

## R-1 — AI Governance bank v3 source pack

**Priority: highest.** This is the most valuable single research artifact for the career goal, independent of whether the bank ships.

> [Universal research contract]
>
> **Task.** Produce a source-backed construct pack for a scored instrument measuring how a person reasons about frontier AI governance. The existing instrument uses eight axes — risk horizon, deployment pace, oversight, geopolitics, openness, military role, human future — authored before the current landscape and now inadequate. You are producing the evidence base for its replacement.
>
> **Part 1 — the landscape ledger.** Document the state of AI governance as of August 2026 across at least these strands, with primary sources and dates:
>
> - EU AI Act implementation: what is in force, what the Digital Omnibus (Reg. EU 2026/1744) changed, what the current Annex I and Annex III deadlines are, what enforcement has actually occurred, and the status of the annulled Italian penalty
> - US federal and state conflict: the December 2025 executive order and the DOJ litigation posture, the Senate moratorium vote, the Colorado SB 24-205 to SB 26-189 sequence, California's AB 2013 and its threshold, and any further state activity through August 2026
> - China's regulatory model and its international framework proposals, in Chinese-language primary sources where available
> - the Council of Europe Framework Convention's ratification status and what entry into force would change
> - the soft-law layer: Bletchley, Seoul, Paris, the AI Safety and Security Institute network, and which states have declined which instruments
> - compute and capability thresholds: which instruments use which numeric thresholds, what the technical criticism of threshold-based regulation is, and what alternatives are proposed
> - the enforcement-capacity literature: what evidence exists on the gap between regulatory adoption and administrative capability
>
> **Part 2 — candidate constructs.** For each of the six candidate axes below, produce: a construct definition, low-pole and high-pole descriptions, the neighbouring constructs it must be distinguished from, the social-desirability risk and which pole carries it, the knowledge load required to answer honestly, and an explicit merge / split / reject test.
>
> 1. Threshold and evidence burden
> 2. Locus of authority
> 3. Harmonisation and divergence
> 4. Openness and diffusion
> 5. Enforcement realism
> 6. Whose legitimacy
>
> **Part 3 — deconfliction.** Produce an overlap matrix against: the IR Foundation's four traditions and seven dimensions, an existing Security module covering coercion, deterrence, escalation, and alliances, and an existing Technology module covering export controls, compute, semiconductors, standards, and industrial policy. For each candidate AI construct, state which module should own it and why. Explicitly resolve whether military AI integration belongs in AI or Security.
>
> **Part 4 — scenario families.** Propose eight to twelve scenario families where an informed person could reasonably choose differently, each with the real-world anchor it derives from, the decision actually at stake, and at least three distinct defensible options that differ by logic rather than intensity. For each, name what makes it hard to write without a morally obvious answer.
>
> **Part 5 — jurisdiction and actor coverage.** Produce a matrix of actors: EU institutions, US federal, US state, China, UK, India, a middle power, a developing state, a frontier developer, a downstream deployer, a standards body, civil society. Identify which are systematically under-represented in English-language AI governance debate and what sources exist to represent them fairly.
>
> **Part 6 — rejected constructs.** List what you considered and rejected, with reasons. This section is required.
>
> **Do not produce:** final axes, signals, weights, result copy, archetype names, or a question bank.

---

## R-2 — The Transfer Test item pairing

**Run this one in Claude rather than Deep Research.** It is a conceptual design task, not a literature sweep.

> **Context.** An instrument measures how a person reasons about interstate politics (the Foundation) and separately how they reason about frontier AI governance (the AI Compass). The two instruments use different scales and are deliberately never combined into a score. A new surface compares them without any arithmetic: it presents pairs of items — one about states, one about AI — that were authored as structurally analogous, and shows the respondent their own two answers side by side.
>
> The only claim being made is "we authored these two items as structurally analogous." No scores are compared, no constructs are equated, no aggregate is computed.
>
> **Task.** Design ten to fourteen candidate item pairs.
>
> For each pair, produce:
>
> - **the shared structural question** in one sentence, stated so it is recognisably the same question in both domains
> - **the interstate item:** a scenario, three or four options, and the logic each option prioritises
> - **the AI item:** the structurally analogous scenario with the same option structure
> - **the analogy rationale:** why the structure holds
> - **the analogy limit:** where the analogy breaks. This field is required and must be substantive. A pair with no stated limit is a bad pair.
> - **the failure mode:** what a sceptical reader would say is wrong with this pairing
>
> **Design constraints:**
>
> - options must differ by logic, not by intensity. Never A-extreme / B-moderate / C-opposite-extreme.
> - no option may be the obviously decent, sophisticated, moderate, patriotic, or anti-war one
> - every option names a mechanism and accepts a cost
> - the AI item must not require specialist knowledge the scenario does not supply
> - the AI item must not depend on the outcome of a pending event
> - the pair must work for a respondent who answers the two instruments months apart
>
> **Seed structures to develop, plus your own:**
>
> 1. A competitor gains capability faster than expected. Position or commitment?
> 2. Can a verification regime bind an actor that expects to lose from it?
> 3. Is dependence restraint or exposure?
> 4. Should rules constrain the strongest actor or codify what it already does?
> 5. Whose consent legitimates a decision?
> 6. Rules exist, capacity does not. What has been achieved?
> 7. Is regime fragmentation a failure or a hedge?
>
> **Then, separately:** rank the pairs by how likely they are to produce *interesting divergence* rather than trivial agreement, and say why. Identify the three you would ship if you could only ship three.
>
> **Finally, red-team your own output.** Which of these pairs is actually a bad analogy that would embarrass the instrument in front of an IR scholar or an AI policy researcher? Argue the case against your own three strongest pairs.

---

## R-3 — V24 Economic Statecraft construct pack

> [Universal research contract]
>
> **Task.** Produce the domain research pack for a scored module titled **Economic Statecraft and Interdependence**. It sits beside existing Security and Technology modules and a Foundation instrument with a critical political economy tradition. It must not become a general economics quiz.
>
> **Part 1 — domain boundary memo.** Define what this module owns and what it does not. It owns general trade and financial instruments, sanctions and secondary sanctions, currency and payment-system leverage, sovereign debt and conditionality, industrial policy and subsidy competition, distributional adjustment, and non-technology strategic dependencies. It does not own advanced technology controls, compute, semiconductors, or standards, which belong to Technology. State the boundary rules explicitly and name the hard cases.
>
> **Part 2 — deconfliction matrix.** Overlap analysis against the Foundation's critical political economy tradition and its markets/dependence dimension, the Security module, the Technology module, and a future Energy and Resource module. For each candidate construct, name the single primary owner.
>
> **Part 3 — multilingual source ledger.** Primary and authoritative sources across at least English, Chinese, and one of French, Spanish, or Portuguese. Include official instruments — sanctions designations, WTO documents, IMF programme documents, central bank communications — not only academic literature.
>
> **Part 4 — candidate construct table.** For each candidate: definition, low and high pole descriptions, neighbouring constructs, social-desirability risk and which pole carries it, knowledge load, and a merge / split / reject test. Start from these four and add or reject as the evidence supports: openness and control; interdependence as restraint versus exposure; market allocation versus developmental coordination; aggregate gains versus distributional adjustment.
>
> **Part 5 — scenario families.** Sanctions and secondary sanctions; currency or payment-system leverage; tariffs and retaliation; debt restructuring and conditionality; industrial policy and subsidy competition; critical supply dependency outside advanced technology. For each: at least two real anchors with dates, the decision at stake, and what makes a non-strawman option set hard to write.
>
> **Part 6 — actor and instrument matrix.** Major issuing power; sanctioned or exposed state; middle power; developing debtor; firm, worker, and consumer distributional perspectives; multilateral institution. Cross with instrument type. Identify systematic gaps in the English-language debate.
>
> **Part 7 — rejected constructs**, with reasons.
>
> **Do not produce:** scored axes, signals, weights, result labels, public bridges, or a question bank.

---

## R-4 — V25 Energy Transition and Resource Politics construct pack

> [Universal research contract]
>
> **Task.** Produce the domain research pack for a module titled **Energy Transition and Resource Politics**. The central risk is building one omnibus score across energy security, transition governance, climate cooperation, extraction, and development. Your first job is to determine whether those cohere.
>
> **Part 1 — the boundary question, answered explicitly.** Analyse whether energy security, transition sequencing, reliability and affordability, resource dependence, industrial policy, extraction and local consent, climate burden-sharing, and development belong in one module. **Deliver a recommendation:** which of these the module should own, which should be excluded, and whether climate cooperation warrants its own later domain. State the reasoning and the strongest counterargument.
>
> **Part 2 — deconfliction matrix** against V24 Economic Statecraft, Technology, Security, and the Foundation.
>
> **Part 3 — multilingual source ledger.** IEA, IRENA, UNFCCC instruments, national energy strategies, and regional bodies. Include at least one major producer state's own official framing in its own language.
>
> **Part 4 — candidate constructs.** From these five and any you add: transition pace versus system reliability; national delivery versus multilateral governance; technology neutrality versus directed transition; uniform incentives versus differentiated responsibility; extraction versus ecological constraint. Determine whether four or five axes are defensible.
>
> **Part 5 — the three-way separation.** For every candidate construct, separate: empirical beliefs about technology and cost, strategic preferences, and distributive or normative judgments. A single axis that mixes all three is a rejected axis. This section is the most important in the pack.
>
> **Part 6 — scenario families.** Fossil-fuel supply shock; carbon border measure; climate finance and loss and damage; nuclear energy; critical minerals and community consent; grid and transmission buildout; methane or shipping regulation; adaptation or climate migration.
>
> **Part 7 — perspective coverage.** Energy importer; exporter; low-income vulnerable state; industrial middle power; Indigenous or local community; multilateral institution; operator or firm; environmental civil society. Note where representing a perspective fairly requires sources that do not exist in English.
>
> **Part 8 — rejected constructs**, with reasons.

---

## R-5 — Cross-cultural naming provenance review

**Small, cheap, and it closes the one category of criticism that is hard to recover from.**

> [Universal research contract]
>
> **Context.** An IR worldview instrument publicly assigns respondents one of eight archetypes named from eight cultural registers:
>
> | Code | Name | Stated source |
> |---|---|---|
> | P+ | Kairos | Greek |
> | P− | Shi (勢) | Chinese |
> | R+ | Grotian | Dutch, after Grotius |
> | R− | Concert | European |
> | M+ | Satyagraha | South Asian |
> | M− | Musyawarah | Southeast Asian |
> | S+ | Dirigisme | French |
> | S− | Dependencia | Latin American |
>
> **Task.** For each name, produce:
>
> 1. **Provenance.** The term's origin, its specific meaning in its own tradition, and the primary sources that establish it. For Shi (勢), Satyagraha, and Musyawarah, cite scholarship in or on the originating tradition, not only Anglophone IR literature.
> 2. **Fit.** The archetype's actual content is a combination of an explanatory lens — power, rules, meaning, or structure — and a strategic posture of applying advantage or exercising restraint. Assess how well the borrowed term matches that content.
> 3. **Misappropriation risk, rated high, medium, or low, with reasoning.** Be direct. Satyagraha is Gandhi's specific coinage about truth-force and non-cooperation. Assess whether using it as a label for a meaning-lens advantage-posture archetype is defensible or is a borrowing that a scholar of the tradition would object to.
> 4. **A provenance note**, 60 to 90 words, publishable on the archetype page, stating what is borrowed, in what sense, and what is explicitly not claimed.
> 5. **Alternatives**, where risk is medium or high: two or three alternative names with the same memorability and less exposure.
>
> **Finally:** assess the set as a whole. Is there a coherent selection principle, or is it eight ad hoc borrowings? If there is no principle, propose one, or recommend abandoning the culturally-sourced naming in favour of a single register.
>
> **Be adversarial.** Write the criticism a scholar from each tradition would make, at its strongest.

---

## R-6 — Interactive instrument benchmarking

> **Task.** Benchmark the design and structure of high-quality public interactive instruments and explainers, for a serious editorial IR product that wants to be visually compelling without becoming a personality quiz.
>
> **Study at least:** Our World in Data; the Financial Times and Reuters graphics desks; The Pudding; NYT interactive explainers; Bloomberg Graphics; Globaïa; the Political Compass and its critics; 16Personalities and comparable typology products; academic instruments with public interfaces such as the Moral Foundations Questionnaire and the World Values Survey wave visualisations.
>
> **For each, extract:**
>
> - how the first screen establishes what the thing is and why it is worth the time
> - how a result is delivered: what is above the fold, what is behind disclosure
> - how uncertainty and methodological limits are shown without weakening the payoff
> - whether motion is used and whether it carries information
> - how the shareable artifact is designed and what it claims
> - how the product handles the reader who does not fit its categories
>
> **Then produce three things:**
>
> 1. **A pattern table**: which patterns transfer to a serious IR instrument, which are specific to newsroom one-offs, and which are personality-quiz tropes to avoid.
> 2. **A specific critique** of the typology products: what makes 16Personalities commercially successful and epistemically indefensible, and which of its techniques can be borrowed without inheriting the problem.
> 3. **A short answer to one question:** what does an interactive explainer do that a well-written article does not? Answer with examples, and be willing to conclude that in some cases the answer is "nothing."

---

## R-7 — Closed trial methods pack

> [Universal research contract]
>
> **Task.** Produce the methods foundation for a closed usability and comprehension trial of a public measurement instrument, run by an unaffiliated individual with roughly twelve participants including academic faculty, paid at roughly $20 per hour.
>
> **Deliver:**
>
> 1. **Cognitive interviewing protocol design.** Current guidance on think-aloud versus verbal probing, concurrent versus retrospective probing, and sample sizes. Cite the actual methodological guidance — US federal statistical agency standards and the survey methodology literature — rather than secondary summaries. State plainly what a twelve-person purposive sample can and cannot establish.
> 2. **Option-valence and social-desirability measurement.** How to elicit "which answer makes the respondent look best" separately from "which answer the respondent agrees with," including the specific instrument wording used in the literature.
> 3. **Comprehension probes for scenario items.** How to test whether a respondent understood a scenario's specialist terms without cueing the answer.
> 4. **Research ethics for an unaffiliated investigator.** When product usability testing requires IRB review versus a not-human-subjects determination in the US context; what a compliant consent document contains; retention, deletion, and withdrawal requirements; and what changes if findings are later published. Cite the governing regulation, not blog summaries.
> 5. **Compensation practice.** Norms for participant payment, whether compensation creates a coercion concern at this rate and duration, and disclosure obligations that may apply to salaried academics receiving outside payment.
> 6. **Analysis approach.** How to analyse twelve qualitative sessions without overclaiming: coding approach, saturation, how to distinguish a finding that appeared twice from a finding that appeared once, and how to report a purposive sample honestly.
>
> **Be explicit about the limits.** State clearly what this trial can establish and what it cannot, in language usable directly in a public methods note.

---

# PART TWO — CLAUDE DESIGN PROMPTS

Each is a canvas prompt. Reference the existing artifact so the new work inherits the established system.

## Shared context block

**Paste at the top of every design prompt below.**

> **Product.** IR Worldview Inventory — a serious editorial interactive that maps how a person reasons about international politics. The voice is closer to a policy-journal interactive than to a SaaS dashboard, AI demo, or personality test. No gradients, no neon, no glassmorphism, no oversized shadows, no dashboard tropes, no stacked identical cards.
>
> **Established system, from the prior canvas.** Ground `#0F1B2D`, panel `#14243A`, rule `#24344B`, accent `#C9A227`, text `#F4F1EA` / `#C7D2E0` / `#8B9AAE`, anchor mark `#3A4E6B` which is never used for text. Light build: ground `#F4F1EA`, accent `#7A5F26`, rule `#D8D2C4`. Type: Newsreader for names and prose, Archivo for labels, Space Mono for codes and numerals. Spacing steps 7 · 14 · 18 · 24 · 28 · 44 · 64.
>
> **The eight archetypes.** P+ Kairos, P− Shi (勢), R+ Grotian, R− Concert, M+ Satyagraha, M− Musyawarah, S+ Dirigisme, S− Dependencia. Four lenses — power, rules, meaning, structure — each with two postures, applying advantage or exercising restraint. Their marks exist as System A — Derived, one ink colour on one ground, no gradients, surviving a grayscale pass.
>
> **Binding constraints.** No percentiles and no population claims anywhere. Every animated element has a finished resting state. Nothing loops. Everything must survive reduced motion, print, a 390px viewport, and a grayscale pass.

---

## D-1 — Explore tradition page, demonstration composition

> [Shared context block]
>
> **Problem.** The tradition pages — `/explore/realism` and its three siblings — are roughly 2,200 words of prose with no images, charts, maps, or interaction. They compete with Wikipedia and lose. The essay is good. Its position on the page is wrong.
>
> **Task.** Design the tradition page as a demonstration with the essay as an appendix.
>
> **Artboards, desktop 1320px unless stated:**
>
> 1. **The claim.** Tradition name, one-sentence structural premise, two archetype marks with postures. Static, dense, one viewport. Show it for Realism and for Critical Political Economy so the composition is tested against a short name and a long one.
> 2. **The demonstration, three scroll states.** A four-column comparison of what Realism, Institutionalism, Constructivism, and Critical Political Economy each notice first, recommend, and accept as the cost, on one shared set of case facts. Show: facts established, two traditions entered, all four entered with the reader's own tradition highlighted. The four-column layout must work when one column is emphasised and when none is.
> 3. **The map register.** A schematic annotated map for a geographic case. Static SVG aesthetic, printable, with a semantic list beneath carrying the same information. No tiles, no pan affordance, no interactive chrome.
> 4. **The appendix.** How the 2,200 words look when demoted: section navigation, disclosure treatment, and reading rhythm.
> 5. **The authorial note.** A signed, dated slot that is visibly outside the instrument. This is where the product acquires a voice; the design job is making that separation unmistakable without making it look like a disclaimer.
> 6. **Mobile, 390px.** The demonstration is the hard case. Four columns do not fit. Solve it.
>
> **The question to answer with the design:** what can this page show that Wikipedia cannot? If an artboard does not answer that, it is the wrong artboard.

---

## D-2 — Result page scroll storyboard

> [Shared context block]
>
> **Context.** The hero composition is settled: Frontispiece on desktop, Plate-A on mobile, identity centred above a rule with measurement in a ruled register beneath. Below the hero, the page currently stacks eleven sections in a flat list.
>
> **Task.** Storyboard three scroll registers below the hero. The graphic is pinned; the prose advances beside it.
>
> **Artboards:**
>
> 1. **Step one, four states — why this and not its nearest neighbour.** The 2×2 position map is pinned. State A: the reader's cell resolved. State B: the neighbouring cell illuminated. State C: the separating dimensions highlighted. State D: the boundary distance resolved. Design the pinned graphic and the prose column beside it for each state.
> 2. **Step two, three states — what is doing the work.** Dimension bands pinned. Two or three dimensions rise, the rest recede.
> 3. **Step three, static — where this reading would break.** The pressure case. **No motion.** The absence of motion after two animated steps is the design decision; make it feel deliberate rather than unfinished.
> 4. **Placement firmness as geometry.** The position dot becomes a dot with a resolved region. Show three cases: firm placement, near-boundary placement where the region visibly touches the neighbouring cell, and a blend where two cells are jointly held. This replaces a footnote with a picture and it is the most important artboard in this set.
> 5. **The disclosure register.** How eleven sections of methodology look when collapsed. Solve for a reader who wants none of it and a reader who wants all of it.
> 6. **Reduced motion and print.** The same three registers with every state resolved and no pinning.
> 7. **Mobile, 390px.** Pinning a graphic on a 390px screen usually fails. Either solve it or replace it with something better, and say which.
>
> **A constraint that changes the design:** dimension positions are shown as bands within the instrument's own range — "high in this instrument's range," "upper middle," "middle" — not as percentiles. There is no respondent population. The design must make a band feel as substantial as a number looked.

---

## D-3 — The Transfer Test surface

> [Shared context block]
>
> **Context.** Two instruments: the IR Foundation, about states, and the AI Governance Compass, about frontier AI. Their scores are deliberately never combined and never compared. A new surface compares them differently: it shows pairs of items that were authored as structurally analogous, and displays the respondent's own two answers side by side. No arithmetic, no score, no aggregate.
>
> The product's whole thesis lives here: **does your reasoning about states survive contact with a domain you have thought about for less time?**
>
> **Task.** Design this surface.
>
> **Artboards:**
>
> 1. **The entry.** What a respondent sees who has completed both instruments. It must convey the question in one screen, and it must not look like a compatibility score.
> 2. **One pair, expanded.** Two columns: the state-domain item and the AI item. The respondent's answer in each. The logic each answer prioritises. The shared structural question above. The analogy limit below, in a treatment that reads as intellectual honesty rather than legal cover.
> 3. **The full set.** Six to seven pairs at a glance, showing which diverged. **Design this so divergence looks interesting rather than wrong.** This is the hardest problem in the set: every visual convention for "these two differ" carries a valence, and here divergence is the interesting outcome.
> 4. **The headline.** A count, never a rate: "same logic on four of seven pairs." Design it so it cannot be mistaken for a score.
> 5. **The degraded state.** One record archived or unresolvable. Honest, not an error.
> 6. **The shareable.** What a person posts. The most likely thing to spread from this product, and the most likely place a population claim would sneak in. Design it so no such claim is possible.
> 7. **Mobile, 390px.** Two-column comparison on a narrow screen.
>
> **The line the design must carry without making it look like fine print:**
>
> > Divergence is not inconsistency. It may mean the domains genuinely differ, or it may mean one of your two answers has not been thought through. The instrument cannot tell you which.

---

## D-4 — Worldview Map with firmness

> [Shared context block]
>
> **Context.** The Worldview Map has two projections: a primary 4×2 archetype matrix — four lenses by two postures — and a secondary continuous projection that explicitly cannot represent posture. Normative state is text annotation, never spatial position. Blends span two same-row cells with a connector. No jitter is permitted.
>
> **Task.** Three additions and one entry transition. Not a rebuild.
>
> **Artboards:**
>
> 1. **Firmness as geometry.** A resolved region instead of a point. Firm placement: small region. Near-boundary: large region visibly reaching the adjacent cell. Show four cases across different cells so the treatment is tested against the matrix's asymmetries.
> 2. **Weighted blend connectors.** The connector's weight reflects how close the two lenses actually were. Show a near-even blend and a marginal one.
> 3. **The entry transition, four frames.** Matrix rules draw, then the reader's cell resolves. 800ms, once, never on revisit. Frame one must be a complete static matrix, because that is what a reader with reduced motion or a frozen timeline sees.
> 4. **The two projections side by side.** Make the matrix visibly primary and the continuous projection visibly secondary, and make the continuous projection's inability to show posture legible rather than merely stated.
> 5. **Semantic list parity.** The list beneath the map, carrying identical information for a screen reader and for print. Usually an afterthought; design it as a real artifact.
> 6. **Mobile, 390px**, and **print.**

---

## D-5 — Social and share template system

> [Shared context block]
>
> **Context.** A weekly Current Case, an eight-mark sigil set, and a four-tradition comparison are the recurring visual assets. The primary channel is X, the secondary is LinkedIn. Instagram only if the visual system justifies it.
>
> **The binding constraint, and it is not negotiable:** there are no respondents. No percentile, no distribution, no "N% of people," no validity claim, no "most respondents." The templates must make those claims **impossible to insert**, not merely discouraged. If a slot could hold a population claim, redesign the slot.
>
> **Task.** A template system, not one-off graphics.
>
> **Artboards:**
>
> 1. **The Current Case card, three states.** The question, the options with their accepted costs, and the four-tradition reading. Same case, three cards, designed as a set that posts in sequence.
> 2. **The archetype card.** One mark, one name, one gloss, one accepted tradeoff. Eight of these are the recurring visual identity. Show three so the system is tested across a short name, a long name, and the CJK case.
> 3. **The comparison card.** Four traditions, one case, one screen. The hardest of the set, because four columns at social dimensions is close to impossible. Solve it or prove it needs two cards.
> 4. **The result share card, revised.** Derived from the hero. 1200 × 630. Every readable line at 30px or larger so nothing drops below 10px at a 400px timeline render. Tested against forced fallback stacks — Georgia, Arial, Courier New. **The rarity line is removed; design what occupies its place.**
> 5. **LinkedIn variants.** The same three templates at LinkedIn dimensions and in a register that suits a professional feed without becoming corporate.
> 6. **The quote card.** For the authorial note. Visibly a person's view rather than an instrument output. The distinction has to survive being screenshotted out of context.
> 7. **The spec sheet.** Which template for which content type, what goes in each slot, what may never go in any slot, and the safe area for each platform.
