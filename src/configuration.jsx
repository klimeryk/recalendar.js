import dayjs from 'dayjs';
import { saveAs } from 'file-saver';
import i18n from 'i18next';
import PropTypes from 'prop-types';
import React from 'react';
import Accordion from 'react-bootstrap/Accordion';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import ListGroup from 'react-bootstrap/ListGroup';
import Row from 'react-bootstrap/Row';
import Spinner from 'react-bootstrap/Spinner';
import Stack from 'react-bootstrap/Stack';
import { withTranslation } from 'react-i18next';

import PdfWorker from './worker/pdf.worker.js'; // eslint-disable-line import/default

import PdfPreviewCard from 'components/pdf-preview-card';
import PdfProgress from 'components/pdf-progress';
import ConfigurationSelector from 'configuration-form/configuration-selector';
import ItemsList from 'configuration-form/items-list';
import Itinerary from 'configuration-form/itinerary';
import SpecialDates from 'configuration-form/special-dates';
import ToggleAccordionItem from 'configuration-form/toggle-accordion-item';
import { getWeekdays } from 'lib/date';
import PdfConfig, { hydrateFromObject } from 'pdf/config';
import { AVAILABLE_FONTS } from 'pdf/lib/fonts';

import 'bootstrap/dist/css/bootstrap.min.css';
import './app.css';

const DAY_ITINERARY_ID_PREFIX = 'day-itinerary-';

