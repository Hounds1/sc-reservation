import { cookies } from 'next/headers';
import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { ContractedApiResponse } from '@global/contracts';
import { SESSION_COOKIE_NAME } from '@global/contracts';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    try {
      const cookieStore = await cookies();
      const sessionId = cookieStore.get(SESSION_COOKIE_NAME)?.value;
      if (sessionId) {
        config.headers[SESSION_COOKIE_NAME] = sessionId;
      }
    } catch {
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError<ContractedApiResponse<unknown>>) => {
    if (error.response) {
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