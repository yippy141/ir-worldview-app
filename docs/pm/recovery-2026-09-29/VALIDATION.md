# Recovery validation — 29 September 2026

Environment: local macOS checkout, Node 22.19.0, existing installed dependencies; code HEAD `a3e8d39`. This task changed planning documents and navigation pointers only. Recovered PR-A and PR-B were not applied.

| Check | Fresh result |
| --- | --- |
| `npm run lint` | Pass |
| `npm run test` | Pass: 746 tests, 0 failures, 0 skipped; approximately 162 seconds |
| `npm run build` | Incomplete: remained at “Creating an optimized production build” / compile stage without further output for several minutes; manually interrupted, exit 130. No compiler failure was reported and no success is claimed. |
| `git apply --check` for each recovered patch | Both pass against local HEAD; no application performed |
| Original source hashes | All 11 files match the recovery manifest |
| `git diff --check` | Pass |

Logs were captured at `/private/tmp/ir-recovery-{lint,test,build}-20260929.log`. These are local temporary logs, not portable release evidence. The completed results in this document are the durable summary.

No browser suite, screenshot acceptance, fresh npm audit, remote branch refresh, deployment check, or production exploitability test was performed. The current checkout passing its unit suite does not validate either proposed patch. Claude's Linux test record omitted fixtures; it is not interchangeable with this run.

The build interruption is an unresolved validation gate for the next implementation sprint. Investigate and complete it on the selected base before claiming a releasable candidate. No workaround or production change was attempted as part of this document recovery.

## Foundation reproduction

The live review screen invokes the scorer with mode `analyst` even for the core form. Use that exact call shape; using the scorer's default `standard` mode does not reproduce the browser's full fourteen-item core calculation.

Run from the repository root:

```sh
node --experimental-strip-types --import ./tests/register-alias-loader.mjs --input-type=module - <<'JS'
import { getFoundationResultQuestions } from './lib/quiz-schema.ts';
import { generateResult, getV2ScoringCalibration } from './lib/scoring.ts';
import { resolveArchetype } from './lib/archetypes.ts';
for (const value of [1, 4, 7]) {
  const answers = Object.fromEntries(
    getFoundationResultQuestions('core').map(q => [q.id, value])
  );
  const result = generateResult(answers, 'analyst', 'core');
  console.log({ value, dimensions: result.dimensionScores,
    families: result.familyScores, name: resolveArchetype(result).name });
}
console.log(getV2ScoringCalibration('core').lowDifferentiationThreshold);
JS
```

Observed for each of the three answer sets: seven dimensions equal 4; all four family scores equal 0; displayed archetype name `Kairos–Grotian`. Core low-differentiation threshold: 0.3675. This confirms an exact tie, not its prevalence among users or a validated definition of broad low differentiation.

A second probe used `syntheticAnswers` from `tests/decision-exercises/fixtures.ts`, the same analyst/core scorer call, and sorted family scores. Seed 4 produces family scores Realism 0.26, Institutionalism 0.01, Constructivism 0.15, Critical Political Economy -0.34. Its first-to-third gap is 0.25, but its dimensions are [4, 4.5, 3.5, 4, 4, 2.5, 4] in schema order. This directly disproves equating Claude's proposed top-three threshold with all dimensions being level.

## Security source check

Official advisories were read on 29 September:

- [AVIF image optimization](https://github.com/vercel/next.js/security/advisories/GHSA-2xp9-vwfh-vxw4).
- [Node next/og ImageResponse](https://github.com/vercel/next.js/security/advisories/GHSA-vcvr-r3jv-pc5j).

The latter's vulnerable range includes the pinned version and depends on attacker-controlled values reaching SVG content, attributes or styles. Local use of Node ImageResponse was confirmed; vulnerable dataflow was not established. Recheck advisories and actual dependency resolution during the security sprint.
