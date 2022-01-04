import PropTypes from 'prop-types';
import React from 'react';
import Accordion from 'react-bootstrap/Accordion';
import Badge from 'react-bootstrap/Badge';
import Stack from 'react-bootstrap/Stack';
import ToggleButton from 'react-bootstrap/ToggleButton';
import { withTranslation } from 'react-i18next';

function ToggleAccordionItem( { children, id, onToggle, t, title, toggledOn } ) {
	const label = toggledOn
		? t( 'configuration.toggle-form.enabled' )
		: t( 'configuration.toggle-form.disabled' );
	return (
		<Accordion.Item eventKey={ id }>
			<Accordion.Header>
				<Stack direction="horizontal" className="w-100">
					{title}
					<Badge
						bg={ toggledOn ? 'success' : 'secondary' }
						className="ms-auto me-3"
					>
						{label}
					</Badge>
				</Stack>
			</Accordion.Header>
			<Accordion.Body>
				<Stack>
					<ToggleButton
						className="mb-1"
						id={ id }
						type="checkbox"
						variant={ toggledOn ? 'outline-success' : 'outline-secondary' }
						checked={ toggledOn }
						onChange={ onToggle }
					>
						{label}
					</ToggleButton>
					{children}
				</Stack>
			</Accordion.Body>
		</Accordion.Item>
	);
}

ToggleAccordionItem.propTypes = {
	children: PropTypes.node.isRequired,
	id: PropTypes.string.isRequired,
	onToggle: PropTypes.func.isRequired,
	title: PropTypes.string.isRequired,
	t: PropTypes.func.isRequired,
	toggledOn: PropTypes.bool.isRequired,
};

export default withTranslation( 'app' )( ToggleAccordionItem );
