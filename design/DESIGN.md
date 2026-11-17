# Muster · design system

A complete, static HTML + CSS design for a self-hosted registration module (camps, retreats, events): public form, back office and emails. No framework, no build step, no web fonts. English is the base language; Italian and Romanian ship with it.

Open `index.html` with any static server:

```bash
python3 -m http.server 5610 --directory design
```

Then visit <http://127.0.0.1:5610>. Add `?lang=it` or `?lang=ro` to any page, or use the EN · IT · RO switch.

## What's inside

| File | What it is |
|---|---|
| `css/tokens.css` | Every colour, type size, space, radius, shadow and duration. Light by default, dark via `prefers-color-scheme` or `<html data-theme="dark">`. |
| `css/ui.css` | Components: app frame, sidebar, buttons, segmented control, chips, tags, cards, tables (cards on phones), board, properties, drawer (bottom sheet on phones), modal, publish bar, callouts, timeline, toasts, forms, switch. |
| `css/pages.css` | Layouts that are not reusable: live control centre with phone preview, login, public form, email editor, lists, brand page. |
| `js/muster.js` | Icons, shell (sidebar + topbar), i18n engine, theme, drawer/modal/focus trap, toasts. ~9 KB, no dependencies. |
| `js/i18n.js` | Italian and Romanian strings (550 keys each). |
| `js/data.js` | Fictional demo people and packages. Delete it when you connect real data. |

## Screens

| Page | Flow it covers |
|---|---|
| `login.html` | Email → 6-digit code (paste works, backspace moves back). Never says whether an address exists. |
| `overview.html` | Four numbers, the “Needs you” queue, what is live, packages, recent activity. |
| `registrations.html` | Database views (All, To do, Awaiting deposit, Waitlist, Secured, Cancelled), search, filter chips, table or board. Each person opens as a page in a side peek with **one next step**, details, payment, notes, history. Modals: send payment details, record payment, cancel, add manually. |
| `live.html` | **Live on site**: form mode (Open · Countdown · Paused · Closed), packages with switches and limits, whole-camp places, notices, scheduled changes. Every change is a draft; the bar counts them; *Review & publish* shows a before → after list and warns when the form stops accepting people. Phone preview updates as you edit. |
| `form-builder.html` | Fields (locked core fields + optional ones), text blocks, versioned consents, embed snippet. |
| `offer.html` | Event, ages, packages, sales windows, deposit, Revolut link, reminder. |
| `emails.html` | Eight templates, variables, per-language tabs, desktop/phone preview, test send. |
| `lists.html` | T-shirts, allergies (marked as health data), transport, minors with parents, rooms, money, cities. Copy or print. |
| `activity.html` | Append-only log, filtered by kind; backup download. |
| `team.html` | Roles explained, alerts, invite. |
| `public.html` | The visitor form in 4 steps with every state: open, waitlist, countdown, paused, closed, sent. |
| `brand.html` | Principles, colour, type, components, voice. |

## Rules that keep it consistent

- **Violet (`--accent`) means “you are here”**: current nav item, selected tab, focus ring, links. Never decoration.
- **Status colours only inside chips, dots and callouts.** Received = blue, Waitlist = amber, Awaiting deposit = violet, Secured / Paid = green, Cancelled = red.
- **One primary button per view**, dark ink. Destructive actions are outlined red and always confirm.
- **Every registration shows one next step** (`.nextstep`). Other actions live in the ⋯ menu.
- **Phones**: tables become cards (`.table--cards` + `data-label`), drawers become bottom sheets, modals slide up, touch targets ≥ 44 px, inputs 16 px so iOS does not zoom.
- **Dates and times in Europe/Rome**, formatted with `Intl` in the visitor's language.

## Translations

Write the English text in the markup and give it a key:

```html
<button class="btn" data-i18n="act.save">Save</button>
<input placeholder="Search…" data-i18n-attr="placeholder:reg.search">
```

In scripts: `Muster.t('reg.count', '{n} people', { n: 12 })`. Add the key to both `it` and `ro` in `js/i18n.js`. A new language is one more block plus its code in `LANGS` (`muster.js`).

## Applying it to the Rust templates

The shell injected by `muster.js` maps one-to-one to `templates/shell_start.html`; each page's `<div data-content>` is the body of the matching Askama template. Replace the demo arrays in the page scripts with the server-rendered rows (or `/api/...` calls) and keep the class names. The server stays the source of truth for prices, places and states; this layer only presents them.

## Licence

MIT, like the rest of the repository. Icons are drawn for this project. No third-party assets.
