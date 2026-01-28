'use server';

import { cookies } from 'next/headers';
import { ContractedApiResponse } from "@global/contracts";
import { AuthRequest, AuthResponse } from "./types";
import apiClient from "@/src/lib/api/client";

const ACCESS_TOKEN_COOKIE = 'accessToken';
const REFRESH_TOKEN_COOKIE = 'refreshToken';

export const auth = async (data: AuthRequest): Promise<void> => {
    const response = await apiClient.post<ContractedApiResponse<AuthResponse>>(
        '/api/v1/public/auth',
        data
    );

    const httpStatus = response.status;
    const isSuccess = response.data.success;
    const responseData = response.data.data;
  
    if (httpStatus === 201 && isSuccess && responseData) {
        const { accessToken, refreshToken, accessTokenExpiresAt, refreshTokenExpiresAt } = responseData;
        const cookieStore = await cookies();

        const accessTokenMaxAge = Math.max(0, Math.floor(accessTokenExpiresAt - (Date.now() / 1000)));
        const refreshTokenMaxAge = Math.max(0, Math.floor(refreshTokenExpiresAt - (Date.now() / 1000)));

        cookieStore.set(ACCESS_TOKEN_COOKIE, accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: accessTokenMaxAge,
            path: '/',
        });
        cookieStore.set(REFRESH_TOKEN_COOKIE, refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: refreshTokenMaxAge,
            path: '/',
        });
    } else {
        throw new Error('로그인 실패');
    }
};