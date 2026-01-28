import { ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Reflector } from '@nestjs/core';
import { Observable } from "rxjs";
import { IS_PUBLIC_ENTRYPOINT } from "../../../core/auth/decorators/public.entrypoint";
import { RequestHook } from "src/global/guards/request/request.hook";

@Injectable()
export class JwtGuard extends AuthGuard('jwt') {
    constructor(private readonly reflector: Reflector, private readonly RequestHook: RequestHook) {
        super();
    }

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();
        const requestId = request.headers['x-request-id']; 
        
        /*
          토큰 검증을 하기 전에 public 엔드포인트 검증부터 해야합니다.
          아니면 토큰 없다고 예외 던집니다.
        */
        const isPublicEntrypoint = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_ENTRYPOINT, [
            context.getHandler(),
            context.getClass(),
        ]);

        if (isPublicEntrypoint) {
            this.releaseLockIfNecessary(requestId);
            return true;
        } 
        
        const token = request.headers.authorization?.split(' ')[1];
        if (!token) {
            this.releaseLockIfNecessary(requestId);
            throw new UnauthorizedException('No token provided');
        }

        return super.canActivate(context);
    }

    releaseLockIfNecessary(requestId: string) {
        if (requestId) this.RequestHook.release(requestId);
    }
}