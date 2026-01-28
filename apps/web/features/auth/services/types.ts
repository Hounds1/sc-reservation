export type AuthRequest = {
    email: string;
    password: string;
}

export type SessionResponse = {
    sessionId: string;
    sessionCreatedAt: number;
    sessionExpiresAt: number;
}