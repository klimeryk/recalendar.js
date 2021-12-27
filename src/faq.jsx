import PropTypes from 'prop-types';
import React from 'react';
import Container from 'react-bootstrap/Container';
import { withTranslation, Trans } from 'react-i18next';

import 'bootstrap/dist/css/bootstrap.min.css';
import './app.css';
import ExternalLink from 'components/external-link';
import { RECALENDAR_JS_GITHUB } from 'lib/paths';

class Faq extends React.PureComponent {
	render() {
		const { t } = this.props;

		const featureComponents = {
			bold: <b />,
		};

		return (
			<Container className="mt-3">
				<h4>{t( 'about.faq.title' )}</h4>
				<ul>
					<li>
						<Trans
							t={ t }
							i18nKey="about.faq.slow"
							components={ featureComponents }
						/>
					</li>
					<li>
						<Trans
							t={ t }
							i18nKey="about.faq.issues"
							components={ {
								bold: <b />,
								github: <ExternalLink url={ RECALENDAR_JS_GITHUB } />,
							} }
						/>
					</li>
				</ul>
			</Container>
		);
	}
}

Faq.propTypes = {
	t: PropTypes.func.isRequired,
};

export default withTranslation( [ 'app' ] )( Faq );
