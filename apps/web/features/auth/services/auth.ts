'use server';

import { cookies } from 'next/headers';
import { ContractedApiResponse } from "@global/contracts";
import { AuthRequest, SessionResponse } from "./types";
import apiClient from "@/src/lib/api/client";

const SESSION_COOKIE_NAME = 'x-sc-session';

export const auth = async (data: AuthRequest): Promise<void> => {
    const response = await apiClient.post<ContractedApiResponse<SessionResponse>>(
        '/api/v1/public/auth',
        data
    );

    const httpStatus = response.status;
    const isSuccess = response.data.success;
    const responseData = response.data.data;
  
    if (httpStatus === 201 && isSuccess && responseData) {
        const { sessionId, sessionCreatedAt, sessionExpiresAt } = responseData;
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