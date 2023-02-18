import { Module } from '@nestjs/common';
import { ProvidersModule } from './providers/providers.module';

@Module({
  imports: [ProvidersModule],
  exports: [ProvidersModule],
})
export class MessagingModule {}
