import { RedisScript } from "src/global/redis/redis-script";

export const CreateSessionScript = new RedisScript<string>(
  `
  redis.call('SET', KEYS[1], ARGV[1], 'EX', ARGV[2])
  redis.call('SADD', KEYS[2], KEYS[1])
  redis.call('EXPIRE', KEYS[2], ARGV[2])
  return 'OK'
  `,
  2
);
