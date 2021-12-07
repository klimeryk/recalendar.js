import dayjs from 'dayjs';

export function getWeekdays() {
	const weekdays = dayjs.weekdaysMin();
	const firstDayOfWeek = dayjs.localeData().firstDayOfWeek();
	return [ ...weekdays.slice( firstDayOfWeek ), ...weekdays.slice( 0, firstDayOfWeek ) ];
}
