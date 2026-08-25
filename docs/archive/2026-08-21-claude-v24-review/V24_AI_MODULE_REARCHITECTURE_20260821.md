> **HISTORICAL, SUPERSEDED, NON-EXECUTABLE.** Preserved only for provenance. Verify every claim against the current roadmap, Git state, and runtime before reuse.

# AI Governance Module — Rearchitecture Proposal

> **HISTORICAL, SUPERSEDED, NON-EXECUTABLE.** Preserve for provenance. Use `docs/research/AI_V4_CONSTRUCT_AND_OWNERSHIP_AUDIT.md` for current research authority.

**Date:** 21 August 2026
**Status:** design proposal for V24. Not an implementation authorisation.
**Scope:** the relation between the AI Governance instrument and the IR Foundation, the AI bank's construct set, and the module's place in the V23.4 authoring framework.
**Non-goals:** no Foundation scoring change, no archetype change, no public bridge under schema v1, no validity claim.

---

## 1. Why this is the highest-value module work

Three reasons, in order.

**It is broken in a visible way.** The landing page invites the reader to "compare this result with your wider foreign-policy judgments." The result page then says there is no reviewed bridge. `getCrossModuleSynthesis` is `@deprecated`. The product asks a question and refuses to answer it, which is worse than either asking or not asking.

**It is outside the framework.** Security and Technology have manifests, `manifestOrigin`, release decisions, calibration records, fingerprints, evidence hooks, and locale status. AI Governance has none of these. It is the only public scored instrument in the product with no release-decision record, and it was explicitly excluded from the Prompt I migration with a stated rationale that has since expired.

**It is the surface that matters most for what you are trying to become.** An AI safety or governance hiring manager will open `/ai` before `/explore/realism`. Right now they find a six-archetype personality test on eight axes that predate the current policy landscape. That is a worse impression than having no AI module at all.

---

## 2. Diagnosis

### 2.1 A second identity system

```ts
type AiArchetypeKey =
  | "precautionarySteward" | "strategicCompetitor" | "coordinationArchitect"
  | "democraticGuardrailist" | "stateCapacityBuilder" | "openEcosystemBuilder"
```

Six AI archetypes. Eight Foundation archetypes. Neither derives from the other. A user who completes both receives two names for one person and no defensible account of how they relate.

Read the six names closely and the problem sharpens: `strategicCompetitor` is a realist, `coordinationArchitect` is an institutionalist, `democraticGuardrailist` is a legitimacy-first constructivist, `openEcosystemBuilder` is an anti-concentration critical political economist. Four of the six are the Foundation's four lenses wearing AI-domain clothing, arrived at independently. `precautionarySteward` and `stateCapacityBuilder` are the two that are genuinely domain-specific.

So the module reinvented most of the Foundation's taxonomy without inheriting any of its structure, and then could not connect the two because the derivation was never made explicit.

### 2.2 The deprecated synthesis was right to be deprecated

`CURATED_MAP` pairs seven `familyKey:aiArchetypeKey` combinations with authored prose. `buildGenericSynthesis` interpolates the rest from lookup tables. It is a 6×4 = 24-cell matrix of authored claims about how two independently-scored instruments relate, with no evidence for any cell.

It is also stylistically the worst copy in the product: "keeps returning to," "adds a pull toward," "the hard part is saying which one should win when those priorities point in different directions." Those are on the copy audit's own banned list.

Delete the file. Do not migrate it.

### 2.3 The axes cannot express the 2026 landscape

Current: `riskHorizon`, `deploymentPace`, `oversight`, `geopolitics`, `openness`, `militaryRole`, `legitimacy`, `humanFuture`.

Problems:

- **`geopolitics` and `militaryRole` duplicate the Security module.** Security owns coercion, deterrence, escalation, and alliances. An AI item about military integration is a Security item with a different noun. This is exactly the ownership-rule violation the V23.4 authoring guide was written to prevent.
- **`oversight` and `legitimacy` are not separable as written.** Both resolve to "who gets to check this and on what authority."
- **`humanFuture` is a values-expression axis with no policy decision attached.** It measures how a respondent feels about the long run. It will attract socially desirable answers, it cannot be tested against a case, and it does not correspond to any live dispute.
- **Nothing captures the actual fault lines.** The disputes that define AI governance in 2026 are about thresholds, jurisdiction, and enforcement capacity, and the current axis set cannot represent any of them.

