import { Module } from '@nestjs/common';
import { PdfService } from '@infrastructure/pdf/pdf.service';

@Module({
  providers: [PdfService],
  exports: [PdfService],
})
export class PdfModule {}
