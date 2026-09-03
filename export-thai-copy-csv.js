/* Build thai-copy-review.csv from i18n.js for native Thai revision */
const fs = require('fs');
const src = fs.readFileSync('i18n.js', 'utf8');
const start = src.indexOf('window.TR_I18N = ');
if (start < 0) {
  console.error('TR_I18N not found');
  process.exit(1);
}
const objSrc = src.slice(start + 'window.TR_I18N = '.length).replace(/;\s*$/, '');
const data = Function('"use strict"; return (' + objSrc + ')')();
const en = data.en || {};
const th = data.th || {};

function csvEsc(s) {
  if (s == null) s = '';
  s = String(s).replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  if (/[",\n]/.test(s)) return '"' + s.replace(/"/g, '""') + '"';
  return s;
}

function section(key) {
  const p = key.split('.')[0];
  const map = {
    meta: 'SEO / meta',
    nav: 'Navigation',
    home: 'Home',
    how: 'How it works',
    ped: 'Pedagogy',
    about: 'About',
    dl: 'Download / Pricing',
    priv: 'Privacy (site)',
    apppriv: 'Privacy (app)',
    footer: 'Footer',
    lang: 'Language'
  };
  return map[p] || p;
}

function priority(key) {
  if (key.startsWith('meta.')) return 'Low (SEO)';
  if (key.startsWith('apppriv.') || key.startsWith('priv.')) return 'Medium (legal tone)';
  if (key.startsWith('nav.') || key.startsWith('footer.') || key.startsWith('lang.')) return 'Low (UI short)';
  if (/^(dl\.(price|gate|apk|buy|soon|eyebrow|h1|h2|meta|maint)|home\.(tryBtn|tryClear|trySpeak|tryLabel|cta|buyCta|priceLink|flow))/.test(key)) {
    return 'Low (UI short)';
  }
  if (/^(ped\.|home\.(hero|sell|used|prob|tryCustom|quote|creator)|about\.|how\.)/.test(key)) {
    return 'High (brand voice)';
  }
  return 'Medium';
}

const header = [
  'Key',
  'Section',
  'Priority for native review',
  'English (source)',
  'Thai (current — revise this)',
  'Thai revised (native fill)',
  'Notes'
];

const rows = [header.map(csvEsc).join(',')];
const keys = Object.keys(en);

for (const k of keys) {
  rows.push([
    csvEsc(k),
    csvEsc(section(k)),
    csvEsc(priority(k)),
    csvEsc(en[k]),
    csvEsc(th[k] != null ? th[k] : ''),
    '',
    csvEsc(th[k] == null ? 'MISSING Thai' : '')
  ].join(','));
}

for (const k of Object.keys(th)) {
  if (!en[k]) {
    rows.push([
      csvEsc(k),
      csvEsc(section(k)),
      csvEsc('Medium'),
      '',
      csvEsc(th[k]),
      '',
      csvEsc('Thai-only key (no EN)')
    ].join(','));
  }
}

// UTF-8 BOM helps Excel recognise Thai
fs.writeFileSync('thai-copy-review.csv', '\uFEFF' + rows.join('\n') + '\n', 'utf8');
console.log('Wrote thai-copy-review.csv with', rows.length - 1, 'string rows');
