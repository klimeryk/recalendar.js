import PropTypes from 'prop-types';
import React from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { withTranslation } from 'react-i18next';
import { LinkContainer } from 'react-router-bootstrap';
import { Outlet } from 'react-router-dom';

const Navigation = ( { t } ) => {
	return (
		<>
			<Navbar bg="dark" variant="dark" expand="md">
				<Container>
					<Navbar.Brand href="#home">ReCalendar</Navbar.Brand>
					<Navbar.Toggle aria-controls="basic-navbar-nav" />
					<Navbar.Collapse id="basic-navbar-nav">
						<Nav className="me-auto">
							<LinkContainer to="/">
								<Nav.Link>{t( 'navigation.home' )}</Nav.Link>
							</LinkContainer>
							<LinkContainer to="/configuration">
								<Nav.Link>{t( 'navigation.configuration' )}</Nav.Link>
							</LinkContainer>
							<LinkContainer to="/faq">
								<Nav.Link>{t( 'navigation.faq' )}</Nav.Link>
							</LinkContainer>
						</Nav>
					</Navbar.Collapse>
				</Container>
			</Navbar>
			<Outlet />
		</>
	);
};

Navigation.propTypes = {
	t: PropTypes.func.isRequired,
};

export default withTranslation( [ 'app' ] )( Navigation );
