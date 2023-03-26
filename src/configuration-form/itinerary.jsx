import PropTypes from 'prop-types';
import React from 'react';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import FormControl from 'react-bootstrap/FormControl';
import InputGroup from 'react-bootstrap/InputGroup';
import Stack from 'react-bootstrap/Stack';
import { useTranslation } from 'react-i18next';

export const ITINERARY_ITEM = 'item';
export const ITINERARY_LINES = 'lines';
export const ITINERARY_NEW_PAGE = 'new_page';

function Itinerary( props ) {
	const { t } = useTranslation( 'app' );

	function renderRow( { type, value }, index ) {
		switch ( type ) {
			case ITINERARY_ITEM:
				return renderItem( value, index );

			case ITINERARY_NEW_PAGE:
				return renderNewPage( value, index );

			case ITINERARY_LINES:
			default:
				return renderLines( value, index );
		}
	}

	function renderItem( item, index ) {
		return (
			<InputGroup key={ index }>
				<FormControl
					placeholder="Itinerary item"
					value={ item }
					onChange={ props.onChange }
					data-index={ index }
					data-type={ ITINERARY_ITEM }
					data-field={ props.field }
					required
				/>
				{renderRemoveButton( index )}
			</InputGroup>
		);
	}

	function renderNewPage( item, index ) {
		return (
			<InputGroup key={ index }>
				<InputGroup.Text className="flex-grow-1">
					{t( 'configuration.itinerary.placeholder.page' )}
				</InputGroup.Text>
				{renderRemoveButton( index )}
			</InputGroup>
		);
	}

	function renderLines( numberOfLines, index ) {
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
						onChange={ props.onChange }
						data-index={ index }
						data-type={ ITINERARY_LINES }
						data-field={ props.field }
						required
					/>
				</FloatingLabel>
				{renderRemoveButton( index )}
			</InputGroup>
		);
	}

	function renderRemoveButton( index ) {
		return (
			<Button
				variant="outline-danger"
				onClick={ props.onRemove }
				data-index={ index }
				data-field={ props.field }
			>
				{t( 'configuration.itinerary.button.remove' )}
			</Button>
		);
	}

	const { field, itinerary, onAdd, onCopy } = props;
	return (
		<>
			<Stack gap={ 2 }>
				{itinerary.map( renderRow )}
				{itinerary.length === 0 && (
					<Alert variant="secondary" className="mb-0">
						{t( 'configuration.itinerary.empty' )}
					</Alert>
				)}
				<Stack direction="horizontal" gap={ 3 }>
					<ButtonGroup>
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
					</ButtonGroup>
				</Stack>
			</Stack>
			{onCopy && (
				<Button
					variant="outline-danger"
					className="mt-3"
					onClick={ onCopy }
					data-field={ field }
				>
					{t( 'configuration.itinerary.button.copy' )}
				</Button>
			)}
		</>
	);
}

Itinerary.propTypes = {
	field: PropTypes.string.isRequired,
	itinerary: PropTypes.array.isRequired,
	onAdd: PropTypes.func.isRequired,
	onChange: PropTypes.func.isRequired,
	onCopy: PropTypes.func,
	onRemove: PropTypes.func.isRequired,
};

export default Itinerary;
