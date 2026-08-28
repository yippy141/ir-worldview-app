> **HISTORICAL, SUPERSEDED, NON-EXECUTABLE.** Preserved only for provenance. Verify every claim against the current roadmap, Git state, and runtime before reuse.

## Report: Testing the proposed AI-slop detectors against real IR Worldview copy

> **HISTORICAL AND SUPERSEDED AS EXECUTION AUTHORITY.** Its measurements remain provenance, not release gates.

### 0. What I actually had, and what I did

**Files present and read** (all read-only at `/mnt/user-data/uploads/ir-worldview-app-clean`):
- `lib/explore-content.ts` (1,238 lines)
- `lib/archetype-content.ts` (1,663 lines)
- `lib/result-content.ts` (333 lines)
- `lib/narrative/foundation.ts` (290 lines)
- Also read: `IR_EDITORIAL_STYLE_GUIDE.md`, `lib/worldview-config.ts`

**Could not determine / absent:** `content/` does not exist in this staged copy, so `content/explore/hub.en.json` (imported at `explore-content.ts:1`) and `content/archetypes.json` / `content/archetype-evidence.json` (imported at `archetype-content.ts:1-2`) are unavailable. That means the Explore *hub* copy — hero payoff, section intros, `blendExplanation`, `contextBoundary` — was not testable. My corpus is the copy defined inline in the four `.ts` files only.

**Extraction method.** A Python regex scan of double-quoted and backtick string literals across the four files: **1,112 literals scanned → 355 unique prose-like strings** (filter: ≥45 chars, ≥7 spaces, contains a lowercase word pair, no code sigils). For paragraph-level measures I used the **134** of those with ≥25 words and no unresolved `${}` template holes.

One honest note on source coverage: `archetype-content.ts` contributed 29 prose-like strings, but **27 of them are schema-validation error messages** (`"${path}.value must contain at least ${length.minimumLength} claims."`). Only two are editorial prose (`LEGACY_COMPARISON_QUALIFICATION`, `OWNER_AUTHORIZED_BETA_QUALIFICATION`, lines 15 and 18). That file is not a meaningful source of editorial copy in this staged version.

**A prior observation that reframes the owner's complaint.** The style guide's own filler blocklist (`fundamentally`, `increasingly`, `nuanced`, `multifaceted`, `dynamic`, `complex`, `significant`, `in practice`, `broadly speaking`) appears **2 times in 355 strings**. The sweeps worked. What has *not* been swept is the construction the guide added later under "Contrastive antithesis": `not just` / `rather than` / `, not a` / `less about…more about` appear **42 times across 40 strings**. So the blocklists did their job and the residue is structural, which is the correct motivation for statistical measures. Whether *these* statistical measures find it is the question below.

**Note on the brief:** the proposal skips M7. I tested M1–M6 and M8 as specified.

---

### 1. The twelve passages, classified before any computation

I recorded these judgments in a file (`passages.py`) with reasons, then wrote the measurement script against it. No measure influenced a label.

#### Judged GOOD

**G1** — `lib/explore-content.ts:297` (`exploreFamilies` realist `.summary`, ¶1)
> "Realism begins with a blunt structural premise: there is no government above governments. In a world where no authority can reliably punish defection or guarantee protection, states have to look after themselves. This is not a claim about human nature being evil — it is a claim about the structure of the international system. Even states that want peace cannot be certain others feel the same, so they prepare for the worst."

*Why:* blunt declarative opening, short verbs, concrete stakes, one idea per sentence.

**G2** — `lib/explore-content.ts:460` (institutionalist `.summary`, ¶1)
> "If realism treats anarchy as a trap, institutionalism treats it as a challenge that can be managed. The core argument is that states cooperate less than they could, not because they are inherently hostile, but because they lack reliable information about each other's intentions and no way to verify compliance. International institutions — treaties, organizations, monitoring bodies, dispute-resolution mechanisms — can solve those problems without requiring trust or a world government."

*Why:* opens with a contrast that carries real information; names the mechanism (information problems); the em-dash list is definitional, not decorative.

