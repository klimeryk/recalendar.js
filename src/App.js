import dayjs from 'dayjs';
import { saveAs } from 'file-saver';
import i18n, { changeLanguage } from 'i18next';
import PropTypes from 'prop-types';
import React from 'react';
import Accordion from 'react-bootstrap/Accordion';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Spinner from 'react-bootstrap/Spinner';
import Stack from 'react-bootstrap/Stack';
import { withTranslation } from 'react-i18next';

import PdfWorker from './worker/pdf.worker.js'; // eslint-disable-line import/default

import PdfPreview from 'components/pdf-preview';
import AboutModal from 'configuration-form/about-modal';
import ItemsList from 'configuration-form/items-list';
import Itinerary from 'configuration-form/itinerary';
import ToggleForm from 'configuration-form/toggle-form';
import { getWeekdays } from 'lib/date';
import PdfConfig, { hydrateFromObject } from 'pdf/config';

import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

class App extends React.PureComponent {
	state = {
		isGeneratingPdf: false,
		isGeneratingPreview: false,
		language: i18n.language,
		blobUrl: null,
		showAboutModal: false,
		...hydrateFromObject( this.props.initialState ),
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

	componentDidUpdate( prevProps, prevState ) {
		if ( prevState.blobUrl && prevState.blobUrl !== this.state.blobUrl ) {
			// Each refresh generates a new blob - and it will be kept in the memory
			// until the window is refreshed/unloaded. To keep memory consumption low
			// lets explicitly release the stale blob.
			// See https://developer.mozilla.org/en-US/docs/Web/API/URL/revokeObjectURL
			URL.revokeObjectURL( prevState.blobUrl );
		}
	}

	handleLanguageSelection = ( event ) => {
		const newLanguage = event.target.value;
		changeLanguage( newLanguage );
	};

	handleLanguageChange = ( newLanguage ) => {
		this.setState( { language: newLanguage } );
	};

	handleFieldChange = ( event ) => {
		this.setState( { [ event.target.id ]: event.target.value } );
	};

	handleToggle = ( event ) => {
		this.setState( { [ event.target.id ]: event.target.checked } );
	};

	handleDownload = ( event ) => {
		this.setState( { isGeneratingPdf: true } );
		this.generatePdf( false );
	};

	handleItemAdd = ( event ) => {
		const field = event.target.dataset.field;
		const newItems = [ ...this.state[ field ] ];
		newItems.push( '' );
		this.setState( { [ field ]: newItems } );
	};

	handleItemChange = ( event ) => {
		const field = event.target.dataset.field;
		const newItems = [ ...this.state[ field ] ];
		newItems[ event.target.dataset.index ] = event.target.value;
		this.setState( { [ field ]: newItems } );
	};

	handleItemRemove = ( event ) => {
		const field = event.target.dataset.field;
		const newItems = [ ...this.state[ field ] ];
		newItems.splice( event.target.dataset.index, 1 );
		this.setState( { [ field ]: newItems } );
	};

	handleItineraryAdd = ( event ) => {
		const field = event.target.dataset.field;
		const newItinerary = [ ...this.state[ field ] ];
		newItinerary.push( {
			type: event.target.dataset.type,
			value: '',
		} );
		this.setState( { [ field ]: newItinerary } );
	};

	handleItineraryChange = ( event ) => {
		const field = event.target.dataset.field;
		const newItinerary = [ ...this.state[ field ] ];
		newItinerary[ event.target.dataset.index ] = {
			type: event.target.dataset.type,
			value: event.target.dataset.value,
		};
		this.setState( { [ field ]: newItinerary } );
	};

	handleItineraryRemove = ( event ) => {
		const field = event.target.dataset.field;
		const newItineraries = [ ...this.state[ field ] ];
		newItineraries.splice( event.target.dataset.index, 1 );
		this.setState( { [ field ]: newItineraries } );
	};

	handlePreview = ( event ) => {
		event.preventDefault();
		this.setState( { isGeneratingPreview: true } );
		this.generatePdf( true );
	};

	generatePdf( isPreview ) {
		this.pdfWorker.postMessage( {
			isPreview,
			language: this.state.language,
			...hydrateFromObject( this.state ),
		} );
	}

	handlePdfWorkerMessage = ( { data: { blob } } ) => {
		const shouldTriggerDownload = this.state.isGeneratingPdf;
		if ( this.state.isGeneratingPreview ) {
			this.setState( { blobUrl: URL.createObjectURL( blob ) } );
		}
		this.setState( { isGeneratingPdf: false, isGeneratingPreview: false } );
		if ( shouldTriggerDownload ) {
			saveAs( blob, 'recalendar.pdf' );
		}
	};

	handlePdfGeneration = ( { blob, url, loading, error } ) => {
		const { t } = this.props;
		return loading ? t( 'loading' ) : t( 'download-ready' );
	};

	handleDayItineraryChange = ( event ) => {
		const newItineraries = [ ...this.state.dayItineraries ];
		const { field, index, type } = event.target.dataset;
		newItineraries[ field ][ index ] = {
			type,
			value: event.target.value,
		};
		this.setState( { dayItineraries: newItineraries } );
	};

	handleDayItineraryRemove = ( event ) => {
		const newItineraries = [ ...this.state.dayItineraries ];
		const { field, index } = event.target.dataset;
		newItineraries[ field ].splice( index, 1 );
		this.setState( { dayItineraries: newItineraries } );
	};

	handleDayItineraryAdd = ( event ) => {
		const newItineraries = [ ...this.state.dayItineraries ];
		const { field, type } = event.target.dataset;
		newItineraries[ field ].push( {
			type,
			value: '',
		} );
		this.setState( { dayItineraries: newItineraries } );
	};

	handleShowAboutModal = () => {
		this.setState( { showAboutModal: true } );
	};

	handleHideAboutModal = () => {
		this.setState( { showAboutModal: false } );
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

	renderDaysOfWeek() {
		return dayjs
			.localeData()
			.weekdays()
			.map( ( dayOfWeek, index ) => (
				<option key={ index } value={ index }>
					{dayOfWeek}
				</option>
			) );
	}

	renderDayItineraries() {
		return (
			<Card className="mt-3">
				<Card.Header>Day itineraries</Card.Header>
				<Card.Body>
					<Accordion defaultActiveKey="0">
						{getWeekdays().map( this.renderDayItinerary )}
					</Accordion>
				</Card.Body>
			</Card>
		);
	}

	renderDayItinerary = ( { full: dayOfWeek }, index ) => {
		return (
			<Itinerary
				key={ dayOfWeek }
				eventKey={ index.toString() }
				field={ index.toString() }
				title={ dayOfWeek }
				itinerary={ this.state.dayItineraries[ index ] }
				onAdd={ this.handleDayItineraryAdd }
				onChange={ this.handleDayItineraryChange }
				onRemove={ this.handleDayItineraryRemove }
			/>
		);
	};

	renderConfigurationForm() {
		const { t } = this.props;
		const { isGeneratingPdf, isGeneratingPreview } = this.state;
		return (
			<Card className="my-3">
				<Card.Header>
					<Stack direction="horizontal">
						<span>ReCalendar</span>
						<Button
							className="ms-auto"
							variant="info"
							onClick={ this.handleShowAboutModal }
						>
							About
						</Button>
					</Stack>
				</Card.Header>
				<Card.Body>
					<Form onSubmit={ this.handlePreview }>
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
								onChange={ this.handleFieldChange }
							/>
						</Form.Group>
						<Form.Group controlId="month">
							<Form.Label>{t( 'configuration.starting-month' )}</Form.Label>
							<Form.Select
								value={ this.state.month }
								onChange={ this.handleFieldChange }
							>
								{this.renderMonths()}
							</Form.Select>
							<Form.Text className="text-muted">
								The first month in the generated calendar. Choose something like
								October if you want your calendar to cover a semester, instead
								of a calendar year.
							</Form.Text>
						</Form.Group>
						<Form.Group controlId="firstDayOfWeek">
							<Form.Label>{t( 'configuration.first-day-of-week' )}</Form.Label>
							<Form.Select
								value={ this.state.firstDayOfWeek }
								onChange={ this.handleFieldChange }
							>
								{this.renderDaysOfWeek()}
							</Form.Select>
						</Form.Group>
						<Form.Group controlId="monthCount">
							<Form.Label>{t( 'configuration.month-count' )}</Form.Label>
							<Form.Control
								type="number"
								value={ this.state.monthCount }
								onChange={ this.handleFieldChange }
								min={ 1 }
								max={ 12 }
							/>
							<Form.Text className="text-muted">
								For how many months should the calendar be generated for.
							</Form.Text>
						</Form.Group>
						<ToggleForm
							id="isMonthOverviewEnabled"
							title="Month overview"
							onToggle={ this.handleToggle }
							toggledOn={ this.state.isMonthOverviewEnabled }
						>
							<p>Month overview prepares you for the month. Bla bla bla.</p>
							<ItemsList
								field="habits"
								title={ t( 'configuration.month.habits.title' ) }
								items={ this.state.habits }
								onAdd={ this.handleItemAdd }
								onChange={ this.handleItemChange }
								onRemove={ this.handleItemRemove }
							/>
							<Itinerary
								field="monthItinerary"
								title={ t( 'configuration.month.itinerary.title' ) }
								itinerary={ this.state.monthItinerary }
								onAdd={ this.handleItineraryAdd }
								onChange={ this.handleItineraryChange }
								onRemove={ this.handleItineraryRemove }
							/>
						</ToggleForm>
						<ToggleForm
							id="isWeekOverviewEnabled"
							title="Week overview"
							onToggle={ this.handleToggle }
							toggledOn={ this.state.isWeekOverviewEnabled }
						>
							<p>Week overview prepares you for the week. Bla bla bla.</p>
							<ItemsList
								field="todos"
								title={ t( 'configuration.week.todos.title' ) }
								items={ this.state.todos }
								onAdd={ this.handleItemAdd }
								onChange={ this.handleItemChange }
								onRemove={ this.handleItemRemove }
							/>
						</ToggleForm>
						{this.renderDayItineraries()}
						<ToggleForm
							id="isWeekRetrospectiveEnabled"
							title="Week retrospective"
							onToggle={ this.handleToggle }
							toggledOn={ this.state.isWeekRetrospectiveEnabled }
						>
							<p>
								Week retrospective gives you a place to reflect on your past
								week.
							</p>
							<Itinerary
								field="weekRetrospectiveItinerary"
								title={ t( 'configuration.week.retrospective.itinerary.title' ) }
								itinerary={ this.state.weekRetrospectiveItinerary }
								onAdd={ this.handleItineraryAdd }
								onChange={ this.handleItineraryChange }
								onRemove={ this.handleItineraryRemove }
							/>
						</ToggleForm>
						<Button
							variant="primary"
							className="mt-3 w-100"
							disabled={ isGeneratingPreview || isGeneratingPdf }
							type="submit"
						>
							{isGeneratingPreview ? (
								<>
									<Spinner
										as="span"
										animation="border"
										size="sm"
										role="status"
										aria-hidden="true"
										className="me-1"
									/>
									{t( 'configuration.button.generating' )}
								</>
							) : (
								t( 'configuration.button.refresh' )
							)}
						</Button>
						<Form.Text className="text-muted">
							PDF generation is done entirely in your browser - no data is sent
							to our servers!
						</Form.Text>
					</Form>
				</Card.Body>
			</Card>
		);
	}

	renderPdfPreview() {
		const { t } = this.props;
		const { isGeneratingPdf, isGeneratingPreview, blobUrl } = this.state;
		return (
			<Stack direction="vertical" gap={ 3 } className="h-100">
				<PdfPreview
					blobUrl={ blobUrl }
					title={ t( 'configuration.preview.viewer-title' ) }
				/>
				<Button
					variant="secondary"
					disabled={ isGeneratingPreview || isGeneratingPdf }
					onClick={ this.handleDownload }
				>
					{isGeneratingPdf ? (
						<>
							<Spinner
								as="span"
								animation="border"
								size="sm"
								role="status"
								aria-hidden="true"
								className="me-1"
							/>
							Generating full calendar - this could take a minute or more...
						</>
					) : (
						t( 'configuration.button.download' )
					)}
				</Button>
			</Stack>
		);
	}

	renderNoPreview() {
		if ( this.state.isGeneratingPreview ) {
			return (
				<div className="h-100 d-flex align-items-center justify-content-center">
					<Spinner
						animation="border"
						role="status"
						size="sm"
						className="me-1"
					/>
					Generating preview, please wait - it can take a minute.
				</div>
			);
		}
		return (
			<Stack
				direction="vertical"
				className="h-100 d-flex align-items-center justify-content-center"
			>
				<p className="lead">
					Use the configuration form to create your personalized calendar.
				</p>
				<p>The preview will appear here.</p>
			</Stack>
		);
	}

	render() {
		const { blobUrl, isGeneratingPreview, showAboutModal } = this.state;

		return (
			<Container className="h-100" fluid>
				<Row className="h-100">
					<AboutModal
						onHide={ this.handleHideAboutModal }
						show={ showAboutModal }
					/>
					<Col className="h-100 overflow-auto">
						{this.renderConfigurationForm()}
					</Col>
					<Col className="py-3 h-100">
						<Card className="h-100">
							<Card.Header>
								Calendar preview (only first month is rendered)
							</Card.Header>
							<Card.Body>
								{blobUrl && ! isGeneratingPreview
									? this.renderPdfPreview()
									: this.renderNoPreview()}
							</Card.Body>
						</Card>
					</Col>
				</Row>
			</Container>
		);
	}
}

App.propTypes = {
	initialState: PropTypes.instanceOf( PdfConfig ).isRequired,
	t: PropTypes.func.isRequired,
};

export default withTranslation( [ 'app' ] )( App );
