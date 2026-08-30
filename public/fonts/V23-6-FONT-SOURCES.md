# V23.6 bundled font sources

The application bundles official open-licensed releases acquired on
2026-08-30, so page rendering makes no third-party font request and does not
depend on a font host. Browsers still request these self-hosted assets from the
application origin.

| Family | Local assets | Official source | Licence |
| --- | --- | --- | --- |
| Spectral | `spectral-latin-regular.woff2`, `spectral-latin-medium.woff2`, `spectral-latin-semibold.woff2` | [Google Fonts: Spectral](https://fonts.google.com/specimen/Spectral), files served by `fonts.gstatic.com` release `v15` | SIL Open Font License 1.1, copied in `SPECTRAL-OFL.txt` |
| Libre Franklin | `libre-franklin-latin-variable.woff2` | [Google Fonts: Libre Franklin](https://fonts.google.com/specimen/Libre+Franklin), file served by `fonts.gstatic.com` release `v20` | SIL Open Font License 1.1, copied in `LIBRE-FRANKLIN-OFL.txt` |

SHA-256 digests:

- `spectral-latin-regular.woff2`: `bcb83e9c56d40c5111a2bdbc3d8bdabf66bd31337e968f1c223b61879b8d3cad`
- `spectral-latin-medium.woff2`: `79ce505722da87b9a2fa21a16cd0d7f426f1624fd16413e11be377bc9e922a3b`
- `spectral-latin-semibold.woff2`: `1fb6ca29fc243e8bfdfce12d8d6806f322bcc62d38036986812be28fb1f41f0a`
- `libre-franklin-latin-variable.woff2`: `d21d1545591ddfa2ce9c208879298e9086b1a8dba7c81d50b686c70a259e91e8`

The Simplified Chinese Songti, PingFang-compatible, and monospace stacks remain
system fallbacks. The previous bundled fonts are retained only for compatibility
with existing image-generation code and are no longer the V23.6 interface
authority.
