# V23.3 Security v4 design contract

> **Superseded for new completions.** Security bank v4 remains a frozen
> historical bank. The owner-authorized bank-v5 public-beta decision is recorded
> in [V23_3_SECURITY_V5_BETA_RELEASE_DECISION.md](./V23_3_SECURITY_V5_BETA_RELEASE_DECISION.md).
> The v4 HOLD/NO-GO language below remains part of the historical record and is
> not a release approval.

Status: **design-only; non-shipping; HOLD for implementation**
Workstream: `CODEX V23.3A — SECURITY V4 DESIGN ONLY`
Branch: `v23-3a-security-bank-design`
Research cut-off: 2026-08-18
Prepared: 2026-08-19

## 1. Authority and scope

This contract defines a candidate Security bank v4. It does not authorize a production-bank replacement, registry entry, runtime change, calibration run, migration, staging, commit, or push. The production Security v3 bank remains the readable current bank.

The candidate changes content architecture, not the meaning of the four Security axes or three lanes. It replaces the current Taiwan- and Iran-specific scored role-play cards with neutral cores and unscored lenses, and adds a parallel neutral-core/lens family for Ukraine. Across the three theaters, the design has three scored cores and nine unscored actor lenses. Eleven other v3 cases remain in the design set with editorial revisions that make each option's mechanism and accepted cost explicit.

The source pack is the local research report `deep-research-report (34).md`, titled *Security Module v4 — Primary-source research pack*. Its Taiwan, Iran, and Ukraine source IDs, plus the ledger-declared supplement `I07-S1`, are the candidate's evidence keys; the opaque exported citation markers are not. URL resolution and provenance cautions are recorded in `V23_3_SECURITY_SOURCE_LEDGER.md`.

## 2. Protected production surfaces

This work must not modify:

- `content/instrument/security.v3.json`;
- the live Security module definition;
- scoring runtime v2, including primary weight `1`, Analyst secondary weight `0.45`, and actor-lens exclusion;
- module version selection or the historical-version registry;
- Security calibration code or data;
- payload encoding, decoding, or result replay;
- Technology's bank/scorer tuple.

Frozen v3 checkpoint:

| Property | Frozen value |
|---|---|
| Security bank | 3 |
| Security scorer | 2 |
| Payload envelope | 3 |
| Bank SHA-256 | `4ada4a5625952dcdce6113414e5796295625939d2ad18341d8451898a6b923ea` |
| Standard | 9 total / 8 main-scored / 1 actor lens |
| Analyst | 15 total / 14 main-scored / 1 actor lens |

The v3 checksum is a design-time freeze assertion. A later implementation should add it to compatibility tests; this sprint does not change tests.

## 3. Construct held constant

The candidate preserves the existing axes:

| Axis | Low anchor | High anchor | Intended construct |
|---|---|---|---|
| `activism` | restrained | coercive | willingness to apply pressure or force rather than hold back |
| `escalation` | escalation-averse | credibility-first | priority given to crisis ceilings versus visible resolve |
| `alliance` | autonomy-sensitive | alliance-centric | preference for national discretion versus pooled commitment |
| `legitimacy` | order-first | protection-sensitive | weight given to sovereign/legal order versus protective action |

It also preserves the existing lanes:

- `deterrence`: probing, coercion, and crisis ceilings;
- `alliances`: guarantees, coalition durability, autonomy, and hedging;
- `legitimacy`: authority, protection, accountability, and order.

The output is a continuous profile. Neither a response nor an actor-lens answer assigns nationality, loyalty, morality, sophistication, or a worldview “type.” No nationality, citizenship, or cultural attribute changes scoring.

## 4. Candidate architecture

The design set has 23 items: 13 main-scored cards and ten actor lenses in Analyst; Standard uses 19 of those items, nine main-scored and ten actor lenses.

