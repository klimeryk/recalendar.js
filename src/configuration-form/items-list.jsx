import {
	DndContext,
	closestCenter,
	KeyboardSensor,
	PointerSensor,
	useSensor,
	useSensors,
} from '@dnd-kit/core';
import {
	SortableContext,
	sortableKeyboardCoordinates,
	verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import PropTypes from 'prop-types';
import React from 'react';
import Accordion from 'react-bootstrap/Accordion';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import Stack from 'react-bootstrap/Stack';
import { useTranslation } from 'react-i18next';

import SortableItem from './sortable-item';

function ItemsList( props ) {
	const { t } = useTranslation( 'app' );

	const sensors = useSensors(
		useSensor( PointerSensor ),
		useSensor( KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		} ),
	);

	function handleDragEnd( event ) {
		const oldId = event.active.id;
		const newId = event.over.id;

		if ( oldId !== newId ) {
			props.onDragEnd( { oldId, newId, field } );
		}
	}

	function renderItem( { id, value } ) {
		const { field, onChange, onRemove } = props;
		return (
			<SortableItem
				key={ id }
				id={ id }
				value={ value }
				onChange={ onChange }
				onRemove={ onRemove }
				field={ field }
			/>
		);
	}

	const { items, field, onAdd, title } = props;
	return (
		<Accordion.Item eventKey={ field }>
			<Accordion.Header>{title}</Accordion.Header>
			<Accordion.Body>
				<Stack gap={ 2 }>
					<DndContext
						sensors={ sensors }
						collisionDetection={ closestCenter }
						onDragEnd={ handleDragEnd }
					>
						<SortableContext
							items={ items }
							strategy={ verticalListSortingStrategy }
						>
							{items.map( renderItem )}
							{items.length === 0 && (
								<Alert variant="secondary" className="mb-0">
									{t( 'configuration.items-list.empty' )}
								</Alert>
							)}
						</SortableContext>
					</DndContext>
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
	onDragEnd: PropTypes.func.isRequired,
	onRemove: PropTypes.func.isRequired,
	title: PropTypes.string.isRequired,
};

export default ItemsList;
