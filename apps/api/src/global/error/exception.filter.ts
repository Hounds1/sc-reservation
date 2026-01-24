import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
    Logger,
  } from '@nestjs/common';
  import { Request, Response } from 'express';
  import { ContractedApiResponse } from '@global/contracts';
  
  @Catch()
  export class HttpExceptionFilter implements ExceptionFilter {
    private readonly logger = new Logger(HttpExceptionFilter.name);
  
    catch(exception: unknown, host: ArgumentsHost) {
      const ctx = host.switchToHttp();
      const response = ctx.getResponse<Response>();
      const request = ctx.getRequest<Request>();
      const requestId = request.headers['x-request-id'] || 'N/A';
  
      const status =
        exception instanceof HttpException
          ? exception.getStatus()
          : HttpStatus.INTERNAL_SERVER_ERROR;
  
      const message =
        exception instanceof HttpException
          ? exception.getResponse()
          : 'Internal server error';
  
      const errorResponse: ContractedApiResponse<null> = {
        success: false,
        data: null,
        error: {
          code: status,
          message: typeof message === 'string' ? message : (message as any).message || 'Unknown error',
          ...(typeof message === 'object' && 'error' in message ? { details: message } : {}),
        },
        extensions: {
          meta: {
            timestamp: Math.floor(Date.now() / 1000),
            requestId: requestId as string,
          },
          additional: {},
        },
      };
  
      this.logger.error(
        `[${requestId}] ${request.method} ${request.url} - ${status} - ${JSON.stringify(message)}`,
        exception instanceof Error ? exception.stack : undefined,
      );
  
      response.status(status).json(errorResponse);
    }
  }