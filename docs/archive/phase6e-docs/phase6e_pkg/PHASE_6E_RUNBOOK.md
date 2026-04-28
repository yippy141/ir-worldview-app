# Phase 6E Runbook

## 1. Snapshot current state

```bash
cd ~/Code/ir-worldview-app-clean
git branch --show-current
git status
npm run lint
npm run test
npm run build
git add -A
git commit -m "phase 6d snapshot before phase 6e"
git push
git tag -a v0.6d-prototype -m "Phase 6D prototype snapshot before Phase 6E"
git push origin v0.6d-prototype
```

If `git push` says there is no upstream, use:

```bash
git push -u origin <CURRENT_BRANCH_NAME>
```

## 2. Create the new branch

```bash
git checkout <CURRENT_BRANCH_NAME>
git pull
git checkout -b phase-6e-plain-english-and-actor-lens
git branch --show-current
git status
```

## 3. Create local docs folder

```bash
mkdir -p phase6e-docs
printf "\nphase6e-docs/\n" >> .git/info/exclude
cd ~/Code/ir-worldview-app-clean/phase6e-docs
unzip ~/Downloads/phase6e_package.zip
ls -1
```

## 4. Open VS Code

```bash
cd ~/Code/ir-worldview-app-clean
code .
```

## 5. Use Codex

Open these files:
- `phase6e-docs/PHASE_6E_SPEC.md`
- `phase6e-docs/COPY_TONE_GUIDE_PHASE_6E.md`
- `phase6e-docs/PROMPT_PHASE_6E_ONEPASS_CODEX.txt`

Paste into Codex:

```text
Please read PHASE_6E_SPEC.md, COPY_TONE_GUIDE_PHASE_6E.md, and PROMPT_PHASE_6E_ONEPASS_CODEX.txt.

Follow the prompt exactly.
Do the planning step first and wait for my approval before editing.
```

## 6. Review the plan

Approve only if the plan:
- keeps scope tight
- adds `Actor lens`
- rewrites the target Security / Technology cards
- shortens and clarifies the top of Profile / results
- updates public-facing copy
- avoids new modules and crisis-lab work

Approval line:

```text
Approved. Implement the minimum stable Phase 6E version now.
Keep scope tight.
Run lint, test, and build at the end.
```

## 7. Verify after implementation

```bash
cd ~/Code/ir-worldview-app-clean
git status
git diff --stat
npm run lint
npm run test
npm run build
```

## 8. Manual smoke test

```bash
npm run dev
```

Check:
- home hero no longer leads with prototype/classification framing
- Explore / Methods use Inventory/Foundation/Focus-area/Profile language
- Profile top block is plain English
- Foundation top is shorter and plainer
- module tops feel like issue files
- Actor lens badge/instruction exists and makes sense
- rewritten Security / Technology cases feel more specific

Stop dev server with `Ctrl+C`.

## 9. Commit and push

```bash
git add -A
git commit -m "phase 6e plain English and actor lens"
git push -u origin phase-6e-plain-english-and-actor-lens
```

## 10. Run QA

Open:
- `phase6e-docs/PHASE_6E_SPEC.md`
- `phase6e-docs/COPY_TONE_GUIDE_PHASE_6E.md`
- `phase6e-docs/PROMPT_PHASE_6E_QA.txt`

Paste into Codex:

```text
Please read PHASE_6E_SPEC.md, COPY_TONE_GUIDE_PHASE_6E.md, and PROMPT_PHASE_6E_QA.txt.

Review the current branch against the spec.
Do not do a broad rewrite.
```
