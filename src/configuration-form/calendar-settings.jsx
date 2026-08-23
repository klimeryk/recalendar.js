import dayjs from 'dayjs/esm';
import PropTypes from 'prop-types';
import React from 'react';
import Form from 'react-bootstrap/Form';
import ListGroup from 'react-bootstrap/ListGroup';
import { withTranslation } from 'react-i18next';

import { getWeekdays } from '~/lib/date';

class CalendarSettings extends React.PureComponent {
  renderMonths() {
    return dayjs
      .localeData()
      .months()
      .map((month, index) => (
        <option key={month} value={index}>
          {month}
        </option>
      ));
  }

  renderDaysOfWeek() {
    return getWeekdays(this.props.firstDayOfWeek).map(({ full, index }) => (
      <option key={full} value={index}>
        {full}
      </option>
    ));
  }

  renderWeekendSelection() {
    const { firstDayOfWeek, weekendDays, onWeekendChange } = this.props;
    return getWeekdays(firstDayOfWeek).map(({ full, index }) => (
      <ListGroup.Item key={full} value={index}>
        <Form.Check
          id={'weekend-' + index}
          type="checkbox"
          label={full}
          data-index={index}
          checked={weekendDays.includes(index)}
          onChange={onWeekendChange}
        />
      </ListGroup.Item>
    ));
  }

  render() {
    const { year, month, firstDayOfWeek, monthCount, onChange, t } = this.props;
    return (
      <>
        <Form.Group controlId="year">
          <Form.Label>{t('configuration.general.year')}</Form.Label>
          <Form.Control type="number" value={year} onChange={onChange} />
        </Form.Group>
        <Form.Group controlId="month">
          <Form.Label>{t('configuration.general.starting-month.label')}</Form.Label>
          <Form.Select value={month} onChange={onChange} data-type="number">
            {this.renderMonths()}
          </Form.Select>
          <Form.Text className="text-muted">{t('configuration.general.starting-month.description')}</Form.Text>
        </Form.Group>
        <Form.Group controlId="firstDayOfWeek">
          <Form.Label>{t('configuration.general.first-day-of-week')}</Form.Label>
          <Form.Select value={firstDayOfWeek} onChange={onChange} data-type="number">
            {this.renderDaysOfWeek()}
          </Form.Select>
        </Form.Group>
        <Form.Group controlId="monthCount">
          <Form.Label>{t('configuration.general.month-count.label')}</Form.Label>
          <Form.Control type="number" value={monthCount} onChange={onChange} min={1} max={12} />
          <Form.Text className="text-muted">{t('configuration.general.month-count.description')}</Form.Text>
        </Form.Group>
        <Form.Label>{t('configuration.general.weekend')}</Form.Label>
        <ListGroup>{this.renderWeekendSelection()}</ListGroup>
      </>
    );
  }
}

CalendarSettings.propTypes = {
  year: PropTypes.number.isRequired,
  month: PropTypes.number.isRequired,
  firstDayOfWeek: PropTypes.number.isRequired,
  monthCount: PropTypes.number.isRequired,
  weekendDays: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired,
  onWeekendChange: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
};

export default withTranslation('app')(CalendarSettings);
