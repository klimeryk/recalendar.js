import PropTypes from 'prop-types';
import React from 'react';

export default function ExternalLink( { url, children } ) {
	return (
		<a href={ url } target="_blank" rel="noopener noreferrer">
			{children}
		</a>
	);
}

ExternalLink.propTypes = {
	children: PropTypes.element,
	url: PropTypes.string.isRequired,
};
