import { Module } from "@nestjs/common";
import { PrismaConnector } from "./prisma.connector";

@Module({
  providers: [PrismaConnector],
  exports: [PrismaConnector],
})
export class PrismaConnectorModule {}