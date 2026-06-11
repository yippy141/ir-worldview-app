# v15 Novice Implementation Guide

This guide assumes you are working from the current v14 branch:

```bash
feature/v14-prelaunch-payoff
```

The new work should happen on:

```bash
feature/v15-coherence-payoff
```

The purpose of this guide is not only to tell you what to paste into a coding agent. It is also to teach you how to supervise the agent, what each step changes, and how to know whether the change is safe.

---

# Part 0 — Before you touch code

## 0.1 Open the repo

In Terminal:

```bash
cd ~/Code/ir-worldview-app-clean
```

If your repo is somewhere else, use that folder instead.

## 0.2 Check your branch and working tree

```bash
git status
```

You want something like:

```text
On branch feature/v14-prelaunch-payoff
nothing to commit, working tree clean
```

If you have uncommitted changes, do not start v15 yet. Commit or stash them first.

## 0.3 Pull latest code

```bash
git switch feature/v14-prelaunch-payoff
git pull
```

## 0.4 Create the v15 branch

```bash
git switch -c feature/v15-coherence-payoff
```

Why this matters: a branch is a safe copy of the project state. If an AI agent breaks something, you can delete the branch and your v14 branch remains intact.

## 0.5 Run the baseline checks

```bash
npm ci
npm run lint
npm run test
npx tsc --noEmit
npm run build
```

If any of these fail before v15 changes, stop. The baseline is not clean, and you should fix that before adding new work.

---

# Part 1 — Add CI first

## Goal

Make GitHub run the same checks automatically when you push or open a PR.

## Why this comes first

You are using agents. Agents are useful, but they can make broad, hidden changes. CI gives you an objective red/green gate: lint, tests, typecheck, and build must pass before you trust the branch.

## Files to change

Create:

```text
.github/workflows/ci.yml
```

Use the `ci.yml` included in this pack.

## Manual implementation

```bash
mkdir -p .github/workflows
cp /path/to/v15_ir_worldview_pack/ci.yml .github/workflows/ci.yml
```

If you downloaded this pack to Downloads, adjust the path. For example:

```bash
cp ~/Downloads/v15_ir_worldview_pack/ci.yml .github/workflows/ci.yml
```

Then run:

```bash
npm run lint
npm run test
npx tsc --noEmit
npm run build
```

Commit:

```bash
git add .github/workflows/ci.yml
git commit -m "Add v15 CI verification workflow"
git push -u origin feature/v15-coherence-payoff
```

## GitHub branch protection

After the workflow has run at least once:

1. Open GitHub.
2. Go to repository Settings.
3. Go to Branches.
4. Add a branch protection rule for `main`. 
5. Enable “Require status checks to pass before merging.”
6. Select the CI check once it appears.

Do not panic if the check is not available immediately. GitHub usually shows checks only after they have run at least once.

## Acceptance criteria

- `.github/workflows/ci.yml` exists.
- GitHub Actions runs after pushing.
- Local `npm run lint`, `npm run test`, `npx tsc --noEmit`, and `npm run build` pass.

---

# Part 2 — Update project instructions for v15

## Goal

Tell every coding agent what v15 is and what it is not.

## Why this matters

Agents fail by doing too much. A clear `AGENTS.md` reduces drift. The current file already contains useful rules. You are not replacing the whole thing; you are updating the “Current sprint” section.

## Files to change

```text
AGENTS.md
```

## What to change

Replace the v14 sprint section with this:

```markdown
## Current sprint: V15 coherence and payoff

Current sprint is **V15 coherence and payoff**.

- Result-card payoff comes first: IR, AI, Profile, and Compare should lead with a plain-English judgment pattern before labels, modifiers, or technical caveats.
- Landing page should explain the product as a scenario-based inventory for geopolitical judgment, not a personality test and not a stack of unrelated quizzes.
- Do not change scoring, payload formats, family taxonomy, or module schema unless explicitly asked in a separate migration task.
- Do not add new modules, Three.js, accounts, or real research-data storage this sprint.
- Preserve share-link compatibility for Foundation, modules, AI Governance, Profile, and Compare.
- Research storage remains inactive. Opt-in copy may be clarified, but no server storage should be activated.
- Use existing tests and add small tests only when helper logic changes.
- After meaningful edits, run `npm run lint`, `npm run test`, `npx tsc --noEmit`, and `npm run build`.
```

