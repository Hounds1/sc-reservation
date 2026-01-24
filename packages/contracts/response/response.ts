// API Response Types
export interface ContractedApiResponse<T> {
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

export interface ContractedPaginatedResponse<T> {
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

export function isApiResponse<T>(obj: unknown): obj is ContractedApiResponse<T> {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'success' in obj &&
    typeof (obj as ContractedApiResponse<T>).success === 'boolean'
  );
}

export function isPaginatedResponse<T>(obj: unknown): obj is ContractedPaginatedResponse<T> {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'success' in obj &&
    typeof (obj as ContractedPaginatedResponse<T>).success === 'boolean'
  );
}