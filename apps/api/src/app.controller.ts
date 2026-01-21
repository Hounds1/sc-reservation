import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ExtensionContext } from '@global/extensions';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    ExtensionContext.add('test', 'test');
    return this.appService.getHello();
  }
}
