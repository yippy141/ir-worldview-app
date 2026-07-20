# V19 production deployment checklist

Complete this checklist from a clean checkout after the release changes are on
`main`. Fill in the release record below; do not rely on a mutable dashboard
label as the only deployment record.

## 1. Verify the release commit

- [ ] Confirm CI is green for the intended `main` commit.
- [ ] Run `git fetch origin main`.
- [ ] Run `git rev-parse origin/main` and record the full SHA.
- [ ] Run `npm run diagnostics:build-sha` and confirm it prints the same SHA.
- [ ] Confirm the Vercel deployment's source commit matches that SHA. Do not
      promote a deployment built from a different commit.
- [ ] Confirm the Vercel project's Production Branch is `main`.

## 2. Verify the Vercel production deployment

- [ ] In Vercel, confirm the matching deployment is marked **Production** and
      has finished successfully.
- [ ] Confirm required Production environment variables are present, including
      canonical `SITE_URL=https://irworldview.jhyip.com`. Mapbox credentials are
      optional: when they are absent or rejected, the complete local SVG map
      fallback must remain usable. V19 uses case-only invitations and does not
      use a Current Case challenge secret.
- [ ] Open the immutable Vercel deployment URL and confirm the World Stage,
      Foundation, Profile, and Worldview Map load without console errors.

## 3. Verify the custom-domain alias

- [ ] Confirm the intended custom domain appears in the deployment's Domains
      list and resolves to the same production deployment.
- [ ] Open the custom domain over HTTPS and confirm there is no certificate,
      redirect, or stale-alias warning.
- [ ] Compare a distinctive release detail on the custom domain with the
      immutable deployment URL to rule out an older cached deployment.

## 4. Verify as a public visitor

- [ ] In a new incognito/private window, open the custom domain without an
      authenticated Vercel session.
- [ ] Complete the critical smoke path: World Stage → Foundation → review →
      result → share link → Profile.
- [ ] Complete a Current Case, share the case-only invitation, and confirm its URL
      contains no choice, confidence, result payload, or answer-bearing token.
- [ ] Open a legacy answer-bearing Current Case challenge URL and confirm it shows
      a plain recovery route to the ordinary case without sending the fragment to
      the server or calling the retired challenge APIs.
- [ ] Open a Current Case print preview and confirm the briefing, decision options,
      uncertainties, and source ledger render as a legible summary.
- [ ] Open the Worldview Map and switch between List and Map.
- [ ] Open an invalid result URL and confirm a plain recovery path appears.
- [ ] Confirm the five World Stage map views are Pacific alliances, Chip
      networks, Regional security, Hedging states, and AI infrastructure.

## 5. Verify mobile

- [ ] Test the custom domain at a 390px-wide viewport in browser responsive
      mode and on one physical phone when available.
- [ ] Confirm the World Stage menu, Foundation controls, review screen, result,
      Profile, mobile navigation, and Worldview Map are usable without
      horizontal overflow.
- [ ] Confirm taps, focus, scrolling, and the List/Map switch remain reachable.

## Release record

- `main` SHA:
- Immutable Vercel deployment URL:
- Production alias:
- Custom domain:
- `SITE_URL`:
- Verified by:
- Test date/time and timezone:
- Exceptions or follow-up issues:
