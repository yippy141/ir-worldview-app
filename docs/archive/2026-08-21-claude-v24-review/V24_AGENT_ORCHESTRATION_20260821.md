> **HISTORICAL, SUPERSEDED, NON-EXECUTABLE.** Preserved only for provenance. Verify every claim against the current roadmap, Git state, and runtime before reuse.

# Agent Orchestration: what to copy from Daisy's setup and what to ignore

> **HISTORICAL, SUPERSEDED, NON-EXECUTABLE.** Preserve for provenance. Do not install or dispatch the agents described here. See `ARCHIVE_NOTICE.md`.

**Date:** 21 August 2026
**Question:** an Anthropic engineer runs two lead agents, per-project tech leads, and 5–10 IC agents across 8–10 projects, at 30–50 prompts a day, with ICs working autonomously for 2–3 days. Should you build that? Can the ICs be cheap open-weight models?

---

## 1. Decode what she is actually describing

Before deciding whether to copy it, be precise about what it is.

**She is an engineer on Claude Code.** She is dogfooding the multi-agent system as part of her job. Failure modes that would cost you a day cost her a bug report she was going to file anyway. Her tooling, her rate limits, and her tolerance for breakage are all different from yours.

**Eight to ten projects is what justifies the leads.** A lead agent exists to route work and hold state across things you cannot hold in your head at once. With one product, a lead agent is a manager with nothing to manage. You would be paying a coordination tax on a problem you do not have.

**Thirty to fifty prompts a day is a lot of human involvement.** That is not a passive system. Read her split again: 60% with leads, 35% with project leads, 5% firefighting. She is in the loop constantly. The autonomy is in the execution, not the direction.

**"Two leads that restart each other" is a reliability pattern, not a productivity one.** It exists because long-running agent fleets die. If you have no long-running fleet, you have nothing to restart.

**"ICs work autonomously for 2–3 days" requires decomposable, independently verifiable work.** Large chunks, clear interfaces, strong tests. That describes a mature codebase with a stable architecture and a big backlog of well-understood tasks.

---

## 2. Do you need this? No, and the reason is the interesting part

Your bottleneck is not throughput on specified work. If it were, more agents would fix it.

Your three actual constraints:

**Specification is the work.** The hardest things in your repo are judgment constraints, not implementation ones. No score fusion. Frozen replay must stay byte-exact. No public bridges under schema v1. The Foundation archetype is canonical and Decision Patterns are never assigned. No ordinal percentiles because there is no population. An agent cannot self-supervise on any of those. Once a task is specified tightly enough for an agent to execute safely, the expensive part is already done.

**Taste is your scarcest resource, and autonomy destroys it.** You told me the AI-slop register is the most damaging thing to the product. A fleet of ICs working unsupervised for two to three days on a product whose central risk is register drift and unsupported claims is precisely the wrong architecture for your risk profile. More autonomy means more output between review points, which means slop compounds before you see it.

**Your compute budget is already the binding constraint.** You burn half a Claude window on one prompt. A fleet multiplies that. Daisy is not paying what you are paying.

There is a fourth reason, and it is the one that would bite hardest. **A multi-agent fleet is itself a project.** Prompt engineering, failure handling, state management, watching for agents that quietly went wrong. You have a product at V23.4, a day job, three parallel projects, and a job search. Adding an eighth thing to maintain is not leverage.

---

## 3. The version that is right for you: fan-out without autonomy

Separate two ideas that get bundled together.

**Fan-out** is N agents working in parallel on independent, bounded tasks, with you gating every merge. It is cheap, it is safe, and the speedup is real.

**Autonomy** is agents running for days making decisions without you. Expensive, and wrong for a product whose main failure mode is silent quality drift.

You want the first and not the second. And you can have the first today, in Claude Code, with no new infrastructure.

### 3.1 Where fan-out genuinely applies in your backlog

| Work | Agents | Why it parallelises |
|---|---|---|
| The seven Deep Research packs, R-1 to R-7 | 7 | Fully independent. No repo access. No shared files. The single best fan-out you have. |
| Multi-lens review of one diff | 4–6 | Independent reviewers on the same input beat one reviewer, because a single pass gets anchored on the first thing it finds. |
| The claim-extraction pass over public copy | 1 per file group | Embarrassingly parallel. Nothing shared. |
| Test generation per module | 1 per module | Independent files, independent tests. |
| Codebase investigations | 1 per question | What is running in this session. Read-only, so no conflicts. |
| Codex prompts V-1, V-4, V-6 after V-0 lands | 3, in git worktrees | Independent features, but they touch overlapping CSS. Isolation is mandatory. |

### 3.2 Where it does not

Sequential work. V-0 must land before V-2, and V-2 before V-3. Running them in parallel produces three agents fighting over the same files and a merge you cannot review.

Anything touching the same file. Two agents editing `globals.css` is not parallelism, it is a conflict you will resolve by hand.

Copy. Item authoring. Design decisions. Anything under the locked list in `STATE.md`.

### 3.3 The rule

**Parallelise the reading. Serialise the writing.**

Investigations, reviews, and research fan out freely because they produce text, not diffs. Implementation fans out only when the tasks touch disjoint file sets, and even then each one comes back through the gate before the next merges.

---

## 4. Can the ICs be DeepSeek or Kimi?

Partly, and not in the shape you are imagining. Three honest points.

**Claude Code subagents run on Claude models.** You can tier them: an Opus lead, Sonnet mid-level agents, Haiku for mechanical reads. That is real model tiering, it works today, it is one line of frontmatter per agent, and it will cut your cost meaningfully. What you cannot do is put a DeepSeek worker inside a Claude Code fleet.

