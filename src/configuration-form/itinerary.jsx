import PropTypes from 'prop-types';
import React from 'react';
import Accordion from 'react-bootstrap/Accordion';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import FormControl from 'react-bootstrap/FormControl';
import InputGroup from 'react-bootstrap/InputGroup';
import Stack from 'react-bootstrap/Stack';
import { withTranslation } from 'react-i18next';

export const ITINERARY_ITEM = 'item';
export const ITINERARY_LINES = 'lines';
export const ITINERARY_NEW_PAGE = 'new_page';

class Itinerary extends React.Component {
	renderRow = ( { type, value }, index ) => {
		switch ( type ) {
			case ITINERARY_ITEM:
				return this.renderItem( value, index );

			case ITINERARY_NEW_PAGE:
				return this.renderNewPage( value, index );

			case ITINERARY_LINES:
			default:
				return this.renderLines( value, index );
		}
	};

	renderItem( item, index ) {
		const { field, onChange } = this.props;
		return (
			<InputGroup key={ index }>
				<FormControl
					placeholder="Itinerary item"
					value={ item }
					onChange={ onChange }
					data-index={ index }
					data-type={ ITINERARY_ITEM }
					data-field={ field }
					required
				/>
				{this.renderRemoveButton( index )}
			</InputGroup>
		);
	}

	renderNewPage( item, index ) {
		const { t } = this.props;
		return (
			<InputGroup key={ index }>
				<InputGroup.Text className="flex-grow-1">
					{t( 'configuration.itinerary.placeholder.page' )}
				</InputGroup.Text>
				{this.renderRemoveButton( index )}
			</InputGroup>
		);
	}

	renderLines( numberOfLines, index ) {
		const { field, onChange, t } = this.props;
		return (
			<InputGroup key={ index }>
				<FloatingLabel
					className="flex-grow-1"
					controlId={ 'lines-' + index }
					label={ t( 'configuration.itinerary.placeholder.lines' ) }
				>
					<FormControl
						placeholder={ t( 'configuration.itinerary.placeholder.lines' ) }
						type="number"
						min={ 1 }
						max={ 50 }
						value={ numberOfLines }
						onChange={ onChange }
						data-index={ index }
						data-type={ ITINERARY_LINES }
						data-field={ field }
						required
					/>
				</FloatingLabel>
				{this.renderRemoveButton( index )}
			</InputGroup>
		);
	}

	renderRemoveButton( index ) {
		const { field, onRemove, t } = this.props;
		return (
			<Button
				variant="outline-danger"
				onClick={ onRemove }
				data-index={ index }
				data-field={ field }
			>
				{t( 'configuration.itinerary.button.remove' )}
			</Button>
		);
	}

	render() {
		const { eventKey, field, itinerary, onAdd, t, title } = this.props;
		const accordionItem = (
			<Accordion.Item eventKey={ eventKey || '0' }>
				<Accordion.Header>{title}</Accordion.Header>
				<Accordion.Body>
					<Stack gap={ 2 }>
						{itinerary.map( this.renderRow )}
						{itinerary.length === 0 && (
							<Alert variant="secondary" className="mb-0">
								{t( 'configuration.itinerary.empty' )}
							</Alert>
						)}
					</Stack>
					<Stack direction="horizontal" className="mt-3" gap={ 3 }>
						<Button
							variant="outline-secondary"
							onClick={ onAdd }
							data-type={ ITINERARY_ITEM }
							data-field={ field }
						>
							{t( 'configuration.itinerary.button.item' )}
						</Button>
						<Button
							variant="outline-secondary"
							onClick={ onAdd }
							data-type={ ITINERARY_LINES }
							data-field={ field }
						>
							{t( 'configuration.itinerary.button.lines' )}
						</Button>
						<Button
							variant="outline-secondary"
							onClick={ onAdd }
							data-type={ ITINERARY_NEW_PAGE }
							data-field={ field }
						>
							{t( 'configuration.itinerary.button.page' )}
						</Button>
					</Stack>
				</Accordion.Body>
			</Accordion.Item>
		);
		if ( eventKey ) {
			return accordionItem;
		}

		return (
			<Accordion className="mt-3" defaultActiveKey="0">
				{accordionItem}
			</Accordion>
		);
	}
}

Itinerary.propTypes = {
	eventKey: PropTypes.string,
	field: PropTypes.string.isRequired,
	itinerary: PropTypes.array.isRequired,
	onAdd: PropTypes.func.isRequired,
	onChange: PropTypes.func.isRequired,
	onRemove: PropTypes.func.isRequired,
	t: PropTypes.func.isRequired,
	title: PropTypes.string.isRequired,
};

export default withTranslation( 'app' )( Itinerary );