class Configuration extends React.PureComponent {
	state = {
		isGeneratingPdf: false,
		isGeneratingPreview: false,
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

	componentDidUpdate( prevProps, prevState ) {
		if ( prevState.blobUrl && prevState.blobUrl !== this.state.blobUrl ) {
			// Each refresh generates a new blob - and it will be kept in the memory
			// until the window is refreshed/unloaded. To keep memory consumption low
			// lets explicitly release the stale blob.
			// See https://developer.mozilla.org/en-US/docs/Web/API/URL/revokeObjectURL
			URL.revokeObjectURL( prevState.blobUrl );
		}
	}

	handleConfigChange = ( newConfig ) => {
		this.setState( { ...hydrateFromObject( newConfig ) } );
	};

	handleFieldChange = ( event ) => {
		const value =
			event.target.type !== 'checkbox'
				? event.target.value
				: event.target.checked;
		this.setState( { [ event.target.id ]: value } );
		if ( event.target.id === 'firstDayOfWeek' ) {
			const newFirstDayOfWeek = Number( event.target.value );
			dayjs.updateLocale( i18n.language, {
				weekStart: newFirstDayOfWeek,
			} );

			const newFirstDayOfWeekIndex = this.state.dayItineraries.findIndex(
				this.isDayOfWeek( newFirstDayOfWeek ),
			);
			if ( newFirstDayOfWeekIndex === -1 ) {
				return;
			}

			const dayItinerariesReordered = [
				...this.state.dayItineraries.slice( newFirstDayOfWeekIndex ),
				...this.state.dayItineraries.slice( 0, newFirstDayOfWeekIndex ),
			];

			this.setState( { dayItineraries: dayItinerariesReordered } );
		}
	};

	isDayOfWeek = ( dayOfWeek ) => {
		return ( item ) => item.dayOfWeek === dayOfWeek;
	};

	handleToggle = ( event ) => {
		this.setState( { [ event.target.id ]: event.target.checked } );
	};

	handleDayItineraryToggle = ( event ) => {
		const id = Number( event.target.id.replace( DAY_ITINERARY_ID_PREFIX, '' ) );
		const newItineraries = [ ...this.state.dayItineraries ];
		newItineraries[ id ].isEnabled = event.target.checked;

		this.setState( { dayItineraries: newItineraries } );
	};

	handleWeekendChange = ( event ) => {
		const dayOfWeek = Number( event.target.dataset.index );
		const newWeekendDays = [ ...this.state.weekendDays ];
		const indexInArray = newWeekendDays.indexOf( dayOfWeek );
		if ( event.target.checked ) {
			if ( indexInArray === -1 ) {
				newWeekendDays.push( dayOfWeek );
			}
		} else if ( indexInArray !== -1 ) {
			newWeekendDays.splice( indexInArray, 1 );
		}

		this.setState( { weekendDays: newWeekendDays } );
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
			value: event.target.value,
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
			language: i18n.language,
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
		newItineraries[ field ].items[ index ] = {
			type,
			value: event.target.value,
		};
		this.setState( { dayItineraries: newItineraries } );
	};

	handleDayItineraryRemove = ( event ) => {
		const newItineraries = [ ...this.state.dayItineraries ];
		const { field, index } = event.target.dataset;
		newItineraries[ field ].items.splice( index, 1 );
		this.setState( { dayItineraries: newItineraries } );
	};

	handleDayItineraryCopy = ( event ) => {
		const { field } = event.target.dataset;
		const itemsToCopy = [ ...this.state.dayItineraries[ field ].items ];
		const newItineraries = this.state.dayItineraries.map( ( itinerary ) => ( {
			...itinerary,
			items: [ ...itemsToCopy ],
			isEnabled: this.state.dayItineraries[ field ].isEnabled,
		} ) );
		this.setState( { dayItineraries: newItineraries } );
	};

	handleDayItineraryAdd = ( event ) => {
		const newItineraries = [ ...this.state.dayItineraries ];
		const { field, type } = event.target.dataset;
		newItineraries[ field ].items.push( {
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

	renderFonts() {
		return AVAILABLE_FONTS.map( ( font ) => (
			<option key={ font } value={ font }>
				{font}
			</option>
		) );
	}

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
		return getWeekdays().map( ( { full, index } ) => (
			<option key={ full } value={ index }>
				{full}
			</option>
		) );
	}

	renderWeekendSelection() {
		return getWeekdays().map( ( { full, index } ) => (
			<ListGroup.Item key={ full } value={ index }>
				<Form.Check
					id={ 'weekend-' + index }
					type="checkbox"
					label={ full }
					data-index={ index }
					checked={ this.state.weekendDays.includes( index ) }
					onChange={ this.handleWeekendChange }
				/>
			</ListGroup.Item>
		) );
	}

	renderDayItinerary = ( { full: dayOfWeek }, index ) => {
		return (
			<ToggleAccordionItem
				key={ dayOfWeek }
				id={ DAY_ITINERARY_ID_PREFIX + index }
				title={ dayOfWeek }
				onToggle={ this.handleDayItineraryToggle }
				toggledOn={ this.state.dayItineraries[ index ].isEnabled }
			>
				<Itinerary
					field={ index.toString() }
					itinerary={ this.state.dayItineraries[ index ].items }
					onAdd={ this.handleDayItineraryAdd }
					onChange={ this.handleDayItineraryChange }
					onRemove={ this.handleDayItineraryRemove }
					onCopy={ this.handleDayItineraryCopy }
				/>
			</ToggleAccordionItem>
		);
	};

	renderConfigurationForm() {
		const { t } = this.props;
		const { isGeneratingPdf, isGeneratingPreview } = this.state;
		return (
			<Form onSubmit={ this.handlePreview }>
				<Accordion defaultActiveKey="start" className="my-3">
					<Accordion.Item eventKey="start">
						<Accordion.Header>
							{t( 'configuration.selector.label' )}
						</Accordion.Header>
						<Accordion.Body>
							<ConfigurationSelector onConfigChange={ this.handleConfigChange } />
						</Accordion.Body>
					</Accordion.Item>
					<Accordion.Item eventKey="general">
						<Accordion.Header>
							{t( 'configuration.general.label' )}
						</Accordion.Header>
						<Accordion.Body>
							<Form.Group controlId="fontFamily">
								<Form.Label>{t( 'configuration.general.font' )}</Form.Label>
								<Form.Select
									value={ this.state.fontFamily }
									onChange={ this.handleFieldChange }
								>
									{this.renderFonts()}
								</Form.Select>
							</Form.Group>
							<Form.Group controlId="isLeftHanded" className="mt-2">
								<Form.Check
									label={ t( 'configuration.general.left-handed.label' ) }
									type="checkbox"
									checked={ this.state.isLeftHanded }
									value={ this.state.isLeftHanded }
									onChange={ this.handleFieldChange }
								/>
								<Form.Text className="text-muted">
									{t( 'configuration.general.left-handed.description' )}
								</Form.Text>
							</Form.Group>
							<Form.Group controlId="alwaysOnSidebar" className="mt-2">
								<Form.Check
									label={ t( 'configuration.general.sidebar.label' ) }
									type="checkbox"
									checked={ this.state.alwaysOnSidebar }
									value={ this.state.alwaysOnSidebar }
									onChange={ this.handleFieldChange }
								/>
								<Form.Text className="text-muted">
									{t( 'configuration.general.sidebar.description' )}
								</Form.Text>
							</Form.Group>
							<Form.Group controlId="supernoteToolbar" className="mt-2">
								<Form.Check
									label={ t( 'configuration.general.supernoteToolbar.label' ) }
									type="checkbox"
									checked={ this.state.supernoteToolbar }
									value={ this.state.supernoteToolbar }
									onChange={ this.handleFieldChange }
								/>
								<Form.Text className="text-muted">
									{t( 'configuration.general.supernoteToolbar.description' )}
								</Form.Text>
							</Form.Group>
							<Form.Group controlId="year">
								<Form.Label>{t( 'configuration.general.year' )}</Form.Label>
								<Form.Control
									type="number"
									value={ this.state.year }
									onChange={ this.handleFieldChange }
								/>
							</Form.Group>
							<Form.Group controlId="month">
								<Form.Label>
									{t( 'configuration.general.starting-month.label' )}
								</Form.Label>
								<Form.Select
									value={ this.state.month }
									onChange={ this.handleFieldChange }
								>
									{this.renderMonths()}
								</Form.Select>
								<Form.Text className="text-muted">
									{t( 'configuration.general.starting-month.description' )}
								</Form.Text>
							</Form.Group>
							<Form.Group controlId="firstDayOfWeek">
								<Form.Label>
									{t( 'configuration.general.first-day-of-week' )}
								</Form.Label>
								<Form.Select
									value={ this.state.firstDayOfWeek }
									onChange={ this.handleFieldChange }
								>
									{this.renderDaysOfWeek()}
								</Form.Select>
							</Form.Group>
							<Form.Group controlId="monthCount">
								<Form.Label>
									{t( 'configuration.general.month-count.label' )}
								</Form.Label>
								<Form.Control
									type="number"
									value={ this.state.monthCount }
									onChange={ this.handleFieldChange }
									min={ 1 }
									max={ 12 }
								/>
								<Form.Text className="text-muted">
									{t( 'configuration.general.month-count.description' )}
								</Form.Text>
							</Form.Group>
							<Form.Label>{t( 'configuration.general.weekend' )}</Form.Label>
							<ListGroup>{this.renderWeekendSelection()}</ListGroup>
						</Accordion.Body>
					</Accordion.Item>
					<SpecialDates
						items={ this.state.specialDates }
						onAdd={ this.handleSpecialDateAdd }
						onRemove={ this.handleSpecialDateRemove }
					/>
					<ToggleAccordionItem
						id="isMonthOverviewEnabled"
						title={ t( 'configuration.month.title' ) }
						onToggle={ this.handleToggle }
						toggledOn={ this.state.isMonthOverviewEnabled }
					>
						<p className="mb-0">{t( 'configuration.month.description' )}</p>
						<Accordion className="mt-3" defaultActiveKey="habits">
							<ItemsList
								field="habits"
								title={ t( 'configuration.month.habits.title' ) }
								items={ this.state.habits }
								onAdd={ this.handleItemAdd }
								onChange={ this.handleItemChange }
								onRemove={ this.handleItemRemove }
							/>
							<Accordion.Item eventKey="monthItinerary">
								<Accordion.Header>
									{t( 'configuration.month.itinerary.title' )}
								</Accordion.Header>
								<Accordion.Body>
									<Itinerary
										field="monthItinerary"
										itinerary={ this.state.monthItinerary }
										onAdd={ this.handleItineraryAdd }
										onChange={ this.handleItineraryChange }
										onRemove={ this.handleItineraryRemove }
									/>
								</Accordion.Body>
							</Accordion.Item>
						</Accordion>
					</ToggleAccordionItem>
					<ToggleAccordionItem
						id="isWeekOverviewEnabled"
						title={ t( 'configuration.week.title' ) }
						onToggle={ this.handleToggle }
						toggledOn={ this.state.isWeekOverviewEnabled }
					>
						<p className="mb-0">{t( 'configuration.week.description' )}</p>
						<Accordion className="mt-3" defaultActiveKey="todos">
							<ItemsList
								field="todos"
								title={ t( 'configuration.week.todos.title' ) }
								items={ this.state.todos }
								onAdd={ this.handleItemAdd }
								onChange={ this.handleItemChange }
								onRemove={ this.handleItemRemove }
							/>
						</Accordion>
					</ToggleAccordionItem>
					<Accordion.Item eventKey="dayItineraries">
						<Accordion.Header>{t( 'configuration.day.title' )}</Accordion.Header>
						<Accordion.Body>
							<Accordion defaultActiveKey="0">
								{getWeekdays().map( this.renderDayItinerary )}
							</Accordion>
						</Accordion.Body>
					</Accordion.Item>
					<ToggleAccordionItem
						id="isWeekRetrospectiveEnabled"
						title={ t( 'configuration.week.retrospective.title' ) }
						onToggle={ this.handleToggle }
						toggledOn={ this.state.isWeekRetrospectiveEnabled }
					>
						<p className="mb-0">
							{t( 'configuration.week.retrospective.description' )}
						</p>
						<Accordion
							className="mt-3"
							defaultActiveKey="weekRetrospectiveItinerary"
						>
							<Accordion.Item eventKey="weekRetrospectiveItinerary">
								<Accordion.Header>
									{t( 'configuration.week.retrospective.itinerary.title' )}
								</Accordion.Header>
								<Accordion.Body>
									<Itinerary
										field="weekRetrospectiveItinerary"
										itinerary={ this.state.weekRetrospectiveItinerary }
										onAdd={ this.handleItineraryAdd }
										onChange={ this.handleItineraryChange }
										onRemove={ this.handleItineraryRemove }
									/>
								</Accordion.Body>
							</Accordion.Item>
						</Accordion>
					</ToggleAccordionItem>
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
