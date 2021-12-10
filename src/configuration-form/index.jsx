import { changeLanguage } from 'i18next';
import PropTypes from 'prop-types';
import React from 'react';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import { withTranslation } from 'react-i18next';

import PdfConfig from 'pdf/config';

class ConfigurationForm extends React.Component {
	handleLanguageChange = ( event ) => {
		const newLanguage = event.target.value;
		console.log( newLanguage );
		changeLanguage( newLanguage );
	};

	render() {
		const { t } = this.props;
		return (
			<Form>
				<Form.Label htmlFor="languagePicker">
					{t( 'configuration.language.label' )}
				</Form.Label>
				<Form.Select onChange={ this.handleLanguageChange }>
					<option value="en">{t( 'configuration.language.english' )}</option>
					<option value="pl">{t( 'configuration.language.polish' )}</option>
				</Form.Select>
			</Form>
		);
	}
}

ConfigurationForm.propTypes = {
	t: PropTypes.func.isRequired,
};

export default withTranslation( 'app' )( ConfigurationForm );
