# AI Governance Module Starter

This starter pack is designed for your existing `ir-worldview-app` architecture.

## What it contains

- `lib/ai-governance-types.ts`
- `lib/ai-governance-schema.ts`
- `lib/ai-governance-scoring.ts`
- `lib/ai-governance-results.ts`

The files give you a first serious MVP for an **AI Safety, Governance, and Alignment** module.
They are built to feel compatible with your current pattern:

- core likert questions
- branching scenario cards
- scenario-weighted scoring
- a primary result archetype plus modifiers

## Why this is the right first build

Do **not** start with a full crisis sim.

Start with a **module** that has:

1. a stable foundation ontology
2. several branching policy cases
3. one result page with archetype + modifiers + tensions
4. space to add later case packs

That gives you something publishable quickly.
Once the ontology is face-valid and people are sharing results, you can build a second product layer:

- `AI Crisis Lab`
- timed decisions
- longer actor-specific scenario chains
- compare how answers change by role or country lens

## Recommended product structure

### Layer 1: IR foundation
Keep your current IR worldview quiz.

### Layer 2: AI governance module
Add this as a flagship module on top of the IR foundation.

### Layer 3: Crisis lab
Later, build a more narrative branch-heavy mode using the same ontology.

## Suggested route structure

- `/ai` or `/modules/ai-governance`
- `/ai/results/[payload]`
- optional later: `/ai/crisis-lab`

## Integration plan

### 1. Copy the files into your repo

Suggested location:

- `lib/ai-governance-types.ts`
- `lib/ai-governance-schema.ts`
- `lib/ai-governance-scoring.ts`
- `lib/ai-governance-results.ts`

### 2. Duplicate the current quiz UI into a module-specific version

Fastest route:

- copy `components/quiz-app.tsx`
- rename to `components/ai-governance-quiz-app.tsx`
- swap imports from the IR schema/scoring files to these AI files
- update hero copy and result routing

You can refactor to a generic multi-module engine later.

### 3. Create a new page route

A simple first route can mirror your current `app/quiz/page.tsx`.

### 4. Create a new result page

Mirror your existing result page, but replace:

- family labels -> archetype labels
- dimension labels -> AI axis labels
- strategy/normative modifiers -> risk/pace/geopolitics modifiers

### 5. Launch with clear scope

Ship this as:

- AI governance worldview inventory
- beta / prototype
- regularly updated
- not a validated psychometric instrument

## Naming suggestions

- AI Governance Compass
- AI Safety & Governance Inventory
- Frontier Governance Profile
- AI Worldview Inventory

My recommendation:

**AI Governance Compass**

It is memorable, serious enough for policy audiences, and still shareable.

## Archetypes in this starter

- Precautionary Steward
- Strategic Competitor
- Coordination Architect
- Democratic Guardrailist
- State Capacity Builder
- Open Ecosystem Builder

These are intentionally not nationality-coded.
That matters if you want Chinese researchers, Global South policy people, and U.S./European users to all see themselves somewhere in the framework.

## What to add next

### Immediate next content pass

Add 8 to 12 more scenario cards around:

- compute governance
- chip export controls
- international standards setting
- lab-government relations
- open source vs closed release
- biosecurity dual use
- autonomous cyber operations
- model behavior that looks deceptive or hard to evaluate
- public sector adoption
- labor and welfare transition

### After that

Add localized copy and parallel English + Chinese content files.
Keep the ontology shared, but translate with native review rather than literal translation.

## Important design note

Your differentiator is **not** "an AI MBTI."

Your differentiator is:

**a serious but shareable map of how people think about AI governance under pressure.**

That is much more original and much more likely to get attention from policy and safety people.
