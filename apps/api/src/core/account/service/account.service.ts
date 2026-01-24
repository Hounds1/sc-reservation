import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { AccountRepository } from "../repository/account.repository";
import { SimpleAccountResponse, transformToSimpleResponse } from "../domain/response/account.response";
import { CreateAccountRequest, PaginatedAccountSearchRequest } from "../domain/request/account.request";
import { hashPassword, transformToEntity } from "../domain/account";
import { PaginationContext } from "src/global/pagination/ctx/PaginationContext";

@Injectable()
export class AccountService {

    constructor(private readonly accountRepository: AccountRepository) {}

    async createAccount(request: CreateAccountRequest): Promise<SimpleAccountResponse> {
        const account = transformToEntity(request);
        await hashPassword(account);
        
        const result = await this.accountRepository.createAccount(account);
        
        if (!result) throw new InternalServerErrorException('Failed to create account');

        return transformToSimpleResponse(result);
    }

    async getAccounts(request: PaginatedAccountSearchRequest): Promise<SimpleAccountResponse[]> {
        const result = await this.accountRepository.getAccounts(request);
        const count = await this.accountRepository.getAccountsCount();

        PaginationContext.setTotal(count);
        return result.map(transformToSimpleResponse);
    }
}