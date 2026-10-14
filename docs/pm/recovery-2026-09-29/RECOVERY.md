# Recovery record — 29 September 2026

## What was found

The September 23 work is saved in `docs/review/claude-second-opinion-2026-09-23/`. All 11 files were untracked at discovery. They were not integrated into the application. Both patch files pass `git apply --check` against local HEAD; this establishes textual applicability only.

| Recovered material | What Claude delivered | Current disposition |
| --- | --- | --- |
| `IMPLEMENTATION-PLAN.md` | PR-A through PR-H, Git recovery instructions, later instrument and brand proposals | Historical plan; use the assessed sprint queue instead |
| `patches/pr-a-pilot-trust.patch` | Save feedback, shared-result notice, share marker, test changes, legacy helper removal | Built candidate; revise before integration |
| `patches/pr-b-copy-ratchet.patch` | Voice guide, audit rules, fingerprint/count baseline enforcement, CI, tests | Built candidate; narrow policies and validate before integration |
| `VERIFICATION.md` | Claude's Linux checks with omitted docs, artifacts, and screenshots | Partial historical evidence, not a clean full-suite result |
| `EXEMPLARS.md` | Twelve categories of before/after copy | Writing references; factual and methodological review required |
| `BRAND-BRIEF.md` and four SVGs | Parallax / 格局 proposal, marks, icon, favicon, design prompts | Unapproved concepts, not production assets |
| `README.md` | Packet entry point | Preserved verbatim |

The packet points to a separate report page shared in its originating chat. That page and the full September 23 conversation were not recovered here. The exact model identity “Opus 5.5” cannot be established from these files. A project-related local Claude session contains earlier September work and a September 22 queue event, but no September 23 assistant response. Its recorded model identifier is `claude-fable-5-1`; that is not attribution for this packet.

Search covered the current repository, Git branches/logs/stash/worktree inventory, project-specific Claude logs and memory, matching Downloads filenames, and relevant Codex task history. Older Claude worktrees still exist; no worktree, stash, branch, or original source was deleted or reset. This is a bounded recovery, not a claim that every external Claude conversation was found.

## Repository checkpoint

Recorded before recovery edits:

- Checkout: `fix/pilot-trust-storage`, HEAD `a3e8d394fab6b740295a1aaf57cd090f0bf0992a` (September 22).
- Cached `origin/main`: `b49365f79bdd4306fbe62d9f8ee2e48f130f5008` (PR64). Remote state was not fetched; this is not a claim about current GitHub state.
- Local `main`: `dc1e95f84e3f8a296e19ab94dd9852ebf689b315`. Do not start new work from it without checking ancestry. Preserve it; do not copy the packet's `reset --hard` recipe blindly.
- Only initial worktree change: the untracked September 23 packet.
- Older September 12–15 review and Sprint A follow-ups are already represented in repository history. They are context, not newly recovered implementation.

## Owner correction recovered from task history

Codex task **Update stale provenance test**, ID `01a0c85d-57e4-7241-bff8-591a8c8bc835`, contains a September 22 correction: matching unknown/unknown recorded markers is permitted for storage deduplication only. Unknown provenance must not establish comparison eligibility, ownership, or a longitudinal-change narrative. Preserve the assertions that known markers match, unknown markers can deduplicate, comparison rejects incomplete provenance, and history bytes remain unchanged. The current `tests/history-copy-provenance.test.mts` reflects this distinction.

## Preservation and validation

Original files remain at their existing paths and are checksummed in [source-manifest.json](source-manifest.json). New PM documents describe corrections without rewriting what Claude said. No patch was applied and no product, scoring, payload, dependency, or brand changes were made by this recovery.

Fresh checks are recorded in [VALIDATION.md](VALIDATION.md). Claude's numbers remain attributed to Claude. Saving files locally does not imply a Git commit, remote backup, merge, or deployment.
