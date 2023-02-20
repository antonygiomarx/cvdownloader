import { UseCases } from '@domain/usecases/usecases';
import { Inject } from '@nestjs/common';
import { SendTelegramMessageUseCases } from '@usecases/telegram/send-telegram-message-use.cases';
import { BotService } from '@infrastructure/bot/bot.service';
import { SendTelegramFileUseCases } from '@usecases/telegram/send-telegram-file.usecases';
import { Message } from '@domain/messaging/providers/telegram/webhook.interface';
import { ScrapperService } from '@infrastructure/scrapper/scrapper.service';
import { RegexService } from '@infrastructure/util/regex/regex.service';

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
  ];

  constructor(
    @Inject(SendTelegramMessageUseCases.USE_CASE)
    private readonly sendTelegramMessageUseCases,
    @Inject(SendTelegramFileUseCases.USE_CASE)
    private readonly sendTelegramFileUseCases,
    private readonly botService: BotService,
    private readonly scrapperService: ScrapperService,
    private readonly regexService: RegexService,
  ) {
    super(HandleTelegramMessagesUsecases.USE_CASE);
  }

  async execute(message: Message) {
    const { text } = message;

    try {
      const command = this.commands.find((com) => {
        return com.command === text || com.variants.includes(text);
      });

      if (!command) {
        const [cvUrl] = this.regexService.isUrl(text);

        if (!cvUrl)
          return await this.sendTelegramMessageUseCases
            .getInstance()
            .execute(message.chat.id.toString(), this.botService.welcome());

        await this.sendTelegramMessageUseCases
          .getInstance()
          .execute(message.chat.id, this.botService.awaitingForFile());

        const url = await this.scrapperService.scrape(cvUrl);

        if (!url) {
          this.logger.log('No file found');

          await this.sendTelegramMessageUseCases
            .getInstance()
            .execute(message.chat.id.toString(), this.botService.error());

          return 'ok';
        }

        await this.sendTelegramFileUseCases
          .getInstance()
          .execute(message.chat.id.toString(), url);
        return 'ok';
      }

      switch (command.type) {
        case 'command':
          for (const response of command.responses) {
            await this.sendTelegramMessageUseCases
              .getInstance()
              .execute(message.chat.id, response);
          }
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
