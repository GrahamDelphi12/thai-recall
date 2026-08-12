(function () {
  var STORAGE_KEY = 'tr-lang';
  var dict = window.TR_I18N || {};

  function currentLang() {
    var saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'en' || saved === 'th') return saved;
    return 'en';
  }

  function t(key, lang) {
    var pack = dict[lang] || dict.en || {};
    if (pack[key] != null) return pack[key];
    if (dict.en && dict.en[key] != null) return dict.en[key];
    return null;
  }

  function applyLang(lang) {
    if (lang !== 'en' && lang !== 'th') lang = 'en';
    localStorage.setItem(STORAGE_KEY, lang);
    document.documentElement.lang = lang;
    document.documentElement.setAttribute('data-lang', lang);

    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var key = el.getAttribute('data-i18n');
      var val = t(key, lang);
      if (val == null) return;
      if (el.tagName === 'TITLE') {
        document.title = val;
      } else {
        el.textContent = val;
      }
    });

    document.querySelectorAll('[data-i18n-html]').forEach(function (el) {
      var key = el.getAttribute('data-i18n-html');
      var val = t(key, lang);
      if (val != null) el.innerHTML = val;
    });

    document.querySelectorAll('[data-i18n-aria]').forEach(function (el) {
      var key = el.getAttribute('data-i18n-aria');
      var val = t(key, lang);
      if (val != null) el.setAttribute('aria-label', val);
    });

    var page = document.body.getAttribute('data-page');
    if (page) {
      var titleKey = 'meta.' + page + '.title';
      var titleVal = t(titleKey, lang);
      if (titleVal) document.title = titleVal;
      var descKey = 'meta.' + page + '.desc';
      var descVal = t(descKey, lang);
      var meta = document.querySelector('meta[name="description"]');
      if (meta && descVal) meta.setAttribute('content', descVal);
    }

    document.querySelectorAll('[data-set-lang]').forEach(function (btn) {
      var active = btn.getAttribute('data-set-lang') === lang;
      btn.classList.toggle('is-active', active);
      btn.setAttribute('aria-pressed', active ? 'true' : 'false');
    });
  }

  function wireLangSwitch() {
    document.querySelectorAll('[data-set-lang]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        applyLang(btn.getAttribute('data-set-lang'));
      });
    });
  }

  function wireNav() {
    var toggle = document.querySelector('.nav-toggle');
    var menu = document.getElementById('nav-menu');
    if (toggle && menu) {
      toggle.addEventListener('click', function () {
        var open = menu.classList.toggle('open');
        toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      });
    }
  }

  function wireReveal() {
    var nodes = document.querySelectorAll('.reveal');
    if (!('IntersectionObserver' in window)) {
      nodes.forEach(function (n) { n.classList.add('visible'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.16, rootMargin: '0px 0px -8% 0px' });
    nodes.forEach(function (n) { io.observe(n); });
  }

  function wireDownloadLinks() {
    var cfg = window.TR_SITE || {};
    var play = document.getElementById('btn-play');
    var apk = document.getElementById('btn-apk');
    var playNote = document.getElementById('play-note');
    var apkNote = document.getElementById('apk-note');
    var apkVer = document.getElementById('apk-version');
    var install = document.getElementById('apk-install');

    if (play && cfg.playStoreUrl) {
      play.setAttribute('href', cfg.playStoreUrl);
      if (cfg.playStoreReady) {
        play.classList.remove('is-disabled');
        play.removeAttribute('aria-disabled');
        if (playNote) playNote.hidden = true;
      } else {
        play.classList.add('is-disabled');
        play.setAttribute('aria-disabled', 'true');
        if (playNote) playNote.hidden = false;
      }
    }

    if (apk && cfg.apkUrl) {
      apk.setAttribute('href', cfg.apkUrl);
      if (cfg.apkUrl.indexOf('http') === 0) {
        apk.removeAttribute('download');
      } else {
        apk.setAttribute('download', 'ThaiRecall.apk');
      }
      if (cfg.apkReady) {
        apk.classList.remove('is-disabled');
        apk.removeAttribute('aria-disabled');
        if (apkNote) apkNote.hidden = true;
        if (install) install.hidden = false;
        if (apkVer) {
          if (cfg.apkVersionLabel) {
            apkVer.hidden = false;
            apkVer.textContent = (t('dl.apkVer', currentLang()) || 'APK version') + ': ' + cfg.apkVersionLabel;
          } else {
            apkVer.hidden = true;
          }
        }
      } else {
        apk.classList.add('is-disabled');
        apk.setAttribute('aria-disabled', 'true');
        if (apkNote) apkNote.hidden = false;
        if (install) install.hidden = true;
        if (apkVer) apkVer.hidden = true;
      }
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    wireNav();
    wireLangSwitch();
    applyLang(currentLang());
    wireReveal();
    wireDownloadLinks();
  });
})();