**G3** — `lib/explore-content.ts:938` (criticalPoliticalEconomy `.modelingNote`)
> "Critical political economy is an umbrella for several distinct but related strands. Marxist political economy foregrounds class and capital accumulation as the drivers of foreign economic policy. Dependency theory (Prebisch, Cardoso, Frank) emphasizes how core-periphery relations structurally reproduce underdevelopment. World-systems theory (Wallerstein) extends this to a long-run analysis of capitalism as a single historical system. Neo-Gramscian IPE (Cox, Gill) examines how hegemony and ideology reproduce international economic order. Structural power analysis (Strange) focuses on how control over production, finance, security, and knowledge structures creates power independent of formal authority. The Foundation scores these strands together as a single orientation — it does not yet disaggregate them."

*Why:* named scholars throughout, one distinct fact per sentence, closes on a concrete admitted limitation.

**G4** — `lib/result-content.ts:124` (realist great-power reading)
> "You read great-power rivalry as structural. The distribution of capabilities determines the stakes, and uncertainty about intent is a feature of the system, not a failure of diplomacy. Deterrence and credible commitments matter more than dialogue."

*Why:* three sentences, 6/22/8 words; says something falsifiable about the reader; no self-reference.

**G5** — `lib/result-content.ts:197` (realist intervention reading)
> "You are skeptical of humanitarian justifications for intervention. Stated rationales rarely match actual interests. Precedents matter more than the particular case. Legitimacy claims in intervention debates often mask strategic competition."

*Why:* four clipped sentences, plain nouns, reads like the briefing note the style guide names as the tone target.

**G6** — `lib/explore-content.ts:890` (Helleiner reading note)
> "Shows that financial globalization was a political choice, not an inevitable market outcome. States actively dismantled capital controls. Essential for understanding why structural financial power is a political variable, not a natural fact."

*Why:* the best sentence rhythm in the file — one historical claim, one verb-driven fact, one payoff.

#### Judged BAD (AI register)

**B1** — `lib/narrative/foundation.ts:182`, "How this affects the reading" section, as rendered for institutionalist + Restrainer + Pluralist (concatenation of `FAMILY_DEBATE_FRAMES` + `STRATEGY_FRAMES` + `NORMATIVE_FRAMES`)
> "Rule credibility and monitoring lead the reading, especially where institutions can change incentives. The strategy modifier favors limiting commitments when overextension risk rises. The normative modifier sets a high threshold before outside actors may override sovereignty and order."

*Why:* names its own machinery twice. Abstract subjects, no agent, no example. This is the single most product-register passage I found.

**B2** — `lib/narrative/foundation.ts:243` (`buildWhyText`, lowDifferentiation), rendered with real `describeDimensionFrame` fills
> "The largest distances from the midpoint occur in persistent rivalry and strategic competition, skepticism that institutions operate independently of power, and a greater willingness to press advantage, but the two nearest traditions remain close. The result therefore supports a qualified reading and does not warrant a hard classification."

*Why:* a 34-word clause pile, then a self-positioning disclaimer. Says nothing about world politics.

**B3** — `lib/narrative/foundation.ts:230` (`buildMeaningText`, sharplyDifferentiated, realist), rendered
> "Power and rivalry set the starting point; reassurance alone does not resolve strategic uncertainty. The dimension results point in a compatible direction and produce a clearer tradition-level result. Realism still summarizes seven separate dimensions."

*Why:* sentences 2 and 3 are about the instrument, not the user or the world. "point in a compatible direction and produce a clearer tradition-level result" is empty.

**B4** — `lib/explore-content.ts:1056` (`exploreGaps` green-ir `.whyNotYetModeled`)
> "Adding green IR would require new dimensions on ecological security, the relationship between development and environmental constraint, and the governance of global commons. These are distinct theoretical commitments that cannot be captured by the current seven dimensions without stretching their meaning."

*Why:* abstraction stack; never shows what such a question would look like.

**B5** — `libts/explore-content.ts:1064` (`exploreGaps` english-school `.whyNotYetModeled`)
> "The English School's full theoretical depth — its account of international society, the role of diplomacy as a social institution, and the historical sociology of international order — is not yet modeled. The order-justice dimension captures one important debate within the tradition, but the broader framework deserves dedicated dimensions and item coverage."

