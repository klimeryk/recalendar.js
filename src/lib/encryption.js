import { PDFDocument } from '@cantoo/pdf-lib';

export async function encryptPdf(blob, userPassword) {
  const pdfDoc = await PDFDocument.load(await blob.arrayBuffer(), { updateMetadata: false });
  pdfDoc.encrypt({ userPassword });
  const bytes = await pdfDoc.save();
  return new Blob([bytes], { type: 'application/pdf' });
}
