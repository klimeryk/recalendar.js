import dayjs from 'dayjs/esm';
import ICAL from 'ical.js';
import PropTypes from 'prop-types';
import React from 'react';
import Accordion from 'react-bootstrap/Accordion';
import Alert from 'react-bootstrap/Alert';
import Badge from 'react-bootstrap/Badge';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import InputGroup from 'react-bootstrap/InputGroup';
import ListGroup from 'react-bootstrap/ListGroup';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Stack from 'react-bootstrap/Stack';
import Tooltip from 'react-bootstrap/Tooltip';
import { Trans, withTranslation } from 'react-i18next';

import { fetchCountries, fetchHolidays } from '~/lib/holidays-api';
import {
  DATE_FORMAT,
  EVENT_DAY_TYPE,
  formatYearRange,
  getDedupeKey,
  getSpannedYears,
  HOLIDAY_DAY_TYPE,
} from '~/lib/special-dates-utils';

const STATUS_EMPTY = 'EMPTY';
const STATUS_LOADING = 'LOADING';
const STATUS_ERROR = 'ERROR';
const STATUS_SUCCESS = 'SUCCESS';
const STATUS_YEAR_UNAVAILABLE = 'YEAR_UNAVAILABLE';

const ENGLISH_NAME = 'name';
const LOCAL_NAME = 'local_name';

// Disable strict mode for ical.js to allow slightly invalid ics files.
ICAL.design.strict = false;

class SpecialDates extends React.PureComponent {
  state = {
    date: '',
    value: '',
    type: EVENT_DAY_TYPE,
    icalType: EVENT_DAY_TYPE,
    status: STATUS_EMPTY,
    countries: [],
    yearsCovered: [],
    countriesStatus: STATUS_EMPTY,
    selectedCountry: '',
    nameLanguage: ENGLISH_NAME,
    deduplicate: true,
    holidaysStatus: STATUS_EMPTY,
    holidaysResult: { added: 0, skipped: 0, country: '' },
  };

  componentDidMount() {
    this.loadCountries();
  }

  onChange = (event) => {
    const { field } = event.target.dataset;
    this.setState({ [field]: event.target.value });
  };

  onDeduplicateChange = (event) => {
    this.setState({ deduplicate: event.target.checked });
  };

  loadCountries = () => {
    const { countriesStatus } = this.state;
    if (countriesStatus === STATUS_LOADING || countriesStatus === STATUS_SUCCESS) {
      return;
    }

    this.setState({ countriesStatus: STATUS_LOADING });
    fetchCountries()
      .then(({ countries, yearsCovered }) => {
        this.setState({
          countries,
          yearsCovered,
          countriesStatus: STATUS_SUCCESS,
        });
      })
      .catch(() => {
        this.setState({ countriesStatus: STATUS_ERROR });
      });
  };

  onImportHolidays = async () => {
    const { year, month, monthCount } = this.props;
    const { selectedCountry, nameLanguage, deduplicate, yearsCovered, countries } = this.state;

    const spannedYears = getSpannedYears({
      year: Number(year),
      month: Number(month),
      monthCount: Number(monthCount),
    });
    const targetYears = spannedYears.filter((y) => yearsCovered.includes(y));
    if (targetYears.length === 0) {
      this.setState({ holidaysStatus: STATUS_YEAR_UNAVAILABLE });
      return;
    }

    this.setState({ holidaysStatus: STATUS_LOADING });
    try {
      const holidayLists = await Promise.all(targetYears.map((y) => fetchHolidays(selectedCountry, y)));
      const seen = new Set(this.props.items.map(getDedupeKey));
      let added = 0;
      let skipped = 0;
      holidayLists.flat().forEach((holiday) => {
        const date = holiday.date.slice(5);
        const holidayName = holiday.name;
        const value = nameLanguage === LOCAL_NAME ? holiday.local_name || holiday.name : holiday.name;
        const key = getDedupeKey({ date, holidayName });
        if (deduplicate && seen.has(key)) {
          skipped++;
          return;
        }

        seen.add(key);
        this.props.onAdd({ date, value, type: HOLIDAY_DAY_TYPE, holidayName });
        added++;
      });

      const country = countries.find((c) => c.code === selectedCountry);
      this.setState({
        holidaysStatus: STATUS_SUCCESS,
        holidaysResult: {
          added,
          skipped,
          country: country ? country.name : selectedCountry,
        },
      });
    } catch {
      this.setState({ holidaysStatus: STATUS_ERROR });
    }
  };

