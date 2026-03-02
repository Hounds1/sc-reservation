'use server';

import { ContractedApiResponse, ContractedPaginatedResponse } from "@global/contracts";
import { CafeDetailResponse, CafeResponse } from "./types";
import apiClient from "@/lib/api/client";

export async function getAllCafes(): Promise<CafeResponse[]> {
    const response = await apiClient.get<ContractedPaginatedResponse<CafeResponse>>(
        '/api/v1/cafes/public/list'
    );

    if (response.data.success && response.data.data) {
        return response.data.data.items;
    }

    throw new Error('카페 목록을 불러오는데 실패했습니다.');
}

export async function getCafeDetail(cafeId: number): Promise<CafeDetailResponse> {
    const response = await apiClient.get<ContractedApiResponse<CafeDetailResponse>>(
        `/api/v1/cafes/public/${cafeId}`
    );

    if (response.data.success && response.data.data) {
        return response.data.data;
    }

    throw new Error('카페 정보를 불러오는데 실패했습니다.');
}
