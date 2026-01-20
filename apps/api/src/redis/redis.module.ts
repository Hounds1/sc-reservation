import { Global, Module } from '@nestjs/common';
import { RedisTemplate } from './redis.template';

export { RedisScript } from './redis-script';

@Global()
@Module({
  providers: [RedisTemplate],
  exports: [RedisTemplate],
})
export class RedisModule {}
