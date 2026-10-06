# Saferry Online Sync Connection

Remote updates are enabled through GitHub's public repository Contents API.

Repository: https://github.com/anthonyjamesgigtenta11-ai/saferry-app
Provider: GitHub Contents API
Branch: main
Manifest: data-update-manifest.json

The PWA reads the manifest and the three data files from the public repository. A successful refresh is stored locally. When the app is offline or the remote refresh fails, Saferry continues using the latest successful local copy.

## Why the GitHub API is used

The browser does not need a GitHub login for public repository content. The API returns public file content directly to the PWA and avoids relying on a raw-file delivery URL during local development.

## Test
1. Start Saferry with Live Server while online.
2. Open About & Info and use **Update Data**.
3. Confirm the status changes to an online synchronized message and shows the manifest version.
4. Change the manifest version in GitHub and commit it.
5. Return to Saferry and press **Update Data** again.
6. Disconnect the internet.
7. Reload Saferry and verify the last synchronized data is still available.


### v17 note
For GitHub API mode, the app uses the configured public repository and manifest path directly; a separate manifestUrl is not required.
