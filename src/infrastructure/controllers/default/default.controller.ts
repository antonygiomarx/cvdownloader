import { Controller, Get } from '@nestjs/common';

@Controller()
export class DefaultController {
  @Get()
  getHello(): string {
    return 'Hello World!';
  }
}
