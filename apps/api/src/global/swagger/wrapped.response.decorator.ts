import { applyDecorators, Type } from '@nestjs/common';
import { ApiExtraModels, ApiResponse, getSchemaPath } from '@nestjs/swagger';

export function ApiWrappedResponse<T>(dataType: Type<T>) {
    return applyDecorators(
      ApiExtraModels(dataType),
      ApiResponse({
        schema: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            data: { 
              $ref: getSchemaPath(dataType),
              nullable: true,
              description: '응답 데이터'
            },
            extensions: {
              type: 'object',
              properties: {
                meta: {
                  type: 'object',
                  properties: {
                    timestamp: { type: 'number' },
                    requestId: { type: 'string', nullable: true }
                  }
                },
                additional: { type: 'object', additionalProperties: true }
              }
            }
          }
        }
      })
    );
  }

export function ApiWrappedPaginatedResponse<T>(itemType: Type<T>) {
  return applyDecorators(
    ApiExtraModels(itemType),
    ApiResponse(createWrappedPaginatedResponseSchema(itemType))
  );
}

function createWrappedPaginatedResponseSchema(itemType: Type<unknown>) {
    return {
      schema: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
          data: {
            type: 'object',
            properties: {
              items: {
                type: 'array',
                items: { $ref: getSchemaPath(itemType) },
                description: '페이지네이션된 항목 목록',
              },
              total: { type: 'number', description: '전체 개수' },
              page: { type: 'number', description: '현재 페이지' },
              limit: { type: 'number', description: '페이지당 개수' },
              totalPages: { type: 'number', description: '전체 페이지 수' },
            },
          },
          extensions: {
            type: 'object',
            properties: {
              meta: {
                type: 'object',
                properties: {
                  timestamp: { type: 'number' },
                  requestId: { type: 'string', nullable: true },
                },
              },
              additional: { type: 'object', additionalProperties: true },
            },
          },
        },
      },
    };
  }