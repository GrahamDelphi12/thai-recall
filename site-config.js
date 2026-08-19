/* Thai Recall — site / download links
   Edit these when your Play listing, APK, or custom domain is ready.
   After changing: commit + push (Pages redeploys automatically). */
window.TR_SITE = {
  /* Google Play — set playStoreReady: true when the listing is live */
  playStoreUrl: 'https://play.google.com/store/apps/details?id=com.thairecall.app',
  playStoreReady: false,

  /* Direct APK — signed Release build in Website_Grok/downloads/ */
  apkUrl: 'downloads/ThaiRecall.apk',
  apkReady: true,
  apkVersionLabel: '13 Aug 2026 (Thai GS)',

  /* Live RTGS demo (Try it out) — Cloud Run. Redeploy with CORS + EN→TH for production. */
  rtgsApiUrl: 'https://thairecall-rtgs-74012798523.us-central1.run.app/rtgs',
  /* Local engine (dev only):
     rtgsApiUrl: 'http://127.0.0.1:8080/rtgs', */

  supportEmail: 'support@thairecall.com',
  customDomain: 'thairecall.com'
};
