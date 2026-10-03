/* Thai Recall — site / download links
   After changing: commit + push (Pages redeploys automatically). */
window.TR_SITE = {
  /* Google Play listing (live) */
  playStoreUrl: 'https://play.google.com/store/apps/details?id=com.thairecall.app&utm_source=emea_Med',
  playStoreReady: true,

  /* Direct APK — hidden while Play is live.
     To re-enable: uncomment the four fields below, set apkReady: true,
     and uncomment the APK markup in download.html. */
  apkReady: false,
  // apkUrl: 'downloads/ThaiRecall.apk?v=20260913c',
  // apkReady: true,
  // apkVersionLabel: '13 Sep 2026 · v1.39-unlimited',
  // apkDownloadPassword: 'ThaiRecall',

  /* Live RTGS demo (Try it out) — website Cloud Run (NOT the Android app service). */
  rtgsApiUrl: 'https://thairecall-rtgs-web-74012798523.us-central1.run.app/rtgs',
  /* Android app uses: https://thairecall-rtgs-74012798523.us-central1.run.app/rtgs
     Local engine (dev only):
     rtgsApiUrl: 'http://127.0.0.1:8080/rtgs', */

  supportEmail: 'graborn.dev@gmail.com',
  customDomain: 'thairecall.com'
};
