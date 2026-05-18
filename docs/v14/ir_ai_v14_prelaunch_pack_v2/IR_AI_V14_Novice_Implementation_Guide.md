# IR + AI V14 novice implementation guide

This guide assumes you are using VS Code, Git, Vercel, Claude Code, and Codex.

V14 is the last prelaunch checkpoint before sharing more broadly. It focuses on payoff, trust, and AI-first discovery.

---

## Overview of the sprint

You will run the sprint in this order:

1. Create a safety checkpoint.
2. Put the V14 docs into the repo.
3. Run a source-of-truth audit.
4. Fix TypeScript/typecheck trust issues.
5. Add integration tests.
6. Build result-card heroes.
7. Make `/ai` a standalone entry point.
8. Rewrite the landing page.
9. Reduce quiz friction and add midpoint preview.
10. Improve share/social metadata.
11. Run data/privacy preflight.
12. Deploy a Vercel preview.
13. Run a 10 to 20 person pilot.

Use Codex for technical cleanup and tests. Use Claude Code for UI/result-card work.

---

## Step 0 — Safety checkpoint

Open VS Code terminal at the repo root.

Run:

```bash
git status
```

Commit current work:

```bash
git add -A
git commit -m "Checkpoint before V14 prelaunch sprint" || true
```

Create backup branch and tag:

```bash
git branch backup/pre-v14-prelaunch
git tag pre-v14-safe
```

Create a working branch:

```bash
git checkout -b feature/v14-prelaunch-payoff
```

Push backups:

```bash
git push origin backup/pre-v14-prelaunch
git push origin pre-v14-safe
git push -u origin feature/v14-prelaunch-payoff
```

If Git says the branch/tag already exists, continue.

---

## Step 1 — Put the V14 pack inside the repo

After downloading and unzipping the pack, copy it into docs:

```bash
mkdir -p docs/v14 plans
cp -R ~/Downloads/ir_ai_v14_prelaunch_pack/* docs/v14/ 2>/dev/null || true
```

If your download path is different, drag the files manually into `docs/v14/` using VS Code.

Commit:

```bash
git add -A
git commit -m "Add V14 prelaunch planning docs" || true
```

---

## Step 2 — Update AGENTS.md for this sprint

Ask Codex to run Codex Prompt 0 from `IR_AI_V14_Codex_Prompts.txt`.

Do not let it append a huge wall to AGENTS.md. It should merge and compress.

Commit after it finishes:

```bash
git add -A
git commit -m "Add V14 sprint guardrails" || true
```

---

## Step 3 — Hard engineering trust gate

Run this manually first:

```bash
npx tsc --noEmit
```

If errors appear, do not panic. Run Codex Prompt 1.

The goal is:

```bash
npx tsc --noEmit
npm run lint
npm run test
npm run build
```

all pass.

Then remove or set this to false in `next.config.ts`:

```ts
typescript: {
  ignoreBuildErrors: true,
}
```

The desired state is either no `typescript` override, or:

```ts
typescript: {
  ignoreBuildErrors: false,
}
```

Commit:

```bash
git add -A
git commit -m "Fix typecheck gate for V14" || true
```

Do not proceed to UI work until this passes.

---

## Step 4 — Add integration tests

Run Codex Prompt 2.

Expected outcome:
- 4 to 6 tests that run full answer sets through result generation
- tests for at least one realist-like, institutionalist-like, constructivist-like, CPE-like, and mixed profile
- no scoring changes unless a bug is found

Checks:

```bash
npm run test
npm run lint
npm run build
```

Commit:

```bash
git add -A
git commit -m "Add quiz-to-result integration tests" || true
```

---

## Step 5 — Build the result-card hero system

Use Claude Code for this if available. Run Claude Prompt 1.

This is the most important visual step in V14. Read the visual direction and surprising-finding spec in the PM brief before running the prompt.

Expected files likely touched:
- `components/results/*`
- `app/results/[payload]/page.tsx`
- `app/ai/results/[payload]/page.tsx`
- `components/profile/*`
- `app/globals.css`

Hard rule: do not change scoring or payloads.

Checks:

```bash
npm run lint
npm run test
npm run build
```

Manual check:
- Finish Foundation and view result.
- Finish AI and view result.
- Open Profile with saved layers.
- First screen should feel like a reward, not a report.
- The tension/surprise callout should say something non-obvious.

Commit:

```bash
git add -A
git commit -m "Add V14 result-card payoff heroes" || true
```

---

## Step 6 — Make AI a standalone entry point

Run Claude Prompt 2 or Codex Prompt 3.