| Family | Item | Role | Lane | Modes | Exact setup sources |
|---|---|---|---|---|---|
| Taiwan | `taiwan_inspection_regime_core` | neutral scored core | deterrence | Standard + Analyst | T01, T02, T03, T05, T06 |
| Taiwan | `taiwan_beijing_instrument` | Beijing actor lens | deterrence | Standard + Analyst | T01, T02, T05 |
| Taiwan | `taiwan_taipei_continuity` | Taipei actor lens | deterrence | Standard + Analyst | T03, T04 |
| Taiwan | `taiwan_washington_coalition` | Washington/regional-coalition actor lens | alliances | Standard + Analyst | T06, T07, T08, T09, T10 |
| Iran | `iran_ceasefire_core` | neutral scored core | deterrence | Standard + Analyst | I01, I02, I04, I06, I10 |
| Iran | `iran_tehran_leverage` | Tehran actor lens | deterrence | Standard + Analyst | I06, I10, I11, I13 |
| Iran | `iran_israel_gulf_thresholds` | Israel/U.S./Gulf actor lens | alliances | Standard + Analyst | I03, I08, I09, I12, I14 |
| Iran | `iran_mediator_navigation` | mediator/exposed-trading-state actor lens | legitimacy | Standard + Analyst | I04, I06, I07, I07-S1, I10 |
| Ukraine | `ukraine_ceasefire_stall` | neutral scored core | deterrence | Standard + Analyst | U01, U03, U04, U05 |
| Ukraine | `ukraine_kyiv_security_architecture` | Kyiv actor lens | alliances | Standard + Analyst | U01, U03, U04 |
| Ukraine | `ukraine_moscow_bargaining_tradeoff` | Moscow actor lens | deterrence | Standard + Analyst | U01, U05 |
| Ukraine | `ukraine_external_division_of_labor` | external coalition/non-belligerent actor lens | alliances | Standard + Analyst | U01, U08, U10, U12 |

The remaining 11 candidate items are retained v3 cases with revised option prose. The four superseded v3 theater cards are `taiwan_quarantine`, `shipping_attacks`, `iran_threshold`, and `beijing_below_war`; they remain readable only in v3 and are not silently reinterpreted as v4 answers.

### Actor-lens rule

An actor lens asks which instrument best fits a stated decision cell's objective and constraints. It does not ask the respondent to endorse the actor, predict secret intent, or answer what a government “should” do from outside that position.

All nine new actor lenses use the exact production sentinel `cardType: "actorLens"`. Under scorer v2, that card type is excluded from headline and lane scores and is aggregated only as separate card-type analytics. A future implementation must preserve that invariant and add a regression fixture for every new lens. Item completion and evidence displays must label these as perspective-modeling cards, not scored personal commitments.

The current output pools all actor lenses into one vector and short-circuits the ordinary explanation-versus-decision comparison when any actor lens is present. This contract therefore does not promise named-actor numeric reads or a visible explanation/decision contrast. Either output would require separate later approval and an explicit runtime/output design.

## 5. Main-score and balance contract

### Weight accounting

The cap is calculated from actual signal-key presence, not from `discriminatingAxes`. Every candidate option remains dense on all four axes, matching scorer v2 behavior. A main-scored item therefore contributes primary weight `1` to each axis. An Analyst secondary answer can add `0.45` to each axis. Actor lenses contribute `0` to the main score.

For a theater `t`, mode `m`, and scored axis `a`:

`share(t,m,a) = sum(main-score item weights in t containing signal a) / sum(all main-score item weights containing signal a)`

Acceptance is `share <= 1/3`; equality passes. The same check must be run for primary-only responses and the maximum-secondary sensitivity case. Because all main-scored options are dense and have the same secondary-choice rule, the share is unchanged in that sensitivity case.

| Mode | Main-scored items | Per-axis primary denominator | Per-axis max-secondary denominator | Taiwan share | Iran share | Ukraine share | Largest retained scenario-family share |
|---|---:|---:|---:|---:|---:|---:|---:|
| Standard | 9 | 9 | 9.00 | 11.11% | 11.11% | 11.11% | 22.22% (`euro_atlantic` and `trans_theater_protection`) |
| Analyst | 13 | 13 | 18.85 | 7.69% | 7.69% | 7.69% | 15.38% (`euro_atlantic` and `trans_theater_protection`) |