  onAddClick = () => {
    const date = dayjs(this.state.date, 'YYYY-MM-DD');
    const key = date.format(DATE_FORMAT);
    const { value, type } = this.state;
    this.props.onAdd({ date: key, value, type });
    this.setState({ date: '', value: '' });
  };

  onFileLoad = (event) => {
    try {
      const jcalData = ICAL.parse(event.target.result);
      const vcalendar = new ICAL.Component(jcalData);
      const vevents = vcalendar.getAllSubcomponents('vevent');
      vevents.forEach((vevent) => {
        const ev = new ICAL.Event(vevent);
        const startDate = dayjs(ev.startDate.toJSDate());
        const value = ev.summary;
        if (ev.isRecurring()) {
          const iter = ev.iterator();
          for (let next = iter.next(); next; next = iter.next()) {
            if (next.year < this.props.year) {
              continue;
            } else if (next.year > this.props.year) {
              break;
            }
            const date = dayjs(next.toJSDate());
            const key = date.format(DATE_FORMAT);
            this.props.onAdd({ date: key, value, type: this.state.icalType });
          }
        } else if (startDate.year() === this.props.year) {
          const key = startDate.format(DATE_FORMAT);
          this.props.onAdd({ date: key, value, type: this.state.icalType });
        }
      });

      this.setState({
        status: STATUS_SUCCESS,
      });
    } catch {
      this.setState({
        status: STATUS_ERROR,
      });
    }
  };

  onFileChange = (event) => {
    this.setState({
      status: STATUS_LOADING,
    });

    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = this.onFileLoad;

    reader.readAsText(file);
  };

  getGroupedItems() {
    return this.props.items.reduce((itemsSoFar, item) => {
      if (!itemsSoFar[item.date]) {
        itemsSoFar[item.date] = [];
      }
      itemsSoFar[item.date].push(item);
      return itemsSoFar;
    }, {});
  }

