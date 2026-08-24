# V23.5 to V26 Master Roadmap

Status: sole executable product roadmap
Owner: Jinhua Yip
Prepared: 2026-08-24
Baseline: `a80fe4d02d818ae546672d15f64aa596a25b1ceb`

## 1. Outcome

Release V23.5 as a trust and legibility correction before extending the scored product. Use human evidence from the current product to decide AI v4. Prove the revised authoring process in AI Governance before building Economic Statecraft. Keep Energy Transition research-only until that process has completed a full release cycle.

## 2. Authority and conflict rule

Authority descends in this order:

1. `AGENTS.md`
2. `PRODUCT.md`
3. `CONSTITUTION`
4. `DESIGN.md`, limited to this repository's font, palette, token, and composition implementation
5. this roadmap
6. the active task contract
7. tests and verified runtime behavior

If an instruction conflicts with a higher authority, stop. Record the two instructions, affected behavior, and smallest owner decision needed. Agents do not resolve product, methodology, privacy, or compatibility conflicts by preference.

## 3. Current status

| Phase | Status | Entry condition | Exit evidence |
| --- | --- | --- | --- |
| 0. Repository and deployment truth | Complete | Existing V23.4 claims disputed | Exact shared SHA, clean lineage, passing baseline gate |
| 1. Deterministic baseline | Active | Phase 0 complete | Fixed fixtures and visual, accessibility, route, print, and bundle evidence |
| 2. V23.5 trust hotfixes | Implemented in the working tree; not partitioned or accepted | Phase 0 complete; Phase 1 evidence captured for touched routes | Four independently revertible PRs and hotfix gate |
| 3. V23.5 legibility | Implemented in the working tree; automated checkpoint passes; human review pending | Hotfix behavior stable | IA, result hierarchy, Method, design, and runtime-copy gates |
| 4. Human evidence and release | Blocked on participant work | V23.5 preview passes automated and manual gates | Two-wave evidence record and production smoke |
| 5. V24 AI research and additive v4 | Blocked by Phase 4 | V23.5 evidence gate complete | Construct decision, pretesting, compatibility proof, v4 release decision |
| 6. V25 Economic Statecraft | Blocked by Phase 5 | AI v4 process proven | Full authoring, pilot, compatibility, and release cycle |
| 7. V26 Energy Transition | Research only | Economic Statecraft release cycle complete | Separate owner authorization |

Code may move from Phase 1 to a small Phase 2 patch when its baseline evidence is already captured. No Phase 3 visual change may overwrite the untaken baseline for its route.

The uncommitted candidate passed typecheck, validation, strict copy audit, lint,
594 unit tests, 84 Chromium tests, evidence freshness, the runtime-copy
structural inventory, a tokenless production build, and the ordinary production
build on 2026-08-24. This is an automated checkpoint, not release acceptance.
Phase 1 remains active, the runtime-copy ledger remains pending, and the
working tree must be divided into the four independently revertible hotfix PRs
and separate legibility and documentation changes before integration.

## 4. Non-negotiable release boundaries

- V23.5 changes no scorer, item bank, result payload, or share-link format.
- No new dependency is authorized for V23.5.
- Existing Foundation, module, AI, Perspective, Profile, and share links remain readable.
- Tier 1 cohort aggregation remains implemented, tested, disabled, and absent from public UI.
- No public percentile, prevalence, rarity, or population-ranking claim is authorized.
- Current AI bank v3 remains immutable. Future AI work uses an additive v4 tuple.
- No raw paired answers are persisted, placed in URLs, sent to analytics, shown in Profile, or shared.
- No participant-level notes enter Git.
- Simplified Chinese content fails closed when an approved localization does not exist.
- No light theme is added.
- The Astrolabe identity is improved, not replaced.

## 5. Phase 0: repository and deployment truth

### Completed evidence

- Local `main`, `origin/main`, and production were reconciled to `a80fe4d02d818ae546672d15f64aa596a25b1ceb`.
- The accepted merge has parents `a76f97da302c12375c93672ad6076ef79fa8d830` and `708713a57c3a7b1dd86bd84636920780875a2db8`.
- The merge tree and V23.4 branch tree both resolve to `cd8f330bca536710a577092fbe91a2a591a45660`.
- Vercel deployment `dpl_GQDHf5DJKEgcXWwfHsyovHnZKvBa` records the same commit.
- Typecheck, validation, strict copy audit, lint, all 573 tests, and build passed.

### Continuing rule

Every release and task dispatch prints current local, upstream, dirty, and deployment state. `STATE.md` is memory, not authority.

## 6. Phase 1: deterministic whole-product baseline

Owner: release operator
Reviewers: independent verifier and owner

Capture fixed evidence before visual changes:

