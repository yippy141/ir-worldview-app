> **HISTORICAL, SUPERSEDED, NON-EXECUTABLE.** Preserved only for provenance. Verify every claim against the current roadmap, Git state, and runtime before reuse.

# Hostile review: V24 product evaluation & AI module rearchitecture

> **HISTORICAL AND SUPERSEDED AS EXECUTION AUTHORITY.** Preserve findings for provenance. Use the current construct audit.

Reviewed in full: `/home/claude/deliverables/V24_PRODUCT_EVALUATION_MULTI_PERSPECTIVE_20260821.md`, `/home/claude/deliverables/V24_AI_MODULE_REARCHITECTURE_20260821.md`, with `/home/claude/deliverables/STATE.md` and `/home/claude/deliverables/README_V24_REVIEW_SET.md` for context.

---

## 1. Percentiles → "instrument-relative bands" — **SERIOUS**

**The objection.** Removing the percentiles is correct and not in dispute. The replacement is a rename, not a repair, and the document contains the argument against its own fix.

§1.1 diagnoses the defect precisely: *"the visual hierarchy defeats it."* The problem was never that the word "88th" is wrong. It is that a large numeral in the hero, with a qualifying footnote, is a display where the footnote cannot win. Now render **HIGH** in the hero with a footnote reading "relative to this instrument's attainable range, not to any population." Same hierarchy. Same defeat. The document identified the mechanism and then shipped a fix that only addresses the string.

Ask what "high in this instrument's range" denotes. The attainable range is a function of how many Institutions-loaded items the author wrote, how heavily each option loads, and how the aggregation was authored. So "high" resolves to: *you picked many of the options the author tagged as institutionalist, relative to the maximum number of such options the author chose to make available.* That is a statement about item-writing, not about the respondent. The percentile was a false claim about a population. The band is a true but empty claim about the author.

Worse, banding is still a distributional claim — an unstated one. Cutting the attainable range into bands presupposes something like uniformity over that range. Response distributions on forced-choice instruments are never uniform; they are concentrated, skewed, and the endpoints are usually unreachable in practice. A respondent in the "high" band may sit at the 55th or the 99th percentile of any real population. The percentile at least announced a claim you could attack. The band hides the same uncertainty behind a word that sounds modest.

Three further defects the document does not see:

- **It promotes an unreviewed file to load-bearing.** §1.1 says `lib/results/dimension-bands.ts` "already exists; it should become the only public expression of dimension position." Nobody has said where its cuts come from or who checked them. The single most important change in the document is "use this file we have not audited."
- **The migration is a rename that will need a second migration.** Percentiles degrade gracefully: when real data arrives you recompute against a stated norming sample and the display becomes true. Bands cannot be upgraded — an instrument-relative band and a norm-referenced band are different quantities with the same word. And §1.1 explicitly keeps percentile rendering alive for frozen payloads, so the product will show two incompatible position vocabularies depending on when the reader took it, with nothing on the page explaining why. A project with byte-exact replay discipline is about to change a *display semantic* without versioning it.
- **It deletes the number and keeps the noun.** "6% of respondents share this reading" is unqualifiable — agreed. But "You are Concert" asserts membership in one of eight kinds, which is a claim about a partition of a population. If there is no population, the partition is no better licensed than the percentage. The document removes the least load-bearing distributional claim on the page and leaves the largest one in the hero, on the sigil, and on the share card.

**What the document never considers:** that *no* magnitude display is licensed. The one comparison this instrument can actually support without a reference is within-respondent — which dimensions ranked above which, for this person. That is ipsative and it has its own well-known limitation (compositional constraint), but the limitation is stateable, whereas "high for this instrument" is not.

**What would have to change.** Write down what generates the band cuts and version that definition like a bank. Put the referent inside the rendered string, not a footnote ("high for this instrument," never "HIGH"). Make the within-respondent ordinal profile the primary display and magnitude secondary. State the migration plan for archived results now. And either apply the same reasoning to the archetype label or write the paragraph explaining why the noun survives when the number does not.

---

## 2. The Transfer Test — **FATAL as specified**

