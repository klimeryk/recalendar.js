import PropTypes from 'prop-types';
import React from 'react';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import { withTranslation } from 'react-i18next';

import { AVAILABLE_DEVICES, CUSTOM } from '~/lib/device-utils';
import { AVAILABLE_SIDEBAR_POSITIONS } from '~/lib/sidebar-utils';
import { AVAILABLE_FONTS } from '~/pdf/lib/fonts';

class DeviceSettings extends React.PureComponent {
  renderDevices() {
    return AVAILABLE_DEVICES.map((device) => (
      <option key={device} value={device}>
        {device}
      </option>
    ));
  }

  renderFonts() {
    return AVAILABLE_FONTS.map((font) => (
      <option key={font} value={font}>
        {font}
      </option>
    ));
  }

  renderSidebarPositions() {
    const { t } = this.props;
    return AVAILABLE_SIDEBAR_POSITIONS.map((position) => (
      <option key={position} value={position}>
        {t(`configuration.general.sidebar.position.${position}`)}
      </option>
    ));
  }

  render() {
    const {
      device,
      dpi,
      pageSize,
      fontFamily,
      isLeftHanded,
      sidebarPosition,
      sidebarOffset,
      onChange,
      onSidebarToggle,
      t,
    } = this.props;
    const isCustomDevice = device === CUSTOM;
    const isSidebarEnabled = sidebarOffset > 0;
    return (
      <>
        <Form.Group controlId="device">
          <Form.Label>{t('configuration.general.device')}</Form.Label>
          <Form.Select value={device} onChange={onChange}>
            {this.renderDevices()}
          </Form.Select>
        </Form.Group>
        {isCustomDevice && (
          <Form.Group controlId="dpi">
            <Form.Label>{t('configuration.general.dpi')}</Form.Label>
            <Form.Control type="number" value={dpi} onChange={onChange} />
          </Form.Group>
        )}
        {isCustomDevice && (
          <Form.Group>
            <Form.Label htmlFor="resolutionX">{t('configuration.general.resolution')}</Form.Label>
            <InputGroup>
              <Form.Control id="resolutionX" type="number" value={pageSize[0]} onChange={onChange} />
              <InputGroup.Text>x</InputGroup.Text>
              <Form.Control id="resolutionY" type="number" value={pageSize[1]} onChange={onChange} />
            </InputGroup>
          </Form.Group>
        )}
        <Form.Group controlId="fontFamily">
          <Form.Label>{t('configuration.general.font')}</Form.Label>
          <Form.Select value={fontFamily} onChange={onChange}>
            {this.renderFonts()}
          </Form.Select>
        </Form.Group>
        <Form.Group controlId="isLeftHanded" className="mt-2">
          <Form.Check
            label={t('configuration.general.left-handed.label')}
            type="checkbox"
            checked={isLeftHanded}
            value={isLeftHanded}
            onChange={onChange}
          />
          <Form.Text className="text-muted">{t('configuration.general.left-handed.description')}</Form.Text>
        </Form.Group>
        <Form.Group controlId="isSidebarEnabled" className="mt-2">
          <Form.Check
            label={t('configuration.general.sidebar.label')}
            type="checkbox"
            checked={isSidebarEnabled}
            value={isSidebarEnabled}
            onChange={onSidebarToggle}
          />
          <Form.Text className="text-muted">{t('configuration.general.sidebar.description')}</Form.Text>
        </Form.Group>
        {isSidebarEnabled && (
          <Form.Group controlId="sidebarPosition">
            <Form.Label>{t('configuration.general.sidebar.position.label')}</Form.Label>
            <Form.Select value={sidebarPosition} onChange={onChange}>
              {this.renderSidebarPositions()}
            </Form.Select>
          </Form.Group>
        )}
        {isSidebarEnabled && (
          <Form.Group controlId="sidebarOffset">
            <Form.Label>{t('configuration.general.sidebar.offset.label')}</Form.Label>
            <Form.Control type="number" value={sidebarOffset} onChange={onChange} />
            <Form.Text className="text-muted">{t('configuration.general.sidebar.offset.description')}</Form.Text>
          </Form.Group>
        )}
      </>
    );
  }
}

DeviceSettings.propTypes = {
  device: PropTypes.string.isRequired,
  dpi: PropTypes.number.isRequired,
  pageSize: PropTypes.array.isRequired,
  fontFamily: PropTypes.string.isRequired,
  isLeftHanded: PropTypes.bool.isRequired,
  sidebarPosition: PropTypes.string.isRequired,
  sidebarOffset: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
  onSidebarToggle: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
};

export default withTranslation('app')(DeviceSettings);
