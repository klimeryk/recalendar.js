# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

Always run with Node 18 (`nvm use` first — `.nvmrc` specifies `18.*`).

```bash
nvm use
npm install       # install dependencies
npm run dev       # dev server → http://localhost:5173/create.html
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
- **`src/pdf/config.js`** — `PdfConfig` class: all 33 config fields with defaults, `hydrateFromObject()`, device presets (ReMarkable, Supernote, etc.), version migration
- **`src/pdf/recalendar.jsx`** — Root react-pdf `<Document>` that assembles all pages from the config
- **`src/worker/pdf.worker.js`** — Runs in a Web Worker; initialises i18n + dayjs, registers fonts, calls `pdf().toBlob()`, encodes config as a Base64 attachment, posts blob back
- **`src/lib/pdf.js`** — Custom wrapper around the react-pdf renderer instance (manages lifecycle, blob generation, attachments)

### PDF page components (`src/pdf/pages/`)

`recalendar.jsx` generates pages in this order: `YearOverview` → then for each week: `MonthOverview` (on month start) + `DayPage` per enabled weekday + optional `WeekRetrospective`. Each page receives the full config and the relevant dayjs date objects.

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
