import PropTypes from 'prop-types';
import React from 'react';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import Stack from 'react-bootstrap/Stack';
import { withTranslation } from 'react-i18next';

import PdfPreview from 'components/pdf-preview';
import PdfProgress from 'components/pdf-progress';

class PdfPreviewCard extends React.PureComponent {
	renderPdfPreview() {
		const { blobUrl, isGeneratingPdf, isGeneratingPreview, onDownload, t } =
			this.props;
		return (
			<Stack direction="vertical" className="h-100">
				<PdfPreview blobUrl={ blobUrl } title={ t( 'preview.viewer-title' ) } />
				<Stack
					direction="vertical"
					gap={ 2 }
					className="py-3 position-sticky bg-body refresh-button"
				>
					<Button
						variant="secondary"
						disabled={ isGeneratingPreview || isGeneratingPdf }
						onClick={ onDownload }
					>
						{isGeneratingPdf ? (
							<>
								<Spinner
									as="span"
									animation="border"
									size="sm"
									role="status"
									aria-hidden="true"
									className="me-1"
								/>
								{t( 'preview.generating.full' )}
							</>
						) : (
							t( 'configuration.button.download' )
						)}
					</Button>
					{isGeneratingPdf && (
						<PdfProgress expectedTime={ this.props.expectedTime } />
					)}
				</Stack>
			</Stack>
		);
	}

	renderNoPreview() {
		const { t, isGeneratingPreview } = this.props;

		if ( isGeneratingPreview ) {
			return (
				<div className="h-100 d-flex align-items-center justify-content-center">
					<Spinner
						animation="border"
						role="status"
						size="sm"
						className="me-1"
					/>
					{t( 'preview.generating.preview' )}
				</div>
			);
		}
		return (
			<Stack
				direction="vertical"
				className="h-100 d-flex align-items-center justify-content-center"
			>
				<p className="lead">{t( 'preview.empty.title' )}</p>
				<p>{t( 'preview.empty.subtitle' )}</p>
			</Stack>
		);
	}

	render() {
		const { blobUrl, isGeneratingPreview } = this.props;
		if ( blobUrl && ! isGeneratingPreview ) {
			return this.renderPdfPreview();
		}

		return this.renderNoPreview();
	}
}

PdfPreviewCard.propTypes = {
	blobUrl: PropTypes.string,
	expectedTime: PropTypes.number.isRequired,
	isGeneratingPdf: PropTypes.bool.isRequired,
	isGeneratingPreview: PropTypes.bool.isRequired,
	onDownload: PropTypes.func.isRequired,
	t: PropTypes.func.isRequired,
};

export default withTranslation( 'app' )( PdfPreviewCard );
