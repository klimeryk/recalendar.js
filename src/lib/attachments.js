import {
	PDFDocument,
	PDFName,
	PDFDict,
	PDFArray,
	PDFStream,
	decodePDFRawStream,
} from 'pdf-lib';

// https://github.com/Hopding/pdf-lib/issues/534#issuecomment-662756915
export async function getJsonAttachment( pdfData, attachmentName ) {
	try {
		const pdfDoc = await PDFDocument.load( pdfData, {
			updateMetadata: false,
		} );

		if ( ! pdfDoc.catalog.has( PDFName.of( 'Names' ) ) ) {
			return undefined;
		}

		const Names = pdfDoc.catalog.lookup( PDFName.of( 'Names' ), PDFDict );
		if ( ! Names.has( PDFName.of( 'EmbeddedFiles' ) ) ) {
			return undefined;
		}

		const EmbeddedFiles = Names.lookup( PDFName.of( 'EmbeddedFiles' ), PDFDict );
		if ( ! EmbeddedFiles.has( PDFName.of( 'Names' ) ) ) {
			return undefined;
		}

		const EFNames = EmbeddedFiles.lookup( PDFName.of( 'Names' ), PDFArray );
		for ( let idx = 0, len = EFNames.size(); idx < len; idx += 2 ) {
			const fileName = EFNames.lookup( idx ).decodeText();
			if ( fileName !== attachmentName ) {
				continue;
			}

			const fileSpec = EFNames.lookup( idx + 1, PDFDict );
			const stream = fileSpec
				.lookup( PDFName.of( 'EF' ), PDFDict )
				.lookup( PDFName.of( 'F' ), PDFStream );
			const data = decodePDFRawStream( stream ).decode();
			return JSON.parse( new TextDecoder( 'utf-8' ).decode( data ) );
		}
	} catch ( exception ) {
		return undefined;
	}

	return undefined;
}
