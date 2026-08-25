> **HISTORICAL, SUPERSEDED, NON-EXECUTABLE.** Preserved only for provenance. Verify every claim against the current roadmap, Git state, and runtime before reuse.

# IR Worldview Inventory — Multi-Perspective Product Evaluation

> **HISTORICAL AND SUPERSEDED AS EXECUTION AUTHORITY.** Preserve findings for provenance. Use the current master roadmap for decisions and gates.

**Date:** 21 August 2026
**Baseline reviewed:** V23.4 as merged (Security bank v5, Technology v3, both `public-beta`, `derived-legacy-adapter` manifests, `bridges: []`, `publicRelations: forbidden-in-schema-v1`)
**Live surface reviewed:** irworldview.jhyip.com — home, /explore, /explore/realism, /ai
**Code reviewed:** app routes, `lib/archetypes.ts`, `lib/archetype-marks.ts`, `lib/modules/manifests.ts`, `lib/ai-*`, `lib/worldview-config.ts`, `package.json`
**Design artifact reviewed:** `Sigils and Result Hero.dc.html` (Claude Design, turns 1–4)

This evaluation does not reopen V23. It assumes the V23.4 corrective work landed as specified and asks a different question: what should V24 and beyond actually be.

---

## 0. The one-paragraph verdict

The project has built an unusually disciplined measurement instrument and an unusually undisciplined product around it. The governance layer — release decisions, manifest fingerprints, evidence hooks, frozen replay, the refusal to fuse scores — is the strongest thing here and is genuinely rare. It is also currently protecting content that almost nobody has read. The failure mode from here is not overclaiming, which V22.5 through V23.4 largely fixed. The failure mode from here is **building a fifth and sixth instrument for a product that has never successfully delivered the first one to a stranger.** V24 and V25 as currently scoped add two more scored banks to a surface that already asks a first-time reader to learn roughly fifty named entities across fifteen concept types before anything means anything. The highest-value work in the next quarter is not another module. It is making the existing four legible, making the AI module actually connected, and getting the first real human evidence into the loop.

---

## 1. Perspective: methodologist / psychometrician

### 1.1 The percentile display is a shipping-grade defect

Both module manifests carry `calibration.status: "synthetic-diagnostic"`. The Foundation result page renders `buildDimensionPercentiles`, `formatOrdinal`, and `DimensionScoreValue`. The Claude Design share card renders `88th Institutions · 61st Rivalry · 44th Markets` and the line `6% of respondents share this reading`.

There are no respondents. There is no reference sample. An ordinal percentile is a statement about a population, and rendering it in the largest numerals on the page while qualifying it in a footnote is a display that the footnote cannot win. `PercentileFootnote` exists in the code, which shows the risk was recognised, but the visual hierarchy defeats it.

The rarity line is worse than the percentiles, because "6% of respondents share this reading" is unqualifiable. It is either true of a respondent pool or it is not a sentence.

**Fix, before any visual work ships:** replace ordinal percentiles with instrument-relative bands drawn from the instrument's own attainable range, and delete the rarity line from every surface including the share card design. `lib/results/dimension-bands.ts` already exists; it should become the only public expression of dimension position. Keep the percentile machinery frozen for old payload rendering, but do not generate new percentile displays. This is the single most important change in this document and it needs to be enforced in the Codex prompt, because the design artifact currently propagates the defect.

### 1.2 The archetype label is a threshold crossing presented as a category

`resolveArchetype` returns a pure archetype when `nearestFitGap >= LOW_DIFFERENTIATION_THRESHOLD` and a blend otherwise. So the difference between "you are Concert" and "you are Concert–Kairos" is one continuous quantity crossing one authored cut. Users will read the output as a kind. Near the cut, small answer changes flip the name, the sigil, the page, and the share card.

Test-retest instability at that boundary is guaranteed and currently unmeasured. `lib/results/placement-firmness.ts` exists and is the right idea, but firmness is presented as supporting detail rather than as part of the result.

**Recommendation:** make firmness a first-class element of the hero, not a footnote. "Concert, clearly separated from its neighbours" and "Concert, close to the Kairos boundary" are different results and should look different. This is also the better graphic: a dot with a resolved region is more honest and more interesting than a dot.

### 1.3 Posture hangs on one dimension against a hardcoded midpoint

