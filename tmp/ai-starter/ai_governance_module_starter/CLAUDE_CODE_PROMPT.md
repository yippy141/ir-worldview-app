You are implementing a new AI Governance module inside an existing Next.js App Router project.

## Goal

Build a first working MVP for an `AI Governance Compass` module using the provided starter files.

## Existing project assumptions

- There is already an IR quiz flow.
- The project already has a `components/quiz-app.tsx` pattern.
- The project already has result-page helpers and a share flow.
- Do not redesign the whole app.
- Do not refactor the whole ontology.
- Do not add a database.

## Required deliverable

Add a new route and quiz flow for an AI governance module that:

1. uses the new AI schema and scoring files
2. has its own quiz page
3. has its own result page
4. preserves the current visual language as much as possible
5. clearly labels the module as beta / prototype

## Files to add

- `lib/ai-governance-types.ts`
- `lib/ai-governance-schema.ts`
- `lib/ai-governance-scoring.ts`
- `lib/ai-governance-results.ts`
- `components/ai-governance-quiz-app.tsx`
- `app/ai/page.tsx`
- `app/ai/results/[payload]/page.tsx`

## Fast implementation strategy

### 1. Copy the current quiz UI

Duplicate the current quiz component rather than over-refactoring.
Swap imports so it reads from the AI governance schema and scoring helpers.

### 2. Keep the same interaction model

- localStorage persistence
- progress indicator
- back / next / reset
- review page only if easy to preserve

If review mode is annoying to port quickly, keep it simple and skip advanced review polish for now.

### 3. Result page

Build a result page that shows:

- archetype title
- risk lens
- pace modifier
- geopolitics modifier
- plain-English summary
- axis cards
- tensions
- nearest neighboring archetype

### 4. Copy discipline

Use plain English.
Avoid academic throat-clearing above the fold.

Good:
- You usually slow down once capabilities cross a threshold.
- You treat coordination as necessary, even under rivalry.
- You are more willing to place frontier AI under public oversight.

Avoid:
- integrated synthesis
- nearest-fit taxonomy
- the model reveals
- this instrument demonstrates

## Constraints

- Do not change the existing IR quiz behavior unless needed for shared utilities.
- Keep TypeScript types strict.
- Keep imports clean.
- Keep the new module isolated enough that it can ship quickly.

## Nice-to-have

If easy, add a small landing page card on the home page linking to `/ai`.

## Final output

Make the code compile.
Then provide a concise summary of:

- files added
- files touched
- anything still stubbed or rough
