import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import PropTypes from 'prop-types';
import Button from 'react-bootstrap/Button';
import Dropdown from 'react-bootstrap/Dropdown';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import FormControl from 'react-bootstrap/FormControl';
import InputGroup from 'react-bootstrap/InputGroup';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';
import Stack from 'react-bootstrap/Stack';
import { Trans, useTranslation } from 'react-i18next';

import PrefixIcon from '~/components/prefix-icon';
import { ITINERARY_PREFIXES, normalizePrefix } from '~/lib/itinerary-prefixes';
import { ITINERARY_ITEM, ITINERARY_LINES, ITINERARY_NEW_PAGE } from '~/lib/itinerary-utils';

const DATE_FORMATS_URL = 'https://day.js.org/docs/en/display/format#list-of-all-available-formats';

function SortableItineraryRow(props) {
  const { t } = useTranslation('app');
  const { id, type, value, field, onChange } = props;
  const prefix = normalizePrefix(props.prefix);
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const reorderLabel = t('configuration.items-list.button.reorder');

  function prefixLabel(option) {
    return option ? t(`configuration.itinerary.prefix.icon.${option}`) : t('configuration.itinerary.prefix.none');
  }

  function renderPrefixPicker() {
    const selectedLabel = t('configuration.itinerary.prefix.selected', {
      name: prefixLabel(prefix),
    });
    return (
      <Dropdown>
        <Dropdown.Toggle variant="outline-secondary" aria-label={selectedLabel} title={selectedLabel}>
          <PrefixIcon prefix={prefix} />
        </Dropdown.Toggle>
        <Dropdown.Menu className="prefix-menu">
          {ITINERARY_PREFIXES.map((option) => (
            <Dropdown.Item
              as="button"
              type="button"
              key={option || 'none'}
              value={option}
              active={option === prefix}
              onClick={onChange}
              data-id={id}
              data-type={type}
              data-field={field}
              data-property="prefix"
              aria-label={prefixLabel(option)}
              title={prefixLabel(option)}
            >
              <PrefixIcon prefix={option} />
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown>
    );
  }

  function renderDateTemplateHelp() {
    const label = t('configuration.itinerary.dateTemplate.label');
    const popover = (
      <Popover>
        <Popover.Header as="h3">{t('configuration.itinerary.dateTemplate.title')}</Popover.Header>
        <Popover.Body>
          <Trans
            i18nKey="configuration.itinerary.dateTemplate.description"
            t={t}
            components={[
              <code key="simple">{'{{date}}'}</code>,
              <code key="formatted">{'{{date:YYYY-MM-DD}}'}</code>,
              <a key="formats" href={DATE_FORMATS_URL} target="_blank" rel="noreferrer" />,
            ]}
          />
        </Popover.Body>
      </Popover>
    );

    return (
      <OverlayTrigger trigger="click" placement="top" overlay={popover} rootClose>
        <Button variant="outline-secondary" aria-label={label} title={label}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            width="16"
            height="16"
            fill="currentColor"
            className="bi bi-info-circle"
            viewBox="0 0 16 16"
          >
            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
            <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" />
          </svg>
        </Button>
      </OverlayTrigger>
    );
  }

  function renderItem() {
    return (
      <FormControl
        placeholder={t('configuration.itinerary.placeholder.item')}
        value={value}
        onChange={onChange}
        data-id={id}
        data-type={ITINERARY_ITEM}
        data-field={field}
        data-property="value"
        required
      />
    );
  }

  function renderNewPage() {
    return <InputGroup.Text className="flex-grow-1">{t('configuration.itinerary.placeholder.page')}</InputGroup.Text>;
  }

  function renderLines() {
    return (
      <FloatingLabel className="flex-grow-1" controlId={id} label={t('configuration.itinerary.placeholder.lines')}>
        <FormControl
          placeholder={t('configuration.itinerary.placeholder.lines')}
          type="number"
          min={1}
          max={50}
          value={value}
          onChange={onChange}
          data-id={id}
          data-type={ITINERARY_LINES}
          data-field={field}
          data-property="value"
          required
        />
      </FloatingLabel>
    );
  }

  function renderRemoveButton() {
    return (
      <Button variant="outline-danger" onClick={props.onRemove} data-id={id} data-field={field}>
        {t('configuration.itinerary.button.remove')}
      </Button>
    );
  }

  function renderRow() {
    switch (type) {
      case ITINERARY_ITEM:
        return renderItem();

      case ITINERARY_NEW_PAGE:
        return renderNewPage();

      case ITINERARY_LINES:
      default:
        return renderLines();
    }
  }

  return (
    <Stack direction="horizontal" ref={setNodeRef} style={style}>
      <Button
        className="grab-handle"
        variant="link"
        aria-label={reorderLabel}
        title={reorderLabel}
        {...attributes}
        {...listeners}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
          width="16"
          height="16"
          fill="currentColor"
          className="bi bi-grip-vertical"
          viewBox="0 0 16 16"
        >
          <path d="M7 2a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM7 5a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM7 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm-3 3a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm-3 3a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" />
        </svg>
      </Button>
      <InputGroup>
        {type !== ITINERARY_NEW_PAGE && renderPrefixPicker()}
        {renderRow()}
        {type === ITINERARY_ITEM && renderDateTemplateHelp()}
        {renderRemoveButton()}
      </InputGroup>
    </Stack>
  );
}

SortableItineraryRow.propTypes = {
  field: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
  prefix: PropTypes.string,
  type: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

export default SortableItineraryRow;
