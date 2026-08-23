import PropTypes from 'prop-types';
import Accordion from 'react-bootstrap/Accordion';

import ToggleAccordionItem from './toggle-accordion-item';

function ToggleSection({ children, defaultActiveKey, description, id, onToggle, title, toggledOn }) {
  return (
    <ToggleAccordionItem id={id} title={title} onToggle={onToggle} toggledOn={toggledOn}>
      <p className="mb-0">{description}</p>
      <Accordion className="mt-3" defaultActiveKey={defaultActiveKey}>
        {children}
      </Accordion>
    </ToggleAccordionItem>
  );
}

ToggleSection.propTypes = {
  children: PropTypes.node.isRequired,
  defaultActiveKey: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  onToggle: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  toggledOn: PropTypes.bool.isRequired,
};

export default ToggleSection;
