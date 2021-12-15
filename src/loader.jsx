import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import React from 'react';
import Spinner from 'react-bootstrap/Spinner';
import { withTranslation } from 'react-i18next';

import App from 'App';
import PdfConfig from 'pdf/config';

class Loader extends React.Component {
	componentDidMount() {
		// eslint-disable-next-line react/no-did-mount-set-state
		this.setState( { config: new PdfConfig() } );
	}

	render() {
		if ( ! this.state || ! this.state.config ) {
			return null;
		}

		return <App initialState={ this.state.config } />;
	}
}

export default withTranslation( [ 'app', 'config' ] )( Loader );
