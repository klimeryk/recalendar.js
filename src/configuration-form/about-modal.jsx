import PropTypes from 'prop-types';
import React from 'react';
import Modal from 'react-bootstrap/Modal';
import { withTranslation } from 'react-i18next';

class AboutModal extends React.PureComponent {
	render() {
		const { onHide, show } = this.props;
		return (
			<Modal
				size="lg"
				show={ show }
				onHide={ onHide }
				aria-labelledby="about-modal"
				centered
			>
				<Modal.Header closeButton>
					<Modal.Title id="about-modal">About ReCalendar</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<h4>Centered Modal</h4>
					<p>
						Cras mattis consectetur purus sit amet fermentum. Cras justo odio,
						dapibus ac facilisis in, egestas eget quam. Morbi leo risus, porta
						ac consectetur ac, vestibulum at eros.
					</p>
				</Modal.Body>
			</Modal>
		);
	}
}

AboutModal.propTypes = {
	onHide: PropTypes.func.isRequired,
	show: PropTypes.bool.isRequired,
	t: PropTypes.func.isRequired,
};

export default withTranslation( [ 'app' ] )( AboutModal );
