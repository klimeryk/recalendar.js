import PropTypes from 'prop-types';
import React from 'react';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Form from 'react-bootstrap/Form';
import Stack from 'react-bootstrap/Stack';
import { withTranslation } from 'react-i18next';

import { ITINERARY_ITEM, ITINERARY_LINES } from 'configuration-form/itinerary';
import { getJsonAttachment } from 'lib/attachments';
import { convertConfigToCurrentVersion } from 'lib/config-compat';
import PdfConfig, { CONFIG_FILE } from 'pdf/config';

const STATUS_EMPTY = 'EMPTY';
const STATUS_LOADING = 'LOADING';
const STATUS_ERROR = 'ERROR';
const STATUS_SUCCESS = 'SUCCESS';

const TEMPLATE_BASIC = 'BASIC';
const TEMPLATE_ADVANCED = 'ADVANCED';
const TEMPLATE_BLANK = 'BLANK';
const TEMPLATE_MINIMALISTIC = 'MINIMALISTIC';

class ConfigurationSelector extends React.Component {
	state = {
		status: STATUS_EMPTY,
	};

	handleTemplateSelect = ( event ) => {
		const config = new PdfConfig();
		let dayOfWeek = config.firstDayOfWeek;

		switch ( event.target.dataset.template ) {
			case TEMPLATE_BASIC:
				// The default config
				break;

			case TEMPLATE_ADVANCED:
				config.dayItineraries = [ ...Array( 7 ).keys() ].map( () => {
					const itinerary = {
						dayOfWeek,
						items: [
							{ type: ITINERARY_ITEM, value: 'Super advanced' },
							{ type: ITINERARY_LINES, value: 50 },
						],
						isEnabled: true,
					};
					dayOfWeek = ++dayOfWeek % 7;
					return itinerary;
				} );
				break;

			case TEMPLATE_BLANK:
				config.specialDates = {};
				config.habits = [];
				config.monthItinerary = [];
				config.todos = [];
				config.dayItineraries = [ ...Array( 7 ).keys() ].map( () => {
					const itinerary = {
						dayOfWeek,
						items: [],
						isEnabled: true,
					};
					dayOfWeek = ++dayOfWeek % 7;
					return itinerary;
				} );
				config.weekRetrospectiveItinerary = [];
				break;

			case TEMPLATE_MINIMALISTIC:
				config.specialDates = {};
				config.habits = [];
				config.isMonthOverviewEnabled = false;
				config.monthItinerary = [];
				config.isWeekOverviewEnabled = true;
				config.todos = [];
				config.dayItineraries = [ ...Array( 7 ).keys() ].map( () => {
					const itinerary = {
						dayOfWeek,
						items: [],
						isEnabled: false,
					};
					dayOfWeek = ++dayOfWeek % 7;
					return itinerary;
				} );
				config.isWeekRetrospectiveEnabled = false;
				config.weekRetrospectiveItinerary = [];
				break;

			default:
				return;
		}

		this.props.onConfigChange( config );
	};

	handleFileChange = ( event ) => {
		this.setState( {
			status: STATUS_LOADING,
		} );

		const file = event.target.files[ 0 ];
		const reader = new FileReader();
		reader.onload = this.handleFileLoad;

		reader.readAsArrayBuffer( file );
	};

	handleFileLoad = async ( event ) => {
		const attachment = await getJsonAttachment(
			event.target.result,
			CONFIG_FILE,
		);

		if ( ! attachment ) {
			this.setState( {
				status: STATUS_ERROR,
			} );
			return;
		}

		this.setState( {
			status: STATUS_SUCCESS,
		} );

		this.props.onConfigChange( convertConfigToCurrentVersion( attachment ) );
	};

	renderStatusMessage() {
		const { t } = this.props;

		switch ( this.state.status ) {
			case STATUS_LOADING:
				return (
					<Alert variant="info" className="mt-2 mb-0">
						{t( 'configuration.selector.upload.loading' )}
					</Alert>
				);

			case STATUS_ERROR:
				return (
					<Alert variant="danger" className="mt-2 mb-0">
						{t( 'configuration.selector.upload.error' )}
					</Alert>
				);

			case STATUS_SUCCESS:
				return (
					<Alert variant="success" className="mt-2 mb-0">
						{t( 'configuration.selector.upload.success' )}
					</Alert>
				);

			case STATUS_EMPTY:
			default:
				return null;
		}
	}

	render() {
		const { t } = this.props;
		return (
			<Stack>
				<Form.Label>{t( 'configuration.selector.template.label' )}</Form.Label>
				<ButtonGroup aria-label="Config templates">
					<Button
						variant="info"
						data-template={ TEMPLATE_BASIC }
						onClick={ this.handleTemplateSelect }
					>
						{t( 'configuration.selector.template.basic' )}
					</Button>
					<Button
						variant="primary"
						data-template={ TEMPLATE_ADVANCED }
						onClick={ this.handleTemplateSelect }
					>
						{t( 'configuration.selector.template.advanced' )}
					</Button>
					<Button
						variant="blank"
						data-template={ TEMPLATE_BLANK }
						onClick={ this.handleTemplateSelect }
					>
						{t( 'configuration.selector.template.blank' )}
					</Button>
					<Button
						variant="dark"
						data-template={ TEMPLATE_MINIMALISTIC }
						onClick={ this.handleTemplateSelect }
					>
						{t( 'configuration.selector.template.minimalistic' )}
					</Button>
				</ButtonGroup>
				<Form.Group controlId="configurationFile" className="mt-3">
					<Form.Label>{t( 'configuration.selector.upload.label' )}</Form.Label>
					<Form.Control
						type="file"
						accept=".pdf"
						onChange={ this.handleFileChange }
					/>
					{this.renderStatusMessage()}
				</Form.Group>
			</Stack>
		);
	}
}

ConfigurationSelector.propTypes = {
	onConfigChange: PropTypes.func.isRequired,
	t: PropTypes.func.isRequired,
};

export default withTranslation( [ 'app' ] )( ConfigurationSelector );