**The objection.** §4.3 defines `TransferLogic` and comments: *"Deliberately NOT the Foundation lens set: reusing P/R/M/S here would smuggle in the cross-domain construct claim that schema v1 forbids."* Read the six values against the four lenses:

| `TransferLogic` | Lens |
|---|---|
| `capability-and-position` | P — power / realist |
| `binding-commitment` | R — rules / institutionalist |
| `legitimacy-and-consent` | M — meaning / constructivist |
| `structure-and-dependence` | S — structure / critical political economy |
| `delay-and-evidence` | proposed AI axis 1 (threshold & evidence burden) |
| `capacity-and-implementation` | proposed AI axis 5 (enforcement realism) |

Four of six are P/R/M/S with the serial numbers filed off, and `structure-and-dependence` does not even file them off — "structure" is the S lens's own name and "dependence" is Dependencia, the S-posture archetype. The remaining two are lifted from the proposed AI bank. `TransferLogic` is therefore the union of both instruments' construct vocabularies in a single namespace. That is a common scale. §3 Option B says the Transfer Test "needs no common scale." It defines one two sections later and does not notice.

This is the same error the companion document attacks in §1.4 of the evaluation — *"this is a bijection… two vocabularies for one layer… zero additional information."* The author diagnoses relabelling-as-fake-independence in the Foundation and then commits it in the AI module and presents it as the safeguard. §4.6 forbids "a Foundation lens label applied to an AI answer." §4.3 applies one and calls it legal because the string differs. A reviewer finds this by putting the two files side by side, in about ninety seconds.

**The fork nobody checked.** `foundation.optionLogics` gives Foundation items a second classification of their own options, parallel to their real dimension loadings. Either it agrees with the Foundation scorer — in which case it *is* the lens set, and this is Option A without the schema cost — or it disagrees, in which case the product now holds two contradictory accounts of what its own options mean, and the Transfer Test's account is unversioned against the scorer. Both branches are unacceptable and neither is addressed.

**"Juxtaposition makes no claim" is false.** To assert that item F and item A are structurally analogous is to assert some structure S instantiated by both. S is a construct. Writing it as prose in `sharedQuestion` makes it an *unoperationalised* construct, which is weaker evidentially and stronger as a claim. Schema v1 forbids relating an axis to a dimension; the Transfer Test relates an item to an item. That is a bridge at finer grain, and item-level equivalence presupposes that the underlying dimensions are commensurable enough for the same dilemma to arise in both domains.

**The count is the tell.** §4.2 permits counts and forbids rates; §4.5 ships "Same logic on four of seven pairs." Four of seven *is* 57%. You cannot count agreement across two things unless you have already asserted that "agrees" is a well-formed predicate on the pair — which is the comparability claim. Forbidding the division while rendering numerator and denominator adjacent is cosmetic; any reader, or any screenshot, performs it. And §8.4 of the evaluation forbids posting anything implying validation, while §4.5 hands the user a shareable scoreboard.

**Rule 2 is unenforceable against the surface's own design.** "Consistency is not a virtue" versus §4.5 part three: *"The pairs where your two answers diverged are the ones worth your attention… it may mean one of the two answers has not been thought through."* That is a normative claim about the respondent's reasoning offered as an alternative, and "the instrument cannot tell you which" does not retract it — the respondent has been told their own incoherence is a live hypothesis. Meanwhile a higher match count reads as a better result everywhere else on the internet. You cannot ship a scoreboard and instruct people not to read it as one.

**The confound that makes the readback uninterpretable.** §7 of the AI document concedes it in the positioning copy: AI is *"a domain most people have thought about for less time."* Divergence between the two answers is produced by at least six things: genuine domain-specific reasoning; knowledge load causing satisficing on the AI side; different distributions of socially attractive options; different option *wording* at equal option *logic*; order and fatigue effects from taking AI second; and the AI bank being v2, authored before the current landscape, i.e. a worse measurement of the same disposition. The readback hedges two of the six. Critically, **all six push toward divergence**, and divergence is the headline finding. An instrument whose measurement error runs in the direction of its own thesis is the classic disqualifier. The evaluation's §12 flags knowledge load as the systematic item-design risk to test for and never applies it here.