```ts
export const HEDGER_POSTURE_MIDPOINT = 4
return restraint <= HEDGER_POSTURE_MIDPOINT ? "+" : "-"
```

For every Hedger, half the archetype identity — the `+`/`−` that separates Kairos from Shi, Grotian from Concert — is decided by whether one dimension sits above or below 4 on a 1–7 scale whose empirical centre is unknown. A respondent at restraint 3.9 and one at 4.1 receive different names, different marks, and different pages.

The code comment is candid that 4 is the scale's neutral midpoint rather than an observed centre. That is the right note and the wrong basis for a categorical assignment. Until there is a distribution, Hedger posture should either be reported as unresolved, or the Hedger case should be routed to a blend-style presentation showing both postures. Assigning it silently is the weakest inference in the Foundation.

### 1.4 The four lenses are the four families relabelled

```ts
const LENS_BY_FAMILY = { realist: "P", institutionalist: "R", constructivist: "M", criticalPoliticalEconomy: "S" }
```

This is a bijection. /explore presents "four explanatory lenses" and "four modeled traditions" as two layers of the ontology. They are one layer with two vocabularies. This inflates the apparent concept count by four for zero additional information, and it is one of the reasons the /explore page needs a section called "How the labels fit together."

Either collapse them publicly — one name per construct — or state plainly that the lens is the tradition's causal core and the tradition is its intellectual lineage, and stop presenting them as separate tiers.

### 1.5 The expansion gates have no data pipeline feeding them

The V22.5 pack defines an Archetype Expansion Gate requiring, among other things, "unmodeled-tradition feedback," "cognitive interviews," and "Current Case explanatory gaps." /explore already names four coverage gaps: Feminist IR, Postcolonial/Decolonial IR, Green IR, English School.

Nothing in the product collects any of it. `/feedback` explicitly refuses general product submissions and research responses. So the gate is a decision procedure with no inputs, and it will still have no inputs in V25 when it is supposed to fire.

**Cheapest high-value fix in this entire document:** add one non-scored free-text prompt at the end of the Foundation — "Is there a way of thinking about world politics that these questions did not give you room to express?" — stored locally, with an explicit opt-in to send. That single field generates the exact evidence the V25 gate requires, costs almost nothing, and doubles as the most interesting qualitative dataset the project could own.

It also pre-empts what I expect to be the loudest finding in the closed trial. A SAIS cohort will contain people whose actual position is postcolonial or English School. The instrument will sort them into Dependencia or Concert, which is close and wrong, and they will say so.

### 1.6 Actor-lens cards currently give the respondent nothing

Excluding actor-lens cards from the main and lane scores is correct. Removing the pooled cross-actor inference is correct. But the result is that a respondent answers up to ten demanding perspective cards and receives no interpretable readback at all. That is a bad bargain and it will read as a bug.

**Fix that breaks no rule:** per-card, non-aggregated mirroring. For each lens card, show the respondent's choice, name the mechanism it prioritises, and show what a respondent reasoning from the opposing premise would most likely have chosen and why. No vector, no average, no cross-actor claim. Purely local, purely descriptive, and far more satisfying than the current silence.

### 1.7 Cross-cultural naming is asserted, not reviewed

Eight archetypes named from Greek, Chinese, Dutch, European, South Asian, Southeast Asian, French, and Latin American sources, assigned to respondents, published in two languages. The V23 roadmap is honest that the collision review is "automated/owner visual reviews, not universal cultural clearance." That honesty is correct and insufficient for a public product being shown to faculty.

Satyagraha carries the most exposure. It is Gandhi's specific coinage with a specific meaning about truth-force and non-cooperation, and it is being used as the label for M+ (meaning lens, advantage posture). If the archetype's content does not match the term's meaning, that is a misappropriation problem, not a taste problem.

**Recommendation:** a per-archetype naming provenance note that states the source, the specific sense borrowed, and what is deliberately not being claimed. Plus at least one reviewer per naming tradition in the closed trial. This is cheap insurance against the one category of criticism that is genuinely hard to recover from.

---

## 2. Perspective: IR academic / SAIS faculty reader

### 2.1 What holds up

The four-tradition backbone is defensible. Power, rules, meaning, and structure is a reasonable partition of the explanatory field and maps onto how the discipline actually teaches itself. The seven-dimension layer beneath it is more honest than a 2×2. The insistence that a Security 5.2 and a Foundation 5.2 are not the same quantity is the kind of thing most instruments get wrong.