No theater or conservative scenario-family proxy exceeds one-third of any main-scored axis. Within the deterrence lane, each scored Taiwan, Iran, or Ukraine core is one of four cards in both modes (`1/4`), so each remains below the cap there as well.

In the CSV, each actor-lens row has item weight `0`. The family numerator and share are repeated on every row in that family so the Taiwan, Iran, or Ukraine aggregate can be audited beside each lens; those repeated family fields are not weights assigned to the lens.

Implementation metadata correction (2026-08-19): the two
`taiwan_washington_coalition` mode rows in the CSV now declare
`escalation;alliance`, matching the canonical item-review metadata. The former
`alliance`-only cell was a ledger transcription omission. Because the card is
an actor lens with zero main-score weight, this correction does not change any
scored-axis denominator or theater share.

### Card and lane balance

| Mode | Total | Main-scored | Actor lenses | Scored decision | Scored explanation | Scored lanes D / A / L |
|---|---:|---:|---:|---:|---:|---:|
| Standard | 19 | 9 | 10 | 4 | 5 | 4 / 2 / 3 |
| Analyst | 23 | 13 | 10 | 6 | 7 | 4 / 4 / 5 |

The neutral Taiwan, Iran, and Ukraine cores are explanation cards: they discriminate among failure mechanisms that can transmit or entrench a crisis, not preferred response packages or personal allegiance to a combatant. Actor lenses are reported separately and do not repair scored-card coverage.

### Main-scored declared-axis coverage

| Mode | `activism` | `escalation` | `alliance` | `legitimacy` |
|---|---:|---:|---:|---:|
| Standard | 7 | 5 | 4 | 5 |
| Analyst | 7 | 6 | 8 | 7 |

The acceptance gate must calculate this table after filtering out `actorLens`. The current calibration test counts actor lenses in declared coverage; a later implementation must correct or supplement that gate before relying on it for v4.

## 6. Item-writing contract

Every candidate item must meet all of these rules:

1. The scene supplies every fact and term needed to choose among the options. Optional context may clarify scope but cannot contain the knowledge required to answer.
2. Any invented event is expressly a scenario assumption (`SAx`). Observed fact (`OF`), declared policy (`DP`), doctrine/legal position (`DOC`), authoritative assessment (`AA`), and scholarly assessment (`SA`) remain distinct in the ledger.
3. The stem cannot demand a prediction about invasion dates, secret rules of engagement, hidden weapons status, alliance entry, or a universally settled legal label.
4. Options represent different causal or institutional mechanisms, not weak/medium/strong intensity points.
5. Every option names what it does and states an accepted cost in parallel syntax.
6. No title or label calls itself safer, smarter, durable, realistic, lawful, principled, humanitarian, or courageous unless the option also makes the contestable mechanism and cost equally visible.
7. No option is the obvious moral, patriotic, anti-war, pro-alliance, or compromise answer. No option preemptively excuses the respondent from disloyalty, cruelty, naivety, or recklessness.
8. Uncertainty is a condition to manage, not a proxy for ignorance. An option may buy information, time, resilience, deterrence, or legitimacy, but must show what it gives up.
9. Actor-lens language attributes objectives and claims to the decision cell. It does not launder an actor's declaration into neutral fact.
10. Standard is answerable on the face of the card. Analyst permits a second choice but does not introduce a specialist-knowledge test.

## 7. Evidence contract

- Every factual clause used to set up the three theater families maps to exact IDs in the source ledger.
- Sources establish plausibility and actor positions; they do not determine a “correct” option.
- Live official pages and numerical snapshots are date-stamped. If the live page has changed, the claim uses the pack's cut-off and is marked for archive capture.
- T03 uses the official page date, 2025-03-13, while preserving the pack's 2025-03-17 discrepancy note.
- T05's report-year/count wording and I04's incident count remain quarantined from candidate prose until an archived page proves the exact snapshot.
- U04 corrects a material source-pack error: the 7 June 2026 meeting/8 June publication names Ukraine, France, the United Kingdom, and Germany, not Poland.
- U01 remains the authoritative legal baseline; attributed Russian security arguments are not presented as an equivalent neutral account of the invasion.
- A temporary Ukraine line of contact is not treated as legal recognition, and no public position is converted into a leader's private minimum acceptable settlement.
- An opaque export marker is not a recoverable citation. Missing stable primary URLs are provenance gaps and block shipping, even when the source ID is retained.
- No respondent must know any source. The source apparatus is for audit, not a hidden quiz.

