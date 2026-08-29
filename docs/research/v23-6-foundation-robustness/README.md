# V23.6 Foundation label robustness

This directory records a deterministic structural sensitivity diagnostic for
the current Foundation v2 result contracts at source commit
`e1728b30478cb666cb26082a1cf07f0da8290462`.

The main finding is conditional: archetype resolution is structurally stable
for the correlated synthetic and archetype-directed ensembles, but answer
changes close to family, blend, and posture boundaries frequently change the
public label. The evidence routes first to boundary language, uncertainty
display, and blend/posture presentation. It does not authorize a bank, scorer,
threshold, calibration, payload, or share-format change.

This is not a reliability, validity, prevalence, or population study. No human
response data is used.

## Files

- `methodology.md` defines the forms, ensembles, perturbations, metrics, and
  limitations.
- `summary.md` gives the result tables, interpretation, and owner decisions.
- `per-item-influence.csv` reports item-level transition rates.
- `transition-matrix.csv` contains family, posture, pure/blend, and full
  archetype matrices by ensemble, exact form, and perturbation scope.
- `ensemble-summary.csv` reports required rates for all, pure-starting, and
  blend-starting records.
- `boundary-analysis.csv` reports flip probability by within-group distance
  quintile, placement-claim band, and posture-midpoint location.
- `worst-case-fixtures.json` preserves reproducible worst-case and
  representative answer vectors.
- `current-run.json` records exact forms, seeds, sample sizes, protected-file
  digests, artifact digests, and monotonicity checks.

## Reproduce

From the repository root:

```sh
npm run diagnose:foundation-robustness
```

The writer retains the accepted source SHA in `current-run.json`; the protected
file digests prove that the bank, scoring, calibration, archetype, payload, and
share inputs still match that source checkpoint.

To regenerate into an operating-system temporary directory, compare every
generated CSV/JSON file with the accepted bytes, verify protected-file digests,
and leave this directory untouched:

```sh
npm run diagnose:foundation-robustness:check
```

To compare a separate full run without overwriting this directory:

```sh
node --experimental-strip-types --import ./tests/register-alias-loader.mjs \
  scripts/diagnose-foundation-robustness.mts --output=/tmp/foundation-robustness-run2
diff -q docs/research/v23-6-foundation-robustness/per-item-influence.csv \
  /tmp/foundation-robustness-run2/per-item-influence.csv
diff -q docs/research/v23-6-foundation-robustness/transition-matrix.csv \
  /tmp/foundation-robustness-run2/transition-matrix.csv
diff -q docs/research/v23-6-foundation-robustness/ensemble-summary.csv \
  /tmp/foundation-robustness-run2/ensemble-summary.csv
diff -q docs/research/v23-6-foundation-robustness/boundary-analysis.csv \
  /tmp/foundation-robustness-run2/boundary-analysis.csv
diff -q docs/research/v23-6-foundation-robustness/worst-case-fixtures.json \
  /tmp/foundation-robustness-run2/worst-case-fixtures.json
diff -q docs/research/v23-6-foundation-robustness/current-run.json \
  /tmp/foundation-robustness-run2/current-run.json
```

The two final verification runs each took 26.24 seconds and produced
byte-identical CSV and JSON artifacts.
