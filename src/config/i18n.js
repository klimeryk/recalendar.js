import dayjs from 'dayjs';
import dayjsLocales from 'dayjs/locale.json';

export function i18nConfiguration( namespaces ) {
	return {
		debug: process.env.NODE_ENV === 'development',
		fallbackLng: 'en',
		load: 'currentOnly',
		supportedLngs: dayjsLocales.map( ( ( { key } ) => key ) ),
		ns: namespaces,
		lowerCaseLng: true,
		interpolation: {
			escapeValue: false, // not needed for react as it escapes by default
		},
	};
}

export const webpackBackend = {
	type: 'backend',
	read: ( language, namespace, callback ) => {
		const languageToLoad =
			getFullySupportedLocales().includes( language )
				? language
				: 'en';
		import( '../locales/' + languageToLoad + '/' + namespace + '.json' )
			.then( ( resources ) => {
				callback( null, resources );
			} )
			.catch( ( error ) => {
				callback( error, null );
			} );
	},
};

export function getFullySupportedLocales() {
	const locales = require
		.context( '../locales', true, /app\.json$/ )
		.keys()
		.map( ( file ) => file.match( /\/(.+)\/app\.json$/ )[ 1 ] );

	const uniqueLocales = [ ...new Set( locales ) ];

	// Make sure that English is first on the list
	uniqueLocales.splice( uniqueLocales.indexOf( 'en' ), 1 );
	uniqueLocales.unshift( 'en' );
	return uniqueLocales;
}

export function getPartiallySupportedLocales() {
	const fullySupportedLocales = getFullySupportedLocales();
	return dayjsLocales
		.filter( ( { key } ) => ! fullySupportedLocales.includes( key ) )
		.sort( ( languageA, languageB ) => languageA.name.localeCompare( languageB.name ) );
}

export function handleLanguageChange( newLanguage, firstDayOfWeek = 1 ) {
	require( `dayjs/locale/${newLanguage}.js` );
	dayjs.locale( newLanguage );
	dayjs.updateLocale( newLanguage, {
		weekStart: firstDayOfWeek,
	} );
}
