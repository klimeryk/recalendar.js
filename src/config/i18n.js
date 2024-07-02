import dayjs from 'dayjs/esm';
import dayjsLocales from 'dayjs/locale.json';

export function i18nConfiguration( namespaces ) {
	return {
		debug: import.meta.env.DEV,
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

export function getFullySupportedLocales() {
	const locales = Object.keys( import.meta.glob( '../locales/**/app.json', { eager: true } ) )
		.map( ( file ) => file.match( /locales\/(.+)\/app\.json$/ )[ 1 ] );

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

const DAYJS_LOCALES = import.meta.glob( '../../node_modules/dayjs/esm/locale/*.js', { eager: true } );

export function handleLanguageChange( newLanguage, firstDayOfWeek = 1 ) {
	// Hacky workaround until https://github.com/vitejs/vite/issues/14102 is fixed
	const localeData = DAYJS_LOCALES[ `../../node_modules/dayjs/esm/locale/${newLanguage}.js` ];
	dayjs.locale( newLanguage, localeData.default, false );
	dayjs.locale( newLanguage );
	dayjs.updateLocale( newLanguage, {
		weekStart: firstDayOfWeek,
	} );
}
