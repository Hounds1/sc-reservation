import { Body, Controller, Get, Param, Post, Query, UnauthorizedException } from "@nestjs/common";
import { AccountService } from "../service/account.service";
import { ApiBody, ApiOperation } from "@nestjs/swagger";
import { CreateAccountRequest, PaginatedAccountSearchRequest } from "../domain/request/account.request";
import { DetailedAccountResponse, SimpleAccountResponse } from "../domain/response/account.response";
import { ApiWrappedPaginatedResponse, ApiWrappedResponse } from "src/global/swagger/wrapped.response.decorator";
import { PublicEntrypoint } from "src/core/auth/decorators/public.entrypoint";
import { TenantInjection } from "src/global/jwt/decorators/tenant.injection.decorator";
import { jwtPayload } from "src/global/jwt/strategies/jwt.strategy";

@Controller('accounts')
export class AccountController {
    constructor(private readonly accountService: AccountService) {}

    @Post('public/join')
    @ApiOperation({ summary: 'Create a new account' })
    @ApiBody({ type: CreateAccountRequest })
    @ApiWrappedResponse(SimpleAccountResponse)
    @PublicEntrypoint()
    async createAccount(@Body() request: CreateAccountRequest): Promise<SimpleAccountResponse> {
        return this.accountService.createAccount(request);
    }

    @Get()
    @ApiOperation({ summary: 'Get all accounts' })
    @ApiWrappedResponse(SimpleAccountResponse)
    async getAccounts(
        @Query() request: PaginatedAccountSearchRequest
    ): Promise<SimpleAccountResponse[]> {
        return this.accountService.getAccounts(request);
    }

    @Get('me')
    @ApiOperation({ summary: 'Get the current account' })
    @ApiWrappedResponse(DetailedAccountResponse)
    async me(@TenantInjection() tenant: jwtPayload) : Promise<DetailedAccountResponse> {
        return this.accountService.getAccountById(tenant.accountId);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get an account by id' })
    @ApiWrappedPaginatedResponse(DetailedAccountResponse)
    async getAccountById(@Param('id') id: number): Promise<DetailedAccountResponse> {
        return this.accountService.getAccountById(id);
    }
}