import PropTypes from 'prop-types';
import React from 'react';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import { withTranslation } from 'react-i18next';

import { BLANK, DOT_GRID, GRID, LINE_STYLES } from '~/lib/line-styles';

class LineSettings extends React.PureComponent {
	renderLineStyle() {
		const { t } = this.props;
		return LINE_STYLES.map( ( style ) => (
			<option key={ style } value={ style }>
				{t( `configuration.general.line-style.${ style }` )}
			</option>
		) );
	}

	render() {
		const {
			lineStyle,
			lineHeightPixels,
			lineSpacingPixels,
			lineOpacity,
			onChange,
			t,
		} = this.props;
		const hasSpacing = lineStyle === GRID || lineStyle === DOT_GRID;
		const hasOpacity = lineStyle !== BLANK;
		return (
			<Card className="mt-3">
				<Card.Header>{t( 'configuration.general.lines.title' )}</Card.Header>
				<Card.Body>
					<p className="text-muted small mb-0">
						{t( 'configuration.general.lines.description' )}
					</p>
					<Form.Group controlId="lineStyle">
						<Form.Label>
							{t( 'configuration.general.line-style.label' )}
						</Form.Label>
						<Form.Select value={ lineStyle } onChange={ onChange }>
							{this.renderLineStyle()}
						</Form.Select>
						<Form.Text className="text-muted">
							{t( 'configuration.general.line-style.description' )}
						</Form.Text>
					</Form.Group>
					<Form.Group controlId="lineHeightPixels">
						<Form.Label>
							{t( 'configuration.general.line-height.label' )}
						</Form.Label>
						<InputGroup>
							<Form.Control
								type="number"
								value={ lineHeightPixels }
								onChange={ onChange }
								min={ 8 }
								max={ 60 }
							/>
							<InputGroup.Text>px</InputGroup.Text>
						</InputGroup>
						<Form.Text className="text-muted">
							{t( 'configuration.general.line-height.description' )}
						</Form.Text>
					</Form.Group>
					{hasSpacing && <Form.Group controlId="lineSpacingPixels">
						<Form.Label>
							{t( 'configuration.general.line-spacing.label' )}
						</Form.Label>
						<InputGroup>
							<Form.Control
								type="number"
								value={ lineSpacingPixels }
								onChange={ onChange }
								min={ 0 }
								max={ 60 }
								step={ 0.1 }
							/>
							<InputGroup.Text>px</InputGroup.Text>
						</InputGroup>
						<Form.Text className="text-muted">
							{t( 'configuration.general.line-spacing.description' )}
						</Form.Text>
					</Form.Group>}
					{hasOpacity && <Form.Group controlId="lineOpacity">
						<Form.Label>
							{t( 'configuration.general.line-opacity.label' )}
						</Form.Label>
						<InputGroup>
							<Form.Control
								type="number"
								value={ lineOpacity }
								onChange={ onChange }
								min={ 0 }
								max={ 100 }
							/>
							<InputGroup.Text>%</InputGroup.Text>
						</InputGroup>
						<Form.Text className="text-muted">
							{t( 'configuration.general.line-opacity.description' )}
						</Form.Text>
					</Form.Group>}
				</Card.Body>
			</Card>
		);
	}
}

LineSettings.propTypes = {
	lineStyle: PropTypes.string.isRequired,
	lineHeightPixels: PropTypes.number.isRequired,
	lineSpacingPixels: PropTypes.number.isRequired,
	lineOpacity: PropTypes.number.isRequired,
	onChange: PropTypes.func.isRequired,
	t: PropTypes.func.isRequired,
};

export default withTranslation( 'app' )( LineSettings );
