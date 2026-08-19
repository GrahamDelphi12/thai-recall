/* Thai Recall — site / download links
   Edit these when your Play listing, APK, or custom domain is ready.
   After changing: commit + push (Pages redeploys automatically). */
window.TR_SITE = {
  /* Google Play — set playStoreReady: true when the listing is live */
  playStoreUrl: 'https://play.google.com/store/apps/details?id=com.thairecall.app',
  playStoreReady: false,

  /* Direct APK
     Friend testing: set apkReady: true, commit + push (or test locally).
     Public pause: set apkReady: false (current). Play Store remains preferred. */
  apkUrl: 'downloads/ThaiRecall.apk',
  apkReady: false,
  apkVersionLabel: '',

  /* Live RTGS demo (Try it out) — Cloud Run. Redeploy with CORS + EN→TH for production. */
  rtgsApiUrl: 'https://thairecall-rtgs-74012798523.us-central1.run.app/rtgs',
  /* Local engine (dev only):
     rtgsApiUrl: 'http://127.0.0.1:8080/rtgs', */

  supportEmail: 'support@thairecall.com',
  customDomain: 'thairecall.com'
};