## 8. Version, migration, replay, and calibration plan

This section is a later implementation plan, not an authorization to implement it.

### Versioning

- If the bank alone changes and scorer v2 behavior remains byte-for-byte equivalent, register Security as bank `4`, scorer `2`; keep payload envelope `v:3`.
- Bump the scorer only if the algorithm changes: actor-lens exclusion, primary/secondary weights, signal-key aggregation, missing-axis fallback, rounding, classification ordering, or use of `discriminatingAxes` in scoring.
- Select the current tuple per module slug. Security may become `(4,2)` while Technology remains `(3,2)`.
- Keep the historical `(3,2)` Security definition and every older registered tuple readable.

### Migration

- Do not rewrite or reinterpret a v3 answer ID as a v4 answer ID.
- A v3 payload always resolves against its frozen v3 bank, scorer, interpretation rules, and calibration.
- A v4 draft starts unanswered. No v3 response migrates automatically, including an answer whose retained item and option IDs still exist, because the candidate wording and therefore the meaning of the choice changed.
- A later migration aid may display the old v3 selection beside the revised card, but the respondent must explicitly confirm or replace it before the v4 answer state is populated. Superseded theater answers remain unanswered; no equivalent answer is inferred.
- No cross-bank score comparison or claim of longitudinal change is allowed without a separately validated bridge study.

### Replay

- Add a v3 bank hash assertion using the checksum above.
- Preserve existing v3 canonical payload and golden-result fixtures.
- Add Standard and Analyst v4 golden fixtures, including all-primary, valid-secondary, actor-lens-only variation, unsupported-tuple rejection, and v3/v4 side-by-side replay.
- Confirm that changing any actor-lens response cannot change headline or lane scores.
- Confirm that v3 results remain identical after v4 becomes current.

### Calibration

- Freeze v3 calibration with its `(bank, scorer, mode, context)` tuple. Current calibration keyed only by slug/mode is not sufficient for historical replay.
- Generate v4 diagnostics separately and never overwrite v3 cuts.
- Synthetic-choice runs are engineering diagnostics, not respondent norms or population percentiles.
- Before shipping, review attainable range, item-direction spread, floor/ceiling saturation, default-headline frequency, and selected-answer sensitivity in each mode.
- Pilot Standard and Analyst separately. Estimate reliability and item behavior only after adequate, demographically and geographically varied responses; do not backfill fake precision from the synthetic run.
- Actor-lens aggregates remain descriptive and uncalibrated unless a separate construct and reporting use are approved.

## 9. Threat register

