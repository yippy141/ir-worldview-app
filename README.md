# IR Worldview Inventory

IR Worldview Inventory is a Next.js editorial interactive about how people read world politics. The product starts with a seven-dimension IR Foundation result, adds issue-specific Security and Technology modules, includes a related AI Governance Compass, and brings saved layers together in Profile.

## Project overview

- The quiz produces an interpretive summary, not a natural-kind identity.
- Results are generated canonically through `/results/[payload]`, so links can be refreshed, shared, and reopened directly.
- Explore pages function as a field guide to the modeled worldview families, recurring profile patterns, and important traditions that are not yet fully modeled.
- Focus-area modules use explanation, decision, and actor-lens cards; actor-lens responses are tracked separately from the main module read.
- AI Governance can stand alone, but it is framed as a related layer that reads best beside the IR Foundation and saved modules.
- AI Atlas and AI Field Guide are browse-and-learn surfaces within the AI Governance section.

## Main routes

- `/` landing page and product framing
- `/quiz` quiz flow
- `/quiz/review` required answer review before result generation
- `/results/[payload]` canonical result page for encoded share payloads
- `/modules` Security and Technology issue files
- `/modules/[slug]/results/[payload]` canonical module result pages
- `/ai` AI Governance Compass landing page
- `/ai/quiz` AI governance questionnaire
- `/ai/review` answer review before AI result generation
- `/ai/results/[payload]` canonical AI governance result page
- `/ai/atlas` AI governance schools and traditions overview
- `/ai/atlas/[id]` AI governance tradition detail pages
- `/ai/field-guide` AI governance field guide
- `/profile` local profile built from saved Foundation, module, and AI snapshots
- `/profile/share/[payload]` canonical shared profile view
- `/compare` side-by-side profile comparison
- `/explore` worldview field guide overview
- `/explore/[slug]` modeled worldview detail pages
- `/explore/atlas` IR worldview pattern atlas overview
- `/explore/atlas/[id]` IR worldview pattern detail pages
- `/method` methodology and limitations
- `/learn` additional explanatory content
- `/references` key sources and reading list
- `/feedback` feedback form

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

Run the production build:

```bash
npm run build
```

## Repository notes

- Canonical worldview keys and slugs live in `lib/worldview-config.ts`.
- Foundation share payload encoding and decoding live in `lib/share.ts`; AI governance share payloads live in `lib/ai-governance-share.ts`; profile-share encoding lives in `lib/profile-share.ts`.
- Archived planning and spec documents are kept under `docs/archive/`.
