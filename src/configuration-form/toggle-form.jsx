import PropTypes from 'prop-types';
import React from 'react';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Stack from 'react-bootstrap/Stack';
import { withTranslation } from 'react-i18next';

function ToggleForm( { children, id, onToggle, t, title, toggledOn } ) {
	return (
		<Card className="mt-3">
			<Card.Header>
				<Stack direction="horizontal">
					<span>{title}</span>
					<Form.Check
						id={ id }
						type="checkbox"
						label={ t( 'configuration.toggle-form.enabled' ) }
						className="ms-auto"
						checked={ toggledOn }
						onChange={ onToggle }
					/>
				</Stack>
			</Card.Header>
			<Card.Body>{children}</Card.Body>
		</Card>
	);
}

ToggleForm.propTypes = {
	children: PropTypes.node.isRequired,
	id: PropTypes.string.isRequired,
	onToggle: PropTypes.func.isRequired,
	title: PropTypes.string.isRequired,
	t: PropTypes.func.isRequired,
	toggledOn: PropTypes.bool.isRequired,
};

export default withTranslation( 'app' )( ToggleForm );
