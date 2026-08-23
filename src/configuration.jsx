import dayjs from 'dayjs/esm';
import { saveAs } from 'file-saver';
import i18n, { changeLanguage } from 'i18next';
import PropTypes from 'prop-types';
import React from 'react';
import Accordion from 'react-bootstrap/Accordion';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Spinner from 'react-bootstrap/Spinner';
import Stack from 'react-bootstrap/Stack';
import { withTranslation } from 'react-i18next';

import PdfProgress from '~/components/pdf-progress';
import PreviewColumn from '~/components/preview-column';
import CalendarSettings from '~/configuration-form/calendar-settings';
import ConfigurationSelector from '~/configuration-form/configuration-selector';
import DayItineraries, { DAY_ITINERARY_ID_PREFIX } from '~/configuration-form/day-itineraries';
import DeviceSettings from '~/configuration-form/device-settings';
import ItemsList from '~/configuration-form/items-list';
import ItineraryAccordionItem from '~/configuration-form/itinerary-accordion-item';
import LineSettings from '~/configuration-form/line-settings';
import PasswordSettings from '~/configuration-form/password-settings';
import SpecialDates from '~/configuration-form/special-dates';
import ToggleSection from '~/configuration-form/toggle-section';
import { CUSTOM, getPageProperties, getSidebarOffset } from '~/lib/device-utils';
import { ITINERARY_NO_PREFIX } from '~/lib/itinerary-prefixes';
import { parseItineraryProperty } from '~/lib/itinerary-utils';
import { addItem, cloneItems, moveItem, removeItem, updateItem } from '~/lib/list-utils';
import { createPdfGenerator } from '~/lib/pdf-generator';
import { isHorizontalSidebar, SIDEBAR_LEFT, SIDEBAR_RIGHT } from '~/lib/sidebar-utils';
import PdfConfig, { hydrateFromObject } from '~/pdf/config';

import 'bootstrap/dist/css/bootstrap.min.css';
import '~/theme.css';
import './app.css';

class Configuration extends React.PureComponent {
  state = {
    isGeneratingPdf: false,
    isGeneratingPreview: false,
    blobUrl: null,
    lastPreviewTime: 10000,
    lastFullTime: null,
    password: '',
    isPasswordEnabledInPreview: true,
    ...hydrateFromObject(this.props.initialState),
  };

  constructor(props) {
    super(props);

    this.pdfGenerator = createPdfGenerator();

    this.itemHandlers = {
      onAdd: this.handleItemAdd,
      onChange: this.handleListChange,
      onDragEnd: this.handleListDragEnd,
      onRemove: this.handleListRemove,
    };
    this.itineraryHandlers = {
      onAdd: this.handleItineraryAdd,
      onChange: this.handleListChange,
      onDragEnd: this.handleListDragEnd,
      onRemove: this.handleListRemove,
    };
    this.dayItineraryHandlers = {
      onAdd: this.handleDayItineraryAdd,
      onChange: this.handleDayItineraryChange,
      onCopy: this.handleDayItineraryCopy,
      onDragEnd: this.handleDayItineraryDragEnd,
      onRemove: this.handleDayItineraryRemove,
      onToggle: this.handleDayItineraryToggle,
    };
  }

  componentDidMount() {
    i18n.on('languageChanged', this.handleLanguageChange);
  }

  componentWillUnmount() {
    i18n.off('languageChanged', this.handleLanguageChange);
  }

  componentDidUpdate(_prevProps, prevState) {
    if (prevState.blobUrl && prevState.blobUrl !== this.state.blobUrl) {
      // Each refresh generates a new blob - and it will be kept in the memory
      // until the window is refreshed/unloaded. To keep memory consumption low
      // lets explicitly release the stale blob.
      // See https://developer.mozilla.org/en-US/docs/Web/API/URL/revokeObjectURL
      URL.revokeObjectURL(prevState.blobUrl);
    }
  }

  updateList(field, updater) {
    this.setState((prev) => ({ [field]: updater(prev[field]) }));
  }

  updateDayItinerary(field, updater) {
    const index = Number(field);
    this.setState((prev) => ({
      dayItineraries: prev.dayItineraries.map((day, dayIndex) => (dayIndex === index ? updater(day) : day)),
    }));
  }

  handleConfigChange = (newConfig, password) => {
    this.setState({ ...hydrateFromObject(newConfig), ...(password && { password }) });
    changeLanguage(newConfig.language);
  };

