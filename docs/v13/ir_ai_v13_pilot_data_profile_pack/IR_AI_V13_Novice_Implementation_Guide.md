# IR + AI V13 novice implementation guide

This guide assumes you are using VS Code, Git, Vercel, and either Claude Code or Codex. It is written for a non-engineer.

## What V13 is trying to do
V13 is not another redesign. It is the sprint that makes the project safe enough and clear enough to trial beyond close friends.

V13 has five goals:

1. Make Profile feel like one integrated read, not a pile of summaries.
2. Fix trust inconsistencies such as second-choice weighting and AI clarity language.
3. Lightly audit the question bank without rewriting the whole quiz.
4. Make the AI Atlas cards click into useful detail pages.
5. Add privacy-first response-data scaffolding so you can learn from beta users.

## What you need before starting
You need:
- your repo open in VS Code
- a working Vercel deployment
- your current feature branch checked out
- Claude Code and/or Codex available
- this V13 pack downloaded

You do **not** need to create a database immediately. The database part can be scaffolded first and activated later.

---

# Step 0 — Make a safety checkpoint

Open the VS Code terminal at your repo root.

Run:

```bash
git status
```

If you see uncommitted changes that you want to keep, commit them:

```bash
git add -A
git commit -m "Checkpoint before V13 pilot-data sprint" || true
```

Create a backup branch and tag:

```bash
git branch backup/pre-v13-pilot-data

git tag pre-v13-pilot-data-safe
```

Create the V13 working branch:

```bash
git checkout -b feature/v13-pilot-data-profile
```

Push the backup branch and working branch:

```bash
git push origin backup/pre-v13-pilot-data

git push -u origin feature/v13-pilot-data-profile

git push origin pre-v13-pilot-data-safe
```

If any push fails because the branch/tag already exists, that is usually fine. Continue.

---

# Step 1 — Put the V13 pack inside the repo as reference docs

Create the docs folder:

```bash
mkdir -p docs/v13 plans
```

Copy the V13 pack files into `docs/v13/`. If the zip is in Downloads, use:

```bash
unzip -o "$HOME/Downloads/ir_ai_v13_pilot_data_profile_pack.zip" -d /tmp/ir-ai-v13-pack
cp -R /tmp/ir-ai-v13-pack/ir_ai_v13_pilot_data_profile_pack/* docs/v13/
```

If your zip has a slightly different folder name, open Finder, drag the files into `docs/v13/`, then continue.

Commit the reference docs:

```bash
git add docs/v13 plans

git commit -m "Add V13 implementation reference docs" || true
```

---

# Step 2 — Create the V13 source-of-truth file

Run:

```bash
cat > plans/V13_SOURCE_OF_TRUTH.md <<'EOF2'
# V13 source of truth

## Sprint goal
Make the product pilotable beyond friends by improving Profile payoff, correcting trust/precision inconsistencies, strengthening AI Atlas depth, and adding privacy-first response-data scaffolding.

## Product lane
Serious editorial interactive with a thin share/research layer.

## In scope
- Profile payoff and anchored-spread simplification
- Methods/scoring consistency check
- AI clarity/settledness demotion
- AI Atlas card detail links
- AI Field Guide cross-linking
- Question hardening lite audit
- Privacy note and opt-in research-response architecture
- Optional database storage behind env flags
- Public repo/release hygiene

## Out of scope
- New scored IR families
- New live IR modules
- New AI archetypes
- Full psychometric validation
- Accounts, login, social auth
- Adtech, session replay, heatmaps
- Broad question-bank rewrite
- Full redesign of all surfaces

## Privacy rule
Raw worldview/political-governance answers must never be sent to third-party analytics. Stored research responses are opt-in and pseudonymous, not strictly anonymous.
EOF2
```

Commit it:

```bash
git add plans/V13_SOURCE_OF_TRUTH.md

git commit -m "Add V13 source of truth" || true
```

---

# Step 3 — Run Prompt 0 audit with Codex or Claude Code

Use the first prompt from `IR_AI_V13_Codex_Prompts.txt` or `IR_AI_V13_Claude_Code_Prompts.txt`.

Prompt 0 should not change app code. It should create:

```text
plans/V13_AUDIT.md
```

After the agent finishes, run:

```bash
git diff --stat
sed -n '1,240p' plans/V13_AUDIT.md
```

If the audit looks reasonable, commit it:

```bash
git add plans/V13_AUDIT.md

git commit -m "Add V13 audit" || true
```

Stop and skim the audit before continuing.

---

# Step 4 — Profile payoff pass

Use Claude Code if available. Use Codex if Claude usage is exhausted.

Run Prompt 1.

Expected changes may touch files like:
- `components/profile/profile-report.tsx`
- `components/profile/*`
- `app/profile/page.tsx`
- `app/globals.css`
- shared visual primitives if already present

After the agent finishes:

```bash
npm run lint
npm run test
npm run build
```

Open locally:

```bash
npm run dev
```

Then visit:
- `http://localhost:3000/profile`
- one saved profile if you have local data
- Foundation result page
- module result page
- AI result page

Manual check:
- Profile top should have one clear headline.
- If there are 2+ layers, it should lead with integrated pattern, not only Foundation.
- There should be one dominant visual, not multiple competing diagrams.
- Stable/shift/tension should not be repeated in three different sections.

Commit:

