## How to translate ReCalendar to your language

### If you're not a developer

 - Grab the `*.json` files from this folder: https://github.com/klimeryk/recalendar.js/tree/master/src/locales/en
 - They contain the strings that need to be translated to your language.
 - The format is simple: `"key": "value"`. Key should _not_ be translated, only `value`.
 - [Check for existing issues for your language](https://github.com/klimeryk/recalendar.js/labels/language%20request) or open a new one and share the files there.

### For developers

 - Copy the `en` folder from https://github.com/klimeryk/recalendar.js/tree/master/src/locales/ and rename it to your language's code.
 - Translate the strings in each `*.json` file, as described in the above section.
 - Add your language code:
    - https://github.com/klimeryk/recalendar.js/blob/master/src/config/i18n.js#L5
	- https://github.com/klimeryk/recalendar.js/blob/master/src/worker/pdf.worker.js#L26
	- https://github.com/klimeryk/recalendar.js/blob/f20a94d89c55358fad62d3a3c76449221e633283/src/navigation.jsx#L83
 - You should now be able to see the language in your local version.
 - Check the console for any warnings or errors if the language is not visible or not working.
