'use server';

import { cookies } from 'next/headers';
import { ContractedApiResponse } from "@global/contracts";
import { AuthRequest, SessionResponse, User } from "./types";
import apiClient from "@/lib/api/client";

const SESSION_COOKIE_NAME = 'x-sc-session';

export const auth = async (data: AuthRequest): Promise<void> => {
    const response = await apiClient.post<ContractedApiResponse<SessionResponse>>(
        '/api/v1/auth/public/login',
        data
    );

    const httpStatus = response.status;
    const isSuccess = response.data.success;
    const responseData = response.data.data;
  
    if (httpStatus === 201 && isSuccess && responseData) {
        const { sessionId, sessionExpiresAt } = responseData;
        const cookieStore = await cookies();

        const sessionMaxAge = Math.max(0, Math.floor(sessionExpiresAt - (Date.now() / 1000)));

        cookieStore.set(SESSION_COOKIE_NAME, sessionId, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: sessionMaxAge,
            path: '/',
        });
    } else {
        throw new Error('로그인 실패');
    }
};

// 세션 존재 여부 확인
export const checkSession = async (): Promise<boolean> => {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    return !!sessionId;
};

// 로그아웃 (서버 세션 무효화 후 쿠키 삭제)
export const logout = async (): Promise<void> => {
    const cookieStore = await cookies();
    
    try {
        // 서버에 세션 무효화 요청
        await apiClient.delete('/api/v1/auth/invalidate');
    } catch (error) {
        // 서버 요청 실패해도 클라이언트 쿠키는 삭제
        console.error('서버 세션 무효화 실패:', error);
    } finally {
        // 클라이언트 쿠키 삭제
        cookieStore.delete(SESSION_COOKIE_NAME);
    }
};

// 현재 로그인한 사용자 정보 조회
export const getMe = async (): Promise<User | null> => {
    try {
        const response = await apiClient.get<ContractedApiResponse<User>>(
            '/api/v1/accounts/me'
        );
        
        if (response.data.success && response.data.data) {
            return response.data.data;
        }
        return null;
    } catch {
        return null;
    }
};
