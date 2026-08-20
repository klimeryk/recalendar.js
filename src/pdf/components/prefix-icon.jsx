import { Circle, Path, Rect, Svg } from '@react-pdf/renderer';
import PropTypes from 'prop-types';
import React from 'react';

import { getPrefixIcon, ITINERARY_PREFIX_ICON_ATTRIBUTES, ITINERARY_PREFIX_VIEW_BOX } from '~/lib/itinerary-prefixes';

const ELEMENTS = {
  circle: Circle,
  path: Path,
  rect: Rect,
};

class PrefixIcon extends React.PureComponent {
  render() {
    const { prefix, size, color, style } = this.props;
    const nodes = getPrefixIcon(prefix);
    if (!nodes) {
      return null;
    }

    return (
      <Svg width={size} height={size} viewBox={ITINERARY_PREFIX_VIEW_BOX} style={style}>
        {nodes.map(([tag, attributes], index) =>
          React.createElement(ELEMENTS[tag], {
            key: index,
            stroke: color,
            ...ITINERARY_PREFIX_ICON_ATTRIBUTES,
            ...attributes,
          }),
        )}
      </Svg>
    );
  }
}

PrefixIcon.propTypes = {
  color: PropTypes.string.isRequired,
  prefix: PropTypes.string,
  size: PropTypes.number.isRequired,
  style: PropTypes.object,
};

export default PrefixIcon;