- screenshots at 390, 768, and 1440 pixels;
- 320-pixel checks for critical mobile controls and overflow;
- English critical routes and representative Simplified Chinese routes;
- valid and invalid Foundation results;
- AI v3 result;
- empty and populated Profile;
- Current Case active and inactive states with injected dates;
- Security and Technology Standard and Advanced flows;
- share cards and Open Graph output;
- accessibility tree and full keyboard path;
- homepage bundle behavior with and without a Mapbox token;
- runtime-composed narrative fixture;
- current gate duration and entry-route bundle sizes;
- print output for printable results and evidence surfaces.

Use frozen dates and stable payloads. No baseline may depend on the live Current Case clock or a mutable production record.

### Phase 1 gate

- Every critical route has a reproducible fixture or a documented exclusion.
- A dynamic-route chunk failure is reproduced and fixed, or shown to be a stale local build artifact.
- Evidence distinguishes manual snapshots from CI assertions.
- No screenshot is called regression coverage unless CI compares it.

## 7. Phase 2: V23.5 trust hotfixes

Implement four sequential, independently revertible PRs.

### PR 1: Current Case and public-route integrity

Owner: isolated builder
Review: independent verifier

- Derive homepage menu state from the reviewed Current Case catalog.
- When a reviewed case is active, Current Case may lead.
- When none is active, Foundation becomes the recommended first path.
- In the inactive state, label the destination **Recent Cases** and place it in exploration.
- Never promise that the visitor can assess a current case when none is active.
- Derive homepage Current Case availability on every request, which is stricter than the hourly freshness requirement.
- Keep `/current` redirect behavior consistent with the homepage state.
- In production, guard `/learn` and `/world-stage-prototype` with `notFound()` and `noindex`. Retain them for development.
- Align feedback-page scope with every invitation to report an issue.

### PR 2: protect user work

Owner: isolated builder
Review: independent verifier

- Confirm Foundation or AI reset when answers exist.
- Reset immediately when no answers exist.
- Key Security and Technology drafts by module, instrument version, locale, and mode.
- Store position separately from answers.
- Switching Standard and Advanced restores each mode's draft.
- Explicit reset clears only the active draft after confirmation.
- Preserve result, scoring, and payload behavior.

### PR 3: Focus Area flow

Owner: isolated builder
Review: independent verifier and owner visual review

- Render one question unit at a time.
- Provide Back, Next, compact progress, and final review.
- Keep selection reversible.
- Do not auto-advance after selection.
- Restore position and answers after reload.
- Preserve the existing bank order when constructing scorer input.
- Do not edit frozen banks, checksums, payloads, or interpretation.

### PR 4: accessibility and responsive defects

Owner: isolated builder
Review: accessibility verifier and owner visual review

- Raise normal secondary-text contrast to at least 4.5:1.
- Ensure the Atlas has exactly one `main` landmark.
- Place the homepage map ledger after the introduction and primary choices under **Map details and sources**.
- Combine locale and motion controls into one compact responsive group.
- Give primary mobile controls at least a 44px target.
- Remove the tall stacked mobile questionnaire header while preserving essential progress and exit controls.
- Preserve reduced-motion behavior and non-map alternatives.
- Correct English and Chinese focused-chrome parity where both locales support the task.

### Phase 2 stop conditions

Stop the affected PR on any of these findings:

- a scorer, bank, payload, share-link, checksum, or legacy replay change;
- a dependency addition;
- overlapping changes from another write lane;
- an unsupported locale silently falls back to English;
- the production route cannot be tied to reviewed source;
- a baseline or acceptance fixture is missing for changed behavior.

### Phase 2 gate

- No destructive action occurs without confirmation when work exists.
- No active draft is lost in a mode switch or reload.
- No Current Case promise resolves to an empty-current page.
- Exactly one main landmark exists.
- Mobile controls do not overlap at 320 or 390 pixels.
- Normal explanatory text passes AA contrast.
- Critical mobile routes have no horizontal overflow.
- Legacy links reproduce existing results.

## 8. Phase 3: V23.5 legibility and anti-slop release

Estimated owner effort: 20 to 30 hours, excluding participant scheduling.

### Information architecture

- Make Foundation the stable first-time path.
- Divide homepage choices into **Start here** and **Continue exploring**.
- Keep no more than three peers in the first group.
- Use one browse taxonomy across desktop navigation, mobile navigation, and Explore.
- Use the same public names for Perspectives, Focus Areas, AI Governance, Cases, Atlas, Futures, and reference material.
- Replace query-parameter assumptions on `/modules` with saved Foundation state when available.

### Result and Profile hierarchy

