import { Body, Controller, Post } from "@nestjs/common";
import { AccountService } from "../service/account.service";
import { ApiBody, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { CreateAccountRequest } from "../domain/request/account.request";
import { SimpleAccountResponse } from "../domain/response/account.response";

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
}