# AGENTS.md

## Project
IR Worldview Inventory

## Product goal
Build a premium, editorial-quality IR worldview quiz and interpretation experience in Next.js.

## Non-negotiables
- Preserve the existing schema-driven architecture
- Prefer small, readable components over giant files
- Do not introduce unnecessary dependencies
- Maintain accessibility and keyboard navigation
- Write plain-English copy, not academic jargon, unless explicitly asked
- Do not remove existing scoring logic unless requested; refactor around it
- Keep TypeScript types explicit
- Avoid visual gimmicks

## Design direction
- Editorial, serious, high-trust
- Feels closer to Foreign Affairs or McKinsey than to a startup landing page
- Light theme first
- Generous whitespace
- Serif headings, sans body
- Subtle borders and restrained accent color

## UX rules
- No auto-advance on answer selection
- Every question view should support Back and Next
- Results must include a "so what" layer in plain English
- Methods page should explain actual methodology, not just file structure

## File architecture
- Content lives in schema files under lib/
- Scoring logic stays in lib/scoring.ts
- UI should be split into components/
- Prefer route-specific pages under app/

## Before coding
1. Explain the change plan briefly
2. List the files you will edit
3. Make changes incrementally
4. After changes, explain what was done and what to review manually

## When writing copy
- Define jargon inline or via a glossary helper
- Prefer 1-3 sentence blocks
- Avoid hype language
- Use concrete labels

## When changing UI
- Favor readability over density
- Use consistent spacing scale
- Ensure mobile behavior is reasonable
- Keep button labels explicit
