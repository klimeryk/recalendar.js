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
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Stack from 'react-bootstrap/Stack';
import { Trans, useTranslation } from 'react-i18next';

import SortableItineraryRow from './sortable-itinerary-row';

export const ITINERARY_ITEM = 'item';
export const ITINERARY_LINES = 'lines';
export const ITINERARY_NEW_PAGE = 'new_page';

const DATE_FORMATS_URL = 'https://day.js.org/docs/en/display/format#list-of-all-available-formats';

function Itinerary( props ) {
	const { t } = useTranslation( 'app' );

	function handleDragEnd( event ) {
		const oldId = event.active.id;
		const newId = event.over.id;

		if ( oldId !== newId ) {
			props.onDragEnd( { oldId, newId, field } );
		}
	}

	function renderRow( { id, value, type } ) {
		return (
			<SortableItineraryRow
				key={ id }
				field={ props.field }
				id={ id }
				type={ type }
				value={ value }
				onChange={ props.onChange }
				onRemove={ props.onRemove }
			/>
		);
	}

	const { field, itinerary, onAdd, onCopy } = props;
	const sensors = useSensors(
		useSensor( PointerSensor ),
		useSensor( KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		} ),
	);
	return (
		<>
			<p><small className="text-muted">
				<Trans i18nKey="configuration.itinerary.dateTemplate">
					Include formatted dates using <code>{ '{{date}}' }</code>
					or <code>{ '{{date:YYYY-MM-DD}}' }</code>.
					See <a href={ DATE_FORMATS_URL }>available formats</a>.
				</Trans>
			</small></p>
			<Stack gap={ 2 }>
				<DndContext
					sensors={ sensors }
					collisionDetection={ closestCenter }
					onDragEnd={ handleDragEnd }
				>
					<SortableContext
						items={ itinerary }
						strategy={ verticalListSortingStrategy }
					>
						{itinerary.map( renderRow )}
						{itinerary.length === 0 && (
							<Alert variant="secondary" className="mb-0">
								{t( 'configuration.itinerary.empty' )}
							</Alert>
						)}
					</SortableContext>
				</DndContext>
			</Stack>
			<Stack direction="horizontal" className="mt-3" gap={ 3 }>
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
	onDragEnd: PropTypes.func.isRequired,
	onRemove: PropTypes.func.isRequired,
};

export default Itinerary;
