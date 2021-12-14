import dayjs from 'dayjs';

export function getWeekdays() {
	const weekdaysFull = dayjs.weekdays();
	const weekdaysMin = dayjs.weekdaysMin();
	const weekdaysShort = dayjs.weekdaysShort();

	const firstDayOfWeek = dayjs.localeData().firstDayOfWeek();
	const weekdays = [ ...Array( 7 ).keys() ];
	const weekdaysReordered = [
		...weekdays.slice( firstDayOfWeek ),
		...weekdays.slice( 0, firstDayOfWeek ),
	];

	return weekdaysReordered.map( ( indexOfDay ) => ( {
		full: weekdaysFull[ indexOfDay ],
		short: weekdaysShort[ indexOfDay ],
		min: weekdaysMin[ indexOfDay ],
	} ) );
}
