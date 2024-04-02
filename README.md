# ReCalendar
### Highly customizable calendar for ReMarkable tablets

ReCalendar allows you to generate your own, personalized calendar right in your browser. You can view the live, production version at https://recalendar.me/.

It is the continuation of my previous efforts: https://github.com/klimeryk/recalendar. Although, basically all of the code had to be rewritten as I'm using a different PDF library, CSS engine, language, etc.

## Features

See https://recalendar.me/features for a full list with screenshots.

 - Optimized for the [ReMarkable 2 tablet](https://remarkable.com/store/remarkable-2) (should work with version 1 as well) to use the full space available and minimize screen refreshes.
 - No hacks needed - the generated PDF is a normal file, with links, etc. that you can simply upload normally to your tablet.
 - Heavy use of links to allow quick and easy navigation.
 - Lots of easy configuration options to tailor the calendar to your needs - plus access to the source code for even more advanced customization.
 - Easily switch to any locale supported by PHP.
 - Add extra pages to all or selected days of the week to suit your needs.
 - Provide a list of special dates (anniversaries, birthdays, etc.) and let ReCalendar embed them into your personalized calendar - on monthly views, weekly overviews and finally, day entries.
 - Track your habits monthly.
 - Start the "year" on arbitrary month (can be useful for tracking academic years, etc.).

## Quickstart for developers/contributors

The usual dance, using `yarn`:
```
yarn install
yarn start
```

This should automatically open http://localhost:3000/ in your default browser.

## Known issues

See the [FAQ](https://recalendar.me/faq) and [the open issues on GitHub](https://github.com/klimeryk/recalendar.js/issues).

## License

[GNU AGPLv3 License](https://github.com/klimeryk/recalendar.js/blob/main/LICENSE). In particular, this means that you can do what you want with this code, but *you have to publish your changes with the same license*. Please consider submitting a PR, if you have an idea for a great improvement! 🙏 My main motivation was to scratch my own itch, but as a result I might have missed your use case so I'm happy to hear how this project can be improved 🙇
