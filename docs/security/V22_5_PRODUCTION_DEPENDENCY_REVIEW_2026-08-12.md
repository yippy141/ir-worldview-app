# V22.5 production dependency review

**Review date:** 12 August 2026  
**Branch:** `v22-5-evidence-ready-beta`  
**Starting SHA:** `2e59d93fbf43992ba38786a3b2e87059ea80930d`  
**Audit command:** `npm audit --omit=dev --json`

The raw before-result was saved at
`/tmp/v22-5-production-audit-before.json` for this review and was not committed.
The starting working tree was clean.

## Before summary

npm reported vulnerabilities at the package-entry level as follows:

| Critical | High | Moderate | Low | Total |
| ---: | ---: | ---: | ---: | ---: |
| 0 | 3 | 1 | 0 | 4 |

The four entries represented twelve advisory records: nine on `next`, one on
`sharp`, one on `postcss`, and one on `nanoid`. npm audit severity does not by
itself prove exploitability or runtime reachability. The dependency path,
affected operation, application use, and attacker-controlled inputs still have
to be assessed.

## Advisory evidence

`fixAvailable` below is the value returned for the package entry in the raw
before-audit. For `next`, `postcss`, and `sharp`, npm returned the same
package-level recommendation, even though the direct Next.js advisories were
already patched by `16.2.11` and compatible transitive patches were available.

| Package | Severity | Advisory / CVE | Installed | Affected range | Minimum patched | Status and dependency path | `fixAvailable` | Use in this repository |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `next` | High | `GHSA-6gpp-xcg3-4w24` | `16.2.10` | `>=16.0.0 <16.2.11` | `16.2.11` | Direct: root → `next` | `{"name":"next","version":"16.3.0","isSemVerMajor":false}` | Runtime framework and build tool |
| `next` | High | `GHSA-m99w-x7hq-7vfj` | `16.2.10` | `>=16.0.0 <16.2.11` | `16.2.11` | Direct: root → `next` | same package-entry value | Runtime framework and build tool |
| `next` | High | `GHSA-89xv-2m56-2m9x` | `16.2.10` | `>=16.0.0 <16.2.11` | `16.2.11` | Direct: root → `next` | same package-entry value | Runtime framework and build tool |
| `next` | Moderate | `GHSA-68g3-v927-f742` | `16.2.10` | `>=16.0.0 <16.2.11` | `16.2.11` | Direct: root → `next` | same package-entry value | Runtime framework and build tool |
| `next` | Moderate | `GHSA-4633-3j49-mh5q` | `16.2.10` | `>=16.0.0 <16.2.11` | `16.2.11` | Direct: root → `next` | same package-entry value | Runtime framework and build tool |
| `next` | Moderate | `GHSA-4c39-4ccg-62r3` | `16.2.10` | `>=16.0.0 <16.2.11` | `16.2.11` | Direct: root → `next` | same package-entry value | Runtime framework and build tool |
| `next` | High | `GHSA-p9j2-gv94-2wf4` | `16.2.10` | `>=16.0.0 <16.2.11` | `16.2.11` | Direct: root → `next` | same package-entry value | Runtime framework and build tool |
| `next` | Moderate | `GHSA-q8wf-6r8g-63ch` | `16.2.10` | `>=16.0.0 <16.2.11` | `16.2.11` | Direct: root → `next` | same package-entry value | Runtime framework and build tool |
| `next` | Moderate | `GHSA-955p-x3mx-jcvp` | `16.2.10` | `>=16.0.0 <16.2.11` | `16.2.11` | Direct: root → `next` | same package-entry value | Runtime framework and build tool |
| `sharp` | High | `GHSA-f88m-g3jw-g9cj`; `CVE-2026-33327`, `CVE-2026-33328`, `CVE-2026-35590`, `CVE-2026-35591` | `0.34.5` | `<0.35.0` | `0.35.0` | Transitive optional: root → `next@16.2.10` → `sharp` | `{"name":"next","version":"16.3.0","isSemVerMajor":false}` | Optional Next.js image-processing capability at build/runtime; no direct application import was found |
| `postcss` | Moderate | `GHSA-fxqj-rqcc-2cmp` | `8.5.19` | `<=8.5.22` | `8.5.23` | Transitive: root → `next@16.2.10` → `postcss`; also root → `@tailwindcss/postcss@4.2.2` → `postcss` in development | `{"name":"next","version":"16.3.0","isSemVerMajor":false}` | Build-time CSS processing; no direct application call was found |
| `nanoid` | High | `GHSA-2v37-7h3g-55p8` | `3.3.16` | `<3.3.17` | `3.3.17` | Transitive: root → `next@16.2.10` → `postcss@8.5.19` → `nanoid`; the development Tailwind path converges on the same deduplicated packages | `true` | Indirect build-time PostCSS utility; no direct application import was found |

