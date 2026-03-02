# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

> For guidance targeting other AI agents (Copilot, Cursor, Windsurf, etc.), see [AGENTS.md](./AGENTS.md).

## Commands

Always run with Node 18 (`nvm use` first — `.nvmrc` specifies `18.*`).

```bash
nvm use
npm install       # install dependencies
npm run dev       # dev server → http://localhost:5173/
npm run build     # tsc + vite build
npm run lint      # ESLint (ts/tsx only, zero warnings allowed)
```

There are no tests.

## Architecture

ReCalendar generates PDF calendars for e-ink tablets (ReMarkable, Supernote). The user configures the calendar in a React form, then a Web Worker generates a PDF via `@react-pdf/renderer` and returns a blob to the main thread.

### Data flow

```
Configuration form (src/configuration.jsx)
  → postMessage(config) → src/worker/pdf.worker.js
  → renders src/pdf/recalendar.jsx (react-pdf Document)
  → PDF blob + config.json attachment
  → preview iframe / download
```

### Key files

- **`src/loader.jsx`** — Instantiates `PdfConfig`, passes to `Configuration`
- **`src/configuration.jsx`** — Central state owner; manages form state, spawns worker, handles preview/download
- **`src/pdf/config.js`** — `PdfConfig` class: all config fields with defaults, `hydrateFromObject()`; computes `pageSizePt` from `pageSize`/`dpi`; version constants (`CONFIG_VERSION_1`–`4`)
- **`src/lib/device-utils.js`** — Device presets: ReMarkable 1&2, ReMarkable Paper Pro, ReMarkable Paper Pro Move, Supernote A5 X, Supernote Nomad, Supernote Manta, Custom
- **`src/lib/config-compat.js`** — Version migration: converts v1→v4 configs on load
- **`src/pdf/recalendar.jsx`** — Root react-pdf `<Document>` that assembles all pages from the config
- **`src/worker/pdf.worker.js`** — Runs in a Web Worker; initialises i18n + dayjs, registers fonts, calls `pdf().toBlob()`, encodes config as a Base64 attachment, posts blob back
- **`src/lib/pdf.js`** — Custom wrapper around the react-pdf renderer instance (manages lifecycle, blob generation, attachments)

### PDF page components (`src/pdf/pages/`)

`recalendar.jsx` generates pages in this order: `YearOverview` → then for each week: `MonthOverview` (on month start) + `DayPage` per enabled weekday + optional `WeekRetrospective`. Each page receives the full config and the relevant dayjs date objects.

Page files: `year-overview.jsx`, `month-overview.jsx`, `week-overview.jsx`, `week-retrospective.jsx`, `day.jsx`, `last.jsx` (final page).

### Configuration round-tripping

Generated PDFs have a `config.json` file embedded as an attachment (via `pdf-lib`). The configuration form can load a previously generated PDF and restore its settings. Version migrations live in `src/lib/config-compat.js`.

### i18n

Three namespaces per locale — `app` (UI), `config` (defaults/templates), `pdf` (PDF labels) — loaded at build time by `vite-plugin-i18next-loader` from `src/locales/<lang>/`. The worker re-initialises i18next independently from the main thread. Language changes also update the dayjs locale and first-day-of-week.

### Itinerary items

Three item types defined in `src/lib/itinerary-utils.js`: `ITINERARY_ITEM` (text header), `ITINERARY_LINES` (blank ruled lines), `ITINERARY_NEW_PAGE` (page break). Items carry nanoid IDs and are reordered via `@dnd-kit`.

## Conventions

- **JSX files use `.jsx`**, TypeScript is present but lightly used (mostly for Vite config and type imports)
- **Class components** with `withTranslation()` HOC are common throughout (legacy pattern)
- **Path alias** `~` resolves to `src/` (configured in `vite.config.ts`)
- **ESLint** enforces tabs, single quotes, LF line endings, and strict import ordering — run lint before committing
- **No `__dirname`** — project is ESM (`"type": "module"`); use `fileURLToPath(new URL(..., import.meta.url))` instead

## Known react-pdf quirks (v4.3.x)

### Page size must be in points, not pixels
`@react-pdf/renderer` v4.3.x treats plain numbers in the `<Page size={...}>` prop as **points** directly. The `dpi` prop on `<Page>` only converts values that carry an explicit `'px'` string unit (e.g. `'1404px'`). Passing `size={[1404, 1872]}` with `dpi={226}` produces a 1404×1872 pt page — roughly 5× too large.

**Pattern used in this project**: `PdfConfig` computes `this.pageSizePt = this.pageSize.map(px => px * 72 / this.dpi)` after loading config. All `<Page>` components use `size={config.pageSizePt}` with no `dpi` prop. `pageSize` (pixels) is kept for UI display and serialisation only.

### Border shorthand restrictions
`border: 'none'` and `borderWidth: 0` both throw "Invalid border width" errors. Use individual side properties instead (`borderTopWidth: 0`, `borderRightWidth: 1`, `borderRightStyle: 'solid'`, etc.). To conditionally remove a border set in a base style, use `delete stylesObject.prop` rather than assigning `'none'`.

### Web Worker: `window is not defined`
Vite's React Fast Refresh preamble references `window`, which doesn't exist in Web Workers. Fix: `src/worker/window-polyfill.js` sets `globalThis.window = globalThis` and must be the **first** import in `pdf.worker.js`.