### 2.4 The landscape the bank should be measuring

As of August 2026:

- **Threshold divergence.** EU systemic-risk designation at 10^25 FLOP; California at 10^26. The same model is regulated differently in two markets, which turns "where is the line" from a technical question into a jurisdictional one.
- **Locus of authority is under active litigation.** The Senate rejected a ten-year state-law moratorium 99–1 (1 July 2025). EO 14365 (11 December 2025) created a DOJ AI Litigation Task Force to challenge state statutes and conditioned federal broadband funds on states abandoning AI laws. Colorado's SB 24-205 was blocked after xAI sued (April 2026); the legislature replaced it with SB 26-189, effective January 2027.
- **Timeline slippage is itself a governance fact.** The Digital Omnibus (Reg. EU 2026/1744, in force 27 July 2026) moved Annex III high-risk obligations to 2 December 2027 and Annex I to 2 August 2028, replacing the standards-conditional mechanism with fixed dates. Article 50 transparency obligations took effect 2 August 2026 as scheduled. Fining power began 2 August 2026 with no AI Act fines issued to date. Italy's EUR 15m OpenAI penalty was annulled by a Roman court in March 2026 on jurisdictional grounds.
- **Soft law is fragmenting.** Bletchley (Nov 2023) had 28 signatories. The US and UK declined the Paris statement (Feb 2025). The Council of Europe Framework Convention still lacks the five ratifications needed to enter force; the EU ratified 15 May 2026. Beijing released a Global AI Governance Action Plan (July 2025) as an explicit alternative.
- **The implementation gap is measurable.** Roughly 77% of organisations report governance work underway; roughly 69% say full implementation takes more than a year.

Every one of these is a live disagreement with real stakes, identifiable positions, and no morally obvious answer. That is precisely what a good scenario bank is made of, and none of it is in the current bank.

---

## 3. Three options for the relation

### Option A — Domain expression (correct, expensive, V25)

Stop giving AI its own archetype taxonomy. Treat the four Foundation lenses as questions and let the AI module answer them within the AI domain.

The AI result becomes: *"In AI governance your reasoning ran mostly on rules. Your Foundation runs mostly on structure. That is a divergence worth examining."*

**In favour:** it is the intellectually right answer. One identity, one vocabulary, and the divergence becomes the finding rather than an embarrassment.

**Against:** it is a cross-instrument inference about construct membership, which is exactly what schema v1 forbids. It requires authoring schema v2 with a reviewed bridge bound to Foundation scorer version, AI bank version, AI scoring version, result-copy version, and a review-due date. It also requires evidence that a respondent's lens attribution in one domain has any relationship to their lens attribution in another, which is a hypothesis, not a finding.

**Verdict:** the right V25 destination. Not a V24 move.

### Option B — The Transfer Test (recommended, cheap, schema-v1-legal)

Do not compare scores. Compare **answers to structurally paired items**.

Author a set of item pairs where a Foundation item poses a dilemma about states and its partner poses the structurally analogous dilemma about frontier AI. Show the respondent both of their own answers, side by side, with no arithmetic and no aggregation.

The only claim being made is: *we authored these two items as structurally analogous.* That is an editorial claim. It is documentable, reviewable, versionable, and it needs no bridge, no common scale, no calibration, and no schema change.

**This is the recommended V24 move.** Section 4 specifies it in full.

### Option C — Rebuild the bank against live fault lines (V24 research, V25 implementation)

Replace the eight axes with six that track actual disputes. Section 5 specifies them.

**Sequencing:** B now. C's research pack runs in parallel and its bank lands in V25. A becomes the schema v2 decision after the closed trial produces evidence about whether transfer is even stable.

---

## 4. The Transfer Test — full specification

### 4.1 What it is

A non-scored, post-completion comparison surface available to a respondent who has completed both the Foundation and the AI Compass. It presents six to eight authored item pairs. For each pair it shows the respondent's own two answers, the logic each answer prioritises, and whether the two answers ran on the same logic.

It produces one descriptive readback and no score.

### 4.2 Why it does not violate schema v1

`DEFAULT_DOMAIN_RELATION_POLICY` sets `publicRelations: forbidden-in-schema-v1`, which prohibits a **bridge**: a claim that a module axis and a Foundation dimension are comparable, with a relation and a direction.

