export function dayPageLink( date ) {
	return 'day-' + date.format( 'DDMMYYYY' );
}

export function nextDayPageLink( date, config ) {
	let currentDate = date.add( 1, 'day' );
	for ( let i = 0; i < config.dayItineraries.length; i++ ) {
		const currentDayItinerary = config.dayItineraries.find(
			findDayOfWeek( currentDate.day() ),
		);
		if ( ! currentDayItinerary || ! currentDayItinerary.isEnabled ) {
			currentDate = currentDate.add( 1, 'day' );
			continue;
		}

		return dayPageLink( currentDate );
	}

	return '';
}

export function previousDayPageLink( date, config ) {
	let currentDate = date.subtract( 1, 'day' );
	for ( let i = 0; i < config.dayItineraries.length; i++ ) {
		const currentDayItinerary = config.dayItineraries.find(
			findDayOfWeek( currentDate.day() ),
		);
		if ( ! currentDayItinerary || ! currentDayItinerary.isEnabled ) {
			currentDate = currentDate.subtract( 1, 'day' );
			continue;
		}

		return dayPageLink( currentDate );
	}

	return '';
}

function findDayOfWeek( needle ) {
	return ( { dayOfWeek } ) => dayOfWeek === needle;
}

export function monthOverviewLink( date ) {
	return 'month-' + date.format( 'MMYYYY' );
}

export function weekOverviewLink( date ) {
	return 'week-overview-' + date.format( 'WWYYYY' );
}

export function weekRetrospectiveLink( date, config ) {
	return 'week-retrospective-' + date.format( 'WWYYYY' );
}

export function yearOverviewLink() {
	return 'year-overview';
}

export function yearNotesLink() {
	return 'year-notes';
}
