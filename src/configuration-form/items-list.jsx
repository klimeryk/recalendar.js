import PropTypes from 'prop-types';
import React from 'react';
import Accordion from 'react-bootstrap/Accordion';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import FormControl from 'react-bootstrap/FormControl';
import InputGroup from 'react-bootstrap/InputGroup';
import Stack from 'react-bootstrap/Stack';
import { useTranslation } from 'react-i18next';

function ItemsList( props ) {
	const { t } = useTranslation( 'app' );

	function renderRemoveButton( index ) {
		const { field, onRemove } = props;
		return (
			<Button
				variant="outline-danger"
				onClick={ onRemove }
				data-index={ index }
				data-field={ field }
			>
				{t( 'configuration.items-list.button.remove' )}
			</Button>
		);
	}

	function renderItem( item, index ) {
		const { field, onChange } = props;
		return (
			<InputGroup key={ index }>
				<FormControl
					placeholder={ t( 'configuration.items-list.placeholder' ) }
					value={ item }
					onChange={ onChange }
					data-index={ index }
					data-field={ field }
					required
				/>
				{renderRemoveButton( index )}
			</InputGroup>
		);
	}

	const { items, field, onAdd, title } = props;
	return (
		<Accordion.Item eventKey={ field }>
			<Accordion.Header>{title}</Accordion.Header>
			<Accordion.Body>
				<Stack gap={ 2 }>
					{items.map( renderItem )}
					{items.length === 0 && (
						<Alert variant="secondary" className="mb-0">
							{t( 'configuration.items-list.empty' )}
						</Alert>
					)}
				</Stack>
				<Stack direction="horizontal" className="mt-3">
					<Button
						variant="outline-secondary"
						onClick={ onAdd }
						data-field={ field }
					>
						{t( 'configuration.items-list.button.item' )}
					</Button>
				</Stack>
			</Accordion.Body>
		</Accordion.Item>
	);
}

ItemsList.propTypes = {
	field: PropTypes.string.isRequired,
	items: PropTypes.array.isRequired,
	onAdd: PropTypes.func.isRequired,
	onChange: PropTypes.func.isRequired,
	onRemove: PropTypes.func.isRequired,
	title: PropTypes.string.isRequired,
};

export default ItemsList;
