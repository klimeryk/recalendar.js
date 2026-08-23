import PropTypes from 'prop-types';
import React from 'react';
import Accordion from 'react-bootstrap/Accordion';

import Itinerary from './itinerary';

function ItineraryAccordionItem({ field, itinerary, onAdd, onChange, onDragEnd, onRemove, title }) {
  return (
    <Accordion.Item eventKey={field}>
      <Accordion.Header>{title}</Accordion.Header>
      <Accordion.Body>
        <Itinerary
          field={field}
          itinerary={itinerary}
          onAdd={onAdd}
          onChange={onChange}
          onDragEnd={onDragEnd}
          onRemove={onRemove}
        />
      </Accordion.Body>
    </Accordion.Item>
  );
}

ItineraryAccordionItem.propTypes = {
  field: PropTypes.string.isRequired,
  itinerary: PropTypes.array.isRequired,
  onAdd: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  onDragEnd: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
};

export default React.memo(ItineraryAccordionItem);