**Would an IRB accept the distinction?** Wrong question, and asking it is a category error worth naming: an IRB adjudicates risk to subjects, consent, and data handling — not construct validity. It would not engage the bridge question at all. Where it *would* engage: returning an individualised interpretation to a participant that their reasoning may be internally inconsistent is feedback-to-subject, and it raises the odds that a determination comes back "human subjects research" rather than "product usability testing." Separately, §9 of the evaluation says to "seek a JHU IRB determination." A JHU IRB has no jurisdiction over a non-affiliate's project; faculty participating as *subjects* does not usually make the institution engaged. The realistic paths are an independent IRB (WCG, Advarra — real money) or a documented self-determination. The document treats a hard problem as an email.

**Would a journal reviewer accept it?** No, and for a reason the document would find surprising. "We only claim an editorial analogy" is unfalsifiable, and unfalsifiable framing devices get shredded. The reviewer's dilemma: either the analogy is substantive, in which case show inter-rater agreement on the pairings — how many independent IR and AI-policy people classify these items as analogous, and at what kappa — or it is not substantive, in which case the divergence readback is uninterpretable and should not be returned to respondents. There is no third position where the pairing is meaningful enough to display and too weak to require evidence. `reviewStatus: "expert-reviewed"` is the right instinct and it is an optional schema field, not a gate; §10 ships six pairs "this month" with no reviewers named.

**What would have to change.** Either delete `TransferLogic` entirely and show the respondent nothing but their two verbatim chosen option texts, side by side, with no classifying vocabulary and no predicate over the pair — or concede that this is Option A in miniature and pay the schema v2 cost honestly. Drop the count headline. Obtain inter-rater agreement on every pairing from three independent domain readers *before* ship, and publish the disagreements on the surface itself. Add a per-pair knowledge self-report on the AI side so the confound is at least measured rather than denied. Get the IRB determination before the surface is shown to any paid participant.

---

## 3. "The four lenses are the four traditions relabelled" — **SERIOUS: right observation, wrong recommendation**

**The objection.** `LENS_BY_FAMILY` is a bijection today, at four traditions, under a lock that STATE.md says expires at V25. A bijection in the current implementation is not an identity of construct. The lens is a claim about **causal mechanism**; the tradition is a claim about **intellectual lineage**. These are logically independent, and §1.5 of the same document proves it by naming the four unmodeled traditions:

- **English School** is a rules-and-society tradition that is not institutionalism — it runs on R and M simultaneously and maps to no single lens.
- **Feminist IR** spans all four: liberal-institutional, constructivist, materialist, and work on gendered power.
- **Postcolonial/Decolonial** runs on S and M together and explicitly rejects the P/R/M/S partition as an artifact of the discipline it critiques.
- **Green IR** is arguably a fifth mechanism (ecological/material substrate) that does not reduce to S.

So the bijection breaks the moment the expansion gate fires — which §11 schedules for V25/V26. Collapsing the layers now means the first task of adding a ninth archetype is un-collapsing them. The recommendation optimises for a constraint with a known expiry date.

**The internal contradiction is worse than the modelling error.** §2.3 of the evaluation says the product's actual novel contribution is the **transfer question**. Transfer is a claim about mechanism, not lineage. Nobody's *realism* transfers to AI governance — there is no realist literature on compute thresholds. What could transfer is a disposition to reason from capability and position. That is the lens, and only the lens. The lens/tradition distinction is precisely the abstraction that makes the document's headline product idea *sayable*. §1.4 proposes deleting it; §2.3 builds on it.

The separation also carries diagnostic load the collapse destroys. When a respondent's items load on rules but their free text reads English School, you want to say "the lens fits, the lineage does not." One vocabulary cannot say that — and that is exactly the finding §1.5's coverage-gap field is meant to surface.

**What would have to change.** Keep both. Document the independence in the manifest: lens = mechanism, tradition = lineage, currently 1:1 *by construction of the four-tradition scope*, not by necessity, and expected to break on expansion. Then fix the actual complaint, which is presentational: choose one **display** vocabulary and put the other behind disclosure. Deleting a distinction because the information architecture is bad is repairing the wrong layer.

