import dayjs from 'dayjs';
import PropTypes from 'prop-types';
import React from 'react';
import Accordion from 'react-bootstrap/Accordion';
import Alert from 'react-bootstrap/Alert';
import Badge from 'react-bootstrap/Badge';
import Button from 'react-bootstrap/Button';
import FormControl from 'react-bootstrap/FormControl';
import InputGroup from 'react-bootstrap/InputGroup';
import ListGroup from 'react-bootstrap/ListGroup';
import Stack from 'react-bootstrap/Stack';
import { withTranslation } from 'react-i18next';

const DATE_FORMAT = 'DD-MM';

class SpecialDates extends React.Component {
	state = {
		date: '',
		value: '',
	};

	onChange = ( event ) => {
		const { field } = event.target.dataset;
		this.setState( { [ field ]: event.target.value } );
	};

	onAddClick = ( event ) => {
		const date = dayjs( this.state.date, 'YYYY-MM-DD' );
		const key = date.format( DATE_FORMAT );
		this.props.onAdd( key, this.state.value );
		this.setState( { date: '', value: '' } );
	};

	renderItem = ( key ) => {
		const values = this.props.items[ key ];
		const date = dayjs( key, DATE_FORMAT );
		return (
			<ListGroup.Item key={ key }>
				<Stack direction="horizontal" gap={ 3 }>
					<b className="special-date">{date.format( 'MMMM DD' )}</b>
					<div>
						{values.map( ( value, index ) => (
							<div key={ key + index }>{value}</div>
						) )}
					</div>
					{this.renderRemoveButton( key )}
				</Stack>
			</ListGroup.Item>
		);
	};

	renderItems( items ) {
		return <ListGroup>{items.map( this.renderItem )}</ListGroup>;
	}

	renderRemoveButton( key ) {
		const { onRemove, t } = this.props;
		return (
			<Button
				className="ms-auto"
				variant="outline-danger"
				onClick={ onRemove }
				data-key={ key }
			>
				{t( 'configuration.special-dates.button.remove' )}
			</Button>
		);
	}

	render() {
		const { date, value } = this.state;
		const { items, t } = this.props;
		const keys = Object.keys( items );
		return (
			<Accordion.Item eventKey="specialDates">
				<Accordion.Header>
					<Stack direction="horizontal" className="w-100">
						{t( 'configuration.special-dates.title' )}
						<Badge bg="info" className="ms-auto me-3">
							{keys.length}
						</Badge>
					</Stack>
				</Accordion.Header>
				<Accordion.Body>
					<p>{t( 'configuration.special-dates.description' )}</p>
					<Stack gap={ 2 }>
						{keys ? (
							this.renderItems( keys )
						) : (
							<Alert variant="secondary" className="mb-0">
								{t( 'configuration.special-dates.empty' )}
							</Alert>
						)}
					</Stack>
					<Stack direction="horizontal" className="mt-3">
						<InputGroup>
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
	items: PropTypes.object.isRequired,
	onAdd: PropTypes.func.isRequired,
	onRemove: PropTypes.func.isRequired,
	t: PropTypes.func.isRequired,
};

export default withTranslation( 'app' )( SpecialDates );
