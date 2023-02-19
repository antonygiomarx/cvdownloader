import { UseCases } from '@domain/usecases/usecases';
import { RegexUtil } from '@modules/util/regex.util';
import { Inject } from '@nestjs/common';
import { SendTelegramMessageUseCases } from '@usecases/telegram/send-telegram-message-use.cases';
import { BotService } from '@infrastructure/bot/bot.service';
import { ScrapperService } from '@modules/scrapper/scrapper.service';
import { SendTelegramFileUseCases } from '@usecases/telegram/send-telegram-file.usecases';
import { Message } from '@domain/messaging/providers/telegram/telegram.interface';

export class HandleTelegramMessagesUsecases extends UseCases {
  static USE_CASE = 'HandleTelegramMessages';

  private readonly commands = [
    {
      command: '/start',
      responses: [this.botService.welcome()],
      variants: ['hello'],
      type: 'command',
    },
    {
      command: '/help',
      responses: [this.botService.help()],
      variants: ['ayuda', 'help'],
      type: 'command',
    },
    {
      command: RegexUtil.url,
      responses: ['Estamos trabajando en ello, por favor espera un momento.'],
      variants: [],
      type: 'regex',
    },
  ];

  constructor(
    @Inject(SendTelegramMessageUseCases.USE_CASE)
    private readonly sendTelegramMessageUseCases,
    @Inject(SendTelegramFileUseCases.USE_CASE)
    private readonly sendTelegramFileUseCases,
    private readonly botService: BotService,
    private readonly scrapperService: ScrapperService,
  ) {
    super(HandleTelegramMessagesUsecases.USE_CASE);
  }

  async execute(message: Message) {
    const { text } = message;

    try {
      const command = this.commands.find((com) => {
        return (
          com.command === text ||
          com.variants.includes(text) ||
          text.match(com.command)
        );
      });

      if (!command)
        return await this.sendTelegramMessageUseCases
          .getInstance()
          .execute(message.chat.id.toString(), this.botService.welcome());

      switch (command.type) {
        case 'command':
          for (const response of command.responses) {
            await this.sendTelegramMessageUseCases
              .getInstance()
              .execute(message.chat.id, response);
          }
          return 'ok';

        case 'regex':
          const [url] = text.match(RegexUtil.url);
          const path = await this.scrapperService.scrape(url);

          if (!path) {
            this.logger.log('No file found');

            await this.sendTelegramMessageUseCases
              .getInstance()
              .execute(message.chat.id.toString(), this.botService.error());

            return 'ok';
          }

          await this.sendTelegramFileUseCases
            .getInstance()
            .execute(message.chat.id.toString(), path);
          return 'ok';
      }
    } catch (error) {
      this.logger.error(error);

      await this.sendTelegramMessageUseCases
        .getInstance()
        .execute(message.chat.id.toString(), this.botService.error());

      return 'ok';
    }
  }
}
