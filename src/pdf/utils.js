import dayjs from 'dayjs/esm';
import { ITINERARY_NEW_PAGE } from '~/lib/itinerary-utils';

export function splitItemsByPages(items) {
  const pages = [[]];
  let currentPage = 0;

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    if (item.type === ITINERARY_NEW_PAGE) {
      currentPage++;
      pages[currentPage] = [];
      continue;
    }

    pages[currentPage].push(item);
  }

  return pages;
}

export function getCalendarStartDate({ year, month }) {
  return dayjs.utc({ year, month, day: 1 });
}

export function getRenderedMonthCount(config) {
  return config.isPreview ? 1 : config.monthCount;
}

export function isRenderedMonth(date, config) {
  const startDate = getCalendarStartDate(config);
  const endDate = startDate.add(getRenderedMonthCount(config), 'months');
  return !date.isBefore(startDate, 'month') && date.isBefore(endDate, 'month');
}

const renderedRanges = new WeakMap();
const calendarRanges = new WeakMap();

function getRange(cache, config, monthCount) {
  if (!cache.has(config)) {
    const startDate = getCalendarStartDate(config);
    cache.set(config, {
      first: startDate.startOf('week'),
      last: startDate
        .add(monthCount - 1, 'months')
        .endOf('month')
        .endOf('week'),
    });
  }

  return cache.get(config);
}

function isInRange(date, { first, last }) {
  return !date.isBefore(first, 'day') && !date.isAfter(last, 'day');
}

export function isRendered(date, config) {
  return isInRange(date, getRange(renderedRanges, config, getRenderedMonthCount(config)));
}

export function isInCalendarRange(date, config) {
  return isInRange(date, getRange(calendarRanges, config, config.monthCount));
}
