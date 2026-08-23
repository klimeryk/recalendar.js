import PropTypes from 'prop-types';
import React from 'react';
import Accordion from 'react-bootstrap/Accordion';
import { withTranslation } from 'react-i18next';

import { getWeekdays } from '~/lib/date';
import Itinerary from './itinerary';
import ToggleAccordionItem from './toggle-accordion-item';

export const DAY_ITINERARY_ID_PREFIX = 'day-itinerary-';

class DayItineraries extends React.PureComponent {
  renderDayItinerary = ({ full: dayOfWeek }, index) => {
    const { dayItineraries, onAdd, onChange, onCopy, onDragEnd, onRemove, onToggle } = this.props;
    return (
      <ToggleAccordionItem
        key={dayOfWeek}
        id={DAY_ITINERARY_ID_PREFIX + index}
        title={dayOfWeek}
        onToggle={onToggle}
        toggledOn={dayItineraries[index].isEnabled}
      >
        <Itinerary
          field={index.toString()}
          itinerary={dayItineraries[index].items}
          onAdd={onAdd}
          onChange={onChange}
          onDragEnd={onDragEnd}
          onRemove={onRemove}
          onCopy={onCopy}
        />
      </ToggleAccordionItem>
    );
  };

  render() {
    const { firstDayOfWeek, t } = this.props;
    return (
      <Accordion.Item eventKey="dayItineraries">
        <Accordion.Header>{t('configuration.day.title')}</Accordion.Header>
        <Accordion.Body>
          <Accordion defaultActiveKey="0">{getWeekdays(firstDayOfWeek).map(this.renderDayItinerary)}</Accordion>
        </Accordion.Body>
      </Accordion.Item>
    );
  }
}

DayItineraries.propTypes = {
  dayItineraries: PropTypes.array.isRequired,
  firstDayOfWeek: PropTypes.number.isRequired,
  onAdd: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  onCopy: PropTypes.func.isRequired,
  onDragEnd: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
  onToggle: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
};

export default withTranslation('app')(DayItineraries);
