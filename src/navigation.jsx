import i18n, { changeLanguage } from 'i18next';
import PropTypes from 'prop-types';
import React from 'react';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Stack from 'react-bootstrap/Stack';
import { withTranslation } from 'react-i18next';
import { LinkContainer } from 'react-router-bootstrap';
import { Outlet } from 'react-router-dom';

class Navigation extends React.Component {
	state = {
		language: i18n.language,
	};

	componentDidMount() {
		i18n.on( 'languageChanged', this.handleLanguageChange );
	}

	componentWillUnmount() {
		i18n.off( 'languageChanged', this.handleLanguageChange );
	}

	handleLanguageSelection = ( event ) => {
		const newLanguage = event.target.value;
		changeLanguage( newLanguage );
	};

	handleLanguageChange = ( newLanguage ) => {
		this.setState( { language: newLanguage } );
	};

	render() {
		const { t } = this.props;
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
							<Stack direction="horizontal">
								<Form.Label
									column
									className="text-light me-3"
									htmlFor="languagePicker"
								>
									{t( 'configuration.language.label' )}
								</Form.Label>
								<Form.Select
									aria-label={ t( 'configuration.language.label' ) }
									className="language-select"
									value={ this.state.language }
									onChange={ this.handleLanguageSelection }
								>
									<option value="en">
										{t( 'configuration.language.english' )}
									</option>
									<option value="pl">
										{t( 'configuration.language.polish' )}
									</option>
								</Form.Select>
							</Stack>
						</Navbar.Collapse>
					</Container>
				</Navbar>
				<Outlet />
			</>
		);
	}
}

Navigation.propTypes = {
	t: PropTypes.func.isRequired,
};

export default withTranslation( [ 'app' ] )( Navigation );