Expected result:
- `/ai` leads with standalone AI value.
- It does not require IR Foundation.
- It still links back to IR as optional depth.
- AI result page has a bridge CTA to IR Foundation.

Checks:

```bash
npm run lint
npm run test
npm run build
```

Commit:

```bash
git add -A
git commit -m "Make AI Governance Compass standalone entry point" || true
```

---

## Step 7 — Rewrite the landing page

Run Claude Prompt 3.

Expected result:
- Hero leads with a short question and CTA, not a product architecture explanation.
- How-to-use and product layers are below the fold.
- A sample result preview sits between the hero and the lower sections.
- Audience signal is visible near the top.

Manual check:
- Open the homepage in a fresh tab. Can you understand what the product is and start the quiz within 5 seconds?

Checks:

```bash
npm run lint
npm run test
npm run build
```

Commit:

```bash
git add -A
git commit -m "Rewrite landing page for V14" || true
```

---

## Step 8 — Reduce quiz friction and add midpoint preview

Run Claude Prompt 4.

Expected result:
- Standard mode is the default for first-time users.
- Analyst mode remains accessible but secondary.
- Section markers show where the user is in the quiz (5 sections for Standard).
- Question transitions are subtle (150ms fade).
- After section 1 (first 7 questions), a midpoint preview shows "Your profile is starting to take shape" with the user's top 2 dimensions. Marked as preliminary.

Do not rewrite the question bank.

Checks:

```bash
npm run lint
npm run test
npm run build
```

Manual check:
- Start the quiz as a first-time user. You should NOT see a mode gate.
- After question 7, you should see a brief midpoint preview before continuing.
- Section labels should update as you progress.

Commit:

```bash
git add -A
git commit -m "Reduce quiz friction and add midpoint preview for V14" || true
```

---

## Step 9 — Social share metadata

Run Codex Prompt 4.

Minimum acceptable outcome:
- route metadata is specific for IR result, AI result, and Profile pages
- share buttons are clear
- result cards are screenshot-worthy

Do NOT attempt dynamic OG images in V14. That is deferred to V14.1. If the result card looks good enough to screenshot, that is sufficient.

Checks:

```bash
npm run lint
npm run test
npm run build
```

Commit:

```bash
git add -A
git commit -m "Improve result sharing and social metadata" || true
```

---

## Step 10 — Data/privacy preflight

Run Codex Prompt 5.

Verify:
- product works without research opt-in
- opt-in is unchecked
- no raw answers go to third-party analytics
- deletion path is visible
- research endpoints are disabled safely if env vars are missing
- copy says pseudonymous/de-identified, not anonymous, unless truly anonymous

Checks:

```bash
npm run lint
npm run test
npm run build
```

Commit:

```bash
git add -A
git commit -m "Run V14 data and privacy preflight" || true
```

---

## Step 11 — Final release QA

Run Codex Prompt 6.

Manual QA checklist:
- homepage (clean hero, sample preview visible)
- Foundation result (result card hero, tension callout)
- AI result (standalone card, bridge CTA to IR)
- Profile with saved layers
- share link in fresh browser
- mobile width around 390px
- data opt-in accepted and declined
- feedback/deletion path

Final checks:

```bash
npx tsc --noEmit
npm run lint
npm run test
npm run build
```

Commit:

```bash
git add -A
git commit -m "Finish V14 prelaunch QA" || true
```

---

## Step 12 — Deploy Vercel preview

Push:

```bash
git push -u origin feature/v14-prelaunch-payoff
```

Open the Vercel preview URL for this branch.

Do not share the production root until it points to the same commit or the same product state.

---

## Step 13 — Pilot share plan

Use two links:

### LinkedIn / AI governance contacts
Share `/ai` first.

Suggested note:

> I built a small AI Governance Compass to map how people reason about frontier AI: safety, openness, state capacity, rivalry, legitimacy, and human agency. It is an editorial thought exercise, not a validated instrument. Would love feedback from people working around AI policy and governance.

### SAIS / IR contacts
Share `/` or `/quiz` first.

Suggested note:

> I have been building an IR Worldview Inventory: a structured interactive for seeing how your foreign-policy instincts line up across power, institutions, domestic politics, norms, political economy, restraint, and order. It is still beta, and I am looking for sharp feedback.

Start with 10 to 20 people. Do not post broadly to all networks until you have read the first feedback.

---

## Emergency rollback

```bash
git checkout backup/pre-v14-prelaunch
```

Or return to the previous feature branch:

```bash
git checkout feature/ai-governance-compass
```
