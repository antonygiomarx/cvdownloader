import { Module } from '@nestjs/common';
import { PdfService } from '@/modules/shared/pdf/pdf.service';
import { StorageModule } from '@/modules/storage/storage.module';

@Module({
  imports: [StorageModule, StorageModule],
  providers: [PdfService],
  exports: [PdfService],
})
export class SharedModule {}
