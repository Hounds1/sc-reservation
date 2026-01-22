import { CanActivate, ConflictException, ExecutionContext, Injectable } from "@nestjs/common";
import { RequestHook } from "./request.hook";
import { Observable } from "rxjs";

@Injectable()
export class DuplicateRequestGuard implements CanActivate {

    constructor(private readonly requestHook: RequestHook) {}

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();
        const requestId = request.headers['x-request-id'];
        
        if (!requestId) return true;

        if (this.requestHook.tryAcquire(requestId)) {
            console.log('[Guard] Duplicate request detected');
            throw new ConflictException('Duplicate request detected');
        }

        return true;
    }
}