import { arrayMove } from '@dnd-kit/sortable';
import dayjs from 'dayjs/esm';
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
import InputGroup from 'react-bootstrap/InputGroup';
import ListGroup from 'react-bootstrap/ListGroup';
import Row from 'react-bootstrap/Row';
import Spinner from 'react-bootstrap/Spinner';
import Stack from 'react-bootstrap/Stack';
import { withTranslation } from 'react-i18next';

import PdfPreviewCard from '~/components/pdf-preview-card';
import PdfProgress from '~/components/pdf-progress';
import ConfigurationSelector from '~/configuration-form/configuration-selector';
import ItemsList from '~/configuration-form/items-list';
import Itinerary from '~/configuration-form/itinerary';
import SpecialDates from '~/configuration-form/special-dates';
import ToggleAccordionItem from '~/configuration-form/toggle-accordion-item';
import { getWeekdays } from '~/lib/date';
import { AVAILABLE_DEVICES, CUSTOM, getPageProperties } from '~/lib/device-utils';
import { byId, wrapWithId } from '~/lib/id-utils';
import PdfConfig, { hydrateFromObject } from '~/pdf/config';
import { AVAILABLE_FONTS } from '~/pdf/lib/fonts';

import 'bootstrap/dist/css/bootstrap.min.css';
import './app.css';