```bash
git add -A

git commit -m "Simplify Profile payoff for V13" || true
```

---

# Step 5 — Method truthfulness + scoring consistency

Use Codex for this pass.

Run Prompt 2.

The agent should:
- identify whether code uses 0.45 or 0.35 second-choice weight
- make Methods match code, or explicitly adjust code/tests if you choose that route
- demote AI clarity/settledness labels from hero/result top surfaces
- add or preserve “closest modeled fit” language
- keep overlay visuals labeled as directional pulls

After it finishes:

```bash
npm run lint
npm run test
npm run build
```

Commit:

```bash
git add -A

git commit -m "Reconcile V13 method and precision signals" || true
```

---

# Step 6 — AI Atlas detail pages + Field Guide links

Use Claude Code or Codex.

Run Prompt 3.

Expected outcome:
- `/ai/atlas` cards are clickable
- each AI archetype has a detail page or detail route
- cards stay compact
- detail pages carry deeper explanation, comparisons, reading links, and current debate notes
- `/ai/field-guide` links back to Atlas and details

Checks:

```bash
npm run lint
npm run test
npm run build
npm run dev
```

Manual pages:
- `http://localhost:3000/ai`
- `http://localhost:3000/ai/atlas`
- click every AI Atlas card
- `http://localhost:3000/ai/field-guide`

Commit:

```bash
git add -A

git commit -m "Add AI Atlas detail depth for V13" || true
```

---

# Step 7 — Question hardening lite audit

Run Prompt 4.

The agent should create:

```text
plans/V13_QUESTION_HARDENING_AUDIT.md
```

It may also make 3–5 targeted wording changes if they are clearly confusing.

Checks:

```bash
npm run lint
npm run test
npm run build
```

Commit:

```bash
git add -A

git commit -m "Add V13 question hardening audit" || true
```

---

# Step 8 — Privacy note and consent UI

Run Prompt 5.

Expected outcome:
- privacy note/page exists
- research opt-in component exists, but unchecked by default
- copy says pseudonymous/de-identified, not fully anonymous, for raw stored responses
- product use works without opt-in
- optional email/contact is separate from responses

Checks:

```bash
npm run lint
npm run test
npm run build
```

Manual pages:
- privacy page or methods privacy section
- result pages where opt-in appears
- feedback/deletion path

Commit:

```bash
git add -A

git commit -m "Add V13 privacy and research opt-in surfaces" || true
```

---

# Step 9 — Data layer scaffolding without turning it on yet

Run Prompt 6.

Expected outcome:
- route handlers exist for research submit/delete/event or a smaller chosen subset
- database client is server-only
- env vars gate storage
- if env vars are missing, app still builds and opt-in gracefully says storage is unavailable or disabled
- no raw answers go to Vercel Analytics or other third-party analytics

Checks:

```bash
npm run lint
npm run test
npm run build
```

Commit:

```bash
git add -A

git commit -m "Scaffold V13 research data routes" || true
```

---

# Step 10 — Optional database setup

Only do this if you are ready to collect opt-in responses.

Recommended novice path: Supabase Postgres.

1. Create a Supabase project.
2. Open SQL Editor.
3. Paste `docs/v13/V13_research_schema.sql`.
4. Run the SQL.
5. Add server-only env vars to `.env.local`.
6. Add the same env vars to Vercel Project Settings.

Do **not** put secret keys in Git.

Example `.env.local`:

```bash
RESEARCH_STORAGE_ENABLED=true
DATABASE_URL="postgresql://..."
RESEARCH_CONSENT_VERSION="2026-05-15-v1"
```

If using Supabase JS instead of direct Postgres, use server-only variables and never expose the service-role key to the browser.

---

# Step 11 — Release hygiene

Run Prompt 7.

It should:
- clean temp/backup artifacts
- update README/About language
- run `npx tsc --noEmit` once
- if fewer than 10 files fail typecheck, fix them
- if more than 10 files fail, document them in `plans/V13_TYPECHECK_DEFERRED.md`
- avoid surprise architecture changes

Checks:

```bash
npm run lint
npm run test
npm run build
npx tsc --noEmit || true
```

Commit:

```bash
git add -A

git commit -m "V13 release hygiene and typecheck visibility" || true
```

---

# Step 12 — Deploy preview and test

Push branch:

```bash
git push -u origin feature/v13-pilot-data-profile
```

Open the Vercel preview deployment for the branch.

Test:
- homepage
- Foundation quiz/result
- Security module
- Technology module
- AI quiz/result
- AI Atlas and detail pages
- AI Field Guide
- Profile
- Privacy note
- opt-in UI
- share links
- mobile width around 390px

---

# Step 13 — Run a small external beta

Start with 10–20 people, not the whole internet.

Ask them to do one of these:
- Foundation only
- Foundation + one module
- AI only
- Foundation + AI + Profile

Use the questions in `IR_AI_V13_Beta_Testing_Plan.md`.

Collect:
- whether they finished
- where they got bored
- whether Profile felt rewarding
- whether data opt-in felt clear and non-creepy
- which result sentence felt most like them
- which result sentence felt AI-written or too abstract

---

# Emergency rollback

If V13 gets messy:

```bash
git status

git checkout feature/ai-governance-compass
```

Or return to the backup branch:

```bash
git checkout backup/pre-v13-pilot-data
```