  handleLanguageChange = () => {
    dayjs.updateLocale(i18n.language, {
      weekStart: this.state.firstDayOfWeek,
    });
  };

  handleFieldChange = (event) => {
    let targetId = event.target.id;

    let value = event.target.type !== 'checkbox' ? event.target.value : event.target.checked;
    if (event.target.type === 'number' || event.target.dataset.type === 'number') {
      value = Number(value);
    }

    if (targetId === 'resolutionX' || targetId === 'resolutionY') {
      value = targetId === 'resolutionX' ? [value, this.state.pageSize[1]] : [this.state.pageSize[0], value];
      targetId = 'pageSize';
    }

    this.setState({ [targetId]: value });

    switch (event.target.id) {
      case 'firstDayOfWeek':
        this.handleFirstDayOfWeekChange(value);
        break;

      case 'device':
        this.handleDeviceChange(value);
        break;

      case 'isLeftHanded':
        this.handleLeftHandedChange(value);
        break;
    }
  };

  handleDeviceChange = (device) => {
    if (device !== CUSTOM) {
      const { dpi, pageSize } = getPageProperties(device);
      const newState = { dpi, pageSize };
      if (this.isSidebarEnabled()) {
        newState.sidebarOffset = getSidebarOffset(device);
      }

      this.setState(newState);
      return;
    }
  };

  handleLeftHandedChange = (isLeftHanded) => {
    if (!isHorizontalSidebar(this.state.sidebarPosition)) {
      return;
    }

    this.setState({
      sidebarPosition: isLeftHanded ? SIDEBAR_RIGHT : SIDEBAR_LEFT,
    });
  };

  handleSidebarToggle = (event) => {
    if (!event.target.checked) {
      this.setState({ sidebarOffset: 0 });
      return;
    }

    this.setState((prev) => ({
      sidebarOffset: getSidebarOffset(prev.device),
      sidebarPosition: prev.isLeftHanded ? SIDEBAR_RIGHT : SIDEBAR_LEFT,
    }));
  };

  isSidebarEnabled() {
    return this.state.sidebarOffset > 0;
  }

  handleFirstDayOfWeekChange = (newFirstDayOfWeek) => {
    dayjs.updateLocale(i18n.language, {
      weekStart: newFirstDayOfWeek,
    });

    const newFirstDayOfWeekIndex = this.state.dayItineraries.findIndex(this.isDayOfWeek(newFirstDayOfWeek));
    if (newFirstDayOfWeekIndex === -1) {
      return;
    }

    const dayItinerariesReordered = [
      ...this.state.dayItineraries.slice(newFirstDayOfWeekIndex),
      ...this.state.dayItineraries.slice(0, newFirstDayOfWeekIndex),
    ];

    this.setState({ dayItineraries: dayItinerariesReordered });
  };

  isDayOfWeek = (dayOfWeek) => {
    return (item) => item.dayOfWeek === dayOfWeek;
  };

  handleToggle = (event) => {
    this.setState({ [event.target.id]: event.target.checked });
  };

  handleWeekendChange = (event) => {
    const dayOfWeek = Number(event.target.dataset.index);
    const newWeekendDays = [...this.state.weekendDays];
    const indexInArray = newWeekendDays.indexOf(dayOfWeek);
    if (event.target.checked) {
      if (indexInArray === -1) {
        newWeekendDays.push(dayOfWeek);
      }
    } else if (indexInArray !== -1) {
      newWeekendDays.splice(indexInArray, 1);
    }

    this.setState({ weekendDays: newWeekendDays });
  };

  handleItemAdd = ({ currentTarget: { dataset } }) => {
    this.updateList(dataset.field, (items) => addItem(items, ''));
  };

  handleItineraryAdd = ({ currentTarget: { dataset } }) => {
    this.updateList(dataset.field, (items) =>
      addItem(items, { type: dataset.type, value: '', prefix: ITINERARY_NO_PREFIX }),
    );
  };

  handleListChange = ({ currentTarget: { dataset, value } }) => {
    const { field, id, type, property = 'value' } = dataset;
    this.updateList(field, (items) =>
      updateItem(items, id, { [property]: parseItineraryProperty(type, property, value) }),
    );
  };

  handleListRemove = ({ currentTarget: { dataset } }) => {
    this.updateList(dataset.field, (items) => removeItem(items, dataset.id));
  };

  handleListDragEnd = ({ field, newId, oldId }) => {
    this.updateList(field, (items) => moveItem(items, oldId, newId));
  };

