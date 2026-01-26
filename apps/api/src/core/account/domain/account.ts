import { DatetimeProvider } from "src/global/providers/chrono/datetime.provider";
import { CreateAccountRequest } from "./request/account.request";
import * as bcrypt from 'bcrypt';

export class Account {
    accountId: number;
    email: string;
    password: string;
    name: string;
    displayName: string;
    role: string;
    status: string;
    createdAt: number;
    updatedAt: number | null;
    lastLoginAt: number | null;
    emailVerifiedAt: number | null;
}

export function transformToEntity(request: CreateAccountRequest): Account {
    return {
        accountId: null,
        email: request.email,
        password: request.password,
        name: request.name,
        displayName: request.displayName,
        role: 'USER',
        status: 'ACTIVE',
        createdAt: DatetimeProvider.now(),
        updatedAt: null,
        lastLoginAt: null,
        emailVerifiedAt: null,
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
      accountId: Number(prismaAccount.account_id),
      email: prismaAccount.email,
      password:prismaAccount.password,
      name: prismaAccount.name,
      displayName: prismaAccount.display_name,
      role: prismaAccount.role,
      status: prismaAccount.status,
      createdAt: Number(prismaAccount.created_at),
      updatedAt: prismaAccount.updated_at ? Number(prismaAccount.updated_at) : null,
      lastLoginAt: prismaAccount.last_login_at ? Number(prismaAccount.last_login_at) : null,
      emailVerifiedAt: prismaAccount.email_verified_at ? Number(prismaAccount.email_verified_at) : null,
    };
  }