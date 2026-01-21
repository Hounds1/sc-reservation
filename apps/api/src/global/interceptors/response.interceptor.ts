import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
  } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponse, isApiResponse } from '@global/contracts';
import { ExtensionContext } from '@global/extensions';

@Injectable()
export class WrapResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const http = context.switchToHttp();
    const req = http.getRequest<any>();

    const baseExtensions = {
      timestamp: Math.floor(Date.now() / 1000),
      requestId: req.headers['x-request-id'] ?? null,
    };

    return next.handle().pipe(
      map((result: any) => {
        if (isApiResponse(result)) {
          return {
            ...result,
            extensions: {
              ...baseExtensions,
              ...ExtensionContext.getAll(),
              ...(result.extensions ?? {}),
            },
          } satisfies ApiResponse<any>;
        }

        return {
          success: true,
          data: result ?? null,
          extensions: { 
            ...baseExtensions,
            ...ExtensionContext.getAll()
          }
        } satisfies ApiResponse<any>;
      }),
    );
  }
}
