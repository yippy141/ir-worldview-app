# IR Worldview Inventory

IR Worldview Inventory is a Next.js editorial interactive about how people read world politics. The product has two clear entry points: the IR Foundation and the standalone AI Governance Compass. Security and Technology Focus Areas add issue-specific depth, Perspective Runs test contextual shifts, and Profile brings saved layers together on one device.

## Project overview

- The quiz produces an interpretive summary, not a natural-kind identity.
- Results are generated canonically through `/results/[payload]`, so links can be refreshed, shared, and reopened directly.
- Explore pages function as a field guide to modeled worldview families, Worldview profiles, and important traditions that are not yet fully modeled.
- Focus Areas use explanation, decision, and actor-lens cards; actor-lens responses are tracked separately from the main issue read.
- Perspective Runs compare contextual advice with the saved Foundation baseline without changing Foundation scoring.
- AI Governance can stand alone as an AI-policy entry point, with the IR Foundation available as optional depth.
- AI Atlas and AI Field Guide are browse-and-learn surfaces within the AI Governance section.

## Main routes

- `/` full-screen World Stage navigation with five reviewed public map views
- `/about` project overview and editorial limits
- `/quiz` Foundation questionnaire with local draft resume
- `/quiz/review` required Foundation answer review before result generation
- `/results/[payload]` canonical result page for encoded share payloads
- `/modules` Security and Technology Focus Areas
- `/modules/[slug]` Focus Area questionnaire
- `/modules/[slug]/results/[payload]` canonical Focus Area result page
- `/perspectives` available Perspective Runs
- `/perspectives/[perspectiveId]` contextual decision run
- `/perspectives/[perspectiveId]/result/[payload]` canonical Perspective Run result page
- `/ai` AI Governance Compass landing page
- `/ai/quiz` AI governance questionnaire
- `/ai/review` answer review before AI result generation
- `/ai/results/[payload]` canonical AI governance result page
- `/ai/atlas` AI governance archetype overview
- `/ai/atlas/[id]` AI governance archetype detail pages
- `/ai/field-guide` AI governance field guide
- `/profile` local profile built from saved Foundation, Focus Area, Perspective Run, and AI snapshots
- `/profile/share/[payload]` canonical shared profile view
- `/compare` side-by-side profile comparison
- `/explore/atlas` Worldview Map with list and map views
- `/explore/atlas/[id]` Worldview profile detail page
- `/explore/reference` Thinkers & public positions
- `/explore/reference/[id]` evidence-coded thinker or public-position detail page
- `/explore` worldview field guide overview
- `/explore/[slug]` modeled worldview detail pages
- `/futures` editorial scenarios for possible world orders
- `/method` methodology and limitations
- `/learn` additional explanatory content
- `/references` key sources and reading list
- `/feedback` factual corrections, privacy questions, and security reports
- `/beta` optional controlled-beta recruitment and product-feedback guidance
- `/cases` published Current Case archive
- `/cases/[slug]` evidence-backed Current Case judgment flow, sharing, and print summary

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

### Controlled beta participation

Set `V22_5_BETA_PARTICIPATION_URL` to an owner-reviewed HTTPS interview
scheduler or feedback form. If the value is absent or invalid, `/beta` remains
available and explains that participation is not currently open from the page.

Set `V22_5_BETA_NAV_ENABLED=true` only when the beta route should appear in the
desktop and mobile primary navigation. Configuring the external URL alone does
not expose the route in navigation. The app does not collect beta free text or
contact data; submissions are handled by the configured external service.

### Optional Mapbox background

Set `NEXT_PUBLIC_MAPBOX_TOKEN` to enable the live World Stage map. The token is
public by design and must be restricted by allowed URL referrers in the Mapbox
dashboard, including the production domain, preview domains, and local hosts
used for development. If the token is absent, rejected, or WebGL is unavailable,
the homepage keeps its local SVG map.

For local development, add the token to `.env.local` (which must remain
uncommitted), then restart the development server:

```bash
NEXT_PUBLIC_MAPBOX_TOKEN=your_public_token_here
NEXT_PUBLIC_MAPBOX_STYLE=mapbox://styles/YOUR_ACCOUNT/YOUR_STYLE_ID
```

