import { ApiProperty } from "@nestjs/swagger";
import { Account } from "../account";

export class SimpleAccountResponse {
    @ApiProperty({
        description: 'The ID of the account',
        example: 1,
    })
    accountId: number;
    @ApiProperty({
        description: 'The email of the account',
        example: 'test@example.com',
    })
    email: string;
    @ApiProperty({
        description: 'The name of the account',
        example: 'John Doe',
    })
    name: string;
    @ApiProperty({
        description: 'The display name of the account',
        example: 'John Doe',
    })
    displayName: string;
    @ApiProperty({
        description: 'The role of the account',
        example: 'USER',
    })
    role: string;
    @ApiProperty({
        description: 'The status of the account',
        example: 'ACTIVE',
    })
    status: string;
    @ApiProperty({
        description: 'The creation date of the account',
        example: 1716796800,
    })
    createdAt: number;
}

export class DetailedAccountResponse extends SimpleAccountResponse {
    @ApiProperty({
        description: 'The update date of the account',
        example: 1716796800,
    })
    updatedAt: number | null;
    @ApiProperty({
        description: 'The last login date of the account',
        example: 1716796800,
    })
    lastLoginAt: number | null;
    @ApiProperty({
        description: 'The email verified date of the account',
        example: 1716796800,
    })
    emailVerifiedAt: number | null;
}

export function transformToSimpleResponse(account: Account): SimpleAccountResponse {
    return {
        accountId: account.accountId,
        email: account.email,
        name: account.name,
        displayName: account.displayName,
        role: account.role,
        status: account.status,
        createdAt: account.createdAt,
    };
}

export function transformToDetailedResponse(account: Account): DetailedAccountResponse {
    return {
        ...transformToSimpleResponse(account),
        updatedAt: account.updatedAt,
        lastLoginAt: account.lastLoginAt,
        emailVerifiedAt: account.emailVerifiedAt,
    };
}