The Transfer Test asserts none of that. It does not map an axis to a dimension. It does not compare magnitudes. It does not average, standardise, or infer. It places two of the respondent's own recorded choices next to each other and describes them.

To keep this defensible, three rules are binding:

1. **No numeric comparison anywhere on the surface.** No score, no percentage, no "you were 70% consistent." A count of pairs is permitted and should be phrased as a count ("same logic on four of six pairs"), never as a rate.
2. **Consistency is not a virtue.** The copy must never imply that matching answers are better reasoning. The whole point is that different domains may warrant different logics. A respondent who diverges on five of six has learned something more interesting than one who matched.
3. **The analogy claim is labelled.** Each pair carries a visible line: "These two items were authored as structurally analogous. The analogy is an editorial judgment, not a measured equivalence."

### 4.3 The pair schema

```ts
type TransferPairStatus = "draft" | "authored" | "expert-reviewed"

type TransferPair = {
  pairId: string
  pairVersion: number

  foundation: {
    bankVersion: number
    itemId: string
    optionLogics: Record<string, TransferLogic>   // optionId -> the logic it prioritises
  }

  ai: {
    bankVersion: number
    itemId: string
    optionLogics: Record<string, TransferLogic>
  }

  /** The shared structural question both items pose. Owner-authored, public. */
  sharedQuestion: string

  /** Why the analogy holds, and where it does not. Public. */
  analogyRationale: string
  analogyLimit: string

  authoringStatus: "draft" | "authored"
  reviewStatus: "unreviewed" | "expert-reviewed"
  reviewIds: string[]
  reviewDueAt: string
}

/**
 * The logic an option prioritises. Deliberately NOT the Foundation lens set:
 * reusing P/R/M/S here would smuggle in the cross-domain construct claim that
 * schema v1 forbids. These are local descriptors of the choice, nothing more.
 */
type TransferLogic =
  | "capability-and-position"
  | "binding-commitment"
  | "legitimacy-and-consent"
  | "structure-and-dependence"
  | "delay-and-evidence"
  | "capacity-and-implementation"
```

The comment on `TransferLogic` matters. If the logic vocabulary were `P | R | M | S`, the surface would be making a lens-attribution claim in the AI domain, which is Option A. Keeping a separate, deliberately flatter vocabulary is what keeps this legal and honest.

### 4.4 Candidate pairs

These are drafts to be replaced by properly authored items against real Foundation and AI bank IDs. They show the shape.

| # | Shared question | Foundation side | AI side |
|---|---|---|---|
| 1 | When a competitor gains capability faster than expected, does the right response run through position or through commitment? | A rising power's military modernisation outpaces intelligence estimates | A rival lab crosses a capability threshold ahead of published forecasts |
| 2 | Can a verification regime bind an actor that expects to lose from it? | Arms-control verification with an actor gaining relative advantage | Compute-accounting or evaluation regimes applied to a leading developer |
| 3 | Is dependence restraint or exposure? | Economic interdependence with a strategic rival | Open weights and capability diffusion |
| 4 | Should rules constrain the strongest actor, or codify what it already does? | Institutional design when one state has disproportionate capability | Governance built from frontier-lab practice versus imposed on it |
| 5 | Whose consent makes a decision legitimate? | Legitimacy of a security order among unequal states | Legitimacy of a deployment decision among publics, experts, and firms |
| 6 | When rules exist but capacity does not, what has actually been achieved? | A treaty with no enforcement machinery | The EU AI Act with fining power and no fines issued |
| 7 | Is fragmentation a failure or a hedge? | Overlapping and inconsistent regional security arrangements | Divergent thresholds across the EU, US states, and China |

Pair 6 is the strongest, because it is the same structural question in both domains, it has an unambiguous factual anchor on the AI side, and there is no obviously decent answer.

### 4.5 The readback

The surface has three parts.

**Part one — the headline.** A count, never a rate.

> Same logic on four of seven pairs.

**Part two — the pairs.** For each pair, in a two-column layout:

> **When a verification regime binds an actor that expects to lose from it**
>
> *On states:* you chose the option that prioritises **binding commitment**.
> *On frontier AI:* you chose the option that prioritises **capability and position**.
>
> These two items were authored as structurally analogous. The analogy is an editorial judgment, not a measured equivalence. It holds on the incentive structure and does not hold on enforcement: states can be sanctioned by other states, and a private developer sits inside a domestic legal order that has no equivalent in the interstate case.

