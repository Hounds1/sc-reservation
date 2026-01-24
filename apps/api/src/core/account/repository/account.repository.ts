import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaConnector } from "src/global/prisma/prisma.connector";
import { Account, mapPrismaAccountToAccount } from "../domain/account";
import { PaginatedAccountSearchRequest } from "../domain/request/account.request";

@Injectable()
export class AccountRepository {

    constructor(private readonly prismaConnector: PrismaConnector) {}

    async createAccount(account: Account): Promise<Account> {
        const result = await this.prismaConnector.accounts.create({
            data: {
                name: account.name,
                email: account.email,
                display_name: account.display_name,
                password: account.password,
                role: account.role,
                status: account.status,
                created_at: account.created_at,
            },
        });
        
        return {
            account_id: Number(result.account_id),
            email: result.email,
            password: result.password,
            name: result.name,
            display_name: result.display_name,
            role: result.role,
            status: result.status,
            created_at: Number(result.created_at),
            updated_at: result.updated_at ? Number(result.updated_at) : null,
            last_login_at: result.last_login_at ? Number(result.last_login_at) : null,
            email_verified_at: result.email_verified_at ? Number(result.email_verified_at) : null,
        };
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

        if (!result) {
            throw new NotFoundException('Account not found.');
        }

        return mapPrismaAccountToAccount(result);
    }
}