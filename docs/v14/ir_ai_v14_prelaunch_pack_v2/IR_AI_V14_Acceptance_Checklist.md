# IR + AI V14 acceptance checklist

## Hard engineering gate
- [ ] `npx tsc --noEmit` passes.
- [ ] `typescript.ignoreBuildErrors` is removed or false.
- [ ] `npm run lint` passes.
- [ ] `npm run test` passes.
- [ ] `npm run build` passes.
- [ ] 4 to 6 quiz-to-result integration tests exist.

## Result payoff
- [ ] Foundation result opens with a strong result card, not a wall of text.
- [ ] AI result opens with a strong result card.
- [ ] Profile with 2+ layers opens with an integrated payoff card.
- [ ] Each result card has one memorable non-obvious tension or finding.
- [ ] The tension callout uses data from getActiveTensions, getSubtraditionAffinity, or neighborOverlapTexts (Foundation) or getActiveAiGovernanceTensions (AI).
- [ ] Dense readings, Atlas, dimension tables, and method notes sit below the payoff.
- [ ] No hero uses clarity/settledness language that implies psychometric precision.
- [ ] Result card looks editorial (left accent border, serif label, muted chips), not like a Bootstrap card.

## Landing page
- [ ] Hero leads with a short question and CTA, not a product architecture explanation.
- [ ] "Take the quiz" is the primary action. "Or start with AI Governance" is secondary.
- [ ] How-to-use sidebar and product layers are below the fold.
- [ ] A sample result preview is visible below the fold.
- [ ] Audience signal ("Designed for students, analysts...") is present near the top.

## AI standalone wedge
- [ ] `/ai` can be shared directly with AI governance contacts.
- [ ] `/ai` does not imply IR Foundation is required.
- [ ] AI result pages make sense without IR context.
- [ ] AI result pages link back to IR Foundation as optional depth.
- [ ] AI Atlas and Field Guide remain available but not over-promoted above the quiz CTA.

## Social sharing
- [ ] Share buttons copy clean links.
- [ ] Shared result routes refresh in a fresh browser.
- [ ] IR result, AI result, and Profile share pages have route-specific metadata (specific titles and descriptions, not generic).
- [ ] Result cards are screenshot-quality for manual sharing.
- [ ] Dynamic OG images are NOT in V14 scope. Deferred to V14.1.

## Quiz friction
- [ ] First-time users are not blocked by a heavy mode gate.
- [ ] Standard mode is the default path.
- [ ] Analyst mode remains accessible but secondary.
- [ ] Section markers show where the user is in the quiz (5 sections for Standard).
- [ ] Question transitions are subtle (fade, not heavy slide) and do not feel gimmicky.
- [ ] After section 1 (first 7 Likert items), a midpoint preview shows top 2 dimension pulls.
- [ ] Midpoint preview is marked as preliminary and does not show a family label.

## Data and privacy
- [ ] Product works without research opt-in.
- [ ] Research opt-in is unchecked by default.
- [ ] Raw answers do not go to third-party analytics.
- [ ] Contact info is separate from answers.
- [ ] Deletion path is visible.
- [ ] Endpoints fail safely when env vars are missing.
- [ ] Copy says pseudonymous/de-identified unless data is truly anonymous.

## Prelaunch share readiness
- [ ] One stable Vercel preview URL is tied to the V14 commit.
- [ ] README reflects current product.
- [ ] GitHub About text has been manually updated.
- [ ] No obvious temp/backup artifacts are committed.
- [ ] Mobile at roughly 390px is usable.
- [ ] 3 people can explain their result card in one sentence.
- [ ] 3 people know what to click next after the result.
