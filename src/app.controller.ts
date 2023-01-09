import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  welcome() {
    return {
      statusCode: 200,
      message: 'Welcome to Movies Api v1.0',
    };
  }
}
