// apps/web/lib/api/client.ts
import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { ContractedApiResponse } from '@global/contracts';


const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// 요청 인터셉터 (요청 전 처리)
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터 (응답 후 처리)
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError<ContractedApiResponse<unknown>>) => {
    // 에러 처리
    if (error.response) {
      // 서버에서 응답이 온 경우
      const errorData = error.response.data?.error;
      const errorMessage = 
        (typeof errorData === 'object' && errorData !== null ? errorData.message : errorData) ||
        error.response.data?.message ||
        error.message ||
        '요청 처리 중 오류가 발생했습니다.';
      
      return Promise.reject(new Error(errorMessage));
    } else if (error.request) {
      return Promise.reject(new Error('서버에 연결할 수 없습니다.'));
    } else {
      return Promise.reject(error);
    }
  }
);

export default apiClient;