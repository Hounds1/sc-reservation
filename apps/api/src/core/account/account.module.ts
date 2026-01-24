import { AccountRepository } from "./repository/account.repository";
import { Module } from "@nestjs/common";
import { AccountService } from "./service/account.service";
import { AccountController } from "./controller/account.controller";

@Module({
    imports: [],
    controllers: [AccountController],
    providers: [AccountService, AccountRepository],
    exports: [AccountService, AccountRepository],
})
export class AccountModule {}