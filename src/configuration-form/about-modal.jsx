import PropTypes from 'prop-types';
import React from 'react';
import Modal from 'react-bootstrap/Modal';
import { withTranslation, Trans } from 'react-i18next';

const RECALENDAR_JS_GITHUB = 'https://github.com/klimeryk/recalendar.js/';
const RECALENDAR_PHP_GITHUB = 'https://github.com/klimeryk/recalendar/';

class AboutModal extends React.PureComponent {
	link( url, children = null ) {
		return (
			<a href={ url } target="_blank" rel="noopener noreferrer">
				{children}
			</a>
		);
	}

	render() {
		const { onHide, show, t } = this.props;

		const featureComponents = {
			bold: <b />,
		};
		return (
			<Modal
				size="lg"
				show={ show }
				onHide={ onHide }
				aria-labelledby="about-modal"
				centered
			>
				<Modal.Header closeButton>
					<Modal.Title id="about-modal">{t( 'about.title' )}</Modal.Title>
				</Modal.Header>
				<Modal.Body>
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
									github: this.link( RECALENDAR_JS_GITHUB ),
								} }
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
						<li>
							{this.link( RECALENDAR_PHP_GITHUB, t( 'about.learn-more.php' ) )}
						</li>
					</ul>
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