*Why:* polished, symmetrical, uninformative. "deserves dedicated dimensions and item coverage" is a sentence about nothing.

**B6** — `lib/explore-content.ts:773` (constructivist `.quizCoverage.note`)
> "Constructivism is modeled through the norms-and-identity dimension, which captures questions about whether identity shapes interests and whether legitimacy matters independently of power. The scenario on former rivals transforming also probes constructivist instincts about identity change. The current question bank does not fully capture the constructivist debate about norm diffusion, socialization, and the conditions under which identity change is possible — these are areas for future expansion."

*Why:* nominalization pile-up (diffusion, socialization, conditions, expansion), closing on the filler phrase "areas for future expansion".

---

### 2. Computed values, with arithmetic

Operational choices I had to make, stated so the numbers are checkable: sentence split on `[.!?]` followed by whitespace + capital; words = `[A-Za-z][A-Za-z'’\-]*`; M1 is the **mean** per sentence (max also reported); M3 uses **population** standard deviation (sample sd also reported, since with 2–3 sentences the choice moves the number a lot); M2 counts mid-sentence capitalized tokens plus numerals; M8 counts `—`/`–` plus `(` per 100 words.

#### Worked arithmetic — G4 (M3)
Sentence word counts: **6, 22, 8**. Mean = 36/3 = **12.00**.
Deviations: −6, +10, −4. Squares: 36, 100, 16. Sum = 152.
Population variance = 152/3 = 50.667 → sd = 7.118. **CV = 7.118 / 12.00 = 0.593.**
(Sample sd would be √(152/2) = 8.718 → CV 0.727.) Threshold is 0.35, so **no flag** — correct, G4 is good.

#### Worked arithmetic — B6 (M1)
Per-sentence nominalization hits:
- S1 (22 words): `Constructivism`, `identity`, `dimension`, `identity` = **4**
- S2 (13 words): `identity` = **1**
- S3 (30 words): `question`, `diffusion`, `socialization`, `identity`, `expansion` = **5**

Mean = (4+1+5)/3 = 10/3 = **3.33** → **flags** at the 3+ threshold. B6 is the only one of twelve that M1 catches.

#### Worked arithmetic — G3 (M8)
Em-dashes: 1. Open parens: 4 (`(Prebisch, Cardoso, Frank)`, `(Wallerstein)`, `(Cox, Gill)`, `(Strange)`). Total = 5. Words = 105.
**M8 = 5/105 × 100 = 4.76 per 100 words** → threshold is 1.0, so **flagged**. G3 is, in my judgment, among the two or three best paragraphs in the repo.

#### Worked arithmetic — G2 (M1, M8)
M1 per sentence: S1 (17w) `realism`, `institutionalism` = 2; S2 (33w) `argument`, `information`, `compliance` = 3; S3 (19w) `resolution`, `government` = 2. Mean = 7/3 = **2.33**, no flag.
M8: 2 em-dashes, 0 parens, 69 words → 2/69 × 100 = **2.90** → **flagged**.

#### Full value table

