# Phase 6D Runbook

## 1. Snapshot current state

```bash
cd ~/Code/ir-worldview-app-clean
git branch --show-current
git status
npm run lint
npm run test
npm run build
git add -A
git commit -m "phase 6c1 atlas clarity snapshot"
git push -u origin <CURRENT_BRANCH>
git tag -a v0.6c1-prototype -m "Phase 6C1 prototype snapshot before Phase 6D"
git push origin v0.6c1-prototype
```

Replace `<CURRENT_BRANCH>` with your real current branch if needed.

## 2. Create the Phase 6D branch

```bash
git checkout <CURRENT_BRANCH>
git pull
git checkout -b phase-6d-share-and-compare
git branch --show-current
git status
```

## 3. Add local docs

```bash
mkdir -p phase6d-docs
printf "\nphase6d-docs/\n" >> .git/info/exclude
cd ~/Code/ir-worldview-app-clean/phase6d-docs
unzip ~/Downloads/phase6d_package.zip
ls -1
```

## 4. Open VS Code

```bash
cd ~/Code/ir-worldview-app-clean
code .
```

If `code .` does not work, open VS Code manually and open the repo folder.

## 5. Use Codex in one pass

Open these files:
- `phase6d-docs/PHASE_6D_SPEC.md`
- `phase6d-docs/COPY_TONE_GUIDE_PHASE_6D.md`
- `phase6d-docs/PROMPT_PHASE_6D_ONEPASS_CODEX.txt`

Paste this into Codex:

```text
Please read PHASE_6D_SPEC.md, COPY_TONE_GUIDE_PHASE_6D.md, and PROMPT_PHASE_6D_ONEPASS_CODEX.txt.

Follow the prompt exactly.
Do the planning step first and wait for my approval before editing.
```

## 6. Approve only if the plan stays tight

Good signs:
- adds a shareable integrated profile payload
- adds a compare page
- improves Atlas detail pages and visible summaries
- keeps scope away from new modules and crisis lab

Bad signs:
- starts adding accounts, persistence, or a backend
- expands into new modules
- redesigns unrelated pages
- adds percentiles, popularity, or rarity claims

If the plan looks good, approve with:

```text
Approved. Implement the minimum stable Phase 6D version now.
Keep scope tight.
Run lint, test, and build at the end.
```

## 7. Verify manually after implementation

```bash
cd ~/Code/ir-worldview-app-clean
git status
git diff --stat
npm run lint
npm run test
npm run build
```

## 8. Smoke test locally

```bash
npm run dev
```

Check:
- Atlas browse page cards are concise
- Atlas detail page top section is not repetitive
- shared profile link works in a fresh tab or private window
- compare page works with two profile links/payloads
- copy feels less AI-coded
- fingerprints/visuals are clearer but still restrained

Stop with:

```bash
Ctrl+C
```

## 9. Commit and push

```bash
git add -A
git commit -m "phase 6d shareable profile and compare layer"
git push -u origin phase-6d-share-and-compare
```

## 10. Run QA

Open:
- `phase6d-docs/PHASE_6D_SPEC.md`
- `phase6d-docs/COPY_TONE_GUIDE_PHASE_6D.md`
- `phase6d-docs/PROMPT_PHASE_6D_QA.txt`

Paste into Codex:

```text
Please read PHASE_6D_SPEC.md, COPY_TONE_GUIDE_PHASE_6D.md, and PROMPT_PHASE_6D_QA.txt.

Review the current branch against the spec.
Do not do a broad rewrite.
```

If QA flags only small issues, fix only those and rerun:

```bash
npm run lint
npm run test
npm run build
```
