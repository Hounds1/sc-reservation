import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ExtensionContext } from '@global/extensions';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async getHello(): Promise<Test> {
    ExtensionContext.add('test', 'test');
    ExtensionContext.add('additionalExtension', 'additionalExtension');
    const hello = this.appService.getHello();
    return {
      test: hello,
    };
  }
}

type Test = {
  test: string;
}