import { Logger } from '@nestjs/common';

export abstract class UseCases {
  USE_CASE: string;

  logger: Logger = new Logger(UseCases.name);

  protected constructor(useCase: string) {
    this.USE_CASE = useCase;
    this.logger.debug(`Use case ${useCase} initialized!`);
  }
}