| ID | Judgment | sent | words | M1 mean (max) | M2 | M3 pop (samp) | M4 max/sent, per100w | M5 (n lists) | M6 | M8 |
|---|---|---|---|---|---|---|---|---|---|---|
| G1 | GOOD | 4 | 71 | 1.25 (3) | 0 | 0.17 (0.19) | 1, 1.41 | 0.00 (1) | 0.25 | 1.41 |
| G2 | GOOD | 3 | 69 | 2.33 (3) | 0 | 0.31 (0.38) | 1, 4.35 | 0.00 (2) | 0.33 | 2.90 |
| G3 | GOOD | 7 | 105 | 1.29 (4) | 9 | 0.20 (0.21) | 0, 0.00 | 0.00 (3) | 0.14 | 4.76 |
| G4 | GOOD | 3 | 36 | 0.67 (1) | 0 | 0.59 (0.73) | 0, 0.00 | 0.00 (2) | 0.33 | 0.00 |
| G5 | GOOD | 4 | 30 | 0.75 (2) | 0 | 0.15 (0.17) | 1, 3.33 | n/a (0) | 0.00 | 0.00 |
| G6 | GOOD | 3 | 33 | 0.33 (1) | 0 | 0.39 (0.48) | 0, 0.00 | n/a (0) | 0.00 | 0.00 |
| B1 | BAD | 3 | 38 | 0.67 (1) | 0 | 0.16 (0.20) | 1, 5.26 | 0.00 (2) | 0.67 | 0.00 |
| B2 | BAD | 2 | 48 | 2.00 (3) | 0 | 0.42 (0.59) | 0, 0.00 | 0.00 (3) | 1.00 | 0.00 |
| B3 | BAD | 3 | 34 | 1.67 (3) | 0 | 0.33 (0.41) | 0, 0.00 | 0.00 (2) | 0.33 | 0.00 |
| B4 | BAD | 2 | 41 | 1.50 (3) | 1 | 0.12 (0.17) | 0, 0.00 | 1.00 (1) | 0.50 | 0.00 |
| B5 | BAD | 2 | 50 | 1.50 (2) | 2 | 0.20 (0.28) | 0, 0.00 | 1.00 (2) | 1.00 | 4.00 |
| B6 | BAD | 3 | 65 | 3.33 (5) | 0 | 0.32 (0.39) | 0, 0.00 | 1.00 (2) | 0.67 | 1.54 |

---

### 3. Do they separate the groups? No.

Flags fired (● = measure says slop):

| ID | Judgment | M1 | M2 | M3 | M4 | M5 | M6 | M8 | **flags** | agreed with me? |
|---|---|---|---|---|---|---|---|---|---|---|
| G1 | GOOD | | ● | ● | | | | ● | **3** | no — worst-scoring good passage |
| G2 | GOOD | | ● | ● | | | | ● | **3** | no |
| G3 | GOOD | | | ● | | | | ● | **2** | no |
| G4 | GOOD | | ● | | | | | | **1** | yes |
| G5 | GOOD | | ● | ● | | | | | **2** | no |
| G6 | GOOD | | ● | | | | | | **1** | yes |
| B1 | BAD | | ● | ● | | | | | **2** | no — missed |
| B2 | BAD | | ● | | | | ● | | **2** | no — missed |
| B3 | BAD | | ● | ● | | | | | **2** | no — missed |
| B4 | BAD | | | ● | | ● | | | **2** | no — missed |
| B5 | BAD | | | ● | | ● | ● | ● | **4** | yes |
| B6 | BAD | ● | ● | ● | | ● | | ● | **5** | yes |

**Mean flags: GOOD 2.00, BAD 2.83.** Rank-ordering all 36 good/bad pairs by flag count: BAD scores higher in 20, ties in 8 → **AUC = 0.667**. That is a weak signal, and it is carried almost entirely by two passages (B5, B6).

Per-measure, on 6 good / 6 bad:

| Measure | TP | FP | sensitivity | specificity | balanced acc. | good passages wrongly flagged |
|---|---|---|---|---|---|---|
| M1 nominalization | 1 | 0 | 0.17 | 1.00 | 0.58 | — |
| M2 anchor floor | 4 | 5 | 0.67 | 0.17 | **0.42** | G1, G2, G4, G5, G6 |
| M3 length CV | 5 | 4 | 0.83 | 0.33 | 0.58 | G1, G2, G3, G5 |
| M4 hedge density | 0 | 0 | 0.00 | 1.00 | 0.50 | — |
| M5 three-item share | 3 | 0 | 0.50 | 1.00 | **0.75** | — |
| M6 opening monotony | 2 | 0 | 0.33 | 1.00 | 0.67 | — |
| M8 dash/paren density | 2 | 3 | 0.33 | 0.50 | **0.42** | G1, G2, G3 |

Only M5 and M6 beat a coin flip by a useful margin, and both are perfectly specific but catch a third to a half of the bad copy at best.

**No composite threshold works.** At "≥2 flags = slop" you catch all 6 bad passages but also flag 4 of 6 good ones. At "≥3" you catch 2 of 6 bad and still flag 2 good. At "≥4" you get zero false positives but catch only B5 and B6.

**Corpus base rates** (134 paragraphs ≥25 words from the four files) confirm the thresholds are miscalibrated for this repo:

