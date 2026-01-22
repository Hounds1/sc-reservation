import {
    Injectable,
    CanActivate,
    ExecutionContext,
    HttpException,
    HttpStatus,
    Logger,
  } from '@nestjs/common';
  
  @Injectable()
  export class RateLimitGuard implements CanActivate {
    private readonly logger = new Logger(RateLimitGuard.name);
    private readonly requests = new Map<string, number[]>();
    private readonly maxRequests: number = 100;
    private readonly windowMs: number = 60000;
    private readonly enabled: boolean = true; 

    constructor(maxRequests: number, windowMs: number) {
      this.maxRequests = maxRequests;
      this.windowMs = windowMs;
    }

    private anyHeader(request: any): string | null {
      // 1. x-forwarded-for (Proxy chain support)
      const forwardedFor = request.headers['x-forwarded-for'];
      if (forwardedFor) {
        const ips = forwardedFor.split(',').map((ip: string) => ip.trim());
        if (ips.length > 0) {
          return ips[0];
        }
      }

      // 2. x-real-ip
      const realIp = request.headers['x-real-ip'];
      if (realIp) {
        return realIp;
      }

      // 3. x-client-ip
      const clientIp = request.headers['x-client-ip'];
      if (clientIp) {
        return clientIp;
      }

      // 4. x-remote-ip
      const remoteIp = request.headers['x-remote-ip'];
      if (remoteIp) {
        return remoteIp;
      }

      // 5. Express request.ip (trust proxy)
      if (request.ip) {
        return request.ip;
      }

      // 6. connection.remoteAddress (Direct connection)
      if (request.connection?.remoteAddress) {
        return request.connection.remoteAddress;
      }

      // 7. socket.remoteAddress (Socket connection)
      if (request.socket?.remoteAddress) {
        return request.socket.remoteAddress;
      }

      return null;
    }
  
    canActivate(context: ExecutionContext): boolean {
      const request = context.switchToHttp().getRequest();
      const ip = this.anyHeader(request);
      
      if (!ip) {
        if (this.enabled) {
          this.logger.warn('Client IP could not be determined. Rate limiting disabled for this request.');
          return true;
        } else {
          throw new HttpException(
            'Unable to determine client IP',
            HttpStatus.BAD_REQUEST,
          );
        }
      }

      const now = Date.now();
      const userRequests = this.requests.get(ip) || [];
      const recentRequests = userRequests.filter(
        (timestamp) => now - timestamp < this.windowMs,
      );
  
      if (recentRequests.length >= this.maxRequests) {
        this.logger.warn(`Rate limit exceeded for IP: ${ip}`);
        throw new HttpException(
          'Rate limit exceeded',
          HttpStatus.TOO_MANY_REQUESTS,
        );
      }
  
      recentRequests.push(now);
      this.requests.set(ip, recentRequests);
  
      return true;
    }

    cleanup(): void {
      const now = Date.now();
      for (const [ip, timestamps] of this.requests.entries()) {
        const recent = timestamps.filter(
          (timestamp) => now - timestamp < this.windowMs,
        );
        if (recent.length === 0) {
          this.requests.delete(ip);
        } else {
          this.requests.set(ip, recent);
        }
      }
    }
  }