import PropTypes from 'prop-types';
import React from 'react';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import Stack from 'react-bootstrap/Stack';
import { withTranslation } from 'react-i18next';

import PdfPreview from 'components/pdf-preview';

class PdfPreviewCard extends React.PureComponent {
	renderPdfPreview() {
		const { blobUrl, isGeneratingPdf, isGeneratingPreview, t } = this.props;
		return (
			<Stack direction="vertical" gap={ 3 } className="h-100">
				<PdfPreview
					blobUrl={ blobUrl }
					title={ t( 'configuration.preview.viewer-title' ) }
				/>
				<Button
					variant="secondary"
					disabled={ isGeneratingPreview || isGeneratingPdf }
					onClick={ this.handleDownload }
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
							Generating full calendar - this could take a minute or more...
						</>
					) : (
						t( 'configuration.button.download' )
					)}
				</Button>
			</Stack>
		);
	}

	renderNoPreview() {
		if ( this.props.isGeneratingPreview ) {
			return (
				<div className="h-100 d-flex align-items-center justify-content-center">
					<Spinner
						animation="border"
						role="status"
						size="sm"
						className="me-1"
					/>
					Generating preview, please wait - it can take a minute.
				</div>
			);
		}
		return (
			<Stack
				direction="vertical"
				className="h-100 d-flex align-items-center justify-content-center"
			>
				<p className="lead">
					Use the configuration form to create your personalized calendar.
				</p>
				<p>The preview will appear here.</p>
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
	isGeneratingPdf: PropTypes.bool.isRequired,
	isGeneratingPreview: PropTypes.bool.isRequired,
	onDownload: PropTypes.func.isRequired,
	t: PropTypes.func.isRequired,
};

export default withTranslation( 'app' )( PdfPreviewCard );
