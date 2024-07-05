import dayjs from 'dayjs';

import {
	DATE_FORMAT as SPECIAL_DATES_DATE_FORMAT,
	EVENT_DAY_TYPE,
} from '~/lib/special-dates-utils';
import {
	CONFIG_VERSION_1,
	CONFIG_VERSION_2,
	CONFIG_CURRENT_VERSION,
} from '~/pdf/config';

export function convertConfigToCurrentVersion( config ) {
	switch ( config.version ) {
		case CONFIG_VERSION_1:
			return convertFromVersion2( convertFromVersion1( config ) );

		case CONFIG_VERSION_2:
			return convertFromVersion2( config );

		case CONFIG_CURRENT_VERSION:
		default:
			return config;
	}
}

function convertFromVersion1( config ) {
	config.dayItineraries = config.dayItineraries.map( ( dayItinerary ) =>
		Object.assign( { isEnabled: true }, dayItinerary ),
	);
	return config;
}

function convertFromVersion2( config ) {
	const oldDateKeyFormat = 'DD-MM';
	const newSpecialDates = [];
	Object.keys( config.specialDates || {} ).forEach( ( dateKey ) => {
		const newDateKey = dayjs( dateKey, oldDateKeyFormat ).format(
			SPECIAL_DATES_DATE_FORMAT,
		);
		newSpecialDates.push(
			...config.specialDates[ dateKey ].map( ( specialDate ) => ( {
				date: newDateKey,
				value: specialDate,
				type: EVENT_DAY_TYPE,
			} ) ),
		);
	} );
	config.specialDates = newSpecialDates;
	return config;
}
