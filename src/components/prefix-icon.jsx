import PropTypes from 'prop-types';
import React from 'react';

import {
	ITINERARY_PREFIX_ICON_ATTRIBUTES,
	ITINERARY_PREFIX_VIEW_BOX,
	getPrefixIcon,
} from '~/lib/itinerary-prefixes';

export default function PrefixIcon( { prefix, size = 16 } ) {
	const nodes = getPrefixIcon( prefix ) || [];

	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width={ size }
			height={ size }
			viewBox={ ITINERARY_PREFIX_VIEW_BOX }
			stroke="currentColor"
			{ ...ITINERARY_PREFIX_ICON_ATTRIBUTES }
		>
			{nodes.map( ( [ tag, attributes ], index ) =>
				React.createElement( tag, { key: index, ...attributes } ),
			)}
		</svg>
	);
}

PrefixIcon.propTypes = {
	prefix: PropTypes.string,
	size: PropTypes.number,
};