  handleDayItineraryAdd = ({ currentTarget: { dataset } }) => {
    this.updateDayItinerary(dataset.field, (day) => ({
      ...day,
      items: addItem(day.items, { type: dataset.type, value: '', prefix: ITINERARY_NO_PREFIX }),
    }));
  };

  handleDayItineraryChange = ({ currentTarget: { dataset, value } }) => {
    const { field, id, type, property = 'value' } = dataset;
    this.updateDayItinerary(field, (day) => ({
      ...day,
      items: updateItem(day.items, id, { [property]: parseItineraryProperty(type, property, value) }),
    }));
  };

  handleDayItineraryRemove = ({ currentTarget: { dataset } }) => {
    this.updateDayItinerary(dataset.field, (day) => ({ ...day, items: removeItem(day.items, dataset.id) }));
  };

  handleDayItineraryDragEnd = ({ field, newId, oldId }) => {
    this.updateDayItinerary(field, (day) => ({ ...day, items: moveItem(day.items, oldId, newId) }));
  };

  handleDayItineraryToggle = ({ target: { checked, id } }) => {
    this.updateDayItinerary(id.replace(DAY_ITINERARY_ID_PREFIX, ''), (day) => ({ ...day, isEnabled: checked }));
  };

  handleDayItineraryCopy = ({ currentTarget: { dataset } }) => {
    const sourceIndex = Number(dataset.field);
    this.setState((prev) => {
      const source = prev.dayItineraries[sourceIndex];
      return {
        dayItineraries: prev.dayItineraries.map((day, index) =>
          index === sourceIndex ? day : { ...day, isEnabled: source.isEnabled, items: cloneItems(source.items) },
        ),
      };
    });
  };

  handleSpecialDateAdd = (newSpecialDate) => {
    this.updateList('specialDates', (items) => addItem(items, newSpecialDate));
  };

  getWorkerMessage(isPreview) {
    return {
      isPreview,
      language: i18n.language,
      password: this.state.password,
      isPasswordEnabledInPreview: this.state.isPasswordEnabledInPreview,
      ...hydrateFromObject(this.state),
    };
  }

  handlePreview = async (event) => {
    event.preventDefault();
    this.setState({ isGeneratingPreview: true });

    const { blob, duration } = await this.pdfGenerator.generate(this.getWorkerMessage(true));
    this.setState({
      blobUrl: URL.createObjectURL(blob),
      isGeneratingPreview: false,
      lastPreviewTime: duration,
    });
  };

  handleDownload = async () => {
    this.setState({ isGeneratingPdf: true });

    const { blob, duration } = await this.pdfGenerator.generate(this.getWorkerMessage(false));
    this.setState({ isGeneratingPdf: false, lastFullTime: duration });
    saveAs(blob, 'recalendar.pdf');
  };