**Part three — the one line that makes it a product.**

> The pairs where your two answers diverged are the ones worth your attention. Divergence is not inconsistency. It may mean the domains genuinely differ, or it may mean one of the two answers has not been thought through. The instrument cannot tell you which.

That last paragraph is the whole thesis of the product in three sentences, and it is currently nowhere on the site.

### 4.6 What must never appear on this surface

- any percentage or score
- the word "consistency" used as praise
- an inference about the respondent's worldview from the pattern
- an aggregate across respondents
- a claim that the pairs measure the same construct
- a Foundation lens label applied to an AI answer

### 4.7 Storage and compatibility

The Transfer Test reads two existing saved records through their exact payload contracts. It writes nothing new to scoring. It stores only its own view state.

If either record is archived or unresolvable, the surface degrades honestly using the pattern already established in `buildAiFoundationBaseline`:

> This saved record cannot be resolved through its original payload contract, so the pairs cannot be shown.

If bank versions have moved past the versions a pair was authored against, the pair is withheld rather than approximated. `pairVersion` binds to `foundation.bankVersion` and `ai.bankVersion` explicitly for this reason.

---

## 5. AI bank v3 — proposed construct set

Not to be implemented before a source pack and construct review. This is the input to the Deep Research prompt, not the output.

### 5.1 Six candidate axes

**1. Threshold and evidence burden**
*Low:* gates trigger on demonstrated harm and observed capability. *High:* gates trigger on projected capability and precautionary proxies.
Anchored in: 10^25 versus 10^26 FLOP, compute proxies versus evaluation results, the burden-of-proof question.

**2. Locus of authority**
*Low:* authority sits closest to the deployment context — subnational, sectoral, or private. *High:* authority sits at the widest available level — national preemption or supranational instruments.
Anchored in: EO 14365 and the DOJ litigation task force, Colorado SB 24-205 to SB 26-189, the Senate's 99–1 moratorium vote, the Council of Europe Convention's ratification gap.

**3. Harmonisation and divergence**
*Low:* regime divergence is a hedge that preserves policy experimentation and bargaining leverage. *High:* divergence is a failure that produces arbitrage and compliance theatre.
Anchored in: Brussels/Washington/Beijing asking three different regulatory questions; the Paris statement non-signatures; the Global AI Governance Action Plan.

**4. Openness and diffusion**
*Low:* diffusion checks concentration and is worth its misuse cost. *High:* diffusion transfers capability faster than it transfers responsibility.
Retained from the current bank. It is the axis that has aged best.

**5. Enforcement realism**
*Low:* a rule without capacity to enforce it still shapes behaviour through expectation and reputation. *High:* a rule without enforcement capacity is a rule that does not exist.
Anchored in: fining power live since 2 August 2026 with no fines issued; the annulled Italian penalty; the 77/69 implementation gap.

**6. Whose legitimacy**
*Low:* technical competence and demonstrated capability legitimate a decision. *High:* affected-public consent legitimates a decision.
Consolidates the current `oversight` and `legitimacy`, which are not separable as written.

### 5.2 What is removed and why

- **`geopolitics`** — Security owns strategic competition. Cross-domain cases link rather than duplicate.
- **`militaryRole`** — Security owns coercion and force. An AI-military-integration item belongs in the Security bank with an AI setting, not in the AI bank.
- **`humanFuture`** — no policy decision, high social-desirability pull, untestable against a case. If it survives review at all, it survives as a single explicitly non-scored reflective card at the end, and it is not an axis.

### 5.3 Coverage rules the bank must satisfy

Carried over from the V23.4 authoring guide, since AI Governance should now be held to the same standard as Security and Technology:

- at least three independent Standard items per axis
- at least four Advanced items per axis
- at least two case families per axis
- at least two card types per axis
- no single jurisdiction contributing more than one third of any axis's weight — with EU, US federal, US state, China, and multilateral treated as distinct jurisdictions
- every option names a mechanism and an accepted cost
- no option set where one choice is the moderate, decent, or expert-sounding one
- actor-lens cards excluded from the main score, with per-card readback per the actor-lens fix

The jurisdiction cap matters here more than the theatre cap does in Security, because the current bank is implicitly US-centric and a SAIS or international audience will notice immediately.

---

## 6. Bringing the module into the framework

