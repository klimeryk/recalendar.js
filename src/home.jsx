import PropTypes from 'prop-types';
import React from 'react';
import Container from 'react-bootstrap/Container';
import { withTranslation, Trans } from 'react-i18next';

import 'bootstrap/dist/css/bootstrap.min.css';
import './app.css';

const RECALENDAR_JS_GITHUB = 'https://github.com/klimeryk/recalendar.js/';
const RECALENDAR_PHP_GITHUB = 'https://github.com/klimeryk/recalendar/';

class Home extends React.PureComponent {
	link( url, children = null ) {
		return (
			<a href={ url } target="_blank" rel="noopener noreferrer">
				{children}
			</a>
		);
	}

	render() {
		const { t } = this.props;

		const featureComponents = {
			bold: <b />,
		};

		return (
			<Container className="mt-3">
				<h3>
					ReCalendar{' '}
					<small className="text-muted">
						Create your personalized calendar PDF for ReMarkable tablets
					</small>
				</h3>
				<p className="lead">
					<Trans
						t={ t }
						i18nKey="about.description"
						components={ {
							remarkable: this.link( 'https://remarkable.com/?ref=recalendar' ),
						} }
					/>
				</p>
				<h4>{t( 'about.features.title' )}</h4>
				<ul>
					<li>
						<Trans
							t={ t }
							i18nKey="about.features.optimized"
							components={ featureComponents }
						/>
					</li>
					<li>
						<Trans
							t={ t }
							i18nKey="about.features.navigation"
							components={ featureComponents }
						/>
					</li>
					<li>
						<Trans
							t={ t }
							i18nKey="about.features.customizable"
							components={ featureComponents }
						/>
					</li>
					<li>
						<Trans
							t={ t }
							i18nKey="about.features.localization"
							components={ featureComponents }
						/>
					</li>
				</ul>
				<h4>{t( 'about.learn-more.title' )}</h4>
				<ul>
					<li>
						{this.link( RECALENDAR_JS_GITHUB, t( 'about.learn-more.features' ) )}
					</li>
					<li>
						{this.link( RECALENDAR_JS_GITHUB, t( 'about.learn-more.source' ) )}
					</li>
					<li>{this.link( RECALENDAR_PHP_GITHUB, t( 'about.learn-more.php' ) )}</li>
				</ul>
			</Container>
		);
	}
}

Home.propTypes = {
	t: PropTypes.func.isRequired,
};

export default withTranslation( [ 'app' ] )( Home );