  renderConfigurationForm() {
    const { t } = this.props;
    const { isGeneratingPdf, isGeneratingPreview } = this.state;
    return (
      <Form onSubmit={this.handlePreview}>
        <Accordion defaultActiveKey="start" className="my-3">
          <Accordion.Item eventKey="start">
            <Accordion.Header>{t('configuration.selector.label')}</Accordion.Header>
            <Accordion.Body>
              <ConfigurationSelector onConfigChange={this.handleConfigChange} />
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="general">
            <Accordion.Header>{t('configuration.general.label')}</Accordion.Header>
            <Accordion.Body>
              <DeviceSettings
                device={this.state.device}
                dpi={this.state.dpi}
                pageSize={this.state.pageSize}
                fontFamily={this.state.fontFamily}
                isLeftHanded={this.state.isLeftHanded}
                sidebarPosition={this.state.sidebarPosition}
                sidebarOffset={this.state.sidebarOffset}
                onChange={this.handleFieldChange}
                onSidebarToggle={this.handleSidebarToggle}
              />
              <CalendarSettings
                year={this.state.year}
                month={this.state.month}
                firstDayOfWeek={this.state.firstDayOfWeek}
                monthCount={this.state.monthCount}
                weekendDays={this.state.weekendDays}
                onChange={this.handleFieldChange}
                onWeekendChange={this.handleWeekendChange}
              />
              <LineSettings
                lineStyle={this.state.lineStyle}
                lineHeightPixels={this.state.lineHeightPixels}
                lineSpacingPixels={this.state.lineSpacingPixels}
                lineOpacity={this.state.lineOpacity}
                onChange={this.handleFieldChange}
              />
              <PasswordSettings
                password={this.state.password}
                isPasswordEnabledInPreview={this.state.isPasswordEnabledInPreview}
                onChange={this.handleFieldChange}
              />
            </Accordion.Body>
          </Accordion.Item>
          <SpecialDates
            year={this.state.year}
            month={this.state.month}
            monthCount={this.state.monthCount}
            items={this.state.specialDates}
            onAdd={this.handleSpecialDateAdd}
            onRemove={this.handleListRemove}
          />
          <ToggleSection
            id="isYearNotesEnabled"
            title={t('configuration.year.notes.title')}
            description={t('configuration.year.notes.description')}
            toggledOn={this.state.isYearNotesEnabled}
            onToggle={this.handleToggle}
            defaultActiveKey="yearNotesItinerary"
          >
            <ItineraryAccordionItem
              field="yearNotesItinerary"
              title={t('configuration.year.notes.itinerary.title')}
              itinerary={this.state.yearNotesItinerary}
              {...this.itineraryHandlers}
            />
          </ToggleSection>
          <ToggleSection
            id="isMonthOverviewEnabled"
            title={t('configuration.month.title')}
            description={t('configuration.month.description')}
            toggledOn={this.state.isMonthOverviewEnabled}
            onToggle={this.handleToggle}
            defaultActiveKey="habits"
          >
            <ItemsList
              field="habits"
              title={t('configuration.month.habits.title')}
              items={this.state.habits}
              {...this.itemHandlers}
            />
            <ItineraryAccordionItem
              field="monthItinerary"
              title={t('configuration.month.itinerary.title')}
              itinerary={this.state.monthItinerary}
              {...this.itineraryHandlers}
            />
          </ToggleSection>
          <ToggleSection
            id="isWeekOverviewEnabled"
            title={t('configuration.week.title')}
            description={t('configuration.week.description')}
            toggledOn={this.state.isWeekOverviewEnabled}
            onToggle={this.handleToggle}
            defaultActiveKey="todos"
          >
            <ItemsList
              field="todos"
              title={t('configuration.week.todos.title')}
              items={this.state.todos}
              {...this.itemHandlers}
            />
          </ToggleSection>
          <DayItineraries
            firstDayOfWeek={this.state.firstDayOfWeek}
            dayItineraries={this.state.dayItineraries}
            {...this.dayItineraryHandlers}
          />
          <ToggleSection
            id="isWeekRetrospectiveEnabled"
            title={t('configuration.week.retrospective.title')}
            description={t('configuration.week.retrospective.description')}
            toggledOn={this.state.isWeekRetrospectiveEnabled}
            onToggle={this.handleToggle}
            defaultActiveKey="weekRetrospectiveItinerary"
          >
            <ItineraryAccordionItem
              field="weekRetrospectiveItinerary"
              title={t('configuration.week.retrospective.itinerary.title')}
              itinerary={this.state.weekRetrospectiveItinerary}
              {...this.itineraryHandlers}
            />
          </ToggleSection>
        </Accordion>
        <Stack direction="vertical" gap={2} className="pt-3 position-sticky bg-body refresh-button">
          <Button variant="primary" className="w-100" disabled={isGeneratingPreview || isGeneratingPdf} type="submit">
            {isGeneratingPreview ? (
              <>
                <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-1" />
                {t('configuration.button.generating')}
              </>
            ) : (
              t('configuration.button.refresh')
            )}
          </Button>
          {isGeneratingPreview && <PdfProgress expectedTime={this.state.lastPreviewTime} />}
          <Form.Text className="text-muted pb-3">{t('configuration.generation-description')}</Form.Text>
        </Stack>
      </Form>
    );
  }

  render() {
    return (
      <Container className="h-100" fluid>
        <Row className="h-100">
          <Col>{this.renderConfigurationForm()}</Col>
          <Col>
            <PreviewColumn
              blobUrl={this.state.blobUrl}
              expectedTime={this.state.lastFullTime || this.state.monthCount * this.state.lastPreviewTime}
              isGeneratingPdf={this.state.isGeneratingPdf}
              isGeneratingPreview={this.state.isGeneratingPreview}
              onDownload={this.handleDownload}
            />
          </Col>
        </Row>
      </Container>
    );
  }
}

Configuration.propTypes = {
  initialState: PropTypes.instanceOf(PdfConfig).isRequired,
  t: PropTypes.func.isRequired,
};

export default withTranslation(['app'])(Configuration);
