# Phase 6C Runbook

## Purpose

This runbook is for one consolidated pre-friend-round pass.
The goal is to reduce iteration churn by using one main implementation chat in VS Code.

Recommended tool split:
- Codex = default builder
- Claude = optional audit/planning reviewer only if needed

If you want the lowest-friction path, use **Codex only**.

---

## 0. Save the current version first

From the repo root:

```bash
cd ~/Code/ir-worldview-app-clean
git branch --show-current
git status
npm run lint
npm run test
npm run build
```

If all is clean and passing, snapshot the current branch:

```bash
git add -A
git commit -m "phase 6b2 snapshot before phase 6c"
git push
git tag -a v0.6b2-prototype -m "Phase 6B2 prototype snapshot before Phase 6C"
git push origin v0.6b2-prototype
```

---

## 1. Create the Phase 6C branch

```bash
git checkout <CURRENT_BRANCH>
git pull
git checkout -b phase-6c-content-and-payoff
```

Verify:

```bash
git branch --show-current
git status
```

---

## 2. Unpack the docs locally

```bash
mkdir -p phase6c-docs
printf "\nphase6c-docs/\n" >> .git/info/exclude
cd ~/Code/ir-worldview-app-clean/phase6c-docs
unzip ~/Downloads/phase6c_package.zip
ls -1
```

---

## 3. One-pass flow in VS Code

Open:
- `phase6c-docs/PHASE_6C_SPEC.md`
- `phase6c-docs/PROMPT_PHASE_6C_ONEPASS_CODEX.txt`

Paste the one-pass prompt into Codex.

It should:
1. read the spec
2. plan first
3. wait for your approval
4. implement the minimum stable version
5. run lint/test/build
6. summarize what changed

Use this wrapper message:

```text
Please read PHASE_6C_SPEC.md and PROMPT_PHASE_6C_ONEPASS_CODEX.txt.

Follow the prompt exactly.
Do the planning step first and wait for my approval before editing.
```

When the plan looks right, approve with:

```text
Approved. Implement the minimum stable Phase 6C version now.
Keep scope tight.
Run lint, test, and build at the end.
```

---

## 4. Manual checks after implementation

Run these yourself even if Codex already did:

```bash
cd ~/Code/ir-worldview-app-clean
git status
git diff --stat
npm run lint
npm run test
npm run build
```

Then run the app locally:

```bash
npm run dev
```

Check at minimum:
- Foundation result page in Standard mode
- Foundation result page in Deep-dive mode
- Security module flow + result
- Technology module flow + result
- Profile page
- Atlas Lite page

Look for:
- clearer case scaffolding
- less memo-like options
- simpler Standard-mode results
- fewer boxes / calmer visual hierarchy
- Atlas Lite links and usefulness

---

## 5. Commit and push

```bash
git add -A
git commit -m "phase 6c content discipline and payoff"
git push -u origin phase-6c-content-and-payoff
```

---

## 6. QA pass

If you want one more pass, open:
- `phase6c-docs/PHASE_6C_SPEC.md`
- `phase6c-docs/PROMPT_PHASE_6C_QA.txt`

Use this wrapper:

```text
Please read PHASE_6C_SPEC.md and PROMPT_PHASE_6C_QA.txt.
Review the current branch against the spec.
Focus on content targeting, Standard-mode payoff, visual hierarchy, and readiness for the next friend round.
Do not do a broad rewrite.
```

Apply only minimal fixes if needed.

---

## 7. What comes after 6C

If 6C lands well, the next likely phase is:
- compare / atlas expansion / profile portability

Not yet:
- crisis lab
- new modules
- bigger simulation work

The friend round should happen before those larger expansions.
