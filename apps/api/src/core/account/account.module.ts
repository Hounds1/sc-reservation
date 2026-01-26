import { AccountRepository } from "./repository/account.repository";
import { Module } from "@nestjs/common";
import { AccountService } from "./service/account.service";
import { AccountController } from "./controller/account.controller";
import { AccountInternalService } from "./service/account.internal.service";

@Module({
    imports: [],
    controllers: [AccountController],
    providers: [AccountService, AccountInternalService, AccountRepository],
    exports: [AccountService, AccountInternalService, AccountRepository],
})
export class AccountModule {}