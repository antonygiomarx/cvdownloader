import { Injectable } from '@nestjs/common';

@Injectable()
export class PdfService {
  private readonly hummus = require('hummus');
  private readonly memoryStreams = require('memory-streams');

  async combine(pdfs: Buffer[]): Promise<Express.Multer.File> {
    let combinedPdf = pdfs[0];

    for (let i = 1; i < pdfs.length; i++) {
      combinedPdf = await this.join(combinedPdf, pdfs[i]);
    }

    const filename = new Date().getTime() + '.pdf';

    if (!combinedPdf || !filename || !combinedPdf || !combinedPdf?.byteLength)
      throw new Error('Error during PDF combination');

    return {
      buffer: combinedPdf,
      originalname: filename,
      mimetype: 'application/pdf',
      size: combinedPdf.byteLength || 0,
      filename,
    } as Express.Multer.File;
  }

  private async join(pdf1: Buffer, pdf2: Buffer): Promise<Buffer> {
    const outStream = new this.memoryStreams.WritableStream();

    try {
      const firstPDFStream = new this.hummus.PDFRStreamForBuffer(pdf1);
      const secondPDFStream = new this.hummus.PDFRStreamForBuffer(pdf2);

      const pdfWriter = this.hummus.createWriterToModify(
        firstPDFStream,
        new this.hummus.PDFStreamForResponse(outStream),
      );
      pdfWriter.appendPDFPagesFromPDF(secondPDFStream);
      pdfWriter.end();
      const newBuffer = outStream.toBuffer();
      outStream.end();

      return newBuffer;
    } catch (e) {
      outStream.end();
      throw new Error('Error during PDF combination: ' + e.message);
    }
  }
}
