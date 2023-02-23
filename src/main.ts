import { NestFactory } from '@nestjs/core';
import { AppModule } from '@app.module';
import { Logger, ValidationPipe } from '@nestjs/common';

export class App {
  static readonly logger = new Logger(App.name);

  static readonly port = process.env.PORT || 3000;

  static async start() {
    const app = await NestFactory.create(AppModule);

    app.setGlobalPrefix('api');

    app.enableCors();

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    await app.listen(this.port);
  }
}

App.start()
  .then(() => {
    App.logger.log(`Server started on port ${App.port}`);
  })
  .catch((error) => {
    App.logger.error(error);
  });
