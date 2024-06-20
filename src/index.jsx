import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import React, { Suspense } from 'react';
import Spinner from 'react-bootstrap/Spinner';
import { createRoot } from 'react-dom/client';
import { initReactI18next } from 'react-i18next';
import resources from 'virtual:i18next-loader';

import '~/index.css';

import '~/config/dayjs';
import { handleLanguageChange, i18nConfiguration } from '~/config/i18n';
import Loader from '~/loader';

i18n
	.use( LanguageDetector )
	.use( initReactI18next )
	.init(
		{ ...i18nConfiguration( [ 'app', 'pdf', 'config' ] ), resources },
	);

i18n.on( 'languageChanged', ( newLanguage ) => {
	handleLanguageChange( newLanguage );
} );

const loadingComponent = (
	<Spinner
		className="position-absolute top-50 start-50"
		animation="border"
		variant="primary"
		role="status"
	>
		<span className="visually-hidden">Loading...</span>
	</Spinner>
);

const container = document.getElementById( 'root' );
const root = createRoot( container );
root.render(
	<React.StrictMode>
		<Suspense fallback={ loadingComponent }>
			<Loader />
		</Suspense>
	</React.StrictMode>,
);
