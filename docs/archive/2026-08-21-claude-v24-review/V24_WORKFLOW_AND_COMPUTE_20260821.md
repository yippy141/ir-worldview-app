> **HISTORICAL, SUPERSEDED, NON-EXECUTABLE.** Preserved only for provenance. Verify every claim against the current roadmap, Git state, and runtime before reuse.

# Workflow and Compute Budget

> **HISTORICAL, SUPERSEDED, NON-EXECUTABLE.** Use the private studio policy and current operator runbook.

**Date:** 21 August 2026
**Questions asked:** should cheap models do the labour while Claude and ChatGPT do product management and red-teaming? How would that work? And how do I stop burning 25% of a weekly ChatGPT allowance in one day and 50% of a Claude window on one prompt?

**Short answers.** Yes, it is a good idea, and it works better in this repo than in most because your test gate is unusually strong. But it is not your biggest problem. Your biggest problem is that you are paying frontier prices to re-read the same context, and fixing that is free and takes an afternoon. Do that first. Add the cheap tier next week, after the Codex sprint, when you have time to learn a tool without a deadline attached.

---

## 1. Where the money actually goes

Three leaks, roughly in order of size.

### 1.1 Context re-establishment

The files attached at the start of this session came to about 370KB. That is roughly 90,000 tokens before a single word of work. If you open five conversations a week and seed each one that way, you spend close to half a million tokens per week on re-reading documents you have already read.

This is almost certainly the largest line item in your burn, and it is the easiest to remove.

### 1.2 Pasting code into chat for review

A chat model cannot open a file. So reviewing code in chat means pasting it, and pasting a 54KB helper file costs about 14,000 tokens each time you want an opinion on it. Doing that four times in a conversation is 56,000 tokens spent on transport.

Claude Code and Codex read from disk selectively. A code review belongs there.

### 1.3 Agentic runs that read broadly

"Look at the repo and tell me what's wrong" is an expensive instruction. The agent reads dozens of files, most of which are not relevant, and you pay for all of them. Naming the files cuts it by an order of magnitude and usually produces a better answer, because the agent is not diluting its attention.

---

## 2. Fix the burn first

Four changes. None of them require a new tool.

### 2.1 Write `docs/STATE.md` and make it the only thing you paste

One page. Always current. It is the compression of everything else.

```markdown
# STATE — 21 Aug 2026

## Where things are
Version: V23.4 merged. Security bank v5, Technology v3, both public-beta.
Branch: main. Next branch: v23-5-legibility.
Live: irworldview.jhyip.com

## In flight
- Codex visual sprint, prompts V-0 to V-6. See docs/v24/V24_CODEX_5DAY_SPRINT_PROMPT_PACK.
- Round 0 informal testing, 3 people, this week.

## Open decisions
1. Whether the AI module gets bank v3 in V24 or V25.
2. Whether the style corpus lives in the repo or stays gitignored.
3. Whether mapbox-gl can be removed.

## Locked. Do not reopen without a written reason.
- Eight archetypes through V25. No ninth.
- No master score. No score fusion. No public bridges in schema v1.
- Foundation archetype is the canonical identity. Decision Patterns are never assigned.
- Tier 1 stays off.
- No ordinal percentiles. There is no respondent population.

## Known defects, ranked
See docs/v24/V24_PRODUCT_EVALUATION_MULTI_PERSPECTIVE §10.

## Where the detail lives
docs/v24/ — evaluation, AI rearchitecture, design brief, prompt packs, trial plan
docs/v23/ — V23 contracts and security records
AGENTS.md — repo conventions for coding agents
IR_EDITORIAL_STYLE_GUIDE.md — voice
```

Rules for it: never longer than two screens; updated at the end of every work session, which takes ninety seconds; pointers to detail, never the detail itself.

This one file should cut your per-conversation seed cost by 80% or more.

### 2.2 Separate the tools by what they are for, and hold the line