---

## 4. The six-axis AI bank — **SERIOUS, bordering fatal**

**The objection.** These are not six constructs. They are approximately two dispositions and one genuine independent.

- **Axis 1 (threshold/evidence burden) and axis 5 (enforcement realism) are the same latent variable at two ends of one pipeline.** Someone who holds that a rule without enforcement capacity is not a rule will, near-mechanically, want gates triggered on demonstrated harm — because projected-capability gates are exactly the ones that cannot be enforced against evidence. The correlation is entailed by the position, not incidental.
- **Axis 2 (locus of authority) and axis 3 (harmonisation/divergence) are one dispute with the sign flipped.** Wanting authority at the widest available level *is* wanting harmonisation; preemption is the instrument of harmonisation. The document's own anchors give it away: it files the Senate's 99–1 moratorium vote under axis 2 and Brussels/Washington/Beijing divergence under axis 3, but the moratorium fight *is* the harmonisation fight.
- **Axis 6 (whose legitimacy) is not separable from axis 2 either.** §5.1 correctly merges `oversight` and `legitimacy` because they were not separable — then does not check the merged axis against the rest of the set. Technocratic legitimacy sits at the expert/sectoral/private level; democratic legitimacy sits at the national/electoral level. That is the locus question in different words.

Plausible latent structure: a **precaution/risk-tolerance** factor (1, 5, much of 4) and an **authority-consolidation** factor (2, 3, 6). Axis 4 is the only one likely to load independently — and §5.1 says so itself, calling openness "the axis that has aged best." It aged best because it is the only one not measuring a disposition toward authority.

**The deeper error: these are fault lines, not constructs.** The axes are derived from the 2026 landscape — thresholds, preemption, fragmentation, enforcement capacity. Those are excellent *item settings*. A construct has to be a property of the respondent that is stable across settings; a fault line is a property of the world with a shelf life. §9 concedes this — "the 2026 landscape will move again" — and then leaves the axes named after 2026 disputes. When the landscape moves, the *axes* go stale, not merely the items, and v3 is not comparable to v4, and nothing ever accumulates. This is the exact trap diagnosed in §2.3 ("authored before the current fault lines existed in their present form"), about to be re-entered with fresher dates on it.

**Two smaller cracks.** The §5.3 jurisdiction cap — no jurisdiction over one third of any axis's weight — collides directly with axis 2, which is substantially a US federalism dispute (EO 14365, DOJ task force, Colorado SB 24-205 → SB 26-189, the 99–1 vote). There is no live preemption fight of equivalent character in China. Meeting the cap on axis 2 means inventing or marginalising non-US items. Nobody checked the coverage rule against the construct set. And dropping `humanFuture` for social-desirability pull treats a symptom: desirability is a property of *items*, and "should affected publics consent to deployment decisions?" (axis 6) has an obviously decent answer, so the no-obviously-decent-option rule will be hardest to satisfy on an axis that was kept.

Also note the scale being waved through: six axes × (3 Standard + 4 Advanced) = 42 items minimum, with jurisdiction caps, two case families and two card types per axis, and mechanism-plus-accepted-cost on every option. That is a large authoring programme described as the output of one Deep Research prompt.

**What would have to change.** Before any item is written, state the **discriminant hypothesis** for each suspect pair: what response pattern distinguishes 1 from 5, or 2 from 3? Author two or three deliberately adversarial items per pair whose only job is to separate them. Pre-register the collapse rule — commit now to dropping to four axes, or two plus openness, if diagnostics show collinearity — so it cannot be relitigated after the items exist. Rename the axes after dispositions and demote the 2026 fault lines to settings. Re-check the jurisdiction cap per axis before, not after, the source pack.

---

## 5. The free-text "what did this instrument miss" field — **SERIOUS**

**The objection.** §1.5 calls it "the cheapest high-value fix in this entire document" and puts it in V23.5, shipping this week, on the open web. §9 of the same document says the trial needs written consent, a retention plan, a deletion date, an IRB determination, and **"no special-category data collected or inferred."**

