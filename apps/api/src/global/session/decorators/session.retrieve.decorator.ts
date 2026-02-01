import { SESSION_COOKIE_NAME } from "@global/contracts";
import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { Request } from 'express';

type RequestWithCookies = Request & { cookies?: Record<string, string> };

export const RetrieveSession = createParamDecorator(
    (data: string | undefined, ctx: ExecutionContext) => {
      const request = ctx.switchToHttp().getRequest<RequestWithCookies>();
      const sessionKey = request.cookies[SESSION_COOKIE_NAME];
      
      return sessionKey;
    }
  );