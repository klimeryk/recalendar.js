/* eslint-disable no-restricted-globals */
import { Font, pdf } from '@react-pdf/renderer';
import dayjs from 'dayjs';
import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
//import Backend from 'i18next-http-backend';
import React from 'react';
import { initReactI18next } from 'react-i18next';

import { i18nConfiguration, webpackBackend } from 'config/i18n';
import PdfConfig from 'pdf/config';
import RecalendarPdf from 'pdf/recalendar';
import 'config/dayjs';

// eslint-disable-next-line import/no-named-as-default-member
i18n
	.use( webpackBackend )
	.use( LanguageDetector )
	.use( initReactI18next )
	.init( {
		...i18nConfiguration( [ 'pdf', 'config' ] ),
		preload: [ 'en', 'pl' ],
		react: {
			useSuspense: false,
		},
	} );

self.onmessage = ( {
	data: {
		isPreview,
		year,
		month,
		firstDayOfWeek,
		monthCount,
		language,
		isMonthOverviewEnabled,
		habits,
		monthItinerary,
		dayItineraries,
	},
} ) => {
	const config = new PdfConfig();
	config.year = year;
	config.month = month;
	config.monthCount = monthCount;
	config.isMonthOverviewEnabled = isMonthOverviewEnabled;
	config.habits = habits;
	config.monthItinerary = monthItinerary;
	config.dayItineraries = dayItineraries;

	require( `dayjs/locale/${language}` );
	dayjs.locale( language );
	dayjs.updateLocale( language, {
		weekStart: firstDayOfWeek,
	} );

	Font.register( config.fontDefinition );

	const document = React.createElement(
		RecalendarPdf,
		{ isPreview, config },
		null,
	);
	pdf( document )
		.toBlob()
		.then( ( blob ) => {
			self.postMessage( { blob } );
		} );
};
