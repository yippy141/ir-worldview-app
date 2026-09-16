# Candidate verification

Base: fetched `origin/main` at `da470c1b5a0af4857eb1464ec09932a23ad4b45f` (PR61). Candidate: branch `codex/cinematic-home`; the draft PR records its exact head SHA. The original checkout stayed on its original local main and was not reset, switched, staged or cleaned. Preflight and follow-up found no separate post-PR61 trust patch in progress. No merge or production deployment was requested or performed.

## Checks

| Check | Actual result |
| --- | --- |
| `npm run lint` | Pass |
| `npm run test` | 728 passed, 0 failed, 0 skipped |
| `npm run typecheck` | Pass |
| `npm run validate` | Pass: structure, module authoring, Security v4/v5, calibration and diagnostics |
| `npm run copy:audit:strict` | Pass: zero strict findings; advisory counts remain visible |
| `npm run evidence:audit:check` | Pass: generated UTF-8 bytes match |
| `npm run build` | Pass, production Next build |
| Full default Chromium suite | 193 passed, retries disabled |
| Decision exercises configured stage | 29 passed |
| Result interpretation configured Chromium/WebKit stage | 25 passed; 1 intentional skip of the duplicate WebKit finite-route crawl |
| Module journey configured Chromium/WebKit stage | 36 passed |
| Batch B configured WebKit stage | 10 passed |
| Standalone Futures / Departure configurations | 11 passed / 4 passed |
| Development-only result-payoff configuration | 16 passed, with a webpack development server; production exclusion also checked |

Raw command logs are in [logs/](logs/). Browser suites use synthetic isolated contexts; historical capture folders are not test outputs for this run.

The current evidence summary was regenerated because the fictional-scene authoring text changed an advisory fingerprint and the evidence-fixture test source hash changed. Instrument evidence, response evidence, fixture digest and scoring sources are unchanged. No historical evidence asset was rewritten.

The new globe checks exercise actual Canvas fills as well as labels, deterministic complete group states, wrap/poles, captured pointer movement and cancellation, no snapback, bounded zoom/reset, focused wheel behavior, keyboard exit, Pause/Play, reduced motion, hidden/offscreen suspension, Enter/history/deep links, locale/fresh/blocked storage, no-JS/print and speculative/documented isolation. Existing result-completion, draft, legacy and invalid-result checks remain in the configured suites.

The existing result-payoff experiment had a stale assertion expecting “publish criticism” inside its fixed-rights sentence. Fetched main already says “research and publication stay the same in both decisions” and separately “criticism may be published.” The test now checks both statements; the owner-approved prose is unchanged.

Earlier runs are not counted as passes. They exposed stale caption/navigation expectations, a real direct-menu/map-fragment bug, initial fragment-scroll geometry, and local disk exhaustion. A standalone configuration also deleted a shared scratch-output directory during an overlapping run; the final main suite uses an isolated capture directory and is run without that overlap. Tests now follow the grouped native disclosure path and assert that the retired glow is absent. The evidence CLI fixture skips browser-media files the audit never reads; its copied source and text evidence remain isolated. Working-space recovery used byte-identical filesystem clones within this worktree and removed 1,085,295,149 bytes of regenerable npm download-cache content. Installed dependencies and owner project files were preserved. No new dependency was added.

## Measured JavaScript

Same clean-browser measurement at 1280 × 720, against locally built fetched main and this production candidate. Disk cache disabled; no timing-performance claim is inferred.

| Phase / measurement | Base bytes | Candidate bytes | Difference |
| --- | ---: | ---: | ---: |
| Initial scripts, offline gzip | 171,976 | 174,952 | +2,976 |
| Initial scripts, offline Brotli | 148,711 | 151,168 | +2,457 |
| Initial scripts, actual encoded body | 172,400 | 175,375 | +2,975 |
| Deferred scripts, offline gzip | 53,139 | 53,600 | +461 |
| Deferred scripts, offline Brotli | 40,193 | 40,692 | +499 |
| Deferred scripts, actual encoded body | 53,206 | 53,672 | +466 |

Actual local responses use gzip. The root requested no Mapbox resource and its loaded scripts contained no Mapbox signature. Spectral and Libre Franklin rendered from the registered local fonts. Full measurements: [base](before/assets.json), [candidate](after/final-assets.json).

## Original-size views and continuous recording

- [Desktop opening](after/opening-1440.png) and [desktop menu](after/menu-1440.png).
- [390px opening](after/opening-390.png) and [390px menu](after/menu-390.png).
- [320px menu](after/menu-320.png), [768px menu](after/menu-768.png), [Chinese menu](after/menu-zh-390.png).
- [Realism desktop](after/realism-1440.png), [Realism mobile](after/realism-390.png), [thinker](after/thinker-1440.png), [AI reading](after/ai-reading-1440.png), [Field Guide](after/field-guide-390.png).
- [Documented membership map](after/documented-1440.png).
- [Continuous real-time recording](after/recording/sequence-and-controls.webm) and [recording manifest](after/recording/recording.json).

Desktop viewport is 1440 × 1000; mobile is 390 × 844. Full-page root captures retain their original width and full document height. Reading images preserve the viewport rather than shrinking the entire article. The 127.88-second recording uses a 1440 × 1000 real browser, no clock emulation or montage; it shows all nine scenes and the loop return, pointer rotation, zoom, reset, Enter, Foundation, browser Back, and a reading deep link with cleared synthetic storage. Labelled stills use reduced motion. [Decoded frames and duration](after/recording/video-validation.json) verify the saved media. Additional finish witnesses: [fresh direct menu and map](after/direct-menu-map-fresh.png), [blocked-storage Chinese direct menu and map](after/direct-menu-map-blocked-zh.png). The independent finish reviewer returned **ship**, with all three findings resolved.

Useful baseline witnesses: [root](before/-.png), [390px root](before/root-390.png), [Realism](before/-explore-realism.png), [Institutionalism](before/-explore-institutionalism.png), [computed reading geometry](before/computed.json).
