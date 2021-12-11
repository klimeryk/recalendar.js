import dayjs from 'dayjs';
import PropTypes from 'prop-types';
import React from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import InputGroup from 'react-bootstrap/InputGroup';
import Row from 'react-bootstrap/Row';
import Stack from 'react-bootstrap/Stack';
import { withTranslation } from 'react-i18next';

import PdfConfig from 'pdf/config';

class Itinerary extends React.Component {
	render() {
		return (
			<Card className="mt-3">
				<Card.Header>Itinerary</Card.Header>
				<Card.Body>
					<Stack gap={ 2 }>
						<InputGroup>
							<FormControl placeholder="Itinerary item" />
							<Button variant="outline-danger">Remove</Button>
						</InputGroup>
						<InputGroup>
							<FormControl
								placeholder="Number of lines"
								type="number"
								min={ 1 }
								max={ 50 }
							/>
							<Button variant="outline-danger">Remove</Button>
						</InputGroup>
					</Stack>
					<Stack direction="horizontal" className="mt-3" gap={ 3 }>
						<Button variant="outline-secondary">Add itinerary item</Button>
						<Button variant="outline-secondary">Add empty lines</Button>
					</Stack>
				</Card.Body>
			</Card>
		);
	}
}

Itinerary.propTypes = {
	t: PropTypes.func.isRequired,
};

export default withTranslation( 'app' )( Itinerary );