The coverage-gaps section on /explore is the single most credible thing on the site. Naming Feminist IR, Postcolonial, Green IR, and English School as under-modeled, in public, is what separates this from a personality quiz.

### 2.2 What a faculty reviewer will attack first

**The named archetypes.** A political scientist will ask why "Concert" is a worldview rather than a nineteenth-century European security arrangement, and why the eight names come from eight different cultural registers with no stated selection principle. The current answer — that they are memorable public shorthands for lens-by-posture cells — is defensible but is not stated anywhere prominently.

**The posture axis.** "Applying advantage" versus "exercising restraint" is not a standard IR construct. It reads as a strategic-style variable smuggled into a theoretical-commitment taxonomy. A reviewer will ask whether a realist who advocates restraint is a different *worldview* from a realist who advocates assertion, or the same worldview with a different policy preference. That is a real and unresolved question, and the instrument currently answers it by fiat.

**The absence of any respondent data after twenty-three versions.** This will be the first question. The answer needs to be a plan, not a defence.

### 2.3 The strongest available academic framing

The product's actual novel contribution is not the taxonomy. It is the **transfer question**: does a person's foreign-policy reasoning survive contact with a domain they have not thought about? That is a live, interesting, under-studied question, and the architecture — separate instruments, no score fusion, explicit refusal to bridge — is exactly the right design for asking it.

Lead with that. It reframes the "no bridge" constraint from an apology into the research design.

---

## 3. Perspective: AI-governance domain expert

This is the section that matters most for the career goal, and it is the weakest surface in the product.

### 3.1 The AI module is an orphan

`lib/ai-governance-*` is a parallel universe. Eight axes (`riskHorizon`, `deploymentPace`, `oversight`, `geopolitics`, `openness`, `militaryRole`, `legitimacy`, `humanFuture`) and six archetypes (`precautionarySteward`, `strategicCompetitor`, `coordinationArchitect`, `democraticGuardrailist`, `stateCapacityBuilder`, `openEcosystemBuilder`), none of which derive from the Foundation's four lenses. `getCrossModuleSynthesis` is now marked `@deprecated`. The landing page says "compare this result with your wider foreign-policy judgments," and the result page correctly says there is no reviewed bridge.

So the product invites a comparison and then declines to make it. That is the worst of both.

It is also not on the module framework. Security and Technology have manifests, release decisions, calibration records, and fingerprints. AI Governance has none of these — it predates all of it and was explicitly excluded from the Prompt I migration. It is the only public scored instrument with no release decision record.

### 3.2 The axes are stale against the 2026 landscape

The bank was authored before the current fault lines existed in their present form. As of August 2026 the live disputes are:

- **Threshold divergence.** The EU flags systemic risk at 10^25 FLOP; California at 10^26. Same model, different regulatory status.
- **Locus of authority.** EO 14365 (11 Dec 2025) created a DOJ AI Litigation Task Force to challenge state statutes, after the Senate rejected a ten-year state-law moratorium 99–1. Colorado's SB 24-205 was blocked after xAI sued in April 2026; the legislature rewrote it as SB 26-189 with a January 2027 deadline.
- **Timeline slippage as a governance fact.** The Digital Omnibus (Reg. EU 2026/1744, in force 27 July 2026) pushed Annex III high-risk obligations to 2 Dec 2027 and Annex I to 2 Aug 2028. Fining power began 2 Aug 2026 with no AI Act fines issued. Italy's EUR 15m OpenAI penalty was annulled in March 2026.
- **Soft-law fragmentation.** The Council of Europe Framework Convention still lacks the five ratifications needed to enter force (the EU ratified 15 May 2026). The US and UK declined the Paris statement in Feb 2025. Beijing's Global AI Governance Action Plan (July 2025) is an explicit alternative framework.
- **The implementation gap.** Roughly 77% of organisations report working on governance; roughly 69% say full implementation takes over a year.

The current axes cannot express most of this. `geopolitics` and `militaryRole` duplicate the Security module. `oversight` and `legitimacy` overlap each other. `humanFuture` is a values-expression item with high social-desirability pull and no corresponding policy decision — it is the axis most likely to be answered aspirationally.

### 3.3 The three options for fixing the relation, and which to take

