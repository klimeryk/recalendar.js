import dayjs from 'dayjs';
import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
//import Backend from 'i18next-http-backend';
import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import { initReactI18next } from 'react-i18next';

import './index.css';
import App from './App';
import 'config/dayjs';

import { i18nConfiguration, webpackBackend } from 'config/i18n';

// eslint-disable-next-line import/no-named-as-default-member
i18n
	.use( webpackBackend )
	.use( LanguageDetector )
	.use( initReactI18next )
	.init( {
		...i18nConfiguration( [ 'app', 'pdf' ] ),
	} );

i18n.on( 'languageChanged', ( newLanguage ) => {
	require( 'dayjs/locale/' + newLanguage );
	dayjs.locale( newLanguage );
	dayjs.updateLocale( newLanguage, {
		weekStart: 1, // Week starts on Monday
	} );
} );

ReactDOM.render(
	<React.StrictMode>
		<Suspense fallback="...loading">
			<App />
		</Suspense>
	</React.StrictMode>,
	document.getElementById( 'root' ),
);