| ID | Class | Threat | Reproduction probe | Required control | Design status |
|---|---|---|---|---|---|
| C-01 | content validity | A source-derived actor claim appears as neutral fact | Ask a reviewer to label every factual clause OF/DP/DOC/AA/SA/SAx; any un-attributed DP fails | exact claim IDs and actor attribution | controlled in draft; source-link gaps remain |
| C-02 | content validity | A live page's changed count is treated as an Aug. 18 snapshot | Compare current T05/I04 page with archived cut-off | quarantine mutable counts; capture archive | HOLD for shipping |
| C-03 | content validity | Actor lens reads as endorsement or vilification | Blind-review lens labels with actor name removed, then restored | symmetric mechanism/cost; explicit perspective note | editorial test required |
| C-04 | content validity | Ukraine copy erases the UN baseline or treats an attributed Russian demand as neutral history | Compare every Ukraine scene with U-C1 and U-C4 | retain U-C1; mark U-C4 as Russian DP | controlled in draft; regional review required |
| C-05 | content validity | July 2026 NATO burden-sharing language is presented as timeless | Remove the date from U-C8 and reread the external lens | date the statement and reverify before publication | controlled in draft; publication check required |
| K-01 | construct validity | Theater preference or partisan affect drives a scored answer | Repeat neutral core with proper nouns masked | neutral core only in main score; balanced costs | cognitive test required |
| K-02 | construct validity | Nine new lenses create apparent axis coverage | Run coverage with and without `actorLens` | main-scored coverage gate first | specified; test later |
| K-03 | construct validity | Dense midpoint signals dilute an axis while declared axes imply otherwise | Compare denominators from signal keys and declared axes | ledger uses actual signal keys | controlled in design |
| K-04 | construct validity | Actor lenses alter the headline through a runtime regression | Change only lens answers in a golden fixture | headline/lane invariance test | specified; test later |
| K-05 | construct validity | A specialist term becomes a knowledge proxy | Give Standard cards without expandable context and ask respondents to paraphrase | define “continuity of knowledge,” “security guarantee,” and “line of contact”; no legal-status quiz | editorial test required |
| K-06 | construct validity | Ukraine's scored explanations collapse into one generic “mistrust” response | Ask readers to distinguish future-force balance, coercive leverage, issue linkage, and verification scaling | retain four separable mechanisms or merge/rewrite after testing | cognitive test required |
| S-01 | social desirability | One answer is visibly humane, patriotic, allied, restrained, or “smart middle” | Ask which option would look best to a colleague, separately from personal choice | parallel mechanism/cost syntax and neutral titles | revised; cognitive test required |
| S-02 | social desirability | The moderate option wins by construction | Order options on intensity; a simple A-low/B-middle/C-high pattern fails | non-ordinal mechanisms; rotate display order if supported | revised; QA later |
| S-03 | social desirability | Role-play lets respondents signal loyalty to a country | Compare named and masked actor-lens response distributions | lenses unscored; frame as instrument fit | pilot required |
| S-04 | social desirability | The Ukraine external role-specialization option reads as the policy-professional synthesis | Move it across display positions and test “most sophisticated” separately | equally visible ownership-gap cost; counterbalance order | cognitive test required |
| R-01 | replay | New global calibration reclassifies old v3 payloads | Replay frozen v3 fixture before/after v4 calibration load | tuple-key calibration and frozen module definition | BLOCKER before implementation |
| R-02 | reporting | All lenses pool into one vector and suppress explanation/decision read | Answer different actor families oppositely | do not promise named-actor or card-type reporting | limitation disclosed |

## 10. Go/no-go gates

Design documentation may be accepted when all candidate questions/options are present, all setup claims map to exact source IDs, the balance ledger reproduces the tables above, the v3 checksum is unchanged, and protected-file diffs are empty.

Implementation remains **NO-GO** until:

- stable primary links or archived captures resolve every shipping setup claim;
- bilingual or regional subject-matter review checks actor framing, especially the Israel/Gulf grouping, Washington/coalition aggregation, and Kyiv/Moscow/external-actor Ukraine lenses;
- cognitive interviews find no dominant moral, patriotic, expert, or middle-option cue;
- at least 8 of 10 unbriefed Standard readers distinguish the Ukraine core's four mechanisms, and at least 4 of 5 can paraphrase each Ukraine option's instrument and accepted cost without outside explanation;
- a blinded Ukraine wording review finds no morally correct, patriotic, or “smart middle” option for at least 8 of 10 reviewers, with option order counterbalanced;
- median first-pass Ukraine completion remains at or below 75 seconds per card without materially higher skips than retained Standard cards;
- current schema/validator treatment for theater, actor, sources, mechanism, and accepted cost is explicitly chosen;
- version selection and calibration become tuple-aware without changing Technology or v3 replay;
- score-direction, sensitivity, and calibration diagnostics pass separately in Standard and Analyst;
- owner editorial review approves final wording and source status.

Nothing in this contract is a shipping approval.
