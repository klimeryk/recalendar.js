import PropTypes from 'prop-types';
import React from 'react';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import { withTranslation } from 'react-i18next';

class PasswordSettings extends React.PureComponent {
  state = {
    isPasswordVisible: false,
  };

  handleVisibilityToggle = () => {
    this.setState(({ isPasswordVisible }) => ({ isPasswordVisible: !isPasswordVisible }));
  };

  render() {
    const { password, isPasswordEnabledInPreview, onChange, t } = this.props;
    const { isPasswordVisible } = this.state;
    const hasPassword = password.length > 0;
    return (
      <Card className="mt-3">
        <Card.Header>{t('configuration.general.password.title')}</Card.Header>
        <Card.Body>
          <p className="text-muted small mb-0">{t('configuration.general.password.description')}</p>
          <Form.Group controlId="password">
            <Form.Label>{t('configuration.general.password.label')}</Form.Label>
            <InputGroup>
              <Form.Control
                type={isPasswordVisible ? 'text' : 'password'}
                autoComplete="new-password"
                value={password}
                onChange={onChange}
              />
              <Button variant="outline-secondary" onClick={this.handleVisibilityToggle}>
                {isPasswordVisible
                  ? t('configuration.general.password.hide')
                  : t('configuration.general.password.show')}
              </Button>
            </InputGroup>
          </Form.Group>
          {hasPassword && (
            <Alert variant="warning" className="mt-2 mb-0">
              {t('configuration.general.password.warning')}
            </Alert>
          )}
          {hasPassword && (
            <Form.Group controlId="isPasswordEnabledInPreview" className="mt-2">
              <Form.Check
                label={t('configuration.general.password.preview.label')}
                type="checkbox"
                checked={isPasswordEnabledInPreview}
                value={isPasswordEnabledInPreview}
                onChange={onChange}
              />
              <Form.Text className="text-muted">{t('configuration.general.password.preview.description')}</Form.Text>
            </Form.Group>
          )}
        </Card.Body>
      </Card>
    );
  }
}

PasswordSettings.propTypes = {
  password: PropTypes.string.isRequired,
  isPasswordEnabledInPreview: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
};

export default withTranslation('app')(PasswordSettings);
