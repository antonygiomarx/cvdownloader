import { Module } from '@nestjs/common';
import { HttpModule as HttpModuleProvider } from '@nestjs/axios';
import { HttpService } from './http.service';

@Module({
  providers: [HttpService],
  imports: [HttpModuleProvider],
  exports: [HttpService],
})
export class HttpModule {}
