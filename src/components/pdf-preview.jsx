import PropTypes from 'prop-types';

const PdfPreview = ({ blobUrl, title }) => {
  return <iframe className="w-100 flex-grow-1 min-h-0" title={title} src={blobUrl} />;
};

PdfPreview.propTypes = {
  blobUrl: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
};

export default PdfPreview;
