## How to translate ReCalendar to your language

### If you're not a developer

 - Grab the `*.json` files from this folder: https://github.com/klimeryk/recalendar.js/tree/master/src/locales/en
 - They contain the strings that need to be translated to your language.
 - The format is simple: `"key": "value"`. Key should _not_ be translated, only `value`.
 - [Check for existing issues for your language](https://github.com/klimeryk/recalendar.js/labels/language%20request) or open a new one and share the files there.

### For developers

 - Copy the `en` folder from https://github.com/klimeryk/recalendar.js/tree/master/src/locales/ and rename it to the appropriate locale. It has to match the locale that [day.js](https://day.js.org/docs/en/i18n/i18n) supports. The list is available [here](https://github.com/iamkun/dayjs/tree/dev/src/locale).
 - Translate the strings in each `*.json` file, as described in the above section.
 - Add your language to [the English `app.json` file, `language` section](https://github.com/klimeryk/recalendar.js/blob/master/src/locales/en/app.json). Add it as you'd write it in _your_ language. See the existing examples there. So, for the Polish language I'd put `Polski`, _not_ `Polish`. This follows [best practices](https://ux.stackexchange.com/a/37025/45864) for language selectors.
 - You should now be able to see the language in your local, development version.
 - Check the console for any warnings or errors if the language is not visible or not working.
