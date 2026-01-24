import { AccountRepository } from "./repository/account.repository";
import { Global, Module } from "@nestjs/common";
import { AccountService } from "./service/account.service";
import { AccountController } from "./controller/account.controller";

@Global()   
@Module({
    imports: [],
    controllers: [AccountController],
    providers: [AccountService, AccountRepository],
    exports: [AccountService, AccountRepository],
})
export class AccountModule {}