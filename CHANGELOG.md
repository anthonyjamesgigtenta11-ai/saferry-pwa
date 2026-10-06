# Saferry Changelog

## v14 — Reliable data + online synchronization foundation
- Verified current source set before updating local datasets.
- Switched Super Shuttle schedule reference to the operator's own published schedule as the primary source.
- Added explicit cross-check sources without merging conflicting times.
- Refined emergency contacts around official Philippine government and Cebu Provincial Government sources.
- Refined sea-travel and beach-safety tips around MARINA and local/government guidance.
- Added `data/remote-config.json` for online update configuration.
- Added `remote-data-template/` for GitHub-hosted JSON updates.
- Added remote manifest + basic data validation.
- Added localStorage persistence of the latest successful remote bundle for offline fallback.
- Added an About & Info data synchronization panel.
- Default schedule date now uses the current date.
- Service-worker cache bumped to v14.

## v13
- Packaged the tested v12 build as a cleaner final project package.

- v15: Connected Saferry remote-data sync to the public GitHub repository `anthonyjamesgigtenta11-ai/saferry-app`; cache version bumped to v15.

## v16
- Switched remote synchronization from raw.githubusercontent.com to GitHub Contents API for public repository data.
- Added GitHub API JSON/base64 decoding.
- Bumped app and service-worker cache versions to v16.


## v17 — GitHub Sync Gate Fix
- Fixed GitHub API sync configuration so `repository + provider=github-api` is sufficient; `manifestUrl` is only required for non-GitHub providers.
- Added GitHub API JSON headers.
- Bumped service-worker/cache versions to v17.

## v18
- Fixed GitHub browser synchronization by removing the custom `X-GitHub-Api-Version` request header from browser fetches. GitHub's CORS preflight allow-list does not include that header, so the header could cause the browser to block the request even though the public repository was valid.
- Kept the public GitHub Contents API as the remote source and bumped the service-worker cache to v18.

## v19 — GitHub sync robustness
- Uses raw.githubusercontent.com as the primary public data endpoint, with GitHub Contents API fallback.
- Adds cache-busting query parameters to remote data requests.
- Exposes the underlying remote fetch error when a manual sync fails, so troubleshooting is actionable.
- Bumped service-worker registration and caches to v19.

## v20 — GitHub Pages / phone-ready build

- Prepared relative paths for a GitHub Pages project-site subdirectory.
- Added PWA `scope`/`id` metadata and iOS web-app metadata.
- Added `apple-touch-icon.png`.
- Added `.nojekyll` for static project publishing.
- Bumped service-worker/cache version to v20.
- Added GitHub Pages deployment and phone installation guides.
- Preserved the working GitHub-backed online synchronization and offline fallback.