## Acceptance criteria

- `AGENTS.md` says v15, not v14.
- It clearly forbids scoring/payload/module additions.
- It tells agents to run the full verification sequence.

Commit:

```bash
git add AGENTS.md
git commit -m "Update agent instructions for v15 coherence sprint"
```

---

# Part 3 — Rewrite the landing page around one promise

## Goal

A first-time user should understand, within ten seconds:

1. what this is;
2. why it is worth starting;
3. what they will get;
4. where AI Governance fits;
5. why it is not a personality test.

## Why this matters

Right now the product has many correct pieces, but the first screen still risks sounding like a tradition sorter. The landing page should frame the whole product as a personal briefing on geopolitical judgment.

## Files likely to change

```text
app/page.tsx
components/landing/resume-cta.tsx
app/globals.css
```

Do not touch:

```text
lib/scoring.ts
lib/share.ts
lib/quiz-schema.ts
lib/modules/*
lib/ai-governance-*
```

## Implementation brief

The landing page should have:

1. A wide editorial hero, not a narrow mobile-like column.
2. Primary CTA: Start the Foundation.
3. Secondary CTA: Try AI Governance.
4. Tertiary educational route: Explore the field guide.
5. A sample result card showing the new result logic.
6. A concise architecture row: Foundation → Focus-area modules → Profile.
7. Methods / Atlas / References below the fold.

## Acceptance criteria

- The hero does not say “Find out which IR tradition shapes your instincts.”
- It says the product is not a personality test.
- Foundation is the default start.
- AI Governance is a visible parallel entry, not a disconnected second product.
- Explore is framed as useful educational context, not a consolation route.
- Desktop layout uses the screen more confidently.
- Mobile still stacks cleanly.

## Verification

```bash
npm run lint
npm run test
npx tsc --noEmit
npm run build
npm run dev
```

Manual QA:

- Open `/` on desktop.
- Open `/` on mobile width.
- Click Foundation, AI Governance, Explore, Methods, Profile.
- Confirm no route 404s.

Commit:

```bash
git add app/page.tsx components/landing/resume-cta.tsx app/globals.css
git commit -m "Clarify v15 landing page promise and entry points"
```

If only one or two of those files changed, commit only those files.

---

# Part 4 — Redesign the shared result hero

## Goal

The result hero should answer: “What is my pattern?” before it names the formal tradition or modifiers.

## Why this matters

The current result hero supports a label, modifier chips, summary, and finding. That structure is useful, but the visual hierarchy still makes the label stack too prominent. v15 should demote labels and lead with the user’s judgment pattern.

## Files likely to change

```text
components/results/result-card-hero.tsx
app/results/[payload]/page.tsx
app/ai/results/[payload]/page.tsx
app/globals.css
```

Do not touch scoring or payload files.

## Safe design

Keep `ResultCardHero` backward-compatible if possible. Add optional props rather than breaking every caller.

Recommended prop additions:

```ts
patternTitle?: string
labelMeta?: string
plainLanguageTakeaway?: string
secondaryMeta?: string[]
```

Or, if the agent prefers a simpler diff, keep the current props but change how they are rendered:

- `label` becomes smaller metadata if `finding` or summary provides a stronger pattern.
- `summary` gets the hero emphasis.
- modifier chips move below the summary and use muted styling.

## Hero content hierarchy

1. Eyebrow: “Foundation result” / “AI Governance result”
2. Pattern headline: “Rules when they bite; leverage when they do not.”
3. Plain-English summary.
4. Non-obvious finding / tension.
5. Metadata row: closest tradition, secondary pull, strategy style, normative style.
6. Actions: Share, save, open Profile, read Methods.

## Acceptance criteria

- No result hero opens with three equally loud labels.
- Modifier chips are visible but not dominant.
- The summary reads like an editorial result, not a model report.
- AI Governance uses the same hierarchy.
- Invalid result pages still work.
- Share links still open.

## Verification

Use a known existing Foundation result link and AI result link. If you do not have one, generate one locally.

```bash
npm run lint
npm run test
npx tsc --noEmit
npm run build
```

Commit:

```bash
git add components/results/result-card-hero.tsx app/results/[payload]/page.tsx app/ai/results/[payload]/page.tsx app/globals.css
git commit -m "Make result heroes verdict-first across IR and AI"
```