**Option A — Domain expression (correct, expensive, V25).**
Stop giving AI its own archetype taxonomy. Treat the four Foundation lenses as questions and let the AI module answer them in the AI domain: "In AI governance your reasoning ran mostly on rules, and here is where that diverged from your Foundation." No second identity. This is the intellectually right answer, but it is a cross-instrument inference and therefore requires authoring schema v2 with a reviewed bridge. That is real V25 work with a real review cost.

**Option B — The Transfer Test (recommended, cheap, legal under schema v1, and the best idea in this document).**
Do not compare scores at all. Compare *answers to structurally paired items*.

Author a set of item pairs where one item poses a dilemma about states and its partner poses the structurally analogous dilemma about frontier AI. Then show the respondent both of their own answers, side by side, with no arithmetic:

| Foundation item | Paired AI item |
|---|---|
| A rising power gains capability faster than expected | A rival lab crosses a capability threshold faster than expected |
| Can verification regimes bind a state that expects to lose from them? | Can compute-accounting or eval regimes bind a lab that expects to lose from them? |
| Does interdependence restrain or expose? | Do open weights diffuse power or diffuse risk? |
| Should institutions constrain the strongest actor, or reflect it? | Should governance constrain frontier developers, or codify their practice? |
| Whose consent legitimates a security order? | Whose consent legitimates a deployment decision? |

The readback is descriptive and local: "You were consistent on four of six. On verification you trusted institutions with states and distrusted them with labs. That is the pair worth thinking about."

The only claim being made is *we authored these two items as structurally analogous*. That is an editorial claim, documentable, reviewable, and it needs no bridge, no calibration, no common scale, and no schema change. It is publishable, it is shareable, and it is the thing nobody else has built.

It also converts the AI module from an orphan into the product's most interesting feature, and it is a legible piece of AI-governance thinking to put in front of a hiring manager.

**Option C — Rebuild the AI bank around live fault lines (V24/V25, source-backed).**
Replace the eight axes with six that track actual disputes:

1. **Threshold and evidence burden** — what triggers a gate, and what counts as evidence it was cleared
2. **Locus of authority** — supranational / national / subnational / private, and the preemption question
3. **Harmonisation and divergence** — whether regime fragmentation is a defect or a hedge
4. **Openness and diffusion**
5. **Enforcement realism** — paper rules versus administrative capacity
6. **Whose legitimacy** — technocratic, democratic, multilateral, or market

Drop `humanFuture` from scoring; keep it as an explicitly non-scored reflective card if it earns its place. Fold `militaryRole` into the Security module, which owns coercion. This is a bank v3 with a proper source pack, and it is exactly the kind of research pack the expiring Codex credit cannot do but Deep Research can.

**Sequencing recommendation:** B now (V24, alongside the visual work), C as the V24/V25 research track, A as the V25 schema v2 decision.

### 3.4 Reposition the module's name and claim

"AI Governance Compass" with six archetypes reads as a personality test for AI policy. "Where your foreign-policy reasoning holds, and where it breaks" reads as an argument. The second is what the product actually does under Option B.

---

## 4. Perspective: staff engineer

### 4.1 Content lives in TypeScript, which blocks everything editorial

`lib/explore-content.ts` is 73KB. `lib/result-helpers.ts` is 54KB. `lib/archetype-content.ts` is 48KB. `lib/profile-store.ts` is 45KB. `lib/profile-share.ts` is 35KB. `lib/atlas-lite.ts` is 31KB. `lib/perspectives/catalog.ts` is 29KB.

Editorial copy is compiled into the JS bundle as source modules. Consequences:

- every copy edit is a code change requiring the full gate
- the owner cannot edit copy, which is the stated goal of V22.5 Prompt C
- Chinese localisation has to duplicate module structure rather than add a locale file
- the scrollytelling rewrite will have to touch content and layout in the same diff, which is exactly the pattern that produces regressions

The V22.5 plan called for extraction into `content/copy/en/...`. What exists is `lib/copy/glosses.ts` at 1.7KB. The extraction did not happen.

**This is the highest-priority engineering work and it should happen before, not after, the visual rebuild.** Moving content to `content/` first means the visual prompts touch layout only.

### 4.2 Version proliferation by file duplication

`security.ts` + `security-v21.ts` + `security-v22.ts`. `technology.ts` + `technology-v21.ts`. `ai-governance-scoring.ts` + `-v21.ts`. `ai-governance-results.ts` + `-v2.ts`. `ai-governance-reading-lists.ts` + `-v2.ts`. `runtime-v1.ts` + `runtime-v2.ts`. `scoring/v1.ts` + `v2.ts`.

