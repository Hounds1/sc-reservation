import { DatetimeProvider } from "src/global/providers/chrono/datetime.provider";
import { CreateAccountRequest } from "./request/account.request";
import * as bcrypt from 'bcrypt';

export class Account {
    account_id: number;
    email: string;
    password: string;
    name: string;
    display_name: string;
    role: string;
    status: string;
    created_at: number;
    updated_at: number | null;
    last_login_at: number | null;
    email_verified_at: number | null;
}

export function transformToEntity(request: CreateAccountRequest): Account {
    return {
        account_id: null,
        email: request.email,
        password: request.password,
        name: request.name,
        display_name: request.display_name,
        role: 'USER',
        status: 'ACTIVE',
        created_at: DatetimeProvider.now(),
        updated_at: null,
        last_login_at: null,
        email_verified_at: null,
    }
}

export async function hashPassword(account: Account): Promise<void> {
    account.password = await bcrypt.hash(account.password, 10);
}