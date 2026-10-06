# Saferry — GitHub Pages / Phone-Ready Build

Saferry is an offline-first Progressive Web Application for travel safety and ferry reference information for Bantayan Island.

## Includes

- Home
- Ferry Schedules
- Safety Tips
- Emergency Contacts
- About & Info
- Bottom navigation
- Hamburger navigation
- Offline local data
- GitHub-backed online synchronization
- PWA install metadata
- Service-worker caching
- Phone installation guidance

## Data architecture

The app uses the public GitHub repository `anthonyjamesgigtenta11-ai/saferry-app` as the remote curated data source. The PWA downloads the manifest and data when online, validates and saves the latest successful bundle locally, then uses the local copy when offline.

The app does not scrape third-party sites at runtime.

## Deployment

Publish the contents of this folder from the root of a public GitHub Pages repository, such as `saferry-pwa`.

See `GITHUB-PAGES-SETUP.md` for deployment steps and `PHONE-INSTALL-GUIDE.md` for phone installation/testing.