Compatibility is a genuine commitment and the right call. Duplicating the whole module per version is the wrong implementation of it. Roughly 150KB of frozen code ships to every visitor so that old links decode.

**Correct pattern:** frozen banks become `content/frozen/<slug>.v<N>.json`, and one generic replay decoder reads them. Byte-exact replay still passes, live code shrinks, and the pattern does not multiply when V24 and V25 land. Do this before V24, or it happens twice more.

### 4.3 `app/globals.css` is 227KB

One hand-written stylesheet of 227KB, with Tailwind v4 also installed. Two styling systems coexisting. Before any scrollytelling work, this needs tokenising, or the visual rebuild pushes it past 300KB. The Claude Design spec already provides the token set to standardise on.

### 4.4 The palette in the repo is the wrong one

The design spec states: ground `#0F1B2D`, panel `#14243A`, rule `#24344B`, accent `#C9A227`, text `#F4F1EA` / `#C7D2E0` / `#8B9AAE`, anchor `#3A4E6B`. Light build adds ground `#F4F1EA`, accent `#7A5F26`, rule `#D8D2C4`. It says explicitly: "The repo's `#0a1322` / `#cea857` should be retired in favour of these."

It also flags an accessibility defect: brass `#C9A227` measures 2.1:1 on off-white, which fails WCAG AA for any text use. The light-mode substitute `#7A5F26` at 5.3:1 exists for this reason. Anywhere brass currently appears as text on a light ground is a live contrast failure.

### 4.5 mapbox-gl is a heavy dependency for what the product needs

`mapbox-gl` ^3.26.0 is roughly 800KB gzipped plus a tile-service dependency and a billing relationship, apparently for the World Stage prototype. `lib/world-stage/data/world-countries-110m.json` is already vendored at 136KB, which means the geometry is local.

For the map ambitions described for Explore — schematic, annotated, non-interactive-pan — plain SVG with a precomputed projection is smaller, free, printable, screen-readable, and server-renderable. Check whether mapbox ships on any live route. If it does, removing it is probably the largest single performance win available.

### 4.6 Version-specific validators do not compose

`npm run validate` chains `validate:structure`, `validate:module-authoring`, `validate:security-v4`, `validate:security-v5`, plus calibration and diagnostics. Two of six are Security-version-specific. V24 and V25 will each add one. Generalise to `validate:module -- <slug> --version <n>` before the pattern hardens.

### 4.7 Repository presentation

Repo root contains `phase4r-docs/`, `phase5m-docs/`, `phase5m1-docs/`, `phase6b-docs/`, `phase6b1-docs/`, `phase6b2-docs/`, `diagnostics-before.txt`, `V18 case verification-deep-research.md`, `plans/`, `research/`, `artifacts/`, `tmp/`.

If this repo is part of the portfolio — and it should be, because the governance discipline is the thing worth showing — the root is the first impression and currently reads as sprawl. Consolidate under `docs/history/`. Also confirm `.env.local` is gitignored; it is present in the working tree.

---

## 5. Perspective: product / UX design

### 5.1 Six front doors

The homepage presents six equal-weight actions under "Choose a starting point": Current Case, Foundation, Focus Areas, Perspective Runs, Worldview Map, AI Governance. Decision cost is maximal at exactly the point it should be minimal.

Worse, the hero slot is occupied by a Current Case — "Familiar U.S.-alliance security lens," reviewed through 14 July 2026, which as of today is 38 days old and still presented as the lead. The V22.5 freshness machinery either is not enforcing or the case has not been rotated. That is a live trust defect on the most prominent surface of the site.

**Fix:** one primary door. The Foundation. Everything else moves below the fold or into navigation. The homepage's job is to answer "what is this and why would I spend twelve minutes," and it currently answers "here is a menu."

### 5.2 The result page is a document, not a result

Eleven `h2` sections in linear stack: strongest dimensions, extension, how your logic hangs together, modifiers, pressure case, domain application, what is doing the work, nearest alternative, dimension profile, questions that could change this, coverage.

The reader gets the payoff and then falls into a methods paper. "Payoff before caveat" is in the principles and is being followed at the top of the page and abandoned by section four.

