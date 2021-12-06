import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import objectSupport from 'dayjs/plugin/objectSupport';
import updateLocale from 'dayjs/plugin/updateLocale';
import utc from 'dayjs/plugin/utc';
import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';
import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import { initReactI18next } from 'react-i18next';

import './index.css';
import App from './App';

dayjs.extend( isoWeek );
dayjs.extend( objectSupport );
dayjs.extend( updateLocale );
dayjs.extend( utc );

dayjs.updateLocale( 'en', {
	weekStart: 1, // Week starts on Monday
} );

i18n
	.use( Backend )
	.use( LanguageDetector )
	.use( initReactI18next )
	.init( {
		debug: true,
		fallbackLng: 'en',
		interpolation: {
			escapeValue: false, // not needed for react as it escapes by default
		},
	} );

ReactDOM.render(
	<React.StrictMode>
		<Suspense fallback="...loading">
			<App />
		</Suspense>
	</React.StrictMode>,
	document.getElementById( 'root' ),
);
