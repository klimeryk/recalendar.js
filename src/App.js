import { PDFViewer, PDFDownloadLink, Font } from '@react-pdf/renderer';
import PropTypes from 'prop-types';
import React from 'react';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import { withTranslation } from 'react-i18next';

import ConfigurationForm from 'configuration-form';
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
			<Container className="h-100" fluid>
				<Row className="h-100">
					<Col>
						<ConfigurationForm />
						{false && (
							<PDFDownloadLink
								document={ <RecalendarPdf isPreview config={ this.config } /> }
								fileName="recalendar.pdf"
							>
								{this.handlePdfGeneration}
							</PDFDownloadLink>
						)}
					</Col>
					<Col className="h-100">
						{false && (
							<PDFViewer width="100%" height="99%">
								<RecalendarPdf isPreview config={ this.config } />
							</PDFViewer>
						)}
					</Col>
				</Row>
			</Container>
		);
	}
}

App.propTypes = {
	t: PropTypes.func.isRequired,
};

export default withTranslation( [ 'app', 'pdf' ] )( App );
