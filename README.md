# ReCalendar Reloaded
### Highly customizable calendar for e-ink tablets (ReMarkable, Supernote)

> **This is a fork of [klimeryk/recalendar.js](https://github.com/klimeryk/recalendar.js).** For the upstream project and live production version, see https://recalendar.me/.
>
> **Live version of this fork:** https://hiltonbrown.github.io/recalendar/

ReCalendar allows you to generate your own, personalized calendar right in your browser. Everything runs locally — nothing is uploaded to any server.

## Features

### Device support

 - **ReMarkable 1 & 2**, **ReMarkable Paper Pro**, **ReMarkable Paper Pro Move**
 - **Supernote A5 X**, **Supernote Nomad**, **Supernote Manta** — each pre-configured with the correct DPI and resolution
 - **Custom** device with user-defined page size and DPI

### Calendar structure

 - Year overview → month overview → weekly overview → daily pages, all interlinked for quick tap navigation with minimal screen refreshes
 - Habits tracker on monthly pages
 - Week retrospective pages
 - Start the "year" on any arbitrary month (useful for academic or fiscal years)
 - Enable or disable weekdays individually; add extra pages to selected days

### Layout & line style

 - **Sidebar position** — left, right, or none
 - **Line style** — solid or dashed, with adjustable opacity and height
 - **Dot grid** — toggle any ruled-line block to a dot grid, with configurable pitch, opacity, and per-block row count

### Special dates

 - Manually add events and holidays; they appear on month, week, and day pages
 - **Import by country** — select a country and import all public holidays for the year in one click (via the [Nager.at](https://date.nager.at) public API)
 - **ICS file import** — upload a `.ics` from Google Calendar, Outlook, or any calendar app; recurring events are fully supported

### Other

 - 15+ language/locale options
 - Configuration saved as an attachment inside the generated PDF — reload a previous PDF to restore all settings
 - Open source (GNU AGPLv3)

## Quickstart for developers/contributors

[Vite](https://vitejs.dev/) is used for development. Make sure you use `nvm` or a compatible solution to use the correct Node version.

```
nvm use
npm install
npm run dev
```

## Known issues

See the [FAQ](https://recalendar.me/faq) and [the open issues on the upstream project](https://github.com/klimeryk/recalendar.js/issues). For issues specific to this fork, open an issue on [this repository](https://github.com/hiltonbrown/recalendar/issues).

## License

[GNU AGPLv3 License](https://github.com/klimeryk/recalendar.js/blob/main/LICENSE). In particular, this means that you can do what you want with this code, but *you have to publish your changes with the same license*. Please consider submitting a PR, if you have an idea for a great improvement! 🙏 My main motivation was to scratch my own itch, but as a result I might have missed your use case so I'm happy to hear how this project can be improved 🙇
