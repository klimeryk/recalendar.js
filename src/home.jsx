import PropTypes from 'prop-types';
import React from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import { withTranslation, Trans } from 'react-i18next';
import { LinkContainer } from 'react-router-bootstrap';

import 'bootstrap/dist/css/bootstrap.min.css';
import './app.css';

import ExternalLink from 'components/external-link';
import {
	RECALENDAR_JS_GITHUB,
	RECALENDAR_PHP_GITHUB,
	CONFIGURATOR_PATH,
	FEATURES_PATH,
} from 'lib/paths';

class Home extends React.PureComponent {
	render() {
		const { t } = this.props;

		const featureComponents = {
			bold: <b />,
		};

		return (
			<Container className="mt-3">
				<Row>
					<Col>
						<div className="bg-light p-5 rounded-3 my-3">
							<h1 className="display-5">ReCalendar</h1>
							<p className="lead">
								Create your personalized calendar PDF for ReMarkable tablets
							</p>
							<p>
								<Trans
									t={ t }
									i18nKey="about.description"
									components={ {
										remarkable: (
											<ExternalLink url="https://remarkable.com/?ref=recalendar" />
										),
									} }
								/>
							</p>
							<LinkContainer to={ CONFIGURATOR_PATH }>
								<Button size="lg">Create your own for free now!</Button>
							</LinkContainer>
						</div>
					</Col>
				</Row>
				<Row>
					<Col md>
						<div className="bg-light p-5 rounded-3 my-3">
							<h2>{t( 'about.features.title' )}</h2>
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
							<LinkContainer to={ FEATURES_PATH }>
								<Button size="lg" variant="secondary">
									See all the features
								</Button>
							</LinkContainer>
						</div>
					</Col>
					<Col md>
						<div className="bg-light p-5 rounded-3 my-3">
							<h3>{t( 'about.learn-more.title' )}</h3>
							<ul>
								<li>
									<ExternalLink url={ RECALENDAR_JS_GITHUB }>
										{t( 'about.learn-more.features' )}
									</ExternalLink>
								</li>
								<li>
									<ExternalLink url={ RECALENDAR_JS_GITHUB }>
										{t( 'about.learn-more.source' )}
									</ExternalLink>
								</li>
								<li>
									<ExternalLink url={ RECALENDAR_PHP_GITHUB }>
										{t( 'about.learn-more.php' )}
									</ExternalLink>
								</li>
							</ul>
						</div>
					</Col>
				</Row>
				<Row>
					<Col>
						<footer className="mb-3">
							<div className="text-muted text-center">
								Created by{' '}
								<ExternalLink url="https://klimer.eu/">
									Igor Klimer
								</ExternalLink>
								.
							</div>
						</footer>
					</Col>
				</Row>
			</Container>
		);
	}
}

Home.propTypes = {
	t: PropTypes.func.isRequired,
};

export default withTranslation( [ 'app' ] )( Home );
