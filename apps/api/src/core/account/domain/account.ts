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

export function mapPrismaAccountToAccount(prismaAccount: {
    account_id: bigint;
    email: string;
    password: string;
    name: string;
    display_name: string;
    role: string;
    status: string;
    created_at: bigint;
    updated_at: bigint | null;
    last_login_at: bigint | null;
    email_verified_at: bigint | null;
  }): Account {
    return {
      account_id: Number(prismaAccount.account_id),
      email: prismaAccount.email,
      password: '',
      name: prismaAccount.name,
      display_name: prismaAccount.display_name,
      role: prismaAccount.role,
      status: prismaAccount.status,
      created_at: Number(prismaAccount.created_at),
      updated_at: prismaAccount.updated_at ? Number(prismaAccount.updated_at) : null,
      last_login_at: prismaAccount.last_login_at ? Number(prismaAccount.last_login_at) : null,
      email_verified_at: prismaAccount.email_verified_at ? Number(prismaAccount.email_verified_at) : null,
    };
  }