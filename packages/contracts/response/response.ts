// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string | {
    code: number;
    message: string;
    details?: unknown;
  };
  message?: string;
  extensions?: Record<string, any>;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data? : {
    items: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }
  extensions?: Record<string, any>;
}

export function isApiResponse<T>(obj: unknown): obj is ApiResponse<T> {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'success' in obj &&
    typeof (obj as ApiResponse<T>).success === 'boolean'
  );
}

export function isPaginatedResponse<T>(obj: unknown): obj is PaginatedResponse<T> {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'success' in obj &&
    typeof (obj as PaginatedResponse<T>).success === 'boolean'
  );
}