The instinct that this should be scrollytelling is correct, but the fix is structural before it is motion:

1. **Fixed hero** — sigil, name, code, variant, one-sentence gloss, position map, firmness. The Claude Design "Frontispiece" composition is already the right answer.
2. **A scroll-driven argument** — three or four steps that each answer one question and each show one piece of evidence. "Why this and not its neighbour." "What is actually doing the work." "Where it would break."
3. **Everything else behind disclosure** — dimension tables, coverage, methods.

The animation earns its place only in step 2, where the map, the bars, and the neighbour comparison can be revealed in sequence rather than dumped at once.

### 5.3 Explore cannot win as a reference work

/explore/realism is roughly 2,200 words of prose with no images, no charts, no maps, and no interaction. The diagnosis that it reads like Wikipedia is exactly right.

The important point is *why that is fatal*: you cannot out-reference Wikipedia. More prose, better prose, or animated prose all lose the same comparison.

What Wikipedia cannot do:

- **Show the tradition operating on a live case.** Take one Current Case. Show what a realist, an institutionalist, a constructivist, and a critical political economist each notice first, each recommend, and each accept as the cost. Side by side, same facts.
- **Show the reader where they sit.** If the reader has a Foundation result, highlight their own reading in that four-way comparison. If they do not, offer the single decisive question.
- **Show the disagreement, not the summary.** Wikipedia gives you consensus description. The interesting artifact is a structured disagreement.

**Recommendation:** each tradition page becomes a demonstration with a prose reference section beneath it, rather than a prose reference with a call to action beneath it. Same content, inverted.

### 5.4 The sigils are not yet doing any work

Eight marks exist in `lib/archetype-marks.ts` as System A — Derived, with source cultures and cutting tools documented per mark. The design file contains a complete animation system: per-stroke `stroke-dashoffset` keyframes, correct stroke order per writing tradition (力 order for Shi, headline bar first for Satyagraha, outer-strands-inward for Musyawarah, gouge order with no lift for Dependencia), a dot-settle at 60%, and a `prefers-reduced-motion` block that paints the finished mark.

None of it is implemented. The marks currently appear at 24/48/96px in directories, which spends their impact before the result pays it off. The design file says this directly: "the sigil should not appear before the result, or the draw-on is spent before it pays off."

**Rules for implementation:**
- animate exactly once, on first paint of a freshly generated Foundation result
- never loop
- resting state is the finished mark; frozen, revisited, shared, printed, and reduced-motion states all paint drawn
- static everywhere else in the product
- fix the flagged Kairos/Concert collision below 24px before the marks enter share cards or navigation

### 5.5 Accessibility items to carry into the rebuild

- brass on light backgrounds fails contrast; use `#7A5F26`
- the anchor mid-tone `#3A4E6B` is explicitly not a text colour
- every animated element needs a drawn resting state, which the design file already handles
- mode naming is inconsistent: UI says "Advanced," code says `analyst`, module copy says both
- print behaviour is specified in the design file and should stay specified in the implementation

---

## 6. Perspective: editorial director

The style guide, the copy audit script, and the P0/P1/P2 rule tiers are strong and unusual. The banned formulations list is well chosen.

The gap is that **the product has no voice.** Every sentence is careful, institutional, and unattributable. That is correct for the instrument and fatal for the audience goal. Nothing here is contestable, so nothing here is shareable.

The resolution is not to loosen the instrument. It is to add a clearly separated authorial layer:

- a signed, dated "From the author" note on each archetype page, each Current Case, and each Explore tradition
- explicitly outside the instrument, explicitly a view, explicitly not part of scoring
- subject to the same factual standards and none of the neutrality constraints

This is how Our World in Data and the FT separate analysis from apparatus. It serves the personal brand directly without contaminating the measurement, and it gives the social accounts something to post that is not a chart.

One more editorial note: `lib/ai-governance-cross-module-synthesis.ts` is deprecated but still in the bundle, and it is full of exactly the constructions the audit bans — "keeps returning to," "adds a pull toward," "the hard part is saying which one should win." Delete it rather than deprecate it; nothing imports it once the AI result page is rebuilt.

---

## 7. Perspective: commercial advisor (one-person studio)

You selected all four objectives: revenue, audience, research rigor, and job credibility. They are not equally compatible.

