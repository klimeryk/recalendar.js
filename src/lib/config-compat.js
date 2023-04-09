import PdfConfig, {
	CONFIG_VERSION_1,
	CONFIG_CURRENT_VERSION,
} from 'pdf/config';

export function convertConfigToCurrentVersion( config ) {
	const configWithDefaults = new PdfConfig( config );

	switch ( configWithDefaults.version ) {
		case CONFIG_VERSION_1:
			return convertFromVersion1( configWithDefaults );

		case CONFIG_CURRENT_VERSION:
		default:
			return configWithDefaults;
	}
}

function convertFromVersion1( config ) {
	config.dayItineraries = config.dayItineraries.map( ( dayItinerary ) =>
		Object.assign( { isEnabled: true }, dayItinerary ),
	);
	return config;
}
