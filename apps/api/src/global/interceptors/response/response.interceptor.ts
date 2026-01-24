import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
  } from '@nestjs/common';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';
import { ApiResponse, isApiResponse, PaginatedResponse } from '@global/contracts';
import { ExtensionContext } from '@global/extensions';
import { RequestHook } from 'src/global/guards/request/request.hook';
import { DatetimeProvider } from 'src/global/providers/chrono/datetime.provider';
import { PaginationContext } from 'src/global/pagination/ctx/pagination.context';

@Injectable()
export class WrapResponseInterceptor implements NestInterceptor {

  constructor(private readonly requestHook: RequestHook) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const http = context.switchToHttp();
    const req = http.getRequest<any>();

    const requestId = req.headers['x-request-id'] ?? null;
    const baseExtensions = {
      timestamp: DatetimeProvider.now(),
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

        if (Array.isArray(result)) {
          const total = PaginationContext.getTotal();
          const page = parseInt(req.query?.page as string) || 1;
          const limit = parseInt(req.query?.limit as string) || 10;
          const totalPages = Math.ceil(total / limit);
          
          return {
            success: true,
            data: {
              items: result,
              total: total,
              page: page,
              limit: limit,
              totalPages: totalPages,
            },
            extensions: { 
              meta: {
                ...baseExtensions
              },
              additional: {
                ...ExtensionContext.getAll()
              }
            }
          } satisfies PaginatedResponse<any>;
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
