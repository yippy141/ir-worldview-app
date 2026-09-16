# PR62 release amendment verification

Working branch: `codex/cinematic-home`, continuing reviewed head `6ccc4f38fdc2bf0fdf22ddc84447561729f050b6` over base `da470c1b5a0af4857eb1464ec09932a23ad4b45f`. The original checkout is untouched. [Draft PR62](https://github.com/yippy141/ir-worldview-app/pull/62) records the exact delivered head and links its actual GitHub CI outcome. Delivery waits for that workflow to finish.

## Checks

| Check | Result |
| --- | --- |
| Validate instrument structure, module authoring, calibration and diagnostics | Pass |
| Strict public-copy audit | Pass |
| Generated evidence check | Pass |
| Lint | Pass |
| Unit tests | 733 passed; no failures or skips |
| TypeScript | Pass |
| Production build | Pass |
| Complete default Chromium suite | 197 passed; four CI-only checks passed separately against production (201 total) |
| Configured decision-exercise stage | 29 passed |
| Configured result-interpretation Chromium/WebKit stage | 25 passed; one intentional duplicate-crawl skip in WebKit |
| Amendment interactions, Chromium and installed WebKit | 59 passed; one intentional Chromium-CDP-only touch skip in WebKit |

[Final command logs](logs/) retain the actual results. Early failed runs are not passes: three checks initially rejected stale generated evidence; the current summary was regenerated. A later read-only audit correctly detected a capture-script file created during its snapshot interval; the frozen-source run passed. Browser-test repairs preserve coverage while accounting for mobile navigation, innerText normalization, duplicate visible AI Profile links, and macOS WebKit's Option+Tab traversal. The first finite-route crawl rendered all 162 routes but failed writing its report to the old default output directory; the final run explicitly redirects that file into this amendment folder. The CDP touch-emulation check is Chromium-only; WebKit pointer/keyboard paths remain covered.

The default suite and the two configured CI stages run sequentially against the production build, followed by the dedicated two-engine amendment configuration. New captures/logs use amendment-specific paths, separate from historical evidence.

Protected files have no amendment diff: issued instrument banks, scoring/calibration, payload codecs, saved-result keys, the one-use fresh-result handoff, canonical marks, consent/API code, documented EU/NATO/RCEP records, dependencies, and CI configuration. All nineteen Futures and existing exercises remain present. No merge or deployment command was run.

## Reveal diagnosis and limited repair

Before editing the reveal component, synthetic drafts entered the actual review pages and used each real submit handler. Both 390px and 1440px views ran in Chromium and installed WebKit, sixteen paths total. Every path used client navigation, mounted one result reveal, consumed the matching one-use handoff and started drawing with the mark on screen. Review scroll positions reached 4,799px; arrival scroll was zero. Chromium sometimes started while fonts were still loading, but the mark remained visible through layout/font settlement. WebKit reported loaded fonts. [Before trace](before/reveal-diagnosis.json); [after trace](after/reveal-diagnosis.json).

A separate narrow AI Replay check reproduced the reported visual symptom: the animation ran while its mark was completely above the viewport. At 390 × 844 the mark occupied y = −274…−142 in Chromium and −275…−143 in WebKit. [Replay diagnosis](before/replay-diagnosis.json). The existing button is now labelled **Replay reveal**, precedes the introduction, and brings the existing mark into view before drawing. Fresh autoplay and the single memory handoff are unchanged.

Reload, Back, valid direct/shared loads, reduced motion, print interruption and no-JS retain their intended complete state. Replay on valid direct results draws on screen; reduced motion hides it. Eight additional clean-context shared-link checks (all four families in both engines) confirmed no autoplay and visible replay with no local history: [shared replay evidence](after/shared-replay.json). Foundation blend marks retain equal canonical geometry. No mark was added to missing/invalid results, Futures or decision exercises. Installed WebKit is **not physical Safari evidence**.

All diagnostic and recording contexts were isolated, local and synthetic. POST/PUT/PATCH/DELETE requests were intercepted before the page loaded, including research, aggregate and analytics writes. No private browser data or production answer submission was used. The fixtures seed drafts; the recordings show real review, submission and navigation, rather than claiming that every answer was entered by hand.

## Motion, scenes and reading views

The same canvas survives Enter and return with camera, zoom, scene and play/pause state intact. Desktop uses a 400ms native transform plus a short menu fade. Actions and focus work immediately; interruption leaves the final layout. Mobile remains menu-first without moving the globe across controls. Direct hashes, history, blocked storage, reduced motion, no-JS and print retain their final states.

Each of ten scenes holds for eight seconds. Semantic arrangement IDs and localized labels are independent of paint. Every supported place has exactly one assignment. One Earth has one worldwide-authority group with faint internal borders and the existing ocean. Documented memberships and colors are unchanged. [Source-derived color durations](COLOR_DURATION.md).

The real-time 80.1-second full-cycle inspection includes the first thirty seconds and the wrap. At eight seconds Europe is gold while Russia and China are visibly blue; at sixteen One Earth changes all supported land to one group; at twenty-four the camera shows blue China beside red Russia in Pacific compact. Later frames were also inspected at their actual camera positions. The camera's independent 140-second revolution means later cycles show other hemispheres. [Cycle timing and camera record](after/cycle.json), [early reversal](after/cycle-european-autonomy.png), [One Earth](after/cycle-one-earth.png), [Pacific compact](after/cycle-pacific-compact.png). Automated checks compare real canvas pixels, key swatches and paused inspection labels in both engines.

Representative original-size views: [desktop menu](after/menu-1440.png), [390px menu](after/menu-390.png), [320px](after/menu-320.png), [768px](after/menu-768.png), [Chinese menu](after/menu-zh-390.png). Available result evidence is in normal flow: [Foundation](after/foundation-evidence-390.png), [AI](after/ai-evidence-390.png), [Security](after/security-evidence-1440.png), [Technology](after/technology-evidence-1440.png). Desktop/module evidence uses two columns; mobile uses one. [Opt-in position feedback](after/position-open-390.png) and [the exact Foundation copy branch](after/domestic-copy-390.png) retain usable narrow layouts. Arithmetic, long reading lists and secondary metadata remain collapsible.

## Short continuous recordings

All clips are 1440 × 1000, in real time with no montage. Saved WebM frames were decoded to verify the review, visible drawing and spatial transition.

- [Enter and return — 5.16s](after/recordings/enter-and-return.webm)
- [Foundation review → result — 4.72s](after/recordings/foundation-completion.webm)
- [AI review → result — 4.72s](after/recordings/ai-completion.webm)
- [Security review → result — 4.64s](after/recordings/security-completion.webm)
- [Technology review → result — 4.88s](after/recordings/technology-completion.webm)

[Recording manifest](after/films.json) and [decoded-frame validation](after/recordings/video-validation.json).

## Exact copy changes

Questionnaires before: “Answer fourteen questions about international politics, then explore the arguments behind your result.” After: “Foundation covers international politics. Security, Technology and AI Governance examine specific policy choices.” Matching Chinese interface wording changed; administered questions did not.

Saved-work invitation before: “Open your saved work. Each result is kept separately; a combined worldview is not yet available.” After: “Open your saved results.” The continuation clause is omitted because this destination links to Profile, not directly to an unfinished draft. Existing questionnaire resume paths remain available.

For the selected domestic-high explanation with both existing middle bands, before:

> Your recorded position gives domestic coalitions and political institutions a role in explaining different responses to the same external pressure. The strategic position leaves the boundary between applying pressure and setting limits unresolved. The normative position leaves the threshold for overriding established order unresolved.

After:

> You give domestic politics an important role in foreign policy. Parties, interest groups and political institutions help explain why governments facing similar pressures can make different choices.
>
> The summary scores do not settle how far you would press an advantage, or when justice should take priority over sovereignty and established rules. Those questions need a more specific case.

Tests preserve the ≤3 / ≥5 boundaries, stable explanatory tie order, nonmatching strategic/normative branches, all-midpoint behavior, score-only/shared input and payload round-trip. This is a prose interpretation of dimensions, not a claim about which answer or dimension caused a family label.

## Added root transfer

Same established script and clean 1280 × 720 browser method, comparing the reviewed PR62 candidate with the amendment. These are JavaScript byte counts, not timing claims or whole-page transfer totals.

| Measurement | Reviewed PR62 | Amendment | Added bytes |
| --- | ---: | ---: | ---: |
| Initial JS, gzip | 174,952 | 175,459 | +507 |
| Initial JS, Brotli | 151,168 | 151,570 | +402 |
| Initial JS, actual encoded body | 175,375 | 175,881 | +506 |
| Deferred JS, gzip | 53,600 | 53,644 | +44 |
| Deferred JS, Brotli | 40,692 | 40,687 | −5 |
| Deferred JS, actual encoded body | 53,672 | 53,715 | +43 |

[Measurement](after/assets.json). No Mapbox requests or loaded-script signatures on the root; no new asset download or dependency. The local responses use gzip. No demonstrated functional failure remains after the final local runs. Additional scenes, alternative transition treatments and a broader result redesign were not added to this finite release amendment.
