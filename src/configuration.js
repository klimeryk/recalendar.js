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

import PdfPreviewCard from 'components/pdf-preview-card';
import PdfProgress from 'components/pdf-progress';
import ItemsList from 'configuration-form/items-list';
import Itinerary from 'configuration-form/itinerary';
import SpecialDates from 'configuration-form/special-dates';
import ToggleForm from 'configuration-form/toggle-form';
import { getJsonAttachment } from 'lib/attachments';
import { getWeekdays } from 'lib/date';
import PdfConfig, { hydrateFromObject, CONFIG_FILE } from 'pdf/config';

import 'bootstrap/dist/css/bootstrap.min.css';
import './app.css';

class Configuration extends React.PureComponent {
	state = {
		isGeneratingPdf: false,
		isGeneratingPreview: false,
		language: i18n.language,
		blobUrl: null,
		lastPreviewTime: 10000,
		lastFullTime: null,
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

	handleFileChange = ( event ) => {
		const file = event.target.files[ 0 ];
		const reader = new FileReader();
		reader.onload = async function( onLoadEvent ) {
			const attachment = await getJsonAttachment(
				onLoadEvent.target.result,
				CONFIG_FILE,
			);

			if ( ! attachment ) {
				return;
			}

			// TODO: rehydrate state from this
		};

		reader.readAsArrayBuffer( file );
	};

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
		this.startTime = new Date();
		this.pdfWorker.postMessage( {
			isPreview,
			language: this.state.language,
			...hydrateFromObject( this.state ),
		} );
	}

	handlePdfWorkerMessage = ( { data: { blob } } ) => {
		const shouldTriggerDownload = this.state.isGeneratingPdf;
		if ( this.state.isGeneratingPreview ) {
			const previewTime = new Date().getTime() - this.startTime.getTime();
			this.setState( {
				blobUrl: URL.createObjectURL( blob ),
				lastPreviewTime: previewTime,
			} );
		}
		this.setState( { isGeneratingPdf: false, isGeneratingPreview: false } );
		if ( shouldTriggerDownload ) {
			const fullTime = new Date().getTime() - this.startTime.getTime();
			this.setState( { lastFullTime: fullTime } );
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

	handleSpecialDateAdd = ( key, value ) => {
		const newSpecialDates = Object.assign( {}, this.state.specialDates );
		if ( ! newSpecialDates[ key ] ) {
			newSpecialDates[ key ] = [];
		}

		newSpecialDates[ key ].push( value );
		this.setState( { specialDates: newSpecialDates } );
	};

	handleSpecialDateRemove = ( event ) => {
		const key = event.target.dataset.key;
		const newSpecialDates = Object.assign( {}, this.state.specialDates );
		delete newSpecialDates[ key ];
		this.setState( { specialDates: newSpecialDates } );
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
			<Form onSubmit={ this.handlePreview }>
				<Accordion defaultActiveKey="start" className="my-3">
					<Accordion.Item eventKey="start">
						<Accordion.Header>ReCalendar</Accordion.Header>
						<Accordion.Body>
							<Form.Control
								type="file"
								accept=".pdf"
								onChange={ this.handleFileChange }
							/>
							<Form.Label htmlFor="languagePicker">
								{t( 'configuration.language.label' )}
							</Form.Label>
							<Form.Select
								value={ this.state.language }
								onChange={ this.handleLanguageSelection }
							>
								<option value="en">
									{t( 'configuration.language.english' )}
								</option>
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
								<Form.Label>
									{t( 'configuration.starting-month.label' )}
								</Form.Label>
								<Form.Select
									value={ this.state.month }
									onChange={ this.handleFieldChange }
								>
									{this.renderMonths()}
								</Form.Select>
								<Form.Text className="text-muted">
									{t( 'configuration.starting-month.description' )}
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
								<Form.Label>{t( 'configuration.month-count.label' )}</Form.Label>
								<Form.Control
									type="number"
									value={ this.state.monthCount }
									onChange={ this.handleFieldChange }
									min={ 1 }
									max={ 12 }
								/>
								<Form.Text className="text-muted">
									{t( 'configuration.month-count.description' )}
								</Form.Text>
							</Form.Group>
						</Accordion.Body>
					</Accordion.Item>
					<SpecialDates
						items={ this.state.specialDates }
						onAdd={ this.handleSpecialDateAdd }
						onRemove={ this.handleSpecialDateRemove }
					/>
					<ToggleForm
						id="isMonthOverviewEnabled"
						title={ t( 'configuration.month.title' ) }
						onToggle={ this.handleToggle }
						toggledOn={ this.state.isMonthOverviewEnabled }
					>
						<p className="mb-0">{t( 'configuration.month.description' )}</p>
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
						title={ t( 'configuration.week.title' ) }
						onToggle={ this.handleToggle }
						toggledOn={ this.state.isWeekOverviewEnabled }
					>
						<p className="mb-0">{t( 'configuration.week.description' )}</p>
						<ItemsList
							field="todos"
							title={ t( 'configuration.week.todos.title' ) }
							items={ this.state.todos }
							onAdd={ this.handleItemAdd }
							onChange={ this.handleItemChange }
							onRemove={ this.handleItemRemove }
						/>
					</ToggleForm>
					<Accordion.Item eventKey="dayItineraries">
						<Accordion.Header>Day itineraries</Accordion.Header>
						<Accordion.Body>
							<Accordion defaultActiveKey="0">
								{getWeekdays().map( this.renderDayItinerary )}
							</Accordion>
						</Accordion.Body>
					</Accordion.Item>
					<ToggleForm
						id="isWeekRetrospectiveEnabled"
						title={ t( 'configuration.week.retrospective.title' ) }
						onToggle={ this.handleToggle }
						toggledOn={ this.state.isWeekRetrospectiveEnabled }
					>
						<p className="mb-0">
							{t( 'configuration.week.retrospective.description' )}
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
				</Accordion>
				<Stack
					direction="vertical"
					gap={ 2 }
					className="pt-3 position-sticky bg-body refresh-button"
				>
					<Button
						variant="primary"
						className="w-100"
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
					{isGeneratingPreview && (
						<PdfProgress expectedTime={ this.state.lastPreviewTime } />
					)}
					<Form.Text className="text-muted pb-3">
						{t( 'configuration.generation-description' )}
					</Form.Text>
				</Stack>
			</Form>
		);
	}

	render() {
		const { t } = this.props;

		return (
			<Container className="h-100" fluid>
				<Row className="h-100">
					<Col>{this.renderConfigurationForm()}</Col>
					<Col>
						<div className="pt-3 pb-3 position-sticky top-0 vh-100">
							<Card className="h-100">
								<Card.Header>
									{t( 'preview.title' )}{' '}
									<small className="text-muted">{t( 'preview.subtitle' )}</small>
								</Card.Header>
								<Card.Body className="pb-0">
									<PdfPreviewCard
										blobUrl={ this.state.blobUrl }
										expectedTime={
											this.state.lastFullTime || 12 * this.state.lastPreviewTime
										}
										isGeneratingPdf={ this.state.isGeneratingPdf }
										isGeneratingPreview={ this.state.isGeneratingPreview }
										onDownload={ this.handleDownload }
									/>
								</Card.Body>
							</Card>
						</div>
					</Col>
				</Row>
			</Container>
		);
	}
}

Configuration.propTypes = {
	initialState: PropTypes.instanceOf( PdfConfig ).isRequired,
	t: PropTypes.func.isRequired,
};

export default withTranslation( [ 'app' ] )( Configuration );
