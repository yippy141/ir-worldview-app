> **HISTORICAL, SUPERSEDED, NON-EXECUTABLE.** Preserved only for provenance. Verify every claim against the current roadmap, Git state, and runtime before reuse.

# V24 Review Set: historical index

> **SUPERSEDED AND NON-EXECUTABLE AS OF 2026-08-24.** Preserve this package for provenance only. Do not run its prompts or agents. Read `ARCHIVE_NOTICE.md` and use `docs/roadmap/V23_5_V26_MASTER_ROADMAP.md` for current authority.

**Prepared:** 21 August 2026
**Baseline:** V23.4 as merged (Security v5, Technology v3, both `public-beta`, `bridges: []`)
**Reviewed:** repo at `ir-worldview-app-clean`, live site at irworldview.jhyip.com, the Claude Design sigil artifact, and `scripts/audit-public-copy.mjs`.

Eight files. Read in this order.

| # | File | What it is | Read if |
|---|---|---|---|
| 0 | `STATE.md` | One page. Drop it at the repo root. The only file you paste into a fresh chat. | Do this first. It is the largest single saving on your compute burn. |
| 1 | `V24_PRODUCT_EVALUATION_MULTI_PERSPECTIVE_20260821.md` | The critique, from nine roles. Ranked defect list at §10, recommended sequence at §11. | The main read. |
| 2 | `V24_AI_MODULE_REARCHITECTURE_20260821.md` | How the AI Compass should relate to the Foundation. §4 is the Transfer Test. | The idea most worth your time. |
| 3 | `V24_EXPERIENCE_REDESIGN_BRIEF_20260821.md` | Sigil motion, result scrollytelling, Explore rebuild, cards, share cards. | Before the Codex sprint. |
| 4 | `V24_CODEX_5DAY_SPRINT_PROMPT_PACK_20260821.md` | Seven paste-ready Codex prompts, gated, in order. | Start today. Credit expires ~26 Aug. |
| 5 | `V24_ANTI_SLOP_SYSTEM_20260821.md` | Why the sweeps keep failing, ten measurable slop detectors, the style corpus, and a build prompt for the linter. | You asked why it keeps coming back. §1 is the answer. |
| 6 | `V24_WORKFLOW_AND_COMPUTE_20260821.md` | Where the compute actually goes, the three-tier model, which cheap model and how to run it, the handoff contract. | Before you set up anything new. |
| 7 | `V24_RESEARCH_AND_DESIGN_PROMPT_PACK_20260821.md` | Seven Deep Research prompts, five Claude Design prompts. | Run in parallel with the sprint. |
| 8 | `V24_TRIAL_AND_GTM_PLAN_20260821.md` | Round 0 this week, full trial after V25, plus social, revenue, and a 90-day plan. | §2.3 is a text message you can send today. |

---

## The five findings that matter

**1. The percentile display is not defensible, and the design artifact will propagate it.** Both manifests declare `calibration.status: "synthetic-diagnostic"`. There are no respondents. The result page renders "88th," "61st," "44th," and the Claude Design share card adds "6% of respondents share this reading." That sentence cannot be qualified into truth. Codex prompt V-2 removes it.

**2. The AI module is an orphan, and it is the surface that matters most for where you are going.** Six AI archetypes that duplicate four Foundation lenses without deriving from them. Eight axes written before the 2026 landscape. A deprecated synthesis. A landing page that invites a comparison the result page then declines. The fix that is legal under schema v1 and costs almost nothing is the Transfer Test: paired items, juxtaposition only, no arithmetic.

**3. The rigor budget has outgrown the attention budget.** The governance layer is rare and it is the moat. It is also protecting content almost nobody has read, behind six equal front doors, on Explore pages that lose to Wikipedia. V24 and V25 as scoped add two more instruments to that. One legibility release first.

**4. The slop keeps coming back because the blocklist is trained on the last sweep.** Every phrase rule in your audit was found by a previous sweep, and the supply of substitutes is unlimited. Slop is a property of information density, sentence-length variance, and hedge rate, not of vocabulary. Ten measurable detectors in doc 5, plus the one thing that actually fixes it: a corpus of your own writing that the generation prompts imitate.

**5. Your compute burn is a context problem, not a model problem.** The files seeded at the start of this session were about 90,000 tokens before any work happened. `STATE.md` removes most of that. The cheap-model tier is a good idea and it is worth roughly $5 to $20 for all the mechanical work through V25, but set it up next week, not during a sprint with an expiring credit.

---

## What I would push back on

Powering through V24 and V25 before the full trial is defensible. The bounded risk is a systematic **item-design** problem replicating into two more banks. The hedge costs one text message: ask the three informal testers whether any answer looked like the obviously decent one, and whether they ever guessed because they did not know enough. Both questions are in doc 8, §2.3.
