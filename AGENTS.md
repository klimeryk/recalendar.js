# AGENTS.md

Guidance for AI coding agents (GitHub Copilot, Cursor, Windsurf, etc.) working in this repository.

> Claude Code users: see [CLAUDE.md](./CLAUDE.md) for Claude-specific notes.

## Setup

Requires **Node 18**. Use `nvm use` (`.nvmrc` pins `18.*`).

```bash
nvm use
npm install       # install dependencies
npm run dev       # dev server → http://localhost:5173/
npm run build     # tsc + vite build
npm run lint      # ESLint (ts/tsx only, zero warnings allowed)
```

There are no tests.

## What this project does

ReCalendar generates PDF calendars for e-ink tablets (ReMarkable, Supernote). The user configures the calendar in a React form in the browser, then a Web Worker generates a PDF via `@react-pdf/renderer` and returns a blob to the main thread.

## Data flow

```
Configuration form (src/configuration.jsx)
  → postMessage(config) → src/worker/pdf.worker.js
  → renders src/pdf/recalendar.jsx (react-pdf Document)
  → PDF blob + config.json attachment
  → preview iframe / download
```

## Key files

| File | Role |
|------|------|
| `src/loader.jsx` | Instantiates `PdfConfig`, passes to `Configuration` |
| `src/configuration.jsx` | Central state owner; manages form state, spawns worker, preview/download |
| `src/pdf/config.js` | `PdfConfig` class: all config fields, defaults, `hydrateFromObject()`, `pageSizePt` computation, version constants |
| `src/lib/device-utils.js` | Device presets: ReMarkable 1&2, Paper Pro, Paper Pro Move, Supernote A5 X/Nomad/Manta, Custom |
| `src/lib/config-compat.js` | Version migration: converts v1–v3 configs to current v4 |
| `src/pdf/recalendar.jsx` | Root react-pdf `<Document>` that assembles all pages |
| `src/worker/pdf.worker.js` | Web Worker: inits i18n + dayjs, registers fonts, calls `pdf().toBlob()`, encodes config as Base64 attachment, posts blob back |
| `src/lib/pdf.js` | Custom wrapper around react-pdf renderer (lifecycle, blob generation, attachments) |
| `src/lib/itinerary-utils.js` | Item type constants: `ITINERARY_ITEM`, `ITINERARY_LINES`, `ITINERARY_NEW_PAGE` |

## PDF page components (`src/pdf/pages/`)

Generated in this order: `year-overview.jsx` → then per week: `month-overview.jsx` (on month start) + `day.jsx` per enabled weekday + optional `week-retrospective.jsx`. Also: `week-overview.jsx`, `last.jsx` (final page). Each component receives the full config and relevant dayjs date objects.

## Configuration round-tripping

Generated PDFs embed a `config.json` attachment (via `pdf-lib`). The form can load a previously generated PDF and restore all settings. Migrations live in `src/lib/config-compat.js`.

## i18n

Three namespaces per locale — `app` (UI), `config` (defaults/templates), `pdf` (PDF labels) — loaded at build time by `vite-plugin-i18next-loader` from `src/locales/<lang>/`. The worker re-initialises i18next independently. Language changes also update the dayjs locale and first-day-of-week.

## Code conventions

- **`.jsx` for JSX files** — TypeScript is light (mainly `vite.config.ts` and type imports)
- **Class components** with `withTranslation()` HOC are common (legacy pattern — match existing style)
- **Path alias** `~` → `src/` (configured in `vite.config.ts`)
- **ESLint** enforces tabs, single quotes, LF line endings, strict import ordering — run `npm run lint` before committing (zero warnings allowed)
- **ESM project** (`"type": "module"`) — no `__dirname`; use `fileURLToPath(new URL(..., import.meta.url))`
- **Itinerary items** carry nanoid IDs; drag-to-reorder uses `@dnd-kit`

## Critical: react-pdf page size (v4.3.x)

`@react-pdf/renderer` treats plain numbers in the `size` prop as **points**, not pixels. The `dpi` prop only converts explicit `'px'` string values.

**This project's pattern**: `PdfConfig` computes `this.pageSizePt = this.pageSize.map(px => px * 72 / this.dpi)`. All `<Page>` components use `size={config.pageSizePt}` with **no `dpi` prop**. `pageSize` (pixels) is kept only for UI display and serialisation.

Do not pass raw pixel values or add a `dpi` prop to `<Page>` — it will produce pages roughly 5× too large.

## Critical: react-pdf border styles (v4.3.x)

`border: 'none'` and `borderWidth: 0` throw "Invalid border width". Use per-side properties:

```js
// Good
borderRightWidth: 1, borderRightStyle: 'solid', borderRightColor: '#000'
// To remove a border from a base style:
delete stylesObject.borderRightWidth  // not: borderRightWidth: 0 or 'none'
```

## Critical: Web Worker — `window is not defined`

Vite's React Fast Refresh preamble references `window`, which doesn't exist in workers. `src/worker/window-polyfill.js` sets `globalThis.window = globalThis` and **must be the first import** in `pdf.worker.js`.
