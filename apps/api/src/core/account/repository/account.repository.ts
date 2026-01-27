import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaConnector } from "src/global/prisma/prisma.connector";
import { Account, mapPrismaAccountToAccount } from "../domain/account";
import { PaginatedAccountSearchRequest } from "../domain/request/account.request";
import { transformToInternalAccountDelivery } from "../domain/internal/account.internal.delivery";

@Injectable()
export class AccountRepository {

    constructor(private readonly prismaConnector: PrismaConnector) {}

    async createAccount(account: Account): Promise<Account> {
        const result = await this.prismaConnector.accounts.create({
            data: {
                name: account.name,
                email: account.email,
                display_name: account.displayName,
                password: account.password,
                role: account.role,
                status: account.status,
                created_at: account.createdAt,
            },
        });
        
        return mapPrismaAccountToAccount(result);
    }
    
    async getAccounts(request: PaginatedAccountSearchRequest): Promise<Account[]> {
        const result = await this.prismaConnector.accounts.findMany({
            skip: (request.page - 1) * request.limit,
            take: request.limit,
            orderBy: {
                created_at: 'desc',
            },
        });
        return result.map(mapPrismaAccountToAccount);
    }

    async getAccountsCount(): Promise<number> {
        return await this.prismaConnector.accounts.count();
    }

    async getAccountById(id: number): Promise<Account> {
        const result = await this.prismaConnector.accounts.findUnique({
            where: {
                account_id: id,
            },
        });

        if (!result) throw new NotFoundException('Account not found.');

        return mapPrismaAccountToAccount(result);
    }

    async getAccountWithPasswordByEmail(email: string): Promise<Account> {
        const result = await this.prismaConnector.accounts.findUnique({
            where: {
                email: email,
            }
        });

        if (!result) throw new NotFoundException('Account not found.');

        return mapPrismaAccountToAccount(result);
    }
}