- **Research rigor and audience growth pull opposite ways on claim strength.** The claims that spread are the claims the methodology forbids.
- **Revenue and job credibility pull opposite ways on time.** Both are full-time.
- **Job credibility and research rigor are the same work.** Do these together.
- **Audience is the input to revenue**, not a parallel track.

So the honest sequencing is: rigor and credibility now, audience as a byproduct, revenue last and indirect.

### 7.1 Do not monetise the quiz

Free worldview quizzes have essentially no consumer willingness to pay. The comparables monetise on volume — millions of sessions, ads or cheap PDF reports — which is neither available at this scale nor compatible with the brand. Any paywall on this product converts a credibility asset into a low-revenue consumer product and loses on both.

### 7.2 The four plausible revenue paths, ranked

**1. Sell the method, not the product.** "Evidence-coded interactive instruments for institutions that cannot afford to be wrong in public." The IR Worldview Inventory is the portfolio piece. The governance layer is the differentiator — no other quiz has a release-decision record, a manifest fingerprint, or a documented refusal to fuse scores. Buyers: think tanks, university programmes, foundation comms teams, policy shops that want a public interactive and are terrified of overclaiming. Realistic engagement size: $5k–25k. Highest probability path, and it uses everything already built.

**2. Institutional licensing and teaching.** A programme running a version as a course instrument. Low revenue, high credibility, and it produces the first real respondent data with a natural consent path. A single course adoption solves the "no human data after twenty-three versions" problem permanently.

**3. Editorial subscription.** The Current Case pipeline is already an editorial product. That is the audience asset and the conversion channel into (1) and (2). Build the audience, not the paywall.

**4. Paid depth layer.** Analyst mode, the full 68-item Foundation, archived cases. Real ceiling is small. Do not build payments this year.

### 7.3 The single artifact that serves all four goals

One exceptionally well-made public case study of how this instrument was built, methodological limits and all: the decision to refuse score fusion, the release-decision record, the percentile problem and how it was fixed, the under-modeled traditions, the transfer test.

That document is simultaneously the job-application evidence, the Substack anchor, the sales collateral, and the draft of a methods note. It is the highest-leverage writing available and it costs one weekend.

---

## 8. Perspective: growth / social

### 8.1 Pick one platform, not three

- **X** is where IR and AI-policy people argue. Primary.
- **LinkedIn** directly serves the job goal and you already have a presence there. Secondary, and cheap, because posts are the same content in a different register.
- **Instagram** is where the sigils would perform visually and where the audience is not. Third at best, and only once the visual system is genuinely finished.

Running three accounts at low quality is worse than running one well.

### 8.2 The content engine that actually works here

One Current Case per week produces: a thread, one graphic, and a link to the interactive. That is the whole engine. It is already most of the way built — the Current Case schema has evidence windows, claim-level sourcing, uncertainty, options with accepted tradeoffs, and worldview readings. Every one of those fields is a post.

The recurring visual identity is the sigil set and the four-tradition comparison. Those are the two things nobody else is making.

### 8.3 The risk nobody has planned for

A public account creates a standing pressure to publish claims. The entire V22.5–V23.4 arc was about not overclaiming. The social layer is the most likely place for that discipline to break, because the sentence that spreads is the sentence the methodology forbids.

**Write the social copy rules into the same copy audit.** The same P0 rules — no unversioned distributional claims, no validity language, no population inference — apply to a post. If the audit cannot lint a draft post, at minimum keep a written checklist and run it before publishing.

### 8.4 What not to post

Do not post "6% of respondents share this reading" or any percentile. Do not post archetype distributions. Do not post anything that implies the instrument has been validated. These are the three most tempting and most damaging posts available.

---

## 9. Perspective: research ethics and legal

Paying participants, collecting their responses, and possibly publishing findings, without institutional affiliation, requires:

- a written consent form covering purpose, what is collected, retention, and withdrawal
- a data-handling statement and a deletion date
- no special-category data collected or inferred
- a decision, in writing, about whether findings will be published, made before the sessions run

If SAIS faculty participate and there is any intent to publish, seek a JHU IRB determination rather than assuming one. Product usability testing is very often determined "not human subjects research," but that determination should be obtained, not presumed. It costs an email and it is the difference between a defensible study and an undefendable one.

Two smaller items: check whether participating faculty need to disclose outside compensation, and write the retention and deletion plan before the first session rather than after.

Tier 1 remaining off is correct. The trial will generate the project's first real data, and it should be governed from the first minute.

