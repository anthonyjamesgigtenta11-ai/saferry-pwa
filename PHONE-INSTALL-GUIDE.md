# Installing Saferry on a Phone

## Android / Chrome

1. Open the published Saferry HTTPS URL.
2. Wait for the page to finish loading.
3. Use Chrome's **Install app** / **Add to Home screen** option when offered.
4. Launch Saferry from the phone's Home screen.

The app is configured with `display: standalone`, a web app manifest, a service worker, and 192px/512px icons.

## iPhone / iPad

Open the published HTTPS URL in Safari, then use **Share → Add to Home Screen** and add Saferry. Launch the resulting Home Screen icon as the app-like version.

## Required test

After installation:

1. Open Saferry while online.
2. Go to **About & Info → Update Data**.
3. Confirm the current synchronized version is shown.
4. Turn off the phone's internet connection.
5. Reopen Saferry and verify Home, Schedules, Safety, Emergency, and About still work.
6. Reconnect and verify **Update Data** works again.
