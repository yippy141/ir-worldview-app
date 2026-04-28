# IR + AI V12 — Quickstart checklist

## Use this order

1. checkpoint and branch
2. create `plans/V12_EXEC_PLAN.md`
3. create `plans/V12_SOURCE_OF_TRUTH.md`
4. merge the V12 sprint block into `AGENTS.md`
5. run Claude Code Prompt 0
6. run Claude Code Prompt 1
7. run Claude Code Prompt 2
8. run Claude Code Prompt 3
9. run Codex Prompt A
10. run Codex Prompt B
11. run Claude Code Prompt 4
12. deploy preview and send to 3–5 people

## After every prompt

```bash
npm run lint
npm run test
npm run build
```

If all 3 pass:

```bash
git add -A
git commit -m "Describe the step that just passed"
```

## Hard rules

- no new live modules
- no scoring rewrite
- no payload rewrite unless a blocker forces it
- no futures scoring
- no dynamic discourse scraper
- no homepage rewrite
- no touching unrelated files just because they are dirty

## Done enough for friend beta means

- Profile gives one integrated read quickly
- modules feel lighter and less exam-like
- selected framings are no longer a cluttered dump
- AI Atlas cards click into real detail
- AI Field Guide exists and is clearly separate from the quiz
- README / trust / repo hygiene no longer obviously lag behind the product
