export type AuthRequest = {
    email: string;
    password: string;
}

export type SessionResponse = {
    sessionId: string;
    sessionCreatedAt: number;
    sessionExpiresAt: number;
}

export type User = {
    accountId: number;
    email: string;
    name: string;
    displayName: string;
    role: string;
    status: string;
    createdAt: number;
    updatedAt: number | null;
    lastLoginAt: number | null;
    emailVerifiedAt: number | null;
}
