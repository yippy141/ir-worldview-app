# v15 Claude Design Brief

Use Claude Design for visual exploration only. Do not ask it to rewrite methodology, scoring, routes, or payloads.

## Token-efficient setup

Give Claude Design:

1. screenshots of the current landing page;
2. screenshots of a Foundation result;
3. screenshots of an AI Governance result;
4. screenshot of Profile no-data or saved state;
5. this brief;
6. optionally `V15_COPY_BANK.md`.

Do not upload the entire repo unless you are explicitly asking for implementation handoff.

## Prompt

```text
Design a premium editorial interface for the IR Worldview Inventory v15.

Audience: foreign-policy students, analysts, AI-governance people, and serious general readers.

Style target: Economist briefing + Foreign Affairs interactive + McKinsey/BCG clarity + Our World in Data discipline.

Product frame:
- This is a scenario-based inventory for geopolitical judgment.
- It is not a personality test or a psychometric diagnosis.
- It produces a personal briefing on the arguments users trust, the tradeoffs they accept, and the places their instincts split.

Existing architecture:
- Foundation = baseline questionnaire.
- Focus-area modules = Security and Technology stress tests.
- AI Governance Compass = standalone AI-policy entry point.
- Profile = saved local synthesis without a master score.
- Compare = two-profile comparison without a backend.

Design four screens:
1. landing page desktop and mobile;
2. Foundation result page desktop and mobile;
3. AI Governance result page desktop and mobile;
4. Profile dashboard desktop and mobile.

Prioritize:
- one dominant takeaway per screen;
- wide desktop layout;
- restrained mahogany accent;
- strong typography;
- simple charts and tension maps;
- less card soup;
- labels demoted below explanation;
- clear next clicks.

Avoid:
- neon;
- glassmorphism;
- 3D/Three.js for this sprint;
- dashboard tropes;
- personality quiz vibes;
- decorative charts that imply fake precision;
- huge gradient hero sections;
- too many identical rounded boxes.

Deliverables:
1. three visual directions;
2. recommended direction with rationale;
3. component-level implementation handoff for Next.js/CSS;
4. exact spacing, typography, card, and chart rules;
5. acceptance criteria for a coding agent.

Do not invent new scoring, new labels, new routes, or new product architecture.
```

## How to use the output

Pick one direction. Then ask Claude Design:

```text
Turn direction [number] into a surgical implementation handoff for Claude Code.
Scope only landing page, result hero, and payoff sections. Do not touch scoring, payloads, routes, or data storage.
List exact files, components, CSS tokens, and acceptance criteria.
```

Then paste that implementation handoff into a coding agent as a bounded UI task.
