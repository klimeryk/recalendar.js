import { PDFViewer, PDFDownloadLink } from '@react-pdf/renderer';
import dayjs from 'dayjs';
import i18n, { changeLanguage } from 'i18next';
import PropTypes from 'prop-types';
import React from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Stack from 'react-bootstrap/Stack';
import { withTranslation } from 'react-i18next';

import PdfWorker from './worker/pdf.worker.js'; // eslint-disable-line import/default

import Itinerary from 'configuration-form/itinerary';
import PdfConfig from 'pdf/config';
import RecalendarPdf from 'pdf/recalendar';

import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

class App extends React.PureComponent {
	state = {
		language: i18n.language,
		year: dayjs().year(),
		month: 0,
		monthCount: 12,
		pdfBlob: null,
	};

	constructor( props ) {
		super( props );

		this.pdfWorker = new PdfWorker();
		this.pdfWorker.onmessage = this.handlePdfWorkerMessage;
	}

	componentDidMount() {
		i18n.on( 'languageChanged', this.handleLanguageChange );
	}

	componentWillUnmount() {
		i18n.off( 'languageChanged', this.handleLanguageChange );
	}

	handleLanguageSelection = ( event ) => {
		const newLanguage = event.target.value;
		changeLanguage( newLanguage );
	};

	handleLanguageChange = ( newLanguage ) => {
		this.setState( { language: newLanguage } );
	};

	handleYearChange = ( event ) => {
		this.setState( { year: event.target.value } );
	};

	handleMonthChange = ( event ) => {
		this.setState( { month: event.target.value } );
	};

	handleMonthCountChange = ( event ) => {
		this.setState( { monthCount: event.target.value } );
	};

	handleDownload = ( event ) => {
		console.log( 'Downloading...' );
	};

	handlePreview = async ( event ) => {
		this.pdfWorker.postMessage( {
			year: this.state.year,
			month: this.state.month,
			monthCount: this.state.monthCount,
		} );
	};

	handlePdfWorkerMessage = ( { data: { blob } } ) => {
		console.log( 'message from worker' );
		this.setState( { pdfBlob: blob } );
	};

	handlePdfGeneration = ( { blob, url, loading, error } ) => {
		const { t } = this.props;
		return loading ? t( 'loading' ) : t( 'download-ready' );
	};

	renderMonths() {
		return dayjs
			.localeData()
			.months()
			.map( ( month, index ) => (
				<option key={ index } value={ index }>
					{month}
				</option>
			) );
	}

	renderConfigurationForm() {
		const { t } = this.props;
		return (
			<Card className="my-3">
				<Card.Header>ReCalendar</Card.Header>
				<Card.Body>
					<Form>
						<Form.Label htmlFor="languagePicker">
							{t( 'configuration.language.label' )}
						</Form.Label>
						<Form.Select
							value={ this.state.language }
							onChange={ this.handleLanguageSelection }
						>
							<option value="en">{t( 'configuration.language.english' )}</option>
							<option value="pl">{t( 'configuration.language.polish' )}</option>
						</Form.Select>
						<Form.Group controlId="year">
							<Form.Label>{t( 'configuration.year' )}</Form.Label>
							<Form.Control
								type="number"
								value={ this.state.year }
								onChange={ this.handleYearChange }
							/>
						</Form.Group>
						<Form.Group controlId="month">
							<Form.Label>{t( 'configuration.starting-month' )}</Form.Label>
							<Form.Select
								value={ this.state.month }
								onChange={ this.handleMonthChange }
							>
								{this.renderMonths()}
							</Form.Select>
							<Form.Text className="text-muted">
								The first month in the generated calendar. Choose something like
								October if you want your calendar to cover a semester, instead
								of a calendar year.
							</Form.Text>
						</Form.Group>
						<Form.Group controlId="monthCount">
							<Form.Label>{t( 'configuration.month-count' )}</Form.Label>
							<Form.Control
								type="number"
								value={ this.state.monthCount }
								onChange={ this.handleMonthCountChange }
								min={ 1 }
								max={ 12 }
							/>
							<Form.Text className="text-muted">
								For how many months should the calendar be generated for.
							</Form.Text>
						</Form.Group>
						<Card className="mt-3">
							<Card.Header>
								<Stack direction="horizontal">
									<span>Weekly overview</span>
									<Form.Check
										id="weekly-overview-enabled"
										type="checkbox"
										label="Enabled"
										className="ms-auto"
									/>
								</Stack>
							</Card.Header>
							<Card.Body>
								<p>Weekly overview prepares you for the week. Bla bla bla.</p>
								<Itinerary />
							</Card.Body>
						</Card>
						<Stack direction="horizontal" className="mt-3">
							<Button variant="secondary" onClick={ this.handleDownload }>
								{t( 'configuration.button.download' )}
							</Button>
							<Button
								variant="primary"
								className="ms-auto"
								onClick={ this.handlePreview }
							>
								{t( 'configuration.button.refresh' )}
							</Button>
						</Stack>
					</Form>
				</Card.Body>
			</Card>
		);
	}

	render() {
		const { config, pdfBlob } = this.state;

		return (
			<Container className="h-100" fluid>
				<Row className="h-100">
					<Col className="h-100 overflow-auto">
						{this.renderConfigurationForm()}
						{false && (
							<PDFDownloadLink
								document={ <RecalendarPdf isPreview config={ config } /> }
								fileName="recalendar.pdf"
							>
								{this.handlePdfGeneration}
							</PDFDownloadLink>
						)}
					</Col>
					<Col className="py-3 h-100">
						<Card className="h-100">
							<Card.Header>
								Calendar preview (only first month is rendered)
							</Card.Header>
							<Card.Body>
								{pdfBlob && (
									<iframe
										title="PDF Preview"
										src={ URL.createObjectURL( pdfBlob ) }
										width="100%"
										height="100%"
									/>
								)}
								{! pdfBlob && <h3>No preview</h3>}
							</Card.Body>
						</Card>
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
