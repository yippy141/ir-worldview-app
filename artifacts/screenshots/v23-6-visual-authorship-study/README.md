# Visual authorship study screenshots

Captured 2026-08-29 from the local development server at
`http://localhost:3210`, branch `v23-6-visual-authorship-study`, base
`e1728b30478cb666cb26082a1cf07f0da8290462`.

Chromium via Playwright. Device scale factor 1, except `type-plate-1440.png`
which is factor 2 because each board on that page is rendered at half size. The
development overlay is hidden with an injected stylesheet. Widths are 1440, 768,
and 390 CSS pixels.

These are review evidence, not regression coverage. The deterministic
assertions live in `e2e/v23-6-visual-authorship-study.spec.ts` and
`tests/v23-6-visual-authorship-study.test.mts`.

Reproduce the states with the development-only view parameters described in
`docs/design/V23_6_VISUAL_AUTHORSHIP_STUDY.md`:
`?visitor=new`, `?visitor=returning`, `?type=a|b|c`, `?treatment=a|b|c`.

`root-atlas-globe-tokenless-1440.png` was captured with
`NEXT_PUBLIC_MAPBOX_TOKEN` absent. Every other globe screenshot was captured
with the token present at a `localhost` origin, which that token authorizes.

`result-scroll-reduced-motion-full-1440.png` is byte-identical to
`result-scroll-full-1440.png`. That is the finding, not a duplicate file.
