# V23.6 production conversion evidence

This directory defines the reproducible release-evidence contract for the V23.6 production candidate. Generated PNG, PDF, HAR, and measurement files belong in an external empty output directory until they are reviewed. The tooling does not commit them automatically; the reviewed candidate artifacts attached to this PR are checked in under `artifacts/` and indexed in `RELEASE_INDEX.md`.

The exact baseline is `68806043ea83fad425f0db8f3507704a4aad3f7d`. A baseline URL is evidence for that SHA only when the server was built from that checkout. A dated or previously measured build is not permission to replace newer work.

## One capture flow

Prerequisites:

- Build the candidate with `npm run build` and serve it at `http://127.0.0.1:3000`.
- Build the exact baseline checkout and serve it separately. The local verification setup uses `/tmp/ir-v23-6-baseline` at `http://127.0.0.1:3411`.
- Pass a new or empty output directory. The capture command refuses to overwrite a nonempty directory.
- Immediately before the capture command, record the required PDF authoring operation. The capture creates one print PDF, so do not run it before this marker succeeds.

```bash
node container_tools/mark_artifact_operation_started.mjs --operation-kind create --expected-output-count 1 --output-format pdf

V23_6_EVIDENCE_DIR=$(mktemp -d /tmp/ir-v23-6-evidence.XXXXXX)
npm run evidence:v23-6:capture -- \
  --base-url http://127.0.0.1:3000 \
  --baseline-url http://127.0.0.1:3411 \
  --baseline-sha 68806043ea83fad425f0db8f3507704a4aad3f7d \
  --output-dir "$V23_6_EVIDENCE_DIR"
```

The capture writes one `manifest.json` and the following evidence groups:

| Group | Output |
| --- | --- |
| Root before | 390, 768, and 1440 pixel viewport screenshots from the exact baseline server |
| Root after | New state at 390, 768, and 1440 pixels; returning state at 390 and 1440 pixels |
| World Stage | 1440 pixel scene, controls, reviewed date, filters, and canvas or complete local fallback |
| Foundation result | Low-differentiation core, clearer pure, blend, shared-unavailable evidence, and exact local evidence |
| Profile | Foundation record with no saved domains and a Profile with a separate Security record |
| Chinese parity | 390 pixel Simplified Chinese root and result |
| Motion and print | Reduced-motion result screenshot and A4 print PDF |
| Network | Candidate clean-root HAR and CDP/Resource Timing JSON; equivalent baseline files when supplied |
| Accessibility | DOM heading order, seven-chapter order, sticky-region count, root links, tab-role audit, and overflow state |

The script uses deterministic constructed inputs. It does not use participant data and does not write answers or evidence into a URL or server. Browser storage seeded for returning-state, Profile, and local-evidence captures exists only inside isolated temporary Chromium contexts.

## Bundle and transfer measurement

Run this after both production builds and servers are ready. The output path must not already exist.

```bash
npm run evidence:v23-6:measure -- \
  --candidate-url http://127.0.0.1:3000 \
  --candidate-build-dir .next \
  --baseline-url http://127.0.0.1:3411 \
  --baseline-build-dir /tmp/ir-v23-6-baseline/.next \
  --route / \
  --output "$V23_6_EVIDENCE_DIR/performance/root-comparison.json"
```

The report deliberately separates three different claims:

| Measure | Meaning |
| --- | --- |
| Client-reference manifest JavaScript | Exact unique JavaScript chunks named by the Next route client-reference manifest |
| Browser-requested JavaScript raw | Wider clean-load JavaScript request set, including Next bootstrap and runtime files when requested |
| JavaScript gzip and Brotli | Independent transfer estimates computed per exact local file for each of those two sets |
| Browser encoded transfer | `Network.loadingFinished.encodedDataLength` from clean Chromium with disk cache disabled and service workers blocked |

Font rows report route-loaded files and browser encoded transfer. Render verification reads the computed body and active-menu family, matches its primary family against registered, loaded `FontFace` entries, and retains `document.fonts.check()` only as a secondary diagnostic. The Mapbox audit checks both browser requests and signatures in every route-loaded JavaScript file.

Pinned baseline values from the exact SHA are retained for review even when a fresh comparison run is attached:

| Exact baseline root | Bytes |
| --- | ---: |
| Client-reference manifest JavaScript raw | 447,933 |
| Client-reference manifest JavaScript gzip estimate | 140,262 |
| Client-reference manifest JavaScript Brotli estimate | 114,058 |
| Clean browser encoded transfer, all resources | 498,727 |
| Clean browser encoded JavaScript | 279,721 |
| Clean browser encoded fonts | 137,045 |
| Mapbox requests | 0 |

The standalone baseline network capture above reports 498,727 bytes. The
separate paired performance run captured 499,344 bytes for the same exact
baseline build; `root-comparison.json` and the release-index delta table use
that paired-run value so candidate and baseline are compared within one run.

The no-Mapbox baseline result occurred without a configured token and does not prove route isolation. V23.6 candidate evidence additionally requires zero Mapbox signatures in the root-loaded JavaScript dependency set, zero Mapbox requests, zero canvas elements, and one checked-in geographic SVG.

## Automated release assertions

The focused specification is `e2e/v23-6-production.spec.ts`.

```bash
CI=1 npx playwright test e2e/v23-6-production.spec.ts
```

It covers root dependency isolation, normal-link keyboard activation, root state synchronization, hydration geometry, World Stage controls and source inspection, current and legacy result tuples, pure and blend presentation, local evidence matching and deletion, shared unavailability, JavaScript-disabled reading order, reduced motion, responsive widths, English and Simplified Chinese, Profile record presence, and the three-to-four-page print contract.

This focused command complements, and does not replace, the required full V23.6 command set.

## Review procedure

1. Confirm `manifest.json` reports the expected baseline SHA, capture parent SHA, dirty-tree state, and changed-file list. The final head SHA belongs in the handoff after the third commit exists.
2. Inspect every root screenshot at its native viewport dimensions.
3. Open the HAR and verify the candidate root contains no Mapbox URL, redirect, failed request, or prefetched destination chunk.
4. Compare browser encoded transfer separately from raw and compressed route estimates.
5. Inspect local evidence present, shared unavailable, Chinese, reduced-motion, and Profile states.
6. Open the PDF and confirm three or four pages, complete reading order, no clipped text, no pinned column, and no hidden chapter.
7. Review `RELEASE_INDEX.md`, the generated manifest, and the release test table together before handoff.

If the live Mapbox canvas cannot initialize because the build has no valid token, the World Stage screenshot records the complete local fallback. Full Mapbox attribution must be verified again in an environment where the configured token is valid. This does not weaken the root requirement: `/` must never initialize or request Mapbox in either environment.