| Measure | corpus median | corpus p90 | fires on |
|---|---|---|---|
| M1 mean nominalization | 1.00 | 2.50 | **5%** |
| M2 anchors == 0 | 0.0 | — | **58%** |
| M3 CV < 0.35 | 0.34 | (p25 0.19, p10 0.09) | **50%** |
| M4 max hedges ≥2 | 0.0 | — | **1%** |
| M4 hedges ≥6/100w | 0.00 | 3.33 | **1%** |
| M5 three-item > 55% | 0.00 | — | **22%** of the 111 with lists |
| M6 determiner-open > 75% | 0.28 | 0.67 | **7%** |
| M8 > 1.0/100w | 0.00 | (p75 3.12) | **46%** |

**At least one measure fires on 128 of 134 paragraphs — 96% of the corpus.** As a gate this proposal flags essentially everything.

---

### 4. Where the measures fail — the important section

**Failure 1 — M8 is anti-correlated with quality. It flags the house style.**
M8 flagged G1, G2, and G3 — three of my six good passages — and only 2 of 6 bad. Balanced accuracy 0.42, *worse than a coin flip*. The reason is visible in G2: `"International institutions — treaties, organizations, monitoring bodies, dispute-resolution mechanisms — can solve those problems"`. The em-dash pair is doing definitional work that a comma cannot do here. Same in G1: `"This is not a claim about human nature being evil — it is a claim about the structure of the international system."` Across the corpus, M8's median is 0.00 but p75 is 3.12 — the distribution is bimodal, because a paragraph either uses appositive definition or does not. A threshold at 1.0 sits in the empty middle and splits the corpus roughly in half on a stylistic coin-flip. **Adopting M8 as specified would push an editor to strip the single most effective device in this codebase's good writing.**

