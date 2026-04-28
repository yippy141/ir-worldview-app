# Phase 6A runbook

This runbook assumes:
- your current Phase 5M.1 branch is the version you want to preserve
- you will use VS Code
- you will use Codex by default for implementation
- you may use Claude for a second-opinion plan or wording pass

---

## Part 1 - Preserve the current version first

### 1. Open Terminal and go to the repo

```bash
cd ~/Code/ir-worldview-app-clean
pwd
git rev-parse --show-toplevel
git branch --show-current
git status
```

If `git status` is not clean, stop and commit or stash first.

### 2. Run the checks

```bash
npm run lint
npm run test
npm run build
```

Only continue if they pass.

### 3. Push the current branch

Replace the placeholder with the real current branch:

```bash
git push origin <CURRENT_BRANCH_NAME>
```

### 4. Create the preservation tag

```bash
git tag -a v0.5m1-prototype -m "Phase 5M.1 prototype snapshot before Phase 6A"
git push origin v0.5m1-prototype
```

### 5. Preserve the Vercel preview

In Vercel:
1. open the correct project
2. open **Deployments**
3. filter to the branch you just preserved
4. open the newest successful preview deployment
5. copy the generated URL
6. if needed, create a shareable link or note how you will re-open it later

### 6. Optional GitHub release

On GitHub:
1. open the repository
2. open **Releases**
3. create a new release from tag `v0.5m1-prototype`
4. add a short note such as:
   - “Last pre-Phase-6A prototype snapshot”

---

## Part 2 - Start Phase 6A on a new branch

### 1. Create the new branch from the preserved current branch

Replace the placeholder with your actual preserved branch if needed.

```bash
git checkout <CURRENT_BRANCH_NAME>
git pull
git checkout -b phase-6a-inventory-integration
```

Verify:

```bash
git branch --show-current
git status
```

You want:
- branch = `phase-6a-inventory-integration`
- clean working tree

---

## Part 3 - Put the Phase 6A docs into the repo locally

### 1. Make a local docs folder

```bash
mkdir -p phase6a-docs
printf "\nphase6a-docs/\n" >> .git/info/exclude
```

### 2. Put the package there

If the zip is in Downloads:

```bash
cd ~/Code/ir-worldview-app-clean/phase6a-docs
unzip ~/Downloads/phase6a_package.zip
ls -1
```

You should now see:
- PHASE_6A_SPEC.md
- PROMPT_PHASE_6A_AUDIT.txt
- PROMPT_PHASE_6A_IMPLEMENT_CODEX.txt
- PROMPT_PHASE_6A_IMPLEMENT_CLAUDE.txt
- PROMPT_PHASE_6A_QA.txt
- PHASE_6A_HANDOFF_PROMPT.txt
- PHASE_6A_RUNBOOK.md
- SAVE_CURRENT_VERSION_CHECKLIST.md

---

## Part 4 - Run the audit prompt first

### 1. Preflight

```bash
cd ~/Code/ir-worldview-app-clean
git status
git branch --show-current
npm run lint
npm run test
npm run build
```

Only continue if all pass and the tree is clean.

### 2. Open VS Code

```bash
code .
```

If `code .` does not work, open VS Code manually and open the repo folder.

### 3. Open these files in tabs

- `phase6a-docs/PHASE_6A_SPEC.md`
- `phase6a-docs/PROMPT_PHASE_6A_AUDIT.txt`

### 4. In Codex, paste this wrapper

```text
Please read PHASE_6A_SPEC.md and PROMPT_PHASE_6A_AUDIT.txt.

Audit only.
Do not edit code.
Do not modify files.
Give me:
1. the file-by-file plan
2. the implementation order
3. the likely data-flow changes
4. what is highest risk
5. what should be deferred
Then stop.
```

### 5. After the audit finishes

Run:

```bash
git status
git diff --stat
```

You want no file changes.

Save the audit output somewhere local, for example:
- Notes app
- or `phase6a-docs/audit-notes.md`

---

## Part 5 - Run the implementation prompt

### 1. Preflight again

