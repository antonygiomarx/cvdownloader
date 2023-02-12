import { Module } from '@nestjs/common';
import { BotService } from './bot.service';

@Module({
  providers: [BotService],
  imports: [],
})
export class BotModule {}