  renderItem(groupedItems) {
    const ItemGroup = (key) => {
      const { t } = this.props;
      const items = groupedItems[key];
      const date = dayjs(key, DATE_FORMAT);
      return (
        <ListGroup.Item key={key}>
          <Stack direction="horizontal" gap={3}>
            <b className="special-date">{date.format('MMMM DD')}</b>
            <ListGroup variant="flush" className="w-100">
              {items.map(({ id, value, type }) => (
                <ListGroup.Item key={id} className="ps-0 pe-0">
                  <Stack direction="horizontal" gap={3}>
                    <span>
                      <strong>{t('configuration.special-dates.type.' + type)}: </strong>
                      {value}
                    </span>
                    {this.renderRemoveButton(id)}
                  </Stack>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Stack>
        </ListGroup.Item>
      );
    };
    return ItemGroup;
  }

  renderItems(groupedItems) {
    const keys = Object.keys(groupedItems).sort();
    return <ListGroup>{keys.map(this.renderItem(groupedItems))}</ListGroup>;
  }

  renderRemoveButton(id) {
    const { onRemove, t } = this.props;
    return (
      <Button className="ms-auto" variant="outline-danger" onClick={onRemove} data-field="specialDates" data-id={id}>
        {t('configuration.special-dates.button.remove')}
      </Button>
    );
  }

  renderStatusMessage() {
    const { t } = this.props;

    switch (this.state.status) {
      case STATUS_LOADING:
        return (
          <Alert variant="info" className="mt-2 mb-0">
            {t('configuration.special-dates.upload.loading')}
          </Alert>
        );

      case STATUS_ERROR:
        return (
          <Alert variant="danger" className="mt-2 mb-0">
            {t('configuration.special-dates.upload.error')}
          </Alert>
        );

      case STATUS_SUCCESS:
        return (
          <Alert variant="success" className="mt-2 mb-0">
            {t('configuration.special-dates.upload.success')}
          </Alert>
        );

      case STATUS_EMPTY:
      default:
        return null;
    }
  }

  renderTypeSelect = (field) => {
    const { t } = this.props;
    const { [field]: value } = this.state;

    return (
      <Form.Select
        className="flex-grow-0 flex-basis-fit-content"
        value={value}
        data-field={field}
        onChange={this.onChange}
        aria-label="Default select example"
      >
        <option value={EVENT_DAY_TYPE}>{t('configuration.special-dates.type.' + EVENT_DAY_TYPE)}</option>
        <option value={HOLIDAY_DAY_TYPE}>{t('configuration.special-dates.type.' + HOLIDAY_DAY_TYPE)}</option>
      </Form.Select>
    );
  };

  renderHolidaysStatus() {
    const { t } = this.props;
    const { holidaysStatus, holidaysResult, yearsCovered } = this.state;

    switch (holidaysStatus) {
      case STATUS_LOADING:
        return (
          <Alert variant="info" className="mt-2 mb-0">
            {t('configuration.special-dates.holidays.loading')}
          </Alert>
        );

      case STATUS_ERROR:
        return (
          <Alert variant="danger" className="mt-2 mb-0">
            {t('configuration.special-dates.holidays.error')}
          </Alert>
        );

      case STATUS_YEAR_UNAVAILABLE:
        return (
          <Alert variant="warning" className="mt-2 mb-0">
            {t('configuration.special-dates.holidays.year-unavailable', {
              years: yearsCovered.join(', '),
            })}
          </Alert>
        );

      case STATUS_SUCCESS: {
        const { added, skipped, country } = holidaysResult;
        const message = t('configuration.special-dates.holidays.success', {
          count: added,
          country,
        });
        const skippedMessage =
          skipped > 0 ? ' ' + t('configuration.special-dates.holidays.skipped', { count: skipped }) : '';
        return (
          <Alert variant="success" className="mt-2 mb-0">
            {message}
            {skippedMessage}
          </Alert>
        );
      }

      case STATUS_EMPTY:
      default:
        return null;
    }
  }

  renderHolidaysSection() {
    const { t, year, month, monthCount } = this.props;
    const { countries, countriesStatus, selectedCountry, nameLanguage, deduplicate, holidaysStatus } = this.state;

    const spannedYears = getSpannedYears({
      year: Number(year),
      month: Number(month),
      monthCount: Number(monthCount),
    });
    const isLoadingCountries = countriesStatus === STATUS_LOADING;

    return (
      <Stack className="mt-4">
        <Form.Label className="fw-bold mb-1">{t('configuration.special-dates.holidays.heading')}</Form.Label>
        <p className="text-muted small mb-2">
          {t('configuration.special-dates.holidays.description', {
            count: spannedYears.length,
            years: formatYearRange(spannedYears),
          })}
        </p>
        <InputGroup className="justify-content-end">
          <Form.Select
            value={selectedCountry}
            data-field="selectedCountry"
            onChange={this.onChange}
            onFocus={this.loadCountries}
            disabled={isLoadingCountries}
          >
            <option value="">
              {isLoadingCountries
                ? t('configuration.special-dates.holidays.countries-loading')
                : t('configuration.special-dates.holidays.country-placeholder')}
            </option>
            {countries.map((country) => (
              <option key={country.code} value={country.code}>
                {country.name}
              </option>
            ))}
          </Form.Select>
          <Form.Select
            className="flex-grow-0 flex-basis-fit-content"
            value={nameLanguage}
            data-field="nameLanguage"
            onChange={this.onChange}
          >
            <option value={ENGLISH_NAME}>{t('configuration.special-dates.holidays.names.english')}</option>
            <option value={LOCAL_NAME}>{t('configuration.special-dates.holidays.names.local')}</option>
          </Form.Select>
          <InputGroup.Text className="gap-2">
            <Form.Check
              className="mb-0"
              id="deduplicateHolidays"
              type="checkbox"
              label={t('configuration.special-dates.holidays.deduplicate.label')}
              checked={deduplicate}
              onChange={this.onDeduplicateChange}
            />
            <OverlayTrigger
              placement="top"
              overlay={<Tooltip>{t('configuration.special-dates.holidays.deduplicate.help')}</Tooltip>}
            >
              <Badge bg="secondary" pill role="button">
                ?
              </Badge>
            </OverlayTrigger>
          </InputGroup.Text>
          <Button
            variant="outline-secondary"
            disabled={!selectedCountry || holidaysStatus === STATUS_LOADING}
            onClick={this.onImportHolidays}
          >
            {t('configuration.special-dates.holidays.button')}
          </Button>
        </InputGroup>
        {countriesStatus === STATUS_ERROR && (
          <Alert variant="danger" className="mt-2 mb-0">
            {t('configuration.special-dates.holidays.countries-error')}
          </Alert>
        )}
        {this.renderHolidaysStatus()}
        <Form.Text className="text-muted mt-2">
          <Trans
            t={t}
            i18nKey="configuration.special-dates.holidays.attribution"
            components={{
              tallyfy: <a href="https://tallyfy.com/national-holidays/" target="_blank" rel="noreferrer" />,
            }}
          />
        </Form.Text>
      </Stack>
    );
  }

  render() {
    const { date, value } = this.state;
    const { t } = this.props;
    const groupedItems = this.getGroupedItems();
    const numberOfItems = Object.keys(groupedItems).length;
    return (
      <Accordion.Item eventKey="specialDates">
        <Accordion.Header>
          <Stack direction="horizontal" className="w-100">
            {t('configuration.special-dates.title')}
            <Badge bg="secondary" className="ms-auto me-3">
              {numberOfItems}
            </Badge>
          </Stack>
        </Accordion.Header>
        <Accordion.Body>
          <p>{t('configuration.special-dates.description')}</p>
          <Stack gap={2}>
            {numberOfItems > 0 ? (
              this.renderItems(groupedItems)
            ) : (
              <Alert variant="secondary" className="mb-0">
                {t('configuration.special-dates.empty')}
              </Alert>
            )}
          </Stack>
          <Stack className="mt-4">
            <Form.Label className="fw-bold mb-1">{t('configuration.special-dates.manual.heading')}</Form.Label>
            <InputGroup>
              {this.renderTypeSelect('type')}
              <FormControl
                className="flex-grow-0 date-field"
                value={date}
                onChange={this.onChange}
                type="date"
                data-field="date"
              />
              <FormControl
                placeholder={t('configuration.special-dates.placeholder')}
                value={value}
                onChange={this.onChange}
                data-field="value"
              />
              <Button variant="outline-secondary" disabled={!date || !value} onClick={this.onAddClick}>
                {t('configuration.special-dates.button.item')}
              </Button>
            </InputGroup>
          </Stack>
          {this.renderHolidaysSection()}
          <Stack className="mt-4">
            <Form.Label htmlFor="icsFile" className="fw-bold mb-1">
              {t('configuration.special-dates.upload.label')}
            </Form.Label>
            <Stack direction="horizontal" gap={2}>
              {this.renderTypeSelect('icalType')}
              <Form.Control id="icsFile" type="file" accept=".ics" onChange={this.onFileChange} />
            </Stack>
            {this.renderStatusMessage()}
          </Stack>
        </Accordion.Body>
      </Accordion.Item>
    );
  }
}

SpecialDates.propTypes = {
  year: PropTypes.number.isRequired,
  month: PropTypes.number.isRequired,
  monthCount: PropTypes.number.isRequired,
  items: PropTypes.array.isRequired,
  onAdd: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
};

export default withTranslation('app')(SpecialDates);
