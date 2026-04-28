# Phase 6C.1 Runbook

## 1. Save the current 6C state

Run from the repo root:

```bash
cd ~/Code/ir-worldview-app-clean
git branch --show-current
git status
npm run lint
npm run test
npm run build
git add -A
git commit -m "phase 6c atlas lite and payoff pass"
git push -u origin phase-6c-content-and-payoff
git tag -a v0.6c-prototype -m "Phase 6C prototype snapshot before Phase 6C.1"
git push origin v0.6c-prototype
```

If `git push -u origin phase-6c-content-and-payoff` says the branch already has an upstream, just run `git push`.

## 2. Create the new branch

```bash
git checkout phase-6c-content-and-payoff
git pull
git checkout -b phase-6c1-atlas-clarity
```

Verify:

```bash
git branch --show-current
git status
```

## 3. Add the docs locally

```bash
mkdir -p phase6c1-docs
printf "\nphase6c1-docs/\n" >> .git/info/exclude
cd ~/Code/ir-worldview-app-clean/phase6c1-docs
unzip ~/Downloads/phase6c1_package.zip
ls -1
```

## 4. Use Codex in one pass

Open these files in VS Code:
- `phase6c1-docs/PHASE_6C1_SPEC.md`
- `phase6c1-docs/COPY_TONE_GUIDE_PHASE_6C1.md`
- `phase6c1-docs/PROMPT_PHASE_6C1_ONEPASS_CODEX.txt`

Paste this into Codex:

```text
Please read PHASE_6C1_SPEC.md, COPY_TONE_GUIDE_PHASE_6C1.md, and PROMPT_PHASE_6C1_ONEPASS_CODEX.txt.

Follow the prompt exactly.
Do the planning step first and wait for my approval before editing.
```

When Codex returns the plan, approve only if it stays within scope.

Approve with:

```text
Approved. Implement the minimum stable Phase 6C.1 version now.
Keep scope tight.
Run lint, test, and build at the end.
```

## 5. Verify after implementation

Run:

```bash
cd ~/Code/ir-worldview-app-clean
git status
git diff --stat
npm run lint
npm run test
npm run build
```

## 6. Local smoke test

Run:

```bash
npm run dev
```

Check these pages locally:
- `/explore/atlas`
- `/explore/atlas/[id]` for at least 3 patterns
- Foundation result page
- Profile page
- one module result page

Check specifically:
- Atlas cards can be read fast
- card wording sounds natural
- detail pages feel richer than cards
- the detail pages are not just repeating the same paragraph
- visuals are restrained but useful
- visible summaries no longer rely on “X matters” phrasing

Stop dev server with `Ctrl+C`.

## 7. Commit and push

```bash
git add -A
git commit -m "phase 6c1 atlas clarity and copy hygiene"
git push -u origin phase-6c1-atlas-clarity
```

## 8. Run QA

Open these files:
- `phase6c1-docs/PHASE_6C1_SPEC.md`
- `phase6c1-docs/COPY_TONE_GUIDE_PHASE_6C1.md`
- `phase6c1-docs/PROMPT_PHASE_6C1_QA.txt`

Paste into Codex:

```text
Please read PHASE_6C1_SPEC.md, COPY_TONE_GUIDE_PHASE_6C1.md, and PROMPT_PHASE_6C1_QA.txt.

Review the current branch against the spec.
Do not do a broad rewrite.
```

If QA finds only small issues, fix only those and rerun lint/test/build.

## 9. Defer next

Do not start compare/friends or crisis lab in this branch.
Those are next-phase decisions.