| Tool | Does | Never does |
|---|---|---|
| Chat (ChatGPT, Claude web, this session) | Strategy, red-teaming, methodology, writing prompt packs and docs, deciding | Reads code directly. Receives pasted files. |
| Claude Code / Codex in the repo | Everything that touches files. Code review. Implementation. | Decides what to build. Writes public copy without the style contract. |
| Cheap tier, once set up | Specified mechanical work at volume | Makes any judgment call |

The failure mode you have now is doing the same work in two places: reasoning about the code in chat, then reasoning about it again in Codex. Pick one per task.

When you need chat to think about code, have Codex or Claude Code produce a summary first and bring the summary. A 400-word summary costs 500 tokens. The file costs 14,000.

### 2.3 Batch the red-teaming

One review pass per subrelease, at a checkpoint, on the whole diff. Not per prompt. Your existing checkpoint structure already does this correctly and the discipline is the hard part.

### 2.4 Stop asking for open-ended repo reads

Replace "look at the codebase and tell me X" with "read these six files and tell me X." You will get a better answer for a tenth of the cost. If you do not know which six, ask the cheap tier to find them, which is exactly what it is for.

---

## 3. The tiering

Three kinds of work. The whole system rests on assigning each task correctly.

### Tier A — judgment. Frontier models. Expensive and worth it.

What to build and why. Red-teaming. Methodology. Item authoring. Public copy. Design decisions. Writing the specs the other tiers execute. Anything touching payload, scoring, calibration, or bridge contracts.

The defining property: **a wrong answer here is expensive and hard to detect.** A subtly bad question item survives into a bank and gets calibrated around.

### Tier B — specified implementation. Cheap models.

Applying a decided change across files. Extraction and migration. Adding tests for existing behaviour. Renaming. Mechanical refactors. Running a pass over a corpus.

The defining property: **the spec names the files, names the pattern, and a test asserts the outcome.** A wrong answer fails a test.

### Tier C — verification and reconnaissance. Cheap models.

Running gates and summarising failures. Producing diffs. Answering "which files touch X." Reading a large file and returning a structured summary for Tier A.

The defining property: **output is checkable in seconds.**

### The rule that keeps this safe

**A cheap model never makes a decision.** If a task requires a judgment call, the model stops and reports rather than choosing. Put that sentence in every Tier B prompt. It is the entire boundary.

---

## 4. Which cheap model, and how to run it

### 4.1 The landscape as of August 2026

Approximate published API rates per million tokens, input / output. Verify at the provider before committing, since these move monthly.

| Model | Price in / out | SWE-bench Verified | Notes |
|---|---|---|---|
| DeepSeek V4-Flash | $0.14 / $0.28 | ~79% | 1M context. Cheapest capable option. |
| Qwen3-Coder-Next | $0.11 / $0.80 | ~71% | 3B active of 80B. Runs locally on 46GB. |
| Qwen 3.6 Flash | $0.19 / $1.13 | — | Middle ground. |
| MiniMax M3 | $0.30 / $1.20 | — | 1M context. |
| DeepSeek V4 Pro | $0.44 / $0.87 | ~81% | The step up when Flash struggles. |
| Kimi K2.7 Code | $0.95 / $4.00 | — | Best tool-use scores in the cheap tier. |
| GLM-5.2 | ~$1.10–1.40 / ~$4.10–4.40 | — | MIT licensed, but token-hungry, which erodes the price advantage. |
| Kimi K3 | $3.00 / $15.00 | ~93% | No longer cheap tier. |
| Claude Opus 4.8 | $5.00 / $25.00 | — | For comparison. |
| GPT-5.5 | $5.00 / $30.00 | — | For comparison. |

DeepSeek V4-Flash output is roughly ninety times cheaper than Opus output. That is the number that makes the case.

### 4.2 What I would pick

**DeepSeek V4-Flash for bulk Tier B and all of Tier C.** Cheapest, one-million context so it can hold your large TypeScript files, and 79% on SWE-bench Verified is far more capability than specified mechanical work requires. The gap between 79% and 93% shows up on ambiguous tasks, and Tier B tasks are not ambiguous by definition.

**Kimi K2.7 Code when the task is a multi-step agent loop** with tool calls, file edits, and test runs in sequence. It scores highest on tool-use benchmarks in this price band and it is worth seven times Flash for that specific shape.

