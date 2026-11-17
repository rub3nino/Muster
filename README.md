<p align="center">
  <img src="design/brand/muster-mark.svg" width="72" height="72" alt="Muster logo">
</p>

<h1 align="center">Muster</h1>

<p align="center">
  Registrations for camps, retreats and events, done calmly.<br>
  A free, self-hosted registration module: public form, back office and the emails in between.<br>
  <b>English · Italiano · Română</b>
</p>

---

## Status

This repository currently holds the **complete design system and every screen** as static HTML and CSS. No framework, no build step, no web fonts. The server (Rust + SQLite, single binary) is being ported onto this design next.

| Part | State |
|---|---|
| Design system (tokens, components, icons, logo) | ✅ ready |
| All screens, desktop and phone, light and dark | ✅ ready |
| Translations EN / IT / RO (600+ strings each) | ✅ ready |
| Server: form, capacity, deposits, emails, audit log | 🚧 being ported |

## Try it

```bash
git clone https://github.com/rub3nino/Muster.git
cd Muster
python3 -m http.server 5610 --directory design
```

Open <http://127.0.0.1:5610>. Add `?lang=it` or `?lang=ro`, or use the EN · IT · RO switch. The demo sign-in code is `123456`.

## What it does

- **Public form in four steps** with every state the server can show: open, waitlist, countdown, paused, closed, sent. Minors get a parent block automatically.
- **Registrations as a database**: views (To do, Awaiting deposit, Waitlist, Secured, Cancelled), search, filters, table or board. Each person opens as a page with **one next step**.
- **Deposits that are fair**: payment details by email start a deadline (48 h by default) that a resend never extends. A reminder goes out before it ends; the team is told when it passes. Nothing frees a place automatically.
- **Live on site**: form mode (Open · Countdown · Paused · Closed), packages with their own windows and limits, places left, notices, scheduled changes. Every change is a draft until you review and publish it.
- **Emails** for every step, with variables and a desktop / phone preview.
- **Groups**: balanced, repeatable mixing (girls and boys evenly, ages spread, churches apart, one leader each), pinned people stay put, drag or press a number to move someone, undo everything. Name sets with preview (Fruit of the Spirit, camp theme, colours, tribes, your own), and a full-screen **live reveal** for the projector.
- **Lists** for the kitchen, drivers and rooms: T-shirts, allergies, transport, minors with parents, money by package.
- **Activity log** that can only grow, and roles: owner, organiser, read only.
- **Private by default**: health and faith data are labelled where they appear and never land in logs or read-only exports.

## Repository layout

```
design/
  index.html          preview hub, links to every screen
  *.html              one file per screen
  css/tokens.css      colour, type, space, radius, shadow, motion (light + dark)
  css/ui.css          components
  css/pages.css       page layouts
  js/muster.js        icons, shell, i18n, theme, drawers, modals, toasts
  js/i18n.js          Italian and Romanian strings
  js/data.js          fictional demo data
  brand/              logo files (SVG)
  DESIGN.md           how the system works and how to extend it
```

## Use the design in your own project

Copy `design/css/` and `design/js/muster.js` + `design/js/i18n.js`, then use the markup from any page. Read [design/DESIGN.md](design/DESIGN.md) for the rules (one accent colour, status colours only in chips, one next step per record, phone-first tables and sheets) and for adding a language.

## Logo

An **M that ends in a check**: to muster is to call people together and count who is there. Files and usage rules are in [design/brand](design/brand) and on the Logo page of the preview.

## Licence

[MIT](LICENSE). Use it, change it, ship it, for free.
