'use server';

import { ContractedPaginatedResponse } from "@global/contracts";
import { CafeResponse } from "./types";
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
