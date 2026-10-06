# Saferry Online Data Update Setup — v14

Saferry v14 is prepared for a **GitHub-hosted JSON update source** while preserving offline fallback.

## How it works

```text
Verified operator / government source
              ↓
       Saferry data editor
              ↓
       GitHub JSON files
              ↓
      Online synchronization
              ↓
        Saferry PWA
              ↓
     Latest copy stored locally
              ↓
       Offline use continues
```

The app does not scrape third-party websites at runtime. Instead, a maintainer updates the curated JSON data after checking the authoritative source.

## 1. Create a public GitHub repository

Create a public repository named something like:

`Saferry-data`

From `remote-data-template/`, upload these four files to the **repository root**:

- `data-update-manifest.json`
- `schedules.json`
- `safety-tips.json`
- `emergency-contacts.json`

## 2. Configure the PWA

Edit:

`data/remote-config.json`

Change:

```json
{
  "enabled": false,
  "manifestUrl": "https://raw.githubusercontent.com/anthonyjamesgigtenta11-ai/saferry-app/main/data-update-manifest.json",
  "refreshIntervalMinutes": 60
}
```

To your actual GitHub username, then set:

```json
"enabled": true
```

Example:

```json
{
  "enabled": true,
  "manifestUrl": "https://raw.githubusercontent.com/yourusername/saferry-data/main/data-update-manifest.json",
  "refreshIntervalMinutes": 60
}
```

## 3. Update data

When verified information changes:

1. Edit the corresponding JSON file in GitHub.
2. Update `lastChecked`.
3. Update the manifest `version` and `lastUpdated`.
4. Keep the source URL and source policy intact.
5. Do not combine conflicting schedules from different sources without documenting the reason.

## 4. What the app does

When online and due for a refresh, Saferry:

1. Downloads the manifest.
2. Downloads schedules, safety tips, and emergency contacts.
3. Performs basic structure validation.
4. Saves the successful synchronized bundle locally.
5. Uses that latest synchronized copy when offline.

If an online refresh fails, the app keeps using the latest available local data.

## 5. School-project recommendation

For the school version, one person should be responsible for reviewing source changes before updating the GitHub JSON files. That keeps the app's information curated and avoids presenting an unverified web page as an official live feed.


## Connected Saferry data repository

The current public repository is:
https://github.com/anthonyjamesgigtenta11-ai/saferry-app

The PWA reads the manifest from:
https://raw.githubusercontent.com/anthonyjamesgigtenta11-ai/saferry-app/main/data-update-manifest.json

Remote updates are enabled in `data/remote-config.json`. The app keeps the last successful synchronized bundle locally for offline use.
