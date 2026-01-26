'use server';

import { ContractedApiResponse } from "@global/contracts";
import { CreateAccountRequest, SimpleAccountResponse } from "./types";
import apiClient from "../client";

export async function createAccount(data: CreateAccountRequest): Promise<SimpleAccountResponse> {
  const response = await apiClient.post<ContractedApiResponse<SimpleAccountResponse>>(
    '/accounts',
    data
  );

  if (response.data.success && response.data.data) {
    return response.data.data;
  }

  throw new Error('회원가입에 실패했습니다.');
}