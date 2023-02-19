import { Module } from '@nestjs/common';
import { ScrapperService } from './scrapper.service';
import { EnvironmentConfigModule } from '@infrastructure/config/environment-config/environment-config.module';
import { PdfModule } from '@infrastructure/pdf/pdf.module';
import { StorageModule } from '@infrastructure/storage/storage.module';
import { UtilModule } from '@infrastructure/util/util.module';
import { PlaywrightService } from './providers/playwright/playwright.service';

@Module({
  imports: [EnvironmentConfigModule, PdfModule, StorageModule, UtilModule],
  providers: [ScrapperService, PlaywrightService],
  exports: [ScrapperService],
})
export class ScrapperModule {}