A free-text box asking about political worldview, on a product that sorts people by political disposition, is an open invitation for respondents to volunteer political opinions, religious framing, ethnicity and nationality — every one of which is special-category under GDPR Article 9. §1.5 and §9 of the same document directly contradict each other, and §1.5 ships first.

**It is not evidence of coverage gaps.** The V22.5 gate asks for "unmodeled-tradition feedback" and "cognitive interviews." A one-line box yields neither. It yields a non-random sample of the most opinionated fraction of a non-random sample of visitors — and §1.5 proposes admitting that into a formal expansion gate. A project this rigorous about refusing to fuse scores is about to launder an unweighted convenience sample into its governance layer. That is the real damage: it will *look* like evidence in the release decision record.

**The prompt is leading.** *"Is there a way of thinking about world politics that these questions did not give you room to express?"* presupposes something was missed and asks the respondent to supply it. Any cognitive-interview methodologist flags this on sight; the yes-rate will run far above the true rate and there is no way to correct it.

**The document confuses prediction with validation.** §1.5: *"A SAIS cohort will contain people whose actual position is postcolonial or English School… they will say so."* That is a hypothesis you already hold, and a box that confirms an announced hypothesis from a selected sample is confirmation, not evidence. If you already know the gap, the field adds nothing. If you don't, it can't find it.

**"Missed" collapses four different causes.** A genuinely unmodeled tradition; a *modeled* tradition the respondent did not recognise under an unfamiliar Greek/Sanskrit/Malay archetype name (a naming problem — §1.7 says naming is unreviewed, so this is the most probable dominant cause); an item-writing failure where the option existed but was worded badly; and plain dissatisfaction with the result. All four feed one gate as one signal. Reading a naming failure as a coverage gap produces exactly the wrong fix — adding archetypes when the problem is labels.

**"Costs almost nothing" is false.** An unmoderated free-text surface on the open web is an abuse vector, a PII and third-party-data vector, a moderation queue, and a standing obligation to actually read it — an unread feedback box that visibly does nothing is worse for trust than no box. And the mitigation eats the sample: "stored locally with explicit opt-in to send" stacks an opt-in filter on top of a self-selection filter, leaving a response set fit for quotation and nothing else.

**What would have to change.** Ship it inside the trial, behind consent, not on the open web ahead of the ethics work. Split the four causes into closed-ended items (unmodeled tradition / did not recognise the name / option wording / disagree with result) with optional free text attached. Rewrite the stem so it does not presuppose an omission. Write the retention, deletion, and moderation policy before the field exists. Put in writing that free-text volume may *raise* a question for the expansion gate but can never *close* one — cognitive interviews remain required. And reconcile with the §9 special-category commitment, which as written the field violates.

---

## 6. "Legibility release before V24" — **SERIOUS: the bundle will slip, and its own hedge already covers the risk**

**The opposite case, argued straight.**

**The release is scoped by defect list, not by hypothesis, and defect lists are unbounded.** V23.5 is nine workstreams in 4–6 weeks from a solo operator with no external forcing function and no exit test. Every item is a judgment call about polish, and polish has no terminal condition. The realistic figure is 10–14 weeks. §7 says revenue and job credibility "pull opposite ways on time" — and this spends the scarcest resource on the axis with no deadline, while the axis that *has* one (job credibility; a Codex credit expiring ~26 August per the README) waits behind it.

**Only two of nine items block anything.** Percentile removal is a two-day change already specified as Codex prompt V-2. Content extraction is real but mechanical. Sigil animation, result hero, Explore rebuild, homepage restructure, actor-lens readback, token unification, free-text field — all desirable, none blocking. Bundling two blocking fixes with seven desirable ones is how a two-week fix becomes a quarter.

**"No new scored content" is technically true and substantively false.** The largest item in the release is the Explore rebuild, whose own specification (§5.3) is to show four traditions operating on a live Current Case — side by side, same facts, with accepted costs. That is a new editorial product, not a legibility fix. V23.5 is a content release wearing a refactor's clothes, and its schedule is priced as a refactor.

