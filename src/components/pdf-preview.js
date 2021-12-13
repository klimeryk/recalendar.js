import PropTypes from 'prop-types';
import React from 'react';

const PdfPreview = ( { blobUrl, title } ) => {
	return <iframe title={ title } src={ blobUrl } width="100%" height="100%" />;
};

PdfPreview.propTypes = {
	blobUrl: PropTypes.string.isRequired,
	title: PropTypes.string.isRequired,
};

export default PdfPreview;
