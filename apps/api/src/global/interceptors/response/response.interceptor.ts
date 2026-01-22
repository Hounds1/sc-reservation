import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
  } from '@nestjs/common';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';
import { ApiResponse, isApiResponse } from '@global/contracts';
import { ExtensionContext } from '@global/extensions';
import { RequestHook } from 'src/global/guards/request/request.hook';

@Injectable()
export class WrapResponseInterceptor implements NestInterceptor {

  constructor(private readonly requestHook: RequestHook) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const http = context.switchToHttp();
    const req = http.getRequest<any>();

    const requestId = req.headers['x-request-id'] ?? null;
    const baseExtensions = {
      timestamp: Math.floor(Date.now() / 1000),
      requestId: requestId,
    };

    return next.handle().pipe(
      map((result: any) => {
        if (isApiResponse(result)) {
          return {
            ...result,
            extensions: {
              meta: {
                ...baseExtensions
              },
              additional: {
                ...ExtensionContext.getAll(),
                ...(result.extensions ?? {}),
              }  
            },
          } satisfies ApiResponse<any>;
        }

        return {
          success: true,
          data: result ?? null,
          extensions: { 
            meta: {
              ...baseExtensions
            },
            additional: {
              ...ExtensionContext.getAll()
            }
          }
        } satisfies ApiResponse<any>;
      }),
      finalize(() => {
        if (requestId) {
           this.requestHook.release(requestId);
        }
      }),
    );
  }
}