**Skip GLM-5.2 and Kimi K3.** GLM's token appetite eats its price advantage. K3 at $3/$15 is not the cheap tier, and if you are paying that you may as well use what you already subscribe to.

### 4.3 How to run it

**Cline in VS Code, with an OpenRouter API key.**

Why this specific combination, for someone who has not done this before:

- You already work in VS Code, so there is no new environment.
- OpenRouter means one key and one bill reaches DeepSeek, Kimi, Qwen, and everything else. You can switch models from a dropdown instead of signing up four times.
- **Cline shows you a diff before it applies any edit.** That is the property that matters most with a weaker model. You approve or reject each change.
- It runs terminal commands, so it can execute your gate itself and iterate against the failures.
- Pay per token, no subscription, so an idle week costs nothing.

Roo Code is a fork of Cline with more configuration. Start with Cline. If you outgrow it you will know why.

Direct provider keys are a few percent cheaper than OpenRouter. Not worth the extra accounts until you are spending real money.

### 4.4 Setup, roughly thirty minutes

1. Create an OpenRouter account. Load $10. That is enough for a month of the work described here.
2. Install the Cline extension in VS Code.
3. In Cline settings: provider OpenRouter, paste the key, model `deepseek/deepseek-v4-flash`.
4. Open the repo. Give it a trivial first task, something like "read `package.json` and list every npm script with a one-line description of what it does." Confirm it reads, reasons, and does not edit.
5. Then give it a real Tier B task from §5, with the handoff contract.

### 4.5 What this actually costs

Rough estimates for the work in front of you:

| Task | Tokens in / out | V4-Flash | Opus equivalent |
|---|---|---|---|
| V-0 content extraction | ~500k / 200k | ~$0.13 | ~$7.50 |
| Claim-extraction pass over all copy | ~400k / 50k | ~$0.07 | ~$3.25 |
| Frozen-bank JSON migration | ~600k / 250k | ~$0.16 | ~$9.25 |
| Test coverage for existing behaviour | ~800k / 400k | ~$0.23 | ~$14.00 |
| **All Tier B work through V25** | | **$5–20** | **$300–800** |

Your entire cheap tier for a quarter costs less than one month of ChatGPT Pro. That is the case, and it is a strong one.

The caveat worth naming: none of this saves you time on Tier A, which is where your actual bottleneck is. It removes the mechanical work from your frontier budget so the frontier budget goes to thinking.

---

## 5. The handoff contract

Every Tier B task uses this. Save it as `docs/CHEAP_TIER_TASK_TEMPLATE.md` and fill it in.

```markdown
# TASK: <one line>

## Goal
<One paragraph. What is true when this is done.>

## You may modify only these paths
- path/one.ts
- path/two.json

## You may not modify anything else
Specifically forbidden. Stop and report if the task appears to require touching:
- lib/scoring/**
- lib/share.ts, lib/profile-share.ts
- any *.bank.json, any *_BANK_VERSION constant
- lib/modules/manifests.ts, lib/modules/release-decisions.ts
- package.json dependencies

## The pattern, with one worked example
<Show exactly one instance done correctly. Input, output, and why.>

## The test that must pass
<Path to a test that already exists, written before this task started.>
Run it with: npm run test

## Constraints
- Do not create files not listed above. If you need one, stop and ask.
- Do not install anything.
- If your diff exceeds 400 lines, stop and report what remains.
- **If any step requires a judgment call, stop and ask. Do not choose.**

## Before you start
Print `git status --short` and confirm the tree is clean.
List every file you intend to modify and wait for confirmation.

## When you finish
Run the full gate:
    npm run typecheck && npm run lint && npm run test && npm run build
Report: files changed, the gate table, anything you were unsure about.
```

### 5.1 The two lines that do most of the work

**"If any step requires a judgment call, stop and ask."** Weak models fail by guessing plausibly. The guess compiles, the test passes, and the wrong decision is now in the codebase. This sentence converts the failure mode from silent to loud.

