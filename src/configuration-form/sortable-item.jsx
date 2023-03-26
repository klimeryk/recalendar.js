import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import PropTypes from 'prop-types';
import React from 'react';
import Button from 'react-bootstrap/Button';
import FormControl from 'react-bootstrap/FormControl';
import InputGroup from 'react-bootstrap/InputGroup';
import { useTranslation } from 'react-i18next';

function SortableItem( props ) {
	const { t } = useTranslation( 'app' );
	const { id, value, field, onChange } = props;
	const { attributes, listeners, setNodeRef, transform, transition } =
		useSortable( { id } );

	const style = {
		transform: CSS.Transform.toString( transform ),
		transition,
	};

	function renderRemoveButton() {
		const { onRemove } = props;
		return (
			<Button
				variant="outline-danger"
				onClick={ onRemove }
				data-id={ id }
				data-field={ field }
			>
				{t( 'configuration.items-list.button.remove' )}
			</Button>
		);
	}

	return (
		<div ref={ setNodeRef } style={ style }>
			<InputGroup>
				<Button
					className="grab-handle"
					variant="link"
					{ ...attributes }
					{ ...listeners }
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="16"
						height="16"
						fill="currentColor"
						className="bi bi-grip-vertical"
						viewBox="0 0 16 16"
					>
						{/* eslint-disable-next-line max-len */}
						<path d="M7 2a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM7 5a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM7 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm-3 3a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm-3 3a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" />
					</svg>
				</Button>
				<FormControl
					placeholder={ t( 'configuration.items-list.placeholder' ) }
					value={ value }
					onChange={ onChange }
					data-field={ field }
					data-id={ id }
					required
				/>
				{renderRemoveButton()}
			</InputGroup>
		</div>
	);
}

SortableItem.propTypes = {
	field: PropTypes.string.isRequired,
	id: PropTypes.string.isRequired,
	onChange: PropTypes.func.isRequired,
	onRemove: PropTypes.func.isRequired,
	value: PropTypes.string.isRequired,
};

export default SortableItem;
