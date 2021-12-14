import dayjs from 'dayjs';
import PropTypes from 'prop-types';
import React from 'react';
import Accordion from 'react-bootstrap/Accordion';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import InputGroup from 'react-bootstrap/InputGroup';
import Row from 'react-bootstrap/Row';
import Stack from 'react-bootstrap/Stack';
import { withTranslation } from 'react-i18next';

import PdfConfig from 'pdf/config';

export const ITINERARY_ITEM = 'item';
export const ITINERARY_LINES = 'lines';

class Itinerary extends React.Component {
	onAddLinesRow = () => {};

	handleItemChange = ( event ) => {
		this.props.onChange(
			ITINERARY_ITEM,
			event.target.dataset.index,
			event.target.value,
		);
	};

	handleLinesChange = ( event ) => {
		this.props.onChange(
			ITINERARY_LINES,
			event.target.dataset.index,
			event.target.value,
		);
	};

	handleRemove = ( event ) => {
		this.props.onRemove( event.target.dataset.index );
	};

	handleAddItem = () => {
		this.props.onAdd( ITINERARY_ITEM );
	};

	handleAddLines = () => {
		this.props.onAdd( ITINERARY_LINES );
	};

	renderRow = ( { type, value }, index ) => {
		switch ( type ) {
			case ITINERARY_ITEM:
				return this.renderItem( value, index );

			case ITINERARY_LINES:
			default:
				return this.renderLines( value, index );
		}
	};

	renderItem( item, index ) {
		const { t } = this.props;
		return (
			<InputGroup>
				<FormControl
					placeholder="Itinerary item"
					value={ item }
					onChange={ this.handleItemChange }
					data-index={ index }
					required
				/>
				{this.renderRemoveButton( index )}
			</InputGroup>
		);
	}

	renderLines( numberOfLines, index ) {
		const { t } = this.props;
		return (
			<InputGroup>
				<FloatingLabel
					className="flex-grow-1"
					controlId="lines"
					label={ t( 'configuration.itinerary.placeholder.lines' ) }
				>
					<FormControl
						placeholder={ t( 'configuration.itinerary.placeholder.lines' ) }
						type="number"
						min={ 1 }
						max={ 50 }
						value={ numberOfLines }
						onChange={ this.handleLinesChange }
						data-index={ index }
						required
					/>
				</FloatingLabel>
				{this.renderRemoveButton( index )}
			</InputGroup>
		);
	}

	renderRemoveButton( index ) {
		const { t } = this.props;
		return (
			<Button
				variant="outline-danger"
				onClick={ this.handleRemove }
				data-index={ index }
			>
				{t( 'configuration.itinerary.button.remove' )}
			</Button>
		);
	}

	render() {
		const { itinerary, t } = this.props;
		return (
			<Accordion className="mt-3" defaultActiveKey="0">
				<Accordion.Item eventKey="0">
					<Accordion.Header>
						{t( 'configuration.itinerary.title' )}
					</Accordion.Header>
					<Accordion.Body>
						<Stack gap={ 2 }>
							{itinerary.map( this.renderRow )}
							{itinerary.length === 0 && (
								<Alert variant="secondary" className="mb-0">
									Empty itinerary.
								</Alert>
							)}
						</Stack>
						<Stack direction="horizontal" className="mt-3" gap={ 3 }>
							<Button variant="outline-secondary" onClick={ this.handleAddItem }>
								{t( 'configuration.itinerary.button.item' )}
							</Button>
							<Button variant="outline-secondary" onClick={ this.handleAddLines }>
								{t( 'configuration.itinerary.button.lines' )}
							</Button>
						</Stack>
					</Accordion.Body>
				</Accordion.Item>
			</Accordion>
		);
	}
}

Itinerary.propTypes = {
	itinerary: PropTypes.array.isRequired,
	onAdd: PropTypes.func.isRequired,
	onChange: PropTypes.func.isRequired,
	onRemove: PropTypes.func.isRequired,
	t: PropTypes.func.isRequired,
};

export default withTranslation( 'app' )( Itinerary );
