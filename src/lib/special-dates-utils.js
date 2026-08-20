import dayjs from 'dayjs/esm';

export const HOLIDAY_DAY_TYPE = 'holiday';
export const EVENT_DAY_TYPE = 'event';

export function isHoliday({ type }) {
  return type === HOLIDAY_DAY_TYPE;
}
export function isEvent({ type }) {
  return type === EVENT_DAY_TYPE;
}

export function findByDate(dateToSearchFor) {
  return ({ date }) => date === dateToSearchFor;
}

export const DATE_FORMAT = 'MM-DD';

export function getDedupeKey({ date, holidayName, value }) {
  const name = (holidayName ?? value ?? '').trim().toLowerCase();
  return `${date}|${name}`;
}

export function getSpannedYears({ year, month, monthCount }) {
  const firstDay = dayjs({ year, month, day: 1 }).startOf('week');
  const lastDay = dayjs({ year, month, day: 1 }).add(monthCount, 'months').subtract(1, 'day');
  const years = [];
  for (let current = firstDay.year(); current <= lastDay.year(); current++) {
    years.push(current);
  }
  return years;
}

export function formatYearRange(years) {
  if (years.length === 0) {
    return '';
  }

  return years.length === 1 ? String(years[0]) : `${years[0]}-${years[years.length - 1]}`;
}