---

# Part 5 — Add Foundation payoff sections

## Goal

Turn the Foundation result from “here is your label and scores” into “here is how you read world politics.”

## Why this matters

Your senior colleague’s “cool but confusing” reaction is a payoff problem. Users need interpretation, not just classification.

## Files to create

```text
lib/results/foundation-payoff.ts
components/results/foundation-payoff-sections.tsx
```

If the repo does not have `lib/results`, create it:

```bash
mkdir -p lib/results
```

## Files to edit

```text
app/results/[payload]/page.tsx
app/globals.css
```

## Important constraint

This must be share-link safe. It should derive everything from the decoded Foundation payload and canonical result:

- dimension scores;
- closest family;
- runner-up family;
- strategy modifier;
- normative modifier.

Do not require raw answers.

## Content sections to add

### 1. Your core pattern

Three compact cards:

- What you notice first.
- What you tend to distrust.
- What you may underweight.

### 2. Your main tension

One panel:

- Name the tension.
- Explain how it shows up.
- Name the rival argument.

### 3. How this changes your reading of live debates

Four cards:

- Great-power rivalry.
- Technology competition.
- Sanctions and supply chains.
- Humanitarian crisis.

Do not make claims about current facts. This section should describe lenses, not report news.

### 4. What to pressure-test next

One recommendation:

- Security module if the profile tension is rivalry/restraint/order.
- Technology module if the tension is markets/dependence/institutions/security.
- AI Governance if the profile shows technology or institutional tension.
- Explore/Atlas if the result is low-differentiation.

## Acceptance criteria

- The new sections appear above long evidence/readings/glossary material.
- The user can understand the result without knowing IR jargon.
- Each section answers a real user question.
- No new scoring calculation changes the result.
- Existing tests pass.

## Suggested helper function shape

```ts
export type FoundationPayoff = {
  corePattern: {
    noticeFirst: string
    distrust: string
    underweight: string
  }
  mainTension: {
    title: string
    body: string
    rivalArgument: string
  }
  lenses: Array<{
    title: string
    text: string
  }>
  nextStep: {
    href: string
    label: string
    reason: string
  }
}
```

## Verification

Generate at least three different results locally:

1. a clearly realist-ish result;
2. a clearly institutionalist-ish result;
3. a mixed/low-differentiation result.

For each, check:

- the payoff sections are not identical;
- the language is plain;
- the next step is sensible;
- nothing crashes in incognito share links.

Commit:

```bash
git add lib/results/foundation-payoff.ts components/results/foundation-payoff-sections.tsx app/results/[payload]/page.tsx app/globals.css
git commit -m "Add Foundation result payoff sections"
```

---

# Part 6 — Apply the same hierarchy to AI Governance

## Goal

AI Governance should feel like a serious standalone product, but structurally connected to the wider IR inventory.

## Why this matters

The AI result has the same disease as the IR result: archetype plus modifiers plus scores can feel like another label stack. It should lead with a governance instinct.

## Files likely to change

```text
app/ai/results/[payload]/page.tsx
components/results/ai-governance-profile-sections.tsx
lib/ai-governance-results-v2.ts
app/globals.css
```

Optional new files:

```text
lib/results/ai-governance-payoff.ts
components/results/ai-governance-payoff-sections.tsx
```

## Important constraint

Do not change AI scoring or AI payloads. Build from decoded AI payload data only.

## What to improve

1. The hero should lead with the governing instinct.
2. Clarity / hybrid language should not dominate.
3. Axis scores should be below the first synthesis block.
4. A “policy debates you will read differently” section should explain what the result changes.
5. The bridge to IR Foundation should be visible but not needy.

## Acceptance criteria

- AI result can stand alone.
- AI result still links to IR Foundation as optional depth.
- The archetype remains visible but secondary to the explanation.
- Axis bars do not appear before the main payoff.
- Shared AI result links still work.

Commit:

```bash
git add app/ai/results/[payload]/page.tsx components/results/ai-governance-profile-sections.tsx lib/ai-governance-results-v2.ts app/globals.css
git commit -m "Make AI Governance results verdict-first"
```

Adjust the file list to match what actually changed.

---

# Part 7 — Reframe Compare around one sharp disagreement

## Goal

Make Compare more social and more insightful.

## Why this matters

Users do not want a spreadsheet of deltas. They want to know: “What would we argue about?”