**"Write the test first."** In Tier A. Before the cheap model runs. If you cannot write a test that asserts the outcome, the task is not Tier B and you should not delegate it.

### 5.2 What is Tier B in your actual backlog

Ready to delegate as soon as the tier exists:

- V-0 content extraction from TypeScript into `content/copy/` (byte-identical output is the test, which makes this the ideal first task)
- the frozen-bank migration from duplicated source files into `content/frozen/*.json`
- token replacement across `globals.css` after the token set is decided in Tier A
- the claim-extraction pass over all public copy
- generalising `validate:security-v4` and `validate:security-v5` into `validate:module -- <slug>`
- moving `phase*-docs/` into `docs/history/`
- adding test coverage for existing untested behaviour
- the `copy:score` measures from the anti-slop document, since the fixture set is the test

Never delegate, at any price:

- public copy of any kind
- item authoring or option text
- design decisions
- anything touching payload encoding, scoring, calibration, manifests, or bridge policy
- the Transfer Test pairs
- release decisions

---

## 6. What your workflow should look like

### 6.1 The loop

```
Chat (Tier A)          →  decide, red-team, write the spec
        ↓
docs/ (the compression) →  the spec is a file, not a conversation
        ↓
Codex / Claude Code    →  Tier A implementation: anything with judgment in it
Cline + DeepSeek       →  Tier B implementation: anything fully specified
        ↓
The gate               →  typecheck, validate, audit, lint, test, build, e2e
        ↓
Chat (Tier A)          →  one review per subrelease, at a checkpoint
```

The docs layer is the part people skip and it is what makes the rest cheap. A written spec is read once by each tool. A conversation is re-established every time.

### 6.2 A realistic week

**Monday morning, chat, 45 minutes.** Read `STATE.md`, decide what this week is, write or revise the prompts. Output is files.

**Monday to Thursday, in the repo.** Codex on the judgment work. Cline on the mechanical work, running in parallel in a second VS Code window. You are reviewing diffs, not writing code.

**Thursday, chat, 30 minutes.** One red-team pass on the accumulated diff. One checkpoint return.

**Friday, 15 minutes.** Update `STATE.md`. Add anything you wrote and liked to the style corpus. Run `copy:score`, fix the worst file.

That shape gives you roughly two frontier-heavy sessions a week instead of daily context rebuilding, which should bring the burn well inside your allowances.

---

## 7. Honest assessment of the risks

**The cheap tier produces plausible wrong code.** Weaker models fail confidently. Your gate catches type errors, lint errors, test failures, and build failures. It does not catch a semantically wrong but well-formed change. Mitigation: the file allowlist, the diff cap, the stop-and-ask rule, and reading every diff Cline shows you. If you find yourself approving diffs without reading them, the tier has stopped being safe.

**Setup time is real.** Thirty to forty-five minutes for the first task, plus a learning curve on how much specification is enough. Expect the first two tasks to take longer than doing them yourself. The third will not.

**Three tools is more surface area.** More configuration, more places for a key to leak, more ways to get confused about which model did what. Mitigate with commit hygiene: note in the commit message which tier produced the change.

**The temptation to delegate upward.** The moment the cheap tier works well on extraction, you will be tempted to give it a copy task. Do not. That is exactly how the slop comes back, and it will come back in a register that is harder to detect because it will be a different model's median instead of the one you have learned to spot.

---

## 8. What to do this week

1. **Write `STATE.md` today.** Ninety minutes, and it is the largest single saving available.
2. **Run the Codex sprint** as scheduled. The credit expires; use it.
3. **Spend 45 minutes collecting the style corpus** from your old papers. Details in the anti-slop document, §3.
4. **Do not set up the cheap tier yet.** Learning a new tool during a five-day sprint with an expiring credit is a bad trade.

Next week, after the sprint lands:

5. **Set up OpenRouter and Cline.** Give it the V-0 leftovers as its first real task.
6. **Build the copy measures** from the anti-slop document, §8. It is well-specified with a fixture test, which makes it a good second Tier B task.
7. **Run the claim-extraction pass.** Expect to delete more than you rewrite.
