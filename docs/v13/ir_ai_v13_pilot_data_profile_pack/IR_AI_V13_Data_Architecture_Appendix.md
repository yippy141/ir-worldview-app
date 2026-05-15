# V13 data architecture appendix

## Goal
Collect useful insight data from beta users while preserving trust.

You want to learn:
- where users drop off
- which results are overproduced
- which questions confuse people
- how Foundation, Modules, AI, and Profile interact
- what aggregate insight posts could be written

You do not want:
- ad targeting
- covert political profiling
- hidden session replay
- raw answers inside third-party analytics
- unnecessary personal information
- a full account system

## Important language correction
If the app stores raw answers plus a persistent respondent ID, that dataset is not strictly anonymous. It is better described as **pseudonymous** or **de-identified**.

Use “anonymous” only for aggregate analytics where no respondent-level answer history is stored.

## Two-layer model

### Layer A — anonymous aggregate product analytics
Purpose:
- page views
- top routes
- referrers
- device category
- broad completion/drop-off

Recommendation:
- Vercel Web Analytics is acceptable for page/funnel analytics because it is designed for aggregate, privacy-oriented analytics and does not need raw answer payloads.

Rule:
- Do not send raw answers, result labels, emails, or respondent IDs to third-party analytics.

### Layer B — opt-in pseudonymous research response storage
Purpose:
- answer distribution analysis
- result distribution analysis
- question hardening
- aggregate insight posts
- future methodology posts

Recommendation:
- first-party Next.js Route Handlers
- managed Postgres
- no auth/account system in V13
- raw responses only after explicit opt-in

## Recommended stack

### App
- Existing Next.js app on Vercel
- App Router Route Handlers under `app/api/research/`

### Database
Choose one:

1. **Supabase Postgres** — novice-friendly UI, SQL editor, easy setup.
2. **Neon Postgres** — simple managed Postgres, good with Vercel.
3. **Vercel Postgres/marketplace Postgres** — if already integrated in your Vercel account.

Recommended novice default: Supabase Postgres, with server-side inserts only.

## API design

### `POST /api/research/submit`
Stores opt-in research responses.

Required fields:
- `respondentId`
- `sessionId`
- `consentVersion`
- `instrument`
- `instrumentVersion`
- `scoringVersion`
- `mode`
- `startedAt`
- `completedAt`
- `answers`
- `derived`

Rules:
- reject if `researchConsent !== true`
- reject oversized payloads
- reject contact info inside the answer payload
- store contact info only through a separate path/table

### `POST /api/research/delete`
Queues or performs deletion for a respondent/session.

Required fields:
- `respondentId` or `sessionId`

Rules:
- if no contact info is associated, deletion is best-effort by stored ID
- if contact info is associated, use a manual confirmation workflow later

### Optional `POST /api/research/event`
Only use this if you want first-party product events beyond Vercel Analytics.

Rules:
- no raw answers
- no result labels unless user opted into research storage
- no email or contact info

## Client identity model

No accounts in V13.

Use:
- client-generated UUID
- stored in localStorage
- used only as a pseudonymous respondent ID

Important: explain to users that this is not a public identity and that clearing browser storage may remove local profile continuity.

## Suggested database schema

See `V13_research_schema.sql` in this pack.

Tables:
- `research_respondents`
- `research_sessions`
- `research_answers`
- `research_derived_results`
- `research_events`
- `research_contact_opt_in`
- `research_deletion_requests`
- `research_feedback`

## Versioning

Every stored session must include:
- `instrument_version`
- `scoring_version`
- `consent_version`
- `app_version` or commit SHA if available

This matters because the product changes often.

## Retention

Recommended beta default:
- raw research responses: 12 months, then review/prune
- aggregate analytics: per vendor defaults unless exported
- optional contact emails: 6 months unless renewed
- deletion requests: keep minimal audit trail of completed deletion without keeping old answer data

## Deletion path

Expose a simple route or feedback form:
- “I opted into research storage and want deletion.”
- Ask for respondent ID/session ID if available.
- If user has no ID, give a best-effort explanation.

## Aggregate exports

Build a simple admin script later, not a dashboard now.

Acceptable export:
- CSV/JSON of aggregate counts
- result distribution by version
- question distribution by version
- completion rates

Do not export:
- raw small-N cohorts for public posts
- user-level traces with contact info
- anything that could identify a person through combinations of responses

## Monetization compatibility

This architecture leaves room for future paid products without betraying current trust:
- premium deeper reports
- workshop mode
- classroom cohorts
- reading bundles
- cohort-level aggregate summaries

It does not support and should not support:
- selling user profile data
- political targeting
- ad-targeted segments
- hidden enrichment
