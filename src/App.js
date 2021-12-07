import { PDFViewer, PDFDownloadLink, Font } from '@react-pdf/renderer';
import PropTypes from 'prop-types';
import React from 'react';
import { withTranslation } from 'react-i18next';

import PdfConfig from 'pdf/config';
import RecalendarPdf from 'pdf/recalendar';

import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

class App extends React.PureComponent {
	config = new PdfConfig();

	handlePdfGeneration = ( { blob, url, loading, error } ) => {
		const { t } = this.props;
		return loading ? t( 'loading' ) : t( 'download-ready' );
	};

	render() {
		Font.register( this.config.fontDefinition );
		return (
			<div className="App">
				<PDFViewer width="100%" height="600px">
					<RecalendarPdf isPreview config={ this.config } />
				</PDFViewer>
				<PDFDownloadLink
					document={ <RecalendarPdf isPreview config={ this.config } /> }
					fileName="somename.pdf"
				>
					{this.handlePdfGeneration}
				</PDFDownloadLink>
			</div>
		);
	}
}

App.propTypes = {
	t: PropTypes.func.isRequired,
};

export default withTranslation( [ 'app', 'pdf' ] )( App );