```bash
git status
git branch --show-current
```

Only continue if:
- branch = `phase-6a-inventory-integration`
- working tree clean

### 2. Open these files in tabs

- `phase6a-docs/PHASE_6A_SPEC.md`
- `phase6a-docs/PROMPT_PHASE_6A_IMPLEMENT_CODEX.txt`

### 3. In Codex, paste this wrapper

```text
Please read PHASE_6A_SPEC.md and PROMPT_PHASE_6A_IMPLEMENT_CODEX.txt.

Before editing:
1. list the files you will change
2. explain what you will fully implement vs lightly scaffold
3. explain how the local profile store and integrated profile page will work
4. tell me what should still be deferred
5. then wait for my approval
```

### 4. Review the plan carefully

You want to see:
- naming cleanup
- modules renamed to focus-area modules
- scenario card-type labels
- better instructions
- second-choice logic for case cards in Deep-dive mode
- integrated profile store + dashboard
- module result pages updated to compare back to Foundation
- no new modules
- no fake master score
- no backend complexity

If it looks good, approve with:

```text
Approved. Implement the minimum stable Phase 6A version now.
Keep scope tight.
Run lint, test, and build at the end.
```

If it drifts, stop it and paste:

```text
Stop. Return to PHASE_6A_SPEC.md.
Do not add more modules.
Do not add backend auth or a database.
Do not create a fake total score.
Do not expand beyond the minimum stable integrated profile implementation.
```

### 5. After implementation

Run these yourself even if the AI says it already did:

```bash
git status
git diff --stat
npm run lint
npm run test
npm run build
```

---

## Part 6 - Local smoke test

### 1. Start the dev server

```bash
npm run dev
```

### 2. Check these pages locally

- home
- method
- foundation flow
- foundation result
- modules page (now focus-area modules)
- security module flow
- security result
- technology module flow
- technology result
- integrated profile page / surface
- feedback page

### 3. Specifically verify

- naming is consistent
- “flagship modules” is gone
- “The Isms Quiz” is gone
- the SAIS inspiration note is present and discreet
- scenario cards are labeled Explanation / Decision / Both where applicable
- Deep-dive case cards allow second choice where intended
- module results show “How this differs from your Foundation”
- integrated profile shows Foundation + module overlays + tensions
- no fake total score appears

### 4. Stop the dev server

```bash
Ctrl+C
```

---

## Part 7 - Commit and push Phase 6A

If everything looks good:

```bash
git add -A
git commit -m "phase 6a inventory integration and clarity"
git push -u origin phase-6a-inventory-integration
```

---

## Part 8 - Run the QA prompt

### 1. Open these files

- `phase6a-docs/PHASE_6A_SPEC.md`
- `phase6a-docs/PROMPT_PHASE_6A_QA.txt`

### 2. In a fresh AI chat if possible, paste this wrapper

```text
Please read PHASE_6A_SPEC.md and PROMPT_PHASE_6A_QA.txt.

Review the current branch against the spec.
Focus on naming consistency, scenario clarity, integrated profile coherence, module payoff, and readiness for the next friend round.
Do not do a broad rewrite.
```

### 3. If QA finds only small issues

Apply just those fixes.
Then run again:

```bash
git status
npm run lint
npm run test
npm run build
```

If QA caused code edits:

```bash
git add -A
git commit -m "phase 6a qa fixes"
git push
```

---

## Part 9 - Use the new-chat handoff if needed

If the AI chat gets too long or confused:

1. start a fresh chat
2. open `phase6a-docs/PHASE_6A_HANDOFF_PROMPT.txt`
3. paste this one-liner above it:

```text
Please read PHASE_6A_HANDOFF_PROMPT.txt first, summarize the project goal and current phase in 6 to 8 lines, and do not edit anything until I approve.
```

---

## Emergency reset commands

If the AI makes a mess **before you commit**, inspect first:

```bash
git status
git diff --stat
```

Discard tracked-file edits:

```bash
git restore .
```

Remove untracked files too:

```bash
git clean -fd
```

Use `git clean -fd` only if you are sure you do not need the new files.
