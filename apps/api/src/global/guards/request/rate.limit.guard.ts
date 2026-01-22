import {
    Injectable,
    CanActivate,
    ExecutionContext,
    HttpException,
    HttpStatus,
  } from '@nestjs/common';
  
  @Injectable()
  export class RateLimitGuard implements CanActivate {
    private readonly requests = new Map<string, number[]>();
    private readonly maxRequests: number;
    private readonly windowMs: number;
  
    constructor(maxRequests: number = 100, windowMs: number = 60000) {
      this.maxRequests = maxRequests;
      this.windowMs = windowMs;
    }
  
    canActivate(context: ExecutionContext): boolean {
      const request = context.switchToHttp().getRequest();
      const ip = request.ip || request.connection.remoteAddress;
      const now = Date.now();
  
      const userRequests = this.requests.get(ip) || [];
      const recentRequests = userRequests.filter(
        (timestamp) => now - timestamp < this.windowMs,
      );
  
      if (recentRequests.length >= this.maxRequests) {
        throw new HttpException(
          'Rate limit exceeded',
          HttpStatus.TOO_MANY_REQUESTS,
        );
      }
  
      recentRequests.push(now);
      this.requests.set(ip, recentRequests);
  
      return true;
    }
  }