import dayjs from 'dayjs';
import i18n, { changeLanguage } from 'i18next';
import PropTypes from 'prop-types';
import React from 'react';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import { withTranslation } from 'react-i18next';

import PdfConfig from 'pdf/config';

class ConfigurationForm extends React.Component {
	handleLanguageSelection = ( event ) => {
		const newLanguage = event.target.value;
		changeLanguage( newLanguage );
	};

	handleLanguageChange = ( newLanguage ) => {
		this.setState( { language: newLanguage } );
	};

	state = {
		language: i18n.language,
	};

	componentDidMount() {
		i18n.on( 'languageChanged', this.handleLanguageChange );
	}

	componentWillUnmount() {
		i18n.off( 'languageChanged', this.handleLanguageChange );
	}

	render() {
		const { t } = this.props;
		return (
			<Form>
				<Form.Label htmlFor="languagePicker">
					{t( 'configuration.language.label' )}
				</Form.Label>
				<Form.Select
					value={ this.state.language }
					onChange={ this.handleLanguageSelection }
				>
					<option value="en">{t( 'configuration.language.english' )}</option>
					<option value="pl">{t( 'configuration.language.polish' )}</option>
				</Form.Select>
				<Form.Label>{dayjs().format( 'dddd' )}</Form.Label>
			</Form>
		);
	}
}

ConfigurationForm.propTypes = {
	t: PropTypes.func.isRequired,
};

export default withTranslation( 'app' )( ConfigurationForm );
