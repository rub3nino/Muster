/* Demo data for the static preview. Every name, email and phone is fictional. */
(function () {
  const R = window.Muster;
  const H = 3600e3, now = Date.now();
  const iso = (ms) => new Date(ms).toISOString();

  R.STATUS = {
    received:  { chip: 'chip--info',   en: 'Received',        k: 'st.received' },
    waitlist:  { chip: 'chip--warn',   en: 'Waitlist',        k: 'st.waitlist' },
    awaiting:  { chip: 'chip--accent', en: 'Awaiting deposit', k: 'st.awaiting' },
    secured:   { chip: 'chip--ok',     en: 'Place secured',   k: 'st.secured' },
    paid:      { chip: 'chip--ok',     en: 'Paid in full',    k: 'st.paid' },
    cancelled: { chip: 'chip--bad',    en: 'Cancelled',       k: 'st.cancelled' },
  };
  R.statusChip = (s) => `<span class="chip ${R.STATUS[s].chip}">${R.esc(R.t(R.STATUS[s].k, R.STATUS[s].en))}</span>`;

  R.PACKAGES = [
    { id: 'eb', name: 'Early Bird', price: 135, was: 150, cap: 30, taken: 30, k: 'pk.eb.desc', desc: '3 nights + 9 meals + premium kit', state: 'soldout' },
    { id: 'std', name: 'Standard', price: 150, cap: null, taken: 47, k: 'pk.std.desc', desc: '3 nights + 9 meals + standard kit', state: 'live' },
    { id: 'plus', name: 'Plus', price: 165, cap: 40, taken: 21, k: 'pk.plus.desc', desc: '3 nights + 9 meals + premium kit', state: 'live' },
  ];
  R.price = (pkg) => (R.PACKAGES.find((p) => p.name === pkg) || {}).price || 0;

  const P = [
    // n, first, last, pkg, status, paid, extra
    [1, 'Andrei', 'Popescu', 'Early Bird', 'paid', 135, { city: 'Torino', church: 'Speranța', shirt: 'M', transport: 'own' }],
    [2, 'Maria', 'Ionescu', 'Early Bird', 'secured', 50, { city: 'Milano', church: 'Betel', shirt: 'S', allergies: 'Peanuts' }],
    [3, 'David', 'Rusu', 'Early Bird', 'awaiting', 0, { city: 'Roma', church: 'Elim', minor: true, due: now + 30 * H, shirt: 'L', transport: 'need' }],
    [4, 'Ana', 'Moldovan', 'Standard', 'awaiting', 0, { city: 'Torino', church: 'Speranța', due: now + 7 * H, shirt: 'XS', note: 'Called: pays tonight.' }],
    [5, 'Ioana', 'Stan', 'Standard', 'awaiting', 0, { city: 'Bologna', church: 'Harul', due: now - 5 * H, shirt: 'M' }],
    [6, 'Mihai', 'Dumitru', 'Plus', 'received', 0, { city: 'Padova', church: 'Betania', shirt: 'XL', transport: 'need' }],
    [7, 'Elena', 'Constantin', 'Plus', 'received', 0, { city: 'Verona', church: 'Elim', minor: true, shirt: 'S', allergies: 'Vegetarian' }],
    [8, 'Daniel', 'Marin', 'Standard', 'received', 0, { city: 'Genova', church: 'Filadelfia', shirt: 'L' }],
    [9, 'Sara', 'Lazăr', 'Early Bird', 'waitlist', 0, { city: 'Torino', church: 'Betel', shirt: 'XS' }],
    [10, 'Paul', 'Neagu', 'Standard', 'cancelled', 0, { city: 'Firenze', church: 'Harul', shirt: 'XL' }],
    [11, 'Cristina', 'Vasile', 'Plus', 'secured', 50, { city: 'Torino', church: 'Speranța', shirt: 'M', transport: 'need' }],
    [12, 'Gabriel', 'Toma', 'Standard', 'paid', 150, { city: 'Milano', church: 'Betel', shirt: 'L', transport: 'own' }],
    [13, 'Larisa', 'Munteanu', 'Standard', 'secured', 50, { city: 'Asti', church: 'Speranța', shirt: 'S', allergies: 'Lactose' }],
    [14, 'Ștefan', 'Georgescu', 'Plus', 'awaiting', 0, { city: 'Cuneo', church: 'Elim', due: now + 41 * H, shirt: 'M' }],
    [15, 'Diana', 'Pavel', 'Early Bird', 'waitlist', 0, { city: 'Novara', church: 'Betania', shirt: 'S' }],
    [16, 'Radu', 'Ene', 'Standard', 'received', 0, { city: 'Alessandria', church: 'Harul', shirt: 'XXL', transport: 'need' }],
  ];
  R.PEOPLE = P.map(([n, first, last, pkg, status, paid, x]) => {
    const minor = !!x.minor;
    const ascii = (s) => s.normalize('NFD').replace(/[^a-zA-Z]/g, '').toLowerCase();
    return {
      id: 'r' + n, n, first, last, pkg, status, paid, price: R.price(pkg),
      email: `${ascii(first)}.${ascii(last)}@example.com`,
      phone: '+39 333 000 ' + String(1000 + n * 37).slice(-4),
      birth: minor ? '2009-0' + ((n % 8) + 1) + '-14' : (1996 + (n % 8)) + '-0' + ((n % 8) + 1) + '-1' + (n % 9),
      age: minor ? 17 : 20 + (n % 8),
      gender: n % 2 ? 'm' : 'f',
      city: x.city, church: x.church, shirt: x.shirt || '', transport: x.transport || 'unsure',
      allergies: x.allergies || '', note: x.note || '',
      minor, parent: minor ? { name: 'Parent ' + last, phone: '+39 333 111 ' + String(2000 + n).slice(-4) } : null,
      due: x.due ? iso(x.due) : null,
      created: iso(now - (20 - n) * 26 * H),
    };
  });

  /* deadline label for "awaiting" rows */
  R.dueInfo = (p) => {
    if (p.status !== 'awaiting' || !p.due) return null;
    const ms = Date.parse(p.due) - Date.now();
    if (ms <= 0) return { late: true, text: R.t('due.expired', 'Deadline passed') };
    const h = Math.floor(ms / H), m = Math.floor((ms % H) / 60000);
    return { late: false, soon: h < 12, text: R.t('due.left', '{h} h {m} min left', { h, m }) };
  };
  R.initials = (p) => (p.first[0] + p.last[0]).toUpperCase();
  R.hue = (p) => (p.n * 47) % 360;
})();
