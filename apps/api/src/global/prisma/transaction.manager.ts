import { Injectable } from '@nestjs/common';
import { PrismaConnector } from './prisma.connector';
import { TransactionContext } from './transaction.context';

@Injectable()
export class TransactionManager {
    constructor(private readonly prisma: PrismaConnector) {}

    async run<T>(fn: () => Promise<T>): Promise<T> {
        return this.prisma.$transaction(async (tx) => {
            return TransactionContext.run(tx, fn);
        });
    }
}
