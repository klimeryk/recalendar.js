import { CONFIG_VERSION_1, CONFIG_CURRENT_VERSION } from 'pdf/config';

export function convertConfigToCurrentVersion( config ) {
	switch ( config.version ) {
		case CONFIG_VERSION_1:
			return convertFromVersion1( config );

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
