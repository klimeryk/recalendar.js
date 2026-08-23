import PropTypes from 'prop-types';
import React from 'react';
import Card from 'react-bootstrap/Card';
import { withTranslation } from 'react-i18next';

import PdfPreviewCard from '~/components/pdf-preview-card';

class PreviewColumn extends React.PureComponent {
  render() {
    const { blobUrl, expectedTime, isGeneratingPdf, isGeneratingPreview, onDownload, t } = this.props;
    return (
      <div className="pt-3 pb-3 position-sticky top-0 vh-100">
        <Card className="h-100">
          <Card.Header>
            {t('preview.title')} <small className="text-muted">{t('preview.subtitle')}</small>
          </Card.Header>
          <Card.Body className="pb-0">
            <PdfPreviewCard
              blobUrl={blobUrl}
              expectedTime={expectedTime}
              isGeneratingPdf={isGeneratingPdf}
              isGeneratingPreview={isGeneratingPreview}
              onDownload={onDownload}
            />
          </Card.Body>
        </Card>
      </div>
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
