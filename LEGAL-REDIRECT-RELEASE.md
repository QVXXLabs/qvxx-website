# Wix legal redirect release order

The existing `/terms`, `/privacy`, and `/cookies` pages are the QVXX fallback
documents. The `_redirects` file is intentionally prepared but must not be
published until the Vortex production routes below have each returned HTTP
200:

- `https://vortexfiles.qvxx.ai/legal/wix/terms`
- `https://vortexfiles.qvxx.ai/legal/wix/privacy`
- `https://vortexfiles.qvxx.ai/legal/wix/cookies`

After that proof, deploy this QVXX site commit and verify each redirect with
JavaScript enabled and disabled. If a target is unavailable, revert this
commit or disable the three rules so the existing HTML pages remain reachable.
