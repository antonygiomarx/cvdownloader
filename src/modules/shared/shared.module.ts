import { Module } from '@nestjs/common';
import { PdfService } from '@/modules/shared/pdf/pdf.service';
import { ScrapperService } from '@/modules/shared/scrapper/scrapper.service';
import { StorageModule } from '@/modules/storage/storage.module';
import { StorageService } from '@/modules/storage/storage.service';

@Module({
  imports: [StorageModule],
  controllers: [],
  providers: [PdfService, ScrapperService, StorageService],
  exports: [PdfService, ScrapperService],
})
export class SharedModule {}