---

## 10. Ranked defect list

| # | Defect | Where | Severity | Fix in |
|---|---|---|---|---|
| 1 | Ordinal percentiles and a rarity line rendered against a synthetic distribution | result page, share card, design file | Critical | V24 visual sprint |
| 2 | AI module orphaned: parallel taxonomy, no manifest, no release decision, deprecated bridge | `lib/ai-*`, `/ai` | Critical | V24 |
| 3 | Editorial content compiled into TS modules; owner cannot edit copy | `lib/*-content.ts` | High | Before visual sprint |
| 4 | Six equal front doors; stale Current Case in the hero slot | homepage | High | V24 visual sprint |
| 5 | Explore pages are prose with no demonstration | `/explore/[slug]` | High | V24 visual sprint |
| 6 | Expansion gates have no data collection feeding them | product-wide | High | One field, this week |
| 7 | Hedger posture decided by one dimension against a hardcoded 4 | `lib/archetypes.ts` | High | V24 |
| 8 | Repo palette contradicts the design spec; brass fails contrast on light | `globals.css` | Medium | V24 visual sprint |
| 9 | Actor-lens cards produce no readback for the respondent | Security v5 | Medium | V24 |
| 10 | Frozen versions duplicated as whole source files | `lib/modules/`, `lib/ai-*` | Medium | Before V24 bank |
| 11 | Four lenses and four traditions presented as separate ontology tiers | `/explore` | Medium | Copy fix |
| 12 | Kairos/Concert sigil collision below 24px | `lib/archetype-marks.ts` | Medium | V24 visual sprint |
| 13 | Version-specific validators do not compose | `package.json` | Medium | Before V24 |
| 14 | mapbox-gl weight for schematic map needs | `package.json` | Medium | Audit first |
| 15 | Cultural naming provenance unreviewed | archetype content | Medium | Trial + note |
| 16 | Repo root cluttered with phase directories | repo root | Low | Any time |
| 17 | Mode naming inconsistent (Advanced / analyst) | product-wide | Low | Copy fix |

---

## 11. Recommended sequence

This differs from the current roadmap in one respect: it inserts a coherence release before V24's bank, and it moves the AI module from "later" to "next."

**V23.5 — Legibility and coherence (4–6 weeks).** No new scored content.
- content extraction out of TS into `content/`
- token unification to the design spec palette
- percentile removal and band replacement
- sigil animation system
- result hero and scroll structure
- Explore tradition-page rebuild as demonstration
- homepage single-door restructure
- the one free-text coverage-gap field
- per-card actor-lens readback

**V24 — AI module rearchitecture and the Transfer Test.**
- AI Governance onto the module framework with an authored manifest and a real release decision
- AI bank v3 against the 2026 fault lines, source-backed
- the Transfer Test: paired Foundation/AI items, juxtaposition only, no bridge
- Economic Statecraft research pack runs in parallel, no bank

**V25 — Economic Statecraft, then the closed trial.**
- Economic Statecraft implemented as the first authored-manifest module
- the full twelve-person paid trial after it lands
- schema v2 bridge decision informed by trial evidence

**V26 — Energy Transition, and whatever the trial says to fix.**

The main argument for putting the AI rearchitecture before Economic Statecraft: it is the surface that most directly serves the career goal, it is the module where the intellectual contribution is highest, and Economic Statecraft is a fifth instance of a pattern that has not yet been proven interesting on the fourth.

---

## 12. What I would push back on

You chose to power through V24 and V25 before the full trial, with an informal two-or-three-person text round now. That is a defensible call and I will design for it, with one hedge.

The risk is not that the UI is wrong. The risk is that a **systematic item-design problem** — options that differ by intensity rather than logic, a morally attractive option in each set, knowledge load that filters out non-specialists — gets replicated into two more banks before anyone notices. That is expensive to unwind because it means rewriting items, recalibrating, and re-versioning twice.

The hedge costs nothing: make the informal round ask the item questions, not just the interface questions. Specifically these two, which are the ones that surface item defects:

1. "Did any answer look like the obviously decent, smart, or moderate one?"
2. "Was there a question where you didn't know enough to answer honestly, so you guessed?"

Three friends answering those two questions about the Foundation and Security v5 will tell you more about whether V24's bank is safe to write than any amount of UI feedback. Details in the trial protocol document.