The AI module should get the same treatment Security and Technology received in V23.4, with one difference: it should be an **`authored-manifest`**, not a `derived-legacy-adapter`. It is the natural first test of whether the authoring contract reduces implementation risk, and it is a smaller and safer test than Economic Statecraft because the domain, routes, and result surfaces already exist.

Required:

- `content/instrument/modules/ai-governance.manifest.json` with `manifestOrigin: "authored-manifest"`
- `releaseState: "public-beta"` with a real `releaseDecision` record and a `reviewDueAt`
- `docs/v24/ai/V24_AI_GOVERNANCE_V3_BETA_RELEASE_DECISION.md` stating which gates are closed, which human and SME gates remain deferred, and the owner's explicit acceptance
- a calibration record with `status: "synthetic-diagnostic"` stated plainly, matching Security and Technology
- `bridges: []` and `publicRelations: forbidden-in-schema-v1`, same as every other module
- locale status declaring `zh-Hans: not-authored` rather than falling back
- evidence and review hooks pointing at the v3 source pack and item review
- a manifest fingerprint under the same drift test

Bank v2 and its payloads stay frozen and replayable. Bank v3 becomes current only after diagnostics pass.

---

## 7. Naming and positioning

"AI Governance Compass" with six archetypes reads as a personality test for AI policy. Under Option B the module is doing something else, and the name should say so.

The instrument's public claim becomes:

> **Where your foreign-policy reasoning holds, and where it breaks.**
> The AI Compass asks the same structural questions as the Foundation, in a domain most people have thought about for less time. It does not combine the two results. It shows you both of your own answers and lets you decide which one you meant.

That is a sentence worth sharing, it makes no validity claim, and it is a more interesting product than "find your AI governance archetype."

**On the six AI archetypes:** keep them for now as *result summaries within the AI domain*, clearly labelled as such, and drop them entirely if bank v3's construct review does not support six distinct positions. Do not invest further in them. Under Option A in V25 they disappear.

---

## 8. What to delete

- `lib/ai-governance-cross-module-synthesis.ts` — delete, do not migrate. Nothing should import it once the result page is rebuilt.
- The landing-page line "To compare this result with your wider foreign-policy judgments, take the IR Foundation" — replace with the Transfer Test framing, which is a real offer rather than an implied one.
- Any remaining copy implying that the AI result travels from, extends, or reflects the Foundation result.

Keep the existing `buildAiFoundationBaseline` hydration path. It is correct: it resolves the archetype through the exact payload contract rather than reading a cached family label, and it degrades honestly. It is the model for how every cross-record read in the product should work.

---

## 9. Risks

**The Transfer Test could be read as a bridge anyway.** Mitigation: the three binding rules in 4.2, the visible analogy-limit line on every pair, and a red-team test asserting that no numeric comparison appears in the rendered output.

**Item pairing is hard to do well.** A weak analogy is worse than no analogy, because the respondent will notice and it undermines everything around it. Mitigation: fewer, better pairs. Six well-authored pairs beat twelve mediocre ones, and the surface should be willing to ship with four.

**The AI bank v3 rewrite invalidates v2 comparisons.** Mitigation: standard versioning discipline. v2 stays frozen and replayable, v3 becomes current, no payload is reinterpreted. This is a solved problem in this codebase.

**The 2026 landscape will move again.** The Digital Omnibus dates, the DOJ litigation, and the Council of Europe ratification count will all change. Mitigation: scenario items should be authored as structural dilemmas with dated factual anchors and an explicit review-due date, the way Current Cases already are. Do not write items whose validity depends on a specific pending outcome.

---

## 10. What I would do in what order

1. **This month, alongside the visual sprint:** delete the deprecated synthesis, fix the landing-page copy, and author six Transfer Test pairs against the current Foundation and AI v2 banks. The Transfer Test can ship against bank v2. It does not need to wait for v3.
2. **In parallel:** run the AI bank v3 Deep Research source pack. It is the single most useful research artifact for the career goal, independent of whether the bank ships.
3. **V24:** AI onto the authoring framework with an authored manifest and a real release decision. Transfer Test public.
4. **V25:** bank v3 implemented and calibrated. Schema v2 bridge decision informed by trial evidence.

The Transfer Test is the piece to build first. It is small, it is legal under every current constraint, it converts the product's most awkward disclaimer into its most interesting claim, and it is the thing you would actually want to describe in an interview.
