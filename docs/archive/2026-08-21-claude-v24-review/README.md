> **HISTORICAL, SUPERSEDED, NON-EXECUTABLE.** Preserved only for provenance. Verify every claim against the current roadmap, Git state, and runtime before reuse.

# Archive notice for the Claude V24 review package

Status: **historical, superseded, non-executable**
Superseded: 2026-08-24
Replacement: `docs/roadmap/V23_5_V26_MASTER_ROADMAP.md`

The dated files in this directory were useful review inputs. They are preserved without silent correction so future readers can trace the reasoning and the errors found during red-team review.

Do not dispatch any prompt, agent definition, sprint sequence, implementation instruction, pricing claim, branch claim, or product decision from the dated 2026-08-21 and 2026-08-22 Claude package.

Known reasons for supersession include:

- stale Git state caused V23.4 to be reported as unmerged, although exact deployment evidence later showed that merge commit `a80fe4d02d818ae546672d15f64aa596a25b1ceb` was live;
- synthetic module calibration was conflated with optional real-cohort Foundation statistics;
- a proposed AI bank v3 collided with the existing v3 bank;
- the Transfer Test assumed item-level answer retrieval that current payload and ProfileStore contracts do not provide;
- several agent prompts encoded disproven assumptions;
- quantitative copy gates produced too much review noise;
- isolated Mapbox and Tailwind changes were proposed without a reconciled baseline;
- the package recommended execution before the current product had adequate human testing.

The tracked file `docs/v24/V24_ECONOMIC_STATECRAFT_AND_INTERDEPENDENCE_AUTHORING_GUIDE.md` remains outside this archive as a separate provenance record. It does not authorize V25 implementation. Economic Statecraft remains gated by the master roadmap.

Current authority order:

1. `AGENTS.md`
2. `PRODUCT.md`
3. `CONSTITUTION`
4. `DESIGN.md`
5. `docs/roadmap/V23_5_V26_MASTER_ROADMAP.md`
6. the active task contract
7. tests and verified runtime behavior

If any file in this directory conflicts with that chain, the current authority wins and the conflict must be recorded rather than reconciled silently.
