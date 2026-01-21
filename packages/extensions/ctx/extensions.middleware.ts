import { Injectable, NestMiddleware } from '@nestjs/common';
import { ExtensionContext } from './extensions.context';

@Injectable()
export class ExtensionMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    ExtensionContext.run(next);
  }
}