# IR Worldview Inventory

IR Worldview Inventory is a Next.js editorial interactive about how people read world politics. The product starts with a seven-dimension Foundation result, adds issue-specific Security and Technology modules, and brings saved results together in an integrated Profile.

## Project overview

- The quiz produces an interpretive summary, not a natural-kind identity.
- Results are generated canonically through `/results/[payload]`, so links can be refreshed, shared, and reopened directly.
- Explore pages function as a field guide to the modeled worldview families, recurring profile patterns, and important traditions that are not yet fully modeled.
- Focus-area modules use explanation, decision, and actor-lens cards; actor-lens responses are tracked separately from the main module read.

## Main routes

- `/` landing page and product framing
- `/quiz` quiz flow
- `/quiz/review` required answer review before result generation
- `/results/[payload]` canonical result page for encoded share payloads
- `/modules` Security and Technology issue files
- `/modules/[slug]/results/[payload]` canonical module result pages
- `/profile` integrated local profile built from saved Foundation and module snapshots
- `/explore` worldview field guide overview
- `/explore/[slug]` modeled worldview detail pages
- `/method` methodology and limitations
- `/learn` additional explanatory content

## Methodology limitations

- This is an editorial interpretation tool, not a validated psychometric instrument.
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
- Foundation share payload encoding and decoding live in `lib/share.ts`; profile-share encoding lives in `lib/profile-share.ts`.
- Archived planning and spec documents are kept under `docs/archive/`.
