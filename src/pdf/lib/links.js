export function dayPageLink( date ) {
	return 'day-' + date.format( 'DDMMYYYY' );
}

export function monthOverviewLink( date ) {
	return 'month-' + date.format( 'MMYYYY' );
}

export function weekOverviewLink( date ) {
	return 'week-overview-' + date.format( 'WWYYYY' );
}

export function weekRetrospectiveLink( date ) {
	return 'week-retrospective-' + date.format( 'WWYYYY' );
}

export function yearOverviewLink() {
	return 'year-overview';
}
