import { SESSION_COOKIE_NAME } from "@global/contracts";
import { CanActivate, ConflictException, ExecutionContext, Injectable } from "@nestjs/common";
import { Request } from "express";

type RequestWithCookies = Request & { cookies?: Record<string, string> };

@Injectable()
export class ContainingSessionGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest<RequestWithCookies>();
        const sessionKey = request.cookies[SESSION_COOKIE_NAME];
        
        if (sessionKey) throw new ConflictException('Already logged in. Please logout and try again.');

        return true;
    }
}