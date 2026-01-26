import { Injectable } from "@nestjs/common";
import { AccountRepository } from "../repository/account.repository";
import { InternalAccountDelivery, transformToInternalAccountDelivery } from "../domain/internal/account.internal.delivery";

@Injectable()
export class AccountInternalService {
    constructor(private readonly accountRepository: AccountRepository) {}

    async internalAccountDelivery(email: string): Promise<InternalAccountDelivery> {
        const account = await this.accountRepository.getAccountWithPasswordByEmail(email);
        return transformToInternalAccountDelivery(account);
    }
}