- Preserve the payoff-first result hero.
- Translate internal states such as `separate-domain-read` into reader language.
- State each invariant once. Move detailed policy explanation to Method or a contextual disclosure.
- Define or remove first-contact codes such as `P+`, `Kairos`, and version labels.
- Keep named families as authored summaries, not natural kinds.

### Method and Explore

Reorganize Method into four chapters with anchored contents:

1. What the result means
2. How answers become a profile
3. Evidence and versioning
4. Limits, privacy, and corrections

Retain substantive methodology. Reduce repetitive panel treatment. Optimize for reference lookup while preserving a readable top-to-bottom sequence.

Prototype one improved Explore page. Test it before applying the pattern to all Explore pages.

### Astrolabe visual work

- Preserve Newsreader, Archivo, Space Mono, navy and brass, editorial asymmetry, maps, and restrained motion.
- Follow `DESIGN.md`.
- Improve muted contrast, mobile chrome, card repetition, and accent-border semantics.
- Treat side-border and transition detectors as review signals, not automatic failures.

### Runtime copy system

1. Render every known Foundation, module, AI, Profile, share, Open Graph, and supported-locale combination as the reader receives it.
2. Give every public block one declared job: payoff, mechanism, definition, instruction, limitation, evidence, or tradeoff.
3. Route a block for review when no job can be named, adjacent blocks duplicate a job, the instrument is the grammatical subject without need, composition creates repetition, or defensive negation carries the paragraph.
4. Enforce deterministic rules: no authored English em dash, no Constitution filler phrase, complete frozen-bank patterns, and explicit exemptions for Chinese typography, quotations, proper names, and machine separators.
5. Keep nominalization, hedge, sentence-variance, triad, and n-gram counts advisory.
6. Cheap models may classify and route. They may not rewrite, delete, or approve public copy.
7. Keep approved product examples and owner edits in a private corpus tagged by surface. Never use client material.

Record human dispositions in the [V23.5 Runtime Copy Review Ledger](../editorial/V23_5_RUNTIME_COPY_REVIEW_LEDGER.md). Its current `pending` state is a human-only release blocker, so Phase 3 remains active and unaccepted.

### Phase 3 gate

- Runtime fixtures cover all known combinators.
- Strict deterministic copy rules pass.
- Advisory warnings are summarized and reviewed, not treated as automatic failure.
- The runtime-copy ledger is bound to the candidate SHA, and every live row is accepted by a named human reviewer.
- No unreviewed runtime paragraph reaches production.
- Screenshot review confirms that Astrolabe remains recognizable.
- Method, Profile, homepage, and module navigation work without internal schema vocabulary.

## 9. Phase 4: human evidence and V23.5 release

Use `docs/research/V22_5_COGNITIVE_INTERVIEW_PACK.md`. Do not create a competing protocol.

### Wave 0 smoke walkthroughs

Run 3 to 5 sessions covering:

- first path and navigation;
- destructive-control expectations;
- result comprehension;
- options that appear smart, moderate, safe, or decent;
- knowledge burden and unfamiliar terms;
- Current Case expectations;
- mobile endurance.

### Wave 1 moderated sessions

Run 6 to 8 sessions across Foundation, AI v3, selected Technology and Security items, result hierarchy, separate-domain explanation, Current Case expectations, and mobile endurance. Include at least one Simplified Chinese session. Do not claim locale equivalence.

### Wave 2 revision and retest

Run 6 to 8 new sessions on consequentially changed items and flows. Preserve build, item, locale, and issue provenance.

### Research stop conditions

- one privacy, accessibility, broken-route, or materially misleading interpretation issue;
- two independent reports of the same consequential comprehension, valence, or knowledge-load problem;
- repeated interpretation of an authored summary as scientific classification;
- repeated belief that a module score changes the Foundation result.

Participant-level notes stay in restricted local storage. Git contains aggregated issue IDs, severity, decisions, and retest outcomes only.

### V23.5 release gate

- No critical issue is open.
- Every major issue is fixed and retested or deferred with owner rationale.
- Automated, compatibility, accessibility, visual, print, and performance checks pass.
- Preview receives manual owner review.
- Production smoke verifies the deployed SHA and representative routes.

## 10. Phase 5: V24 AI Governance research and additive v4

V24 begins only after the V23.5 evidence gate.

### Construct audit

For every current and proposed item, record:

- stable construct;
- policy mechanism or decision;
- setting and jurisdiction;
- knowledge prerequisite;
- social-desirability and respectable-middle risk;
- ownership by Foundation, Security, Technology, or AI;
- source snapshot and expiry;
- expected relation to neighboring axes.

Build the ownership matrix before proposing a bank. AI does not own every item that mentions AI.

An axis needs at least three independent Standard items, four Advanced items, two settings and item forms, no dominant jurisdiction above roughly one-third of its evidence, no repeated attractive-middle or high-knowledge-load defect, and a stated distinction from neighboring axes.

