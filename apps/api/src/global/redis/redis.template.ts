import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import Redis from 'ioredis';
import { RedisScript } from './redis-script';

@Injectable()
export class RedisTemplate implements OnModuleInit, OnModuleDestroy {
  private client!: Redis;

  async onModuleInit() {
    const pwd = process.env.REDIS_PASSWORD;
    
    this.client = new Redis({
      host: process.env.REDIS_HOST || '127.0.0.1',
      port: parseInt(process.env.REDIS_PORT || '6379', 10),
      ...(pwd && { password: pwd }),
    });

    this.client.on('connect', () => {
      console.log('RedisTemplate initialized.');
    });

    this.client.on('error', (err) => {
      console.error('RedisTemplate initialization failed:', err);
    });
  }

  async onModuleDestroy() {
    await this.client.quit();
  }

  getClient(): Redis {
    return this.client;
  }

  async get(key: string): Promise<string | null> {
    return this.client.get(key);
  }

  async set(key: string, value: string, ttlSeconds?: number): Promise<'OK'> {
    if (ttlSeconds) {
      return this.client.set(key, value, 'EX', ttlSeconds);
    }
    return this.client.set(key, value);
  }

  async del(key: string): Promise<number> {
    return this.client.del(key);
  }

  async exists(key: string): Promise<number> {
    return this.client.exists(key);
  }

  async keys(pattern: string): Promise<string[]> {
    return this.client.keys(pattern);
  }

  async ttl(key: string): Promise<number> {
    return this.client.ttl(key);
  }

  async expire(key: string, seconds: number): Promise<number> {
    return this.client.expire(key, seconds);
  }

  private async evalsha<T = unknown>(
    sha: string,
    keys: string[],
    args: (string | number)[],
  ): Promise<T> {
    return this.client.evalsha(
      sha,
      keys.length,
      ...keys,
      ...args.map(String),
    ) as Promise<T>;
  }

  private async scriptLoad(script: string): Promise<string> {
    return this.client.script('LOAD', script) as Promise<string>;
  }

  defineCommand(
    name: string,
    definition: { lua: string; numberOfKeys: number },
  ): void {
    this.client.defineCommand(name, definition);
  }

  async executeCommand<T = unknown>(
    name: string,
    keys: string[],
    args: (string | number)[],
  ): Promise<T> {
    return (this.client as any)[name](...keys, ...args.map(String));
  } 

  async execute<T>(
    script: RedisScript<T>,
    keys: string[],
    args: (string | number)[],
  ): Promise<T> {
    if (!script.isLoaded()) {
      const sha = await this.scriptLoad(script.lua);
      script.setSha(sha);
    }
    return this.evalsha<T>(script.getSha()!, keys, args);
  }
}
