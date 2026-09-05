import PropTypes from 'prop-types';
import React from 'react';
import Card from 'react-bootstrap/Card';
import { withTranslation } from 'react-i18next';

import PdfPreviewCard from '~/components/pdf-preview-card';

class PreviewColumn extends React.PureComponent {
  render() {
    const { blobUrl, expectedTime, isGeneratingPdf, isGeneratingPreview, onDownload, t } = this.props;
    return (
      <Card className="preview-card flex-lg-grow-1 min-h-0">
        <Card.Header>
          {t('preview.title')} <small className="text-muted">{t('preview.subtitle')}</small>
        </Card.Header>
        <Card.Body className="pb-0 d-flex flex-column min-h-0">
          <PdfPreviewCard
            blobUrl={blobUrl}
            expectedTime={expectedTime}
            isGeneratingPdf={isGeneratingPdf}
            isGeneratingPreview={isGeneratingPreview}
            onDownload={onDownload}
          />
        </Card.Body>
      </Card>
    );
  }
}

PreviewColumn.propTypes = {
  blobUrl: PropTypes.string,
  expectedTime: PropTypes.number.isRequired,
  isGeneratingPdf: PropTypes.bool.isRequired,
  isGeneratingPreview: PropTypes.bool.isRequired,
  onDownload: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
};

export default withTranslation('app')(PreviewColumn);
