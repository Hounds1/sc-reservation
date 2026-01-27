import { AccountRepository } from "./repository/account.repository";
import { Module } from "@nestjs/common";
import { AccountService } from "./service/account.service";
import { AccountController } from "./controller/account.controller";
import { InternalAccountService } from "./service/internal.account.service";

@Module({
    imports: [],
    controllers: [AccountController],
    providers: [AccountService, InternalAccountService, AccountRepository],
    exports: [AccountService, InternalAccountService, AccountRepository],
})
export class AccountModule {}