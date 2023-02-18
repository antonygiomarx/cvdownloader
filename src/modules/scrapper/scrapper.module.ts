import { Module } from '@nestjs/common';
import { ScrapperService } from '@/modules/scrapper/scrapper.service';
import { SharedModule } from '@/modules/shared/shared.module';
import { StorageModule } from '@/modules/storage/storage.module';
import { HttpModule } from '@infrastructure/http/http.module';
import { EnvironmentConfigModule } from '@infrastructure/config/environment-config/environment-config.module';

@Module({
  imports: [SharedModule, StorageModule, HttpModule, EnvironmentConfigModule],
  providers: [ScrapperService],
  exports: [ScrapperService],
})
export class ScrapperModule {}
