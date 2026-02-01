export class SessionKeyBuilder {
    static build(accountId: number): string {
        return `account:${accountId}:session`;
    }
}