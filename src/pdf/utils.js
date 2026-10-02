import dayjs from 'dayjs/esm';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import { ITINERARY_NEW_PAGE } from '~/lib/itinerary-utils';

export function splitItemsByPages(items) {
  const pages = [[]];
  let currentPageNumber = 0;
  for (let i = 0; i < items.length; i++) {
    const { type } = items[i];
    if (type === ITINERARY_NEW_PAGE) {
      currentPageNumber++;
      continue;
    }

    if (!pages[currentPageNumber]) {
      pages[currentPageNumber] = [];
    }

    pages[currentPageNumber].push(items[i]);
  }

  return pages;
}

dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);

export function calendarPageExists(date, config) {
  // Checks whether a specific date exists within the config's selected range of days.
  // Extra calendar pages can exist for days before and after the calendar's start and
  // end dates, if those days are in the calendar's first and last weeks, and this
  // function takes that into account.

  const { year, month, monthCount } = config;
  const firstCalendarDate = dayjs.utc({
    year,
    month,
    day: 1,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const lastCalendarDate = firstCalendarDate.add(monthCount - 1, 'months').endOf('month');
  const firstDisplayedDate = firstCalendarDate.startOf('week');
  const lastDisplayedDate = lastCalendarDate.endOf('week');

  return date.isSameOrAfter(firstDisplayedDate) && date.isSameOrBefore(lastDisplayedDate);
}
