import dayjs from 'dayjs';
import { t } from 'i18next';

import { ITINERARY_ITEM, ITINERARY_LINES } from 'configuration-form/itinerary';

class PdfConfig {
	constructor() {
		this.year = dayjs().year();
		this.month = 0;
		this.firstDayOfWeek = dayjs.localeData().firstDayOfWeek();
		this.monthCount = 12;
		this.fontFamily = 'Lato';
		this.fontDefinition = {
			family: this.fontFamily,
			fonts: [
				{ src: '/fonts/Lato/Lato-Regular.ttf' },
				{ src: '/fonts/Lato/Lato-Italic.ttf', fontStyle: 'italic' },
				{ src: '/fonts/Lato/Lato-Bold.ttf', fontWeight: 700 },
				{
					src: '/fonts/Lato/Lato-BoldItalic.ttf',
					fontStyle: 'italic',
					fontWeight: 700,
				},
			],
		};
		this.isMonthOverviewEnabled = true;
		this.habits = [
			t( 'habits.example1', { ns: 'config' } ),
			t( 'habits.example2', { ns: 'config' } ),
			t( 'habits.example3', { ns: 'config' } ),
			t( 'habits.example4', { ns: 'config' } ),
		];
		this.monthItinerary = [
			{
				type: ITINERARY_ITEM,
				value: 'Main goal',
			},
			{
				type: ITINERARY_LINES,
				value: 2,
			},
			{
				type: ITINERARY_ITEM,
				value: 'Notes',
			},
			{
				type: ITINERARY_LINES,
				value: 50,
			},
		];
		this.dayItineraries = [ ...Array( 7 ).keys() ].map( () => [
			{ type: ITINERARY_LINES, value: 50 },
		] );
		this.pageSize = [ '157mm', '209mm' ];
		this.specialDates = {
			'01-01': [ 'Special date 1', 'Special date for reason #2' ],
			'03-01': [ 'Some other celebration' ],
			'13-01': [
				'Some other other celebration that is very long',
				"Let's add another one",
			],
			'14-01': [ 'Ran out of reasons celebration' ],
		};
		this.weeklyTodos = [ 'Plan a trip', 'Some other TODO' ];
	}
}

export default PdfConfig;
