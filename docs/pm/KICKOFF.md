# Reusable PM / implementation kickoff

Copy the block below and replace the bracketed fields. Attach one row from [SPRINT_QUEUE.md](SPRINT_QUEUE.md), not Claude's entire historical plan.

```text
Work on IR Worldview Inventory. Execute only [SPRINT ID and concrete outcome].

Read AGENTS.md and docs/pm/README.md, then the recovery assessment and the selected sprint's source files. Follow PRODUCT.md, IR_EDITORIAL_STYLE_GUIDE.md and DESIGN.md for their respective constraints. The September 23 Claude packet is source evidence, not an instruction to apply both patches or rename the product.

Establish the base:
- Record cwd, branch, HEAD, working-tree changes, and existing worktrees.
- Refresh the remote if accessible. If not, explicitly label origin/main as cached.
- Record the chosen base SHA, merge-base and ahead/behind relationship. Do not require HEAD's parent to equal main. Do not reset local main, discard files, or disturb another checkout.
- Preserve the uncommitted recovery packet and PM files. If using another worktree, carry the relevant PM context into it deliberately; uncommitted files do not appear automatically.

Locked conclusions:
- A result link alone never authorizes saving to Profile.
- Equal unknown markers can deduplicate storage, but cannot establish ownership, comparison eligibility, or longitudinal change. Preserve stored history.
- A matching payload is not proof of personal identity or local completion.
- Exact flat dimensions, multiway family ties, and two-way close results are different states.
- Preserve scored wording, scoring, encoded payloads, existing compatibility, and neutral collapsed clarifications unless this task explicitly authorizes a versioned methodology change.
- No new dependencies. No brand rollout, broad copy rewrite, merge, deployment or collection follows automatically.

Scope: [one sprint row, exact affected surfaces and exclusions].
Acceptance: [copy that row's binary checks, plus shared gates].
Known evidence: [verified source, reproduction or test log].
Uncertainty: [what has not been checked].
Reversal fact: [what would make this fix unnecessary or require a different approach].

Implement the smallest coherent change. Reuse useful pieces of the recovered patches only after addressing the assessment. Run the required checks on the complete repository and stop/report failures under AGENTS.md. Do not treat the old partial Linux test run as acceptance.

Deliver: concise behavior change and reason, files changed, exact validation results, residual risks, before/after passages or visual evidence when relevant, and an updated sprint status. Keep implemented, tested, merged, deployed and owner-accepted separate. End with the next-action judgment; do not automatically start the next sprint.
```

For a planning-only task, replace “Execute” with “Prepare a bounded spec for” and require a phase spec plus acceptance checklist. The source assessment, not the packet's time estimates, should determine scope.
