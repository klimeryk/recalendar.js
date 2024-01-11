import dayjs from 'dayjs/esm';
import { t } from 'i18next';

import { REMARKABLE, getPageProperties } from '~/lib/device-utils';
import { wrapWithId } from '~/lib/id-utils';
import { ITINERARY_ITEM, ITINERARY_LINES } from '~/lib/itinerary-utils';
import {
	HOLIDAY_DAY_TYPE,
	EVENT_DAY_TYPE,
} from '~/lib/special-dates-utils';
import { LATO } from '~/pdf/lib/fonts';

const CONFIG_FIELDS = [
	'device',
	'dpi',
	'pageSize',
	'fontFamily',
	'year',
	'month',
	'firstDayOfWeek',
	'monthCount',
	'weekendDays',
	'isLeftHanded',
	'alwaysOnSidebar',
	'isMonthOverviewEnabled',
	'habits',
	'monthItinerary',
	'isWeekOverviewEnabled',
	'todos',
	'dayItineraries',
	'isWeekRetrospectiveEnabled',
	'weekRetrospectiveItinerary',
	'specialDates',
	'lineStyle',
];

export const CONFIG_FILE = 'config.json';
export const CONFIG_VERSION_1 = 'v1';
export const CONFIG_VERSION_2 = 'v2';
export const CONFIG_VERSION_3 = 'v3';
export const CONFIG_CURRENT_VERSION = CONFIG_VERSION_3;

export function hydrateFromObject( object ) {
	return CONFIG_FIELDS.reduce(
		( fields, field ) => ( {
			...fields,
			[ field ]: object[ field ],
		} ),
		{},
	);
}

class PdfConfig {
	constructor( configOverrides = {} ) {
		this.year = dayjs().year();
		this.month = 0;
		this.firstDayOfWeek = dayjs.localeData().firstDayOfWeek();
		this.weekendDays = [ 0, 6 ];
		this.isLeftHanded = false;
		this.alwaysOnSidebar = false;
		this.monthCount = 12;
		this.fontFamily = LATO;
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
				value: t( 'month.goal', { ns: 'config' } ),
			},
			{
				type: ITINERARY_LINES,
				value: 2,
			},
			{
				type: ITINERARY_ITEM,
				value: t( 'month.notes', { ns: 'config' } ),
			},
			{
				type: ITINERARY_LINES,
				value: 50,
			},
		];
		this.isWeekOverviewEnabled = true;
		this.todos = [
			t( 'todos.example1', { ns: 'config' } ),
			t( 'todos.example2', { ns: 'config' } ),
		];

		let dayOfWeek = this.firstDayOfWeek;
		this.dayItineraries = [ ...Array( 7 ).keys() ].map( () => {
			const itinerary = {
				dayOfWeek,
				items: [ { type: ITINERARY_LINES, value: 50 } ],
				isEnabled: true,
			};
			dayOfWeek = ++dayOfWeek % 7;
			return itinerary;
		} );
		this.isWeekRetrospectiveEnabled = true;
		this.weekRetrospectiveItinerary = [
			{
				type: ITINERARY_LINES,
				value: 50,
			},
		];
		this.device = REMARKABLE;
		const { dpi, pageSize } = getPageProperties( this.device );
		this.dpi = dpi;
		this.pageSize = pageSize;
		this.specialDates = [
			{
				date: '01-01',
				value: t( 'special-dates.example1', { ns: 'config' } ),
				type: HOLIDAY_DAY_TYPE,
			},
			{
				date: '01-01',
				value: t( 'special-dates.example2', { ns: 'config' } ),
				type: HOLIDAY_DAY_TYPE,
			},
			{
				date: '01-03',
				value: t( 'special-dates.example3', { ns: 'config' } ),
				type: HOLIDAY_DAY_TYPE,
			},
			{
				date: '01-13',
				value: t( 'special-dates.example4', { ns: 'config' } ),
				type: EVENT_DAY_TYPE,
			},
			{
				date: '01-13',
				value: t( 'special-dates.example5', { ns: 'config' } ),
				type: HOLIDAY_DAY_TYPE,
			},
			{
				date: '01-14',
				value: t( 'special-dates.example6', { ns: 'config' } ),
				type: EVENT_DAY_TYPE,
			},
		];
		this.lineStyle = 'solid';

		if ( Object.keys( configOverrides ).length !== 0 ) {
			Object.assign( this, configOverrides );
		}

		this.ensureUniqueIds();
	}

	ensureUniqueIds() {
		const fieldsRequiringUniqueIds = [
			'habits',
			'monthItinerary',
			'specialDates',
			'todos',
			'weekRetrospectiveItinerary',
		];

		fieldsRequiringUniqueIds.forEach( ( field ) => {
			const thisField = this[ field ];
			this[ field ] = thisField.map( wrapWithId );
		} );

		this.dayItineraries = this.dayItineraries.map( ( dayItinerary ) => {
			dayItinerary.items = dayItinerary.items.map( wrapWithId );
			return dayItinerary;
		} );
	}
}

export default PdfConfig;
