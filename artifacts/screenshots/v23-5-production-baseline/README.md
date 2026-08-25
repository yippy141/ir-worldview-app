# V23.4 production visual baseline

Captured on 2026-08-24 before V23.5 deployment from:

- production deployment: `dpl_GQDHf5DJKEgcXWwfHsyovHnZKvBa`
- source commit: `a80fe4d02d818ae546672d15f64aa596a25b1ceb`
- public origin: `https://irworldview.jhyip.com`
- color scheme: dark

## Files

| File | Route and locale | Viewport | Purpose |
|---|---|---:|---|
| `home-en-390.png` | `/`, English | 390 x 844 | Mobile production reference |
| `home-en-768.png` | `/`, English | 768 x 1024 | Tablet production reference |
| `home-en-1440.png` | `/`, English | 1440 x 900 | Desktop production reference |
| `home-zh-1440.jpg` | `/zh`, Simplified Chinese | 1440 x 900 | Representative localized reference |

The homepage Current Case state is time-dependent. These images record the
verified deployment at capture time; they are not deterministic CI assertions.
Deterministic route, payload, viewport, accessibility, and state checks live in
the Playwright suite and `docs/roadmap/RELEASE_TEST_MATRIX.md`. Do not label this
folder visual regression coverage.
