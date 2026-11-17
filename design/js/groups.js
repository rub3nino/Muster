/* =========================================================
   Muster — Groups
   · mix      balanced, repeatable (seeded) assignment; pinned people stay put
   · names    four built-in sets (translated) + custom; any name editable inline
   · move     drag by the handle (mouse + touch), number keys 1–9/0, or the Move dialog
   · undo     every change is a snapshot; Ctrl/⌘+Z
   · present  full-screen reveal, group by group, for a projector
   Demo data only: everyone here is fictional.
   ========================================================= */
document.addEventListener('muster:ready', () => {
  'use strict';
  const R = Muster, $ = R.$, $$ = R.$$, esc = R.esc;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const rng = (a) => () => { a |= 0; a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };

  /* ---------------- people (demo) ---------------- */
  const FN_F = ['Ana', 'Maria', 'Elena', 'Ioana', 'Andreea', 'Bianca', 'Daria', 'Larisa', 'Sara', 'Rebeca', 'Naomi', 'Debora', 'Ruth', 'Estera', 'Miriam', 'Lidia', 'Tabita', 'Alina', 'Denisa', 'Raluca', 'Carmen', 'Iulia', 'Roxana', 'Teodora', 'Patricia', 'Emma', 'Sofia', 'Irina'];
  const FN_M = ['David', 'Daniel', 'Andrei', 'Mihai', 'Ștefan', 'Gabriel', 'Paul', 'Radu', 'Samuel', 'Iosif', 'Beniamin', 'Timotei', 'Caleb', 'Ionuț', 'Cristian', 'Florin', 'Marius', 'Lucas', 'Matei', 'Robert', 'Victor', 'Emanuel', 'Silas', 'Natan', 'Adrian', 'Vlad', 'Sebastian', 'Alex'];
  const LN = ['Popescu', 'Ionescu', 'Rusu', 'Moldovan', 'Stan', 'Dumitru', 'Constantin', 'Marin', 'Lazăr', 'Neagu', 'Vasile', 'Toma', 'Munteanu', 'Georgescu', 'Pavel', 'Ene', 'Matei', 'Ciobanu', 'Florea', 'Dinu', 'Barbu', 'Nistor', 'Tudor', 'Oprea', 'Sandu', 'Crăciun', 'Bălan', 'Ilie', 'Avram', 'Cozma'];
  const CH = ['Speranța', 'Betel', 'Elim', 'Harul', 'Betania', 'Filadelfia', 'Emanuel', 'Maranata', 'Sion'];
  const CT = ['Torino', 'Milano', 'Asti', 'Cuneo', 'Genova', 'Bologna', 'Verona', 'Padova', 'Roma', 'Novara'];
  const LEADERS = ['Maria Ionescu', 'Andrei Pop', 'Daniel Marin', 'Cristina Vasile', 'Iosif Barbu', 'Rebeca Toma', 'Samuel Ene', 'Lidia Pavel', 'Natan Dinu', 'Estera Ilie', 'Caleb Rusu', 'Ruth Florea'];
  const gen = rng(11);
  const pick = (a) => a[Math.floor(gen() * a.length)];
  const extra = Array.from({ length: 74 }, (_, i) => {
    const f = gen() < 0.52, minor = gen() < 0.14, age = minor ? 17 : 18 + Math.floor(gen() * 13);
    const st = i % 11 === 3 ? 'awaiting' : gen() < 0.45 ? 'paid' : 'secured';
    return { id: 'x' + i, n: 17 + i, first: pick(f ? FN_F : FN_M), last: pick(LN), gender: f ? 'f' : 'm', age, minor, church: pick(CH), city: pick(CT), status: st };
  });
  const ALL = [...R.PEOPLE.filter((p) => p.status !== 'cancelled' && p.status !== 'waitlist' && p.status !== 'received'), ...extra];
  const BY = Object.fromEntries(ALL.map((p) => [p.id, p]));
  const initials = (p) => (p.first[0] + p.last[0]).toUpperCase();
  const full = (p) => `${p.first} ${p.last}`;

  /* ---------------- name sets ---------------- */
  const SETS = {
    virtues: { k: 'gr.set.virtues', en: 'Fruit of the Spirit', hk: 'gr.set.virtues.h', h: 'Galatians 5:22–23, plus faith, hope and grace.',
      names: { en: ['Love', 'Joy', 'Peace', 'Patience', 'Kindness', 'Goodness', 'Faithfulness', 'Gentleness', 'Self-control', 'Faith', 'Hope', 'Grace'],
        it: ['Amore', 'Gioia', 'Pace', 'Pazienza', 'Benevolenza', 'Bontà', 'Fedeltà', 'Mitezza', 'Dominio di sé', 'Fede', 'Speranza', 'Grazia'],
        ro: ['Dragoste', 'Bucurie', 'Pace', 'Răbdare', 'Bunătate', 'Facere de bine', 'Credincioșie', 'Blândețe', 'Înfrânare', 'Credință', 'Nădejde', 'Har'] } },
    camp: { k: 'gr.set.camp', en: 'Camp theme', hk: 'gr.set.camp.h', h: 'From Matthew 5 and this year’s theme: brave, clean, faithful.',
      names: { en: ['Salt', 'Light', 'Lamp', 'City', 'Brave', 'Pure', 'Faithful', 'Rock', 'Fire', 'Seed', 'Bread', 'Vine'],
        it: ['Sale', 'Luce', 'Lampada', 'Città', 'Coraggiosi', 'Puri', 'Fedeli', 'Roccia', 'Fuoco', 'Seme', 'Pane', 'Vite'],
        ro: ['Sare', 'Lumină', 'Candelă', 'Cetate', 'Curajoși', 'Curați', 'Credincioși', 'Stâncă', 'Foc', 'Sămânță', 'Pâine', 'Vie'] } },
    colors: { k: 'gr.set.colors', en: 'Colours', hk: 'gr.set.colors.h', h: 'Each name matches its group colour: easy to spot on T-shirts and wristbands.',
      names: { en: ['Red', 'Orange', 'Yellow', 'Green', 'Teal', 'Cyan', 'Blue', 'Indigo', 'Violet', 'Pink', 'Brown', 'Grey'],
        it: ['Rossi', 'Arancioni', 'Gialli', 'Verdi', 'Turchesi', 'Azzurri', 'Blu', 'Indaco', 'Viola', 'Rosa', 'Marroni', 'Grigi'],
        ro: ['Roșii', 'Portocalii', 'Galbeni', 'Verzi', 'Turcoaz', 'Azurii', 'Albaștri', 'Indigo', 'Violet', 'Roz', 'Maro', 'Gri'] } },
    tribes: { k: 'gr.set.tribes', en: 'Tribes of Israel', hk: 'gr.set.tribes.h', h: 'Twelve names from Genesis 49, one for each group.',
      names: { en: ['Judah', 'Benjamin', 'Levi', 'Reuben', 'Simeon', 'Dan', 'Naphtali', 'Gad', 'Asher', 'Issachar', 'Zebulun', 'Joseph'],
        it: ['Giuda', 'Beniamino', 'Levi', 'Ruben', 'Simeone', 'Dan', 'Neftali', 'Gad', 'Aser', 'Issacar', 'Zabulon', 'Giuseppe'],
        ro: ['Iuda', 'Beniamin', 'Levi', 'Ruben', 'Simeon', 'Dan', 'Neftali', 'Gad', 'Așer', 'Isahar', 'Zabulon', 'Iosif'] } },
    custom: { k: 'gr.set.custom', en: 'Your own', hk: 'gr.set.custom.h', h: 'Write the names you want, one per line. Missing ones fall back to “Group 1, 2…”.', names: null },
  };

  /* ---------------- state ---------------- */
  const KEY = 'muster.groups.v1';
  const S = { k: 8, by: 'count', size: 11, await: false, rules: { gender: true, age: true, church: true, leaders: true }, set: 'virtues', custom: '', seed: 4821, groups: [], names: {}, locked: [] };
  try { const saved = JSON.parse(localStorage.getItem(KEY) || 'null'); if (saved && Array.isArray(saved.groups)) Object.assign(S, saved, { rules: { ...S.rules, ...(saved.rules || {}) } }); } catch { /* fresh start */ }
  let history = [];
  const snap = () => JSON.stringify({ groups: S.groups, names: S.names, locked: S.locked, set: S.set, seed: S.seed, k: S.k });
  const remember = () => { history.push(snap()); if (history.length > 60) history.shift(); $('#undo').disabled = false; };
  let saveT;
  const save = () => { clearTimeout(saveT); saveT = setTimeout(() => { try { localStorage.setItem(KEY, JSON.stringify(S)); $('#saved').hidden = false; } catch { $('#saved').hidden = true; } }, 250); };

  const pool = () => ALL.filter((p) => p.status === 'secured' || p.status === 'paid' || (S.await && p.status === 'awaiting'));
  const groupCount = () => Math.min(12, Math.max(2, S.by === 'count' ? S.k : Math.ceil(pool().length / S.size)));
  const color = (i) => `var(--g${(i % 12) + 1})`;
  const customList = () => S.custom.split('\n').map((s) => s.trim()).filter(Boolean);
  const defaultName = (i) => (S.set === 'custom' ? customList()[i] : (SETS[S.set].names[R.lang] || SETS[S.set].names.en)[i]) || R.t('gr.groupn', 'Group {n}', { n: i + 1 });
  const nameOf = (i) => S.names[i] ?? defaultName(i);
  const leaderOf = (i) => (S.rules.leaders ? LEADERS[i % LEADERS.length] : null);
  const groupIndexOf = (id) => S.groups.findIndex((g) => g.includes(id));

  /* ---------------- mixing ---------------- */
  function mix(seed) {
    const people = pool(); const k = groupCount(); const r = rng(seed);
    const ids = new Set(people.map((p) => p.id));
    const locked = new Set(S.locked.filter((id) => ids.has(id)));
    const groups = Array.from({ length: k }, () => []);
    S.groups.forEach((g, i) => { if (i < k) g.forEach((id) => { if (locked.has(id)) groups[i].push(id); }); });
    const placed = new Set(groups.flat());
    const rest = people.filter((p) => !placed.has(p.id));
    for (let i = rest.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [rest[i], rest[j]] = [rest[j], rest[i]]; }
    if (S.rules.age) rest.sort((a, b) => (b.minor ? 1 : 0) - (a.minor ? 1 : 0)); // hardest to spread go first; sort is stable, so the shuffle survives
    const cap = Math.ceil(people.length / k);
    for (const p of rest) {
      let best = [], bestScore = Infinity;
      groups.forEach((g, i) => {
        if (g.length >= cap) return;
        let s = g.length * 10; // size first: groups fill in rounds, rules break the ties inside a round
        if (S.rules.gender) s += g.filter((id) => BY[id].gender === p.gender).length * 4;
        if (S.rules.church) s += g.filter((id) => BY[id].church === p.church).length * 6;
        if (S.rules.age) s += (p.minor ? g.filter((id) => BY[id].minor).length * 8 : 0) + g.filter((id) => Math.abs(BY[id].age - p.age) <= 1).length;
        if (s < bestScore) { bestScore = s; best = [i]; } else if (s === bestScore) best.push(i);
      });
      if (!best.length) best = [groups.reduce((m, g, i) => (g.length < groups[m].length ? i : m), 0)];
      groups[best[Math.floor(r() * best.length)]].push(p.id);
    }
    groups.forEach((g) => g.sort((a, b) => full(BY[a]).localeCompare(full(BY[b]), 'ro')));
    return groups;
  }
  function reconcile() { // keep groups in sync with the pool and the group count, without reshuffling
    const ids = new Set(pool().map((p) => p.id)); const k = groupCount();
    let g = S.groups.map((x) => x.filter((id) => ids.has(id)));
    if (g.length > k) { const spill = g.slice(k).flat(); g = g.slice(0, k); spill.forEach((id) => g.reduce((m, x) => (x.length < m.length ? x : m), g[0]).push(id)); }
    while (g.length < k) g.push([]);
    const placed = new Set(g.flat());
    pool().filter((p) => !placed.has(p.id)).forEach((p) => g.reduce((m, x) => (x.length < m.length ? x : m), g[0]).push(p.id));
    S.groups = g;
  }

  /* ---------------- rendering ---------------- */
  function renderSetup() {
    $('#pool-n').textContent = pool().length;
    const k = groupCount(), n = pool().length;
    $('#step-v').textContent = S.by === 'count' ? S.k : S.size;
    $('#step-l').textContent = S.by === 'count'
      ? R.t('gr.step.count', 'groups of about {n} people', { n: Math.round(n / k) })
      : R.t('gr.step.size', 'people per group → {k} groups', { k });
    $('#seed-l').textContent = R.t('gr.seed', 'Mix no. {s} · same number, same groups', { s: S.seed });
    $('#inc-await').checked = S.await;
    $$('[data-rule]').forEach((c) => (c.checked = !!S.rules[c.dataset.rule]));
    $$('#by .seg__item').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.value === S.by)));
  }
  function renderNames(animate = false) {
    $('#sets').innerHTML = Object.entries(SETS).map(([id, s]) => `<button class="seg__item" type="button" aria-pressed="${id === S.set}" data-set="${id}">${esc(R.t(s.k, s.en))}</button>`).join('');
    $('#set-hint').textContent = R.t(SETS[S.set].hk, SETS[S.set].h);
    $('#custom-wrap').hidden = S.set !== 'custom';
    if ($('#custom').value !== S.custom) $('#custom').value = S.custom;
    const k = groupCount();
    const edited = Object.keys(S.names).length;
    $('#namechips').innerHTML = Array.from({ length: k }, (_, i) => `
      <span class="namechip${S.names[i] !== undefined ? ' is-edited' : ''}${animate ? ' is-new' : ''}" style="--gc:${color(i)};${animate ? `animation-delay:${i * 35}ms` : ''}" data-chip="${i}" tabindex="0" role="button" aria-label="${esc(R.t('gr.rename', 'Rename group {n}', { n: i + 1 }))}">
        <span class="namechip__n">${i + 1}</span><span class="namechip__dot"></span><span data-chip-text>${esc(nameOf(i))}</span></span>`).join('') +
      (edited ? `<button class="btn btn--ghost btn--sm" type="button" id="reset-names">${R.icon('undo', 'i--sm')}${esc(R.t('gr.resetnames', 'Use the set again'))}</button>` : '');
  }
  function stats(g) {
    const ps = g.map((id) => BY[id]);
    const f = ps.filter((p) => p.gender === 'f').length, m = ps.length - f;
    const ages = ps.map((p) => p.age);
    const churches = ps.reduce((o, p) => ((o[p.church] = (o[p.church] || 0) + 1), o), {});
    const top = Object.entries(churches).sort((a, b) => b[1] - a[1])[0] || ['', 0];
    return { n: ps.length, f, m, min: Math.min(...ages), max: Math.max(...ages), churches: Object.keys(churches).length, top, minors: ps.filter((p) => p.minor).length };
  }
  function renderBoard(flashId) {
    const k = S.groups.length, sizes = S.groups.map((g) => g.length);
    const avg = sizes.reduce((a, b) => a + b, 0) / Math.max(1, k);
    $('#board-sum').textContent = R.t('gr.sum', '{k} groups · {a}–{b} people each · {n} people', { k, a: Math.min(...sizes), b: Math.max(...sizes), n: pool().length });
    $('#groups').innerHTML = S.groups.map((g, i) => {
      const st = stats(g); const warns = [];
      if (Math.abs(st.n - avg) > 1.01) warns.push([st.n > avg ? 'gr.w.big' : 'gr.w.small', st.n > avg ? 'Bigger than the others' : 'Smaller than the others']);
      if (S.rules.gender && Math.abs(st.f - st.m) > 2) warns.push([st.f > st.m ? 'gr.w.girls' : 'gr.w.boys', st.f > st.m ? 'Mostly girls' : 'Mostly boys']);
      if (S.rules.church && st.top[1] > Math.max(2, Math.ceil(st.n / 3))) warns.push(['gr.w.church', '{n} from {c}', { n: st.top[1], c: st.top[0] }]);
      if (S.rules.age && st.minors > Math.ceil(pool().filter((p) => p.minor).length / k) + 1) warns.push(['gr.w.minors', '{n} minors', { n: st.minors }]);
      const lead = leaderOf(i);
      return `<section class="grp" style="--gc:${color(i)}" data-g="${i}" aria-label="${esc(nameOf(i))}">
        <div class="grp__band"></div>
        <header class="grp__head"><span class="grp__key" title="${esc(R.t('gr.keyhint', 'Press {n} to move the selected person here', { n: (i + 1) % 10 }))}">${(i + 1) % 10}</span>
          <button class="grp__name" type="button" data-rename="${i}">${esc(nameOf(i))}</button><span class="grp__count">${st.n}</span></header>
        <div class="grp__meta"><span class="split" title="${st.f} F · ${st.m} M"><i style="width:${st.n ? (st.f / st.n) * 100 : 50}%"></i><i style="width:${st.n ? (st.m / st.n) * 100 : 50}%"></i></span><span>${st.f}F · ${st.m}M</span><span>${st.n ? `${st.min}–${st.max}` : '—'} ${esc(R.t('of.years', 'years'))}</span><span>${esc(R.t('gr.churches', '{n} churches', { n: st.churches }))}</span></div>
        ${lead ? `<div class="grp__leader">${R.icon('shield', 'i--sm')}<span>${esc(R.t('gr.leader', 'Leader'))}: <b>${esc(lead)}</b></span></div>` : ''}
        ${warns.length ? `<div class="grp__warn">${warns.map(([kk, en, v]) => `<span class="chip chip--warn">${esc(R.t(kk, en, v))}</span>`).join('')}</div>` : ''}
        <ol class="grp__list" data-list="${i}">${g.map((id) => member(BY[id], i, id === flashId)).join('') || `<li class="small faint" style="padding:10px">${esc(R.t('gr.empty', 'Drop people here'))}</li>`}</ol>
      </section>`;
    }).join('');
    $('#copytext').value = S.groups.map((g, i) => `*${nameOf(i)}*${leaderOf(i) ? ` (${R.t('gr.leader', 'Leader')}: ${leaderOf(i)})` : ''}\n` + g.map((id, j) => `${j + 1}. ${full(BY[id])}`).join('\n')).join('\n\n');
    if (selected && !BY[selected]) selected = null;
    if (selected) $(`.member[data-id="${selected}"]`)?.classList.add('is-selected');
  }
  function member(p, gi, flash) {
    const locked = S.locked.includes(p.id);
    return `<li class="member${locked ? ' is-locked' : ''}${flash ? ' is-flash' : ''}" data-id="${p.id}" tabindex="0" aria-label="${esc(full(p))}, ${esc(nameOf(gi))}">
      <button class="member__grip" type="button" tabindex="-1" aria-label="${esc(R.t('gr.drag', 'Drag'))}">${R.icon('grip')}</button>
      <span class="avatar" style="background:var(--gc)">${initials(p)}</span>
      <span class="member__text"><span class="member__name">${esc(full(p))}${p.minor ? `<span class="member__tag">${esc(R.t('tag.minor', 'minor'))}</span>` : ''}</span><span class="member__sub">${p.age} · ${esc(p.church)} · ${esc(p.city)}</span></span>
      <span class="member__act">
        <button class="btn btn--ghost member__lock" type="button" data-lock aria-pressed="${locked}" title="${esc(R.t(locked ? 'gr.unpin' : 'gr.pin', locked ? 'Unpin' : 'Pin to this group'))}" aria-label="${esc(R.t(locked ? 'gr.unpin' : 'gr.pin', locked ? 'Unpin' : 'Pin to this group'))}">${R.icon('pin2', 'i--sm')}</button>
        <button class="btn btn--ghost" type="button" data-move title="${esc(R.t('gr.move', 'Move'))}" aria-label="${esc(R.t('gr.move', 'Move'))}">${R.icon('move', 'i--sm')}</button>
      </span></li>`;
  }
  function render(flashId) { renderSetup(); renderNames(); renderBoard(flashId); save(); }

  /* ---------------- actions ---------------- */
  let selected = null;
  function doMix(newSeed = true) {
    remember();
    if (newSeed) S.seed = 1000 + Math.floor(Math.random() * 9000);
    S.groups = mix(S.seed);
    render();
    if (!reduce) $$('.grp').forEach((g, i) => g.animate([{ opacity: 0, transform: 'translateY(8px)' }, { opacity: 1, transform: 'none' }], { duration: 320, delay: i * 40, easing: 'cubic-bezier(.16,1,.3,1)', fill: 'backwards' }));
    toastUndo(R.t('gr.t.mixed', 'Mixed: {k} groups', { k: S.groups.length }));
  }
  function move(id, to, pos = -1, quiet = false) {
    const from = groupIndexOf(id); if (from < 0 || to < 0 || to >= S.groups.length) return;
    if (from === to && pos < 0) return;
    remember();
    S.groups[from] = S.groups[from].filter((x) => x !== id);
    const list = S.groups[to];
    if (pos < 0 || pos > list.length) list.push(id); else list.splice(pos, 0, id);
    selected = id;
    renderBoard(id); save();
    if (!quiet) toastUndo(R.t('gr.t.moved', '{p} → {g}', { p: full(BY[id]), g: nameOf(to) }));
    $(`.member[data-id="${id}"]`)?.focus({ preventScroll: false });
  }
  function undo() {
    const last = history.pop(); if (!last) return;
    Object.assign(S, JSON.parse(last)); $('#undo').disabled = !history.length;
    render(); R.toast(R.t('gr.t.undone', 'Undone'));
  }
  function toastUndo(msg) {
    let box = $('.toasts'); if (!box) { box = document.createElement('div'); box.className = 'toasts'; box.setAttribute('role', 'status'); box.setAttribute('aria-live', 'polite'); document.body.append(box); }
    box.innerHTML = '';
    const t = document.createElement('div'); t.className = 'toast';
    t.innerHTML = `${R.icon('checkc')}<span>${esc(msg)}</span><button class="btn btn--sm" type="button" style="margin-left:8px;--h:28px;background:transparent;color:inherit;border-color:rgba(255,255,255,.3)">${esc(R.t('gr.undo', 'Undo'))}</button>`;
    t.querySelector('button').addEventListener('click', () => { t.remove(); undo(); });
    box.append(t); setTimeout(() => t.remove(), 4200);
  }

  /* ---------------- setup controls ---------------- */
  $('#by').addEventListener('seg:change', (e) => { S.by = e.detail; reconcileAndMix(); });
  const step = (d) => { if (S.by === 'count') S.k = Math.min(12, Math.max(2, S.k + d)); else S.size = Math.min(40, Math.max(3, S.size + d)); reconcileAndMix(); };
  $('#minus').addEventListener('click', () => step(-1));
  $('#plus').addEventListener('click', () => step(1));
  function reconcileAndMix() { remember(); S.groups = mix(S.seed); render(); }
  $('#inc-await').addEventListener('change', (e) => { S.await = e.target.checked; remember(); reconcile(); render(); });
  $$('[data-rule]').forEach((c) => c.addEventListener('change', () => { S.rules[c.dataset.rule] = c.checked; render(); }));
  $('#shuffle').addEventListener('click', () => doMix(true));
  $('#undo').addEventListener('click', undo);

  /* ---------------- names ---------------- */
  $('#sets').addEventListener('click', (e) => {
    const b = e.target.closest('[data-set]'); if (!b || b.dataset.set === S.set) return;
    remember(); S.set = b.dataset.set; S.names = {}; renderNames(true); renderBoard(); save();
    if (S.set === 'custom') $('#custom').focus();
  });
  $('#custom').addEventListener('input', (e) => { S.custom = e.target.value; renderNames(); renderBoard(); save(); });
  function startRename(i, host) {
    const cur = nameOf(i);
    const input = document.createElement('input');
    input.value = cur; input.maxLength = 28; input.setAttribute('aria-label', R.t('gr.rename', 'Rename group {n}', { n: i + 1 }));
    host.replaceChildren(input); input.focus(); input.select();
    const done = (commit) => {
      if (!input.isConnected) return;
      const v = input.value.trim();
      if (commit && v && v !== cur) { remember(); if (v === defaultName(i)) delete S.names[i]; else S.names[i] = v; }
      renderNames(); renderBoard(); save();
    };
    input.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); done(true); } if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); done(false); } });
    input.addEventListener('blur', () => done(true));
  }
  $('#namechips').addEventListener('click', (e) => {
    if (e.target.closest('#reset-names')) { remember(); S.names = {}; renderNames(true); renderBoard(); save(); return; }
    const c = e.target.closest('[data-chip]'); if (!c || c.querySelector('input')) return;
    startRename(Number(c.dataset.chip), c.querySelector('[data-chip-text]'));
  });
  $('#namechips').addEventListener('keydown', (e) => { const c = e.target.closest('[data-chip]'); if (c && (e.key === 'Enter' || e.key === ' ') && e.target === c) { e.preventDefault(); c.click(); } });

  /* ---------------- board: click, keys, move dialog ---------------- */
  const board = $('#groups');
  board.addEventListener('click', (e) => {
    const rn = e.target.closest('[data-rename]'); if (rn) { const i = Number(rn.dataset.rename); const span = document.createElement('span'); span.className = 'grp__name'; rn.replaceWith(span); startRename(i, span); return; }
    const li = e.target.closest('.member'); if (!li) return;
    const id = li.dataset.id;
    if (e.target.closest('[data-lock]')) { remember(); S.locked = S.locked.includes(id) ? S.locked.filter((x) => x !== id) : [...S.locked, id]; renderBoard(); save(); $(`.member[data-id="${id}"] [data-lock]`)?.focus(); return; }
    if (e.target.closest('[data-move]')) { openMove(id); return; }
    selected = selected === id ? null : id;
    $$('.member.is-selected').forEach((m) => m.classList.remove('is-selected'));
    if (selected) li.classList.add('is-selected');
  });
  board.addEventListener('keydown', (e) => {
    const li = e.target.closest('.member'); if (!li || e.target !== li) return;
    const id = li.dataset.id;
    if (/^[0-9]$/.test(e.key)) { const to = e.key === '0' ? 9 : Number(e.key) - 1; if (to < S.groups.length) { e.preventDefault(); move(id, to); } return; }
    if (e.key === 'Enter' || e.key === 'm' || e.key === 'M') { e.preventDefault(); openMove(id); return; }
    if (e.key === 'l' || e.key === 'L') { e.preventDefault(); li.querySelector('[data-lock]').click(); return; }
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); const sib = e.key === 'ArrowDown' ? li.nextElementSibling : li.previousElementSibling; sib?.classList.contains('member') && sib.focus(); return; }
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { e.preventDefault(); const gi = Number(li.closest('.grp').dataset.g) + (e.key === 'ArrowRight' ? 1 : -1); $(`.grp[data-g="${gi}"] .member`)?.focus(); }
  });
  board.addEventListener('focusin', (e) => { const li = e.target.closest('.member'); if (li && e.target === li) { selected = li.dataset.id; $$('.member.is-selected').forEach((m) => m.classList.remove('is-selected')); li.classList.add('is-selected'); } });
  document.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'z' && !e.target.closest('input, textarea') && $('#stage').hidden) { e.preventDefault(); undo(); }
  });
  let moving = null;
  function openMove(id) {
    moving = id; const p = BY[id], from = groupIndexOf(id);
    $('#m-move-t').textContent = R.t('gr.m.title', 'Move {p} to…', { p: full(p) });
    $('#m-move-s').textContent = R.t('gr.m.now', 'Now in {g} · on a keyboard, press the group number', { g: nameOf(from) });
    $('#movegrid').innerHTML = S.groups.map((g, i) => `<button type="button" data-to="${i}" style="--gc:${color(i)}" ${i === from ? 'aria-current="true" disabled' : ''}><span class="grp__key">${(i + 1) % 10}</span><span>${esc(nameOf(i))}<small>${esc(R.t('gr.m.count', '{n} people', { n: g.length }))}</small></span></button>`).join('');
    R.openModal('m-move');
  }
  $('#movegrid').addEventListener('click', (e) => { const b = e.target.closest('[data-to]'); if (!b || b.disabled) return; R.closeModal(); move(moving, Number(b.dataset.to)); });
  $('#m-move').addEventListener('keydown', (e) => { if (/^[0-9]$/.test(e.key)) { const to = e.key === '0' ? 9 : Number(e.key) - 1; const b = $(`#movegrid [data-to="${to}"]`); if (b && !b.disabled) { e.preventDefault(); b.click(); } } });

  /* ---------------- drag (pointer events: mouse, pen and touch) ---------------- */
  let drag = null;
  board.addEventListener('pointerdown', (e) => {
    const grip = e.target.closest('.member__grip'); if (!grip || e.button > 0) return;
    e.preventDefault();
    const li = grip.closest('.member');
    drag = { id: li.dataset.id, li, x0: e.clientX, y0: e.clientY, started: false, target: null, idx: -1 };
    grip.setPointerCapture?.(e.pointerId);
  });
  document.addEventListener('pointermove', (e) => {
    if (!drag) return;
    const { clientX: x, clientY: y } = e;
    if (!drag.started) {
      if (Math.hypot(x - drag.x0, y - drag.y0) < 4) return;
      drag.started = true;
      const p = BY[drag.id];
      drag.ghost = document.createElement('div'); drag.ghost.className = 'drag-ghost';
      drag.ghost.style.setProperty('--gc', getComputedStyle(drag.li).getPropertyValue('--gc'));
      drag.ghost.innerHTML = `<span class="avatar" style="background:var(--gc)">${initials(p)}</span>${esc(full(p))}`;
      document.body.append(drag.ghost); drag.li.classList.add('is-ghosted'); document.body.classList.add('is-dragging');
      drag.line = document.createElement('li'); drag.line.className = 'drop-line'; drag.line.setAttribute('aria-hidden', 'true');
    }
    drag.ghost.style.transform = `translate(${x - 18}px, ${y - 18}px)`;
    const el = document.elementFromPoint(x, y);
    const grp = el && el.closest('.grp');
    $$('.grp.is-over').forEach((g) => g !== grp && g.classList.remove('is-over'));
    if (!grp) { drag.target = null; drag.line.remove(); } else {
      grp.classList.add('is-over');
      const list = grp.querySelector('.grp__list');
      const items = [...list.querySelectorAll('.member')].filter((m) => m.dataset.id !== drag.id);
      let idx = items.findIndex((m) => { const r = m.getBoundingClientRect(); return y < r.top + r.height / 2; });
      if (idx < 0) idx = items.length;
      drag.target = Number(grp.dataset.g); drag.idx = idx;
      if (items[idx]) list.insertBefore(drag.line, items[idx]); else list.append(drag.line);
    }
    if (y < 70) scrollBy(0, -14); else if (y > innerHeight - 70) scrollBy(0, 14);
  });
  const endDrag = (commit) => {
    if (!drag) return;
    const d = drag; drag = null;
    if (!d.started) { if (commit) d.li.click(); return; }
    d.ghost.remove(); d.line.remove(); d.li.classList.remove('is-ghosted'); document.body.classList.remove('is-dragging');
    $$('.grp.is-over').forEach((g) => g.classList.remove('is-over'));
    if (commit && d.target !== null) {
      const from = groupIndexOf(d.id);
      const cur = S.groups[from].filter((x) => x !== d.id);
      const same = from === d.target && S.groups[from].indexOf(d.id) === d.idx;
      if (!same) move(d.id, d.target, d.idx, false);
      else renderBoard();
      void cur;
    }
  };
  document.addEventListener('pointerup', () => endDrag(true));
  document.addEventListener('pointercancel', () => endDrag(false));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && drag) endDrag(false); });

  /* ---------------- announce ---------------- */
  $('#announce').addEventListener('click', () => {
    const p = BY[S.groups[0][0]] || ALL[0];
    $('#ann-prev').innerHTML = `<span class="small faint">${esc(R.t('gr.ann.prev', 'Preview for {p}', { p: full(p) }))}</span>
      <b>${esc(R.t('gr.ann.hi', 'Hi {f}, here is your group for camp:', { f: p.first }))}</b>
      <span class="gr-mail__badge" style="--gc:${color(0)}"><i></i>${esc(nameOf(0))}</span>
      ${leaderOf(0) ? `<span>${esc(R.t('gr.ann.lead', 'Your leader is {l}. Look for your colour at check-in.', { l: leaderOf(0) }))}</span>` : ''}`;
    $('#ann-ok-l').textContent = R.t('gr.ann.send', 'Send {n} emails', { n: pool().length });
    R.openModal('m-ann');
  });
  $('#ann-ok').addEventListener('click', () => { R.closeModal(); R.toast(R.t('gr.ann.done', '{n} emails queued', { n: pool().length })); });

  /* ---------------- live presentation ---------------- */
  const stage = $('#stage'); let st = { i: -1, all: false }; let timers = [];
  const clearTimers = () => { timers.forEach(clearTimeout); timers = []; };
  function stageRender() {
    clearTimers();
    const k = S.groups.length, main = $('#st-main');
    $('#st-prev').disabled = st.i < 0 && !st.all;
    $('#st-next').disabled = st.i >= k - 1 && !st.all;
    $('#st-count').textContent = st.all ? '' : st.i < 0 ? '' : `${st.i + 1} / ${k}`;
    $('#st-dots').innerHTML = S.groups.map((_, i) => `<button type="button" data-dot="${i}" aria-label="${esc(nameOf(i))}" class="${i === st.i && !st.all ? 'is-on' : ''}" style="${i <= st.i || st.all ? `background:${color(i)}` : ''}"></button>`).join('');
    $('#st-all').textContent = st.all ? R.t('gr.st.one', 'One by one') : R.t('gr.st.all', 'All groups');
    if (st.all) {
      stage.style.setProperty('--gc', 'var(--g8)');
      main.innerHTML = `<div class="st-all">${S.groups.map((g, i) => `<div class="st-all__g" style="--gc:${color(i)}"><h3>${esc(nameOf(i))}</h3>${leaderOf(i) ? `<p style="font:500 12px/1.3 var(--font);color:#8E8E99;margin:-4px 0 8px">${esc(leaderOf(i))}</p>` : ''}<ol>${g.map((id) => `<li>${esc(full(BY[id]))}</li>`).join('')}</ol></div>`).join('')}</div>`;
      return;
    }
    if (st.i < 0) {
      stage.style.setProperty('--gc', 'var(--g8)');
      main.innerHTML = `<div class="st-intro"><span class="st-intro__k">Restart Camp 2027</span><h2 class="st-intro__t">${esc(R.t('gr.st.title', 'Your groups'))}</h2><p class="st-intro__s">${esc(R.t('gr.st.sub', '{k} groups · {n} people', { k, n: pool().length }))}</p><button class="st-intro__go" type="button" id="st-go">${esc(R.t('gr.st.go', 'Reveal the first group'))}</button></div>`;
      $('#st-go').addEventListener('click', () => stageGo(0)); return;
    }
    const i = st.i, g = S.groups[i];
    stage.style.setProperty('--gc', color(i));
    main.innerHTML = `<div class="st-group" style="--gc:${color(i)}">
      <span class="st-group__k"><i></i>${esc(R.t('gr.st.k', 'Group {a} of {b}', { a: i + 1, b: k }))}</span>
      <h2 class="st-group__name">${esc(nameOf(i))}</h2>
      ${leaderOf(i) ? `<p class="st-group__leader">${esc(R.t('gr.leader', 'Leader'))}: <b>${esc(leaderOf(i))}</b></p>` : ''}
      <div class="st-people">${g.map((id) => `<div class="st-person"><span class="avatar">${initials(BY[id])}</span><span class="st-person__n">${esc(full(BY[id]))}</span></div>`).join('')}</div></div>`;
    const cards = $$('.st-person', main);
    const names = ALL.map(full);
    cards.forEach((c, j) => {
      const finalName = full(BY[g[j]]), label = c.querySelector('.st-person__n');
      const t0 = 450 + j * (reduce ? 0 : 150);
      timers.push(setTimeout(() => {
        c.classList.add('is-in');
        if (reduce) return;
        c.classList.add('is-spinning');
        for (let s = 0; s < 6; s++) timers.push(setTimeout(() => { label.textContent = names[Math.floor(Math.random() * names.length)]; }, s * 45));
        timers.push(setTimeout(() => { label.textContent = finalName; c.classList.remove('is-spinning'); }, 290));
      }, t0));
    });
  }
  const stageGo = (i) => { st.all = false; st.i = Math.max(-1, Math.min(S.groups.length - 1, i)); stageRender(); };
  function openStage() {
    st = { i: -1, all: false }; stage.hidden = false; document.body.style.overflow = 'hidden';
    try { stage.requestFullscreen?.().catch(() => {}); } catch { /* not allowed here */ }
    stageRender(); $('#st-go')?.focus();
  }
  function closeStage() {
    clearTimers(); stage.hidden = true; document.body.style.overflow = '';
    try { if (document.fullscreenElement) document.exitFullscreen(); } catch { /* ignore */ }
    $('#present').focus();
  }
  $('#present').addEventListener('click', openStage);
  $('#st-exit').addEventListener('click', closeStage);
  $('#st-next').addEventListener('click', () => (st.all ? stageGo(0) : stageGo(st.i + 1)));
  $('#st-prev').addEventListener('click', () => (st.all ? stageGo(S.groups.length - 1) : stageGo(st.i - 1)));
  $('#st-all').addEventListener('click', () => { st.all = !st.all; if (!st.all && st.i < 0) st.i = 0; stageRender(); });
  $('#st-dots').addEventListener('click', (e) => { const d = e.target.closest('[data-dot]'); if (d) stageGo(Number(d.dataset.dot)); });
  stage.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') { e.preventDefault(); $('#st-next').disabled || $('#st-next').click(); }
    else if (e.key === 'ArrowLeft' || e.key === 'PageUp') { e.preventDefault(); $('#st-prev').disabled || $('#st-prev').click(); }
    else if (e.key === 'a' || e.key === 'A') { e.preventDefault(); $('#st-all').click(); }
    else if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); closeStage(); }
  });
  document.addEventListener('fullscreenchange', () => { if (!document.fullscreenElement && !stage.hidden) stage.focus?.(); });
  stage.tabIndex = -1;

  /* ---------------- start ---------------- */
  document.addEventListener('muster:lang', () => { render(); if (!stage.hidden) stageRender(); });
  if (!S.groups.length) S.groups = mix(S.seed); else reconcile();
  render();
  $('#undo').disabled = true;
});
