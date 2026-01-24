import { ApiProperty } from "@nestjs/swagger";
import { Account } from "../account";

export class SimpleAccountResponse {
    @ApiProperty({
        description: 'The ID of the account',
        example: 1,
    })
    account_id: number;
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
    display_name: string;
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
    created_at: number;
}

export class DetailedAccountResponse extends SimpleAccountResponse {
    @ApiProperty({
        description: 'The update date of the account',
        example: 1716796800,
    })
    updated_at: number | null;
    @ApiProperty({
        description: 'The last login date of the account',
        example: 1716796800,
    })
    last_login_at: number | null;
    @ApiProperty({
        description: 'The email verified date of the account',
        example: 1716796800,
    })
    email_verified_at: number | null;
}

export function transformToSimpleResponse(account: Account): SimpleAccountResponse {
    return {
        account_id: account.account_id,
        email: account.email,
        name: account.name,
        display_name: account.display_name,
        role: account.role,
        status: account.status,
        created_at: account.created_at,
    };
}