Recruit 3 to 5 external reviewers spanning AI governance, comparative or non-US regulation, IR or security, and measurement or cognitive interviewing.

### Paired-reflection research prototype

The prototype stays behind a disabled research flag and `noindex`.

- Bind 4 to 6 pairs to exact Foundation and AI bank, item, copy, and locale versions.
- Record an authored reason for each juxtaposition, limitations, and reviewer status.
- Re-ask both questions and reveal both choices only after completion.
- Keep answers in component memory only and discard them on navigation or refresh.
- Exclude answers from storage, URLs, analytics, Profile, sharing, and Open Graph.
- Show no match, mismatch, rate, consistency, inferred logic, or moral evaluation.
- Fail closed on a missing or mismatched version.
- Counterbalance Foundation-first and AI-first order in the pilot.

### Additive AI v4

Expected tuple: bank v4, scorer v3, payload v3, plus an authored manifest and release decision. A methodology ADR must approve any deviation before coding.

- Preserve v2/scorer1 and v3/scorer2 replay exactly.
- Preserve old links, snapshots, checksums, and ProfileStore records.
- Never render v3 results with v4 copy.
- Freeze factual scenario context to bank version.
- Keep Current Case material editorial and unscored.
- Ship English only until Chinese is independently authored and tested.
- Fail closed for unsupported locale or tuple.
- Use synthetic diagnostics only to test scorer behavior.

### V24 release gate

- Construct review succeeds.
- Items pass pretesting and retesting.
- No ownership conflict remains.
- Old results reproduce exactly.
- Users do not read paired reflection as a consistency test.
- No cohort or prevalence claim appears.

## 11. Phase 6: V25 Economic Statecraft

Economic Statecraft is the first new module only after V24 proves the process.

Before implementation, require:

- an ownership matrix against Foundation, Security, Technology, and AI;
- a construct decision;
- a source pack;
- item-valence and knowledge-load review;
- cognitive interviews;
- Standard and Advanced coverage;
- an authored locale policy;
- an immutable tuple and release decision.

Do not build its scored bank in parallel with unresolved AI v4 construct work.

## 12. Phase 7: V26 Energy Transition

Energy remains research-only until Economic Statecraft completes one full authoring, pilot, compatibility, and release cycle.

Before language implying stable traits, run a response-stability study of about 30 users on the same frozen tuple, repeated after 2 to 3 weeks. A convenience sample supports bounded observations about response stability. It does not establish population norms.

## 13. Ownership model

| Decision or task | Accountable owner | Worker | Required reviewer |
| --- | --- | --- | --- |
| Product direction, scope, release gate | Jinhua | Frontier model may advise | Jinhua |
| Methodology, construct, scoring, claims | Jinhua | Research or methodology specialist | External reviewer where required |
| Public copy and design authority | Jinhua | Strong model may draft within contract | Jinhua |
| Bounded implementation | Jinhua | Isolated builder | Independent verifier |
| Mechanical evidence collection | Release operator | Read-only scout | Builder or owner |
| Deployment and rollback | Jinhua | Release operator | Independent verifier |
| Human research | Jinhua or named research lead | Moderator and note-taker | Research lead |

No model has autonomous merge, deployment, participant recruitment, or methodology authority.

## 14. Supersession table

| Prior material | Status | Current treatment |
| --- | --- | --- |
| Dated Claude package in `docs/archive/2026-08-21-claude-v24-review/` | Historical, superseded, non-executable | Preserved with a per-file warning and archive README |
| Archived `V24_CODEX_5DAY_SPRINT_PROMPT_PACK_20260821.md` | Do not execute | Replaced by the V23.5 prompt pack |
| Archived `V24_AI_MODULE_REARCHITECTURE_20260821.md` | Research input only | Replaced by the AI v4 construct audit and evidence gates |
| Archived `V24_TRIAL_AND_GTM_PLAN_20260821.md` | Superseded | Use the amended V22.5 cognitive-interview pack |
| Archived `V24_ANTI_SLOP_SYSTEM_20260821.md` | Superseded | Use runtime fixtures, declared block jobs, deterministic rules, and advisory routing |
| Archived Claude agent definitions | Do not install | Private studio begins with scout, builder, and reviewer only |
| Previous `STATE.md` | Replaced | Current file is memory only and requires fresh verification |
| V23 contracts and release decisions | Historical compatibility authority | Retain where they define issued tuples, IDs, and replay behavior |

## 15. Change control

Each completed phase updates its status, evidence links, open risks, and exact accepted SHA. A later plan cannot silently change a locked decision. It must identify the old decision, new evidence, owner approval, affected releases, and migration or rollback effect.
