import { AsyncLocalStorage } from 'async_hooks';
import { PrismaClient } from '../../../generated/prisma/client';

export type TransactionClient = Parameters<Parameters<PrismaClient['$transaction']>[0]>[0];

const storage = new AsyncLocalStorage<TransactionClient>();

export class TransactionContext {
    static run<T>(tx: TransactionClient, fn: () => Promise<T>): Promise<T> {
        return storage.run(tx, fn);
    }

    static getClient(): TransactionClient | undefined {
        return storage.getStore();
    }
}
