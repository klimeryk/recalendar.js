import { ITINERARY_NEW_PAGE } from 'configuration-form/itinerary';

export function getItemsOnExtraPages( items ) {
	const extraPages = [];
	let currentPageNumber = 0;
	for ( let i = 0; i < items.length; i++ ) {
		const { type } = items[ i ];
		if ( type === ITINERARY_NEW_PAGE ) {
			currentPageNumber++;
			continue;
		}

		if ( currentPageNumber === 0 ) {
			continue;
		}

		if ( ! extraPages[ currentPageNumber - 1 ] ) {
			extraPages[ currentPageNumber - 1 ] = [];
		}

		extraPages[ currentPageNumber - 1 ].push( items[ i ] );
	}

	return extraPages;
}
