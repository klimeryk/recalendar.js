export function i18nConfiguration( namespaces ) {
	return {
		debug: process.env.NODE_ENV === 'development',
		fallbackLng: 'en',
		supportedLngs: [ 'en', 'pl', 'fr', 'es', 'nl' ],
		ns: namespaces,
		interpolation: {
			escapeValue: false, // not needed for react as it escapes by default
		},
	};
}

export const webpackBackend = {
	type: 'backend',
	read: ( language, namespace, callback ) => {
		import( '../locales/' + language + '/' + namespace + '.json' )
			.then( ( resources ) => {
				callback( null, resources );
			} )
			.catch( ( error ) => {
				callback( error, null );
			} );
	},
};
