import dayjs from 'dayjs';
import PropTypes from 'prop-types';
import React from 'react';
import Accordion from 'react-bootstrap/Accordion';
import Alert from 'react-bootstrap/Alert';
import Badge from 'react-bootstrap/Badge';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import InputGroup from 'react-bootstrap/InputGroup';
import ListGroup from 'react-bootstrap/ListGroup';
import Stack from 'react-bootstrap/Stack';
import { withTranslation } from 'react-i18next';

export const HOLIDAY_DAY_TYPE = 'holiday';
export const EVENT_DAY_TYPE = 'event';

export function isHoliday( { type } ) {
	return type === HOLIDAY_DAY_TYPE;
}
export function isEvent( { type } ) {
	return type === EVENT_DAY_TYPE;
}

export function findByDate( dateToSearchFor ) {
	return ( { date } ) => date === dateToSearchFor;
}

export const DATE_FORMAT = 'MM-DD';

class SpecialDates extends React.Component {
	state = {
		date: '',
		value: '',
		type: EVENT_DAY_TYPE,
	};

	onChange = ( event ) => {
		const { field } = event.target.dataset;
		this.setState( { [ field ]: event.target.value } );
	};

	onAddClick = ( event ) => {
		const date = dayjs( this.state.date, 'YYYY-MM-DD' );
		const key = date.format( DATE_FORMAT );
		const { value, type } = this.state;
		this.props.onAdd( { date: key, value, type } );
		this.setState( { date: '', value: '' } );
	};

	getGroupedItems() {
		return this.props.items.reduce( ( itemsSoFar, item ) => {
			if ( ! itemsSoFar[ item.date ] ) {
				itemsSoFar[ item.date ] = [];
			}
			itemsSoFar[ item.date ].push( item );
			return itemsSoFar;
		}, {} );
	}

	renderItem( groupedItems ) {
		const ItemGroup = ( key ) => {
			const { t } = this.props;
			const items = groupedItems[ key ];
			const date = dayjs( key, DATE_FORMAT );
			return (
				<ListGroup.Item key={ key }>
					<Stack direction="horizontal" gap={ 3 }>
						<b className="special-date">{date.format( 'MMMM DD' )}</b>
						<ListGroup variant="flush" className="w-100">
							{items.map( ( { id, value, type }, index ) => (
								<ListGroup.Item key={ id } className="ps-0 pe-0">
									<Stack direction="horizontal" gap={ 3 }>
										<span>
											<strong>
												{t( 'configuration.special-dates.type.' + type )}:{' '}
											</strong>
											{value}
										</span>
										{this.renderRemoveButton( id )}
									</Stack>
								</ListGroup.Item>
							) )}
						</ListGroup>
					</Stack>
				</ListGroup.Item>
			);
		};
		return ItemGroup;
	}

	renderItems( groupedItems ) {
		const keys = Object.keys( groupedItems ).sort();
		return <ListGroup>{keys.map( this.renderItem( groupedItems ) )}</ListGroup>;
	}

	renderRemoveButton( id ) {
		const { onRemove, t } = this.props;
		return (
			<Button
				className="ms-auto"
				variant="outline-danger"
				onClick={ onRemove }
				data-field="specialDates"
				data-id={ id }
			>
				{t( 'configuration.special-dates.button.remove' )}
			</Button>
		);
	}

	render() {
		const { date, value, type } = this.state;
		const { t } = this.props;
		const groupedItems = this.getGroupedItems();
		const numberOfItems = Object.keys( groupedItems ).length;
		return (
			<Accordion.Item eventKey="specialDates">
				<Accordion.Header>
					<Stack direction="horizontal" className="w-100">
						{t( 'configuration.special-dates.title' )}
						<Badge bg="info" className="ms-auto me-3">
							{numberOfItems}
						</Badge>
					</Stack>
				</Accordion.Header>
				<Accordion.Body>
					<p>{t( 'configuration.special-dates.description' )}</p>
					<Stack gap={ 2 }>
						{numberOfItems > 0 ? (
							this.renderItems( groupedItems )
						) : (
							<Alert variant="secondary" className="mb-0">
								{t( 'configuration.special-dates.empty' )}
							</Alert>
						)}
					</Stack>
					<Stack direction="horizontal" className="mt-3">
						<InputGroup>
							<Form.Select
								className="flex-grow-0 flex-basis-fit-content"
								value={ type }
								data-field="type"
								onChange={ this.onChange }
								aria-label="Default select example"
							>
								<option value={ EVENT_DAY_TYPE }>
									{t( 'configuration.special-dates.type.' + EVENT_DAY_TYPE )}
								</option>
								<option value={ HOLIDAY_DAY_TYPE }>
									{t( 'configuration.special-dates.type.' + HOLIDAY_DAY_TYPE )}
								</option>
							</Form.Select>
							<FormControl
								className="flex-grow-0 date-field"
								value={ date }
								onChange={ this.onChange }
								type="date"
								data-field="date"
							/>
							<FormControl
								placeholder={ t( 'configuration.special-dates.placeholder' ) }
								value={ value }
								onChange={ this.onChange }
								data-field="value"
							/>
							<Button
								variant="outline-secondary"
								disabled={ ! date || ! value }
								onClick={ this.onAddClick }
							>
								{t( 'configuration.special-dates.button.item' )}
							</Button>
						</InputGroup>
					</Stack>
				</Accordion.Body>
			</Accordion.Item>
		);
	}
}

SpecialDates.propTypes = {
	items: PropTypes.array.isRequired,
	onAdd: PropTypes.func.isRequired,
	onRemove: PropTypes.func.isRequired,
	t: PropTypes.func.isRequired,
};

export default withTranslation( 'app' )( SpecialDates );
