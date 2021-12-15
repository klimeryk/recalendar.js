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

class ItemsList extends React.Component {
	handleItemChange = ( event ) => {
		this.props.onChange(
			this.props.name,
			event.target.dataset.index,
			event.target.value,
		);
	};

	handleRemove = ( event ) => {
		this.props.onRemove( this.props.name, event.target.dataset.index );
	};

	handleAddItem = () => {
		this.props.onAdd( this.props.name );
	};

	renderItem = ( item, index ) => {
		const { t } = this.props;
		return (
			<InputGroup key={ index }>
				<FormControl
					placeholder={ t( 'configuration.items-list.placeholder' ) }
					value={ item }
					onChange={ this.handleItemChange }
					data-index={ index }
					required
				/>
				{this.renderRemoveButton( index )}
			</InputGroup>
		);
	};

	renderRemoveButton( index ) {
		const { t } = this.props;
		return (
			<Button
				variant="outline-danger"
				onClick={ this.handleRemove }
				data-index={ index }
			>
				{t( 'configuration.items-list.button.remove' )}
			</Button>
		);
	}

	render() {
		const { items, t, title } = this.props;
		return (
			<Accordion className="mt-3" defaultActiveKey="0">
				<Accordion.Item eventKey="0">
					<Accordion.Header>{title}</Accordion.Header>
					<Accordion.Body>
						<Stack gap={ 2 }>
							{items.map( this.renderItem )}
							{items.length === 0 && (
								<Alert variant="secondary" className="mb-0">
									{t( 'configuration.items-list.empty' )}
								</Alert>
							)}
						</Stack>
						<Stack direction="horizontal" className="mt-3">
							<Button variant="outline-secondary" onClick={ this.handleAddItem }>
								{t( 'configuration.items-list.button.item' )}
							</Button>
						</Stack>
					</Accordion.Body>
				</Accordion.Item>
			</Accordion>
		);
	}
}

ItemsList.propTypes = {
	name: PropTypes.string.isRequired,
	items: PropTypes.array.isRequired,
	onAdd: PropTypes.func.isRequired,
	onChange: PropTypes.func.isRequired,
	onRemove: PropTypes.func.isRequired,
	t: PropTypes.func.isRequired,
	title: PropTypes.string.isRequired,
};

export default withTranslation( 'app' )( ItemsList );
