import { decodePDFRawStream, PDFArray, PDFDict, PDFDocument, PDFName, PDFStream } from '@cantoo/pdf-lib';

export const ATTACHMENT_OK = 'OK';
export const ATTACHMENT_ENCRYPTED = 'ENCRYPTED';
export const ATTACHMENT_WRONG_PASSWORD = 'WRONG_PASSWORD';
export const ATTACHMENT_ERROR = 'ERROR';

function findAttachment(pdfDoc, attachmentName) {
  if (!pdfDoc.catalog.has(PDFName.of('Names'))) {
    return undefined;
  }

  const Names = pdfDoc.catalog.lookup(PDFName.of('Names'), PDFDict);
  if (!Names.has(PDFName.of('EmbeddedFiles'))) {
    return undefined;
  }

  const EmbeddedFiles = Names.lookup(PDFName.of('EmbeddedFiles'), PDFDict);
  if (!EmbeddedFiles.has(PDFName.of('Names'))) {
    return undefined;
  }

  const EFNames = EmbeddedFiles.lookup(PDFName.of('Names'), PDFArray);
  for (let idx = 0, len = EFNames.size(); idx < len; idx += 2) {
    const fileName = EFNames.lookup(idx).decodeText();
    if (fileName !== attachmentName) {
      continue;
    }

    const fileSpec = EFNames.lookup(idx + 1, PDFDict);
    const stream = fileSpec.lookup(PDFName.of('EF'), PDFDict).lookup(PDFName.of('F'), PDFStream);
    const data = decodePDFRawStream(stream).decode();
    return JSON.parse(new TextDecoder('utf-8').decode(data));
  }

  return undefined;
}

// https://github.com/Hopding/pdf-lib/issues/534#issuecomment-662756915
export async function getJsonAttachment(pdfData, attachmentName, password) {
  let pdfDoc;
  try {
    pdfDoc = await PDFDocument.load(pdfData, {
      updateMetadata: false,
      ignoreEncryption: true,
      ...(password !== undefined && { password }),
    });
  } catch {
    return { status: password !== undefined ? ATTACHMENT_WRONG_PASSWORD : ATTACHMENT_ERROR };
  }

  if (pdfDoc.isEncrypted && password === undefined) {
    return { status: ATTACHMENT_ENCRYPTED };
  }

  let data;
  try {
    data = findAttachment(pdfDoc, attachmentName);
  } catch {
    return { status: ATTACHMENT_ERROR };
  }

  if (!data) {
    return { status: ATTACHMENT_ERROR };
  }

  return { status: ATTACHMENT_OK, data };
}
