import { Logger } from '@nestjs/common';

export abstract class UseCases {
  static USE_CASE: string;

  logger: Logger = new Logger(UseCases.name);

  protected constructor(useCase: string) {
    this.logger.debug(`Use case ${useCase} initialized!`);
  }
}
