/* =========================================================
   Muster — shared UI runtime for the static design preview.
   · icons      R.icon(name)                → inline SVG string
   · i18n       data-i18n="key"             → text from I18N[lang][key], English is the markup itself
                data-i18n-attr="placeholder:key; aria-label:key"
                R.t(key, englishFallback, vars)
   · shell      <body data-page="…" data-shell>  → sidebar + topbar around <main data-content>
   · behaviour  [data-drawer-open], [data-modal-open], [data-seg], [data-toast], publish bar
   No dependencies. Everything degrades: without JS the page content still reads.
   ========================================================= */
(function () {
  'use strict';
  const R = (window.Muster = window.Muster || {});
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  R.$ = $; R.$$ = $$;
  const store = {
    get(k) { try { return localStorage.getItem('muster.' + k); } catch { return null; } },
    set(k, v) { try { localStorage.setItem('muster.' + k, v); } catch { /* private mode */ } },
  };
  R.store = store;
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  R.esc = esc;

  /* ---------------- icons (24px grid, 1.7 stroke, round caps) ---------------- */
  const P = {
    home: '<path d="M3.5 10.5 12 3.5l8.5 7V20a1 1 0 0 1-1 1H15v-6H9v6H4.5a1 1 0 0 1-1-1z"/>',
    users: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c.6-3.3 3.3-5.5 6.5-5.5s5.9 2.2 6.5 5.5"/><path d="M16 4.7a3.5 3.5 0 0 1 0 6.6"/><path d="M18 14.8c2 .7 3.2 2.4 3.5 5.2"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c.8-4 4-6.5 8-6.5s7.2 2.5 8 6.5"/>',
    live: '<circle cx="12" cy="12" r="2"/><path d="M8.5 8.5a5 5 0 0 0 0 7"/><path d="M15.5 8.5a5 5 0 0 1 0 7"/><path d="M5.6 5.6a9 9 0 0 0 0 12.8"/><path d="M18.4 5.6a9 9 0 0 1 0 12.8"/>',
    tag: '<path d="M3 12V4a1 1 0 0 1 1-1h8l9 9-9 9z"/><circle cx="7.5" cy="7.5" r="1.5"/>',
    calendar: '<rect x="3" y="5" width="18" height="16" rx="2.5"/><path d="M3 10h18M8 3v4M16 3v4"/>',
    mail: '<rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="m3.5 7 8.5 6 8.5-6"/>',
    list: '<path d="M9 6h12M9 12h12M9 18h12M4 6h.01M4 12h.01M4 18h.01"/>',
    history: '<path d="M3 12a9 9 0 1 0 3-6.7"/><path d="M3 4v4h4"/><path d="M12 8v4l3 2"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    shield: '<path d="M12 3 4.5 6v6c0 4.4 3.2 8.2 7.5 9 4.3-.8 7.5-4.6 7.5-9V6z"/><path d="m9 12 2 2 4-4"/>',
    form: '<path d="M14 3H6.5a1.5 1.5 0 0 0-1.5 1.5v15A1.5 1.5 0 0 0 6.5 21h11a1.5 1.5 0 0 0 1.5-1.5V8z"/><path d="M14 3v5h5M9 13h6M9 17h4"/>',
    euro: '<circle cx="12" cy="12" r="9"/><path d="M15 8.6a4 4 0 1 0 0 6.8M7.5 11h6M7.5 13.5h5"/>',
    zap: '<path d="M13 2 4 14h7l-1 8 9-12h-7z"/>',
    check: '<path d="m5 12.5 4.5 4.5L19 7.5"/>',
    checkc: '<circle cx="12" cy="12" r="9"/><path d="m8 12 3 3 5-6"/>',
    alert: '<circle cx="12" cy="12" r="9"/><path d="M12 7.5v5.5M12 16.5h.01"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5.5M12 7.5h.01"/>',
    x: '<path d="M6 6l12 12M18 6 6 18"/>',
    chevr: '<path d="m9 6 6 6-6 6"/>', chevd: '<path d="m6 9 6 6 6-6"/>', chevl: '<path d="m15 6-6 6 6 6"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
    filter: '<path d="M4 5h16l-6 8v6l-4-2v-4z"/>',
    download: '<path d="M12 4v11M7 10l5 5 5-5M5 20h14"/>',
    copy: '<rect x="8" y="8" width="12" height="12" rx="2.5"/><path d="M16 8V5.5A1.5 1.5 0 0 0 14.5 4h-9A1.5 1.5 0 0 0 4 5.5v9A1.5 1.5 0 0 0 5.5 16H8"/>',
    menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
    more: '<circle cx="5" cy="12" r="1.2" fill="currentColor"/><circle cx="12" cy="12" r="1.2" fill="currentColor"/><circle cx="19" cy="12" r="1.2" fill="currentColor"/>',
    phone: '<path d="M5 4h3.5l2 5L8 10.5a11 11 0 0 0 5.5 5.5L15 13.5l5 2V19a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/>',
    pin: '<path d="M12 21s-7-6-7-11a7 7 0 0 1 14 0c0 5-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/>',
    cake: '<path d="M4 21h16M5 21v-6.5A1.5 1.5 0 0 1 6.5 13h11a1.5 1.5 0 0 1 1.5 1.5V21"/><path d="M5 17c1.5 0 1.5-1 3.5-1s2 1 3.5 1 1.5-1 3.5-1 2 1 3.5 1M12 13V9M12 6.5c-.8-.8-.8-1.8 0-3 .8 1.2.8 2.2 0 3z"/>',
    shirt: '<path d="M8.5 3 4 5l-1.5 5 3.5 1.2V21h12V11.2l3.5-1.2L20 5l-4.5-2c0 1.7-1.6 3-3.5 3s-3.5-1.3-3.5-3z"/>',
    car: '<path d="M5 17v2M19 17v2"/><rect x="3" y="10.5" width="18" height="6.5" rx="2"/><path d="m5 10.5 2-5h10l2 5M7 14h.01M17 14h.01"/>',
    heart: '<path d="M20.5 8.5c0 5-8.5 11-8.5 11S3.5 13.5 3.5 8.5A4.5 4.5 0 0 1 12 6.2a4.5 4.5 0 0 1 8.5 2.3z"/>',
    note: '<path d="M5 3.5h14v11L13.5 20H5z"/><path d="M13.5 20v-5.5H19M8.5 8h7M8.5 11.5h4"/>',
    eye: '<path d="M2.5 12S6 5 12 5s9.5 7 9.5 7-3.5 7-9.5 7-9.5-7-9.5-7z"/><circle cx="12" cy="12" r="3"/>',
    pause: '<circle cx="12" cy="12" r="9"/><path d="M10 9v6M14 9v6"/>',
    lock: '<rect x="5" y="11" width="14" height="10" rx="2.5"/><path d="M8 11V7.5a4 4 0 0 1 8 0V11"/>',
    timer: '<circle cx="12" cy="13.5" r="7.5"/><path d="M12 10v3.5l2 2M9.5 2.5h5"/>',
    megaphone: '<path d="M3.5 10v4a1 1 0 0 0 1 1H7l6.5 4.5v-15L7 9H4.5a1 1 0 0 0-1 1z"/><path d="M17 9a4 4 0 0 1 0 6M7 15l1 5h2.5"/>',
    code: '<path d="m8 7-5 5 5 5M16 7l5 5-5 5M13.5 4l-3 16"/>',
    sparkle: '<path d="M12 3.5 13.8 9l5.7 1.9-5.7 1.9L12 18.5l-1.8-5.7L4.5 11 10.2 9z"/><path d="M19 3v3M17.5 4.5h3"/>',
    globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.6 3.7 5.6 3.7 9s-1.2 6.4-3.7 9c-2.5-2.6-3.7-5.6-3.7-9S9.5 5.6 12 3z"/>',
    moon: '<path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2.5v2M12 19.5v2M4.6 4.6 6 6M18 18l1.4 1.4M2.5 12h2M19.5 12h2M4.6 19.4 6 18M18 6l1.4-1.4"/>',
    send: '<path d="M21 3 10 14"/><path d="M21 3 14.5 21l-4.5-7-7-4.5z"/>',
    undo: '<path d="M9 14 4 9l5-5"/><path d="M4 9h11a5 5 0 0 1 0 10h-3"/>',
    trash: '<path d="M4 7h16M9.5 7V4.5h5V7M6 7l1 13h10l1-13M10 11v5M14 11v5"/>',
    edit: '<path d="M4 20h4L19.5 8.5l-4-4L4 16z"/><path d="m13.5 6.5 4 4"/>',
    external: '<path d="M14 4h6v6M20 4l-9 9M18 14v4.5a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 4 18.5v-11A1.5 1.5 0 0 1 5.5 6H10"/>',
    board: '<rect x="3" y="4" width="5" height="16" rx="1.5"/><rect x="10" y="4" width="5" height="11" rx="1.5"/><rect x="17" y="4" width="4" height="7" rx="1.5"/>',
    table: '<rect x="3" y="4" width="18" height="16" rx="2.5"/><path d="M3 9.5h18M9 9.5V20"/>',
    bed: '<path d="M3 18.5V6.5M3 14h18v4.5M21 14v-1.5a3 3 0 0 0-3-3h-7V14"/><circle cx="7" cy="11" r="2"/>',
    church: '<path d="M12 2.5v4M10 4.5h4M6 21v-8l6-5 6 5v8z"/><path d="M10 21v-4a2 2 0 0 1 4 0v4"/>',
    hourglass: '<path d="M6.5 3h11M6.5 21h11M7.5 3c0 4.5 4.5 6 4.5 9s-4.5 4.5-4.5 9M16.5 3c0 4.5-4.5 6-4.5 9s4.5 4.5 4.5 9"/>',
    wallet: '<path d="M4 7.5V18a2 2 0 0 0 2 2h13a1 1 0 0 0 1-1v-3"/><path d="M4 7.5A2.5 2.5 0 0 1 6.5 5H17v2.5"/><path d="M20 10.5h-4a2 2 0 0 0 0 4h4z"/><path d="M4 7.5h15a1 1 0 0 1 1 1v2"/>',
    gift: '<rect x="3.5" y="8" width="17" height="4" rx="1"/><path d="M5 12v8.5h14V12M12 8v12.5M12 8S10.5 3.5 8 4.5 9.5 8 12 8zm0 0s1.5-4.5 4-3.5S14.5 8 12 8z"/>',
    logout: '<path d="M14 4h4.5A1.5 1.5 0 0 1 20 5.5v13a1.5 1.5 0 0 1-1.5 1.5H14M10 16l-4-4 4-4M6 12h10"/>',
    grip: '<circle cx="9" cy="6" r="1" fill="currentColor"/><circle cx="15" cy="6" r="1" fill="currentColor"/><circle cx="9" cy="12" r="1" fill="currentColor"/><circle cx="15" cy="12" r="1" fill="currentColor"/><circle cx="9" cy="18" r="1" fill="currentColor"/><circle cx="15" cy="18" r="1" fill="currentColor"/>',
    key: '<circle cx="8" cy="15" r="4"/><path d="m11 12 9-9M17 6l2 2M15 8l2 2"/>',
    sliders: '<path d="M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12M20 18h0"/><circle cx="16" cy="6" r="2"/><circle cx="10" cy="12" r="2"/><circle cx="18" cy="18" r="2"/>',
    layers: '<path d="m12 3 9 5-9 5-9-5z"/><path d="m3 13 9 5 9-5"/>',
    arrowr: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    swatch: '<rect x="3" y="3" width="8" height="18" rx="2"/><path d="M11 7.5 15.5 3l5.5 5.5L11 18.5"/><path d="M11 21h9a1 1 0 0 0 1-1v-6h-6"/>',
  };
  R.icon = (n, cls = '') => `<svg class="i ${cls}" viewBox="0 0 24 24" aria-hidden="true">${P[n] || P.info}</svg>`;
  R.mark = '<svg viewBox="5.5 7 21 18" aria-hidden="true" style="stroke-width:2.6"><path d="M8 22.5V9.5l5.5 6.5 5.5-6.5"/><path d="m16 19.5 2.7 2.7 5.3-6.2"/></svg>'; // the Muster glyph: an M that closes with a check
  function hydrateIcons(root = document) {
    $$('[data-icon]', root).forEach((el) => { if (!el.dataset.iconDone) { el.insertAdjacentHTML('afterbegin', R.icon(el.dataset.icon, el.dataset.iconClass || '')); el.dataset.iconDone = '1'; } });
  }
  R.hydrateIcons = hydrateIcons;

  /* ---------------- i18n ---------------- */
  const LANGS = ['en', 'it', 'ro'];
  const LOCALE = { en: 'en-GB', it: 'it-IT', ro: 'ro-RO' };
  function pickLang() {
    const q = new URLSearchParams(location.search).get('lang');
    if (LANGS.includes(q)) return q;
    const s = store.get('lang'); if (LANGS.includes(s)) return s;
    const nav = (navigator.language || 'en').slice(0, 2).toLowerCase();
    return LANGS.includes(nav) ? nav : 'en';
  }
  R.lang = pickLang();
  R.locale = () => LOCALE[R.lang];
  R.t = (key, en, vars) => {
    const d = (window.I18N && window.I18N[R.lang]) || {};
    let s = R.lang === 'en' ? en : (d[key] ?? en);
    if (vars) s = String(s).replace(/\{(\w+)\}/g, (m, k) => (vars[k] ?? m));
    return s;
  };
  function applyI18n(root = document) {
    $$('[data-i18n]', root).forEach((el) => {
      if (el.dataset.en === undefined) el.dataset.en = el.textContent.trim().replace(/\s+/g, ' ');
      el.textContent = R.t(el.dataset.i18n, el.dataset.en);
    });
    $$('[data-i18n-attr]', root).forEach((el) => {
      el.dataset.i18n_attr_en = el.dataset.i18n_attr_en || JSON.stringify(Object.fromEntries(el.dataset.i18nAttr.split(';').map((p) => p.trim()).filter(Boolean).map((p) => { const [a] = p.split(':'); return [a, el.getAttribute(a) || '']; })));
      const en = JSON.parse(el.dataset.i18n_attr_en);
      el.dataset.i18nAttr.split(';').map((p) => p.trim()).filter(Boolean).forEach((p) => { const [a, k] = p.split(':'); el.setAttribute(a, R.t(k, en[a])); });
    });
    $$('[data-date]', root).forEach((el) => { el.textContent = R.fmtDate(el.dataset.date, el.dataset.fmt); });
    $$('[data-money]', root).forEach((el) => { el.textContent = R.money(Number(el.dataset.money)); });
    $$('.lang button').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.lang === R.lang)));
    document.documentElement.lang = R.lang;
    if (root === document) document.dispatchEvent(new CustomEvent('muster:lang')); // pages re-render dynamic parts, then call applyI18n(theirRoot)
  }
  R.applyI18n = applyI18n;
  R.setLang = (l) => { if (!LANGS.includes(l)) return; R.lang = l; store.set('lang', l); applyI18n(); };
  R.fmtDate = (iso, fmt = 'day') => {
    const d = new Date(iso); if (isNaN(d)) return iso;
    const o = fmt === 'time' ? { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }
      : fmt === 'long' ? { weekday: 'short', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' }
      : fmt === 'hm' ? { hour: '2-digit', minute: '2-digit' }
      : { day: 'numeric', month: 'short', year: 'numeric' };
    return new Intl.DateTimeFormat(R.locale(), { timeZone: 'Europe/Rome', ...o }).format(d);
  };
  R.money = (n) => new Intl.NumberFormat(R.locale(), { style: 'currency', currency: 'EUR', currencyDisplay: 'narrowSymbol', maximumFractionDigits: n % 1 ? 2 : 0 }).format(n);
  R.langSwitch = () => `<div class="lang" role="group" aria-label="Language">${LANGS.map((l) => `<button type="button" data-lang="${l}" aria-pressed="${l === R.lang}">${l.toUpperCase()}</button>`).join('')}</div>`;

  /* ---------------- theme ---------------- */
  const theme = store.get('theme'); if (theme === 'dark' || theme === 'light') document.documentElement.dataset.theme = theme;
  R.toggleTheme = () => {
    const cur = document.documentElement.dataset.theme || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    const next = cur === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = next; store.set('theme', next);
  };

  /* ---------------- shell (sidebar + topbar) ---------------- */
  const NAV = [
    { group: null, items: [
      { id: 'overview', href: 'overview.html', icon: 'home', k: 'nav.overview', en: 'Overview' },
      { id: 'registrations', href: 'registrations.html', icon: 'users', k: 'nav.registrations', en: 'Registrations', count: '128' },
    ] },
    { group: ['nav.g.live', 'Live on site'], items: [
      { id: 'live', href: 'live.html', icon: 'live', k: 'nav.live', en: 'Status & packages', dot: true },
      { id: 'form', href: 'form-builder.html', icon: 'form', k: 'nav.form', en: 'Form & consents' },
    ] },
    { group: ['nav.g.setup', 'Setup'], items: [
      { id: 'offer', href: 'offer.html', icon: 'tag', k: 'nav.offer', en: 'Event & pricing' },
      { id: 'emails', href: 'emails.html', icon: 'mail', k: 'nav.emails', en: 'Emails' },
    ] },
    { group: ['nav.g.data', 'Records'], items: [
      { id: 'lists', href: 'lists.html', icon: 'list', k: 'nav.lists', en: 'Lists' },
      { id: 'activity', href: 'activity.html', icon: 'history', k: 'nav.activity', en: 'Activity' },
      { id: 'team', href: 'team.html', icon: 'shield', k: 'nav.team', en: 'Team' },
    ] },
  ];
  function buildShell() {
    const body = document.body;
    if (!body.hasAttribute('data-shell')) return;
    const page = body.dataset.page;
    const content = $('[data-content]');
    const title = body.dataset.title || document.title.split('·')[0].trim();
    const titleKey = body.dataset.titleKey || '';
    const nav = NAV.map((g) => `${g.group ? `<div class="nav__label" data-i18n="${g.group[0]}">${g.group[1]}</div>` : ''}${g.items.map((it) => `
      <a class="nav__item" href="${it.href}"${it.id === page ? ' aria-current="page"' : ''}>${R.icon(it.icon)}<span data-i18n="${it.k}">${it.en}</span>${it.count ? `<span class="nav__count">${it.count}</span>` : ''}${it.dot ? '<span class="nav__dot" title="Live"></span>' : ''}</a>`).join('')}`).join('');
    const app = document.createElement('div');
    app.className = 'app'; app.id = 'app';
    app.innerHTML = `
      <aside class="sidebar" aria-label="Sidebar" id="sidebar">
        <a class="brand" href="index.html"><span class="brand__mark">${R.mark}</span><span class="brand__name">Muster</span></a>
        <div class="menu">
          <button type="button" class="account" data-menu-btn aria-haspopup="menu" aria-expanded="false">
            <span class="avatar" data-hue style="--h:262">AP</span>
            <span class="account__text"><span class="account__name">Andrei Pop</span><span class="account__role" data-i18n="role.owner">Owner</span></span>
            ${R.icon('chevr', 'i--sm')}
          </button>
          <div class="menu__list" role="menu" hidden style="left:0;right:auto;width:100%">
            <div class="micro" style="padding:6px 10px 4px" data-i18n="menu.language">Language</div>
            <div style="padding:2px 6px 6px">${R.langSwitch()}</div>
            <button class="menu__item" role="menuitem" type="button" data-theme-toggle>${R.icon('moon')}<span data-i18n="menu.theme">Light / dark</span></button>
            <div class="menu__sep"></div>
            <a class="menu__item" role="menuitem" href="login.html">${R.icon('logout')}<span data-i18n="menu.signout">Sign out</span></a>
          </div>
        </div>
        <nav class="nav" aria-label="Sections">${nav}</nav>
        <div class="sidebar__foot">
          <a class="livecard" href="live.html">
            <span class="livecard__icon">${R.icon('live', 'i--sm')}</span>
            <span class="livecard__body">
              <span class="livecard__title"><span class="nav__dot" style="margin:0"></span><span data-i18n="live.card.title">Registrations open</span></span>
              <span class="livecard__text" data-i18n="live.card.text">98 of 120 places taken · Early Bird sold out</span>
            </span>
          </a>
        </div>
      </aside>
      <button type="button" class="scrim" data-scrim aria-label="Close menu" data-i18n-attr="aria-label:a11y.closemenu"></button>
      <div class="main">
        <header class="topbar" data-topbar>
          <button type="button" class="btn btn--ghost btn--icon topbar__menu" data-nav-open aria-label="Open menu" aria-controls="sidebar" aria-expanded="false" data-i18n-attr="aria-label:a11y.openmenu">${R.icon('menu')}</button>
          <nav class="crumbs" aria-label="Breadcrumb"><span>Restart Camp 2027</span>${R.icon('chevr', 'i--sm')}<b ${titleKey ? `data-i18n="${titleKey}"` : ''}>${esc(title)}</b></nav>
          <div class="topbar__end">${R.langSwitch()}<button type="button" class="btn btn--ghost btn--icon btn--sm" data-theme-toggle aria-label="Theme" data-i18n-attr="aria-label:menu.theme">${R.icon('moon')}</button></div>
        </header>
        <main class="page ${body.dataset.pageClass || ''}" id="main" tabindex="-1"></main>
      </div>`;
    const skip = document.createElement('a');
    skip.className = 'skip-link'; skip.href = '#main'; skip.textContent = 'Skip to content'; skip.dataset.i18n = 'a11y.skip';
    $('main.page', app).append(...content.childNodes);
    content.replaceWith(app);
    body.prepend(skip);
  }

  /* ---------------- behaviour ---------------- */
  function toast(msg, bad = false) {
    let box = $('.toasts'); if (!box) { box = document.createElement('div'); box.className = 'toasts'; box.setAttribute('role', 'status'); box.setAttribute('aria-live', 'polite'); document.body.append(box); }
    const t = document.createElement('div'); t.className = 'toast' + (bad ? ' toast--bad' : '');
    t.innerHTML = R.icon(bad ? 'alert' : 'checkc') + `<span>${esc(msg)}</span>`;
    box.append(t); setTimeout(() => { t.style.transition = 'opacity .3s'; t.style.opacity = '0'; setTimeout(() => t.remove(), 320); }, 2600);
  }
  R.toast = toast;

  let lastFocus = null;
  const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]):not([type=hidden]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
  function trap(e, box) {
    if (e.key !== 'Tab') return;
    const f = $$(FOCUSABLE, box).filter((el) => el.offsetParent !== null);
    if (!f.length) return;
    if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
    else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
  }
  R.openDrawer = (id) => {
    const d = document.getElementById(id); if (!d) return;
    lastFocus = document.activeElement;
    let bd = $('.backdrop'); if (!bd) { bd = document.createElement('div'); bd.className = 'backdrop'; bd.addEventListener('click', R.closeDrawer); document.body.append(bd); }
    d.classList.add('is-open'); bd.classList.add('is-open'); d.removeAttribute('inert'); d.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    setTimeout(() => ($('[data-autofocus]', d) || $('[data-drawer-close]', d))?.focus(), 60);
  };
  R.closeDrawer = () => {
    $$('.drawer.is-open').forEach((d) => { d.classList.remove('is-open'); d.setAttribute('inert', ''); d.setAttribute('aria-hidden', 'true'); });
    $('.backdrop')?.classList.remove('is-open'); document.body.style.overflow = '';
    lastFocus?.focus?.();
  };
  R.openModal = (id) => {
    const m = document.getElementById(id); if (!m) return;
    lastFocus = document.activeElement; m.classList.add('is-open'); m.removeAttribute('inert'); document.body.style.overflow = 'hidden';
    setTimeout(() => ($('[data-autofocus]', m) || $(FOCUSABLE, $('.modal__box', m)))?.focus(), 40);
  };
  R.closeModal = (m) => {
    m = m || $('.modal.is-open'); if (!m) return;
    m.classList.remove('is-open'); m.setAttribute('inert', ''); if (!$('.drawer.is-open')) document.body.style.overflow = '';
    lastFocus?.focus?.();
  };

  function wire() {
    document.addEventListener('click', (e) => {
      const t = e.target;
      const lang = t.closest('.lang button'); if (lang) { R.setLang(lang.dataset.lang); return; }
      if (t.closest('[data-theme-toggle]')) { R.toggleTheme(); return; }
      if (t.closest('[data-nav-open]')) { $('#app').classList.add('nav-open'); $('[data-nav-open]').setAttribute('aria-expanded', 'true'); $('#sidebar .nav__item')?.focus(); return; }
      if (t.closest('[data-scrim]')) { $('#app').classList.remove('nav-open'); $('[data-nav-open]')?.setAttribute('aria-expanded', 'false'); return; }
      const mb = t.closest('[data-menu-btn]');
      $$('.menu__list').forEach((l) => { if (!mb || l !== mb.nextElementSibling) { l.hidden = true; l.previousElementSibling?.setAttribute('aria-expanded', 'false'); } });
      if (mb) { const l = mb.nextElementSibling; l.hidden = !l.hidden; mb.setAttribute('aria-expanded', String(!l.hidden)); return; }
      const dOpen = t.closest('[data-drawer-open]'); if (dOpen) { e.preventDefault(); R.openDrawer(dOpen.dataset.drawerOpen); return; }
      if (t.closest('[data-drawer-close]')) { R.closeDrawer(); return; }
      const mOpen = t.closest('[data-modal-open]'); if (mOpen) { e.preventDefault(); R.openModal(mOpen.dataset.modalOpen); return; }
      if (t.closest('[data-modal-close]') || t.classList.contains('modal__scrim')) { R.closeModal(t.closest('.modal')); return; }
      const seg = t.closest('[data-seg] .seg__item');
      if (seg && seg.tagName === 'BUTTON') {
        const group = seg.closest('[data-seg]');
        $$('.seg__item', group).forEach((b) => b.setAttribute(b.hasAttribute('aria-pressed') ? 'aria-pressed' : 'aria-selected', String(b === seg)));
        const target = group.dataset.seg;
        if (target) $$(`[data-pane="${target}"]`).forEach((p) => { p.hidden = p.dataset.paneId !== seg.dataset.paneId; });
        group.dispatchEvent(new CustomEvent('seg:change', { detail: seg.dataset.paneId || seg.dataset.value, bubbles: true }));
        return;
      }
      const ts = t.closest('[data-toast]'); if (ts) { toast(R.t(ts.dataset.toastKey || '', ts.dataset.toast)); }
      const cp = t.closest('[data-copy]'); if (cp) {
        const src = document.getElementById(cp.dataset.copy); const text = src ? (src.value ?? src.textContent) : '';
        (navigator.clipboard?.writeText(text) || Promise.reject()).then(() => toast(R.t('toast.copied', 'Copied to clipboard'))).catch(() => toast(R.t('toast.copied', 'Copied to clipboard')));
      }
    });
    document.addEventListener('keydown', (e) => {
      const m = $('.modal.is-open'); const d = $('.drawer.is-open');
      if (e.key === 'Escape') {
        if (m) { R.closeModal(m); return; }
        if (d) { R.closeDrawer(); return; }
        $('#app')?.classList.remove('nav-open');
        $$('.menu__list').forEach((l) => (l.hidden = true));
      }
      if (m) trap(e, $('.modal__box', m)); else if (d) trap(e, d);
    });
    const tb = $('[data-topbar]');
    if (tb) addEventListener('scroll', () => tb.classList.toggle('is-scrolled', scrollY > 4), { passive: true });
    $$('.drawer').forEach((d) => { if (!d.classList.contains('is-open')) { d.setAttribute('inert', ''); d.setAttribute('aria-hidden', 'true'); } });
    $$('.modal').forEach((m) => { if (!m.classList.contains('is-open')) m.setAttribute('inert', ''); });
    $$('tr[data-href]').forEach((tr) => tr.addEventListener('keydown', (e) => { if (e.key === 'Enter') tr.click(); }));
  }

  document.addEventListener('DOMContentLoaded', () => {
    buildShell();
    hydrateIcons();
    wire();
    applyI18n();
    document.dispatchEvent(new CustomEvent('muster:ready'));
  });
})();
