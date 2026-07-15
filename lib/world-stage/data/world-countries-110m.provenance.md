# World Stage country geometry provenance

- **Source:** Natural Earth, `Admin 0 – Countries`, 1:110m cultural vectors.
- **Upstream version:** `5.2.0-pre`, repository commit `ca96624a56bd078437bca8184e78163e5039ad19`.
- **Source file:** <https://raw.githubusercontent.com/nvkelso/natural-earth-vector/ca96624a56bd078437bca8184e78163e5039ad19/geojson/ne_110m_admin_0_countries.geojson>
- **Product page:** <https://www.naturalearthdata.com/downloads/110m-cultural-vectors/110m-admin-0-countries/>
- **License:** Public domain under the Natural Earth terms of use: <https://www.naturalearthdata.com/about/terms-of-use/>
- **Retrieved:** 2026-07-14.

## Transformation

The checked-in GeoJSON is a homepage-display derivative, not a new boundary
dataset. The source was already generalized to 1:110m. For the local copy:

1. Retain `Polygon` and `MultiPolygon` country features only.
2. Retain only `iso3` and `name` properties, and use `iso3` as the feature ID.
3. Use Natural Earth `ISO_A3`; for France and Norway, where the source field is
   `-99`, use the corresponding `ADM0_A3` values `FRA` and `NOR`.
4. Omit Northern Cyprus, Somaliland, and Kosovo because this source revision
   does not assign them an ISO 3166-1 alpha-3 value. No World Stage role relies
   on those omitted records.
5. Apply Ramer-Douglas-Peucker simplification at a 0.12-degree tolerance and
   round coordinates to two decimal places.

The resulting file contains 174 features and is 136,231 bytes uncompressed,
including its final newline.
These generalized boundaries are used only as a low-zoom editorial basemap.
Their inclusion, omission, or linework does not express a view on sovereignty
or disputed status.