**The strongest form of the objection: legibility generates no evidence.** The evaluation's central complaint, repeated four times, is no human evidence after twenty-three versions. A legibility release produces exactly zero new evidence. It is two to three months of unfalsifiable improvement, judged by the person who wrote the defect list, against no external standard. The AI rearchitecture is the one workstream with a real, already-identified external audience — §1 of the AI document: *"a hiring manager will open `/ai` before `/explore/realism`."* That audience returns fast, binary, honest signal. If the diagnosis is "we have been building without feedback for too long," the treatment is to ship the thing strangers look at, not to improve the appearance of the thing nobody looks at.

**Legibility work on a surface about to change gets done twice.** Option B adds a top-level surface, rewrites the AI landing copy, renames the module and its public claim, and under §7 may delete six archetypes. The same release restructures the homepage to a single front door and rebuilds the result page. If the AI module's positioning changes after the homepage is rebuilt, the homepage is rebuilt again. §4.1 makes precisely this argument for content-before-layout — *"moving content to `content/` first means the visual prompts touch layout only"* — and then fails to apply the identical principle to positioning-before-visual.

**The one urgent item does not require a release.** A "shipping-grade defect" that is live right now ships as a standalone hotfix this week. The argument for bundling it with eight other things is that they are already scheduled, which is a scheduling convenience presented as a risk argument.

**And the document already bought the insurance.** §12's stated justification for going slowly is that a systematic item-design defect could replicate into two more banks. Correct. Its own hedge — two questions to three testers, one text message — addresses that risk directly. It proposes the cheap hedge and the expensive release and never explains why both are needed.

**What would have to change.** Unbundle. Week 1: percentile hotfix plus the stale Current Case in the hero, standalone, live. Week 2–3: content extraction as a pure mechanical refactor with a byte-identical-render test as its gate. Then lock the AI module's *shape* (Option B, decided, not necessarily built) so the visual sprint targets a settled surface. Then the visual sprint, once. Time-box any polish work and give it a named exit test — "a stranger can say what this is in ten seconds," measured on the three informal testers — rather than an exit condition of authorial satisfaction.

---

## The single recommendation most likely to be wrong

**The Transfer Test's claim that a renamed logic vocabulary keeps it legal under schema v1** — AI document §4.2 and §4.3, and the sequencing in §10 that makes it the first thing built.

It wins on five counts:

1. **It is the recommendation the documents are most confident about.** "The best idea in this document." "The idea most worth your time." "The piece to build first." Error is most expensive exactly where confidence is highest and scrutiny lowest.
2. **It is contradicted by its own author, one document over.** §1.4 of the evaluation attacks relabelled bijections as fake independence. §4.3 of the AI document performs a relabelled bijection and presents it as the safeguard. `structure-and-dependence` does not even disguise itself: it carries the S lens's name and the S archetype's name in one string.
3. **It is the recommendation that goes public.** Percentile bands, axis collinearity, and sequencing errors are fixed by editing files. The Transfer Test is the thing that gets shipped, shared, written up as the methods note, and described in interviews. Its failure mode is a retraction in front of the exact audience the project exists to reach.
4. **The confound biases toward its own headline.** Every mechanism that produces divergence — knowledge load, option wording, order effects, a stale v2 AI bank, differential familiarity that §7 concedes in the positioning copy — pushes the same direction as the finding. A design whose measurement error runs toward its thesis is the specific structure that makes a result unpublishable, and no amount of copy hedging repairs it.
5. **The distinction it rests on cannot be defended in either direction.** Substantive enough to show a respondent means substantive enough to require inter-rater evidence on the pairings. Too weak to require evidence means too weak to return as feedback. The document occupies a position that does not exist, and it is the position the whole feature is balanced on.

The idea underneath is genuinely good and is worth keeping — the transfer question is the project's real contribution, §2.3 is right about that. What is wrong is the belief that it can be had for free. Either strip the surface to two verbatim option texts with no vocabulary, no predicate, and no count — real juxtaposition, which is duller and defensible — or accept that pairing items is a construct claim, pay for schema v2 and inter-rater review, and get something publishable. The current design takes the cost structure of the cheap option and the claim structure of the expensive one, and it will be caught by the first reviewer who reads both documents in the same sitting.
