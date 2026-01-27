export interface CreateAccountRequest {
    email: string;
    name: string;
    password: string;
    display_name: string;
}

export interface SimpleAccountResponse {
    account_id: number;
    email: string;
    name: string;
    display_name: string;
    role: string;
    status: string;
    created_at: number;
}

export interface DetailedAccountResponse extends SimpleAccountResponse {
    updated_at: number | null;
    last_login_at: number | null;
    email_verified_at: number | null;
}