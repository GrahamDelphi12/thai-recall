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

    document.querySelectorAll('[data-i18n-placeholder]').forEach(function (el) {
      var key = el.getAttribute('data-i18n-placeholder');
      var val = t(key, lang);
      if (val != null) el.setAttribute('placeholder', val);
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
      menu.querySelectorAll('a').forEach(function (link) {
        link.addEventListener('click', function () {
          menu.classList.remove('open');
          toggle.setAttribute('aria-expanded', 'false');
        });
      });
    }
  }

  var RTGS_API_DEFAULT = 'https://thairecall-rtgs-74012798523.us-central1.run.app/rtgs';

  function wireTryDemo() {
    var input = document.getElementById('thai-input');
    var btn = document.getElementById('thai-transliterate');
    var primaryOut = document.getElementById('thai-output');
    var primaryLabel = document.getElementById('primary-label');
    var output = document.getElementById('rtgs-output');
    var rtgsBlock = document.getElementById('rtgs-block');
    var area = document.getElementById('result-area');
    var speakBtn = document.getElementById('thai-speak');
    if (!input || !btn || !output || !area || !primaryOut) return;

    var cfg = window.TR_SITE || {};
    var apiUrl = cfg.rtgsApiUrl || RTGS_API_DEFAULT;
    var canSpeak = typeof window.speechSynthesis !== 'undefined';
    var lastSpeakText = '';
    var lastSpeakLang = 'th-TH';
    var thaiVoice = null;
    var enVoice = null;

    function pickVoice(langPrefix, nameHint) {
      if (!canSpeak) return null;
      var voices = window.speechSynthesis.getVoices() || [];
      var re = new RegExp('^' + langPrefix + '(-|$)', 'i');
      return (
        voices.find(function (v) { return re.test(v.lang); }) ||
        (nameHint ? voices.find(function (v) { return nameHint.test(v.name); }) : null) ||
        null
      );
    }

    function refreshVoices() {
      thaiVoice = pickVoice('th', /thai/i);
      enVoice = pickVoice('en', null);
    }

    if (canSpeak) {
      refreshVoices();
      window.speechSynthesis.onvoiceschanged = refreshVoices;
    }

    function stopSpeech() {
      if (canSpeak) window.speechSynthesis.cancel();
    }

    function speakText(text, lang) {
      if (!canSpeak || !text) return;
      stopSpeech();
      var u = new SpeechSynthesisUtterance(text);
      u.lang = lang || 'th-TH';
      u.rate = 0.92;
      if (lang && lang.indexOf('th') === 0) {
        if (!thaiVoice) thaiVoice = pickVoice('th', /thai/i);
        if (thaiVoice) u.voice = thaiVoice;
      } else {
        if (!enVoice) enVoice = pickVoice('en', null);
        if (enVoice) u.voice = enVoice;
      }
      window.speechSynthesis.speak(u);
    }

    function setSpeakVisible(show) {
      if (!speakBtn) return;
      speakBtn.hidden = !(canSpeak && show);
    }

    function setFieldValue(el, value, readOnly) {
      if (!el) return;
      if (el.tagName === 'TEXTAREA' || el.tagName === 'INPUT') {
        el.value = value;
        el.readOnly = !!readOnly;
      } else {
        el.textContent = value;
      }
    }

    function applyDirection(direction) {
      var thToEn = direction === 'th_to_en';
      if (primaryLabel) {
        primaryLabel.textContent = t(
          thToEn ? 'home.tryEnglishLabel' : 'home.tryThaiLabel',
          currentLang()
        ) || (thToEn ? 'English' : 'Thai');
      }
      if (primaryOut) {
        primaryOut.lang = thToEn ? 'en' : 'th';
        primaryOut.classList.toggle('is-english', thToEn);
      }
      if (rtgsBlock) rtgsBlock.hidden = thToEn;
    }

    function run() {
      var text = (input.value || '').trim();
      if (!text) {
        input.focus();
        return;
      }

      stopSpeech();
      lastSpeakText = '';
      lastSpeakLang = 'th-TH';
      setSpeakVisible(false);
      if (rtgsBlock) rtgsBlock.hidden = false;
      if (primaryLabel) {
        primaryLabel.textContent = t('home.tryThaiLabel', currentLang()) || 'Thai';
      }

      var processing = t('home.tryProcessing', currentLang()) || 'Processing…';
      primaryOut.textContent = processing;
      setFieldValue(output, processing, true);
      area.hidden = false;
      btn.disabled = true;

      fetch(apiUrl + '?text=' + encodeURIComponent(text))
        .then(function (res) {
          if (!res.ok) throw new Error('bad status');
          return res.json();
        })
        .then(function (data) {
          var err = t('home.tryError', currentLang()) || 'Error';
          var direction = (data && data.direction) || 'en_to_th';
          var thai = (data && data.thai) ? data.thai : '';
          var english = (data && data.english) ? data.english : '';
          var rtgs = (data && data.rtgs) ? data.rtgs : '';

          applyDirection(direction);

          if (direction === 'th_to_en') {
            primaryOut.textContent = english || err;
            setFieldValue(output, '', true);
            if (english) {
              lastSpeakText = english;
              lastSpeakLang = 'en-US';
              setSpeakVisible(true);
              speakText(english, 'en-US');
            }
          } else {
            primaryOut.textContent = thai || err;
            setFieldValue(output, rtgs || err, !rtgs);
            if (thai && rtgs) {
              lastSpeakText = thai;
              lastSpeakLang = 'th-TH';
              setSpeakVisible(true);
              speakText(thai, 'th-TH');
            }
          }
        })
        .catch(function () {
          var err = t('home.tryError', currentLang()) || 'Could not reach the engine. Try again.';
          primaryOut.textContent = err;
          setFieldValue(output, err, true);
          if (rtgsBlock) rtgsBlock.hidden = false;
          setSpeakVisible(false);
        })
        .then(function () {
          btn.disabled = false;
        });
    }

    btn.addEventListener('click', run);
    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        run();
      }
    });
    if (speakBtn) {
      speakBtn.addEventListener('click', function () {
        if (lastSpeakText) speakText(lastSpeakText, lastSpeakLang);
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

  function isAndroidDevice() {
    var ua = navigator.userAgent || '';
    // Android phones/tablets only — not desktop browsers spoofing lightly via "Android" alone with Windows
    return /Android/i.test(ua);
  }

  function setDisabled(el, disabled) {
    if (!el) return;
    if (disabled) {
      el.classList.add('is-disabled');
      el.setAttribute('aria-disabled', 'true');
      el.addEventListener('click', blockDisabledClick);
    } else {
      el.classList.remove('is-disabled');
      el.removeAttribute('aria-disabled');
      el.removeEventListener('click', blockDisabledClick);
    }
  }

  function blockDisabledClick(e) {
    var el = e.currentTarget;
    if (el && el.getAttribute('aria-disabled') === 'true') {
      e.preventDefault();
      e.stopPropagation();
    }
  }

  function wireDownloadLinks() {
    var cfg = window.TR_SITE || {};
    var play = document.getElementById('btn-play');
    var apk = document.getElementById('btn-apk');
    var playNote = document.getElementById('play-note');
    var apkNote = document.getElementById('apk-note');
    var androidNote = document.getElementById('android-only-note');
    var apkVer = document.getElementById('apk-version');
    var install = document.getElementById('apk-install');
    var onAndroid = isAndroidDevice();

    if (play && cfg.playStoreUrl) {
      play.setAttribute('href', cfg.playStoreUrl);
      if (cfg.playStoreReady) {
        setDisabled(play, false);
        if (playNote) playNote.hidden = true;
      } else {
        setDisabled(play, true);
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

      if (!cfg.apkReady) {
        setDisabled(apk, true);
        apk.removeAttribute('href');
        apk.removeAttribute('download');
        if (apkNote) apkNote.hidden = false;
        if (androidNote) androidNote.hidden = true;
        if (install) install.hidden = true;
        if (apkVer) apkVer.hidden = true;
      } else if (!onAndroid) {
        // Soft gate: hide/disable APK UI off Android. Direct URL can still be fetched;
        // real paywall needs a store (Gumroad/Lemon Squeezy/Play).
        setDisabled(apk, true);
        apk.removeAttribute('href');
        apk.removeAttribute('download');
        if (apkNote) apkNote.hidden = true;
        if (androidNote) androidNote.hidden = false;
        if (install) install.hidden = true;
        if (apkVer) apkVer.hidden = true;
      } else {
        setDisabled(apk, false);
        if (apkNote) apkNote.hidden = true;
        if (androidNote) androidNote.hidden = true;
        if (install) install.hidden = false;
        if (apkVer) {
          if (cfg.apkVersionLabel) {
            apkVer.hidden = false;
            apkVer.textContent = (t('dl.apkVer', currentLang()) || 'APK version') + ': ' + cfg.apkVersionLabel;
          } else {
            apkVer.hidden = true;
          }
        }
      }
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    wireNav();
    wireLangSwitch();
    applyLang(currentLang());
    wireReveal();
    wireDownloadLinks();
    wireTryDemo();
  });
})();
