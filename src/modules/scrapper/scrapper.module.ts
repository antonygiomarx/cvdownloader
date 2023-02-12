import { Module } from '@nestjs/common';
import { ScrapperService } from '@/modules/scrapper/scrapper.service';
import { SharedModule } from '@/modules/shared/shared.module';
import { StorageModule } from '@/modules/storage/storage.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [SharedModule, StorageModule, HttpModule],
  providers: [ScrapperService],
  exports: [ScrapperService],
})
export class ScrapperModule {}
