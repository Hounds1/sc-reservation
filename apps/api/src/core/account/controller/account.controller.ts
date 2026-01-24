import { Body, Controller, Get, Param, Post, Query } from "@nestjs/common";
import { AccountService } from "../service/account.service";
import { ApiBody, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { CreateAccountRequest, PaginatedAccountSearchRequest } from "../domain/request/account.request";
import { DetailedAccountResponse, SimpleAccountResponse } from "../domain/response/account.response";

@Controller('accounts')
export class AccountController {
    constructor(private readonly accountService: AccountService) {}

    @Post()
    @ApiOperation({ summary: 'Create a new account' })
    @ApiBody({ type: CreateAccountRequest })
    @ApiResponse({ type: SimpleAccountResponse })
    async createAccount(@Body() request: CreateAccountRequest): Promise<SimpleAccountResponse> {
        return this.accountService.createAccount(request);
    }

    @Get()
    @ApiOperation({ summary: 'Get all accounts' })
    @ApiResponse({ type: [SimpleAccountResponse] })
    async getAccounts(
        @Query() request: PaginatedAccountSearchRequest
    ): Promise<SimpleAccountResponse[]> {
        return this.accountService.getAccounts(request);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get an account by id' })
    @ApiResponse({ type: SimpleAccountResponse })
    async getAccountById(@Param('id') id: number): Promise<DetailedAccountResponse> {
        return this.accountService.getAccountById(id);
    }
}