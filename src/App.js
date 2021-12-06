import { PDFViewer, PDFDownloadLink } from '@react-pdf/renderer';
import PropTypes from 'prop-types';
import React from 'react';

import PdfConfig from 'pdf/config';
import RecalendarPdf from 'pdf/recalendar';

import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

class App extends React.PureComponent {
	config = new PdfConfig();

	handlePdfGeneration = ( { blob, url, loading, error } ) => {
		return loading ? 'Loading...' : 'Download now';
	};

	render() {
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

App.propTypes = {};

export default App;
