# Validation record

Baseline: `b2c0dc0d1f197f4b39d49572136331fb7a3f228a` (PR56 merge, reverified against GitHub main). Commands run in the isolated candidate worktree with existing locked dependencies. All fixtures and captures are synthetic.

## Required local checks

- `npm run lint` and `npm run typecheck`: pass.
- `npm run test`: 681 pass. Coverage includes 1,600 complete, recomputed AI profiles across six labels; 500 Foundation profiles across four families; exact score-identical AI answer witnesses; all registered module tuples and forms; existing applicability, immutability, scoring, copy binding and compatibility protections.
- `npm run validate`: zero failures. Two existing geometric-compromise findings remain for Security `regional_monitoring_compromise` and Technology `focus_on_deployer_controls`. This pass preserves those issued choices.
- `npm run copy:audit:strict`: strict failure count zero. The audit report contains 680 signals (P0 17 / P1 30 / P2 633); these are not a claim of zero editorial debt.
- `npm run evidence:audit` then `npm run evidence:audit:check`: current summary regenerated and read-only check passes. Historic baselines are unchanged.
- `npm run build`: production build passes.
- `git diff --check`: passes. [protection-audit.json](protection-audit.json) records byte-for-byte comparison of 98 protected paths against the base.

The final Foundation comparison correction retains the registered runner-up's challenge. Its worked arms-control case may have a different rival; the two contexts are deliberately tested separately. The required checks were repeated after this correction. A subsequent one-line sentence-spacing correction passed lint, typecheck, the five interpretation tests and a fresh build; CI repeats the full suite on the submitted commit.

## Browser verification

Local browser commands use an external production server on `127.0.0.1:3241`, one suite at a time. Temporary configuration redirects the existing e2e suite to that server without changing checked-in defaults. Evidence output from historical suites is redirected to temporary folders to preserve their committed records.

- `RESULT_BASE_URL=http://127.0.0.1:3241 npx playwright test -c playwright.result-interpretation.config.ts`: 25 pass, one explicit skip. Chromium and WebKit each execute all 12 geometry/behavior tests. The finite 162-route crawl runs once in Chromium; the duplicate WebKit crawl is intentionally skipped.
- Existing Chromium suite: 161 cases covered successfully. The full run passed 157; two transient local proxy timeouts and two newly named Chinese baselines were then confirmed in a sequential four-case run (4 pass). New macOS Chinese snapshots were visually inspected. The result names preserve historical screenshots.
- WebKit module journey and flow suites: 18 pass. This checks complete and resumed forms, reversible navigation, review and the unchanged result/Profile contracts.
- Decision `public.spec.ts`, `states.spec.ts` and `access-experience.spec.ts`: 26 cases covered successfully. One obsolete always-visible deep-chart assertion was updated to open its new calculation disclosure; its focused confirmation passes. The unrelated repair file is not included in this local count. CI runs the full configured decision suite.

`scripts/capture-result-interpretation.mts before` was run against the baseline production build; `after` was run against the candidate build. The stage name labels output and does not switch Git revisions. Regional captures supplement that script.

Geometry assertions check canvas centers, shared bar and value origins, label boundaries, all six marks, breakpoint neighbors and overflow. Explicit doubled text at 768px covers five templates with disclosures open. Tests also execute the exact AI handoff/reload behavior, no-JS rendering, keyboard disclosure, print state restoration and Foundation's return anchor. These are not tests on physical devices or every browser zoom setting.

## Visual verification

[inspection.csv](inspection.csv) distinguishes captures, actual image inspection, asserted geometry and executed tasks. Regional expanded-reading/calculation images supplement the contact sheet. The layout detector returned an empty findings array after the structural fixes. Print captures establish hierarchy; the record does not claim that each exported PDF page was separately inspected. Screenshot-only header masking in three regional captures makes the intended content visible without changing application CSS.

The one bounded design inspection exposed doubled-text domain-card overflow and applicability mismatches. Confirmation followed the resulting fixes; there is no claim of a new user study, psychometric validation or exhaustive visual reading of every finite content instance.

## CI and preview

[The first Linux run](https://github.com/yippy141/ir-worldview-app/actions/runs/34566156081) passed the complete verification job and 159 of 161 existing browser tests. Its only failures were the two absent new Chinese baselines. Both actual 390×844 images were inspected and added as Linux snapshots; [linux-snapshots.json](linux-snapshots.json) records their source artifact and hashes. Historical snapshots remain unchanged.

The completed branch reruns both jobs, including the full decision suite and new Chromium/WebKit suite. The current check revision and status are attached to [draft PR57](https://github.com/yippy141/ir-worldview-app/pull/57/checks). [All nine direct preview URLs](preview-links.md) returned HTTP 200; [preview-smoke.json](preview-smoke.json) records the expected worked applications and six marks on the automatic Vercel preview. No manual deployment or merge was performed.