## Files likely to change

```text
app/compare/page.tsx
components/profile/profile-compare.tsx
lib/profile-compare.ts
app/globals.css
```

## Implementation idea

Add a top card above the detailed comparison:

```text
The argument you would probably have
```

Use the existing `biggestDivergence` logic, but turn it into plain English.

Example:

```text
You two do not mainly disagree about the label. You split on institutions and rules. One profile starts from rules as tools that can change incentives. The other starts from skepticism that rules survive once power is under pressure.
```

## Acceptance criteria

- Compare still works without a backend.
- It still accepts shared-profile links or payloads.
- It does not create a compatibility score.
- The top insight is understandable without reading the full table.
- The detailed rows remain available below.

Commit:

```bash
git add app/compare/page.tsx components/profile/profile-compare.tsx lib/profile-compare.ts app/globals.css
git commit -m "Reframe profile comparison around the main disagreement"
```

---

# Part 8 — Improve Profile no-data and loading states

## Goal

The Profile page should not look broken before local browser data loads.

## Why this matters

Profile is client-side because it reads local device storage. Search/crawler sessions or first-time users may briefly see only “Loading your profile…”. Make that state explanatory, not empty.

## Files likely to change

```text
components/profile/profile-dashboard.tsx
app/globals.css
```

## What to change

Loading state:

```text
Loading your Profile from this browser…
Profile is stored locally on this device unless you choose to share it.
```

No-data state:

```text
Your Profile builds as you complete layers.
Start with the Foundation. Your results stay on this device unless you choose to share them.
```

Buttons:

- Start the Foundation
- Try AI Governance
- Browse the field guide

## Acceptance criteria

- First-time Profile page explains what to do.
- Loading state is not just a bare line.
- No account or backend is implied.
- Mobile layout works.

Commit:

```bash
git add components/profile/profile-dashboard.tsx app/globals.css
git commit -m "Improve Profile loading and empty states"
```

---

# Part 9 — Tighten research opt-in copy without activating storage

## Goal

Make data language trustworthy and precise.

## Why this matters

Geopolitical and AI-governance views can be sensitive. “Anonymous” is not always accurate if there is any persistent session or contact path. Use “de-identified” or “pseudonymous” unless the architecture truly prevents linking.

## Files likely to change

```text
components/research/research-opt-in.tsx
app/privacy/page.tsx   # only if this page already exists or you choose to add it
app/globals.css
```

## Rules

- Do not add real data storage.
- Do not add analytics vendors.
- Do not collect raw answers.
- Do not imply opt-in is required to see results.
- Make the current state explicit: UI only, no submission.

## Acceptance criteria

- Copy says users can use/share results without contributing.
- Copy says current build does not send answers from the block.
- It uses “pseudonymous” or “de-identified,” not casual “anonymous.”
- No new API route is added.

Commit:

```bash
git add components/research/research-opt-in.tsx app/globals.css
git commit -m "Clarify research opt-in copy without activating storage"
```

---

# Part 10 — Full verification and preview deploy

Run:

```bash
npm run lint
npm run test
npx tsc --noEmit
npm run build
```

Then run locally:

```bash
npm run dev
```

Manually test these routes:

```text
/
/quiz
/quiz/review
/results/[payload]
/modules
/modules/security
/modules/technology
/ai
/ai/quiz
/ai/review
/ai/results/[payload]
/profile
/compare
/explore
/explore/atlas
/method
/references
/feedback
```

You do not need to test every dynamic payload by hand, but you should test at least one real Foundation result, one AI result, one Profile, and one Compare flow.

Push:

```bash
git push
```

Open the Vercel preview and test again in an incognito window.

---

# Part 11 — User test before public sharing

Use 5 testers:

1. one policy/IR person;
2. one AI-governance person;
3. one smart general reader;
4. one skeptical friend;
5. one design-sensitive person.

Ask:

1. What do you think this site is for after 10 seconds?
2. What did the result tell you beyond the label?
3. What was confusing?
4. What would you click next?
5. Would you share this result with someone?
6. Did it feel credible? Why or why not?

Do not fix every comment. Bucket feedback into:

- comprehension blocker;
- result payoff problem;
- bug;
- visual polish;
- methodology concern;
- future idea.

Only fix comprehension blockers, payoff problems, and bugs before the next round.
