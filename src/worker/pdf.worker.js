/* eslint-disable no-restricted-globals */
import { Font, pdf } from '@react-pdf/renderer';
import dayjs from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import isoWeek from 'dayjs/plugin/isoWeek';
import localeData from 'dayjs/plugin/localeData';
import objectSupport from 'dayjs/plugin/objectSupport';
import updateLocale from 'dayjs/plugin/updateLocale';
import utc from 'dayjs/plugin/utc';
import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
//import Backend from 'i18next-http-backend';
import React from 'react';
import { initReactI18next } from 'react-i18next';

import PdfConfig from 'pdf/config';
import RecalendarPdf from 'pdf/recalendar';

const webpackBackend = {
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

// eslint-disable-next-line import/no-named-as-default-member
i18n
	.use( webpackBackend )
	.use( LanguageDetector )
	.use( initReactI18next )
	.init( {
		debug: true,
		fallbackLng: 'en',
		preload: [ 'en', 'pl' ],
		ns: [ 'pdf' ],
		interpolation: {
			escapeValue: false, // not needed for react as it escapes by default
		},
		react: {
			useSuspense: false,
		},
	} );

i18n.on( 'languageChanged', ( newLanguage ) => {
	require( `dayjs/locale/${newLanguage}` );
	dayjs.locale( newLanguage );
	dayjs.updateLocale( newLanguage, {
		weekStart: 1, // Week starts on Monday
	} );
} );

dayjs.extend( advancedFormat );
dayjs.extend( isoWeek );
dayjs.extend( localeData );
dayjs.extend( objectSupport );
dayjs.extend( updateLocale );
dayjs.extend( utc );

self.onmessage = ( { data: { year, month, monthCount } } ) => {
	const config = new PdfConfig();
	config.year = year;
	config.month = month;
	config.monthCount = monthCount;

	Font.register( config.fontDefinition );

	const document = React.createElement(
		RecalendarPdf,
		{ isPreview: true, config },
		null,
	);
	pdf( document )
		.toBlob()
		.then( ( blob ) => {
			self.postMessage( { blob } );
		} );
};