const DAY_ITINERARY_ID_PREFIX = 'day-itinerary-';
const LINE_STYLES = [ 'solid', 'dotted', 'dashed' ];

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

		this.pdfWorker = new Worker(
			new URL( './worker/pdf.worker.js', import.meta.url ),
			{ type: 'module' },
		);
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

	handleConfigChange = ( newConfig ) => {
		this.setState( { ...hydrateFromObject( newConfig ) } );
		changeLanguage( newConfig.language );
	};

	handleLanguageChange = () => {
		dayjs.updateLocale( i18n.language, {
			weekStart: this.state.firstDayOfWeek,
		} );
	};

	handleFieldChange = ( event ) => {
		let targetId = event.target.id;

		let value =
			event.target.type !== 'checkbox'
				? event.target.value
				: event.target.checked;
		if ( event.target.type === 'number' || event.target.dataset.type === 'number' ) {
			value = Number( value );
		}

		if ( targetId === 'resolutionX' || targetId === 'resolutionY' ) {
			value = targetId === 'resolutionX'
				? [ value, this.state.pageSize[ 1 ] ]
				: [ this.state.pageSize[ 0 ], value ];
			targetId = 'pageSize';
		}

		this.setState( { [ targetId ]: value } );

		switch ( event.target.id ) {
			case 'firstDayOfWeek':
				this.handleFirstDayOfWeekChange( value );
				break;

			case 'device':
				this.handleDeviceChange( value );
				break;
		}
	};

	handleDeviceChange = ( device ) => {
		if ( device !== CUSTOM ) {
			const { dpi, pageSize } = getPageProperties( device );
			this.setState( { dpi, pageSize } );
			return;
		}
	};

	handleFirstDayOfWeekChange = ( newFirstDayOfWeek ) => {
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
		newItems.push( wrapWithId( '' ) );
		this.setState( { [ field ]: newItems } );
	};

	handleItemChange = ( event ) => {
		const field = event.target.dataset.field;
		const newItems = [ ...this.state[ field ] ];
		const index = this.state[ field ].findIndex( byId( event.target.dataset.id ) );
		if ( index === -1 ) {
			return;
		}
		newItems[ index ].value = event.target.value;
		this.setState( { [ field ]: newItems } );
	};

	handleDragEnd = ( { oldId, newId, field } ) => {
		const oldIndex = this.state[ field ].findIndex( byId( oldId ) );
		const newIndex = this.state[ field ].findIndex( byId( newId ) );
		if ( oldIndex === -1 || newIndex === -1 ) {
			return;
		}
		const newItems = arrayMove( this.state[ field ], oldIndex, newIndex );
		this.setState( { [ field ]: newItems } );
	};

	handleDayItineraryDragEnd = ( { oldId, newId, field } ) => {
		const oldIndex = this.state.dayItineraries[ field ].items.findIndex(
			byId( oldId ),
		);
		const newIndex = this.state.dayItineraries[ field ].items.findIndex(
			byId( newId ),
		);
		if ( oldIndex === -1 || newIndex === -1 ) {
			return;
		}
		const newItineraries = [ ...this.state.dayItineraries ];
		newItineraries[ field ].items = arrayMove(
			newItineraries[ field ].items,
			oldIndex,
			newIndex,
		);
		this.setState( { dayItineraries: newItineraries } );
	};

	handleItemRemove = ( event ) => {
		const field = event.target.dataset.field;
		const newItems = [ ...this.state[ field ] ];
		const index = this.state[ field ].findIndex( byId( event.target.dataset.id ) );
		if ( index === -1 ) {
			return;
		}
		newItems.splice( index, 1 );
		this.setState( { [ field ]: newItems } );
	};

	handleItineraryAdd = ( event ) => {
		const field = event.target.dataset.field;
		const newItinerary = [ ...this.state[ field ] ];
		newItinerary.push(
			wrapWithId( {
				type: event.target.dataset.type,
				value: '',
			} ),
		);
		this.setState( { [ field ]: newItinerary } );
	};

	handleItineraryChange = ( event ) => {
		const { field, id, type } = event.target.dataset;
		const newItinerary = [ ...this.state[ field ] ];
		const index = this.state[ field ].findIndex( byId( id ) );
		if ( index === -1 ) {
			return;
		}
		newItinerary[ index ] = {
			id,
			type,
			value: type === 'lines' ? Number( event.target.value ) : event.target.value,
		};
		this.setState( { [ field ]: newItinerary } );
	};

	handleItineraryRemove = ( event ) => {
		const field = event.target.dataset.field;
		const newItineraries = [ ...this.state[ field ] ];
		const index = this.state[ field ].findIndex( byId( event.target.dataset.id ) );
		if ( index === -1 ) {
			return;
		}
		newItineraries.splice( index, 1 );
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
		const { field, type } = event.target.dataset;
		const index = this.state.dayItineraries[ field ].items.findIndex(
			byId( event.target.dataset.id ),
		);
		newItineraries[ field ].items[ index ] = {
			id: event.target.dataset.id,
			type,
			value: type === 'lines' ? Number( event.target.value ) : event.target.value,
		};
		this.setState( { dayItineraries: newItineraries } );
	};

	handleDayItineraryRemove = ( event ) => {
		const field = event.target.dataset.field;
		const newItineraries = [ ...this.state.dayItineraries ];
		const index = this.state.dayItineraries[ field ].items.findIndex(
			byId( event.target.dataset.id ),
		);
		if ( index === -1 ) {
			return;
		}
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
		newItineraries[ field ].items.push(
			wrapWithId( {
				type,
				value: '',
			} ),
		);
		this.setState( { dayItineraries: newItineraries } );
	};

	handleSpecialDateAdd = ( newSpecialDate ) => {
		this.setState(
			( prev ) => ( {
				specialDates: [
					...prev.specialDates,
					wrapWithId( newSpecialDate ),
				],
			} ),
		);
	};

	renderDevices() {
		return AVAILABLE_DEVICES.map( ( device ) => (
			<option key={ device } value={ device }>
				{device}
			</option>
		) );
	}

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
		return getWeekdays( this.state.firstDayOfWeek ).map( ( { full, index } ) => (
			<option key={ full } value={ index }>
				{full}
			</option>
		) );
	}

	renderWeekendSelection() {
		return getWeekdays( this.state.firstDayOfWeek ).map( ( { full, index } ) => (
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

	renderLineStyle() {
		return LINE_STYLES.map( ( style ) => (
			<option key={ style } value={ style }>
				{style}
			</option>
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
					onDragEnd={ this.handleDayItineraryDragEnd }
					onRemove={ this.handleDayItineraryRemove }
					onCopy={ this.handleDayItineraryCopy }
				/>
			</ToggleAccordionItem>
		);
	};

	renderConfigurationForm() {
		const { t } = this.props;
		const { device, isGeneratingPdf, isGeneratingPreview } = this.state;
		const isCustomDevice = device === CUSTOM;
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
							<Form.Group controlId="device">
								<Form.Label>{t( 'configuration.general.device' )}</Form.Label>
								<Form.Select
									value={ this.state.device }
									onChange={ this.handleFieldChange }
								>
									{this.renderDevices()}
								</Form.Select>
							</Form.Group>
							{isCustomDevice && <Form.Group controlId="dpi">
								<Form.Label>{t( 'configuration.general.dpi' )}</Form.Label>
								<Form.Control
									type="number"
									value={ this.state.dpi }
									onChange={ this.handleFieldChange }
								/>
							</Form.Group>}
							{isCustomDevice && <Form.Group>
								<Form.Label htmlFor="resolutionX">
									{t( 'configuration.general.resolution' )}
								</Form.Label>
								<InputGroup>
									<Form.Control
										id="resolutionX"
										type="number"
										value={ this.state.pageSize[ 0 ] }
										onChange={ this.handleFieldChange }
									/>
									<InputGroup.Text>x</InputGroup.Text>
									<Form.Control
										id="resolutionY"
										type="number"
										value={ this.state.pageSize[ 1 ] }
										onChange={ this.handleFieldChange }
									/>
								</InputGroup>
							</Form.Group>}
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
									data-type="number"
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
									data-type="number"
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
							<Form.Group controlId="lineStyle">
								<Form.Label>
									{t( 'configuration.general.line-style.label' )}
								</Form.Label>
								<Form.Select
									value={ this.state.lineStyle }
									onChange={ this.handleFieldChange }
								>
									{this.renderLineStyle()}
								</Form.Select>
								<Form.Text className="text-muted">
									{t( 'configuration.general.line-style.description' )}
								</Form.Text>
							</Form.Group>
						</Accordion.Body>
					</Accordion.Item>
					<SpecialDates
						year={ this.state.year }
						items={ this.state.specialDates }
						onAdd={ this.handleSpecialDateAdd }
						onRemove={ this.handleItemRemove }
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
								onDragEnd={ this.handleDragEnd }
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
										onDragEnd={ this.handleDragEnd }
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
								onDragEnd={ this.handleDragEnd }
								onRemove={ this.handleItemRemove }
							/>
						</Accordion>
					</ToggleAccordionItem>
					<Accordion.Item eventKey="dayItineraries">
						<Accordion.Header>{t( 'configuration.day.title' )}</Accordion.Header>
						<Accordion.Body>
							<Accordion defaultActiveKey="0">
								{getWeekdays( this.state.firstDayOfWeek ).map( this.renderDayItinerary )}
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
										onDragEnd={ this.handleDragEnd }
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
