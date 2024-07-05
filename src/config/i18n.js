import dayjs from 'dayjs';
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

export function handleLanguageChange( newLanguage, firstDayOfWeek = 1 ) {
	// Silence the warning until https://github.com/vitejs/vite/issues/14102 is fixed
	// Until then, we copy these files to /dist during build
	import( /* @vite-ignore */ '../../dayjs-locale/' + newLanguage + '.js' );
	dayjs.locale( newLanguage );
	dayjs.updateLocale( newLanguage, {
		weekStart: firstDayOfWeek,
	} );
}
