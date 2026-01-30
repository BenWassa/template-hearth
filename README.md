# Hearth (Template)

Hearth is a calm, shared watchlist for couples that turns choosing what to watch into a small, pleasant ritual.

This template build is **local-only** and **offline-friendly**. It uses browser localStorage and ships with a
pre-seeded shelf based on the posters already in `public/posters`.

---

## What This Template Does

- Local-only shelf (no Firebase)
- A finite shelf of saved movies and shows with posters already in this repo
- A "Tonight" tray that surfaces a few options
- Vibes (comfort, easy, gripping, visual, classic) and energy levels (light, balanced, focused)
- A gentle decision helper that picks from your shelf

### Dummy Features (Template)

- Add item
- Import
- Export

These actions are intentionally disabled and display a small message instead.

---

## Project Structure (Template)

- `src/App.js` - UI shell and view switching
- `src/views/` - View components (Onboarding, Tonight, Shelf, Add, Decision, Import)
- `src/components/` - UI primitives and cards
- `src/domain/` - Pure domain logic
- `src/app/` - App hooks (localStorage-backed)
- `src/utils/` + `src/config/` - Shared utilities and constants

---

## Quick Start

### Prerequisites

- Node.js 18+
- npm

### Install

```bash
npm install
```

### Run (Dev)

```bash
npm run dev
```

### Build (Prod)

```bash
npm run build
```

---

## Notes

- The shelf seeds from `src/media-map.json` on first load and persists to localStorage.
- Clearing localStorage will reset the shelf back to the seeded state.

