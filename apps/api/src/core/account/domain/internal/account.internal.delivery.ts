import { Account } from "../account";

export class InternalAccountDelivery {
    accountId: number;
    email: string;
    password: string;
    role: string;
    status: string;
}

export function transformToInternalAccountDelivery(account: Account): InternalAccountDelivery {
    return {
        accountId: account.accountId,
        email: account.email,
        password: account.password,
        role: account.role,
        status: account.status,
    };
}