`NEXT_PUBLIC_MAPBOX_STYLE` is optional. When it is unset, the World Stage uses
`mapbox://styles/mapbox/dark-v11`.

For Vercel, add `NEXT_PUBLIC_MAPBOX_TOKEN` in Project Settings → Environment
Variables for Production and any Preview/Development environments that should
render the live map. Add `NEXT_PUBLIC_MAPBOX_STYLE` there when using a custom
style, then redeploy. Never place the token in source files.

### Tier 1 aggregate database

Set the server-only `DATABASE_URL` to a Neon Postgres connection string
compatible with `@neondatabase/serverless`. Apply the SQL files in
`db/migrations/` in numeric order. `DATABASE_URL` alone does not activate
collection: set `TIER1_AGGREGATES_ENABLED=true` only after the migrations have
been executed and inspected in that environment, the exact aggregate-only
write contract has been verified, silent-failure tests pass, and server-side
small-cell suppression is confirmed. Until then, result, completion-step, and
item-response-latency counters and percentile display are intentional no-ops.

Do not prefix this variable with `NEXT_PUBLIC_`: it must never be included in
the browser bundle. The same applies to `TIER1_AGGREGATES_ENABLED`. Tier 1
stores derived aggregate counters only; it does not
store raw answers, raw timestamps, response ordering, respondent or session
rows, consent records, contact information, cookies, or other identifiers.
Counters are separated by exact item form, completion locale, and locale-copy
version. The browser measurement opt-out suppresses both Tier 1 and product
analytics submissions.

Production activation is owner-operated. Follow
`docs/operations/TIER1_PRODUCTION_ACTIVATION.md`; automated coding tasks must
not change Vercel or Neon. The local `tier1:preflight` and `tier1:verify`
commands use read-only database transactions, accept the operations connection
through the environment, and never print connection or result-link details.

The later opt-in research layer can replay stored Foundation answers with an
immutable scoring implementation:

```bash
npm run replay:scoring -- v2
```

Replay reads only completed Foundation sessions whose respondent has explicit
research consent and whose session carries the same nonblank consent receipt.
It accepts only complete, exact V1 or V2 forms with valid mode, item-bank,
answer, and option provenance. V1 and V2 use different item banks, so
cross-version replay is rejected until an explicit compatibility mapping is
reviewed.

The replay upserts `research_derived_results` by session and scoring version and
never updates `research_answers`. Any quarantined session makes the command
exit nonzero. The operator-only `--allow-quarantined-sessions` override should
be used only after reviewing every reported failure. This remains dormant
research infrastructure; it is not authority to collect raw answers or enable
the deferred Tier 2 layer.

### Current Case invitations

V19 shares ordinary case-only invitations. The former encrypted, answer-bearing
friend challenge is retired; its legacy routes return `410` without reading request
bodies, and no challenge encryption secret is used.

Set the server-only `SITE_URL` to the canonical HTTPS origin in production so
Open Graph image and canonical URLs use the public domain. On Vercel, the app falls
back to `VERCEL_PROJECT_PRODUCTION_URL` when `SITE_URL` is absent.

## Verification

Run linting:

```bash
npm run lint
```

Run the focused hardening tests:

```bash
npm run test
```

Run the TypeScript check:

```bash
npx tsc --noEmit
```

Run the production build:

```bash
npm run build
```

Run the critical browser smoke suite:

```bash
npx playwright test
```

Before a production release, complete
[`docs/deployment/V19_PRODUCTION_DEPLOYMENT_CHECKLIST.md`](docs/deployment/V19_PRODUCTION_DEPLOYMENT_CHECKLIST.md).
The V19 event catalog, privacy boundary, data-flow diagram, and aggregate funnel queries live in
[`docs/analytics/V19_PRODUCT_MEASUREMENT.md`](docs/analytics/V19_PRODUCT_MEASUREMENT.md).

## Repository notes

- Canonical worldview keys and slugs live in `lib/worldview-config.ts`.
- Foundation share payload encoding and decoding live in `lib/share.ts`; AI governance share payloads live in `lib/ai-governance-share.ts`; profile-share encoding lives in `lib/profile-share.ts`.
- Archived planning and spec documents are kept under `docs/archive/`.
