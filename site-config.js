/* Thai Recall — site / download links
   Edit these when your Play listing, APK, or custom domain is ready.
   After changing: commit + push (Pages redeploys automatically). */
window.TR_SITE = {
  /* Google Play — set playStoreReady: true when the listing is live */
  playStoreUrl: 'https://play.google.com/store/apps/details?id=com.thairecall.app',
  playStoreReady: false,

  /* Direct APK
     Friend testing: set apkReady: true, commit + push (or test locally).
     Public pause: set apkReady: false. Play Store remains preferred.
     Optional soft gate: set apkDownloadPassword (empty string = no prompt). */
  apkUrl: 'downloads/ThaiRecall.apk',
  apkReady: true,
  apkVersionLabel: '30 Aug 2026 · v1.33-unlimited',
  apkDownloadPassword: 'ThaiRecall',

  /* Live RTGS demo (Try it out) — website Cloud Run (NOT the Android app service). */
  rtgsApiUrl: 'https://thairecall-rtgs-web-74012798523.us-central1.run.app/rtgs',
  /* Android app uses: https://thairecall-rtgs-74012798523.us-central1.run.app/rtgs
     Local engine (dev only):
     rtgsApiUrl: 'http://127.0.0.1:8080/rtgs', */

  supportEmail: 'graborn.dev@gmail.com',
  customDomain: 'thairecall.com'
};
