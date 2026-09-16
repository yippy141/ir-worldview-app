## verdict

1. **Menu continuity — resolved.** `direct-menu-map-fresh.png` and `direct-menu-map-blocked-zh.png` show the grouped menu retained beside the globe with About this map open after Explore. `root-home.tsx` now treats `#map-details` explicitly as menu state, independent of storage; the added test covers English and Chinese with fresh and blocked storage.
2. **Caption hierarchy — resolved.** Recaptured opening and menu views at 1440, 768, 390 and 320 pixels show the scene title first and the exact fiction label immediately below it; the Chinese caption retains the same order. Both thinker captures show Susan Strange first, with “Reference profile · Thinker” below the name. The Field Guide's functional parent link remains outside this finding.
3. **Control consistency — resolved.** Root captures and decoded recording frames show consistently stroked arrow and zoom icons; the enhanced `documented-1440.png` now visibly shows the matching arrow controls. Both components use `GlobeControlIcon`, while native buttons retain accessible names, disabled behavior and 44-pixel targets.

## remaining

Clear for the three finish-review findings. No regression introduced by the fix batch is visible in the supplied recaptures or decoded recording samples. The four samples corroborate the fictional label, changed scene, menu and reading destination; they do not certify every moment of the recording. The full browser stage and its clean rerun remain separate delivery checks, not certified by this verdict.

disposition: ship
