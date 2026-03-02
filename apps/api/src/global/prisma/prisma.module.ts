import { Module } from "@nestjs/common";
import { PrismaConnector } from "./prisma.connector";
import { TransactionManager } from "./transaction.manager";

@Module({
  providers: [PrismaConnector, TransactionManager],
  exports: [PrismaConnector, TransactionManager],
})
export class PrismaConnectorModule {}