import { Body, Controller, Get, Param, Post, Query, UnauthorizedException } from "@nestjs/common";
import { AccountService } from "../service/account.service";
import { ApiBody, ApiOperation, ApiParam, ApiQuery, ApiTags } from "@nestjs/swagger";
import { CreateAccountRequest, PaginatedAccountSearchRequest } from "../domain/request/account.request";
import { DetailedAccountResponse, SimpleAccountResponse } from "../domain/response/account.response";
import { ApiWrappedPaginatedResponse, ApiWrappedResponse } from "src/global/swagger/wrapped.response.decorator";
import { PublicEntrypoint } from "src/core/auth/decorators/public.entrypoint";
import { TenantInjection } from "src/global/jwt/decorators/tenant.injection.decorator";
import { jwtPayload } from "src/global/jwt/strategies/jwt.strategy";

@Controller('accounts')
@ApiTags('회원')
export class AccountController {
    constructor(private readonly accountService: AccountService) {}

    @Post('public/join')
    @ApiOperation({ summary: '회원 가입' })
    @ApiBody({ type: CreateAccountRequest })
    @ApiWrappedResponse(SimpleAccountResponse)
    @PublicEntrypoint()
    async createAccount(@Body() request: CreateAccountRequest): Promise<SimpleAccountResponse> {
        return this.accountService.createAccount(request);
    }

    @Get()
    @ApiOperation({ summary: '모든 회원 조회' })
    @ApiQuery({ type: PaginatedAccountSearchRequest })
    @ApiWrappedResponse(SimpleAccountResponse)
    async getAccounts(
        @Query() request: PaginatedAccountSearchRequest
    ): Promise<SimpleAccountResponse[]> {
        return this.accountService.getAccounts(request);
    }

    @Get('me')
    @ApiOperation({ summary: '로그인 중인 회원 조회'})
    @ApiWrappedResponse(DetailedAccountResponse)
    async me(@TenantInjection() tenant: jwtPayload) : Promise<DetailedAccountResponse> {
        return this.accountService.getAccountById(tenant.accountId);
    }

    @Get(':id')
    @ApiOperation({ summary: 'ID로 회원 조회' })
    @ApiParam({ name: 'id'
        , type: Number
        , description: '회원 ID'
        , required: true
    })
    @ApiWrappedPaginatedResponse(DetailedAccountResponse)
    async getAccountById(@Param('id') id: number): Promise<DetailedAccountResponse> {
        return this.accountService.getAccountById(id);
    }
}