The Nano ID advisory requires a custom generator invoked with a zero size. The
PostCSS advisory requires an attacker-controlled `sourceMappingURL` while
PostCSS is called without `from`. Those preconditions do not make the affected
installed versions safe; they explain why severity alone is not a reachability
finding.

## Versions before and after

| Package | Before | After | Mechanism |
| --- | --- | --- | --- |
| `next` | `16.2.10` | `16.2.11` | Exact direct dependency patch |
| `eslint-config-next` | `16.2.0` | `16.2.11` | Exact development dependency alignment |
| `sharp` | `0.34.5` | `0.35.3` | Exact npm override because `next@16.2.11` still requests optional `sharp@^0.34.5` |
| `postcss` | `8.5.19` | `8.5.23` | Existing exact npm override raised to the first version outside the affected range |
| `nanoid` | `3.3.16` | `3.3.17` | Exact npm override within PostCSS's compatible dependency line |

The lockfile changes to Sharp platform packages, `@emnapi/runtime`, libvips
packages, and `semver` were npm-resolved dependencies of `sharp@0.35.3`, not a
broad dependency-modernization pass. React, React DOM, next-intl, Mapbox,
Neon, Playwright, and TypeScript were not changed.

## Remediation performed

1. Updated direct `next` from `16.2.10` to exact `16.2.11` and
   `eslint-config-next` from `16.2.0` to exact `16.2.11`.
2. Re-ran the production audit. All nine direct Next.js advisory records were
   absent, but Next still allowed only `sharp@^0.34.5`, so `sharp@0.34.5`
   remained affected.
3. Overrode Sharp to exact `0.35.3`. `npm ls sharp` and `npm explain sharp`
   show one optional, overridden, valid instance under `next@16.2.11`, with no
   invalid or unmet peer/optional state.
4. Raised the existing PostCSS override to exact `8.5.23` and overrode Nano ID
   to exact `3.3.17`. Both remain compatible with their requesting packages.
5. Regenerated `package-lock.json` through `npm install`.

No `npm audit fix --force` or other `--force` upgrade was used. No advisory was
suppressed. No application image-processing code or direct Sharp dependency
was added.

## Residual findings and final audit

The final `npm audit --omit=dev --json` result contains an empty
`vulnerabilities` object:

| Critical | High | Moderate | Low | Total |
| ---: | ---: | ---: | ---: | ---: |
| 0 | 0 | 0 | 0 | 0 |

There are no residual production findings to defer or classify as an audit
metadata or dependency-path discrepancy.

## Release gate results

| Gate | Result | Evidence |
| --- | --- | --- |
| Remove `.next` | Pass | Clean rebuild state created before verification |
| `npm run typecheck` | Pass | Initial TypeScript check completed with exit 0 |
| `npm run validate` | Pass | 135 unique items validated; zero blocking measurement findings; three permanently non-blocking editorial-review findings remained unchanged |
| `npm run evidence:audit:check` | Pass | Committed evidence artifacts matched freshly generated UTF-8 bytes |
| `npm run copy:audit:strict` | Pass | Zero strict blocking findings |
| `npm run lint` | Pass | ESLint completed with exit 0 |
| `npm run test` | Pass | 473 passed, 0 failed |
| `npm run build` | Pass | Next.js `16.2.11` production build compiled and generated 149 static pages |
| Post-build `npm run typecheck` | Pass | TypeScript check completed with exit 0 |
| Port 3000 preflight | Pass | `lsof -nP -iTCP:3000 -sTCP:LISTEN` found no listener |
| `CI=1 npm run test:e2e` | Pass | The restricted sandbox attempt could not bind `127.0.0.1:3000` (`EPERM`); the same command with local bind permission passed 62 tests, 0 failed |
| `git diff --check` | Pass | No whitespace errors |
| Final `npm audit --omit=dev --json` | Pass | 0 critical, 0 high, 0 moderate, 0 low |

## Verification commands

The dependency investigation and release verification used:

```text
git branch --show-current
git rev-parse HEAD
git status --short
npm audit --omit=dev --json
npm ls sharp
npm explain sharp
npm explain nanoid
npm explain postcss
npm install
rm -rf .next
npm run typecheck
npm run validate
npm run evidence:audit:check
npm run copy:audit:strict
npm run lint
npm run test
npm run build
npm run typecheck
CI=1 npm run test:e2e
git diff --check
npm audit --omit=dev --json
```
