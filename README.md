# IR Worldview Inventory

IR Worldview Inventory is a Next.js interactive that classifies a user's International Relations instincts across seven analytical dimensions, then summarizes the nearest modeled worldview family and modifiers. The product is designed as an editorial, policy-journal-style experience rather than a dashboard or personality-test toy.

## Project overview

- The quiz produces an interpretive summary, not a natural-kind identity.
- Results are generated canonically through `/results/[payload]`, so links can be refreshed, shared, and reopened directly.
- Explore pages function as a field guide to the modeled worldview families and to important traditions that are not yet fully modeled.

## Main routes

- `/` landing page and product framing
- `/quiz` quiz flow
- `/quiz/review` required answer review before result generation
- `/results/[payload]` canonical result page for encoded share payloads
- `/explore` worldview field guide overview
- `/explore/[slug]` modeled worldview detail pages
- `/method` methodology and limitations
- `/learn` additional explanatory content

## Methodology limitations

- This is a prototype classification model, not a validated psychometric instrument.
- Scores are positions within this model. They are not population percentiles.
- Worldview families are shorthand summaries of a multidimensional profile, not fixed essences.
- Only four traditions are directly modeled in scoring right now: realism, institutionalism, constructivism, and critical political economy.
- Several important traditions remain under-modeled or unmodeled and are described editorially in Explore rather than emitted as scored outputs.
- The app does not adjust scoring by nationality, citizenship, or culture in the current phase.

## Local development

Requirements:
- Node.js 22 or later
- npm

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open `http://localhost:3000`.

## Verification

Run linting:

```bash
npm run lint
```

Run the focused hardening tests:

```bash
npm run test
```

## Repository notes

- Canonical worldview keys and slugs live in `lib/worldview-config.ts`.
- Share payload encoding and decoding live in `lib/share.ts`.
- Archived planning and spec documents are kept under `docs/archive/`.
