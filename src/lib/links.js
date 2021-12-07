export function dayPageLink( date ) {
	return 'day' + date.format( 'DDMMYYYY' );
}

export function weekOverviewLink( date ) {
	return 'week-overview-' + date.isoWeek();
}

export function weekRetrospectiveLink( date ) {
	return 'week-retrospective-' + date.isoWeek();
}