**Failure 2 — M2 flags 5 of 6 good passages, and is fooled by capitalized abstractions.**
M2 fired on G1, G2, G4, G5, G6 — all zero-anchor. But four of those are `result-content.ts` second-person copy, which *cannot* contain proper nouns: it renders for every user regardless of their answers. "Flag at 0 in case/result copy" therefore condemns the entire result-copy genre by construction. Worse, M2 scored **B5 = 2 anchors** and **B4 = 1 anchor** — the "anchors" were `English`, `School's` (the tradition's own name, mid-sentence) and `IR`. So M2 gave *credit* to two bad passages for capitalizing an abstraction, while penalising G6 ("Shows that financial globalization was a political choice…"), which is concrete in every way that matters but happens to contain no capitals mid-sentence.

**Failure 3 — M3's threshold is set at the corpus median, and the unit is too small to support the statistic.**
Median CV across 134 paragraphs is **0.34**; the flag is at 0.35. A threshold at the median is definitionally uninformative — it fires on 50% of everything. But the deeper problem is denominator: **median sentences per paragraph is 2, and 84% of paragraphs have ≤3 sentences.** A coefficient of variation over 2 observations is not a measurement of rhythm, it is noise. Note that B2 (2 sentences, 34 and 14 words) scored CV 0.42 and *passed*, while G5 (4 sentences, 8/6/7/9 words — deliberate staccato, exactly the briefing-note register the style guide asks for) scored 0.15 and was flagged. M3 punishes intentional parallelism and rewards one long clause pile next to one short one, which is precisely the bad pattern in B2.

**Failure 4 — M1 is 39% domain contamination. In a security product, "security" is a nominalization.**
Across the corpus, M1's suffix rule produced 485 hits. The top counted "nominalizations" are: `security` (33), `intervention` (22), `competition` (20), `realism` (16), `identity` (16), `tradition` (15), `cooperation` (12), `constructivism` (12). **188 of 485 hits (39%) are the domain's irreducible core vocabulary** or the names of the four traditions the product exists to describe. G3 — dense with named scholars, which I judged among the best copy in the repo — took M1 hits on `production`, `finance`, `security`, `authority` in a single sentence. There is no way to write about deterrence, sovereignty, and institutions without tripping a `-tion/-ity/-ence` counter. M1 as specified partly measures *topic*, not *register*.

**Failure 5 — M4 is dead. It fires on nothing.**
0 of 12 test passages; **1% of the corpus** on either sub-threshold. Max hedges in any single sentence anywhere in 134 paragraphs is 2. This is not a measure that needs recalibration — it is measuring a problem that the earlier manual sweeps already eliminated, consistent with the filler-blocklist finding (2 hits in 355 strings).

**Failure 6 — the misses are the worst copy in the repo, and they are missed by design.**
B1, B2, and B3 each scored exactly **2 flags** — the same as G3 and G5, and *fewer* than G1 and G2 (3 each). So the battery ranks two of the best paragraphs in the codebase as worse than the three I consider the most obviously machine-registered. Specifically:

- **B1 is the single worst miss.** "The strategy modifier favors limiting commitments when overextension risk rises. The normative modifier sets a high threshold before outside actors may override sovereignty and order." M1 = 0.67. M4 = 0 flags (2 hedges in 38 words = 5.26/100w, under the 6.0 bar). M6 = 0.67, under 0.75. M8 = 0.00 — a *perfect* score, because there is not one em-dash in it. Its only two flags (M2, M3) also fire on most of my good passages, so they carry no discriminating information. **Nothing on the list detects the copy that names the product's own internal variables to the user.**
- **B4 was flagged by M5 on a denominator of one.** M5 = 1.00 because the paragraph contains exactly one detected coordinated list, and it has three items. B5's 1.00 rests on 2 lists; B6's on 2. M5's perfect specificity in this sample is built on denominators of 1–3 and should not be trusted. (My list-detection regex is also crude — it splits on commas and `and`/`or` and will miscount nested or appositive lists. Treat all M5 figures as approximate.)
- **M6's two hits are equally fragile:** B2 and B5 both scored 1.00, which is 2 sentences out of 2.

**Failure 7 — a structural point the whole proposal misses.** B1, B2 and B3 do not exist as strings anywhere. They are **assembled at runtime** from fragments in `lib/narrative/foundation.ts` — `FAMILY_DEBATE_FRAMES` + `STRATEGY_FRAMES` + `NORMATIVE_FRAMES` concatenated at line 182, and template literals in `buildMeaningText` / `buildWhyText` / `buildSummaryLine` / `buildPressureTestText`. Each fragment reads acceptably in isolation. A manual sweep reading the source sees fragments; a user sees the paragraph. **This is the mechanism behind "AI register keeps returning after every manual sweep": nothing is returning — that copy has never been reviewed in the form the user reads it.** No text measure applied to source strings will fix this, because the bad object is never in the source.

---

### 5. Threshold recommendations, grounded in what I measured

**Drop outright:**
- **M4 (hedge density).** 0/12 on the test set, 1% corpus fire rate, corpus max of 2 hedges in any sentence. It measures a solved problem.
- **M8 (em-dash/parenthetical density) as a flag.** Balanced accuracy 0.42. If you want any version of it, invert its role: keep it as a **ceiling at ~5.0 per 100 words** (corpus max is 8.11, p75 is 3.12) to catch runaway appositive stacking, and never as evidence of slop below that.

**Repair before use:**
- **M2.** Two changes. (a) Exclude the product's own capitalized vocabulary from the "proper noun" count — `Foundation`, `IR`, `English School`, tradition names, dimension names — otherwise it credits B4 and B5 for naming themselves. (b) Do not apply it to second-person result copy at all; that copy is generic by design, and applying M2 there condemns the genre by construction. Restricted to case/explore copy with a filtered entity count, it becomes usable.
- **M3.** The threshold of 0.35 sits on the corpus median. Two fixes needed together: move the threshold to **< 0.15** (corpus p10 = 0.09, p25 = 0.19), and **require ≥5 sentences** before computing it. Since 96% of paragraphs have ≤4 sentences, that second condition effectively disables M3 at paragraph scale — which is the honest conclusion. Compute it per **rendered page or content block** (all sections a user sees at once), not per string.
- **M1.** Keep the idea, fix the lexicon. Apply a domain stoplist first — at minimum `security, identity, institution(s), competition, intervention, cooperation, governance, sovereignty, deterrence, alliance(s), compliance, finance, authority, government, tradition`, plus the four tradition names — since those are 39% of current hits. After stripping, re-derive the threshold from the corpus; on the pre-strip distribution (median 1.00, p90 2.50) I would expect the post-strip equivalent of the current 3+ to land near **2.0**.
- **M5.** Keep as a low-priority signal, but only compute it when a block contains **≥4 detected lists**. Every hit in my sample rested on 1–3.
- **M6.** Keep the 0.75 threshold (7% corpus fire rate is reasonable), but require **≥5 sentences**, for the same denominator reason as M3.

**Net:** of seven proposed measures, I would ship **two** (M1 repaired, M6 gated), hold two (M2 repaired, M5 gated), and drop three (M3 at paragraph scale, M4, M8).

---

### 6. The single most reliable tell in this repo's copy

**It is not on the list. It is the copy taking the instrument as its grammatical subject.**

Operationally: sentences whose subject is *the reading*, *the result*, *the dimension results*, *the strategy modifier*, *the normative modifier*, *the model*, *the midpoint*, *the question bank*, or a tradition label in the passive ("Constructivism **is modeled through**…").

I counted these terms per 100 words across the twelve passages:

| group | range |
|---|---|
| my six GOOD passages | **0.00 – 0.95** |
| my six BAD passages | **4.62 – 8.82** |

Clean gap, no overlap, AUC 1.000 — better than any of M1–M8, none of which exceeded 0.75 balanced accuracy.

**But I tested this adversarially against the full corpus, and it does not mean what it looks like.** Run across all 134 paragraphs, the measure fires on only **11**, and those 11 are *exactly* the "product describes itself" genre — which contains my BAD picks **and** passages I would defend: `explore-content.ts:451` (realism coverage note — specific about offensive/defensive/classical realism), `:1040` (feminist gap note), `:938` (G3, which I picked as good and which scores 0.95). Within that genre, none of M1–M8 ranks quality: `:451` scores M1 = 3.00 (flagged) despite being one of the more honest and specific notes in the file, while `:1064` (B5) scores M1 = 1.50 and passes.

So the correct claim is narrower and more useful than "I found the slop detector":

> **Instrument-as-subject is a near-perfect *router*, not a *gate*.** It isolates the ~8% of copy (11 of 134 paragraphs) where AI-register regression actually lives, at which point a human reads those eleven. That is a 12× reduction in review surface, and it targets exactly the genre the sweeps keep missing.

Pair it with the structural fix, which matters more than any measure: **render the `lib/narrative/foundation.ts` combinations to a fixture and review the rendered paragraphs, not the fragments.** The skeleton space is small and enumerable — the "How this affects the reading" section alone is 4 family frames × 3 strategy modifiers × 3 normative modifiers = **36 paragraphs**, plus 3 states × 4 families = 12 for `buildMeaningText`, and 3 branches each for `buildSummaryLine` and `buildWhyText`. A few dozen paragraphs, currently invisible to every sweep that has been run, containing what I judge to be the worst copy in the repository.

---

### Limitations of this test

- **n = 12, non-blind.** I chose the passages and the labels. The evaluation is my editorial judgment against itself; a second reader might relabel B4 or G2.
- **Genre is confounded with quality in my sample.** Five of my six BAD passages are "meta" copy (foundation.ts narrative, coverage notes, gap notes) and all six GOOD are substantive IR prose. That confound is exactly why the section-6 finding needed the corpus check, and the corpus check is what downgraded it from "detector" to "router".
- **Unavailable copy.** `content/explore/hub.en.json` and the archetype JSON are absent from this staged copy, so hub hero/section copy and archetype catalog prose were not tested.
- **M5's list detection is regex-based and approximate.** All M5 numbers should be treated as indicative.
- **All constraint-relevant work here was read-only.** Nothing in this report touches scoring, payloads, calibration, frozen replay, or dependencies; the analysis ran in Python outside the repo.

**Scripts, if you want to re-run or check the arithmetic:**
`/tmp/claude-0/-home-claude/e702124e-d434-598d-85b7-ebebf251ff38/scratchpad/extract.py` (string extraction), `passages.py` (the 12 passages with pre-registered labels), `measure.py` (M1–M8), `alt.py` (agent-rate and self-reference measures).