**Cross-provider orchestration exists but the tooling is immature.** OpenCode and some Roo configurations support model routing across providers. You would spend your first week on plumbing rather than on the product, and plumbing is exactly the kind of work that feels productive and is not.

**The practical shape is two lanes, not one hierarchy.**

```
Lane 1 — Claude Code, in the repo
  Opus or Sonnet lead for anything with judgment in it.
  Haiku subagents for reconnaissance and gate-running.
  This lane owns anything that could plausibly go wrong in a way tests do not catch.

Lane 2 — Cline + OpenRouter + DeepSeek V4-Flash, second VS Code window
  Fully specified Tier B tasks from docs/CHEAP_TIER_TASK_TEMPLATE.md.
  This lane owns extraction, migration, mechanical refactors, test scaffolding.
```

You are the router between the lanes. That is the correct place for a human in a one-person shop, and it is the job Daisy's lead agents are doing that you do not need to automate.

---

## 5. How to actually set this up

### 5.1 Subagents in Claude Code

Drop the files in `agents/` next to this document into `.claude/agents/` in the repo. Seven definitions, written for your codebase and your constraints:

| Agent | Model | What it is for |
|---|---|---|
| `repo-scout` | haiku | "Where does X live, what imports Y." Read-only. Cheapest way to stop paying Opus rates for grep. |
| `gate-runner` | haiku | Runs the gate, returns a pass/fail table and the first real failure. Nothing else. |
| `compat-guard` | sonnet | Reads a diff and checks it against your locked constraints. This is the one that matters most. |
| `copy-critic` | sonnet | Applies the style contract and the slop measures to changed copy. Read-only, reports. |
| `design-token-guard` | haiku | Flags raw hex, off-scale px, stray border-radius, inline style objects in JSX. |
| `method-reviewer` | opus | The psychometric and methodological lens on a change. Expensive and worth it. |
| `research-scout` | sonnet | Source gathering with a strict no-fabrication contract. |

Verify the frontmatter schema against `/agents` in your Claude Code version before relying on it; the fields have moved before.

### 5.2 The three patterns worth learning

**Pattern 1 — the review fan-out.** After any substantial diff:

> Run `compat-guard`, `copy-critic`, `design-token-guard`, and `method-reviewer` in parallel on the current diff. Give me each report separately. Do not merge them into one summary; I want to see where they disagree.

Four independent passes on one diff, three of them cheap. This replaces the single review pass that gets anchored on the first problem it finds.

**Pattern 2 — the investigation fan-out.** When you have several open questions:

> Spawn one agent per question. Each reads only the files it needs and returns a report. Do not let them coordinate.

This is what is running in this session right now. Five investigations plus two adversarial reviews, in parallel, on questions that would each have cost you a long conversation.

**Pattern 3 — isolated parallel implementation.** Only when file sets are disjoint:

> Run V-1, V-4, and V-6 in parallel, each in its own git worktree. Each runs the full gate before returning. I will merge them one at a time.

Worktree isolation is the thing that makes this safe. Without it you get three agents in one working tree and a diff nobody can review.

### 5.3 What to put in `AGENTS.md` so subagents inherit your constraints

Your `AGENTS.md` is already good. Add one section so every spawned agent picks up the hard rules without you restating them:

```markdown
## For subagents

Before proposing any change, read STATE.md. The "Locked" section is binding.

You may not modify, and must stop and report if a task appears to require modifying:
- lib/scoring/**, lib/share.ts, lib/profile-share.ts
- any *_BANK_VERSION or *_SCORING_VERSION constant
- lib/modules/manifests.ts, lib/modules/release-decisions.ts
- any frozen version module (*-v21.ts, *-v22.ts, runtime-v1.ts, ai-governance-*-v2.ts)
- package.json dependencies

You may not write public-facing copy unless the task explicitly includes the style
contract from docs/v24/V24_ANTI_SLOP_SYSTEM_20260821.md §5.1.

If a step requires a judgment call, stop and ask. Do not choose.
```

That block is the closest thing you have to Daisy's "leads keep each other accountable." It is a constraint every agent inherits, and it costs nothing to run.

---

## 6. What to do, in order

**This week.** Nothing new. Run the Codex sprint. The credit expires and a new orchestration layer is a distraction from a deadline.

**Next week, thirty minutes.** Copy the seven agent files into `.claude/agents/`. Add the subagent section to `AGENTS.md`. Try Pattern 1 on the sprint diff. That single change is most of the value in this document.

**Week after.** Set up Cline and OpenRouter for Lane 2. First task: whatever V-0 did not finish.

**When you start V24 research.** Use Pattern 2 to run R-1 through R-7 in parallel. Seven research packs from one instruction is the largest single speedup available to you, and it needs no infrastructure at all.

**Never.** Agents working unsupervised for days on this product. Not because it cannot be made to work, but because the thing you are protecting is a quality property that only you can currently evaluate, and every hour of unsupervised generation is an hour of drift you will pay for in a sweep.

---

## 7. The honest summary

Daisy's architecture is a correct solution to her problem, which is coordinating more parallel engineering than one person can hold in their head. You do not have that problem. You have a specification problem and a taste problem, and neither is solved by adding agents.

What you should take from her setup is narrower and still worth having: **run independent work in parallel, tier your models so cheap reads stop costing Opus rates, and give every agent the same inherited constraint block.** That is maybe 5% of her architecture and probably 80% of the benefit at your scale.

The part to actively resist is the autonomy. She can afford agents that go wrong for two days. On a product whose central asset is that it does not overclaim, you cannot.
