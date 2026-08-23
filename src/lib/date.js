import dayjs from 'dayjs/esm';

let weekdaysCache = null;

export function getWeekdays(firstDayOfWeek) {
  const locale = dayjs.locale();
  if (weekdaysCache && weekdaysCache.locale === locale && weekdaysCache.firstDayOfWeek === firstDayOfWeek) {
    return weekdaysCache.weekdays;
  }

  const weekdays = buildWeekdays(firstDayOfWeek);
  weekdaysCache = { locale, firstDayOfWeek, weekdays };
  return weekdays;
}

function buildWeekdays(firstDayOfWeek) {
  const weekdaysFull = dayjs.weekdays();
  const weekdaysMin = dayjs.weekdaysMin();
  const weekdaysShort = dayjs.weekdaysShort();

  const weekdays = [...Array(7).keys()];
  const weekdaysReordered = [...weekdays.slice(firstDayOfWeek), ...weekdays.slice(0, firstDayOfWeek)];

  return weekdaysReordered.map((indexOfDay) => ({
    full: weekdaysFull[indexOfDay],
    short: weekdaysShort[indexOfDay],
    min: weekdaysMin[indexOfDay],
    index: indexOfDay,
  }));
}

export function getWeekendDays(weekendDayIndexes, firstDayOfWeek) {
  const weekendDays = [];
  getWeekdays(firstDayOfWeek).forEach(({ index }) => {
    if (weekendDayIndexes.includes(index)) {
      weekendDays.push(index);
    }
  });

  return weekendDays;
}

export function getWeekNumber(day) {
  // As per ISO week specification, we need to check Thursday
  // on a given week to figure out the accurate week number.
  // https://en.wikipedia.org/wiki/ISO_week_date
  return day.day(4).isoWeek();
}

export function getWeekId(day) {
  return day.startOf('week').day(4).format('WWGGGG');
}
