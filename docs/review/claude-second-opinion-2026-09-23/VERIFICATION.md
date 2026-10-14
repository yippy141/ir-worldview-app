# Verification record

Test machine: a clean Linux container. I staged 788 files from your working copy of `fix/pilot-trust-storage` (product code, tests, scripts, configs, fonts, research JSON, experiments, two evidence fixtures the e2e specs read) and checked every one against the branch index hash. I left out most of `docs/`, `artifacts/` and the screenshot reference images. Dependencies came from `package-lock.json` with `npm ci`. Playwright 1.61.1 ran against Chromium 1194 through an `executablePath` override, one worker, no retries, against `next start` after `next build`, exactly as the CI job does with `CI=1`.

## Codex's branch as left (a3e8d39)

| Check | Result |
| --- | --- |
| `tsc --noEmit` | clean |
| Unit tests | 727 run, 34 fail. All 34 read files under `docs/` or `artifacts/` that I did not copy (one of them, the df1 copy test, passes once its fixture is present) |
| Production build | passes |
| Playwright, full suite | 228 run, 220 pass, 8 fail |

The eight failures:

- `history-copy-provenance.spec.ts`, all four tests. They assert `.history-saved-note` and `.history-compare`, which belong to the `HistoryCompare` component Codex deleted.
- `i18n.spec.ts` "Foundation history follows payload provenance". It expects that opening a result link appends to legacy history, which is the bug PR1 was meant to remove.
- `pilot-trust.spec.ts` "genuine Foundation completion saves exactly once". Codex's own new test waits for a "Foundation" heading without clicking "Start Foundation"; on the current quiz that heading only appears after Start.
- Two `i18n.spec.ts` screenshot tests. These fail here only because I did not copy the reference PNGs; they say nothing about Codex's change.

## With PR-A and PR-B applied

| Check | Result |
| --- | --- |
| `tsc --noEmit` | clean |
| ESLint on every changed file | clean (the first draft tripped `react-hooks/set-state-in-effect`; both components now read state through `useSyncExternalStore`) |
| Unit tests | 731 run, 33 fail, the same tests by name as before minus df1, all reading uncopied `docs/` or `artifacts/` files. The 10 new ratchet tests and 6 rewritten pilot-trust unit tests pass |
| Existing copy-audit tests (`tests/public-copy-audit.test.mts`) | 10 of 10 pass with the voice rules wired in |
| Production build | passes |
| Playwright, full suite | 226 run. First full run: 220 pass, 6 fail. Four of the six were older tests that asserted the old share URL or the old saving-on-view behaviour; I updated them. The other two were the screenshot tests above |
| Playwright, re-run of the four changed spec files after the updates | 85 of 85 pass, including all 12 in `pilot-trust.spec.ts` |
| `npm run copy:ratchet` | no regressions |

The two Chinese screenshot tests will need `--update-snapshots` on your machine in any case, because a fresh browser opening a Chinese result now sees the "此结果来自链接" notice above it.

## What the new pilot-trust tests cover

1. A link opened in a fresh browser renders read-only, shows the "opened from a link" notice, and writes nothing to either store.
2. A `?via=share` link has the shared notice in the server HTML (checked with a raw HTTP request, before any JavaScript), shows "Take the Foundation", and saves nothing.
3. A completion intent saves once, shows "Saved to your Profile on this device." with a working Profile link, and a reload shows neither note nor notice and leaves the store byte-identical.
4. The owner opening their own `?via=share` link on the same device sees no shared notice.
5. Throwing storage shows "This browser blocked saving." and never a saved note.
6. The AI generation retry (Codex's test, unchanged).
7. A genuine walk through the quiz from Start to result shows the saved note and stores exactly one Foundation.
8. Four provenance cases: legacy history is never rewritten and never produces a comparison.

## Dependency audit, run today

`npm audit` on the branch: 15 advisories in the full tree (1 critical, 11 high, 2 moderate, 1 low); 5 with `--omit=dev` (1 critical, 3 high, 1 moderate). The critical is `next@16.2.11`: GHSA-p293-qw3h-jr36 (remote code execution on Windows-hosted servers) and GHSA-2xp9-vwfh-vxw4 (remote code execution in the image optimization API with AVIF), both fixed in 16.3.3; `npm audit` proposes 16.3.6, a non-major bump that also resolves the `sharp`, `postcss` and `nanoid` entries. The app does not import `next/image`; I did not test whether the default image route is reachable on your deployment. The remaining dev-tree highs come through `impeccable` (puppeteer, extract-zip).

## What I did not verify

Real Safari and iOS, screen readers, Vercel's runtime, and the zh screenshot baselines. I also did not run the decision-exercise and result-interpretation Playwright configs, which PR-A does not touch.
