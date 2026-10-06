# Saferry GitHub Pages Deployment

This package is prepared to be published as a static GitHub Pages project site.

## Repository

Create a separate public repository for the app, for example:

`saferry-pwa`

Keep the existing `saferry-app` repository as Saferry's remote data repository.

## Upload

Upload the contents of this `Saferry/` folder to the **root** of the `saferry-pwa` repository. The repository should contain `index.html` at its root.

## Enable GitHub Pages

In the app repository:

1. Open **Settings**.
2. Open **Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**.
4. Select `main` and `/ (root)`.
5. Click **Save**.

The resulting project site will normally use this pattern:

`https://<github-username>.github.io/saferry-pwa/`

GitHub Pages sites support HTTPS. Do not use the local Live Server address on the phone as the production URL.

## Why this package uses relative paths

GitHub Pages project sites are served from `/saferry-pwa/`, not from `/`. The manifest, service worker, icons, CSS, JavaScript, and local JSON paths are therefore intentionally relative so they continue to work from the project-site subdirectory.

## Remote data

The app remains connected to:

`https://github.com/anthonyjamesgigtenta11-ai/saferry-app`

The app retrieves the public remote data when online and keeps the latest successful copy locally for offline use.
