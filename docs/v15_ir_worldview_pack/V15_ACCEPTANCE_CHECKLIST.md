# v15 Acceptance Checklist

Use this before every commit and again before merging.

## 1. Scope check

Open VS Code Source Control.

Ask:

- Did the changed-file list match the sprint prompt?
- Did forbidden files change?
- Did `lib/scoring.ts` change without explicit permission?
- Did `lib/share.ts`, `lib/ai-governance-share.ts`, or `lib/profile-share.ts` change without explicit permission?
- Did the agent add a new package to `package.json`?
- Did the agent touch `tmp/`, archived docs, or unrelated files?

Stop if the scope is too broad.

## 2. Objective gate

Run:

```bash
npm run lint
npm run test
npx tsc --noEmit
npm run build
```

Do not merge if any fail.

## 3. Behavior check

Run:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

Check the routes:

- `/`
- `/quiz`
- `/quiz/review`
- one real `/results/[payload]` link
- `/modules`
- `/ai`
- `/ai/quiz`
- `/ai/review`
- one real `/ai/results/[payload]` link
- `/profile`
- `/compare`
- `/explore`
- `/explore/atlas`
- `/method`
- `/references`
- `/feedback`

## 4. Result-page checks

For Foundation results:

- Does the hero lead with a plain-English pattern?
- Are labels/modifiers visible but secondary?
- Is there a “so what” section above long technical material?
- Does the result explain a tension or blind spot?
- Does it recommend a sensible next step?
- Does an incognito shared result link open correctly?

For AI Governance results:

- Does the hero lead with a governing instinct?
- Is clarity/hybrid language demoted?
- Are axis bars below synthesis, not the main point?
- Does the bridge to IR Foundation feel optional, not mandatory?
- Does an incognito shared AI result link open correctly?

For Compare:

- Does the top card explain the argument two users would probably have?
- Does it avoid a fake compatibility score?
- Does it still work with pasted shared-profile links?

For Profile:

- Does first-time/no-data state explain what to do?
- Does loading state not look broken?
- Does saved Profile still render after completing Foundation?

For Research opt-in:

- Is opt-in clearly optional?
- Does copy say current build does not send answers from the block?
- Is “anonymous” avoided unless strictly true?
- Did the agent avoid adding storage/API code?

## 5. Copy sniff test

Search changed files for:

```text
fundamentally
in many ways
broadly speaking
complex
nuanced
dynamic
multifaceted
strategic disposition
surface patterns
matters
real emphasis
```

Not every occurrence is forbidden, but each should survive a deliberate review.

## 6. Visual sniff test

Look for:

- too many identical rounded cards;
- narrow desktop layout that feels like mobile stretched out;
- repeated buttons;
- giant labels before explanation;
- score bars above interpretation;
- charts that imply fake precision;
- text walls without hierarchy.

## 7. Share compatibility check

Use an existing shared result link from v14, if available.

- Foundation shared result should still open.
- AI shared result should still open.
- Profile shared result should still open.
- Invalid links should show a graceful error state.

## 8. Merge rule

Merge only if:

- changed files match scope;
- all checks pass;
- manual QA passes;
- no hidden scoring/payload changes occurred;
- no data storage was accidentally activated;
- the result pages clearly answer “now what?” better than v14.
